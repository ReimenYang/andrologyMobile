<template>
  <el-descriptions :column="1" border>
    <el-descriptions-item :label="col.label" v-for="col in infoKeys" :key="col.prop">
      <xnwFromComponent :col="col" :form="form" />
    </el-descriptions-item>
  </el-descriptions>
</template>
<script>

import mixin from '@/views/index/mixin.js'
export default {
  name: 'addDevice',
  mixins: [mixin],
  data () {
    return {
      infoKeys: [
        { prop: 'projectName', label: '治疗项目', type: 'select', repeat: [{ options: [], onChange: this.getDeviceId }] },
        { prop: 'numberOfTreatments', label: '治疗次数', type: 'input', repeat: [{ prop: 'numberOfTreatments', placeholder: '请输入治疗次数', type: 'number', max: 50, min: 0, }] },
        { prop: 'remark', label: '备注', type: 'input', repeat: [{ prop: 'remark', type: 'textarea', placeholder: '选填' }] }
      ],
      form: {
        projectName: '',
        projectId: '',
        numberOfTreatments: '',
        remark: ''
      }
    }
  },
  async created () {
    await this.init(this.form, this.infoKeys)
  },
  methods: {
    getDeviceId (projectName) {
      this.form.projectId = this.globalData.project.find(item => item.projectName === projectName).id
      // this.form.deviceId = this.globalData.studioInfo.deviceList.find(item => item.deviceType === deviceType).id
    },
  }
}
</script>