<template>
  <div class="content_box">
    <h1>{{ msg }}</h1>
    <div class="mode_box">
      <div>SDK初始化提供如下三种方式：</div>
      <div class="mode_item">1. AppMode.WAN_APP<span class="split_desc">-</span><span class="mode_desc">广域网模式，主要针对小程序、移动终端App、PC端web等</span></div>
      <div class="mode_item">2. AppMode.LOCAL_APP<span class="split_desc">-</span><span class="mode_desc">本地模式，主要针对上位机终端App等</span></div>
      <div class="mode_item">3. AppMode.LAN_APP<span class="split_desc">-</span><span class="mode_desc">局域网模式，主要针对Wi-Fi局域网内移动终端（如pad、手机）等</span></div>
    </div>
    <div class="mode_box">
      <div>SDK初始化鉴权参数：</div>
      <div class="mode_item">1. appId<span class="split_desc">-</span><span class="mode_desc">应用ID，可向相关运营人员申请提供</span></div>
      <div class="mode_item">2. appSecret<span class="split_desc">-</span><span class="mode_desc">数据请求密钥，可向相关运营人员申请提供</span></div>
    </div>
    <div class="mode_box">
      <div>SDK初始化验证：</div>
      <div class="mode_item">
        <div class="mode_field">appId：</div>
        <input v-model="appId" class="mode_input" placeholder="请输入appId" />
      </div>
      <div class="mode_item">
        <div class="mode_field">appSecret：</div>
        <input v-model="appSecret" class="mode_input" placeholder="请输入appSecret" />
      </div>
    </div>
    <div class="result_banner">{{result}}</div>
    <div class="mode_box tools_banner">
      <div class="btn_tools bg_btn" @click="checkInitSDK();">SDK初始化验证</div>
    </div>
  </div>
</template>

<script>
import {AXRobot, AppMode} from '@autoxing/robot-js-sdk'
import {Configs} from '../../static/js/configs'

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
      Configs.appId = this.appId
      Configs.appSecret = this.appSecret
      this.axRobot = new AXRobot(this.appId, this.appSecret, AppMode.WAN_APP)
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
    this.appId = Configs.appId
    this.appSecret = Configs.appSecret
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
