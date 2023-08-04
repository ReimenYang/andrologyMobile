<template>
  <div class="top">
    <div class="topLeft">
      <span class="selectTxt">日期选择</span>
      <el-date-picker
        v-model="date"
        type="date"
        placeholder="选择日期"
        @change="dateChange"
      >
      </el-date-picker>
      <el-button
        style="margin-left:10px;"
        type="primary"
        @click="getFile"
      >导出</el-button>
    </div>
    <div
      class="info"
      v-if="tableData.length"
    >
      {{ date }} 待签到 <span class="red">{{ tableData[0].numberOfBookedTotal || 0 }}</span> 人，签到 <span class="red">{{
        tableData[0].numberOfSignInTotal || 0 }}</span> 人
    </div>
  </div>
  <el-collapse
    v-model="activeNames"
    class="collapse"
  >
    <el-collapse-item
      v-for="item in tableData"
      :key="item.projectName"
      :name="item.projectName"
    >
      <template #title>
        <div class="deviceType">{{ item.projectName }}</div>
        <div class="info">（待签到 <span class="red">{{ item.numberOfBooked }}</span> 人，签到 <span class="red">{{
          item.numberOfSignIn }}</span> 人）</div>
      </template>
      <el-descriptions
        v-for="device in item.deviceType"
        :key="device.id"
        v-show="device.today"
        :column="1"
        style="padding: 10px 0 0;"
        border
      >
        <el-descriptions-item
          :label="`${device.label}(${device.today}人)`"
          labelClassName="deviceLabel"
          className="deviceItem"
        >
          <el-descriptions
            :style="item.style"
            direction="vertical"
            :column="10"
            border
          >
            <el-descriptions-item
              v-for="obj in item.workTimeList"
              :key="obj.id"
              :label="obj.time"
              labelClassName="labelClass"
            >
              <el-popover
                v-for="user in obj.userReservationRecordList"
                :key="user.id"
                placement="bottom"
                :width="220"
                trigger="hover"
                :disabled="user.status !== 0"
              >
                <div style="text-align: center; margin: 0;">
                  <el-button @click="cancelClick(user)">取消预约</el-button>
                  <el-button
                    type="primary"
                    @click="signClick(user)"
                  >确认签到</el-button>
                </div>
                <template #reference>
                  <div
                    class="popover"
                    v-show="user.deviceId === device.deviceId"
                  >
                    {{ user.userName }}
                    <el-tag
                      :type="user.statusTag.tagType"
                      v-bind="user.statusTag"
                      v-if="user.statusTag"
                    >{{
                      user.statusTag.setLabel }}</el-tag>
                  </div>
                </template>
              </el-popover>
            </el-descriptions-item>
          </el-descriptions>

        </el-descriptions-item>
      </el-descriptions>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      date: new Date(),
      activeNames: [],
      project: this.globalData.project
    }
  },
  async created () {
    this.date = this.libs.data.dateNow(new Date(), 'xxxx-xx-xx')
    await this.getList()
  },
  methods: {
    async getList () {
      this.tableData = []
      this.activeNames = []
      for (let val of this.project) {
        let params = { studioId: this.globalData.studioId, date: this.date, projectId: val.id }
        let data = (await this.request(this.api.sms.studioReserveInformation.getReservationRecordForDoctor, { ...params })).data
        data.workTimeList = data.workTimeList.filter(item => item.userReservationRecordList.length)
        let deviceType = [...val.deviceList, { id: 'none', label: '未登记' }]
        deviceType.forEach(device => {
          device.today = 0
          data.workTimeList.forEach(item => {
            device.today += item.userReservationRecordList.filter(obj => {
              obj.deviceId = obj.deviceId || 'none'
              return obj.deviceId === device.deviceId
            }).length
          })
        })
        let style = {}
        if (data.workTimeList.length < 10) style.width = 150 * data.workTimeList.length + 'px'
        if (data.workTimeList.length) this.activeNames.push(val.projectName)
        this.tableData.push({ deviceType, projectName: val.projectName, style, ...data })
      }
      let allUser = this.tableData.reduce((a = [], b) => {
        // if (b.numberOfBooked || b.numberOfSignIn) return [
        if (b.workTimeList.length) return [
          ...a,
          ...b.workTimeList.reduce((c, d) => {
            if (d.userReservationRecordList.length) return [
              ...c,
              ...d.userReservationRecordList
            ]
            return c
          }, [])]
        return a
      }, [])

      allUser.forEach(item => item.statusTag = [
        { tagType: '', setLabel: '待签到', size: 'small' },
        { tagType: 'info', setLabel: '已取消', size: 'small' },
        { tagType: 'success', setLabel: '已签到', size: 'small' },
        { tagType: 'warning', setLabel: '已爽约', size: 'small' }
      ][item.status])
    },
    async dateChange (e) {
      this.date = this.libs.data.dateNow(e, 'xxxx-xx-xx')
      return await this.getList()
    },
    async getFile () {
      if (this.tableData[0].numberOfBookedTotal + this.tableData[0].numberOfSignInTotal < 1) return this.$message({ type: 'info', message: '不存在有效的预约记录，无数据可导出' })
      this.$confirm(`确认导出${this.date}的预约纪录？`, '提示', {
        confirmButtonText: '确定导出',
        cancelButtonText: '取消导出',
        type: 'warning'
      }).then(async () => {
        // if ()
        const loading = this.$loading({
          lock: true,
          text: '导出中，请稍候',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        let param = { studioId: this.globalData.studioId, date: this.date }
        let res = await this.request(this.api.sms.studioReserveInformation.exportUserReservationRecord, param, { headers: this.globalData.headers, responseType: 'blob' })
        location.href = window.URL.createObjectURL(new Blob([res], { type: res.type }))
        loading.close()
      }).catch(() => { this.$message({ type: 'info', message: '已取消导出' }) })
    },
    async signClick (item) {
      this.$confirm(`${item.userName}患者预约时间段为${item.startTime}-${item.endTime}？`, '提示', {
        confirmButtonText: '确定签到',
        cancelButtonText: '取消签到',
        type: 'warning'
      }).then(async () => {
        let res = (await this.request(this.api.sms.studioReserveInformation.signIn, { reservationRecordId: item.id }))
        if (res.code === 0) this.$message({ message: '签到成功', type: 'success' })
        setTimeout(() => { this.getList() }, 500)
      }).catch(() => { this.$message({ type: 'info', message: '已取消签到' }) })
    },
    async cancelClick (item) {
      this.$confirm(`${item.userName}患者预约时间段为${item.startTime}-${item.endTime}？`, '提示', {
        confirmButtonText: '确定取消预约',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let params = { studioReserveInformationId: item.studioReserveInformationId, reservationRecordId: item.id, isAdmin: 'Y' }
        let res = (await this.request(this.api.sms.studioReserveInformation.cancelTheReservation, params))
        if (res.code === 0) this.$message({ message: '取消预约成功', type: 'success' })
        setTimeout(() => { this.getList() }, 500)
      }).catch(() => { this.$message({ type: 'info', message: '已取消操作' }) })
    }
  }
}
</script>
<style lang="scss" scoped>
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 30px 20px;

  .topLeft {
    .selectTxt {
      margin-right: 20px;
    }
  }

  .topRight {
    span {
      margin-right: 20px;
    }
  }
}

.info {
  color: var(--color-tips);

  .red {
    font-size: var(--font-h4);
    color: red;
  }
}

.collapse {
  padding: 10px;

  :deep(.el-collapse-item__header) {
    background: var(--color-background);
  }

  .deviceType {
    padding-left: 20px;
    font-size: var(--font-h4);
  }

  :deep(.deviceItem) {
    padding: 0 !important;
    border: none !important;
  }

  :deep(.deviceLabel) {
    width: 150px;
    font-weight: normal !important;
    text-align: center !important;
    border-right: none !important;
  }

  :deep(.labelClass) {
    width: 150px;
    font-weight: normal !important;
    text-align: center !important;
  }

  :deep(.popover) {
    margin: 15px 0;
    text-align: center;
    font-size: var(--font-h4);
    cursor: pointer;
  }
}
</style>

