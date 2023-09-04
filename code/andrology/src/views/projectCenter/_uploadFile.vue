<template>
  <el-dialog
    top="5vh"
    :title="title"
    v-model="showDialog"
    :width="width"
  >
    <upload-file
      :uploadApi="api.andrology.file.updateFile"
      @finish="finish"
      @close="$emit('close')"
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
      width: '600px'
    }
  },
  methods: {
    async finish (fileList) {
      // 上传结果做得不够细致
      let list = fileList.map(item => item.response.data)
      let res = await this.request(this.api.andrology.projectMgt.addProjectFile, list)
      if (res.code !== 200) return
      this.$emit('close')
      this.$emit('refresh')
    }
  }
}
</script>