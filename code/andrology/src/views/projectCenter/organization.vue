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
        机构管理
      </el-col>
      <el-col
        :span="6"
        class="btnGroup"
      ><button
          class="primary"
          @click="showDialog = true"
        >
          增加机构
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
    <add-organization
      :title="rowData.organizationId?'编辑机构':'增加机构'"
      :type="rowData.organizationId?'edit':'add'"
      :data="rowData"
      @close="hideDialog"
      @refresh="getList"
      v-if="showDialog"
    />
  </div>
</template>


<script>
import addOrganization from './_addOrganization.vue'
import paginationMixin from '@/views/index/paginationMixin.js'
export default {
  mixins: [paginationMixin],
  components: { addOrganization },
  data () {
    return {
      filterForm: {
        orgType: '',
        orgClassify: '',
        orgName: ''
      },
      filterRepeat: [
        [
          {
            prop: 'orgType', label: '机构类型', type: 'radio', span: 6, repeat: [
              { label: '全部', value: '' },
              { label: '医疗中心', value: '医疗中心' },
              { label: '其他', value: '其他' }
            ]
          },
          {
            prop: 'orgClassify', label: '机构分类', type: 'radio', span: 9, repeat: [
              { label: '全部', value: '' },
              { label: '医疗机构', value: '医疗机构' },
              { label: '健医', value: '健医' },
              { label: '企业', value: '企业' },
              { label: '保险公司', value: '保险公司' }
            ]
          }, { prop: 'orgName', label: '机构名称', type: 'input', span: 9, repeat: [{ prop: 'orgName' }] }]
      ],
      fileTableHeader: [
        { prop: 'index', label: '序号', width: 100, type: 'index' },
        { prop: 'orgType', label: '机构类型' },
        { prop: 'orgClassify', label: '机构分类' },
        { prop: 'orgName', label: '机构名称' },
        { prop: 'orgShortname', label: '机构简称' },
        { prop: 'targetNum', label: '目标数' },
        { prop: 'finishNum', label: '完成目标' },
        { prop: 'modifyDate', label: '最后修改时间' },
        {
          prop: 'btnList', label: '操作', btnList: [
            { text: '编辑', click: row => this.onBtn(row, 'edit') },
            { text: '删除', click: row => this.onBtn(row, 'del') },
          ]
        }
      ],
      showDialog: false,
      rowData: {}
    }
  },
  async created () {
    await this.getList()
  },
  methods: {
    async getList () {
      this.list = (await this.request(this.api.andrology.projectMgt.getProjectOrgList)).data
      this.pagination.currentPage = 1
      this.pagination.total = this.list.length
      this.onPage({})
      this.ready = true
    },
    hideDialog () {
      this.showDialog = false
      this.rowData = {}
    },
    async onBtn (row, type) {
      switch (type) {
        case 'edit':
          this.rowData = row
          console.log(row, type);
          this.showDialog = true
          break;
        case 'del':
          await this.request(this.api.andrology.projectMgt.deleteProjectOrg, row)
          await this.getList()
          break;
      }
    }
  }
}
</script>