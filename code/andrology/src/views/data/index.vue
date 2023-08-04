<template>
  <xnw-template-list
    :tableHeader="tableHeader"
    :tableData="list"
    @sortChange="sortChange"
    @getList="getList"
    :pagination="pagination"
    @sizeChange="getList"
    @currentChange="getList"
    :filterForm="filterForm"
  >
    <template #search>
      <div class="header">
        <!-- <div class="search"><el-input v-model="filterForm.deviceType" placeholder='请输入设备名称' /><el-button type="primary"
            @click="getList">搜 索</el-button></div> -->
        <el-button
          type="primary"
          @click="dialogType = '新建设备'"
        >新建设备</el-button>
      </div>
    </template>
    <template #default />
    <template #footer />
  </xnw-template-list>
  <!-- 增改设备 -->
  <el-dialog
    :title="dialogType"
    v-model="showDialog"
    width="600px"
  >
    <update-equipment
      ref="equipmentInfo"
      :data="dialogType === '新建设备' ? {} : updateDevice"
      v-if="showDialog"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button
          @click="updateList"
          type="primary"
        >确定</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 修改日志 -->
  <el-dialog
    title="修改日志"
    v-model="changeDialog"
    width="900px"
  >
    <change-log
      :data="changeLogInfo"
      v-if="changeDialog"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="changeDialog = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import updateEquipment from '@/views/equipment/_updateEquipment.vue'
import changeLog from '@/views/equipment/_changeLog.vue'
export default {
  name: 'equipmentList',
  components: { updateEquipment, changeLog },
  data () {
    return {
      filterForm: {
        column: '',
        order: '',
        deviceType: ''
      },
      tableHeader: [
        { prop: 'index', label: '序号', width: 100, type: 'index' },
        { prop: 'deviceType', label: '设备名称' },
        { prop: 'sort', label: '排序', }, //sortable: 'custom',
        { prop: 'status', label: '状态' }, //0启动 1关闭
        { prop: 'brand', label: '品牌' },
        { prop: 'model', label: '型号' },
        { prop: 'location', label: '位置' },
        {
          prop: 'btnList', label: '操作', width: 250, btnList: [
            { text: '复制新建', click: this.copyScheme, bind: { round: true } },
            { text: '编辑', click: this.updateScheme, bind: { round: true } },
            // { text: '修改日志', click: this.changeLog, bind: { round: true } },
          ]
        }
      ],
      // list: this.globalData.studioInfo.deviceList,
      list: [],
      pagination: this.globalData.pagination,
      updateDevice: {},
      showDialog: false,
      changeDialog: false,
      changeLogInfo: [],
      dialogType: ''
    }
  },
  async created () {
    await this.getList({})
  },
  watch: {
    dialogType: function () {
      this.showDialog = !!this.dialogType
    },
    showDialog: function () {
      if (!this.showDialog) this.dialogType = ''
    }
  },

  methods: {
    async getList ({ current = this.pagination.currentPage, size = this.pagination.pageSize }) {
      await this.globalData.getStudioInfo()
      // this.list = this.globalData.studioInfo.deviceList
      let params = { studioId: this.globalData.studioId, current, size }
      let data = (await this.request(this.api.adminSms.studioDevice.page, { ...params })).data
      this.list = data.records
      this.list.forEach(item => item.status = item.delFlag === '0' ? '启动' : '关闭')
      this.pagination.total = data.total
      this.pagination.size = data.size
      this.pagination.currentPage = data.current
    },
    async updateList () {
      let device = this.$refs.equipmentInfo.form
      if (!device.deviceType) return this.$message({ message: '请输入设备名称', type: 'error' })
      if (!device.sort) return this.$message({ message: '请输入排序', type: 'error' })
      if (this.dialogType === '编辑设备') {
        try {
          await this.$confirm('更新后的设置将在未开放预约的日期中生效，已开放预约的日期不受影响。', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
        } catch (e) {
          this.$message({ message: '已取消修改' })
          this.dialogType = ''
          return
        }
      }
      let params = { studioId: this.globalData.studioId, studioName: this.globalData.studioInfo.studioName, ...device, delFlag: device.delFlag ? '0' : '1' }
      let res = await this.request(this.api.adminSms.studioDevice[this.dialogType === '新建设备' || this.dialogType === '复制新建设备' ? 'save' : 'updateById'], { ...params })
      if (res.code !== 0) return
      this.$message({ message: this.dialogType + res.msg, type: 'success' })
      this.dialogType = ''
      return await this.getList({})
    },
    updateScheme (row) {
      this.updateDevice = row
      this.dialogType = '编辑设备'
    },
    changeLog (row) {
      console.log(row, 111111);
      this.changeDialog = true
    },
    copyScheme (row) {
      this.updateDevice = row
      this.dialogType = '复制新建设备'
    },
    async sortChange (e) {
      console.log(e, 111);
      this.filterForm.column = e.prop
      this.filterForm.order = { ascending: 'asc', descending: 'desc' }[e.order] || ''
      await this.getList({})
    },
    // async delScheme (row) {
    //   try {
    //     await this.$confirm('将自动取消即日起本设备的所有预约记录,不可恢复，是否确认删除本设备？', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     })
    //   } catch (e) {
    //     this.$message({ message: '已取消删除' })
    //     return
    //   }
    //   let res = await this.request(this.api.sms.studioReserveInformation.delDevices, { deviceId: row.id })
    //   if (res.code !== 0) return
    //   this.$message({ message: this.dialogType + res.msg, type: 'success' })
    //   return await this.getList()
    // },
  }
}
</script>
<style lang="scss" scoped>
.header {
  padding: 10px;
  display: flex;
  // justify-content: space-between;
  justify-content: flex-end;

  .search {
    display: flex;
  }
}
</style>

