<template>
  <div class="content_box">
    <h1>{{ msg }}</h1>
    <div class="mode_box">
      <div>{{$t('clickMapTo')}}：</div>
      <div class="result_banner">{{ result }}</div>
      <div class="map_banner div_center">
        <div id="map" style="width:100%;height:500px"></div>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line standard/object-curly-even-spacing
import { AXRobot as AXRobotProd, AppMode as AppModeProd} from '@autoxing/robot-js-sdk'
// eslint-disable-next-line standard/object-curly-even-spacing
import { AXRobot as AXRobotDev, AppMode as AppModeDev} from '@autoxing/robot-js-sdk-dev'
export default {
  name: 'mapto',
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
      axMap: null,
      clickPointId: null
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
            this.axRobot.subscribeRealState({onStateChanged: this.onStateChanged})
            this.axRobot.setEnableTrack(true)
            this.showMap()
          }
        }
      } catch (e) {
        this.result = e.errText
      }
      this.hideLoading()
    },
    async showMap () {
      let stateObj = await this.axRobot.getState()
      if (stateObj && stateObj.areaId) {
        this.axMap = await this.axRobot.createMap('map', null, window.Configs.fontUrl)
        this.axMap.setAreaMap(stateObj.areaId)
        this.axMap.setMapCenter([stateObj.x, stateObj.y])
        this.axMap.setClickMapCallback(this.onClickMap)
        this.showRobotLoc(stateObj)
      }
    },
    onClickMap (e) {
      if (e.type === 'LayerPoint') {
        let x = e.data.geometry.coordinates[0]
        let y = e.data.geometry.coordinates[1]
        if (this.axMap) {
          if (this.clickPointId) {
            this.axMap.deleteFeature(this.clickPointId)
            this.clickPointId = null
          }
          this.clickPointId = this.axMap.addPoint([x, y], {color: '#ff0000', radius: 7})
        }
        this.axRobot.moveTo({x: x, y: y})
      }
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
    onStateChanged (stateInfo) {
      this.showRobotLoc(stateInfo)
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
  width: 100%;
  box-sizing: border-box;
}
</style>
