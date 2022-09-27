/**
 * 杉山ble治疗仪操作类
 *
 * 6
 * 改造前的基本思路：
 * 1.定义并生成操作指令:DeviceCmd
 * 2.引用uniapp蓝牙ble二次封装方法:baseBleModule
 * 3.对设备回调信息进行分类处理:BTSResponseModule
 * 4.事件总线通知类:EventBus
 * 5.结果格式化类，经过UniJSCallbackResponse格式化后暴露
 * 6.BioStimBleModule对逻辑进行初步整合
 * 7.BleModule封装业务给页面使用
 *
 * 改造后的思路
 * 1.所有操作指令定义并生成:DeviceCmd
 * 2.对uniapp蓝牙ble二次封装方法:baseBleModule
 *   2-1.指令发出前进入baseBleModule的队列(commandMQ)
 *   2-2.发送指令(writeBLECharacteristicValue)按队列(commandMQ)发出
 * 3.通用封装（BioStimBleModule）把
 *   a.基类（baseBleModule）
 *   b.指令（DeviceCmd）
 *   c.反馈（BTSResponseModule）
 *   d.通知（EventBus）
 *   用通用逻辑串联起来
 * 4.项目根据业务需要调用BioStimBleModule，eg：
 *   svn://172.16.20.21/SourceCode/webDevelop/consume/pages/index/mixinBLE.js
 *
 * statusCode:
 * 200 ： 成功
 * 201 :  closeBLEConnection 无deviceId导致蓝牙断开失败
 * 202 :  stopBluetoothDevicesDiscovery 停止搜寻蓝牙设备失败
 * 203 ： writeBLECharacteristicValue 指令片段写入完成
 * 204 ： writeBLECharacteristicValue 写入成功但状态有误,实行顺序有误或有失败的情况
 * 205 ： commandMQ 已加入指令执行队列，等待执行
 * 500 ： 失败，错误
 * 501 ： createBLEConnection 创建连接失败
 * 502 ： getBLEDeviceServices 获取服务失败
 * 503 ： getBLEDeviceCharacteristics 获取特征值失败
 * 504 ： notifyBLECharacteristicValueChange 启用订阅失败
 * 510 ： writeBLECharacteristicValue 所有指令已执行完或没有可执行的指令
 * 511 ： writeBLECharacteristicValue 上次指令未执行完完成
 * 513 ： writeBLECharacteristicValue 写入指令失败
 * 520 :  getBLEConnectStatus 获取连接状态失败
 * 521 :  closeBLEConnection 蓝牙断开失败
 * 522 :  onBLEConnectionStateChange 蓝牙处于断开状态
 */
import DeviceCmd from './DeviceCmd.js'
import EventBus from './EventBus.js'
import { BTSResponseModule } from './BTSResponseModule.js'
import baseBleModule from '../BaseBleModule.js'
import project from '../../../../projectConfig'
let mTimeoutTask // 定时关闭搜寻附近的蓝牙
let platform = typeof uni !== 'undefined' && uni.getSystemInfoSync().platform

let mCharacteristicValue = [] // 接收数据包

function showToast (title) {
  uni.showToast({ title, icon: 'none' })
}

// hex转json字符串,16进制ASCII
function hextoString (hex) {
  let arr = hex.split('')
  let out = ''
  for (let i = 0; i < arr.length / 2; i++) {
    let tmp = '0x' + arr[i * 2] + arr[i * 2 + 1]
    let charValue = String.fromCharCode(tmp)
    out += charValue
  }
  return out
}

// ArrayBuffer转16进度字符串示例
function ab2hex (buffer) {
  const hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('')
}

// 制造阻塞
function sleep (numberMillis) {
  let now = new Date()
  let exitTime = now.getTime() + numberMillis
  // eslint-disable-next-line no-constant-condition
  while (true) {
    now = new Date()
    if (now.getTime() > exitTime) {
      return
    }
  }
}

// 写入指令
let writePort = baseBleModule.commandMQ

const BioStimBleModule = {}
BioStimBleModule.deviceList = []// 找到的设备
BioStimBleModule.discoveryTimeout = 10 * 1000 // 停止搜索蓝牙设备超时设置
BioStimBleModule.whiteList = ['MuscStim', 'BioStim', 'SSConsume']
BioStimBleModule.blackList = []

// 连接低功耗蓝牙设备超时设置
BioStimBleModule.connectTimeOut = n => {
  if (n) baseBleModule.connectTimeOut = n
  return baseBleModule.connectTimeOut
}

// 控制writeBLECharacteristicValue时间间隔
BioStimBleModule.writeTime = n => {
  if (n) baseBleModule.writeTime = n
  return baseBleModule.writeTime
}

/**
 * 初始化蓝牙模块
 * 其他蓝牙相关 API 必须在 uni.openBluetoothAdapter 调用之后使用。否则 API 会返回错误（errCode=10000）。
 * 在用户蓝牙开关未开启或者手机不支持蓝牙功能的情况下，调用 uni.openBluetoothAdapter 会返回错误（errCode=10001），表示手机蓝牙功能不可用。
 * 此时APP蓝牙模块已经初始化完成，可通过 uni.onBluetoothAdapterStateChange 监听手机蓝牙状态的改变，也可以调用蓝牙模块的所有API。
 */
// openBluetoothAdapter () {
//   return new Promise(resolve => {
//     let res = baseBleModule.openBluetoothAdapter().then(res => console.log('初始化', res))
//     if (res.statusCode !== 200) {
//       if (res.err.errCode === 10001) res.err = ' 蓝牙没有打开，请打开蓝牙' + res.err.errCode
//       showToast(JSON.stringify(res.err))
//     }
//     return resolve(res)
//   })
// },

BioStimBleModule.openBluetoothAdapter = async () => {
  let res = await baseBleModule.openBluetoothAdapter()
  if (res.statusCode !== 200) {
    EventBus.post(new EventBus(EventBus.BLE_UNREADY, res))
    return res
  }
  EventBus.post(new EventBus(EventBus.BLE_READY, res))
  return res
}

BioStimBleModule.closeBluetoothAdapter = async () => {
  let res = await baseBleModule.closeBluetoothAdapter()
  // openBluetoothAdapter成功执行，手动关闭手机蓝牙，此时closeBluetoothAdapter会失败，那BluetoothAdapter处于什么状态？？
  // 这是一个很底层的报错，如果因此导致问题，只能重启APP
  if (res.statusCode !== 200) {
    showToast(JSON.stringify(res.err))
    return res
  }
  EventBus.post(new EventBus(EventBus.BLE_UNREADY, res))
  return res
}

// 监听蓝牙开关打开状态,会执行两次，后一次才是真实状态
BioStimBleModule.onBluetoothAdapterStateChange = () => {
  let n = 0
  baseBleModule.onBluetoothAdapterStateChange(bleState => {
    if (n === 1) {
      if (bleState.available) EventBus.post(new EventBus(EventBus.BLE_ONLINE, bleState))
      if (!bleState.available) EventBus.post(new EventBus(EventBus.BLE_OFFLINE, bleState))
      n = 0
    }
    n++
  })
}

/**
 * 打开蓝牙开关
 */
BioStimBleModule.turnOnBluetoothSwitch = () => {
  showToast('您的蓝牙没有打开，请打开蓝牙')
  if (platform === 'ios') return plus.runtime.openURL(encodeURI('prefs:root=Bluetooth')) // 测试没有效果
  let main = plus.android.runtimeMainActivity()
  let Context = plus.android.importClass('android.content.Context')
  let BManager = main.getSystemService(Context.BLUETOOTH_SERVICE)
  plus.android.importClass(BManager) // 引入相关的method函数
  let BAdapter = BManager.getAdapter()
  plus.android.importClass(BAdapter) // 引入相关的method函数，这样之后才会有isEnabled函数支持
  if (BAdapter.isEnabled()) return
  BAdapter.enable()
}

// 设置 排除搜索到的不需要显示的设备方法
/**
   * 设备过滤逻辑：
   * 1.必须先配置好白名单(whiteList)和黑名单(blackList)再调用
   * 2.默认判断的字段：name
   * 3.只显示符合白名单判断逻辑，且不在黑名单逻辑内的设备
   * 4.过滤已存在的设备
   * 5.设备名不为空
   *
   * 白名单判断逻辑：1.大小写不敏感；2.模糊匹配
   * 黑名单判断逻辑：1.大小写敏感；2.精准匹配
   */
BioStimBleModule.deviceFilter = newDevice => {
  // deviceList.push(newDevice)
  // EventBus.post(new EventBus(EventBus.SEARCH_BINGO, { newDevice, deviceList }))// 每搜索到一台蓝牙设备回调一次
  let _name = newDevice.name
  let inWhiteList = !!BioStimBleModule.whiteList.find(str => _name.startsWith(str))
  let inBlackList = !!BioStimBleModule.blackList.find(str => _name.startsWith(str))
  let isRepeat = !!BioStimBleModule.deviceList.find(device => device.name === _name)
  if (inWhiteList && !inBlackList && !isRepeat) {
    newDevice.uuid = newDevice.deviceId
    BioStimBleModule.deviceList.push(newDevice)
    EventBus.post(new EventBus(EventBus.SEARCH_BINGO, { newDevice, deviceList: BioStimBleModule.deviceList })) // 每搜索到一台蓝牙设备回调一次
    return newDevice
  }
}

// 开始搜寻附近的蓝牙外围设备
BioStimBleModule.startBluetoothDevicesDiscovery = async () => {
  console.log('开启发现状态')
  await baseBleModule.startBluetoothDevicesDiscovery().catch(err => {
    showToast(JSON.stringify(err))
    return { statusCode: 500, err }
  })
  BioStimBleModule.deviceList = []
  // 监听寻找到新设备的事件
  console.log('开始搜索设备')
  EventBus.post(new EventBus(EventBus.SEARCH_START)) // 搜索蓝牙设备开始

  baseBleModule.onBluetoothDeviceFound(device => {
    if (!device.name) return
    let data = BioStimBleModule.deviceFilter(device)
    return { statusCode: data ? 200 : 500, data, err: data || '过滤掉的设备' }
  })

  mTimeoutTask = setTimeout(BioStimBleModule.stopBluetoothDevicesDiscovery, BioStimBleModule.discoveryTimeout)
}

// 停止搜寻附近的蓝牙外围设备。若已经找到需要的蓝牙设备并不需要继续搜索时，建议调用该接口停止蓝牙搜索。
BioStimBleModule.stopBluetoothDevicesDiscovery = async () => {
  EventBus.post(new EventBus(EventBus.SEARCH_END, BioStimBleModule.deviceList)) // 搜索蓝牙设备结束时回调
  if (!mTimeoutTask) clearTimeout(mTimeoutTask)
  return await baseBleModule.stopBluetoothDevicesDiscovery()
}

// 连接低频神经治疗仪
BioStimBleModule.createBLEConnection = async deviceId => {
  EventBus.post(new EventBus(EventBus.CONNECTING)) // 设备连接中
  let _connection = await baseBleModule.createBLEConnection(deviceId)
  if (_connection.statusCode !== 200) {
    console.error('当前链接状态', _connection)
    EventBus.post(new EventBus(EventBus.CONNECT_FAIL, _connection)) // 设备连接失败
    return _connection
  }

  // 在不知道servicesUUID和characteristicsUUID的情况下，部分手机启用这个阻塞，可以获取到UUID列表
  // sleep(10000)

  let _services = await baseBleModule.getBLEDeviceServices()
  if (_services.statusCode !== 200) {
    console.error('链接_services状态', _services)
    EventBus.post(new EventBus(EventBus.CONNECT_FAIL, _services)) // 设备连接失败
    return _services
  }

  let _characteristics = await baseBleModule.getBLEDeviceCharacteristics()
  if (_characteristics.statusCode !== 200) {
    console.error('链接_characteristics状态', _characteristics)
    EventBus.post(new EventBus(EventBus.CONNECT_FAIL, _characteristics)) // 设备连接失败
    return _characteristics
  }

  // 连接低频神经治疗仪成功后执行的操作
  if (platform === 'android') sleep(1000) // 延时1000ms,太快容易导致uni的10004错误
  let _notify = await baseBleModule.notifyBLECharacteristicValueChange()
  if (_notify.statusCode !== 200) {
    console.error('链接_notify状态', _notify)
    EventBus.post(new EventBus(EventBus.CONNECT_FAIL, _notify)) // 设备连接失败
    return _notify
  }
  if (platform === 'android') sleep(1000) // 延时1000ms

  // 监听低功耗蓝牙设备的特征值变化事件
  console.log('监听设备特征值变化')
  BioStimBleModule.onBLECharacteristicValueChange()

  // 注册监听蓝牙连接状态监听事件
  baseBleModule.onBLEConnectionStateChange(res => {
    if (res.statusCode !== 200) EventBus.post(new EventBus(EventBus.CONNECT_BREAK, res))
    // if (res.statusCode === 200) EventBus.post(new EventBus(EventBus.CONNECTED, res))
    return res
  })

  // 发送配对确认数据包，获取设备id信息
  let _write = await writePort(DeviceCmd.getCmdDeviceInfo())
  if (299 < _write.statusCode) {
    console.error('链接_write状态', _write)
    EventBus.post(new EventBus(EventBus.CONNECT_FAIL, _write)) // 设备连接失败
    return { _write }
  }

  let data = { statusCode: 200, data: '链接成功' }
  EventBus.post(new EventBus(EventBus.CONNECTED, data))
  return data
}

// 配对低频神经治疗仪
BioStimBleModule.createPaired = async pairedRule => {
  EventBus.post(new EventBus(EventBus.PAIRING)) // 设备配对中

  let _pairedVerify = { statusCode: '200', data: '配对默认值' }
  if (pairedRule) _pairedVerify = await pairedRule()

  // 发送蓝牙配对成功通知
  if (_pairedVerify) EventBus.post(new EventBus(EventBus.PAIRED, _pairedVerify))

  // 发送蓝牙配对失败通知
  if (!_pairedVerify) EventBus.post(new EventBus(EventBus.PAIR_FAIL, _pairedVerify))
  return _pairedVerify
}

// 监听低功耗蓝牙设备的特征值变化事件。
// 必须先启用 notifyBLECharacteristicValueChange 接口才能接收到设备推送的 notification
BioStimBleModule.onBLECharacteristicValueChange = () => {
  return baseBleModule.onBLECharacteristicValueChange(res => {
    // 蓝牙只能发送20个字节，如果当前接收包没有包含结束符，表示还没接完，等待接收完成后再进行后续处理
    let tmpValue = hextoString(ab2hex(res.value))
    // 接收到新包先重置
    let newHead = tmpValue.startsWith(DeviceCmd.headDATA) || tmpValue.startsWith(DeviceCmd.headACK) || tmpValue.startsWith(DeviceCmd.headERR)
    if (newHead) mCharacteristicValue = []

    mCharacteristicValue.push(tmpValue)
    let result = mCharacteristicValue.join('')
    let hasHead = result.startsWith(DeviceCmd.headDATA) || result.startsWith(DeviceCmd.headACK) || result.startsWith(DeviceCmd.headERR)
    let hasEnd = result.endsWith(DeviceCmd.end)
    // 有头有尾的完整包
    if (hasHead && hasEnd) {
      // 解析返回结果
      new BTSResponseModule(result)
      mCharacteristicValue = []
    }

    // 没有头的错乱包
    if (!hasHead) mCharacteristicValue = []

    // 有头无尾的错乱包在下次接收新包时丢弃
    // 在最极端情况下，本次接到有头无尾的错乱包，下次接到无头有尾的错乱包，会出现错误
  })
}

/**
 * 发送初始化指令,简单理解就是设置治疗时长那一步(同步方法)
 * 这是单通道设置方法，多通道则多次调用即可
 */
BioStimBleModule.sendInitCmd = async (options, time) => {

  // 重置设备状态 写入d指令 (必须在发送命令前调用)
  // 连续发两条(必须在发送命令前调用)(同步方法)
  await writePort(DeviceCmd.getCmdSubDMa())
  await writePort(DeviceCmd.getCmdSubDMa())

  // 发送程序 写入m指令
  let MCommand = options.initCommand
  let MOptions = MCommand.split(',')
  // 6位是含有channel的指令
  let channel = MOptions.length === 6 ? MOptions[1] : ''
  await writePort(DeviceCmd.setWorkout({ command: MCommand, time }))

  // 阶段字段：ble使用workoutphaselist,优E康使用phaseList,痛经使用workoutPhaseList
  let PCommand = options.phaseList

  // 发送阶段 写入p指令
  PCommand.forEach(async item => {
    await writePort(DeviceCmd.setWorkoutPhase({ command: item.phaseCommand }))
  })

  // 如果有 发送循环 写入l指令
  // for (let i = 1; i < 10; i++) { // 发送loopcommand1-loopcommand9字段的指令
  //   let command = options['loopcommand' + i] || options['loopCommand' + i]
  //   if (command) await writePort(DeviceCmd.setLoop({ command }))
  // }
  let LCommand = options.loopCommand
  LCommand.forEach(async command => {
    if (command) await writePort(DeviceCmd.setLoop({ command }))
  })

  // 如果有 执行变频命令 写入w指令
  let frequencyCommand = options.frequencyCommand
  if (frequencyCommand) await writePort(DeviceCmd.setFre({ command: frequencyCommand }))

  // 如果有 执行阶段变频率命令 写入f指令
  PCommand.forEach(async item => {
    let phaseFrequency = item.phaseFrequency
    if (phaseFrequency) await writePort(DeviceCmd.setNumfre({ command: phaseFrequency }))
  })

  // 如果有 强度差值命令 写入b指令 bchannelCmd
  let relativePower = options.bchannelCmd
  if (relativePower) await writePort(DeviceCmd.setRelativePower({ command: relativePower }))

  // 如果有 方案通道名称 写入a指令 setPlanName 中文写入有问题
  let name = options.name
  if (name && channel) await writePort(DeviceCmd.setPlanName(channel, ''))

  // 执行结束命令 写入e指令
  // 向硬件烧写方案
  // 不保存方案：isSave等于0，planNo是1
  // 保存方案：isSave等于1，channel是1
  // 保存方案的需求还没确定
  const canSave = ['consume'].includes(project.projectName)
  if (!canSave) {
    await writePort(DeviceCmd.setChannelEnd(channel))
    return
  }
  let isSave = 0, planNo = 1
  if (isSave === 1) channel = 1
  await writePort(DeviceCmd.setChannelEnd(channel, isSave, planNo))
}

/**
 * 左侧电流增加(同步方法)
 */
BioStimBleModule.leftPlus = channel => {
  return writePort(DeviceCmd.leftPlus(channel))
}

/**
 * 左侧电流减少(同步方法)
 */
BioStimBleModule.leftMinus = channel => {
  return writePort(DeviceCmd.leftMinus(channel))
}

/**
 * 右侧电流增加(同步方法)
 */
BioStimBleModule.rightPlus = channel => {
  return writePort(DeviceCmd.rightPlus(channel))
}

/**
 * 右侧电流减少(同步方法)
 */
BioStimBleModule.rightMinus = channel => {
  return writePort(DeviceCmd.rightMinus(channel))
}

// 左设电
BioStimBleModule.leftValue = (channel, value) => {
  return writePort(DeviceCmd.leftValue(channel, value))
}

// 右设电
BioStimBleModule.rightValue = (channel, value) => {
  return writePort(DeviceCmd.rightValue(channel, value))
}

/**
 * 下一阶段(同步方法)
 */
BioStimBleModule.nextPhase = channel => {
  return writePort(DeviceCmd.nextPhase(channel))
}

/**
 * 获取硬件的最后一个治疗程序的状态
 */
BioStimBleModule.getRecord = () => {
  return writePort(DeviceCmd.getRecord())
}

/**
 * 硬件把缓存数据清空
 */
BioStimBleModule.clearRecord = () => {
  return writePort(DeviceCmd.clearRecord())
}

/**
 * 治疗记录
 */
BioStimBleModule.setRecord = recordId => {
  return writePort(DeviceCmd.setRecord(recordId))
}

/**
 * 开始治疗(同步方法)
 */
BioStimBleModule.startTreatment = ({ command, channel }) => {
  return writePort(DeviceCmd.startTreatment(({ command, channel })))
}

/**
 * 暂停治疗(同步方法)
 */
BioStimBleModule.pauseTreatment = ({ command, channel }) => {
  return writePort(DeviceCmd.pauseTreatment(({ command, channel })))
}

/**
 * 结束治疗(同步方法)
 */
BioStimBleModule.endTreatment = async ({ command, channel }) => {
  await writePort(DeviceCmd.endTreatment(({ command, channel })))
  // await BioStimBleModule.closeBLEConnection()
}

// 断开蓝牙连接
BioStimBleModule.closeBLEConnection = async () => {
  await baseBleModule.closeBLEConnection()
  // 是断开链接还是断开配对/////？？
  EventBus.post(new EventBus(EventBus.CONNECT_BREAK)) // 发送蓝牙断开成功通知
}

// 获取蓝牙连接状态
BioStimBleModule.getBLEConnectStatus = async () => {
  let res = await baseBleModule.getBLEConnectStatus()

  // 发送蓝牙配对失败通知
  if (res.statusCode !== 200) return EventBus.post(new EventBus(EventBus.BLE_OFFLINE, res))

  // 发送蓝牙配对成功通知
  EventBus.post(new EventBus(EventBus.BLE_ONLINE, res))
}

// 指令历史
BioStimBleModule.commandHistory = baseBleModule.commandHistory
// 设置指令发送完的callback
BioStimBleModule.commandCallback = baseBleModule.commandCallback


export default BioStimBleModule


