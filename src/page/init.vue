<!-- eslint-disable standard/object-curly-even-spacing -->
<template>
  <div class="content_box">
    <h1>{{ msg }}</h1>
    <div class="mode_box">
      <div>{{$t('initTitle')}}：</div>
      <div class="mode_item">1. AppMode.WAN_APP<span class="split_desc">-</span><span class="mode_desc">{{$t('initWanApp')}}</span></div>
      <div class="mode_item">2. AppMode.LOCAL_APP<span class="split_desc">-</span><span class="mode_desc">{{$t('initLocalApp')}}</span></div>
      <div class="mode_item">3. AppMode.LAN_APP<span class="split_desc">-</span><span class="mode_desc">{{$t('initLanApp')}}</span></div>
    </div>
    <div class="mode_box">
      <div>{{$t('initAuth')}}：</div>
      <div class="mode_item">1. appId<span class="split_desc">-</span><span class="mode_desc">{{$t('initAuth1')}}</span></div>
      <div class="mode_item">2. appSecret<span class="split_desc">-</span><span class="mode_desc">{{$t('initAuth2')}}</span></div>
    </div>
    <div class="mode_box">
      <div>{{$t('initVerify')}}：</div>
      <div class="mode_item">
        <div class="mode_field">appId：</div>
        <input v-model="appId" class="mode_input" :placeholder="$t('initInputAppId')" />
      </div>
      <div class="mode_item">
        <div class="mode_field">appSecret：</div>
        <input v-model="appSecret" class="mode_input" :placeholder="$t('initInputAppSecret')" />
      </div>
    </div>
    <div class="result_banner">{{result}}</div>
    <div class="mode_box tools_banner">
      <div class="btn_tools bg_btn" @click="checkInitSDK();">{{$t('initVerify')}}</div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line standard/object-curly-even-spacing
import { AXRobot as AXRobotProd, AppMode as AppModeProd} from '@autoxing/robot-js-sdk'
// eslint-disable-next-line standard/object-curly-even-spacing
import { AXRobot as AXRobotDev, AppMode as AppModeDev} from '@autoxing/robot-js-sdk-dev'

export default {
  name: 'init',
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
      appId: '',
      appSecret: '',
      result: '',
      axRobot: null
    }
  },
  mounted () {
  },
  methods: {
    async checkInitSDK () {
      if (this.axRobot) {
        this.axRobot.destroy()
      }
      this.showLoading()
      window.Configs.appId = this.appId
      window.Configs.appSecret = this.appSecret
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
          let version = this.axRobot.getVersion()
          this.result = 'Initialization succeeded. SDK version is ' + version + '.'
        }
      } catch (e) {
        this.result = e.errText
      }
      this.hideLoading()
    }
  },
  activated () {
    this.appId = window.Configs.appId
    this.appSecret = window.Configs.appSecret
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
