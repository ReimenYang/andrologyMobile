<template>
  <div>
    <el-row
      type="flex"
      align="middle"
      class="topbar"
    >
      <el-col
        :span="18"
        class="topbarTitle"
      >
        受试者管理
      </el-col>
      <el-col
        :span="6"
        class="btnGroup"
      ><button
          class="primary"
          @click="showDialog = true"
        >
          增加受试者
        </button>
      </el-col>
    </el-row>
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
    <add-testee
      :title="rowData.id?'编辑受试者':'增加受试者'"
      :type="rowData.id?'edit':'add'"
      :data="rowData"
      @close="hideDialog"
      @refresh="getList"
      v-if="showDialog"
    />
    <upload-file
      title="上传文件"
      @close="hideDialog"
      :date="rowDate"
      v-if="uploadFileDialog"
    />
    <screening-info
      title="筛查详情"
      @close="hideDialog"
      @refresh="getList"
      :date="rowDate"
      v-if="screeningDialog"
    />
  </div>
</template>


<script>
import addTestee from './_addTestee.vue'
import uploadFile from './_uploadFile.vue'
import screeningInfo from './_screeningInfo.vue'
export default {
  components: { addTestee, uploadFile, screeningInfo },
  data () {
    return {
      list: [],
      filterShow: true,
      fromProp: { labelWidth: '130px' },
      filterForm: {
        patientCode: '',
        patientName: '',
        patientPhone: '',
        patientAdmission: '',
        patientWeixin: '',
        patientIdentity: '',
        groupName: '',
        organization: '',
        patientState: [],
        createDate: ''
      },
      filterRepeat: [
        [
          {
            prop: 'patientCode', label: '编号', type: 'input', span: 6, repeat: [{ prop: 'patientCode' }]
          }, {
            prop: 'patientName', label: '姓名', type: 'input', span: 6, repeat: [{ prop: 'patientName' }]
          }, {
            prop: 'patientPhone', label: '手机号', type: 'input', span: 6, repeat: [{ prop: 'patientPhone' }]
          }, {
            prop: 'patientAdmission', label: '住院号', type: 'input', span: 6, repeat: [{ prop: 'patientAdmission' }]
          }], [{
            prop: 'patientWeixin', label: '微信号', type: 'input', span: 6, repeat: [{ prop: 'patientWeixin' }]
          }, {
            prop: 'patientIdentity', label: '身份证号', type: 'input', span: 6, repeat: [{ prop: 'patientIdentity' }]
          }, {
            prop: 'groupName', label: '所属组', type: 'select', span: 6, repeat: [{ options: this.globalData.groupList.map(({ groupName }) => ({ label: groupName, value: groupName })) }]
          }, {
            prop: 'organization', label: '所属机构', type: 'select', span: 6, repeat: [{ options: this.globalData.orgList.map(({ orgName }) => ({ label: orgName, value: orgName })) }]
          }], [{
            prop: 'patientState', label: '患者状态', type: 'checkbox', span: 12, repeat: [
              { label: '未入组', value: '未入组' },
              { label: '已入组', value: '已入组' },
              { label: '排除', value: '排除' },
              { label: '完成', value: '完成' },
              { label: '脱落', value: '脱落' },
              { label: '中止', value: '中止' },
            ]
          }], [{
            prop: 'createDate', label: '创建日期', type: 'dateTimePicker', span: 6, config: { type: 'daterange' }
          }]
      ],
      fileTableHeader: [
        { prop: 'index', label: '序号', width: 55, type: 'index' },
        { prop: 'patientCode', label: '编号', width: 110 },
        { prop: 'patientState', label: '状态', width: 70 },
        { prop: 'patientName', label: '姓名', width: 80 },
        { prop: 'patientPhone', label: '手机号', width: 110 },
        { prop: 'patientIdentity', label: '身份证', width: 170 },
        { prop: 'patientAdmission', label: '住院号', width: 100 },
        { prop: 'patientWeixin', label: '微信号', width: 110 },
        { prop: 'groupName', label: '所属组', width: 100 },
        { prop: 'organization', label: '所属机构', width: 100 },
        { prop: 'createDate', label: '创建日期', width: 160 },
        {
          prop: 'btnList', label: '操作', btnList: [
            { text: '编辑', click: row => this.onBtn(row, 'edit') },
            { text: '筛查详情', click: row => this.onBtn(row, 'filterInfo') },
            { text: '筛查', click: row => this.onBtn(row, 'filter') },
            // { text: '入组', click: row => this.onBtn(row, 'join'), condition: row => !row.groupName },
            // { text: '排除', click: row => this.onBtn(row, 'exclude'), condition: row => !!row.groupName },
            { text: '完成', click: row => this.onBtn(row, 'finish') },
            { text: '中止', click: row => this.onBtn(row, 'stop') },
            { text: '脱落', click: row => this.onBtn(row, 'falloff') },
            { text: 'CRF录入', click: row => this.onBtn(row, 'CRF') },
            { text: '上传文件', click: row => this.onBtn(row, 'upload') },
            { text: '签名', click: row => this.onBtn(row, 'signature') },
            { text: '删除', click: row => this.onBtn(row, 'del') },
          ]
        }
      ],
      pagination: {},
      showDialog: false,
      rowDate: {},
      resultList: [],
      uploadFileDialog: false,
      screeningDialog: false,
      // screeningType: 'join',
      rowData: {}
    }
  },
  async created () {
    await this.getList()
  },
  methods: {
    async getList () {
      this.list = (await this.request(this.api.andrology.patient.getPatientList)).data
      this.list.forEach(item => item.patientId = item.id);
      this.pagination = { ...this.globalData.pagination, total: this.list.length, }
      this.onPage({})
      this.ready = true
    },
    hideDialog () {
      this.showDialog = this.uploadFileDialog = this.screeningDialog = false
      this.rowData = {}
    },
    async onBtn (row, type) {
      this.rowDate = row
      switch (type) {
        case 'CRF':
          this.$router.push('/crf?patientId=' + row.id)
          break;
        case 'edit':
          this.rowData = row
          console.log(row, type);
          this.showDialog = true
          break;
        case 'join':
        case 'exclude':
        case 'filter':
        case 'filterInfo':
          // this.screeningType = type
          this.screeningDialog = true
          console.log(row, type);
          break;
        case 'signature':
        case 'finish':
        case 'stop':
        case 'falloff':
          await this.request(this.api.andrology.patient[type], row)
          break;
        case 'upload':
          this.uploadFileDialog = true
          break;
        case 'del':
          await this.request(this.api.andrology.patient.deletePatient, row)
          await this.getList()
          break;
      }
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