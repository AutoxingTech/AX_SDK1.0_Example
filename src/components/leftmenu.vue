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
  watch: {
    '$i18n.locale' (newValue) {
      this.initMenuItems()
    }
  },
  data () {
    return {
      menuItems: [],
      menuIndex: 0,
      childIndex: -1
    }
  },
  onLoad () {},
  mounted () {
    this.initMenuItems()
    this.init()
  },
  onShow () {},
  methods: {
    initMenuItems () {
      this.menuItems = [
        {
          name: this.$t('leftMenuSDKInit'),
          page: '/'
        },
        {
          name: this.$t('leftMenuConnectRobot'),
          page: 'connect'
        },
        {
          name: this.$t('leftMenuMapAndPosition'),
          page: '/',
          childs: [
            {
              name: this.$t('leftMenuMapShowMap'),
              page: 'showmap'
            },
            {
              name: this.$t('leftMenuChangeMap'),
              page: 'changemap'
            },
            {
              name: this.$t('leftMenuUpdateMap'),
              page: 'updatemap'
            },
            {
              name: this.$t('leftMenuRealPose'),
              page: 'realpose'
            },
            {
              name: this.$t('leftMenuRelocation'),
              page: 'relocation'
            }
          ]
        },
        {
          name: this.$t('leftMenuRobotMove'),
          page: '/',
          childs: [
            {
              name: this.$t('leftMenuChangeMoveMode'),
              page: 'motionmode'
            },
            {
              name: this.$t('leftMenuStep'),
              page: 'step'
            },
            {
              name: this.$t('leftMenuRocker'),
              page: 'rocker'
            },
            {
              name: this.$t('leftMenuMapTo'),
              page: 'mapto'
            },
            {
              name: this.$t('leftMenuPoiTo'),
              page: 'poito'
            },
            {
              name: this.$t('leftMenuMultiPoiTo'),
              page: 'multipoito'
            },
            {
              name: this.$t('leftMenuGoHome'),
              page: 'gohome'
            },
            {
              name: this.$t('leftMenuSetSpeed'),
              page: 'setspeed'
            },
            {
              name: this.$t('leftMenuSetVolume'),
              page: 'setvolume'
            }
          ]
        },
        {
          name: this.$t('leftMenuHardwareControl'),
          page: '/',
          childs: [
            {
              name: this.$t('leftMenuLightBelt'),
              page: 'lightbelt'
            },
            {
              name: this.$t('leftMenuBoxDoor'),
              page: 'boxdoor'
            },
            {
              name: this.$t('leftMenuSprayer'),
              page: 'sprayer'
            }
          ]
        },
        {
          name: this.$t('leftMenuActionTask'),
          page: '/',
          childs: [
            {
              name: this.$t('leftMenuPoiAction'),
              page: 'poiaction'
            },
            {
              name: this.$t('leftMenuNumTask'),
              page: 'numtask'
            }
            // {
            //   name: '任务结束自动回充',
            //   page: ''
            // },
            // {
            //   name: '跨层执行任务',
            //   page: ''
            // },
            // {
            //   name: '配送任务',
            //   page: ''
            // },
            // {
            //   name: '消杀任务',
            //   page: ''
            // },
            // {
            //   name: '写字楼任务',
            //   page: ''
            // },
            // {
            //   name: '引领任务',
            //   page: ''
            // },
            // {
            //   name: '电话取物任务',
            //   page: ''
            // }
          ]
        }
      ]
      this.$forceUpdate()
    },
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
