<template>
  <div class="m-dialog-mask">
    <div class="m-modal" :style="`width: ${width}px;`">
      <div class="m-modal-content">
        <svg @click="onClose" class="u-close" viewBox="64 64 896 896" data-icon="close" aria-hidden="true" focusable="false"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg>
        <div class="m-modal-header">
          <div class="u-head">{{ title }}</div>
        </div>
        <div class="m-modal-body">
          <slot>{{ content }}</slot>
        </div>
        <div class="m-modal-footer" v-show="footer">
          <button v-if="cancelText&&cancelText!==''" class="u-cancel" @click="onCancel">{{ cancelText }}</button>
          <button v-if="okText&&okText!==''" class="u-confirm" @click="onConfirm">{{ okText }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Dialog',
  props: {
    title: { // 标题
      type: String,
      default: '提示'
    },
    content: { // 内容
      type: String,
      default: ''
    },
    width: { // 宽度，默认640
      type: Number,
      default: 640
    },
    cancelText: { // 取消按钮文字
      type: String,
      default: '取消'
    },
    okText: { // 确认按钮文字
      type: String,
      default: '确定'
    },
    footer: { // 是否显示底部按钮，默认显示
      type: Boolean,
      default: true
    }
  },
  methods: {
    onClose () {
      this.$emit('close')
    },
    onCancel () {
      this.$emit('cancel')
    },
    onConfirm () {
      this.$emit('ok')
    }
  }
}
</script>
<style scoped>
.m-dialog-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background: rgba(0,0,0,0.45);
}
.m-modal {
  position: relative;
  top: calc(50% - 240px);
  margin: 0 auto;
}
.m-modal-content {
  position: relative;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0,0,0,.1);
}
.m-modal-header {
  height: 22px;
  padding: 16px 24px;
  color: rgba(0,0,0,.65);
  border-radius: 4px 4px 0 0;
  border-bottom: 1px solid #e8e8e8;
}
.m-modal-body {
  height: 324px;
  padding: 24px;
  font-size: 16px;
  line-height: 1.5;
  word-wrap: break-word;
  overflow: auto;
}
.m-modal-footer {
  padding: 10px 16px;
  text-align: center;
  border-top: 1px solid #e8e8e8;
}
.u-close {
  width: 16px;
  height: 16px;
  position: absolute;
  top: 19px;
  right: 24px;
  fill: rgba(0,0,0,.45);
  font-size: 18px;
  line-height: 22px;
  cursor: pointer;
  transition: color .3s;
}
.u-close:hover {
  fill: rgba(0,0,0,.75);
}
.u-head {
  margin: 0;
  color: rgba(0,0,0,.85);
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  word-wrap: break-word;
}
.u-cancel {
  height: 32px;
  line-height: 32px;
  padding: 0 15px;
  font-size: 16px;
  border-radius: 4px;
  color: rgba(0,0,0,.65);
  background: #fff;
  border: 1px solid #d9d9d9;
  cursor: pointer;
  transition: all .3s cubic-bezier(.645,.045,.355,1);
}
.u-cancel:hover {
  color: #40a9ff;
  border-color: #40a9ff;
}
.u-cancel:focus {
  color: #096dd9;
  border-color: #096dd9;
}
.u-confirm {
  margin-left: 8px;
  height: 32px;
  line-height: 32px;
  padding: 0 15px;
  font-size: 16px;
  border-radius: 4px;
  background: #1890ff;
  border: 1px solid #1890ff;
  color: #fff;
  transition: all .3s cubic-bezier(.645,.045,.355,1);
  cursor: pointer;
}
.u-confirm:hover {
  color: #fff;
  background: #40a9ff;
  border-color: #40a9ff;
}
.u-confirm:focus {
  background: #096dd9;
  border-color: #096dd9;
}
</style>
