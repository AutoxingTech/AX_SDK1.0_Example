<template>
  <div class="content_box">
    <h1>{{ msg }}</h1>
    <div class="mode_box">
      <div>机器人移动到站点并完成工作：</div>
      <div class="result_banner">{{ result }}</div>
      <div class="map_banner div_center">
        <div id="map" style="width:100%;height:500px"></div>
        <div class="tools_banner">
          <div class="btn_tools bg_btn" @click="selectPoi();">选择站点及设置动作</div>
        </div>
      </div>
    </div>
    <Dialog
      title="选择站点及设置动作"
      :width="545"
      :footer="true"
      cancelText="关闭"
      okText=""
      @close="onClose"
      @cancel="onCancel"
      v-show="showDialog">
      <div class="poi_container">
        <div v-for="(item,i) in poiList" :key="i" class="poi_box">
          <div class="poi_name">{{item.name}}</div>
          <div class="poi_type">类型：{{item.type}}</div>
          <div class="poi_pose">x: {{item.x}}, y: {{item.y}}, yaw: {{item.yaw}}</div>
          <div class="tools_box">
            <div class="btn_tools bg_btn use_btn" @click="doSettings(i);">Settings</div>
            <div class="split"></div>
            <div class="btn_tools bg_btn use_btn" @click="moveTo(i);">Go Here</div>
          </div>
        </div>
        <div class="clear"></div>
      </div>
    </Dialog>
    <Dialog
      title="设置站点动作"
      :width="300"
      :footer="true"
      cancelText="取消"
      okText="确定"
      @close="onSettingClose"
      @cancel="onSettingCancel"
      @ok="onSettingConfirm"
      v-show="showSettingDialog">
      <div class="poi_container">
        <div v-for="(item,i) in actionList" :key="i" @click="selectSettings(i);"
          :class="'setting_banner poi_btn'+(item.isSelected?' poi_box_selected':'')">
          {{item.desc}}
          <div v-if="item.isSelected" class="sort_num">{{getSelectedIndex(i)}}</div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script>
import { AXRobot, AppMode, ActionType } from '@autoxing/robot-js-sdk-dev'
import { Configs } from '../../../static/js/configs'
import Dialog from '../../components/Dialog'

export default {
  name: 'poiaction',
  components: {Dialog},
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
      showDialog: false,
      showSettingDialog: false,
      poiList: [],
      actionList: [
        {desc: '播放指定语音(间隔10秒重播)', type: ActionType.PlayAudio, isSelected: false, interval: 10, url: 'https://autoxingtest1.oss-cn-beijing.aliyuncs.com/mp3/autoxing/yijia_task_running.mp3'},
        {desc: '打开箱门(须人机交互继续任务)', type: ActionType.OpenDoor, isSelected: false, doors: [2, 3]},
        {desc: '停留1分钟', type: ActionType.Pause, isSelected: false, pauseTime: 60},
        {desc: '打开4档喷雾', type: ActionType.GearOperation, isSelected: false, gear: 4},
        {desc: '关闭喷雾', type: ActionType.GearOperation, isSelected: false, gear: 0},
        {desc: '停止播放语音', type: ActionType.StopAudio, isSelected: false}],
      selecteds: []
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
        this.axMap = await this.axRobot.createMap('map')
        this.axMap.setAreaMap(stateObj.areaId)
        this.axMap.setMapCenter([stateObj.x, stateObj.y])
        this.showRobotLoc(stateObj)
      }
    },
    selectPoi () {
      let placeData = this.axRobot.getPlaceList()
      this.poiList = []
      if (placeData && placeData.features) {
        let len = placeData.features.length
        for (let i = 0; i < len; i++) {
          let poiObj = placeData.features[i]
          let coordinates = poiObj.geometry.coordinates
          let x = parseFloat(coordinates[0].toFixed(2))
          let y = parseFloat(coordinates[1].toFixed(2))
          let yaw = 0
          if (typeof poiObj.properties.yaw !== 'undefined') {
            yaw = parseFloat(parseFloat(poiObj.properties.yaw).toFixed(0))
          }
          this.poiList.push({name: poiObj.properties.name,
            type: poiObj.properties.type,
            yaw: yaw,
            x: x,
            y: y})
        }
      }
      this.onDialog()
    },
    selectSettings (index) {
      let pos = this.selecteds.indexOf(index)
      if (pos !== -1) {
        this.selecteds.splice(pos, 1)
        this.actionList[index].isSelected = false
      } else {
        this.selecteds.push(index)
        this.actionList[index].isSelected = true
      }
    },
    getSelectedIndex (index) {
      return this.selecteds.indexOf(index) + 1
    },
    onDialog () { // 调用Dialog弹出对话框
      this.showDialog = true
    },
    onClose () { // 关闭dialog
      this.showDialog = false
    },
    onCancel () { // “取消”按钮回调
      this.showDialog = false
    },
    doSettings (index) {
      this.showSettingDialog = true
    },
    onSettingClose () {
      this.showSettingDialog = false
    },
    onSettingCancel () {
      this.showSettingDialog = false
    },
    onSettingConfirm () {
      this.showSettingDialog = false
    },
    async moveTo (index) {
      if (!this.axMap) {
        return
      }
      this.showLoading()
      let poiObj = this.poiList[index]
      this.axMap.setMapCenter([poiObj.x, poiObj.y])
      let task = {
        name: 'test task',
        runNum: 1,
        pts: []
      }
      let stepActs = []
      let len = this.selecteds.length
      for (let i = 0; i < len; i++) {
        let actObj = this.actionList[this.selecteds[i]]
        if (actObj.type === ActionType.PlayAudio) {
          stepActs.push({type: actObj.type, url: actObj.url, interval: actObj.interval})
        } else if (actObj.type === ActionType.GearOperation) {
          stepActs.push({type: actObj.type, gear: actObj.gear})
        } else if (actObj.type === ActionType.OpenDoor) {
          stepActs.push({type: actObj.type, doors: actObj.doors})
        } else if (actObj.type === ActionType.Pause) {
          stepActs.push({type: actObj.type, pauseTime: actObj.pauseTime})
        } else if (actObj.type === ActionType.StopAudio) {
          stepActs.push({type: actObj.type})
        }
      }
      task.pts.push({x: poiObj.x, y: poiObj.y, yaw: poiObj.yaw, ext: {name: poiObj.name}, stepActs: stepActs})
      let isOk = await this.axRobot.startTask(task)
      this.hideLoading()
      if (!isOk) {
        this.toast('Run task fail.')
        return
      }
      this.showDialog = false
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
  position: relative;
  width: 100%;
  box-sizing: border-box;
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
}
.btn_tools:active {
  background: #249826;
}
.tools_banner {
  position: absolute;
  top: 0px;
  right: 0px;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}
.poi_container {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}
.poi_box {
  float: left;
  width: 240px;
  height: 130px;
  padding: 14px;
  border-radius: 3px;
  box-sizing: border-box;
  background: #fafafb;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin: 5px;
}
.poi_name {
  width: 100%;
  height: 24px;
  font-size: 16px;
  font-weight: bold;
  color: #353535;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}
.poi_type {
  height: 21px;
  font-size: 14px;
  color: #8f9bb3;
}
.poi_pose {
  height: 21px;
  font-size: 14px;
  color: #222;
  user-select: text;
}
.tools_box {
  width: 100%;
  height: 30px;
  display: flex;
  margin-top: 5px;
}
.split {
  width: 14px;
  height: 100%;
}
.use_btn {
  width: calc(50% - 7px);
  height: 100%;
  font-weight: bold;
}
.setting_banner {
  position: relative;
  width: 100%;
  font-size: 14px;
  color: #353535;
  padding: 14px;
  border-radius: 3px;
  box-sizing: border-box;
  background: #fafafb;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin: 5px;
}
.poi_btn {
  border: none;
  outline: none;
  -webkit-appearance: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  cursor: pointer;
}
.poi_btn:active {
  background: #e0e0f3;
}
.poi_box_selected {
  background: #e0e0f3;
}
.sort_num {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 25px;
  height: 25px;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  background: #ff0000;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
</style>
