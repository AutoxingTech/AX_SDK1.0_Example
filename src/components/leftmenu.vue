<template>
  <div class="menubox">
    <div v-for="(item, index) in menuItems"
      :key="index" :class="'menu_banner' + (index !== 0 ? ' menu_banner_margin' : '')">
      <div :class="'menu_item' + getParentMenuCls(index)"
        @click="onMenuItemClick(index)">
        <div class="menu_name_parent">{{item.name}}</div>
      </div>
      <div v-for="(child, cIndex) in item.childs"
        :key="cIndex" :class="'menu_child_item' + getChildMenuCls(index, cIndex)"
        @click="onMenuChildClick(index, cIndex)">
        {{child.name}}
      </div>
    </div>
    <div style="width: 100%;height: 20px;"></div>
  </div>
</template>

<script>
export default {
  props: {
    showPage: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      menuItems: [
        {
          name: 'SDK初始化',
          page: '/'
        },
        {
          name: '连接机器人',
          page: 'connect'
        },
        {
          name: '地图与位置',
          page: '/',
          childs: [
            {
              name: '地图显示',
              page: 'showmap'
            },
            {
              name: '切换地图',
              page: 'changemap'
            },
            {
              name: '更新地图',
              page: 'updatemap'
            },
            {
              name: '机器人实时状态',
              page: 'realpose'
            },
            {
              name: '重新定位',
              page: 'relocation'
            }
          ]
        },
        {
          name: '机器人运动',
          page: '/',
          childs: [
            {
              name: '切换运动模式',
              page: 'motionmode'
            },
            {
              name: '单步运动',
              page: 'step'
            },
            {
              name: '双步运动（摇杆）',
              page: 'rocker'
            },
            {
              name: '点选定点运动（地图）',
              page: 'mapto'
            },
            {
              name: '站点定点运动',
              page: 'poito'
            },
            {
              name: '多站点运动',
              page: 'multipoito'
            },
            {
              name: '回桩充电',
              page: 'gohome'
            },
            {
              name: '设置速度',
              page: 'setspeed'
            },
            {
              name: '设置音量',
              page: 'setvolume'
            }
          ]
        },
        {
          name: '硬件控制',
          page: '/',
          childs: [
            {
              name: '灯带控制',
              page: 'lightbelt'
            },
            {
              name: '箱门控制',
              page: 'boxdoor'
            },
            {
              name: '喷雾器控制',
              page: 'sprayer'
            }
          ]
        },
        {
          name: '动作任务',
          page: '/',
          childs: [
            {
              name: '站点动作任务',
              page: 'poiaction'
            },
            {
              name: '按次数执行任务',
              page: 'numtask'
            },
            {
              name: '任务结束自动回充',
              page: ''
            },
            {
              name: '跨层执行任务',
              page: ''
            },
            {
              name: '配送任务',
              page: ''
            },
            {
              name: '消杀任务',
              page: ''
            },
            {
              name: '写字楼任务',
              page: ''
            },
            {
              name: '引领任务',
              page: ''
            },
            {
              name: '电话取物任务',
              page: ''
            }
          ]
        }
      ],
      menuIndex: 0,
      childIndex: -1
    }
  },
  onLoad () {},
  mounted () {
    this.init()
  },
  onShow () {},
  methods: {
    init: function () {
      this.setCurMenuIndex()
    },
    setCurMenuIndex: function () {
      let curPageUrl = this.$route.name
      if (!curPageUrl) {
        return
      }
      this.menuIndex = -1
      this.childIndex = -1
      let len = this.menuItems.length
      for (let i = 0; i < len; i++) {
        let item = this.menuItems[i]
        let childs = item.childs
        if (childs) {
          for (let j = 0; j < childs.length; j++) {
            let childItem = childs[j]
            if (this.setIndexWithParam(curPageUrl, childItem.page, i, j)) {
              return
            }
          }
          continue
        }
        if (this.setIndexWithParam(curPageUrl, item.page, i, -1)) {
          return
        }
      }
    },
    setIndexWithParam: function (pUrl, page, pIndex, cIndex = -1) {
      if (!page) {
        return false
      }
      let name = page
      if (name === '/') {
        name = 'init'
      }
      if (name === pUrl) {
        this.menuIndex = pIndex
        this.childIndex = cIndex
        return true
      }
      return false
    },
    onMenuItemClick: function (index) {
      if (this.menuIndex === index) {
        return
      }
      let itemObj = this.menuItems[index]
      if (itemObj.childs && itemObj.childs.length > 0) {
        return
      }
      if (itemObj.page !== '') {
        this.menuIndex = index
        this.childIndex = -1
        this.showPage(itemObj.page)
      }
    },
    onMenuChildClick: function (index, childIndex) {
      if (this.menuIndex === index && this.childIndex === childIndex) {
        return
      }
      let itemObj = this.menuItems[index].childs[childIndex]
      if (itemObj.page !== '') {
        this.menuIndex = index
        this.childIndex = childIndex
        this.showPage(itemObj.page)
      }
    },
    getParentMenuCls: function (index) {
      if (index === this.menuIndex && this.childIndex === -1) {
        return ' menu_item_focus'
      } else {
        let itemObj = this.menuItems[index]
        if (itemObj.childs && itemObj.childs.length > 0) {
          return ''
        } else {
          return ' bg_btn'
        }
      }
    },
    getChildMenuCls: function (index, childIndex) {
      if (this.menuIndex === index && this.childIndex === childIndex) {
        return ' menu_item_focus'
      } else {
        return ' bg_btn'
      }
    }
  }
}
</script>

<style scoped>
.menubox {
  position: relative;
  width: 100%;
  height: auto;
  min-height: 100%;
  box-sizing: border-box;
  padding-top: 20px;
}
.menubox::after {
  content: "";
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  width: 1px;
  height: 100%;
  border-right: 1px solid #c0bfc4;
  color: #c0bfc4;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleX(0.5);
  transform: scaleX(0.5);
  flex-shrink: 0;
}
.menu_banner {
  width: 100%;
}
.menu_banner_margin {
  margin: 0px 0px;
}
.menu_item {
  width: 100%;
  height: 50px;
  font-size: 18px;
  color: #3f3f3f;
  padding: 0px 35px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.menu_item_focus {
  background: #eff1f3;
  color: #26c268 !important;
}
.menu_name_parent {
  margin-left: 15px;
}
.menu_child_item {
  width: 100%;
  height: 38px;
  font-size: 14px;
  color: #353535;
  padding: 0px 10px 0px 76px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>
