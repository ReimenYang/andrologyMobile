<template>
  <xnw-template-list :tableHeader="tableHeader" :tableData="data">
    <template #default />
  </xnw-template-list>
</template>
<script>

import mixin from '@/views/index/mixin.js'
export default {
  name: 'changeLog',
  mixins: [mixin],
  props: {
    data: {
      type: Array,
      default () { return [] }
    }
  },
  data () {
    return {
      tableHeader: [
        { prop: 'index', label: '序号', width: 100, type: 'index' },
        { prop: 'realName', label: '操作时间' },
        { prop: 'phone', label: '操作类型' },
        { prop: 'numberOfProjects', label: '操作人' },
        { prop: 'incompleteCount', label: '治疗总次数' },
        { prop: 'latestAppointmentTime', label: '签到次数' },
        { prop: 'lastTreatmentTime', label: '剩余治疗次数' },
        { prop: 'remark', label: '备注' }
      ],
    }
  },
  async created () {
    // await this.init(this.form, this.infoKeys)
  },
  methods: {
    getDeviceId (projectName) {
      this.form.projectId = this.globalData.project.find(item => item.projectName === projectName).id
      // this.form.deviceId = this.globalData.studioInfo.deviceList.find(item => item.deviceType === deviceType).id
    },
  }
}
</script>