<template>
  <div id="app">
    <myHeader></myHeader>
    <div class="body_left"><leftmenu :showPage="showPage"></leftmenu></div>
    <div class="body_right">
      <keep-alive>
        <router-view :showLoading="showLoading" :hideLoading="hideLoading" :toast="toast" />
      </keep-alive>
    </div>
    <Loading ref="Loading"></Loading>
    <toast ref="toast"></toast>
  </div>
</template>

<script>
import myHeader from './components/myHeader'
import leftmenu from './components/leftmenu'
import Loading from './components/Loading'
import Toast from './components/Toast'

export default {
  name: 'App',
  components: { myHeader, leftmenu, Loading, Toast },
  data () {
    return {
    }
  },
  methods: {
    showLoading: function (text) {
      this.$refs.Loading.show(text)
    },
    hideLoading: function () {
      this.$refs.Loading.hide()
    },
    toast: function (text) {
      this.$refs.toast.show(text)
    },
    showPage: function (name, param) {
      let curPageName = this.$route.name
      if (curPageName === name || (curPageName === 'init' && name === '/')) {
        return
      }
      let pageName = name
      if (typeof param === 'string' && param !== '') {
        pageName += '/' + param
      }
      let targetPage = pageName
      if (targetPage.indexOf('/') === -1) {
        targetPage = '/' + pageName
      }
      this.$router.replace(targetPage)
    }
  }
}
</script>
<style scoped>
.body_left {
  width: 258px;
  height: 100%;
  float: left;
}
.body_right {
  width: calc(100% - 258px);
  height: 100%;
  float: left;
}
</style>
<style>
* {
    margin:0;
    padding:0;
    list-style:none;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0px;
  width:100%;
  height:100%;
  min-width: 1000px;
}
html {
  width:100%;
  height:100%;
  margin:0;
  padding:0;
}
body {
  -webkit-touch-callout:none;
  -webkit-user-select:none;
  -khtml-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
  overflow-x:hidden;
  overflow-y:hidden;
  position:fixed;
  top: 0px;
  width:100%;
  height:100%;
  margin:0;
  padding:0;
  box-sizing:border-box;
  font-family:'MicrosoftYaHei';
}
.div_center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.bg_btn {
  border: none;
  outline: none;
  -webkit-appearance: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  cursor: pointer;
}
.bg_btn:active {
  background: #eff1f3;
}
.clear {
  clear: both;
  width: 100%;
  height: 0px;
}
</style>
<style scoped>
.header {
  width: 100%;
  height: 60px;
}
</style>
