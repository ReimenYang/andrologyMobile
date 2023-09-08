<template>
  <div>
    <el-row
      type="flex"
      align="middle"
      class="topbar"
    >
      <el-col
        :span="20"
        class="topbarTitle"
      >
        受试者管理
      </el-col>
      <el-col
        :span="4"
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
      :date="rowData"
      v-if="uploadFileDialog"
    />
    <screening-info
      :title="screeningTitle"
      @close="hideDialog"
      @refresh="getList"
      :date="rowData"
      v-if="screeningDialog"
    />
  </div>
</template>

<script>
import screeningInfo from './_screeningInfo.vue'
import paginationMixin from '@/views/index/paginationMixin.js'
import testeeMixin from './testeeMixin.js'
export default {
  mixins: [paginationMixin, testeeMixin],
  components: { screeningInfo },
  data () {
    return {
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
          }, {
            prop: 'createDate', label: '创建日期', type: 'dateTimePicker', span: 12, config: { type: 'daterange' }
          }]
      ],
      fileTableHeader: [
        { prop: 'index', label: '序号', width: 55, type: 'index' },
        { prop: 'patientCode', label: '编号', width: 110 },
        { prop: 'patientState', label: '状态', width: 70 },
        { prop: 'patientName', label: '姓名', width: 100 },
        { prop: 'patientPhone', label: '手机号', width: 110 },
        // { prop: 'patientIdentity', label: '身份证', width: 170 },
        // { prop: 'patientAdmission', label: '住院号', width: 100 },
        // { prop: 'patientWeixin', label: '微信号', width: 110 },
        { prop: 'groupName', label: '所属组', width: 100 },
        { prop: 'organization', label: '所属机构', width: 100 },
        { prop: 'createDate', label: '创建日期', width: 100 }
      ]
    }
  },
  async created () {
    window.Y = this
    this.fileTableHeader.push(this.btnListJson)
    await this.getList()
  },
  methods: {
    async getList () {
      this.list = (await this.request(this.api.andrology.patient.getPatientList)).data
      this.list.forEach(item => {
        item.patientId = item.id
        item.createDate = item.createDate.slice(0, 10)
      });
      this.onPage({})
      this.ready = true
    }
  }
}
</script>