const apis = {
  saveStudioWorkTime: {
    method: 'POST',
    url: 'studioReserveInformation/saveStudioWorkTime',
    group: 'sms',
    dataType: 'json'
  },
  delDevices: {
    method: 'GET',
    url: 'studioReserveInformation/delDevices',
    group: 'sms',
    dataType: 'form'
  },
  delWorkTime: {
    method: 'GET',
    url: 'studioReserveInformation/delWorkTime',
    group: 'sms',
    dataType: 'form'
  },
  getStudioList: {
    method: 'GET',
    url: 'studioReserveInformation/getStudioList',
    group: 'sms',
    dataType: 'form'
  },
  getStudioInfo: {
    method: 'GET',
    url: 'studioReserveInformation/getStudioInfo',
    group: 'sms',
    dataType: 'form'
  },
  getStudioDeviceList: {
    method: 'GET',
    url: 'studioReserveInformation/getStudioDeviceList',
    group: 'sms',
    dataType: 'form'
  },
  getItemList: {
    method: 'GET',
    url: 'studioReserveInformation/getItemList',
    group: 'sms',
    dataType: 'form'
  },
  getStudioWorkTimeList: {
    method: 'GET',
    url: 'studioReserveInformation/getStudioWorkTimeList',
    group: 'sms',
    dataType: 'form'
  },
  getReservationRecord: {
    method: 'GET',
    url: 'studioReserveInformation/getReservationRecord',
    group: 'sms',
    dataType: 'form'
  },
  getRecentReservationRecord: {
    method: 'GET',
    url: 'studioReserveInformation/getRecentReservationRecord',
    group: 'sms',
    dataType: 'form'
  },
  getReservedDevice: {
    method: 'GET',
    url: 'studioReserveInformation/getReservedDevice',
    group: 'sms',
    dataType: 'form'
  },
  cancelTheReservation: {
    method: 'GET',
    url: 'studioReserveInformation/cancelTheReservation',
    group: 'sms',
    dataType: 'form'
  },
  signIn: {
    method: 'GET',
    url: 'studioReserveInformation/signIn',
    group: 'sms',
    dataType: 'form'
  },
  saveReservationRecord: {
    method: 'POST',
    url: 'studioReserveInformation/saveReservationRecord',
    group: 'sms',
    dataType: 'json'
  },
  updateReservationRecord: {
    method: 'POST',
    url: 'studioReserveInformation/updateReservationRecord',
    group: 'sms',
    dataType: 'json'
  },
  sendMsgToUser: {
    method: 'POST',
    url: 'studioReserveInformation/sendMsgToUser',
    group: 'sms',
    dataType: 'json'
  },
  getReservationRecordForDoctor: {
    method: 'GET',
    url: 'studioReserveInformation/getReservationRecordForDoctor',
    group: 'sms',
    dataType: 'form'
  },
  saveWorkTimeForDate: {
    method: 'POST',
    url: 'studioReserveInformation/saveWorkTimeForDate',
    group: 'sms',
    dataType: 'json'
  },
  deleteWorkTimeForDate: {
    method: 'POST',
    url: 'studioReserveInformation/deleteWorkTimeForDate',
    group: 'sms',
    dataType: 'json'
  },
  getReservationStatusForMonth: {
    method: 'GET',
    url: 'studioReserveInformation/getReservationStatusForMonth',
    group: 'sms',
    dataType: 'form'
  },
  saveWorkTimeForDate: {
    method: 'POST',
    url: 'studioReserveInformation/saveWorkTimeForDate',
    group: 'sms',
    dataType: 'json'
  },
  updateStudioWorkTime: {
    method: 'POST',
    url: 'studioReserveInformation/updateStudioWorkTime',
    group: 'sms',
    dataType: 'json'
  },
  saveOrUpdateSpecialSetting: {
    method: 'POST',
    url: 'studioReserveInformation/saveOrUpdateSpecialSetting',
    group: 'sms',
    dataType: 'json'
  },
  getUserReservationRecord: {
    method: 'GET',
    url: 'studioReserveInformation/getUserReservationRecord',
    group: 'sms',
    dataType: 'json'
  },
  manualReservation: {
    method: 'POST',
    url: 'studioReserveInformation/manualReservation',
    group: 'sms',
    dataType: 'json'
  },
  getItemListByUserId: {
    method: 'GET',
    url: 'studioReserveInformation/getItemListByUserId',
    group: 'sms',
    dataType: 'json'
  },
  exportUserReservationRecord: {
    method: 'GET',
    url: 'studioReserveInformation/exportUserReservationRecord',
    group: 'sms',
    dataType: 'json'
  },
}

export default apis
