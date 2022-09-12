<template>
  <div class="content_box">
    <h1>{{ msg }}</h1>
    <div class="mode_box">
      <div>当前地图：</div>
      <div class="result_banner">{{ result }}</div>
      <div class="map_banner div_center">
        <div id="map" style="width: 100%;height: 500px"></div>
        <div class="state_banner">
          <span class="state_label">手动: <span class="state_val">{{isManualMode?'是':'否'}}</span></span>
          <span class="state_label">远控: <span class="state_val">{{isRemoteMode?'是':'否'}}</span></span>
          <span class="state_label">急停: <span class="state_val">{{isEmergencyStop?'是':'否'}}</span></span>
          <span class="state_label">障碍物: <span class="state_val">{{hasObstruction?'有':'无'}}</span></span>
          <span class="state_label">执行任务: <span class="state_val">{{isTasking?'是':'否'}}</span></span>
          <span class="state_label">前往充电: <span class="state_val">{{isGoHome?'是':'否'}}</span></span>
          <span class="state_label">正在充电: <span class="state_val">{{isCharging?'是':'否'}}</span></span>
          <span class="state_label">是否异常: <span class="state_val">{{isError?'是':'否'}}</span></span>
          <span class="state_label">电量: <span class="state_val">{{battery}}%</span></span>
          <span class="state_label">速度: <span class="state_val">{{speed}}m/s</span></span>
        </div>
        <div class="mode_banner">
          <div class="btn_tools bg_btn" @click="changeMode(0);">自动模式</div>
          <div class="btn_tools bg_btn" @click="changeMode(1);">手动模式</div>
          <div class="btn_tools bg_btn" @click="setEmergency();">{{isEmergencyStop?'取消急停':'急停模式'}}</div>
        </div>
      </div>
    </div>
    <div style="width: 100%;height: 20px;"></div>
  </div>
</template>

<script>
import { AXRobot, AppMode, MotionType, EmergencyType } from '@autoxing/robot-js-sdk-dev'
import { Configs } from '../../../static/js/configs'

export default {
  name: 'motionmode',
  props: {
    showLoading: {
      type: Function,
      default: null
    },
    hideLoading: {
      type: Function,
      default: null
    },
    toast: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      msg: 'Welcome to AutoXing Robot SDK1.0',
      result: '',
      axRobot: null,
      axMap: null,
      isManualMode: false,
      isCharging: false,
      isRemoteMode: false,
      isTasking: false,
      battery: 0,
      speed: 0,
      isEmergencyStop: false,
      hasObstruction: false,
      isGoHome: false,
      isError: false
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
        let res = await this.axRobot.connectRobot({
          robotId: Configs.robotId
        })
        if (res.errCode === 0) {
          this.result = 'Connection succeeded, robot ID is ' + res.robotId
          this.axRobot.subscribeRealState({onStateChanged: this.onStateChanged})
          this.axRobot.setEnableTrack(true)
          this.showMap()
        } else {
          this.result = 'Connection failed, ' + res.errText
        }
      } else {
        this.result =
          'Initialization failed. Please check whether appid and appsecret are correct.'
      }
      this.hideLoading()
    },
    async showMap () {
      let stateObj = await this.axRobot.getState()
      if (stateObj && stateObj.areaId) {
        this.parseStateInfo(stateObj)
        this.axMap = await this.axRobot.createMap('map')
        this.axMap.setAreaMap(stateObj.areaId)
        this.axMap.setMapCenter([stateObj.x, stateObj.y])
        this.showRobotLoc(stateObj)
      }
    },
    parseStateInfo (stateInfo) {
      this.isManualMode = false
      this.isCharging = false
      this.isRemoteMode = false
      this.isTasking = false
      this.battery = 0
      this.speed = 0
      this.isEmergencyStop = false
      this.hasObstruction = false
      this.isGoHome = false
      this.isError = false
      if (typeof stateInfo.isManualMode === 'boolean') {
        this.isManualMode = stateInfo.isManualMode
      }
      if (typeof stateInfo.isCharging === 'boolean') {
        this.isCharging = stateInfo.isCharging
      }
      if (typeof stateInfo.isRemoteMode === 'boolean') {
        this.isRemoteMode = stateInfo.isRemoteMode
      }
      if (typeof stateInfo.isTasking === 'boolean') {
        this.isTasking = stateInfo.isTasking
      }
      if (typeof stateInfo.isEmergencyStop === 'boolean') {
        this.isEmergencyStop = stateInfo.isEmergencyStop
      }
      if (typeof stateInfo.hasObstruction === 'boolean') {
        this.hasObstruction = stateInfo.hasObstruction
      }
      if (typeof stateInfo.isGoHome === 'boolean') {
        this.isGoHome = stateInfo.isGoHome
      }
      if (typeof stateInfo.battery === 'number') {
        this.battery = stateInfo.battery
      }
      if (typeof stateInfo.speed === 'number') {
        this.speed = stateInfo.speed
      }
      if (Array.isArray(stateInfo.errors) && stateInfo.errors.length > 0) {
        this.isError = true
      }
    },
    onStateChanged (stateInfo) {
      this.parseStateInfo(stateInfo)
      this.showRobotLoc(stateInfo)
    },
    showRobotLoc (stateInfo) {
      if (this.axMap) {
        let coordinates = [stateInfo.x, stateInfo.y]
        let angle = stateInfo.yaw * 180 / Math.PI
        if (this.robotMarker) {
          this.axMap.updateMarker(this.robotMarker, coordinates, angle)
        } else {
          this.robotMarker = this.axMap.addMarker('./static/images/position.png', coordinates, angle)
        }
      }
    },
    async changeMode (flag) {
      this.showLoading()
      let isOk = false
      if (flag === 0) {
        isOk = await this.axRobot.motionFor(MotionType.Auto)
      } else {
        isOk = await this.axRobot.motionFor(MotionType.Manual)
      }
      console.log('isOk=' + isOk)
      this.hideLoading()
    },
    async setEmergency () {
      this.showLoading()
      let isOk = false
      if (this.isEmergencyStop === true) {
        isOk = await this.axRobot.setEmergency(EmergencyType.Stop)
      } else {
        isOk = await this.axRobot.setEmergency(EmergencyType.Start)
      }
      console.log('isOk=' + isOk)
      this.hideLoading()
    }
  },
  activated () {
    this.init()
  },
  deactivated () {
    if (this.axRobot) {
      this.robotMarker = null
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
.map_banner {
  position: relative;
  width: 100%;
  box-sizing: border-box;
}
.state_banner {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  padding: 8px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: 3px;
  background: rgba(38, 172, 40, 0.9);
  font-size: 12px;
  color: #fff;
}
.state_label {
  margin: 0px 5px;
}
.state_val {
  font-weight: bold;
}
.mode_banner {
  position: absolute;
  top: 45px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
}
.btn_tools {
  min-width: 80px;
  height: 28px;
  font-size: 14px;
  color: #fff;
  border-radius: 3px;
  background: #26ac28;
  padding: 0px 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 7px;
}
.btn_tools:active {
  background: #249826;
}
</style>
