<template>
  <div class="header">
    <div class="filter">
      <div>统计范围:</div>
      <xnw-template-form
        style="margin-bottom: -14px;"
        :data="form"
        :repeat="formRepeat"
      />
      <button
        class="btn primary"
        @click="getList"
      >
        查看统计
      </button>
    </div>
    <div>
      <button
        class="btn primary"
        @click="exportAskReport"
      >
        导出报告
      </button>
    </div>
  </div>
  <el-table
    :data="list"
    :span-method="spanM"
  >
    <el-table-column
      v-for="col in tableHeader"
      :key="col.name"
      v-bind="col"
    >
      <template v-if="col.list">
        <el-table-column
          v-for="_col in col.list"
          :key="_col.name"
          v-bind="_col"
        /></template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  data () {
    return {
      list: [],
      tableHeader: [
        { prop: 'stageName', label: '访视' },
        { prop: 'questionnaireTypeName', label: '表单' },
        { prop: 'systemAskNum', label: '系统质疑数' },
        { prop: 'manualAskNum', label: '人工质疑数' },
        { prop: 'totalAskNum', label: '质疑总数' },
        { prop: 'closedAskNum', label: '已关闭质疑数' },
        {
          prop: '', label: '未关闭质疑数', list: [
            { prop: 'answeredAskNum', label: '已回答数' },
            { prop: 'notAnswerAskNum', label: '未回答数' },
            { prop: 'notCloseAskNum', label: '未关闭数' }
          ]
        }
      ],
      form: { organizationId: '' },
      formRepeat: [[{
        prop: 'organizationId', label: '所属机构', type: 'select', repeat: [
          {
            options: [
              { label: '全部', value: '' },
              ...this.globalData.orgList.map(({ orgName, organizationId }) => ({ label: orgName, value: organizationId }))
            ]
          }]
      }]],
    }
  },
  async created () {
    await this.getList()
  },
  methods: {
    spanM ({ row, columnIndex }) {
      if (columnIndex !== 0) return
      return row.colspan ? row.colspan : [0, 0]
    },
    async getList () {
      let _list = (await this.request(this.api.andrology.crf.getAskReport, this.form)).data
      this.list = _list.map(
        ({ stageId, stageName, questionnaireList }) =>
          questionnaireList.map(
            (item, i) =>
              i ? item : { stageId, stageName, colspan: [questionnaireList.length, 1], ...item, })
      ).flat()
    },
    async exportAskReport () {
      let res = await this.request(this.api.andrology.crf.exportAskReport, this.form, { headers: this.globalData.headers, responseType: 'blob' })
      let url = window.URL.createObjectURL(new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
      window.open(url, '_blank')
    }
  }
}
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 10px;
  align-items: center;
  background-color: #fff;
  .filter {
    display: flex;
    align-items: center;
  }
}
</style>