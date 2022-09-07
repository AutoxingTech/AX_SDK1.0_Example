<template>
  <div class="content_box">
    <h1>{{ msg }}</h1>
    <div class="mode_box">
      <div>当前地图：</div>
      <div class="result_banner">{{ result }}</div>
      <div class="map_banner div_center">
        <div id="map" style="width: 100%;height: 500px"></div>
        <div class="tools_banner">
          <div class="btn_tools bg_btn angle_btn" @click="changeMap();">切换地图</div>
        </div>
      </div>
    </div>
    <Dialog
      title="切换地图"
      :width="520"
      :footer="true"
      cancelText="关闭"
      okText=""
      @close="onClose"
      @cancel="onCancel"
      @ok="onConfirm"
      v-show="showDialog">
      <div v-for="(item,i) in areaList" :key="i" class="area_banner">
        <div :class="'area_pic_box bg_btn'+(i===selectedIndex?' cur_area_box':'')" @click="selectArea(i);">
          <img :src="item.imgUrl" :mode="item.isHeightFix?'heightFix':'widthFix'"
            :class="item.isHeightFix?'area_pic_h':'area_pic_w'" />
        </div>
        <div class="area_info_box">
          <div class="area_name">{{item.name}}</div>
          <div class="area_uid">UID: {{item.id}}</div>
          <div class="area_createtime">Create Time: {{item.createTime}}</div>
          <div class="area_tools">
            <div class="btn_tools bg_btn use_btn" @click="doUseMap(i);">USE</div>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script>
import { AXRobot, AppMode } from '@autoxing/robot-js-sdk-dev'
import { Configs } from '../../../static/js/configs'
import Dialog from '../../components/Dialog'

export default {
  name: 'changemap',
  components: {Dialog},
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
      showDialog: false,
      curAreaId: null,
      areaList: [],
      selectedIndex: -1
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
            this.showMap()
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
    async showMap () {
      let stateObj = await this.axRobot.getState()
      if (stateObj && stateObj.areaId) {
        this.curAreaId = stateObj.areaId
        this.axMap = await this.axRobot.createMap('map')
        this.axMap.setAreaMap(stateObj.areaId)
      }
    },
    changeMap () {
      if (this.areaList.length > 0) {
        this.selectedIndex = -1
        let len = this.areaList.length
        for (let i = 0; i < len; i++) {
          let itemObj = this.areaList[i]
          if (itemObj.id === this.curAreaId) {
            this.selectedIndex = i
            break
          }
        }
        this.onDialog()
        return
      }
      this.showLoading()
      let that = this
      this.axRobot.getAreaList().then(r => {
        if (r.status === 200) {
          let list = r.data.list
          that.setAreaList(list)
        }
        this.hideLoading()
        this.onDialog()
      })
    },
    getImgSize (url) {
      return new Promise((resolve, reject) => {
        let imgObj = new Image()
        imgObj.src = url
        imgObj.onload = () => {
          resolve([imgObj.width, imgObj.height])
        }
      })
    },
    async setAreaList (list) {
      this.areaList = []
      if (list) {
        let len = list.length
        for (let i = 0; i < len; i++) {
          let itemObj = list[i]
          let picBuf = await this.axRobot.getAreaPic(itemObj.id)
          itemObj.imgUrl = URL.createObjectURL(new Blob([picBuf], {
            type: 'image/png'
          }))
          if (itemObj.id === this.curAreaId) {
            this.selectedIndex = i
          }
          let imgSizes = await this.getImgSize(itemObj.imgUrl)
          itemObj.isHeightFix = true
          if ((imgSizes[0] / imgSizes[1]) > (180 / 120)) {
            itemObj.isHeightFix = false
          }
          this.areaList.push(itemObj)
        }
      }
    },
    selectArea (index) {
      this.selectedIndex = index
    },
    async doUseMap (index) {
      let itemObj = this.areaList[index]
      if (this.curAreaId === itemObj.id) {
        this.showDialog = false
        return
      }
      this.showLoading()
      let isOk = await this.axRobot.resetMap(itemObj.id)
      if (isOk === true) {
        this.showDialog = false
        this.curAreaId = itemObj.id
        this.axMap.setAreaMap(itemObj.id)
      }
      this.hideLoading()
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
    onConfirm () { // “确定”按钮回调
      this.showDialog = false
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
  left: 0px;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
}
.angle_btn {
  margin-right: 8px;
}
.area_banner {
  width: 100%;
  display: flex;
}
.area_pic_box {
  width: 180px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #333;
  margin: 5px 0px;
  border-radius: 5px;
}
.cur_area_box {
  border: 2px solid #ff0000;
}
.area_pic_h {
  width: 0;
  display: block;
  height: 100%;
  width: auto;
}
.area_pic_w {
  height: 0;
  display: block;
  width: 100%;
  height: auto;
}
.area_info_box {
  width: calc(100% - 180px);
  height: 120px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  padding: 0px 20px;
  box-sizing: border-box;
}
.area_name {
  font-size: 16px;
  font-weight: bold;
  color: #353535;
}
.area_uid {
  font-size: 14px;
  color: #8f9bb3;
}
.area_createtime {
  font-size: 14px;
  color: #222;
}
.area_tools {
  font-size: 14px;
  color: #222;
}
.use_btn {
  min-width: 50px;
  height: 30px;
  font-weight: bold;
  margin-top: 5px;
}
</style>
