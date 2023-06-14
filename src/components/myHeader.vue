<template>
  <div class="main">
    <div class="main_header">
      <div class="header_left">{{$t('myHeaderTitle')}}</div>
      <div class="locale_banner div_center">
        <div @click="changeLocale('zh-CN')" :class="'zh_label bg_btn'+(locale==='zh-CN'?' selected_label':'')">中文</div>
        <div @click="changeLocale('en-US')" :class="'en_label bg_btn'+(locale==='en-US'?' selected_label':'')">EN</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      locale: 'zh-CN'
    }
  },
  mounted () {
    this.locale = localStorage.getItem('example-language')
  },
  methods: {
    changeLocale: function (lang) {
      this.locale = lang
      this.$i18n.locale = lang
      localStorage.setItem('example-language', lang)
    }
  }
}
</script>

<style scoped>
.main {
  width: 100%;
}
.main_header {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 60px;
  background: #ffffff;
  box-shadow: 0px 1px 2px 0px #ddd;
}
.header_left {
  float: left;
  height: 100%;
  font-size: 25px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0px 20px;
  box-sizing: border-box;
}
.locale_banner {
  float: right;
  height: 100%;
  font-size: 14px;
  color: #a3a3a3;
  padding: 0px 20px;
}
.zh_label {
  padding-right: 10px;
  border-right: 1px solid #e4e8eb;
  display: inline-block;
  line-height: 12px;
  background: none;
}
.en_label {
  padding-left: 10px;
  display: inline-block;
  line-height: 12px;
  background: none;
}
.selected_label {
  color: #222;
  font-weight: 600;
}
</style>
