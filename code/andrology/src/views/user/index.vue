<template>
  <xnw-template-list
    :tableHeader="tableHeader"
    :pagination="pagination"
    :tableData="list"
    @getList="getList"
    @sizeChange="getList"
    @currentChange="getList"
  >
    <template #search>
      <div class="header">
        <div class="search"><el-input
            v-model="filterForm.realName"
            placeholder='请输入姓名/电话查找'
          /><el-button
            type="primary"
            @click="getList"
          >搜 索</el-button></div>
        <el-button
          type="primary"
          @click="dialogType = '新增患者'"
        >新增患者</el-button>
      </div>
    </template>
    <template #default />
    <template #footer />
  </xnw-template-list>
  <dialogs
    :tableOpen="tableOpen"
    :deviceInfo="deviceInfo"
    :seeRecordInfo="seeRecordInfo"
    :dialogType="dialogType"
    :studio="studio"
    @close="dialogType = ''"
    @refresh="getList"
  />
  <!--查看患者治疗项目开通记录  -->
  <el-dialog
    top="5vh"
    title="用户记录"
    v-model="seeRecordDialog"
    width="70%"
  >
    <user-record
      v-if="seeRecordDialog"
      :tableOpen="tableOpen"
      :deviceInfo="deviceInfo"
      :seeRecordInfo="seeRecordInfo"
      :studio="studio"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="seeRecordDialog = false">关 闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import userRecord from '@/views/user/_userRecord.vue'
import dialogs from '@/views/user/_dialogs.vue'
export default {
  name: 'userList',
  components: { userRecord, dialogs },
  data () {
    return {
      filterForm: {
        realName: '',
        phone: '',
        studioId: this.globalData.studioId
      },
      tableHeader: [
        { prop: 'index', label: '序号', width: 100, type: 'index' },
        { prop: 'realName', label: '患者姓名' },
        { prop: 'phone', label: '联系电话' },
        { prop: 'numberOfProjects', label: '项目数量' },
        { prop: 'incompleteCount', label: '未完成次数' },
        { prop: 'latestAppointmentTime', label: '最近预约时间' },
        { prop: 'lastTreatmentTime', label: '最近治疗时间' },
        {
          prop: 'btnList', label: '操作', btnList: [
            { text: '添加项目', click: this.addDevice, bind: { round: true, type: "primary" } },
            { text: '查看', click: this.seeClick, bind: { round: true, type: "primary" } },
          ]
        }
      ],
      studio: {
        studioName: this.globalData.studioInfo.studioName,
        studioId: this.globalData.studioId
      },
      list: [],
      pagination: this.globalData.pagination,
      seeRecordDialog: false,
      deviceInfo: {},
      seeRecordInfo: {},
      multipleSelection: [],
      tableOpen: [],
      tableRecord: [],
      recordList: {},
      schemeTimesInfo: {},
      userInfo: {},
      addBookingInfo: {},
      dateList: [],
      timeList: [],
      device: '',
      date: '',
      time: '',
      params: {},
      showDialog: false,
      dialogType: ''
    }
  },
  async created () {
    await this.getList({})
    this.globalData.seeClick = this.seeClick
  },
  watch: {
    seeRecordDialog: function () {
      if (this.seeRecordDialog) return
      this.getList({})
      this.seeRecordInfo = []
    }
  },
  methods: {
    async getList ({ current = this.pagination.currentPage, size = this.pagination.pageSize }) {
      let data = (await this.request(this.api.adminSms.patientStudio.page, { ...this.filterForm, current, size })).data
      this.list = data.records
      this.pagination.total = data.total
      this.pagination.size = data.size
      this.pagination.currentPage = data.current
    },
    addDevice (row) {
      this.deviceInfo = row
      this.dialogType = '添加治疗项目'
    },
    async seeClick (row = this.seeRecordInfo) {
      if (this.tableOpen.length && this.tableOpen[0].userId !== row.userId) this.tableOpen.length = 0
      let tableOpen = (await this.request(this.api.adminSms.equityRecord.page, { current: 1, size: 20, userId: row.userId, studioId: this.globalData.studioId })).data.records
      for (let item of tableOpen) {
        let target = this.tableOpen.find(obj => obj.id === item.id)
        if (!target) this.tableOpen.push(item)
        else for (let name in item) target[name] = item[name]
      }
      row.countProjects = row.countTreatments = row.countIncomplete = 0
      if (this.tableOpen.length) {
        row.countProjects = this.tableOpen[0].countProjects
        row.countTreatments = this.tableOpen[0].countTreatments
        row.countIncomplete = this.tableOpen[0].countIncomplete
      }
      this.seeRecordInfo = row
      this.seeRecordDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  padding: 10px;
  display: flex;
  justify-content: space-between;

  .search {
    display: flex;
  }
}
</style>
