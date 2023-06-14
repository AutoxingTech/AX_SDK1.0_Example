<template>
  <div class="content_box">
    <h1>{{ msg }}</h1>
    <div class="mode_box">
      <div>{{$t('boxDoorControl')}}：</div>
      <div class="mode_item"><span class="mode_desc">{{$t('boxDoorControlTitle')}}</span></div>
    </div>
    <div class="mode_box">
      <div>{{$t('boxDoorVerify')}}：</div>
      <div class="result_banner">{{result}}</div>
    </div>
    <div class="mode_box tools_banner">
      <div class="btn_tools bg_btn" @click="openBoxDoor(1);">{{$t('open1Door')}}</div>
      <div class="btn_tools bg_btn" @click="openBoxDoor(2);">{{$t('open2Door')}}</div>
      <div class="btn_tools bg_btn" @click="openBoxDoor(3);">{{$t('open3Door')}}</div>
      <div class="btn_tools bg_btn" @click="openBoxDoor(4);">{{$t('open4Door')}}</div>
    </div>
    <div class="mode_box tools_banner">
      <div class="btn_blue bg_btn" @click="closeBoxDoor(1);">{{$t('close1Door')}}</div>
      <div class="btn_blue bg_btn" @click="closeBoxDoor(2);">{{$t('close2Door')}}</div>
      <div class="btn_blue bg_btn" @click="closeBoxDoor(3);">{{$t('close3Door')}}</div>
      <div class="btn_blue bg_btn" @click="closeBoxDoor(4);">{{$t('close4Door')}}</div>
    </div>
  </div>
</template>

<script>
import {AXRobot, AppMode} from '@autoxing/robot-js-sdk'
import {Configs} from '../../../static/js/configs'

export default {
  name: 'boxdoor',
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
      if (Configs.mode === 1 || Configs.mode === '1') {
        this.axRobot = new AXRobot(Configs.appId, Configs.appSecret, AppMode.WAN_APP, Configs.globalServicePath, Configs.globalWsPath)
      } else {
        this.axRobot = new AXRobot(Configs.appId, Configs.appSecret, AppMode.WAN_APP)
      }
      try {
        let isOk = await this.axRobot.init()
        if (isOk) {
          let res = await this.axRobot.connectRobot({
            robotId: Configs.robotId
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
    async openBoxDoor (id) {
      this.showLoading()
      await this.axRobot.openBoxDoor([id], 1)
      this.hideLoading()
    },
    async closeBoxDoor (id) {
      this.showLoading()
      await this.axRobot.closeBoxDoor([id], 1)
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
