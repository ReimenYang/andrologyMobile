<template>
  <view class="bg">
    <p-header
      backIcon="show"
      title="受试者CRF"
    />
    <p-wrap
      :hasHeader="true"
      :hasFooter="true"
    >
      <xnw-from
        v-if="ready"
        :config="infoKeys"
        ref="baseInfo"
      />
      <view style="padding: 30rpx 0 0 30rpx;font-size: var(--font-h4);">
        填写问卷
      </view>
      <xnw-from
        v-if="ready"
        :config="{data:patientInfo.stageList}"
        ref="stageList"
      />
    </p-wrap>
    <xnw-footer>
      <view class="btnGroup">
        <view
          v-for="btn in btnList"
          :key="btn.text"
          class="btn"
          @click="btn.click(patientInfo)"
          v-show="btn.condition(patientInfo)"
        >
          {{ btn.text }}
        </view>
      </view>
    </xnw-footer>

    <xnw-dialog
      v-bind="dialog"
      v-if="showDialog"
    >
      <view
        class="box"
        @click="onBtn('finish')"
      >
        完成
      </view>
      <view
        class="box"
        @click="onBtn('stop')"
      >
        中止
      </view>
      <view
        class="box"
        @click="onBtn('falloff')"
      >
        脱落
      </view>
    </xnw-dialog>
    <xnw-dialog
      v-bind="signatureDialog"
      v-if="showSignatureDialog"
    >
      <uploadImg
        :api="api.andrology.file.updateFile"
        @onSuccess="uploadSuccess"
      />
    </xnw-dialog>
  </view>
</template>

<script>
import uploadImg from '@/libs/components/uniapp/uploadImg/uploadImg.vue'
export default {
  components: { uploadImg },
  data () {
    return {
      ready: false,
      patientInfo: {},
      infoKeys: {
        data: [
          { key: '', title: '受试者信息', link: { class: 'iconfont icon-edit-square' } },
          { key: 'patientName', title: '姓名', textContent: '' },
          { key: 'patientCode', title: '受试者编号', textContent: '' },
          { key: 'patientPhone', title: '联系电话', textContent: '' },
          { key: 'patientIdentity', title: '身份证', textContent: '' },
          { key: 'patientAdmission', title: '住院号', textContent: '' },
          { key: 'patientWeixin', title: '微信号', textContent: '' },
          { key: 'patientState', title: '状态', textContent: '' },
          // { key: 'patientAdmission', title: '知情同意书' }
        ]
      },
      btnList: [
        { text: '受试者文件', click: () => this.onBtn('upload'), condition: () => this.globalData.projectState === '已开始' },
        { text: '筛查', click: () => this.onBtn('filter'), condition: row => this.globalData.projectState === '已开始' && row.patientState === '未入组' },
        { text: '筛查详情', click: () => this.onBtn('filterInfo'), condition: row => row.patientState !== '未入组' },
        { text: '签名', click: () => this.onBtn('signature'), condition: row => this.globalData.projectState === '已开始' && !row.signatureDate && this.globalData.projectState === '已开始' },
        { text: '更改研究状态', click: () => this.onBtn('changeState'), condition: row => this.globalData.projectState === '已开始' && row.patientState === '已入组' },
      ],
      dialog: {
        title: '请选择更改研究状态操作',
        config: { visible: true },
        showConfirm: false,
        showClose: false,
        onClose: () => this.showDialog = false
      },
      showDialog: false,
      signatureDialog: {
        title: '上传签名',
        config: { visible: true },
        showConfirm: false,
        showClose: false,
        onClose: () => this.showSignatureDialog = false
      },
      showSignatureDialog: false
    }
  },
  async onShow () {
    window.Y = this
    await this.init()
    this.ready = true
  },
  methods: {
    async init () {
      this.globalData.patientInfo = this.patientInfo = (await this.request(this.api.andrology.crf.getPatientInfo, this.options)).data
      this.patientInfo.id = this.patientInfo.patientId
      this.infoKeys.data.forEach(item => item.textContent = this.patientInfo[item.key])
      this.infoKeys.data[0].url = `/pages/testee/add?patientId=${this.patientInfo.patientId}`
      this.patientInfo.stageList.forEach(item => {
        item.title = item.stageName
        item.link = {}
        item.url = `/pages/crf/paper?patientId=${this.patientInfo.patientId}&stageId=${item.stageId}&stageName=${item.stageName}`
      })
    },
    async setState (type) {
      let typeLabel = {
        signature: '签名',
        finish: '完成',
        stop: '中止',
        falloff: '脱落',
      }[type]
      uni.showModal({
        content: `确认${typeLabel + this.patientInfo.patientName}？`,
        success: async res => {
          if (res.cancel) return
          await this.request(this.api.andrology.patient[type], this.patientInfo)
          this.showDialog = this.showSignatureDialog = false
          await this.init()
          this.toast('设置成功')
        }
      })
    },
    async uploadSuccess (list) {
      console.log('uploadSuccess', list)
      let res = await this.request(this.api.andrology.user.modifyUserInfo, { ...this.globalData.userInfo, userSignatureUrl: list.fileUrl })
      if (res.code !== 200) return
      this.globalData.userInfo.userSignatureUrl = list.url
      return this.setState('signature')
    },
    async onBtn (type) {
      switch (type) {
        case 'changeState':
          this.showDialog = true
          break
        case 'signature':
          if (!this.globalData.userInfo.userSignatureUrl) this.globalData.userInfo = (await this.request(this.api.andrology.user.getUserInfo)).data
          if (this.globalData.userInfo.userSignatureUrl) return this.setState(type)

          uni.showModal({
            content: '签名未上传，现在上传？',
            success: async res => {
              if (res.cancel) return
              this.showSignatureDialog = true
            }
          })
          break
        case 'upload':
          uni.navigateTo({ url: '/pages/crf/uploadFile?patientId=' + this.patientInfo.patientId })
          break
        case 'filter':
        case 'filterInfo':
          uni.navigateTo({ url: '/pages/crf/screeningInfo?patientId=' + this.patientInfo.patientId })
          break
        case 'finish':
        case 'stop':
        case 'falloff':
          this.setState(type)
          break
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.box {
  width: 70vw;
  margin: 40rpx;
  border-radius: 1.5em;
  line-height: 3;
  text-align: center;
  color: #fff;
  background-color: var(--theme-color);
}
</style>
