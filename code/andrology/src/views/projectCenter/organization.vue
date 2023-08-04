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
      title="增加机构"
      @close="hideDialog"
      @refresh="getList"
      v-if="showDialog"
    />
  </div>
</template>


<script>
import addOrganization from './_addOrganization.vue'
export default {
  components: { addOrganization },
  data () {
    return {
      list: [],
      filterShow: true,
      fromProp: { labelWidth: '130px' },
      filterForm: {
        orgType: '',
        orgClassify: '',
        orgName: ''
      },
      filterRepeat: [
        [
          {
            prop: 'orgType', label: '机构类型', type: 'radio', span: 5, repeat: [
              { label: '医疗中心', value: '医疗中心' },
              { label: '其他', value: '其他' }
            ]
          },
          {
            prop: 'orgClassify', label: '机构分类', type: 'radio', span: 8, repeat: [
              { label: '医疗机构', value: '医疗机构' },
              { label: '健医', value: '健医' },
              { label: '企业', value: '企业' },
              { label: '保险公司', value: '保险公司' }
            ]
          }, { prop: 'orgName', label: '机构名称', type: 'input', span: 11, repeat: [{ prop: 'orgName' }] }]
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
      pagination: { ...this.globalData.pagination, pageSizes: [1, 2, 10, 20], pageSize: 2, currentPage: 1 },
      showDialog: false,
      resultList: []
    }
  },
  async created () {
    window.Y = this
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
    },
    async onBtn (row, type) {
      switch (type) {
        case 'edit':
          console.log(row, type);
          break;
        case 'del':
          await this.request(this.api.andrology.projectMgt.deleteProjectOrg, row)
          await this.getList()
          break;
      }
    },
    onPage ({ current = this.pagination.currentPage || 1, size = this.pagination.pageSize }) {
      this.resultList = this.list.slice((current - 1) * size, current * size)
      this.pagination.currentPage = current
      this.pagination.pageSize = size
    },
    async onFilter () {
      await this.getList()
      this.list = this.list.filter(item => {
        let _boolen = true
        for (let { prop, type } of this.filterRepeat.flat()) {
          let _value = this.filterForm[prop]
          if (!_value) continue
          switch (type) {
            case 'input':
              _boolen = item[prop].includes(_value)
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