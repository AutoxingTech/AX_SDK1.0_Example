<template>
  <div class="content_box">
    <h1>{{ msg }}</h1>
    <div class="mode_box">
      <div>{{$t('sprayerControl')}}：</div>
      <div class="mode_item"><span class="mode_desc">{{$t('sprayerControlTitle')}}</span></div>
    </div>
    <div class="mode_box">
      <div>{{$t('sprayerControlVerify')}}：</div>
      <div class="result_banner">{{result}}</div>
    </div>
    <div class="mode_box tools_banner">
      <div class="btn_tools bg_btn" @click="openSprayer(1);">{{$t('sprayer1')}}</div>
      <div class="btn_tools bg_btn" @click="openSprayer(2);">{{$t('sprayer2')}}</div>
      <div class="btn_tools bg_btn" @click="openSprayer(3);">{{$t('sprayer3')}}</div>
      <div class="btn_tools bg_btn" @click="openSprayer(4);">{{$t('sprayer4')}}</div>
      <div class="btn_tools bg_btn" @click="openSprayer(5);">{{$t('sprayer5')}}</div>
      <div class="btn_blue bg_btn" @click="closeSprayer();">{{$t('sprayerClose')}}</div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line standard/object-curly-even-spacing
import { AXRobot as AXRobotProd, AppMode as AppModeProd} from '@autoxing/robot-js-sdk'
// eslint-disable-next-line standard/object-curly-even-spacing
import { AXRobot as AXRobotDev, AppMode as AppModeDev} from '@autoxing/robot-js-sdk-dev'

export default {
  name: 'sprayer',
  props: {
    showLoading: {
      type: Function,
      default: null
    },
    hideLoading: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      msg: 'Welcome to AutoXing Robot SDK1.0',
      result: '',
      axRobot: null
    }
  },
  mounted () {
  },
  methods: {
    async init () {
      if (this.axRobot) {
        this.axRobot.destroy()
      }
      this.showLoading()
      if (window.Configs.mode === 1 || window.Configs.mode === '1') {
        this.axRobot = new AXRobotProd(window.Configs.appId, window.Configs.appSecret, AppModeProd.WAN_APP, window.Configs.globalServicePath, window.Configs.globalWsPath)
      } else if (window.Configs.mode === -1 || window.Configs.mode === '-1') {
        this.axRobot = new AXRobotDev(window.Configs.appId, window.Configs.appSecret, AppModeDev.WAN_APP)
      } else {
        this.axRobot = new AXRobotProd(window.Configs.appId, window.Configs.appSecret, AppModeProd.WAN_APP)
      }
      try {
        let isOk = await this.axRobot.init()
        if (isOk) {
          let res = await this.axRobot.connectRobot({
            robotId: window.Configs.robotId
          })
          if (res.errCode === 0) {
            this.result = 'Connection succeeded, robot ID is ' + res.robotId
          }
        }
      } catch (e) {
        this.result = e.errText
      }
      this.hideLoading()
    },
    async openSprayer (gear) {
      this.showLoading()
      await this.axRobot.openSprayer(gear)
      this.hideLoading()
    },
    async closeSprayer () {
      this.showLoading()
      await this.axRobot.closeSprayer()
      this.hideLoading()
    }
  },
  activated () {
    this.init()
  },
  deactivated () {
    if (this.axRobot) {
      this.axRobot.destroy()
      this.axRobot = null
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content_box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 30px;
  color: #353535;
}
.mode_box {
  width: 100%;
  font-size: 18px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  margin-top: 25px;
}
.mode_item {
  width: 100%;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  padding: 7px 0px;
  padding-left: 40px;
}
.split_desc {
  padding: 0px 10px;
}
.mode_desc {
  font-size: 14px;
  color: #666666;
}
.mode_field {
  width: 120px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.mode_input {
  width: 380px;
  height: 30px;
  font-size: 14px;
  color: #353535;
  border-radius: 3px;
  border: 1px solid #e7e7eb;
  padding: 0px 10px;
  box-sizing: border-box;
}
.result_banner {
  width: 600px;
  height: 20px;
  font-size: 14px;
  color: #ff0000;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tools_banner {
  width: 600px;
  margin-top: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin-bottom: 10px;
}
.btn_tools {
  min-width: 70px;
  height: 32px;
  font-size: 14px;
  color: #fff;
  border-radius: 3px;
  background: #26ac28;
  padding: 0px 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px 5px;
}
.btn_tools:active {
  background: #249826;
}
.btn_blue {
  min-width: 70px;
  height: 32px;
  font-size: 14px;
  color: #fff;
  border-radius: 3px;
  background: #3d59e3;
  padding: 0px 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px 5px;
}
.btn_blue:active {
  background: #2f4cdc;
}
</style>
