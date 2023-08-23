<template>
  <div>
    <xnw-template-list
      :filterShow="filterShow"
      :fromProp="fromProp"
      :filterForm="filterForm"
      :filterRepeat="filterRepeat"
      :tableHeader="fileTableHeader"
      :tableData="resultList"
      :pagination="pagination"
      @sizeChange="onPage"
      @getList="onFilter"
    >
      <template #search />
      <template #default />
      <template #footer />
    </xnw-template-list>
    <ask-info
      title="质疑详情"
      @close="hideDialog"
      @refresh="refresh"
      :date="rowDate"
      v-if="showDialog"
    />
  </div>
</template>
<script>
import askInfo from './_askInfo.vue'
import paginationMixin from '@/views/index/paginationMixin.js'
export default {
  mixins: [paginationMixin],
  components: { askInfo },
  data () {
    return {
      filterForm: {
        patientCode: '',
        questionTitle: '',
        askState: ['未回答', '已回答', '已关闭',],
      },
      filterRepeat: [
        [
          {
            prop: 'patientCode', label: '受试者编号', type: 'input', span: 6, repeat: [{ prop: 'patientCode' }]
          }, {
            prop: 'questionTitle', label: '问题', type: 'input', span: 6, repeat: [{ prop: 'questionTitle' }]
          }, {
            prop: 'askState', label: '患者状态', type: 'checkbox', span: 12, repeat: [
              { label: '未回答', value: '未回答' },
              { label: '已回答', value: '已回答' },
              { label: '已关闭', value: '已关闭' }
            ]
          }]
      ],
      fileTableHeader: [
        { prop: 'index', label: '序号', width: 55, type: 'index' },
        { prop: 'askType', label: '状态' },
        { prop: 'askState', label: '类别' },
        { prop: 'patientCode', label: '受试者编号' },
        { prop: 'questionTitle', label: '问题' },
        { prop: 'askValue', label: '回答' },
        { prop: 'createTime', label: '创建日期' },
        {
          prop: 'btnList', label: '操作', btnList: [
            { text: '详情', click: row => this.showInfo(row) }
          ]
        }
      ],
      showDialog: false,
      rowDate: {}
    }
  },
  async created () {
    await this.getList()
  },
  methods: {
    async getList () {
      this.list = (await this.request(this.api.andrology.crf.getAskList)).data
      this.pagination.currentPage = 1
      this.pagination.total = this.list.length
      this.onPage({})
      this.ready = true
    },
    hideDialog () {
      this.showDialog = false
    },
    async showInfo (row) {
      this.rowDate = row
      this.showDialog = true
    },
    async refresh () {
      await this.getList()
      this.rowDate = this.list.find(item => this.rowDate.askId === item.askId)
    }
  }
}
</script>