<template>
  <div class="content_box">
    <h1>{{ msg }}</h1>
    <div class="mode_box">
      <div>机器人灯带控制分为两种方式：</div>
      <div class="mode_item">1. 分段灯带（如餐厅机器人）<span class="split_desc">-</span><span class="mode_desc">指机器人安装的直线灯带，由上往下或由左往右进行分段控制</span></div>
      <div class="mode_item">2. 完整灯带（如消杀机器人）<span class="split_desc">-</span><span class="mode_desc">指机器人安装的周身灯带，设置控制灯带颜色即可</span></div>
    </div>
    <div class="mode_box">
      <div>分段灯带控制验证：</div>
      <div class="result_banner">{{result}}</div>
    </div>
    <div class="mode_box tools_banner">
      <div class="btn_tools bg_btn" @click="openSubLight(0);">红灯1段</div>
      <div class="btn_tools bg_btn" @click="openSubLight(1);">绿灯2段</div>
      <div class="btn_tools bg_btn" @click="openSubLight(2);">蓝灯3段</div>
      <div class="btn_tools bg_btn" @click="openSubLight(3);">黄灯4段</div>
    </div>
    <div class="mode_box tools_banner">
      <div class="btn_blue bg_btn" @click="closeSubLight(0);">关灯1段</div>
      <div class="btn_blue bg_btn" @click="closeSubLight(1);">关灯2段</div>
      <div class="btn_blue bg_btn" @click="closeSubLight(2);">关灯3段</div>
      <div class="btn_blue bg_btn" @click="closeSubLight(3);">关灯4段</div>
    </div>
    <div class="mode_box">
      <div>完整灯带控制验证：</div>
      <div class="result_banner"></div>
    </div>
    <div class="mode_box tools_banner">
      <div class="btn_tools bg_btn" @click="openLight(0);">红灯</div>
      <div class="btn_tools bg_btn" @click="openLight(1);">绿灯</div>
      <div class="btn_tools bg_btn" @click="openLight(2);">蓝灯</div>
      <div class="btn_tools bg_btn" @click="openLight(3);">黄灯</div>
      <div class="btn_blue bg_btn" @click="closeLight();">关灯</div>
    </div>
  </div>
</template>

<script>
import {AXRobot, AppMode, LightColor} from '@autoxing/robot-js-sdk'
import {Configs} from '../../../static/js/configs'

export default {
  name: 'lightbelt',
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
    async openSubLight (flag) {
      let color = LightColor.Red
      let indexs = [{index: 0, num: 6}]
      switch (flag) {
        case 1:
          color = LightColor.Green
          indexs = [{index: 6, num: 6}]
          break
        case 2:
          color = LightColor.Blue
          indexs = [{index: 12, num: 6}]
          break
        case 3:
          color = LightColor.Yellow
          indexs = [{index: 18, num: 6}]
          break
      }
      let lightBelt = {
        mode: 1,
        color: color,
        indexs: indexs
      }
      this.showLoading()
      await this.axRobot.openLightBelt(lightBelt)
      this.hideLoading()
    },
    async closeSubLight (flag) {
      let indexs = [{index: 0, num: 6}]
      switch (flag) {
        case 1:
          indexs = [{index: 6, num: 6}]
          break
        case 2:
          indexs = [{index: 12, num: 6}]
          break
        case 3:
          indexs = [{index: 18, num: 6}]
          break
      }
      let lightBelt = {
        mode: 1,
        indexs: indexs
      }
      this.showLoading()
      await this.axRobot.closeLightBelt(lightBelt)
      this.hideLoading()
    },
    async openLight (flag) {
      let color = LightColor.Red
      switch (flag) {
        case 1:
          color = LightColor.Green
          break
        case 2:
          color = LightColor.Blue
          break
        case 3:
          color = LightColor.Yellow
          break
      }
      let lightBelt = {
        mode: 2,
        color: color
      }
      this.showLoading()
      await this.axRobot.openLightBelt(lightBelt)
      this.hideLoading()
    },
    async closeLight () {
      let lightBelt = {
        mode: 1
      }
      this.showLoading()
      await this.axRobot.closeLightBelt(lightBelt)
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
