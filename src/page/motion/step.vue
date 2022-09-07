<template>
  <div class="content_box">
    <h1>{{ msg }}</h1>
    <div class="mode_box">
      <div>机器人单步运动，即为分别一次控制机器人的角速度和线速度：</div>
      <div class="mode_item">
        1. 无避障运动<span class="split_desc">-</span><span class="mode_desc">在进行无避障运动控制时，需要注意机器人运动安全，避免碰撞</span>
      </div>
      <div class="mode_item">
        2. 角速度<span class="split_desc">-</span><span class="mode_desc">负数时机器人往右转，正数时机器人往左转，角速度最大限制为0.5r/s</span>
      </div>
      <div class="mode_item">
        3. 线速度<span class="split_desc">-</span><span class="mode_desc">负数时机器人后退，正数时机器人前进，后退最大限制0.2m/s，前进最大限制为0.5m/s</span>
      </div>
    </div>
    <div class="mode_box">
      <div>单运动验证：</div>
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
import { AXRobot, AppMode, MotionType } from '@autoxing/robot-js-sdk-dev'
import { Configs } from '../../../static/js/configs'

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
      this.axRobot = new AXRobot(
        Configs.appId,
        Configs.appSecret,
        AppMode.WAN_APP
      )
      let isOk = await this.axRobot.init()
      if (isOk) {
        this.axRobot.connectRobot({
          robotId: Configs.robotId,
          success: (res) => {
            this.result = 'Connection succeeded, robot ID is ' + res.robotId
            this.hideLoading()
          },
          fail: (res) => {
            this.result = 'Connection failed, ' + res.errText
            this.hideLoading()
          }
        })
      } else {
        this.result =
          'Initialization failed. Please check whether appid and appsecret are correct.'
        this.hideLoading()
      }
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
