/**
 * 杉山ble治疗仪操作类
 * power by 志凡
 *
 * 基本思路：
 * 定义并生成操作指令:DeviceCmd
 * 引用uniapp蓝牙ble二次封装方法:baseBleModule
 * 生产操作类，经过UniJSCallbackResponse格式化后暴露
 * 最后由BleModule进一步封装给页面使用
 *
 * 建议项：
 * ACS_SERVICE_UUID和DATA_LINE_UUID写死了，建议设备上取
 * getInitcommand方法可以优化
 * sleep方法while的判断不建议使用常量，建议接收设备返回ACK指令后回调
 * 停止搜索蓝牙设备建议设置默认值，且允许外部传入自定义停止时间
 */
import DeviceCmd from './DeviceCmd.js'
import { BTSResponseModule } from './BTSResponseModule.js'
import baseBleModule from '../BaseBleModule.js'
import { UniJSCallbackResponse } from './UniJSCallbackResponse.js'
let mGlobalCallback = null // 全局回调变量
// 注册蓝牙回调
function registerBluetoothListener (callback) {
  mGlobalCallback = callback
}

// 取消蓝牙回调
function unRegisterBluetoothListener () {
  mGlobalCallback = null
}

function showToast (title) {
  uni.showToast({
    title: title,
    icon: 'none',
  })
}

// 开始搜寻附近的蓝牙外围设备
let mDeviceList = []
let mTimeoutTask // 延时任务
function startBluetoothDevicesDiscovery (successCallback, failCallback) {
  baseBleModule.openBluetoothAdapter().then(function () {
    baseBleModule.startBluetoothDevicesDiscovery().then(function () {
      mDeviceList = []
      // 监听寻找到新设备的事件
      baseBleModule.onBluetoothDeviceFound(function (device) {
        device.uuid = device.deviceId
        mDeviceList.push(device)
        if (successCallback) {
          successCallback(device)
        }
        if (mGlobalCallback) {
          let uniJSCallbackResponse = new UniJSCallbackResponse('didFoundPort',
            device)
          mGlobalCallback(uniJSCallbackResponse)
        }
      })
      // 10s后停止搜索蓝牙设备
      let timeout = 10000
      mTimeoutTask = setTimeout(function () {
        stopBluetoothDevicesDiscovery()
      }, timeout)
    }).catch(function (res) {
      showToast(JSON.stringify(res))
      if (failCallback) {
        failCallback(res)
      }
    })
  }).catch(function (res) {
    if (res.errCode === 10001) {
      turnOnBluetoothSwitch()
    } else {
      showToast(JSON.stringify(res))
    }
    if (failCallback) {
      failCallback(res)
    }
  })
}

/**
 * 打开蓝牙开关
 */
function turnOnBluetoothSwitch () {
  showToast('您的蓝牙没有打开，请打开蓝牙')
  let platform = uni.getSystemInfoSync().platform
  if (platform.toLowerCase() === 'android') {
    let main = plus.android.runtimeMainActivity()
    let Context = plus.android.importClass('android.content.Context')
    let BManager = main.getSystemService(Context.BLUETOOTH_SERVICE)
    plus.android.importClass(BManager) // 引入相关的method函数
    let BAdapter = BManager.getAdapter()
    plus.android.importClass(BAdapter) // 引入相关的method函数，这样之后才会有isEnabled函数支持
    if (!BAdapter.isEnabled()) {
      BAdapter.enable()
    }
  } else {
    // showToast("您的蓝牙没有打开，请打开蓝牙")
    plus.runtime.openURL(encodeURI('prefs:root=Bluetooth')) // 测试没有效果
  }
}

// 监听蓝牙开关打开状态
function onBluetoothAdapterStateChange (availableCallback) {
  baseBleModule.onBluetoothAdapterStateChange(function (res) {
    if (res.available && !res.discovering) {
      if (availableCallback) {
        availableCallback()
      }
    }
  })
}

/**
 * 是否已经打开蓝牙开关
 */
function isTurnOnBluetoothSwitch (yesCallback, noCallback) {
  baseBleModule.openBluetoothAdapter().then(function () {
    if (yesCallback) {
      yesCallback()
    }
  }).catch(function (res) {
    if (res.errCode === 10001) {
      if (noCallback) {
        noCallback('您的蓝牙没有打开，请打开蓝牙')
      }
    } else {
      showToast(JSON.stringify(res))
    }
  })
}

// 停止搜寻附近的蓝牙外围设备。若已经找到需要的蓝牙设备并不需要继续搜索时，建议调用该接口停止蓝牙搜索。
function stopBluetoothDevicesDiscovery () {
  if (!mTimeoutTask) {
    clearTimeout(mTimeoutTask)
  }
  baseBleModule.stopBluetoothDevicesDiscovery().then(function () {
    if (mGlobalCallback) {
      let uniJSCallbackResponse = new UniJSCallbackResponse(
        'didFinishedEnumPorts', mDeviceList)
      mGlobalCallback(uniJSCallbackResponse)
    }
  }).catch(function () {
    if (mGlobalCallback) {
      let uniJSCallbackResponse = new UniJSCallbackResponse(
        'didFinishedEnumPorts', mDeviceList)
      mGlobalCallback(uniJSCallbackResponse)
    }
  })
}

// 监听低功耗蓝牙设备的特征值变化事件。
// 必须先启用 notifyBLECharacteristicValueChange 接口才能接收到设备推送的 notification
let mCharacteristicValue = []

function onBLECharacteristicValueChange (callback) {
  mCharacteristicValue = []
  baseBleModule.onBLECharacteristicValueChange(function (res) {
    // 蓝牙只能发送20个字节，如果当前接收包没有包含结束符，表示还没接完，等待接收完成后再进行后续处理
    let tmpValue = hextoString(ab2hex(res.value))
    mCharacteristicValue.push(tmpValue)
    let result = mCharacteristicValue.join('')
    // 检查包的顺序
    if (result.indexOf(DeviceCmd.end) !== -1 && (result.indexOf(DeviceCmd.head) === -1 & result.indexOf(
      DeviceCmd.head2) === -1)) {
      mCharacteristicValue = [] // 错乱数据包，掉弃
      return
    }
    // 检查包的完整性
    if ((result.indexOf(DeviceCmd.head) !== -1 || result.indexOf(DeviceCmd.head2) !== -1) && result
      .indexOf(DeviceCmd.end) !== -1) {
      let bTSResponseModule = new BTSResponseModule(result)
      if (bTSResponseModule.isFullPackage) {
        callback(bTSResponseModule)
      }
      mCharacteristicValue = []
    }
  })
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

const ACS_SERVICE_UUID = '0000FFB0-0000-1000-8000-00805F9B34FB'
const DATA_LINE_UUID = '0000ffb2-0000-1000-8000-00805f9b34fb'
let mDeviceId
// 连接低频神经治疗仪
function createBLEConnection (deviceIdObj, successCallback, failCallback) {
  let deviceId = deviceIdObj.deviceId
  baseBleModule.createBLEConnection(deviceId).then(function () {
    let platform = uni.getSystemInfoSync().platform
    if (platform.toLowerCase() === 'android') {
      doAfterBLEConnectionSuccess(deviceId, successCallback, failCallback, platform)
    } else {
      baseBleModule.getBLEDeviceServices(deviceId).then(function () {
        baseBleModule.getBLEDeviceCharacteristics(deviceId, ACS_SERVICE_UUID, DATA_LINE_UUID)
          .then(function () {
            doAfterBLEConnectionSuccess(deviceId, successCallback, failCallback,
              platform)
          }).catch(function (res) {
            console.log(JSON.stringify(res))
            failCallback(res)
          })
      }).catch(function (res) {
        console.log(JSON.stringify(res))
        failCallback(res)
      })
    }
  }).catch(function (res) {
    console.log(JSON.stringify(res))
    failCallback(res)
  })
}

// 连接低频神经治疗仪成功后执行的操作
function doAfterBLEConnectionSuccess (deviceId, successCallback, failCallback, platform) {
  if (platform.toLowerCase() === 'android') {
    sleep(1000) // 延时1000ms
  }
  baseBleModule.notifyBLECharacteristicValueChange(deviceId, ACS_SERVICE_UUID,
    DATA_LINE_UUID)
    .then(function () {
      if (platform.toLowerCase() === 'android') {
        sleep(1000) // 延时1000ms
      }
      mDeviceId = deviceId
      // 监听低功耗蓝牙设备的特征值变化事件
      onBLECharacteristicValueChange(function (res) {
        if (mGlobalCallback) {
          if (res.rawData.indexOf('DATA:s') !== -1) {
            let uniJSCallbackResponse = new UniJSCallbackResponse(
              'didDeivceStatusPackageReceived', res)
            mGlobalCallback(uniJSCallbackResponse)
          } else if (res.rawData.indexOf('ACK:c') !== -1) { // 配对确认包，获取设备id指令
            let serialno = res.rawData.split(',')[2]
            let modelno = res.rawData.split(',')[3].split('-')[0]
            res.serialno = serialno
            res.modelno = modelno
            let uniJSCallbackResponse = new UniJSCallbackResponse(
              'didSerialnoPackageReceived', res)
            mGlobalCallback(uniJSCallbackResponse)
          }
        }
      })
      // 发送配对确认数据包，获取设备id信息
      baseBleModule.writeBLECharacteristicValue(deviceId,
        ACS_SERVICE_UUID,
        DATA_LINE_UUID,
        DeviceCmd.getCmdDeviceInfo()).then(function (res) {
          successCallback(res)
        }).catch(function (res) {
          failCallback(res)
        })
      // 监听蓝牙连接状态
      baseBleModule.onBLEConnectionStateChange(function (res) {
        if (!res.connected) {
          if (mGlobalCallback) {
            let uniJSCallbackResponse = new UniJSCallbackResponse(
              'didClosePort', res)
            mGlobalCallback(uniJSCallbackResponse)
          }
        }
      })
    }).catch(function (res) {
      console.log(JSON.stringify(res))
      failCallback(res)
    })
}

// 断开蓝牙连接
function closeBLEConnection () {
  if (mDeviceId) {
    return baseBleModule.closeBLEConnection(mDeviceId)
  } else {
    return new Promise((resolve, reject) => {
      console.log('设备的id不能为空')
      reject('断开失败')
    })
  }
}

function writePort (cmd) {
  baseBleModule.writeBLECharacteristicValue(mDeviceId, ACS_SERVICE_UUID, DATA_LINE_UUID, cmd)
}

/**
 * 发送指令(同步方法)
 */
function sendCmd (options) {
  let cmd = options.data
  cmd = cmd + DeviceCmd.end // 补充完整指令，因为指令格式以\r\n\0结束
  sleep(100)
  writePort(cmd)
}

/**
 * 获取初始始指令
 * @param {Object} options
 * OBJECT 参数说明
   属性	类型	说明
   initcommand	String	原来的initcommand
   time	Number	时长，单位 秒
 */
function getInitcommand (options) {
  let initcommand = options.initcommand
  if (!initcommand && !(initcommand.endsWith('\r\n\0') || initcommand.endsWith('\\r\\n\\0'))) {
    initcommand = initcommand + DeviceCmd.end
  }
  let time = options.time
  if (!initcommand) {
    initcommand = ''
  }
  if (initcommand.startsWith('DATA:') && (initcommand.endsWith('\r\n\0') || initcommand.endsWith('\\r\\n\\0'))) {
    let tmp = initcommand.replace('DATA:', '')
    tmp = tmp.replace('\r\n\0', '').replace('\\r\\n\\0', '')
    let cmdArray = tmp.split(',')
    if (cmdArray.length >= 5) {
      // 109是ASSIC码表中'm'对应的值
      let sum = 109 + parseInt(cmdArray[1]) + parseInt(cmdArray[2]) + parseInt(time)
      initcommand = 'DATA:m,' + parseInt(cmdArray[1]) + ',' + parseInt(cmdArray[2]) + ',' +
        parseInt(time) + ',' + sum
      initcommand = initcommand + DeviceCmd.end
    }
  }
  return initcommand
}

/**
 * 发送初始化指令,简单理解就是设置治疗时长那一步(同步方法)
 */
function sendInitCmd (options) {
  console.log('发送初始化指令', options)
  resetDeviceStatusBeforeSendCmd() // 重置设备状态(必须在发送命令前调用)
  let jsonObject = {}
  jsonObject.data = options.initcommand
  sendCmd(jsonObject)
  // 阶段字段：ble使用workoutphaselist,消费电子使用phaseList
  let jsonArray = options.workoutphaselist || options.phaseList
  for (let i = 0; i < jsonArray.length; i++) {
    jsonObject.data = jsonArray[i].phasecommand
    sendCmd(jsonObject)
  }
  for (let i = 1; i < 10; i++) { // 发送loopcommand1-loopcommand9字段的指令
    let key = 'loopcommand' + i
    let loopcommand = options[key]
    if (!loopcommand && loopcommand !== '') {
      jsonObject.data = loopcommand
      sendCmd(jsonObject)
    }
  }
  // 执行变频命令
  let frequencycommand = options.frequencycommand
  if (!frequencycommand && frequencycommand !== '') {
    jsonObject.data = frequencycommand
    sendCmd(jsonObject)
  }
  // 执行阶段变频率命令
  for (let i = 0; i < jsonArray.length; i++) {
    let phasefrequency = jsonArray[i].phasefrequency
    if (!phasefrequency && phasefrequency !== '') {
      jsonObject.data = phasefrequency
      sendCmd(jsonObject)
    }
  }
  jsonObject.data = options.finishcommand
  sendCmd(jsonObject)
}

/**
 * 重置设备状态(必须在发送命令前调用)(同步方法)
 */
function resetDeviceStatusBeforeSendCmd () {
  for (let i = 0; i < 2; i++) {
    let cmd = DeviceCmd.getCmdSubDMa() // 连续发两条d 命令
    sleep(100)
    writePort(cmd)
  }
}

/**
 * 左侧电流增加(同步方法)
 */
function addLeftMa () {
  let cmd = DeviceCmd.getCmdAddLeftMa()
  sleep(100)
  writePort(cmd)
}

/**
 * 左侧电流减少(同步方法)
 */
function subLeftMa () {
  let cmd = DeviceCmd.getCmdSubLeftMa()
  sleep(100)
  writePort(cmd)
}

/**
 * 右侧电流增加(同步方法)
 */
function addRightMa () {
  let cmd = DeviceCmd.getCmdAddRightMa()
  sleep(100)
  writePort(cmd)
}

/**
 * 右侧电流减少(同步方法)
 */
function subRightMa () {
  let cmd = DeviceCmd.getCmdSubRightMa()
  sleep(100)
  writePort(cmd)
}

/**
 * 下一阶段(同步方法)
 */
function nextPhase () {
  let cmd = DeviceCmd.getNextPhase()
  sleep(100)
  writePort(cmd)
}

function sleep (numberMillis) {
  let now = new Date()
  let exitTime = now.getTime() + numberMillis
  while (true) {
    now = new Date()
    if (now.getTime() > exitTime) {
      return
    }
  }
}

/**
 * 开始治疗(同步方法)
 */
function startTreatment () {
  let cmd = DeviceCmd.getBegin()
  sleep(100)
  writePort(cmd)
}

/**
 * 暂停治疗(同步方法)
 */
function pauseTreatment () {
  let cmd = DeviceCmd.getWait()
  sleep(100)
  writePort(cmd)
}

/**
 * 结束治疗(同步方法)
 */
function endTreatment () {
  let cmd = DeviceCmd.getCleanSetting()
  sleep(100)
  writePort(cmd)
}

const BioStimBleModule = {
  startBluetoothDevicesDiscovery,
  stopBluetoothDevicesDiscovery,
  createBLEConnection,
  closeBLEConnection,
  getInitcommand,
  sendInitCmd,
  addLeftMa,
  subLeftMa,
  addRightMa,
  subRightMa,
  nextPhase,
  startTreatment,
  pauseTreatment,
  endTreatment,
  registerBluetoothListener,
  unRegisterBluetoothListener,
  onBLECharacteristicValueChange,
  getBLEConnectStatus: baseBleModule.getBLEConnectStatus,
  isTurnOnBluetoothSwitch,
  turnOnBluetoothSwitch,
  onBluetoothAdapterStateChange
}

export default BioStimBleModule
