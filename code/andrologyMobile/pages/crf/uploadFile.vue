<template>
  <view class="bg">
    <p-header
      backIcon="show"
      title="文件列表"
    />
    <p-wrap
      :hasHeader="true"
      v-if="ready"
    >
      <view class="tabs">
        <view
          v-for="tab in tabPane"
          :key="tab.key"
          @click="changeTab(tab)"
          class="tab"
          :class="{active:activeTab===tab.name}"
        >
          {{ tab.name }}
        </view>
      </view>
      <view class="tabPane">
        <uploadImg
          v-for="tab in tabPane"
          :key="tab.key"
          :imgList="tab.dataList"
          mode="multiple"
          :maxNum="999"
          :api="api.andrology.file.updateFile"
          @onSuccess="uploadSuccess"
          @onDel="delImage"
          v-show="activeTab===tab.name"
        />
      </view>
    </p-wrap>
  </view>
</template>

<script>
import uploadImg from '@/libs/components/uniapp/uploadImg/uploadImg.vue'
export default {
  components: { uploadImg },
  data () {
    return {
      ready: false,
      patientFileInfo: {},
      activeTab: '知情同意书',
      tabPane: [
        { key: 'consentList', name: '知情同意书', dataList: [] },
        { key: 'imageList', name: '图片', dataList: [] },
        { key: 'fileList', name: '其他文件', dataList: [] }],
    }
  },
  async onLoad () {
    await this.getList()
  },
  methods: {
    async getList () {
      this.ready = false
      this.patientFileInfo = (await this.request(this.api.andrology.patient.getPatientFileInfo, this.options)).data
      Object.keys(this.patientFileInfo).forEach(key => {
        let _item = this.patientFileInfo[key]

        _item.forEach(item => {
          item.name = item.fileName
          item.url = item.fileUrl
        })
        let tab = this.tabPane.find(item => item.key === key)
        tab.dataList = _item
      })
      this.ready = true
    },
    async changeTab (tab) {
      this.activeTab = tab.name
    },
    async uploadSuccess (list) {
      console.log('uploadSuccess', list)
      let _data = list.filter(item => !item.url)
      let res = await this.request(this.api.andrology.patient.addPatientFile, { ...this.options, fileType: this.activeTab, list: _data })
      if (res.code !== 200) return
      await this.getList()
    },
    async delImage (list, obj) {
      console.log('delImage', list, obj)
      if (obj.id) await this.request(this.api.andrology.patient.deletePatientFile, { fileId: obj.id })
    }
  }
}
</script>
<style lang="scss" scoped>
.tabs {
  width: 100%;
  display: flex;
  text-align: center;
  line-height: 3;
  .tab {
    flex: 1;
    &.active {
      color: var(--theme-color);
      background-color: #fff;
    }
  }
}
.tabPane {
  padding: 20rpx;
  background: #fff;
  /deep/ .bg-img {
    border: var(--border-normal);
    display: inline-block;
  }
}
</style>
