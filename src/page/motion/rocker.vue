<template>
  <div class="content_box">
    <h1>{{ msg }}</h1>
    <div class="mode_box">
      <div>机器人双步运动，即为同时连续控制机器人的角速度和线速度：</div>
      <div class="mode_item">1. 无避障运动<span class="split_desc">-</span><span class="mode_desc">在进行无避障运动控制时，需要注意机器人运动安全，避免碰撞</span></div>
      <div class="mode_item">2. 角速度<span class="split_desc">-</span><span class="mode_desc">负数时机器人往右转，正数时机器人往左转，角速度最大限制为0.5r/s</span></div>
      <div class="mode_item">3. 线速度<span class="split_desc">-</span><span class="mode_desc">负数时机器人后退，正数时机器人前进，后退最大限制0.2m/s，前进最大限制为0.5m/s</span></div>
    </div>
    <div class="mode_box">
      <div>双步运动验证：</div>
      <div class="result_banner">{{result}}</div>
      <div class="result_banner rocker_text">
        Linear: {{linearVelocity}} - Angular: {{angularVelocity}}
      </div>
      <div class="mode_box tools_banner">
        <div id="zone" class="control_banner"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {AXRobot, AppMode} from '@autoxing/robot-js-sdk-dev'
import {Configs} from '../../../static/js/configs'
import nipplejs from '../../../static/js/nipplejs.js'

export default {
  name: 'rocker',
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
      axRobot: null,
      maxLinearVelocity: 0.5,
      maxAngularVelocity: 0.5,
      linearVelocity: 0,
      angularVelocity: 0,
      centerX: 0,
      centerY: 0,
      joystick: null
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
      this.axRobot = new AXRobot(Configs.appId, Configs.appSecret, AppMode.WAN_APP)
      let isOk = await this.axRobot.init()
      if (isOk) {
        let res = await this.axRobot.connectRobot({
          robotId: Configs.robotId
        })
        if (res.errCode === 0) {
          this.result = 'Connection succeeded, robot ID is ' + res.robotId
        } else {
          this.result = 'Connection failed, ' + res.errText
        }
      } else {
        this.result = 'Initialization failed. Please check whether appid and appsecret are correct.'
      }
      this.hideLoading()
      this.createNipple('static')
    },
    trackPositon: function (obj) {
      let position = obj.position
      let x = position.x
      let y = position.y
      let segX = (this.centerX - x)
      let segY = (this.centerY - y)
      if (segY < 0) {
        segX = -segX
      }
      this.angularVelocity = segX / 50.0 * this.maxAngularVelocity
      this.linearVelocity = segY / 50.0 * this.maxLinearVelocity
      this.axRobot.motionControl(this.linearVelocity, this.angularVelocity)
    },
    bindNipple: function () {
      let that = this
      that.joystick.on('start', function (evt, data) {
        that.axRobot.beginControl()
      }).on('end', function (evt, data) {
        that.axRobot.endControl()
      }).on('move', function (evt, data) {
        that.trackPositon(data)
      }).on('dir:up plain:up dir:left plain:left dir:down plain:down dir:right plain:right',
        function (evt, data) {
        }
      )
    },
    createNipple: function (evt) {
      if (this.joystick) {
        this.joystick.destroy()
      }
      let staticParam = {
        zone: document.getElementById('zone'),
        mode: 'static',
        position: {
          left: '50%',
          top: '70%'
        },
        color: 'red'
      }
      this.joystick = nipplejs.create(staticParam)
      let position = this.joystick[0].position
      this.centerX = position.x
      this.centerY = position.y
      this.bindNipple()
    }
  },
  activated () {
    this.init()
  },
  deactivated () {
    if (this.axRobot) {
      this.axRobot.destroy()
    }
    if (this.joystick) {
      this.joystick.destroy()
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
  margin-top: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
}
.control_banner {
  background-color: #18BC37;
}
</style>
