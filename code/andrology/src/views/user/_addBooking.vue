<template>
  <el-descriptions
    :column="1"
    border
  >
    <el-descriptions-item
      :label="col.label"
      v-for="col in infoKeys"
      :key="col.prop"
    >
      <template v-if="col.prop === 'time'">
        <el-select
          v-for="(item, i) in col.repeat"
          :key="i"
          v-model="form[item.prop || col.prop]"
          v-bind="item"
          @change="item.onChange"
        >
          <el-option
            v-for="option in item.options"
            :key="option.value"
            v-bind="option"
            class="option"
          >
            <span class="time">{{ option.label }}</span>
            <span class="remain">可预约:{{ option.num }}</span>
          </el-option>
        </el-select>
      </template>

      <xnwFromComponent
        v-else
        :col="col"
        :form="form"
      />

    </el-descriptions-item>
  </el-descriptions>
</template>
<script>
export default {
  name: 'addBooking',
  props: {
    data: {
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
      infoKeys: [
        { prop: 'projectName', label: '服务项目', type: 'select', repeat: [{ options: [], placeholder: '请选择', onChange: this.setDeviceList }] },
        { prop: 'date', label: '预约日期', type: 'select', repeat: [{ options: [], placeholder: '请选择', onChange: this.dateListChange }] },
        { prop: 'time', label: '预约时间', type: 'select', repeat: [{ options: [], placeholder: '请选择', onChange: this.timeListChange }] },
        { prop: 'deviceType', label: '预约设备', type: 'select', repeat: [{ options: [], placeholder: '请选择', onChange: this.equimentListChange }] },
      ],
      form: {
        projectName: '',
        deviceType: '',
        date: '',
        time: '',
        projectId: '',
        studioId: this.globalData.studioId
      },
      date: {},
      time: {},
    }
  },
  async created () {
    // let data = (await this.request(this.api.sms.studioReserveInformation.getItemListByUserId, { userId: this.data[0].userId, studioId: this.globalData.studioId })).data || {}
    this.infoKeys[0].repeat[0].options = this.globalData.project
    this.date = this.infoKeys[1].repeat[0]
    this.time = this.infoKeys[2].repeat[0]
  },
  methods: {
    async setDeviceList (projectName) {
      this.form.date = this.form.time = this.form.deviceType = ''
      // this.infoKeys[3].repeat[0].options = this.globalData.project.find(item => item.projectName === projectName).deviceList
      this.form.projectId = this.globalData.project.find(item => item.projectName === projectName).id
      let date = (await this.request(this.api.sms.studioReserveInformation.getRecentReservationRecord, this.form)).data
      this.date.options = date.filter(val => val.isOpen === 'Y').map(item => ({ lable: item.time, value: item.time }))
    },
    async dateListChange () {
      this.form.time = this.form.deviceType = this.form.studioReserveInformationId = ''
      let params = { studioId: this.globalData.studioId, date: this.form.date, projectId: this.form.projectId }
      let timeList = (await this.request(this.api.sms.studioReserveInformation.getReservationRecord, params)).data.record
      timeList.forEach(item => {
        item.date = item.date.slice(0, 10)
        item.label = item.value = item.startTime + '-' + item.endTime
      })
      this.time.options = timeList
    },
    async timeListChange (label) {
      this.form.deviceType = ''
      let target = this.time.options.find(item => item.label === label)
      for (let name in target) this.form[name] = target[name]
      this.form.studioReserveInformationId = target.id
      let data = (await this.request(this.api.sms.studioReserveInformation.getReservedDevice, this.form)).data
      this.infoKeys[3].repeat[0].options = data.map(item => ({ lable: item.deviceType, value: item.deviceType, id: item.id }))
      this.form.deviceType = data[0].deviceType
      this.form.deviceId = data[0].id
    },
    async equimentListChange (deviceType) {
      this.form.deviceId = this.infoKeys[3].repeat[0].options.find(item => item.lable === deviceType).id
      console.log(this.form.deviceId)
    },
  }
}
</script>
<style lang="scss" scoped>
.option {
  display: flex;
  justify-content: space-between;

  .remain {
    color: #8492a6;
    font-size: 13px;
  }
}
</style>