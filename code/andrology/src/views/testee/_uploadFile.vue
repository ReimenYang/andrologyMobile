<template>
  <el-dialog
    top="5vh"
    :title="title"
    v-model="showDialog"
    :width="width"
  >
    <el-tabs
      v-model="activeName"
      class="demo-tabs"
      v-if="ready"
    >
      <el-tab-pane
        v-for="{key,name,listType,dataList} in tabPane"
        :key="key"
        :label="name"
        :name="name"
      >
        <upload-file
          :uploadApi="api.andrology.file.updateFile"
          :config="{listType,autoUpload: true,onRemove: delFile}"
          :dataList="dataList"
          @finish="finish"
        />
      </el-tab-pane>
    </el-tabs>

  </el-dialog>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: () => '新增'
    },
    date: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      ready: false,
      showDialog: true,
      tabPane: [
        { key: 'consentList', name: '知情同意书', listType: 'picture-card', dataList: [] },
        { key: 'imageList', name: '图片', listType: 'picture-card', dataList: [] },
        { key: 'fileList', name: '其他文件', listType: 'text', dataList: [] }],
      activeName: '知情同意书',
      width: '600px'
    }
  },
  watch: {
    showDialog: function () {
      if (!this.showDialog) this.$emit('close')
    }
  },
  async created () {
    await this.getList()
  },
  methods: {
    async getList () {
      this.ready = false
      let _data = (await this.request(this.api.andrology.patient.getPatientFileInfo, { patientId: this.date.id || this.date.patientId })).data
      Object.keys(_data).forEach(key => {
        let _item = _data[key]

        _item.forEach(item => {
          item.name = item.fileName
          item.url = item.fileUrl
        })
        let tab = this.tabPane.find(item => item.key === key)
        tab.dataList = _item
      })
      this.ready = true
    },
    async delFile (file) {
      if (file.id) await this.request(this.api.andrology.patient.deletePatientFile, { fileId: file.id })
    },
    async finish (fileList) {
      // 上传结果做得不够细致
      console.log(fileList)
      let list = fileList.filter(item => item.response).map(item => item.response.data)
      let res = await this.request(this.api.andrology.patient.addPatientFile, { patientId: this.date.id || this.date.patientId, fileType: this.activeName, list })
      if (res.code !== 200) return
      await this.getList()
      this.$emit('refresh')
    }
  }
}
</script>