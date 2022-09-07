<template>
  <div v-show="isShow">
      <div class="progress_mask"></div>
      <div class="progress_dialog dialog_banner">
          努力加载中...
      </div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
  },
  data () {
    return {
      isShow: false,
      text: '努力加载中...'
    }
  },
  methods: {
    show: function (text) {
      this.text = '努力加载中...'
      if (typeof text === 'string' &&
        text !== '') {
        this.text = text
      }
      this.isShow = true
    },
    hide: function () {
      this.isShow = false
    }
  },
  mounted () {
  },
  created () {
  }
}
</script>

<style scoped>
.progress_mask {
  position:fixed;
  z-index: 10000;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}
.progress_dialog {
  position: fixed;
  z-index: 50000;
  width: 80%;
  max-width: 300px;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  background-color: #FFFFFF;
  text-align: center;
  border-radius: 3px;
  overflow: hidden;
}
.dialog_banner {
  height: 50px;
  line-height: 50px;
  max-width: 160px;
  background-color: rgba(30, 30, 30, 0.9);
  font-size: 12px;
  color: #fff;
}
</style>
