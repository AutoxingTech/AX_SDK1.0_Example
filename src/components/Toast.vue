<template>
  <div class="toast" v-show="isShow">{{text}}</div>
</template>

<script>
export default {
  name: 'Toast',
  props: {
  },
  data () {
    return {
      isShow: false,
      text: '系统繁忙，请稍后再试！',
      toastTimer: null
    }
  },
  watch: {
  },
  methods: {
    cleanTimer: function () {
      if (this.toastTimer !== null) {
        window.clearTimeout(this.toastTimer)
      }
      this.toastTimer = null
    },
    show: function (text) {
      this.text = text
      this.isShow = true
      this.cleanTimer()
      this.toastTimer = window.setTimeout(() => {
        this.isShow = false
      }, 2000)
    }
  },
  mounted () {
  },
  created () {
  }
}
</script>

<style scoped>
.toast {
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 0.875rem;
  line-height: 1;
  padding: 10px;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 80%;
  transform: translate(-50%,-50%);
  -webkit-transform: translate(-50%,-50%);
  -moz-transform: translate(-50%,-50%);
  -o-transform: translate(-50%,-50%);
  -ms-transform: translate(-50%,-50%);
  z-index: 9999;
}
</style>
