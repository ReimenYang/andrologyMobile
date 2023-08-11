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
        用户管理
      </el-col>
      <el-col
        :span="6"
        class="btnGroup"
      ><button
          class="primary"
          @click="showDialog = true"
        >
          关联用户
        </button>
        <button
          class="primary"
          @click="getRole"
        >
          添加用户
        </button>
        <button
          class="primary"
          @click="sandMsg"
        >
          发邀请短信
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
    <join-user
      ref="joinUser"
      title="关联用户"
      @close="hideDialog"
      @refresh="getList"
      @addUser="getRole"
      v-if="showDialog"
    />
    <add-user
      :title="rowData.roleName?'编辑用户':'添加用户'"
      :roleList="roleList"
      :data="rowData"
      :type="rowData.roleName?'edit':'add'"
      @close="hideAddUserDialog"
      @refresh="getList"
      v-if="addUserDialog"
    />
  </div>
</template>


<script>
import joinUser from './_joinUser.vue'
import addUser from './_addUser.vue'
export default {
  components: { joinUser, addUser },
  data () {
    return {
      list: [],
      filterShow: true,
      fromProp: { labelWidth: '130px' },
      filterForm: {
        projectRole: '',
        roleName: '',
        dataPrivilege: '全部机构',
        userName: '',
        userPhone: '',
        userEmail: '',
        organizationName: ''
      },
      filterRepeat: [
        [
          {
            prop: 'projectRole',
            label: '项目角色',
            type: 'select', span: 6,
            repeat: [{
              options: [{ label: '全部', value: '' }, { label: '申办方', value: '申办方' }, { label: '项目维护者', value: '项目维护者' }, { label: '主要研究者', value: '主要研究者' }, { label: '次要研究者', value: '次要研究者' }, { label: '临床检查员', value: '临床检查员' }, { label: '数据经理', value: '数据经理' }],
              placeholder: '请选择'
            }]
          }, {
            prop: 'organizationName', label: '机构名称', type: 'select', span: 6, repeat: [
              { options: this.globalData.orgList.map(({ orgName }) => ({ label: orgName, value: orgName })), placeholder: '请选择' }
            ]
          },
          {
            prop: 'dataPrivilege', label: '数据权限', type: 'select', span: 6, repeat: [
              { options: [{ label: '全部机构', value: '' }, { label: '本机构', value: '本机构' }] }
            ]
          }], [
          { prop: 'userName', label: '用户姓名', type: 'input', span: 6, repeat: [{ prop: 'userName' }] },
          { prop: 'userPhone', label: '手机号码', type: 'input', span: 6, repeat: [{ prop: 'userPhone' }] },
          { prop: 'userEmail', label: '邮箱地址', type: 'input', span: 6, repeat: [{ prop: 'userEmail' }] }
        ]
      ],
      fileTableHeader: [
        { prop: 'index', label: '序号', width: 100, type: 'index' },
        { prop: 'userName', label: '用户姓名' },
        { prop: 'userPhone', label: '手机号码' },
        { prop: 'userEmail', label: '邮箱地址' },
        { prop: 'userPosition', label: '身份' },
        { prop: 'userTitle', label: '职称' },
        { prop: 'organizationName', label: '所属机构' },
        { prop: 'projectRole', label: '项目角色' },
        { prop: 'roleName', label: '权限角色名称' },
        { prop: 'dataPrivilege', label: '数据权限' },
        {
          prop: 'btnList', label: '操作', width: 250, btnList: [
            { text: '编辑', click: row => this.onBtn(row, 'edit') },
            { text: '启用', click: row => this.onBtn(row, 'enableProjectUser'), condition: row => row.enable === 'N' },
            { text: '停用', click: row => this.onBtn(row, 'disableProjectUser'), condition: row => row.enable === 'Y' },
            { text: '删除', click: row => this.onBtn(row, 'deleteProjectUser') },
          ]
        }
      ],
      pagination: { ...this.globalData.pagination },
      showDialog: false,
      addUserDialog: false,
      rowData: {},
      roleList: [],
      resultList: []
    }
  },
  async created () {
    window.Y = this
    await this.getList()
  },
  methods: {
    async getList () {
      this.list = (await this.request(this.api.andrology.projectMgt.getProjectUserList)).data
      this.list.forEach(item => {
        item.organizationName = item.organization.organizationName
        item.organizationId = item.organization.organizationId
        item.roleName = item.role.roleName
        item.enableLabel = { N: '停用', Y: '启用' }[item.enable]
      })
      this.pagination.currentPage = 1
      this.pagination.total = this.list.length
      this.onPage({})
      this.ready = true
    },
    async getRole (row) {
      this.rowData = row
      this.roleList = (await this.request(this.api.andrology.projectMgt.getProjectRoleList)).data
      this.addUserDialog = true
    },
    hideDialog () {
      this.showDialog = this.addUserDialog = false
      this.rowData = {}
    },
    hideAddUserDialog () {
      if (this.showDialog) this.$refs.joinUser.getList()
      this.rowData = {}
      this.addUserDialog = false

    },
    async onBtn (row, type) {
      switch (type) {
        case 'edit':
          return this.getRole(row)
        case 'enableProjectUser':
        case 'disableProjectUser':
        case 'deleteProjectUser':
          await this.request(this.api.andrology.projectMgt[type], row)
          await this.getList()
          break;
      }
    },
    async sandMsg () {
      let userIdList = this.resultList.map(item => item.userId).join()
      await this.request(this.api.andrology.projectMgt.sendProjectSMS, { userIdList })
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