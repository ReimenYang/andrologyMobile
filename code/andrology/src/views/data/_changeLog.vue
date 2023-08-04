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
      filterForm: {
        realName: '',
        phone: '',
        studioId: this.globalData.studioId
      },
      tableHeader: [
        { prop: 'index', label: '序号', width: 100, type: 'index' },
        { prop: 'updateTime', label: '操作时间' },
        { prop: 'phone', label: '操作类型' },
        { prop: 'numberOfProjects', label: '操作人' },
        { prop: 'deviceType', label: '设备名称' },
        { prop: 'status', label: '是否启用' },
      ],
    }
  },
  async created () {
    // await this.init(this.form, this.infoKeys)
  },
  methods: {
  }
}
</script>