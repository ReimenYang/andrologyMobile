<template>
  <div
    class="wrap"
    v-if="ready"
  >
    <div class="body">
      <div class="calendar">
        <el-calendar>
          <template #date-cell="{ data }">
            {{ data.isSelected ? checkCalendarChange(data) : '' }}
            <template
              v-for="item in reservationList"
              :key="item.date"
            >
              <div
                v-if="item.date === data.day"
                class="dayItem"
              >
                <div class="day">{{ data.date.getDate() }}</div>
                <div
                  v-if="item.bookingOpen"
                  class="triangle"
                ></div>
                <div
                  class="isWorkDay"
                  v-if="item.isWorkDay"
                >开诊</div>
                <div
                  class="numberOfPeople"
                  :class="{ notNone: item.appointmentNum }"
                >{{ item.appointmentNum || 0 }}人预约
                </div>

                <div
                  class="scheduling"
                  v-if="item.isWorkDay && item.date !== dateToday && item.bookingOpen"
                ><el-button @click="scheduling(item)">更新排班</el-button>
                </div>
              </div>
            </template>
          </template>
        </el-calendar>
        <div class="tips">
          更新排班说明事项：
          <div>1. 进行了修改排班设置、项目时长、项目的设备特殊工作时段后，原有已放号的工作日并不会受到影响。</div>
          <div>2. 如果需要把最新设置在指定工作日生效，需要手动点击该工作日的"更新排班”按钮</div>
          <div>3. 注1：更新排班操作需要操作会清空该工作日的所有预约记录</div>
          <div>4. 注2：当天不能进行更新排班操作</div>
        </div>
      </div>
      <div class="workingDaySetting">
        <div class="header"><el-button @click="settingDialog = true">工作时间设置</el-button></div>
        <working-day-setting
          :data="workingDay"
          :bookingPeriod="bookingPeriod"
          :advanceMinute="advanceMinute"
          :timeLimit="timeLimit"
          :timeCancel="timeCancel"
        />
      </div>
    </div>

    <el-dialog
      top="5vh"
      title="工作时间设置"
      v-model="settingDialog"
      width="800px"
    >
      <working-day-setting
        ref="workingDaySetting"
        :data="workingDay"
        :bookingPeriod="bookingPeriod"
        :advanceMinute="advanceMinute"
        :timeLimit="timeLimit"
        :timeCancel="timeCancel"
        type="edit"
        v-if="settingDialog"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="settingDialog = false">关 闭</el-button>
          <el-button
            @click="confirmBookingSetting"
            type="primary"
          >确定修改</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 更新排班 -->
    <el-dialog
      top="20vh"
      title="更新排班"
      v-model="schedulingDialog"
      width="500px"
    >
      <div>确认更新后，系统将立即刷新所选日期中因“预约设置”、“项目管理”、“设备管理”的信息修改涉及的排班信息；并取消被上述设置所影响的预约记录，向相关预约人发送取消通知。</div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="schedulingDialog = false">取消</el-button>
          <el-button
            @click="updateScheduling"
            type="primary"
          >确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import workingDaySetting from '@/views/workingDaySetting/_workingDaySetting.vue'
export default {
  components: { workingDaySetting },
  data () {
    return {
      ready: false,
      // studioList: [],
      studioId: '',
      studioName: '',
      month: this.libs.data.dateNow('', 'xxxx-xx'),
      openSetting: [],
      reservationList: [],
      // firstSetting: -1,
      // hasInit: false,
      deviceList: [],
      settingDialog: false,
      timeRange: { startTime: '6:00', endTime: '21:30' },
      step: "00:30",
      workingDay: [],
      bookingPeriod: 0,
      advanceMinute: 0,
      timeLimit: 0,
      timeCancel: 0,
      project: [],
      schedulingDialog: false,
      dateToday: this.libs.data.dateNow('', 'xxxx-xx-xx'),
      date: '',
      workTimeList: []
    }
  },
  async created () {
    // this.studioList = (await this.request(this.api.sms.studioReserveInformation.getStudioList)).data
    this.studioId = this.globalData.studioId
    this.project = this.globalData.project
    await this.init()
  },
  methods: {
    async buildWorkingDay () {
      this.workingDay = []
      // this.$loading({ text: '加载中...' })//报错
      let open = this.globalData.studioInfo
      // 工作室名称
      this.studioName = open.studioName
      // 项目列表 => 2023.04.19 现在是设备列表
      this.deviceList = open.deviceList
      // 放号天数
      this.bookingPeriod = open.commonSetting.bookingPeriod
      this.advanceMinute = open.commonSetting.advanceMinute
      this.timeLimit = open.commonSetting.timeLimit
      this.timeCancel = open.commonSetting.timeCancel
      this.workTimeList = open.workTimeList
      //初始化设置 有数据true 没数据false  !getApp().globalData.hasInit
      let workTimeList = open.workTimeList.filter(item => item.startTime)
      // let hasInit = !!workTimeList.length
      // if (!hasInit) this.firstSetting = workTimeList.length
      // sessionStorage.setItem('hasInit', hasInit)
      // this.hasInit = JSON.parse(sessionStorage.getItem('hasInit'))
      let _day = ['一', '二', '三', '四', '五', '六', '日']
      // 常规工作时间
      this.workingDay = _day.map(n => {
        let day = '星期' + n
        let workTime = workTimeList.filter(item => item.startTime && item.week === day)
        let isWorkDay = !!workTime.length
        let config = {
          start: this.timeRange.startTime,
          end: this.timeRange.endTime,
          step: this.step,
          studioId: this.studioId,
          studioName: this.studioName,
          week: day,
          value: ''
        }
        let timeList = [{ ...config, name: 'amStart' }, { ...config, name: 'amEnd' }]
        if (isWorkDay) {
          timeList = []
          workTime.sort((a, b) => parseFloat(a.startTime.replace(/:/, '')) - parseFloat(b.startTime.replace(/:/, '')))
          workTime.forEach(item => {
            let { id, startTime, endTime, createTime, updateTime, delFlag, numberOfPeople } = item
            let _config = { ...config, id: String(id), createTime, updateTime, delFlag, numberOfPeople }
            timeList = timeList.concat([
              { ..._config, value: startTime, name: 'amStart' },
              { ..._config, value: endTime, name: 'amEnd' },
            ])
          })

          let lastIndex = timeList.length - 1
          timeList.forEach((item, i) => {
            let maxTime = i !== lastIndex && timeList[i + 1].value
            let minTime = i && timeList[i - 1].value
            switch (i) {
              case 0:
                item.maxTime = maxTime
                break;
              case lastIndex:
                item.minTime = minTime
                break;
              default:
                item.minTime = minTime
                item.maxTime = maxTime
                break;
            }
          })
        }
        return { day, isWorkDay, timeList }
      })
      console.log(this.workingDay, this.workTimeList, 8989);
      return this.buildCalendar()
    },
    async buildCalendar () {
      this.reservationList = (await this.request(this.api.sms.studioReserveInformation.getReservationStatusForMonth, { studioId: this.studioId, month: this.month })).data

      for (let item of this.reservationList) {
        //放号中
        item.bookingOpen = item.isOpenDay === 'Y'
        //  按照常规判断预测预约期,按照特殊设置预测开诊
        item.isWorkDay = (item.isOpenDay !== 'N' && this.workingDay.find(({ day }) => day === item.week).isWorkDay) || item.isSpecialSetting === 'Y'
        item.numberOfPeople = 0
        //  有预约记录
        if (item.isAppointment === 'Y') {
          // 所有项目的预约数据
          item.bookingData = []
          // 所有项目的预约人数
          // for (let object of this.project) {
          //   let _record = (await this.request(
          //     this.api.sms.studioReserveInformation.getReservationRecordForDoctor,
          //     { studioId: this.studioId, date: item.date, projectId: object.id }
          //   )).data
          //   item.bookingData.push(_record)
          //   // let numberOfPeople = _record.workTimeList.filter(item => item.userName).length
          //   // console.log(item.date, item.numberOfPeople, numberOfPeople, object.deviceType, _record);
          //   // console.log(_record.workTimeList, 90);
          //   item.numberOfPeople += _record.workTimeList.filter(item => item.userName).length
          //   // item.numberOfPeople += _record.workTimeList.userReservationRecordList.filter(item => item.userName).length
          // }
        }
      }
      // this.$loading().close()
      this.ready = true
    },
    async init () {
      return await this.buildWorkingDay()
    },
    checkCalendarChange (data) {
      let _month = this.libs.data.dateNow(data.date, 'xxxx-xx')
      if (_month === this.month) return ''
      this.month = _month
      this.init()
      return ''
    },
    async confirmBookingSetting () {
      let _advanceDate = this.$refs.workingDaySetting.advanceDate
      let _timeLimit = this.$refs.workingDaySetting.timeLimits
      let _advanceMinute = this.$refs.workingDaySetting.advanceMinutes
      let _timeCancel = this.$refs.workingDaySetting.timeCancels
      let _workingDay = this.$refs.workingDaySetting.workingDay
      console.log(_advanceDate, _workingDay, this.$refs.workingDaySetting, 111);
      // 检查开诊日设置是否正确 && 把不开诊的时间初始化
      let workDayError = []
      _workingDay.forEach(item => {
        if (item.isWorkDay && !item.timeList.filter(obj => obj.value).length) workDayError.push(item.day)
        if (!item.isWorkDay) item.timeList.forEach(obj => obj.value = '')
      })
      if (workDayError.length) return this.$message.error({ duration: 3000, message: workDayError.join() + '工作日时间未设置' })

      // 检查时间是否成对设置
      let timeError = _workingDay.filter(item => item.timeList.filter(obj => obj.value).length % 2).map(item => item.day).join()
      console.log(timeError, _advanceDate, _workingDay, this.workingDay);
      if (timeError) return this.$message.error({ duration: 3000, message: timeError + '时间设置有误' })

      console.log(this.workingDay, _workingDay, 8);
      // 找到要休息的日子
      let restDay = []
      _workingDay.forEach((item) => {
        if (item.isWorkDay || !item.timeList[0].id) return
        item.timeList.forEach((obj, i) => {
          restDay.push({
            id: obj.id,
            delFlag: '1'
          })
        })
        restDay = this.libs.array.unique(restDay, a => a.id)
        let compareObj = this.workingDay.find(({ day }) => day === item.day)
        item.timeList = compareObj.timeList
      })
      console.log('要休息的日子', restDay)


      // 找到要删除的记录
      let delArr = []
      _workingDay.forEach(item => {
        let compareObj = this.workingDay.find(({ day }) => day === item.day)
        if (compareObj.timeList === item.timeList) return
        let del = item.timeList.map(val => val.id)
        let DidArr = this.libs.array.unique(compareObj.timeList.filter(vals => !del.includes(vals.id)).map(ids => ids.id))
        delArr = [...delArr, ...DidArr]
      })
      console.log('要删除的记录', delArr)

      // 找到要变更的记录
      let updateArr = []
      _workingDay.forEach(item => {
        if (!item.isWorkDay) return
        let compareObj = this.workingDay.find(({ day }) => day === item.day)
        if (compareObj.timeList === item.timeList) return
        compareObj.timeList.forEach((obj, i) => {
          let _obj = item.timeList.find(target => target.id && target.id === obj.id && target.name === obj.name)
          if (!_obj || obj.value === _obj.value || !_obj.value) return
          updateArr.push({
            id: _obj.id,
            week: item.day,
            startTime: item.timeList[i - i % 2].value,
            endTime: item.timeList[i - i % 2 + 1].value,
            delFlag: '0'
          })
        })
      })
      updateArr = this.libs.array.unique(updateArr, a => a.id)
      console.log('要变更的记录', updateArr)

      // 找到要新增的记录
      let addArr = []
      _workingDay.forEach(({ timeList }) => {
        timeList.forEach((item, i) => {
          if (item.id || i % 2 || !item.value) return
          addArr.push({
            id: '',
            week: item.week,
            startTime: item.value,
            endTime: timeList[i + 1].value,
            delFlag: '0'
          })
        })
      })
      console.log('要新增的记录', addArr)


      if (delArr.length) for (let workTimeId of delArr) (await this.request(this.api.sms.reservationSetting.delWorkTime, { workTimeId })).data
      let params = {
        id: this.globalData.studioInfo.commonSetting.id,
        studioId: this.studioId,
        studioName: this.studioName,
        bookingPeriod: _advanceDate,
        timeLimit: _timeLimit,
        advanceMinute: _advanceMinute,
        timeCancel: _timeCancel,
        workTime: [...updateArr, ...addArr, ...restDay]
      }
      await this.request(this.api.sms.reservationSetting.saveOrUpdateStudioWorkTime, { params })
      await this.globalData.getStudioInfo()
      await this.init()
      this.settingDialog = false
    },
    scheduling (item) {
      console.log(item, this.date);
      this.date = item.date
      this.schedulingDialog = true
    },
    async updateScheduling () {
      this.$confirm('确定更新排班?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let data = (await this.request(this.api.sms.reservationSetting.updateTheSchedule, { studioId: this.studioId, date: this.date }))
        console.log('更新', data);
        this.$message({ message: data.msg, type: 'success' })
        this.schedulingDialog = false
      }).catch(() => { })
    },
  }
}
</script>
<style lang="scss" scoped>
.header {
  padding: 8px 0;
  display: flex;
  justify-content: flex-end;
  // justify-content: space-between;
}

.body {
  display: flex;

  .tips {
    padding: 0 20px;
    color: #747d82;
  }
}

// .calendar {
//   width: 500px;
// }
.workingDaySetting {
  width: 400px;
  flex: 0 0 auto;
}

.selectStudio :deep(.el-select) {
  width: 20em;
  margin: 0 10px;
}

.dayItem {
  width: 100%;
  height: calc(var(--el-calendar-cell-width) - 16px);
  padding: 8px;
  // box-sizing: border-box;
  position: relative;
  top: -8px;
  left: -8px;
  font-size: var(--font-h5);
}

.day {
  font-size: var(--font-h3);
}

.triangle {
  width: 0;
  height: 0;
  position: absolute;
  top: 0;
  right: 0;
  border: 20px solid transparent;
  border-top-color: var(--theme-color);
  border-right-color: var(--theme-color);

  &::before {
    width: 2em;
    position: absolute;
    left: -4px;
    top: -15px;
    transform: rotate(45deg);
    content: "预约";
    font-size: var(--font-h6);
    color: #fff;
  }
}

.numberOfPeople {
  position: absolute;
  bottom: 8px;
  color: var(--color-placeholder);

  &.notNone {
    color: var(--theme-color);
  }
}

.isWorkDay {
  position: absolute;
  bottom: 28px;
  color: #fbbd17;
}

.scheduling {
  position: absolute;
  right: 8px;
  bottom: 8px;

  .el-button {
    width: 75px;
    height: 26px;
    border-radius: 13px;
  }
}
</style>