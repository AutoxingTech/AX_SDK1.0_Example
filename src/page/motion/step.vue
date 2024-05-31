<template>
  <div class="content_box">
    <h1>{{ msg }}</h1>
    <div class="mode_box">
      <div>{{$t('stepTitle')}}：</div>
      <div class="mode_item">
        1. {{$t('noObstacleMove')}}<span class="split_desc">-</span><span class="mode_desc">{{$t('noObstacleMoveTitle')}}</span>
      </div>
      <div class="mode_item">
        2. {{$t('angularVelocity')}}<span class="split_desc">-</span><span class="mode_desc">{{$t('angularVelocityTitle')}}</span>
      </div>
      <div class="mode_item">
        3. {{$t('lineVelocity')}}<span class="split_desc">-</span><span class="mode_desc">{{$t('lineVelocityTitle')}}</span>
      </div>
    </div>
    <div class="mode_box">
      <div>{{$t('stepMove')}}：</div>
      <div class="result_banner">{{ result }}</div>
      <div class="control_banner div_center">
        <div class="div_center">
          <div class="operate_btn div_center bg_btn" @click="motionFor(3);">左转</div>
        </div>
        <div class="control_vcenter div_center">
          <div class="operate_btn div_center bg_btn" @click="motionFor(1);">前进</div>
          <div class="operate_btn div_center bg_btn stop_btn" @click="motionFor(5);">停止</div>
          <div class="operate_btn div_center bg_btn" @click="motionFor(2);">后退</div>
        </div>
        <div class="div_center">
          <div class="operate_btn div_center bg_btn" @click="motionFor(4);">右转</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line standard/object-curly-even-spacing
import { AXRobot as AXRobotProd, AppMode as AppModeProd, MotionType} from '@autoxing/robot-js-sdk'
// eslint-disable-next-line standard/object-curly-even-spacing
import { AXRobot as AXRobotDev, AppMode as AppModeDev} from '@autoxing/robot-js-sdk-dev'
export default {
  name: 'step',
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
    motionFor: function (flag) {
      switch (flag) {
        case 1: // 前进
          this.axRobot.motionFor(MotionType.Forward)
          break
        case 2: // 后退
          this.axRobot.motionFor(MotionType.Back)
          break
        case 3: // 左转
          this.axRobot.motionFor(MotionType.TurnLeft)
          break
        case 4: // 右转
          this.axRobot.motionFor(MotionType.TurnRight)
          break
        case 5: // 停止
          this.axRobot.motionFor(MotionType.Cancel)
          break
      }
    }
  },
  activated () {
    this.init()
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
.rocker_text {
  color: #353535;
  font-weight: bold;
}
.tools_banner {
  position: relative;
  width: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}
.control_banner {
  width: 100%;
  padding: 10px 20px;
  box-sizing: border-box;
}
.control_vcenter {
  flex-direction: column;
  padding: 0px 10px;
  box-sizing: border-box;
  margin-left: 20px;
  margin-right: 20px;
}
.control_vsplit {
  width: 100%;
  height: 20px;
}
.operate_btn {
  font-size: 13px;
  font-weight: 400;
  color: #fff;
  padding: 10px 20px;
  box-sizing: border-box;
  background: #26ac28;
  border-radius: 5px;
}
.operate_btn:active {
  font-weight: bold;
  background: #249826;
}
.stop_btn {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
