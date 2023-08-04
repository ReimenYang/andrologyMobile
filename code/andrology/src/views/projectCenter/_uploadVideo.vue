

<template>
  <el-dialog
    top="5vh"
    :title="title"
    v-model="showDialog"
    :width="width"
  >
    <upload-video
      :uploadApi="api.andrology.file.updateFile"
      :auth="auth"
      @close="close"
      @finish="finish"
    />
  </el-dialog>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: () => '新增'
    }
  },
  data () {
    return {
      showDialog: true,
      width: '600px',
      auth: {},
      uploader: {}
    }
  },
  // 在实例创建完成后被立即调用。在这一步，实例已完成以下配置：数据观测（data observer）
  // 属性和方法的运算，watch/event事件回调。但是，挂载阶段还没开始，$el属性目前不可见
  async created () {
    this.auth = (await this.request(this.api.andrology.file.getUpdateVideoInfo, { fileName: "string.mp4", title: "string" })).data
  },
  methods: {
    finish (fileList) {
      this.$emit('close')
      this.$emit('finish', fileList)
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>