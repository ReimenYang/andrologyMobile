/**
 * 对uniapp 蓝牙模块进行封装
 * power by 志凡
 */
// 初始化蓝牙模块。
function openBluetoothAdapter () {
  return new Promise((resolve, reject) => {
    uni.openBluetoothAdapter({
      success: (res) => {
        console.log('openBluetoothAdapter success:', JSON.stringify(res))
        resolve(res)
      },
      fail: (res => {
        console.log('openBluetoothAdapter fail:', JSON.stringify(res))
        reject(res)
      })
    })
  })
}

// 监听蓝牙适配器状态变化事件
function onBluetoothAdapterStateChange (callback) {
  uni.onBluetoothAdapterStateChange(function (res) {
    console.log('adapterState changed, now is', res)
    if (callback) {
      callback(res)
    }
  })
}

// 关闭蓝牙模块。调用该方法将断开所有已建立的连接并释放系统资源。建议在使用蓝牙流程后，与 uni.openBluetoothAdapter 成对调用
function closeBluetoothAdapter () {
  return new Promise((resolve, reject) => {
    uni.closeBluetoothAdapter({
      success: (res) => {
        console.log('closeBluetoothAdapter success:', JSON.stringify(res))
        resolve(res)
      },
      fail: (res => {
        console.log('closeBluetoothAdapter fail:', JSON.stringify(res))
        reject(res)
      })
    })
  })
}

// 开始搜寻附近的蓝牙外围设备
function startBluetoothDevicesDiscovery () {
  return new Promise((resolve, reject) => {
    uni.startBluetoothDevicesDiscovery({
      success: (res) => {
        console.log('startBluetoothDevicesDiscovery success:', JSON.stringify(res))
        resolve(res)
      },
      fail: (res => {
        console.log('startBluetoothDevicesDiscovery fail:', JSON.stringify(res))
        reject(res)
      })
    })
  })
}

// 监听寻找到新设备的事件
function onBluetoothDeviceFound (callback) {
  uni.onBluetoothDeviceFound(function (devices) {
    let re = JSON.parse(JSON.stringify(devices))
    for (let i = 0; i < re.devices.length; i++) {
      callback(re.devices[i])
    }
  })
}

// 停止搜寻附近的蓝牙外围设备。若已经找到需要的蓝牙设备并不需要继续搜索时，建议调用该接口停止蓝牙搜索。
function stopBluetoothDevicesDiscovery () {
  return new Promise((resolve, reject) => {
    uni.stopBluetoothDevicesDiscovery({
      success: (res) => {
        console.log('stopBluetoothDevicesDiscovery success:', JSON.stringify(res))
        resolve(res)
      },
      fail: (res => {
        console.log('stopBluetoothDevicesDiscovery fail:', JSON.stringify(res))
        reject(res)
      })
    })
  })
}

// 连接低功耗蓝牙设备
function createBLEConnection (deviceId) {
  return new Promise((resolve, reject) => {
    uni.createBLEConnection({
      deviceId: deviceId,
      timeout: 10000,
      success: (res) => {
        console.log('createBLEConnection success:', JSON.stringify(res))
        resolve(res)
      },
      fail: (res => {
        console.log('createBLEConnection fail:', JSON.stringify(res))
        reject(res)
      })
    })
  })
}

// 断开与低功耗蓝牙设备的连接。
function closeBLEConnection (deviceId) {
  return new Promise((resolve, reject) => {
    uni.closeBLEConnection({
      deviceId: deviceId,
      success: (res) => {
        console.log('closeBLEConnection success:', JSON.stringify(res))
        resolve(JSON.stringify(res))
      },
      fail: (res => {
        console.log('closeBLEConnection fail:', JSON.stringify(res))
        reject(JSON.stringify(res))
      })
    })
  })
}

// 监听低功耗蓝牙连接状态的改变事件。包括开发者主动连接或断开连接，设备丢失，连接异常断开等等
function onBLEConnectionStateChange (callback) {
  uni.onBLEConnectionStateChange(function (res) {
    // 该方法回调中可以用于处理连接意外断开等异常情况
    // console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
    callback(res)
  })
}

// 获取蓝牙设备所有服务(service)。
function getBLEDeviceServices (deviceId) {
  return new Promise((resolve, reject) => {
    uni.getBLEDeviceServices({
      deviceId: deviceId,
      success: (res) => {
        console.log('getBLEDeviceServices success:', JSON.stringify(res))
        resolve(res)
      },
      fail: (res => {
        console.log('getBLEDeviceServices fail:', JSON.stringify(res))
        reject(res)
      })
    })
  })
}

// 获取蓝牙设备某个服务中所有特征值(characteristic)。
function getBLEDeviceCharacteristics (deviceId, serviceId) {
  return new Promise((resolve, reject) => {
    uni.getBLEDeviceCharacteristics({
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
      deviceId: deviceId,
      // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
      serviceId: serviceId,
      success: (res) => {
        console.log('getBLEDeviceCharacteristics success:', JSON.stringify(res))
        resolve(res)
      },
      fail: (res => {
        console.log('getBLEDeviceCharacteristics fail:', JSON.stringify(res))
        reject(res)
      })
    })
  })
}

// 启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。
// 注意：必须设备的特征值支持 notify 或者 indicate 才可以成功调用。
// 另外，必须先启用 notifyBLECharacteristicValueChange 才能监听到设备 characteristicValueChange 事件
function notifyBLECharacteristicValueChange (deviceId, serviceId, characteristicId) {
  console.log('deviceId', deviceId)
  console.log('serviceId', serviceId)
  return new Promise((resolve, reject) => {
    uni.notifyBLECharacteristicValueChange({
      state: true, // 启用 notify 功能
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
      deviceId: deviceId,
      // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
      serviceId: serviceId,
      // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
      characteristicId,
      success: (res) => {
        console.log('notifyBLECharacteristicValueChange success:', JSON.stringify(res))
        resolve(res)
      },
      fail: (res => {
        console.log('notifyBLECharacteristicValueChange fail:', JSON.stringify(res))
        reject(res)
      })
    })
  })
}

// 监听低功耗蓝牙设备的特征值变化事件。
// 必须先启用 notifyBLECharacteristicValueChange 接口才能接收到设备推送的 notification
function onBLECharacteristicValueChange (callback) {
  uni.onBLECharacteristicValueChange(function (res) {
    callback(res)
  })
}

// 向低功耗蓝牙设备特征值中写入二进制数据。注意：必须设备的特征值支持 write 才可以成功调用。
// 因为每次写入不超过20字节，所以做了分包处理https://www.jianshu.com/p/6e89e73b92a8
function writeBLECharacteristicValue (deviceId, serviceId, characteristicId, msg) {
  console.log('写入指令', msg)
  return new Promise((resolve, reject) => {
    try {
      for (let i = 0; i < msg.length; i += 20) {
        let endLength = 0
        if (i + 20 < msg.length) {
          let senddata = msg
          let buffer = new ArrayBuffer(20)
          let dataView = new DataView(buffer)
          for (let j = i; j < i + 20; j++) {
            dataView.setUint8(j - i, senddata[j].charCodeAt() | 0)
          }
          sleep(100)
          writeBLECharacteristicValue20(deviceId, serviceId, characteristicId, dataView.buffer)
        } else {
          let senddata = msg
          if (20 < msg.length) {
            endLength = senddata.length - i
          } else {
            endLength = senddata.length
          }
          let buffer = new ArrayBuffer(endLength)
          let dataViewLast = new DataView(buffer)
          for (let k = i; k < senddata.length; k++) {
            dataViewLast.setUint8(k - i, senddata[k].charCodeAt() | 0)
          }
          sleep(100)
          writeBLECharacteristicValue20(deviceId, serviceId, characteristicId, dataViewLast.buffer)
        }
      }
      resolve({})
    } catch (err) {
      reject(err)
    }
  })
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

// 向低功耗蓝牙设备特征值中写入二进制数据。注意：必须设备的特征值支持 write 才可以成功调用。
function writeBLECharacteristicValue20 (deviceId, serviceId, characteristicId, buffer) {
  uni.writeBLECharacteristicValue({
    // 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
    deviceId: deviceId,
    // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
    serviceId: serviceId,
    // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
    characteristicId: characteristicId,
    // 这里的value是ArrayBuffer类型
    value: buffer,
    // value: buffer,
    success (res) { // 注意ios不会回调这个回调
      console.log('writeBLECharacteristicValue20 success:' + JSON.stringify(res))
    },
    fail (res) { // 注意ios不会回调这个回调
      console.log('writeBLECharacteristicValue20 fail:' + JSON.stringify(res))
      throw res
    }
  })
}

// 获取蓝牙连接状态
function getBLEConnectStatus (callback) {
  uni.getConnectedBluetoothDevices({
    success: (res) => {
      if (res.devices.length > 0) {
        let msg = {
          'statuscode': '0000',
          'statusmsg': '蓝牙已连接'
        }
        callback(msg)
      } else {
        let msg = {
          'statuscode': '0001',
          'statusmsg': '蓝牙未连接'
        }
        callback(msg)
      }
      console.log('getConnectedBluetoothDevices success:', JSON.stringify(res))
    },
    fail: (res => {
      console.log('getConnectedBluetoothDevices fail:', JSON.stringify(res))
      let msg = {
        'statuscode': '0001',
        'statusmsg': '蓝牙未连接'
      }
      callback(msg)
    })
  })
}

// 蓝牙连接基类
const BaseBleModule = {
  openBluetoothAdapter,
  closeBluetoothAdapter,
  startBluetoothDevicesDiscovery,
  stopBluetoothDevicesDiscovery,
  createBLEConnection,
  closeBLEConnection,
  onBLEConnectionStateChange,
  notifyBLECharacteristicValueChange,
  onBLECharacteristicValueChange,
  getBLEDeviceServices,
  getBLEDeviceCharacteristics,
  writeBLECharacteristicValue,
  onBluetoothDeviceFound,
  getBLEConnectStatus,
  onBluetoothAdapterStateChange
}

export default BaseBleModule
