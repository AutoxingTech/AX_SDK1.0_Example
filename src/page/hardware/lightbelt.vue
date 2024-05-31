<template>
  <div class="content_box">
    <h1>{{ msg }}</h1>
    <div class="mode_box">
      <div>{{$t('lightBeltControl')}}：</div>
      <div class="mode_item">1. {{$t('lightBeltSection')}}<span class="split_desc">-</span><span class="mode_desc">{{$t('lightBeltSectionTitle')}}</span></div>
      <div class="mode_item">2. {{$t('lightBeltFull')}}<span class="split_desc">-</span><span class="mode_desc">{{$t('lightBeltFullTitle')}}</span></div>
    </div>
    <div class="mode_box">
      <div>{{$t('sectionControlVerify')}}：</div>
      <div class="result_banner">{{result}}</div>
    </div>
    <div class="mode_box tools_banner">
      <div class="btn_tools bg_btn" @click="openSubLight(0);">{{$t('redLight1')}}</div>
      <div class="btn_tools bg_btn" @click="openSubLight(1);">{{$t('greenLight2')}}</div>
      <div class="btn_tools bg_btn" @click="openSubLight(2);">{{$t('blueLight3')}}</div>
      <div class="btn_tools bg_btn" @click="openSubLight(3);">{{$t('yellowLight4')}}</div>
    </div>
    <div class="mode_box tools_banner">
      <div class="btn_blue bg_btn" @click="closeSubLight(0);">{{$t('closeLight1')}}</div>
      <div class="btn_blue bg_btn" @click="closeSubLight(1);">{{$t('closeLight2')}}</div>
      <div class="btn_blue bg_btn" @click="closeSubLight(2);">{{$t('closeLight3')}}</div>
      <div class="btn_blue bg_btn" @click="closeSubLight(3);">{{$t('closeLight4')}}</div>
    </div>
    <div class="mode_box">
      <div>{{$t('fullControlVerify')}}：</div>
      <div class="result_banner"></div>
    </div>
    <div class="mode_box tools_banner">
      <div class="btn_tools bg_btn" @click="openLight(0);">{{$t('redLight')}}</div>
      <div class="btn_tools bg_btn" @click="openLight(1);">{{$t('greenLight')}}</div>
      <div class="btn_tools bg_btn" @click="openLight(2);">{{$t('blueLight')}}</div>
      <div class="btn_tools bg_btn" @click="openLight(3);">{{$t('yellowLight')}}</div>
      <div class="btn_blue bg_btn" @click="closeLight();">{{$t('closeLight')}}</div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line standard/object-curly-even-spacing
import { AXRobot as AXRobotProd, AppMode as AppModeProd, LightColor} from '@autoxing/robot-js-sdk'
// eslint-disable-next-line standard/object-curly-even-spacing
import { AXRobot as AXRobotDev, AppMode as AppModeDev} from '@autoxing/robot-js-sdk-dev'
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
