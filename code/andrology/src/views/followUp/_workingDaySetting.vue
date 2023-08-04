<template>
  <el-descriptions
    :column="1"
    border
  >
    <el-descriptions-item label="放号天数">
      <el-input
        v-if="type === 'edit'"
        v-model="advanceDate"
      />
      <div v-else>{{ advanceDate }}</div>
    </el-descriptions-item>
    <!-- <el-descriptions-item label="预约公告">
      <el-input v-if="type==='edit'" />
      <div v-else>休息</div>
    </el-descriptions-item> -->
    <el-descriptions-item label="预约限制">
      <div v-if="type === 'edit'">
        患者只能预约
        <el-select
          class="systemSelect"
          v-model="timeLimits"
          placeholder="请选择"
          @change="bookingSelect"
        >
          <el-option
            v-for="(item, index) in bookingList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>后的项目
      </div>
      <div v-else>患者只能预约{{ getNum(timeLimits) }}后的项目
      </div>
    </el-descriptions-item>
    <el-descriptions-item label="取消限时">
      <div v-if="type === 'edit'">
        患者只能取消
        <el-select
          class="systemSelect"
          v-model="timeCancels"
          placeholder="请选择"
          @change="cancelSelect"
        >
          <el-option
            v-for="(item, index) in cancelList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>后的预约记录
      </div>
      <div v-else>患者只能取消{{ getNum(timeCancels) }}后的预约记录</div>
    </el-descriptions-item>
    <el-descriptions-item label="就诊提醒">
      <div v-if="type === 'edit'">
        患者就诊前一天的21点和就诊前
        <el-select
          class="systemSelect"
          v-model="advanceMinutes"
          placeholder="请选择"
          @change="treatSelect"
        >
          <el-option
            v-for="(item, index) in treatList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div v-else>患者就诊前一天的21点和就诊前{{ getNum(advanceMinutes) }}
      </div>
    </el-descriptions-item>

    <el-descriptions-item
      :label="item.day"
      :labelClassName="type === 'edit' ? 'editLabel' : 'textLabel'"
      v-for=" item in workingDay  "
      :key="item.day"
    >
      <template v-if="type === 'edit'">
        <!-- <el-switch v-model="item.isWorkDay" activeText="开诊" inactiveText="休息" /> -->
        <!--delFlag 0 是启用 1是停用 -->
        <el-switch
          v-model="item.isWorkDay"
          activeText="开诊"
          inactiveText="休息"
        />
        <div
          v-if="item.isWorkDay"
          class="timebox"
        >
          <div
            v-for="(time, i) in item.timeList"
            :key="i"
            class="timeItem"
          >
            <el-time-select
              v-model="time.value"
              v-bind="time"
              class="timeSelect "
              @change="onChange(item)"
            >
            </el-time-select>
            <div
              v-if="i % 2"
              class="timeSetting"
            >
              <div
                class="iconfont icon-plus-circle"
                @click="addTime(item.timeList, i)"
              ></div>
              <div
                v-if="2 < item.timeList.length"
                class="iconfont icon-minus-circle"
                @click="delTime(item, i)"
              >
              </div>
            </div>
            <div v-else>
              至
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div v-if="item.isWorkDay">
          <div
            v-for="  time   in   item.timeList  "
            :key="time.name"
            class="timeShow"
            v-show="time.value"
          >{{
            time.value
          }}</div>
        </div>
        <div v-else>休息</div>
      </template>
    </el-descriptions-item>
  </el-descriptions>
</template>
<script>

export default {
  name: 'workingDaySetting',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    bookingPeriod: {
      type: Number,
      default: 0
    },
    timeLimit: {
      type: Number,
      default: 0
    },
    advanceMinute: {
      type: Number,
      default: 0
    },
    timeCancel: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: () => 'text'
    }
  },
  data () {
    return {
      workingDay: JSON.parse(JSON.stringify(this.data)),
      advanceDate: this.bookingPeriod,
      timeLimits: this.timeLimit,
      advanceMinutes: this.advanceMinute,
      timeCancels: this.timeCancel,
      // bookingList: ['现在', '30分钟', '1小时', '2小时', '3小时', '4小时', '5小时', '6小时', '7小时', '8小时', '9小时', '10小时', '11小时',
      //   '12小时', '13小时', '14小时', '15小时', '16小时', '17小时', '18小时', '19小时', '20小时', '21小时', '22小时', '23小时', '24小时'],
      bookingList: [],
      treatList: [
        { label: '现在', value: 0 },
        { label: '30分钟', value: 30 },
        { label: '1小时', value: 60 },
        { label: '2小时', value: 120 },],
      cancelList: [],
    }
  },
  updated () {
    this.workingDay = JSON.parse(JSON.stringify(this.data))
    this.advanceDate = this.bookingPeriod
    this.timeLimits = this.timeLimit
    this.advanceMinutes = this.advanceMinute
    this.timeCancels = this.timeCancel
  },
  async created () {
    let timeList = JSON.parse((await this.request(this.api.ums.sysDict.bookingManagement.time)).data.description)
    this.bookingList = this.cancelList = timeList

    this.timeLimits = this.timeLimit
    this.advanceMinutes = this.advanceMinute
    this.timeCancels = this.timeCancel
    console.log(this.timeLimits, this.advanceMinutes, this.timeCancels);
    // this.bookingList.forEach((item, index) => {
    //   item.label = item
    //   if (index === 0) {
    //     console.log(item, index, 888);
    //     item.value = 0
    //   }
    //   else if (index === 1) item.value = 30
    //   else {
    //     let arr = Object.values({ ...item })
    //     console.log(arr, 222);
    //     let num = arr.split('小时')[0]
    //     item.value = num * 2 * 30
    //   }
    // })
  },
  methods: {
    getNum (val) {
      return val / 60 >= 1 ? (val / 60) + '小时' : (val / 60 === 0.5 ? '30分钟' : '现在')
    },
    bookingSelect (e) {
      console.log(e);
      this.timeLimits = e
    },
    treatSelect (e) {
      console.log(e);
      this.advanceMinutes = e
    },
    cancelSelect (e) {
      console.log(e);
      this.timeCancels = e
    },
    delTime (value, i) {
      console.log(value, i)
      value.timeList.splice(i - 1, 2)
      return this.onChange(value)
    },
    addTime (value, i) {
      console.log(value, i, 22);
      let { value: startValue, start, end, step, week } = value[i]
      let endValue = value[i + 1] ? value[i + 1].value : end

      let _start = {
        name: "amStart", start, end, minTime: this.timeComputer(startValue, step), maxTime: endValue, step, week, value: startValue
      }
      let _end = {
        name: "amEnd", start, end, minTime: startValue, maxTime: endValue, step, week, value: endValue
      }
      value.splice(i + 1, 0, _start, _end)
      // obj.minTime = obj.value = value[length - 1].maxTime
      // value.timeList.push(obj)
      // value.timeList.push(objs)
    },
    timeComputer (time, step) {
      let [h, m] = time.split(':')
      let [_h, _m] = step.split(':')
      let _step = _m - 0 + _h * 60
      let _time = m - 0 + h * 60
      let H = Math.floor((_time - _step) / 60)
      let M = ('0' + (_time - _step) % 60).slice(-2)

      return `${H}:${M}`
    },
    onChange (target) {
      // let [amStart, amEnd, pmStart, pmEnd] = target.timeList.map(item => item.value)
      // target.timeList.forEach(item => {
      //   switch (item.name) {
      //     case 'amStart':
      //       item.maxTime = amEnd || pmStart || pmEnd
      //       break;
      //     case 'amEnd':
      //       item.minTime = amStart
      //       item.maxTime = pmStart || pmEnd
      //       break;
      //     case 'pmStart':
      //       item.minTime = amEnd || amStart
      //       item.maxTime = pmEnd
      //       break;
      //     case 'pmEnd':
      //       item.minTime = pmStart || amEnd || amStart
      //       break;
      //   }
      // })
      // let [amStart, amEnd] = target.timeList.map(item => item.value)
      // target.timeList.forEach(item => {
      //   switch (item.name) {
      //     case 'amStart':
      //       item.minTime = amStart
      //       break;
      //     case 'amEnd':
      //       item.minTime = amEnd
      //       break;
      // case 'pmStart':
      //   item.minTime = amEnd || amStart
      //   item.maxTime = pmEnd
      //   break;
      // case 'pmEnd':
      //   item.minTime = pmStart || amEnd || amStart
      //   break;
      //   }
      // })
      let lastIndex = target.timeList.length - 1
      target.timeList.forEach((item, i) => {
        let step = target.timeList[i].step
        let maxTime = i !== lastIndex && target.timeList[i + 1].value
        let minTime = i && target.timeList[i - 1].value
        if (minTime) minTime = this.timeComputer(minTime, step)
        if (maxTime) maxTime = this.timeComputer(maxTime, step)
        switch (i) {
          case 0:
            delete item.minTime
            item.maxTime = maxTime
            break;
          case lastIndex:
            item.minTime = minTime
            delete item.maxTime
            break;
          default:
            item.minTime = minTime
            item.maxTime = maxTime
            break;
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.el-descriptions__label) {
  text-align: center !important;
}

:deep(.editLabel) {
  width: 120px;
  height: 150px;
}

:deep(.textLabel) {
  width: 120px;
  height: 68.5px;
}

.timebox {
  display: flex;
  flex-wrap: wrap;

  .timeItem {
    display: flex;
    align-items: center;
  }

  .timeSelect {
    margin: 10px;
  }

  .timeSetting {
    display: flex;

    .iconfont::before {
      margin-right: 10px;
      font-size: 24px;
      color: var(--theme-color);
      cursor: pointer;
    }
  }
}

.timeShow {
  margin: 5px 10px 5px 0;
  display: inline-block;

  &:nth-child(odd)::after {
    content: " 至";
  }

  &:nth-child(even) {
    width: 150px;
  }
}
</style>