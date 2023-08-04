<template>
  <el-dialog
    top="5vh"
    :title="dialogType"
    v-model="showDialog"
    :width="width"
  >
    <update-user-info
      ref="userInfo"
      :data="dialogType === '新增患者' ? {} : seeRecordInfo"
      v-if="dialogType === '新增患者' || dialogType === '修改患者'"
    />

    <add-device
      ref="addDevice"
      :seeRecordInfo="seeRecordInfo"
      v-if="dialogType === '添加治疗项目'"
    />

    <add-booking
      ref="addBooking"
      :data="tableOpen"
      v-if="dialogType === '添加预约'"
    />
    <scheme-times
      ref="schemeTimes"
      :data="schemeTimesInfo"
      v-if="dialogType === '修改治疗项目'"
    />
    <change-log
      ref="changeLog"
      :data="changeLogInfo"
      v-if="dialogType === '修改日志'"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogType = ''">取消</el-button>
        <el-button
          v-if="dialogType !== '修改日志'"
          @click="dialogConfirm"
          type="primary"
        >确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import addDevice from '@/views/user/_addDevice.vue'
import updateUserInfo from '@/views/user/_updateUserInfo.vue'
import addServer from '@/views/user/_addServer.vue'
import addBooking from '@/views/user/_addBooking.vue'
import schemeTimes from '@/views/user/_schemeTimes.vue'
import changeLog from '@/views/user/_changeLog.vue'
export default {
  name: 'dialogs',
  components: { addDevice, addServer, updateUserInfo, addBooking, schemeTimes, changeLog },
  props: {
    studio: {
      type: Object,
      default () { return [] }
    },
    dialogType: {
      type: String,
      default () { return '' }
    },
    deviceInfo: {
      type: Object,
      default () { return {} }
    },
    tableOpen: {
      type: Array,
      default () { return [] }
    },
    schemeTimesInfo: {
      type: Object,
      default () { return {} }
    },
    seeRecordInfo: {
      type: Object,
      default () { return {} }
    },
    changeLogInfo: {
      type: Array,
      default () { return [] }
    },
  },
  data () {
    return {
      showDialog: false,
      tableOpenRefresh: {},
      width: '600px',
      // dialogType: '',
    }
  },
  watch: {
    dialogType: function () {
      this.showDialog = !!this.dialogType
      if (this.dialogType === '修改日志') this.width = '900px'
      else this.width = '600px'
    },
    // showDialog: function () {
    //   if (!this.showDialog) this.dialogType = ''
    // }
  },
  created () {
  },
  methods: {
    async userInfoConfirm () {
      let params = { ...this.$refs.userInfo.form, ...this.studio }
      let { realName, phone } = params
      let errorMsg = []
      if (!realName) errorMsg.push('患者姓名')
      if (!phone) errorMsg.push('患者手机号')
      else if (!this.libs.data.verify.phone(phone)) errorMsg.push('正确手机号')
      if (errorMsg.length) return this.$message({ message: '请输入' + errorMsg.join(), type: 'error' })

      let data = (await this.request(this.api.adminSms.patientStudio[this.dialogType === '新增患者' ? 'save' : 'updateById'], params)).data
      if (data && this.dialogType !== '新增患者') {
        this.seeRecordInfo.realName = realName
        this.seeRecordInfo.phone = phone
      }

      if (data) this.$message({ message: this.dialogType + '成功', type: 'success' })

      // this.dialogType = ''
      this.$emit('close')
      // await this.getList({})
      this.$emit('refresh', {})
    },
    async addDeviceConfirm () {
      let addDeviceInfo = this.$refs.addDevice.form

      let errorMsg = []
      if (!addDeviceInfo.projectName) errorMsg.push('治疗项目')
      if (!addDeviceInfo.numberOfTreatments) errorMsg.push('治疗次数')
      if (errorMsg.length) return this.$message({ message: '请输入' + errorMsg.join(), type: 'error' })

      let params = { ...this.deviceInfo, ...this.seeRecordInfo, ...addDeviceInfo, createUser: this.globalData.userInfo.id }
      let data = (await this.request(this.api.adminSms.equityRecord.save, params)).data
      if (data) this.$message({ message: this.dialogType + '成功', type: 'success' })
      // this.dialogType = ''
      if (this.seeRecordInfo.id) this.globalData.seeClick && this.globalData.seeClick()
      this.globalData.handleSelectionChange && this.globalData.handleSelectionChange()
      this.$emit('close')
      // await this.getList({})
      this.$emit('refresh', {})
    },
    async addBookingConfirm (e) {
      let bookingInfo = this.$refs.addBooking.form
      console.log(bookingInfo, 11111);
      let { userId, realName, phone } = this.seeRecordInfo
      let params = { ...bookingInfo, userId, userName: realName, phone }
      let data = (await this.request(this.api.sms.studioReserveInformation.manualReservation, { params })).data
      if (data) this.$message({ message: this.dialogType + '成功', type: 'success' })
      this.globalData.seeClick && this.globalData.seeClick()
      this.globalData.handleSelectionChange && this.globalData.handleSelectionChange()
      this.$emit('close')
      // await this.getList({})
      this.$emit('refresh', {})
    },
    async updateConfirm () {
      let schemeTimes = this.$refs.schemeTimes.form
      let res = (await this.request(this.api.adminSms.equityRecord.updateById, schemeTimes)).data
      if (res) {
        this.$message({ message: '修改成功', type: 'success' })
        for (let name in this.schemeTimesInfo) this.schemeTimesInfo[name] = schemeTimes[name]
        // this.globalData.seeClick && this.globalData.seeClick()
        this.globalData.handleSelectionChange && this.globalData.handleSelectionChange()
      }
      // this.dialogType = ''
      this.$emit('close')
    },
    async changeLog () {
      let schemeTimes = this.$refs.schemeTimes.form
      let res = (await this.request(this.api.adminSms.equityRecord.updateById, schemeTimes)).data
      if (res) {
        this.$message({ message: '修改成功', type: 'success' })
        for (let name in this.schemeTimesInfo) this.schemeTimesInfo[name] = schemeTimes[name]
        // this.globalData.seeClick && this.globalData.seeClick()
        this.globalData.handleSelectionChange && this.globalData.handleSelectionChange()
      }
      this.$emit('close')
    },
    dialogConfirm () {
      switch (this.dialogType) {
        case '新增患者':
        case '修改患者':
          return this.userInfoConfirm()
        case '添加治疗项目':
          return this.addDeviceConfirm()
        case '添加预约':
          return this.addBookingConfirm()
        case '修改治疗项目':
          return this.updateConfirm()
        case '修改日志':
          return this.changeLog()
      }
    }
  }
}
</script>