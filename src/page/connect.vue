<template>
  <div class="content_box">
    <h1>{{ msg }}</h1>
    <div class="mode_box">
      <div>{{$t('connectTitle')}}：</div>
      <div class="mode_item">1. AppMode.WAN_APP<span class="split_desc">-</span><span class="mode_desc">{{$t('connectWanAPP')}}</span></div>
      <div class="mode_item">2. AppMode.LOCAL_APP<span class="split_desc">-</span><span class="mode_desc">{{$t('connectLocalAPP')}}</span></div>
      <div class="mode_item">3. AppMode.LAN_APP<span class="split_desc">-</span><span class="mode_desc">{{$t('connectLanAPP')}}</span></div>
    </div>
    <div class="mode_box">
      <div>{{$t('robotConnectVerify')}}：</div>
      <div class="mode_item">
        <div class="mode_field">{{$t('connectRobotId')}}：</div>
        <input v-model="robotId" class="mode_input" :placeholder="$t('inputConnectRobotId')" />
      </div>
    </div>
    <div class="result_banner">{{result}}</div>
    <div class="mode_box tools_banner">
      <div class="btn_tools bg_btn" @click="checkConnect();">{{$t('connectVerify')}}</div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line standard/object-curly-even-spacing
import { AXRobot as AXRobotProd, AppMode as AppModeProd} from '@autoxing/robot-js-sdk'
// eslint-disable-next-line standard/object-curly-even-spacing
import { AXRobot as AXRobotDev, AppMode as AppModeDev} from '@autoxing/robot-js-sdk-dev'
import {Configs} from '../../static/js/configs'

export default {
  name: 'connect',
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
      robotId: '',
      result: '',
      axRobot: null
    }
  },
  mounted () {
  },
  methods: {
    async checkConnect () {
      if (this.axRobot) {
        this.axRobot.destroy()
      }
      this.showLoading()
      Configs.robotId = this.robotId
      if (Configs.mode === 1 || Configs.mode === '1') {
        this.axRobot = new AXRobotProd(Configs.appId, Configs.appSecret, AppModeProd.WAN_APP, Configs.globalServicePath, Configs.globalWsPath)
      } else if (Configs.mode === -1 || Configs.mode === '-1') {
        this.axRobot = new AXRobotDev(Configs.appId, Configs.appSecret, AppModeDev.WAN_APP)
      } else {
        this.axRobot = new AXRobotProd(Configs.appId, Configs.appSecret, AppModeProd.WAN_APP)
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
    }
  },
  activated () {
    this.robotId = Configs.robotId
  },
  deactivated () {
    if (this.axRobot) {
      this.axRobot.destroy()
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
}
.btn_tools {
  min-width: 100px;
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
}
.btn_tools:active {
  background: #249826;
}
</style>
