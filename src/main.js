// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 引入插件和语言包
import VueI18n from 'vue-i18n'
import zh from './i18n/langs/zh'
import en from './i18n/langs/en'
Vue.use(VueI18n)

// 自动设置多语言 默认选择浏览器系统语言
// 判断当前浏览器使用的语言
const navLang = navigator.language
const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false
let lang = localStorage.getItem('example-language') || localLang || 'en-US' // 如果有缓存，取缓存的语言
const i18n = new VueI18n({
  locale: lang,
  messages: {
    'zh': zh, // 中文语言包
    'en': en // 英文语言包
  },
  silentTranslationWarn: true
})

// 最后缓存当前使用的语言
localStorage.setItem('example-language', lang)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  components: { App },
  template: '<App/>'
})
