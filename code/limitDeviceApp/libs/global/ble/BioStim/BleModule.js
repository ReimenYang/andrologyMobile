/**
 * 杉山ble治疗仪页面调用类
 * power by 志凡
 *
 * 建议项：
 * foundPort方法加上查重判断会更好
 * 理解上，register里的枚举里面调用的方法，如果需要与页面交互，需要根据业务重新定义，如搜索结束：finishedPort
 * connect调用this.bleModule.createBLEConnection的时候，建议将整个this.equipment传入，扩展性更好
 * selectEquipment连带发送对象的设置有点不妥，需要连带操作应该使用回调
 */
import bleModule from './BioStimBleModule.js'
import { EventBus } from './EventBus.js'
export default class BleModule {
  constructor() {
    this.searching = false
    this.connected = false
    this.equipment = {}
    this.equipmentList = []
    this.bleModule = bleModule
    this.workoutProject = {}
    this.tips = {
      search: {
        title: '蓝牙搜索中...',
        icon: 'loading',
        duration: 10000
      },
      connecting: {
        title: '蓝牙连接中...',
        icon: 'loading',
        duration: 60000
      },
      success: {
        title: '连接成功',
        icon: 'success'
      },
      breakSuccess: {
        title: '断开成功',
        icon: 'success'
      },
      break: {
        title: '蓝牙断开连接'
      },
      error: {
        title: '连接失败',
        icon: 'error'
      }
    }
    this.isShowBreakTip = true // 是否提示蓝牙断开连接
    this.deviceFilter = null // 排除搜索到的不需要显示的设备方法
    this.lastPortCloseTimestamp = 0 // 上次蓝牙断开时间
    this.register()
  }

  // 设置 排除搜索到的不需要显示的设备方法
  setDeviceFilter (filter) {
    this.deviceFilter = filter
  }

  bleToast ({
    title,
    icon = 'none',
    duration = 2000
  }) {
    uni.hideToast()
    uni.showToast({
      icon,
      title,
      duration
    })
  }
  register () {
    // 注册蓝牙监听器
    this.bleModule.registerBluetoothListener(ret => {
      let data = JSON.parse(ret.callBackData)
      switch (ret.callBackType) {
        case 'didFoundPort': // 每搜索到一台蓝牙设备回调一次
          if (!data.name) return
          this.foundPort(data)
          break
        case 'didFinishedEnumPorts': // 搜索蓝牙设备结束时回调
          this.searching = false
          this.finishedPort(data)
          break
        case 'didClosePort': // 蓝牙连接后断开时回调
          this.connected = false
          this.portClose()
          break
        case 'didDeivceStatusPackageReceived': // 设备状态数据，蓝牙连接成功后会一直回调
          this.getDeivceStatus(data)
          break
        case 'didSerialnoPackageReceived': // 设备序列号数据，蓝牙连接成功后只回调一次
          this.getDeivceSerialno(data)
          break
      }
    })
  }
  foundPort (item) {
    if (this.deviceFilter) {
      let finalItem = this.deviceFilter(item)
      if (finalItem) {
        this.equipmentList.push(finalItem)
      }
    } else {
      this.equipmentList.push(item)
    }
    console.log('搜索到设备', item.name, item, this.equipmentList)
  }
  finishedPort (list) {
    // this.equipmentList = list
    console.log('完成搜索', list)
    return false
  }
  portClose () {
    let curTimestamp = new Date().getTime()
    if (curTimestamp - this.lastPortCloseTimestamp < 2000) {// 两次回调小于2000毫秒,则不执行下面的代码,解决uni.onBLEConnectionStateChange回调两次bug
      return
    }
    this.lastPortCloseTimestamp = curTimestamp
    console.log('蓝牙断开连接')
    EventBus.post(new EventBus(EventBus.BLE_DEVICE_DISCONNECTED)) // 发送蓝牙断开通知(除了发通知,方案二:可以向BleModule类添加回调数组)
    if (this.isShowBreakTip) {
      this.bleToast(this.tips.break)
    } else {
      this.isShowBreakTip = true
    }
  }
  getDeivceStatus (data) {
    // console.log(data);
    EventBus.post(new EventBus(EventBus.BLE_GET_DEIVCE_STATUS, data))
  }
  getDeivceSerialno (data) {
    // console.log(data)
    EventBus.post(new EventBus(EventBus.BLE_GET_DEIVCE_SERIALNO, data))
  }
  search () { // 搜索设备
    this.searching = true
    this.equipmentList = []
    this.bleModule.startBluetoothDevicesDiscovery()
  }
  /**
   * @param {Object} item 连接的设备
   * @param {Object} connectedSucCallBack 连接成功回调
   * @param {Object} connectedFailCallBack 连接失败回调
   */
  selectEquipment (item, connectedSucCallBack, connectedFailCallBack) { // 选择并连接设备
    let that = this
    that.bleModule.isTurnOnBluetoothSwitch(function () {
      that.equipment = item
      that.bleModule.stopBluetoothDevicesDiscovery()
      that.connect(connectedSucCallBack, connectedFailCallBack)
    }, function (res) {
      if (connectedFailCallBack) {
        connectedFailCallBack(res)
      } else {
        that.bleToast({
          title: res
        })
      }
    })
  }
  async connect (connectedSucCallBack, connectedFailCallBack) { // 连接设备
    let that = this
    this.isShowBreakTip = false
    await this.bleModule.closeBLEConnection().catch(function () { that.isShowBreakTip = true })
    //
    let deviceId = this.equipment.uuid
    this.bleToast(this.tips.connecting)
    this.bleModule.createBLEConnection({
      'deviceId': deviceId
    },
      (res) => {
        console.log(res)
        console.log('连接蓝牙成功')
        this.connected = true
        this.bleToast(this.tips.success)
        if (connectedSucCallBack) {
          connectedSucCallBack(res)
        }
      },
      (res) => {
        console.log(res)
        console.log('连接蓝牙失败')
        this.connected = false
        this.bleToast(this.tips.error)
        if (connectedFailCallBack) {
          connectedFailCallBack(res)
        }
      })
  }
  disConnect () {
    this.searching = false
    this.connected = false
    this.equipment = {}
    this.equipmentList = []
    this.workoutProject = {}
    //
    this.isShowBreakTip = false // 主动断开的不提示断开连接提示
    return this.bleModule.closeBLEConnection()
  }
  selectProject (item) {// 选择计划
    this.workoutProject = item
    // this.sendProject()
  }
  /** 设置治疗时长
   * @param time 单位 秒
   */
  setTreatTime (time) {
    let initcommand = this.bleModule.getInitcommand({ 'initcommand': this.workoutProject.initcommand, time })
    this.workoutProject.initcommand = initcommand // 修改治疗时长后，再设置初始化指令
  }
  sendProject () {
    let workout = this.workoutProject
    this.bleModule.sendInitCmd(workout)
  }
  exitProject () { // 选择计划
    this.workoutProject = {}
    this.bleModule.endTreatment()
  }
  unRegister () { // 取消注册蓝牙监听器
    this.bleModule.unRegisterBluetoothListener()
  }
}
