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
    <followup-record
      title="随访详情"
      @close="hideDialog"
      :date="rowDate"
      v-if="showDialog"
    />
    <followup-remark
      title="随访备注"
      @close="hideDialog"
      @finish="getList"
      :date="rowDate"
      v-if="remarkDialog"
    />
  </div>
</template>


<script>
import followupRecord from './_followupRecord.vue'
import followupRemark from './_followupRemark.vue'
import paginationMixin from '@/views/index/paginationMixin.js'
export default {
  mixins: [paginationMixin],
  components: { followupRecord, followupRemark },
  provide () {
    return {
      testTarget: () => this
    }
  },
  data () {
    return {
      filterForm: {
        patientCode: '',
        questionTitle: '',
        askState: ['未开始', '进行中', '已完成'],
        patientState: ['未入组', '已入组', '排除', '完成', '脱落', '中止']
      },
      filterRepeat: [
        [{
          prop: 'patientCode', label: '编号', type: 'input', span: 6, repeat: [{ prop: 'patientCode' }]
        }, {
          prop: 'patientName', label: '姓名', type: 'input', span: 6, repeat: [{ prop: 'patientName' }]
        }, {
          prop: 'patientPhone', label: '手机号', type: 'input', span: 6, repeat: [{ prop: 'patientPhone' }]
        }, {
          prop: 'patientWeixin', label: '微信号', type: 'input', span: 6, repeat: [{ prop: 'patientWeixin' }]
        }], [{
          prop: 'followupRemark', label: '备注', type: 'input', span: 6, repeat: [{ prop: 'followupRemark' }]
        }, {
          prop: 'organizationName', label: '所属机构', type: 'select', span: 6, repeat: [{ options: this.globalData.orgList.map(({ orgName }) => ({ label: orgName, value: orgName })) }]
        }, {
          prop: 'askState', label: '随访状态', type: 'checkbox', span: 6, repeat: [
            { label: '未开始', value: '未开始' },
            { label: '进行中', value: '进行中' },
            { label: '已完成', value: '已完成' }
          ]
        }]
      ],
      fileTableHeader: [
        { prop: 'index', label: '序号', width: 55, type: 'index' },
        { prop: 'organizationName', label: '所属机构' },
        { prop: 'followupState', label: '随访状态' },
        { prop: 'patientCode', label: '编号' },
        { prop: 'patientName', label: '姓名' },
        { prop: 'patientPhone', label: '手机号码' },
        { prop: 'patientWeixin', label: '微信号' },
        { prop: 'followupNums', label: '随访次数' },
        { prop: 'followupRemark', label: '备注' },
        { prop: 'lastFollowupDate', label: '最近随访时间' },
        {
          prop: 'btnList', label: '操作', width: 300, btnList: [
            { text: '详情', click: row => this.onBtn(row, 'info') },
            { text: '备注', click: row => this.onBtn(row, 'remark') }
          ]
        }
      ],
      showDialog: false,
      rowDate: {},
      remarkDialog: false
    }
  },
  async created () {
    await this.getList()
  },
  methods: {
    async getList () {
      this.ready = false
      this.list = (await this.request(this.api.andrology.crf.getFollowupList)).data
      this.list.forEach(item => {
        item.askState = item.followupState.startsWith('第') ? '进行中' : item.followupState
      });

      this.onPage({})
      this.ready = true
    },
    hideDialog () {
      this.showDialog = this.remarkDialog = false
    },
    async onBtn (row, type) {
      this.rowDate = row
      switch (type) {
        case 'info':
          console.log(row, type);
          this.showDialog = true
          break;
        case 'remark':
          this.remarkDialog = true
          console.log(row, type);
          break;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.topbar {
  padding-top: 0;
}
</style>