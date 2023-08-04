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
  data () {
    return {
      showDialog: true,
      width: '600px'
    }
  }
}
</script>