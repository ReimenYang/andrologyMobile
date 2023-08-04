<template>
  <div class="dialogTop">
    <div class="left">
      <span>{{ seeRecordInfo.realName }}</span>
      <span>联系电话:{{ seeRecordInfo.phone }}</span>
      <span>项目数量:{{ seeRecordInfo.countProjects }}</span>
      <span>治疗次数:{{ seeRecordInfo.countTreatments }}</span>
      <span>未完成次数:{{ seeRecordInfo.countIncomplete }}</span>
    </div>
    <div class="right">
      <el-button
        @click="addDevice"
        type="primary"
      >添加项目</el-button>
      <!-- <el-button @click="dialogType = '修改患者'">修改信息</el-button> -->
    </div>
  </div>
  <div class="tableSet">
    <div class="title">治疗项目开通记录</div>
    <el-table
      ref="tableOpen"
      border
      :data="tableOpen"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-for="col in schemeTableCol"
        :key="col.label"
        v-bind="col"
        align="center"
      >
        <template
          #default="scope"
          v-if="col.label === '操作'"
        >
          <span
            @click="changeNumClick(scope.row)"
            style="margin-right:10px;"
          >修改次数</span>
          <!-- <span @click="changeLogClick(scope.row)">修改日志</span> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="tableRecord">
    <div class="tableTop">
      <div class="left">
        <div class="title">
          <span class="spanColor">预约记录</span>
          <span>预约次数：{{ tableRecord.numberOfAppointments || 0 }}次</span>
          <span>爽约次数：{{ tableRecord.numberOfMissedAppointments || 0 }}次</span>
          <span>取消次数：{{ tableRecord.numberOfCancellations || 0 }}次</span>
        </div>
      </div>
      <div class="right">
        <el-button
          @click="addBookingClick"
          type="primary"
        >添加预约</el-button>
      </div>
    </div>
    <el-table
      class="tableContent"
      ref="tableRecord"
      border
      :data="tableRecord.record"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column
        v-for="col in recordTableCol"
        :key="col.label"
        v-bind="col"
        align="center"
      >
        <template
          #default="scope"
          v-if="col.label === '操作'"
        >
          <span
            :class="scope.row.status !== 0 ? 'graySet' : 'blueSet'"
            @click="handleRecord(scope.row, '签到')"
          >签到</span>
          <span
            :class="scope.row.status !== 0 ? 'graySet' : 'blueSet'"
            @click="handleRecord(scope.row, '取消预约')"
          >取消预约</span>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <dialogs
    :tableOpen="tableOpen"
    :deviceInfo="deviceInfo"
    :seeRecordInfo="seeRecordInfo"
    :dialogType="dialogType"
    :studio="studio"
    :schemeTimesInfo="schemeTimesInfo"
    :changeLogInfo="changeLogInfo"
    @close="dialogType = ''"
    @refresh="() => { }"
  />
</template>
<script>
import dialogs from '@/views/user/_dialogs.vue'
export default {
  name: 'userRecord',
  components: { dialogs },
  props: {
    studio: {
      type: Object,
      default () { return [] }
    },
    deviceInfo: {
      type: Object,
      default () { return {} }
    },
    tableOpen: {
      type: Array,
      default () { return [] }
    },
    seeRecordInfo: {
      type: Object,
      default () { return {} }
    }
  },
  data () {
    return {
      dialogType: '',
      schemeTableCol: [
        { type: 'selection', label: '选择', width: '55' },
        { prop: 'projectName', label: '项目记录', width: '120' },
        { prop: 'numberOfTreatments', label: '总次数', width: '120' },
        { prop: 'numberOfSignIn', label: '已签到' },
        { prop: 'numberOfRemainingTreatments', label: '剩余次数' },
        { prop: 'createTime', label: '创建时间' },
        { prop: 'createUser', label: '创建人' },
        { prop: 'remark', label: '备注', width: '180' },
        { label: '操作' }
      ],
      recordTableCol: [
        { prop: 'date', label: '预约日期', width: '180' },
        { prop: 'appointmentTime', label: '预约时间', width: '120' },
        { prop: 'projectName', label: '项目名称' },
        { prop: 'deviceType', label: '设备名称' },
        { prop: 'statusStr', label: '状态' },
        { prop: 'updateUser', label: '操作人' },
        { prop: 'updateTime', label: '操作时间' },
        { label: '操作' }
      ],
      tableRecord: {},
      schemeTimesInfo: {},
      changeLogInfo: [],
      deviceTypeIds: [],
      firstMounted: true
    }
  },
  async created () {
    this.globalData.handleSelectionChange = this.handleSelectionChange
  },
  mounted () {
    this.$refs.tableOpen.toggleAllSelection()
  },
  methods: {
    addDevice () {
      this.dialogType = '添加治疗项目'
    },
    async addBookingClick () {
      this.dialogType = '添加预约'
      this.device = ''
      this.dateList = []
    },
    changeNumClick (row) {
      this.schemeTimesInfo = row
      this.dialogType = '修改治疗项目'
    },
    changeLogClick (row) {
      //请求接口获取内容
      this.changeLogInfo = []
      this.dialogType = '修改日志'
    },
    async handleSelectionChange (val) {
      console.log(val);
      if (val) this.deviceTypeIds = val.map(item => item.id)
      if (!this.deviceTypeIds.length) return this.tableRecord = { numberOfAppointments: 0, numberOfMissedAppointments: 0, numberOfCancellations: 0 }
      let params = { ...this.studio, userId: this.seeRecordInfo.userId, equityRecordIds: this.deviceTypeIds.join() }
      let url = this.api.sms.studioReserveInformation.getUserReservationRecord.url + '?' + this.libs.object.paramsToKeyValue(params)
      this.tableRecord = (await this.request({ ...this.api.sms.studioReserveInformation.getUserReservationRecord, url })).data
      this.tableRecord.record.forEach(item => item.statusStr = ['待签到', '已取消', '已签到', '已爽约'][item.status])
    },
    async handleRecord (row, type) {
      if (row.status !== 0) return
      try {
        await this.$confirm(`${row.realName || row.userName}患者预约时间段为${row.startTime}-${row.endTime}？`, '提示', {
          confirmButtonText: '确定' + type,
          cancelButtonText: '取消',
          type: 'warning'
        })
      } catch (e) {
        this.$message({ message: '已取消操作' })
        // this.dialogType = ''
        return
      }
      let params = { studioReserveInformationId: row.studioReserveInformationId, reservationRecordId: row.id, isAdmin: 'Y' }
      let res = (await this.request(this.api.sms.studioReserveInformation[type === '签到' ? 'signIn' : 'cancelTheReservation'], params))
      if (res.code === 0) {
        this.$message({ message: type + '成功', type: 'success' })
        // 需要刷新页面数据
        // await this.handleSelectionChange()
        this.globalData.seeClick && this.globalData.seeClick()
        this.globalData.handleSelectionChange && this.globalData.handleSelectionChange()
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.dialogTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;

  .left {
    span {
      margin-right: 30px;
    }
  }
}

.tableSet {
  .title,
  span {
    color: #409eff;
  }

  .title {
    font-size: 20px;
    margin: 10px 0;
  }
}

.tableRecord {
  span {
    color: #409eff;
    margin-right: 20px;
  }

  .tableTop {
    margin: 30px 0 10px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
      .title {
        .spanColor {
          font-size: 20px;
          color: #409eff;
        }

        span {
          color: #999;
          margin-right: 30px;
        }
      }
    }
  }

  .tableContent {
    .graySet {
      color: #999;
    }

    .blueSet {
      color: #409eff;
    }
  }
}
</style>