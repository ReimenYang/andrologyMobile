<template>
  <view class="bg">
    <p-header
      backIcon="show"
      :title="title"
    />
    <p-wrap
      :hasHeader="true"
      :hasFooter="true"
    >
      <xnw-from
        :config="infoKeys"
        ref="baseInfo"
      />
    </p-wrap>
    <xnw-footer
      @onConfirm="onConfirm"
      @onCancel="onCancel"
    />
  </view>
</template>

<script>
export default {
  data () {
    return {
      title: '新增受试者',
      infoKeys: {
        data: [
          { key: 'patientName', title: '患者姓名', input: { value: '', placeholder: '必填' } },
          { key: 'patientPhone', title: '联系电话', input: { value: '', placeholder: '必填' } },
          { key: 'patientIdentity', title: '身份证号', input: { value: '', placeholder: '' } },
          { key: 'patientWeixin', title: '微信号', input: { value: '', placeholder: '' } },
          { key: 'patientAdmission', title: '住院号', input: { value: '', placeholder: '' } }
        ]
      }
    }
  },
  async onLoad () {
    window.Y = this
    console.log(this.options)
    this.title = this.options.patientId ? '编辑受试者' : '新增受试者',
      document.title = this.title
    if (!this.options.patientId) return
    if (!this.globalData.patientInfo) this.globalData.patientInfo = (await this.request(this.api.andrology.crf.getPatientInfo, this.options)).data
    this.infoKeys.data.forEach(item => item.input.value = this.globalData.patientInfo[item.key])
  },
  methods: {
    async onConfirm () {
      let form = this.$refs.baseInfo.getFromData()
      let message = []
      if (!form.patientName) message.push('患者姓名')
      if (!form.patientPhone) message.push('联系电话')
      if (message.length) return this.toast('请输入正确' + message.join('，'))
      let res = await this.request(this.api.andrology.patient[this.options.patientId ? 'modifyPatient' : 'newPatient'], { ...form, ...this.options })
      if (res.code !== 200) return
      this.toast('保存成功')
      uni.navigateBack()
    },
    onCancel () {
      uni.navigateBack()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
