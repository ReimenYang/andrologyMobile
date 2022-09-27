<template>
  <view class="content">
    <!-- #ifndef APP-PLUS  -->
    非app不能使用
    <!-- #endif -->
    <!-- #ifdef APP-PLUS  -->
    <view>
      蓝牙功能:
      <switch
        :checked="isTurnOnBluetoothSwitch"
        @change="turnOnBluetoothSwitch"
        :disabled="isTurnOnBluetoothSwitch"
      />
    </view>
    <view>
      <button
        @click="search"
        type="primary"
      >
        搜索设备
      </button>
    </view>
    <view
      v-for="item in bleModules.equipmentList"
      :key="item.name"
    >
      <view @click="selectDevice(item)">
        <text>
          {{ item.name }}
        </text>
        <text v-if="item.isCheck">
          (已选择)
        </text>
      </view>
    </view>
    <button
      @click="addDevice"
      type="primary"
    >
      确认链接
    </button>
    <view v-if="devicesReady">
      <scroll-view
        class="uni-scroll_box"
        scrollY
      >
        <view class="uni-title">
          治疗程序列表:
        </view>
        <view
          class="uni-list-box"
          v-for="item in workoutList"
          :key="item.name"
          @click="selectProject(item)"
        >
          <view class="uni-list_name">
            <text
              class="iconfont icon-check"
              v-if="item.name===workoutProject.name"
            />
            {{ item.name }}
          </view>
          <view class="uni-list_item">
            {{ item.description }}
          </view>
        </view>
      </scroll-view>
      <view>
        治疗时间：
        <xnw-number
          :disabled="!workoutProject.initcommand"
          :min="1"
          :value="workTime/60"
          @change="setWorkTime"
        />
        分钟
      </view>
      <button
        @click="sendProject"
        type="primary"
      >
        发送方案
      </button>
      <view v-if="planReady">
        <button
          v-for="item in control"
          :key="item.name"
          :type="item.style"
          @click="item.fun"
        >
          {{ item.name }}
        </button>
      </view>
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
import workoutData from './workoutData.js'
// import { BleModule } from './BleModule.js'
// import { EventBus } from './EventBus.js'
export default {
  data () {
    return {
      workoutList: workoutData.data,
      workoutProject: {},
      isTurnOnBluetoothSwitch: false, // 是否已打开蓝牙开关
      isAddDeviceSuccess: false, // 是否添加设备成功
      bleModules: new this.libs.global.ble.BleModule(),
      control: [],
      devicesSelected: null,
      devicesReady: false,
      planReady: false,
      whiteList: ['muscstim', 'biostim'],
      blackList: [],
      eventBusCallBack: () => console.log('eventBusCallBack'),
      workTime: 60
    }
  },
  created () {
    //  #ifdef APP-PLUS
    this.control = [
      { name: '左电流+', fun: this.bleModules.bleModule.addLeftMa },
      { name: '左电流-', fun: this.bleModules.bleModule.subLeftMa },
      { name: '右电流+', fun: this.bleModules.bleModule.addRightMa },
      { name: '右电流-', fun: this.bleModules.bleModule.subRightMa },
      { name: '开始治疗', fun: this.bleModules.bleModule.startTreatment, style: 'primary' },
      { name: '暂停治疗', fun: this.bleModules.bleModule.pauseTreatment },
      { name: '退出治疗', fun: this.bleModules.bleModule.exitProject },
      { name: '断开蓝牙设备', fun: this.bleModules.bleModule.closeBLEConnection }
    ]
    let EventBus = this.libs.global.ble.EventBus
    this.eventBusCallBack = res => {
      switch (res.msgCode) {
        case EventBus.ADD_DEVICE_SUCCESS:
          break
        case EventBus.DELETE_DEVICE_SUCCESS:
          break
        case EventBus.UPDATE_DEVICE_SUCCESS:
          break
      }
      console.log(res.msgCode)
    }
    EventBus.register(this.eventBusCallBack)

    // 设备过滤逻辑,需要注意发动的时机
    this.setDeviceFilter()

    // 判断客户端蓝牙状态
    this.bleModules.bleModule.isTurnOnBluetoothSwitch(
      // 如果已经打开就开始搜索蓝牙设备
      () => {
        this.isTurnOnBluetoothSwitch = true
        this.search()
      },
      // 未打开则监听客户端蓝牙状态
      this.turnOnBluetoothSwitch
    )
    // #endif
  },

  // onUnload () {
  //   EventBus.unregister(this.eventBusCallBack)
  // },
  onBackPress () {
    if (!this.isAddDeviceSuccess) this.bleModules.disConnect()
    return true
  },
  methods: {
    /**
     * 设备过滤逻辑：
     * 1.必须先配置好白名单(whiteList)和黑名单(blackList)再调用
     * 2.传入需要判断的字段名，默认值是name
     * 3.只显示符合白名单判断逻辑，且不在黑名单逻辑内的设备
     * 4.必须在启用搜索设备前调用
     *
     * 白名单判断逻辑：1.大小写不敏感；2.模糊匹配
     * 黑名单判断逻辑：1.大小写敏感；2.精准匹配
     */
    setDeviceFilter (key = 'name') {
      return this.bleModules.setDeviceFilter((newDevice) => {
        console.log(newDevice[key])
        if (
          this.whiteList.find(item => String(newDevice[key]).toLowerCase().match(String(item).toLowerCase()))
          &&
          !this.blackList.includes(newDevice[key])
        )
          return newDevice
      })
    },
    turnOnBluetoothSwitch () {
      if (this.isTurnOnBluetoothSwitch) return
      this.bleModules.bleModule.turnOnBluetoothSwitch()
      this.bleModules.bleModule.onBluetoothAdapterStateChange(() => {
        // 监听到客户端蓝牙开启就改变状态
        this.isTurnOnBluetoothSwitch = true
        // 开始搜索蓝牙设备
        this.search()
        // 监听动作设置为空
        this.bleModules.bleModule.onBluetoothAdapterStateChange(null)
      })
    },
    search () {
      return this.bleModules.search()
    },
    selectDevice (item) {
      if (item.isCheck) return
      // 这里必须用$set
      this.bleModules.equipmentList.forEach(obj => { this.$set(obj, 'isCheck', obj.deviceId === item.deviceId) })
      this.devicesSelected = item
    },
    addDevice () {
      if (!this.bleModules.equipment) return uni.showToast({
        title: '请先选择连接设备',
        icon: 'none',
      })
      this.bleModules.selectEquipment(this.devicesSelected, () => this.devicesReady = true, () => this.devicesReady = false)
      // 连续使用有时机问题，待优化
      // this.bleModules.bleModule.getBLEConnectStatus(res => {
      //   console.log('连接状态码:', res.statuscode)
      //   if (res.statuscode === '0000') {// 如果是连接状态
      //     EventBus.post(new EventBus(EventBus.BLE_DEVICE_CONNECTED)) // 发送蓝牙连接成功通知
      //   }
      //   this.devicesReady = res.statuscode === '0000'
      //   EventBus.post(new EventBus(EventBus.ADD_DEVICE_SUCCESS)) // 发送成功添加设备通知
      // })
    },
    selectProject (item) {// 选择计划
      this.workoutProject = JSON.parse(JSON.stringify(item))
      this.bleModules.selectProject(this.workoutProject)
      this.workTime = this.workoutProject.duration
    },
    setWorkTime (time) {
      if (!this.workoutProject.initcommand) return
      this.workTime = time * 60
      return this.bleModules.setTreatTime(this.workTime)
    },
    sendProject () {
      this.planReady = true
      return this.bleModules.sendProject()
    },
  }
}
</script>

<style lang="scss" scoped>
.content {
  line-height: 3em;
}
.uni-scroll_box {
  height: 70%;
  background: #fff;
  border-radius: 20rpx;
}

.uni-list-box {
  margin: 0 20rpx;
  padding: 15rpx 0;
  border-bottom: 1px #f5f5f5 solid;
  box-sizing: border-box;
}

.uni-list:last-child {
  border: none;
}

.uni-list_name {
  font-size: 30rpx;
  color: #333;
}

.uni-list_item {
  font-size: 24rpx;
  color: #555;
  line-height: 1.5;
}
</style>
