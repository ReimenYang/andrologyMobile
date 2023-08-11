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
export default {
  components: { askInfo },
  data () {
    return {
      list: [],
      filterShow: true,
      fromProp: { labelWidth: '130px' },
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
            prop: 'questionTitle', label: '问题编号', type: 'input', span: 6, repeat: [{ prop: 'questionTitle' }]
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
      pagination: {},
      showDialog: false,
      rowDate: {},
      resultList: []
    }
  },
  async created () {
    await this.getList()
  },
  methods: {
    async getList () {
      this.list = (await this.request(this.api.andrology.crf.getAskList)).data
      this.pagination = { ...this.globalData.pagination, total: this.list.length, }
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
    },
    onPage ({ current = this.pagination.currentPage || 1, size = this.pagination.pageSize }, list = this.list) {
      this.resultList = list.slice((current - 1) * size, current * size)
      this.pagination.currentPage = current
      this.pagination.pageSize = size
    },
    async onFilter () {
      await this.getList()
      this.list = this.list.filter(item => {
        let _boolen = true
        let _createDate = ''
        for (let { prop, type } of this.filterRepeat.flat()) {
          let _value = this.filterForm[prop]
          if (!_value) continue
          switch (type) {
            case 'input':
              _boolen = item[prop].includes(_value)
              break;
            case 'dateTimePicker':
              if (_value.length) {
                _createDate = new Date(item.createDate.replace(/-/img, '/'))
                _boolen = _value[0] < _createDate && _createDate < (_value[1] - 0 + 1000 * 60 * 60 * 24)
              }
              break;
            case 'checkbox':
              if (_value.length) _boolen = _value.includes(item[prop])
              break;
            default:
              _boolen = item[prop] === _value
              break;
          }
          if (!_boolen) break
        }
        return _boolen
      })
      this.pagination.total = this.list.length
      return this.onPage({})
    }
  }
}
</script>
<style lang="scss" scoped>
.topbar {
  padding: 10px 0;
  .topbarTitle {
    font-size: 18px;
  }
  .btnGroup {
    display: block;
    text-align: right;
  }
}
</style>