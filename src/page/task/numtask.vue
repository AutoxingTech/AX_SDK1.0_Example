<template>
  <div class="content_box">
    <h1>{{ msg }}</h1>
    <div class="mode_box">
      <div>{{$t('numTaskByRobot')}}：</div>
      <div class="result_banner">{{ result }}</div>
      <div class="map_banner div_center">
        <div id="map" style="width:100%;height:500px"></div>
        <div class="tools_banner">
          <div class="btn_tools bg_btn" @click="selectNum();">{{$t('selectNum')}}：{{runNum===0?$t('forEach'):runNum+$t('bout')}}</div>
          <div class="btn_tools bg_btn" @click="selectPoi();">{{$t('selectPoiM')}}</div>
        </div>
      </div>
    </div>
    <Dialog
      :title="isNumSelect?$t('selectTaskNum'):$t('selectPoiM')"
      :width="dialogWidth"
      :footer="true"
      :cancelText="$t('dialogCancel')"
      :okText="isNumSelect?'':$t('dialogOk')"
      @close="onClose"
      @cancel="onCancel"
      @ok="onConfirm"
      v-show="showDialog">
      <div v-if="isNumSelect" class="poi_container">
        <div v-for="(item,i) in numList" :key="i" class="num_banner poi_btn" @click="doSelectNum(i);">
          {{item.desc}}
        </div>
      </div>
      <div v-else class="poi_container">
        <div v-for="(item,i) in poiList" :key="i"
          :class="'poi_box poi_btn'+(item.isSelected?' poi_box_selected':'')"
          @click="doSelect(i);">
          <div class="poi_name">{{item.name}}</div>
          <div class="poi_type">{{$t('type')}}：{{item.type}}</div>
          <div class="poi_pose">x: {{item.x}}, y: {{item.y}}, yaw: {{item.yaw}}</div>
          <div v-if="item.isSelected" class="sort_num">{{getSelectedIndex(i)}}</div>
        </div>
        <div class="clear"></div>
      </div>
    </Dialog>
  </div>
</template>

<script>
import { AXRobot, AppMode } from '@autoxing/robot-js-sdk'
import { Configs } from '../../../static/js/configs'
import Dialog from '../../components/Dialog'

export default {
  name: 'numtask',
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
      poiList: [],
      selecteds: [],
      numList: [
        {desc: this.$t('bout1'), num: 1},
        {desc: this.$t('bout2'), num: 2},
        {desc: this.$t('bout3'), num: 3},
        {desc: this.$t('bout5'), num: 5},
        {desc: this.$t('bout8'), num: 8},
        {desc: this.$t('forEach'), num: 0}],
      runNum: 1,
      isNumSelect: false,
      dialogWidth: 535,
      areaId: null
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
        this.areaId = stateObj.areaId
        this.axMap = await this.axRobot.createMap('map', null, Configs.fontUrl)
        this.axMap.setAreaMap(stateObj.areaId)
        this.axMap.setMapCenter([stateObj.x, stateObj.y])
        this.showRobotLoc(stateObj)
      }
    },
    doSelectNum (index) {
      this.runNum = this.numList[index].num
      this.showDialog = false
    },
    doSelect (index) {
      let pos = this.selecteds.indexOf(index)
      if (pos !== -1) {
        this.selecteds.splice(pos, 1)
        this.poiList[index].isSelected = false
      } else {
        this.selecteds.push(index)
        this.poiList[index].isSelected = true
      }
    },
    getSelectedIndex (index) {
      return this.selecteds.indexOf(index) + 1
    },
    selectNum () {
      this.isNumSelect = true
      this.dialogWidth = 300
      this.onDialog()
    },
    selectPoi () {
      this.isNumSelect = false
      this.dialogWidth = 545
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
            y: y,
            isSelected: false})
        }
      }
      this.onDialog()
    },
    onDialog () { // 调用Dialog弹出对话框
      this.selecteds = []
      this.showDialog = true
    },
    onClose () { // 关闭dialog
      this.showDialog = false
    },
    onCancel () { // “取消”按钮回调
      this.showDialog = false
    },
    async onConfirm () {
      if (this.selecteds.length === 0) {
        return
      }
      this.showLoading()
      let task = {
        name: 'test task',
        runNum: this.runNum,
        pts: []
      }
      let len = this.selecteds.length
      for (let i = 0; i < len; i++) {
        let poiObj = this.poiList[this.selecteds[i]]
        task.pts.push({x: poiObj.x, y: poiObj.y, yaw: poiObj.yaw, areaId: this.areaId, ext: {name: poiObj.name}})
      }
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
  margin-left: 10px;
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
  position: relative;
  float: left;
  width: 240px;
  height: 90px;
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
.poi_box_selected {
  background: #e0e0f3;
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
.num_banner {
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
  margin: 5px 0px;
}
</style>
