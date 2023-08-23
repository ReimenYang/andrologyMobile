<template>
  <el-dialog
    top="5vh"
    :title="title"
    v-model="showDialog"
    :width="width"
  >
    <video-player :playUrl="playUrl" />
  </el-dialog>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: () => '播放视频'
    },
    playUrl: {
      type: String,
      default: () => ''
    }
  },
  watch: {
    showDialog: function () {
      if (!this.showDialog) this.$emit('close')
    }
  },
  data () {
    return {
      showDialog: true,
      width: '1440px'
    }
  }
}
</script>