// 事件总线通知类
export default class EventBus {
  static TAG = 'EventBus' // 事件标识
  static ADD_DEVICE_SUCCESS = 'add_device_success'// /添加设备成功
  static DELETE_DEVICE_SUCCESS = 'delete_device_success'// /删除设备成功
  static UPDATE_DEVICE_SUCCESS = 'update_device_success'// /更新设备成功
  static BLE_DEVICE_DISCONNECTED = 'ble_device_disconnected'// 蓝牙设备断开连接
  static BLE_DEVICE_CONNECTED = 'ble_device_connected'// 蓝牙设备连接成功
  static BLE_GET_DEIVCE_SERIALNO = 'ble_get_deivce_serialno'// 蓝牙获取到serialno
  static BLE_GET_DEIVCE_STATUS = 'ble_get_deivce_status'// 蓝牙获取到设备数据
  static ADD_PATIENT_SUCCESS = 'add_patient_success'// 添加患者成功
  static EDIT_PATIENT_SUCCESS = 'edit_patient_success'// 编辑患者成功
  static DELETE_PATIENT_SUCCESS = 'delete_patient_success'// 删除患者成功

  constructor(msgCode, data) {
    this.msgCode = msgCode
    this.data = data
  }

  static register (callback) {
    uni.$on(EventBus.TAG, callback)
  }

  static unregister (callback) {
    uni.$off(EventBus.TAG, callback)
  }

  static post (event) {
    uni.$emit(EventBus.TAG, event)
  }
}
