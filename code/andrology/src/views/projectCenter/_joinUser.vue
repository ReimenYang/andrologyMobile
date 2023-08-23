<template>
  <el-dialog
    top="5vh"
    :title="title"
    v-model="showDialog"
    :width="width"
  >
    <xnw-template-list
      :filterShow="filterShow"
      :filterForm="filterForm"
      :filterRepeat="filterRepeat"
      :tableHeader="fileTableHeader"
      :tableData="list"
      @getList="getList"
    >
      <template #search />
      <template #default />
    </xnw-template-list>
  </el-dialog>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: () => '新增'
    }
  },
  data () {
    return {
      list: [],
      showDialog: true,
      width: '800px',
      filterShow: true,
      filterForm: {
        organizationName: '',
        userName: '',
        userPhone: ''
      },
      filterRepeat: [[
        { prop: 'organizationName', label: '机构名称', type: 'input', span: 8, repeat: [{ prop: 'organizationName' }] },
        { prop: 'userName', label: '用户姓名', type: 'input', span: 8, repeat: [{ prop: 'userName' }] },
        { prop: 'userPhone', label: '手机号码', type: 'input', span: 8, repeat: [{ prop: 'userPhone' }] }
      ]],
      fileTableHeader: [
        { prop: 'userName', label: '用户姓名' },
        { prop: 'userPhone', label: '手机号码' },
        { prop: 'userEmail', label: '邮箱地址' },
        { prop: 'organizationName', label: '所属机构' },
        {
          prop: 'btnList', label: '操作', width: 250, btnList: [
            { text: '邀请加入', click: row => this.$emit('addUser', row), condition: row => !row.hasAdded }
          ]
        }
      ]
    }
  },
  async created () {
    // await this.getList() hasAdded
  },
  methods: {
    async getList () {
      this.list = (await this.request(this.api.andrology.projectMgt.searchUser, this.filterForm)).data
      this.list.forEach(item => {
        item.organizationName = item.organization
        item.organization = this.globalData.orgList.find(org => org.orgName === item.organizationName)
        item.organizationId = item.organization.organizationId
      })
      this.ready = true
    }
  }
}
</script>