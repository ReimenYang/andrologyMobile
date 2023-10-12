const apis = {
  getStudioWorkTimeList: {
    method: 'GET',
    url: 'reservationSetting/getStudioWorkTimeList',
    group: 'sms',
    dataType: 'form'
  },
  setSpecialWorkPeriod: {
    method: 'POST',
    url: 'reservationSetting/setSpecialWorkPeriod',
    group: 'sms',
    dataType: 'json'
  },
  updateTheSchedule: {
    method: 'GET',
    url: 'reservationSetting/updateTheSchedule',
    group: 'sms',
    dataType: 'form'
  },
  specialWorkPeriodPage: {
    method: 'GET',
    url: 'reservationSetting/specialWorkPeriodPage',
    group: 'sms',
    dataType: 'form'
  },
  delSpecialWorkPeriod: {
    method: 'GET',
    url: 'reservationSetting/delSpecialWorkPeriod',
    group: 'sms',
    dataType: 'form'
  },
  delWorkTime: {
    method: 'GET',
    url: 'reservationSetting/delWorkTime',
    group: 'sms',
    dataType: 'form'
  },
  saveOrUpdateStudioWorkTime: {
    method: 'POST',
    url: 'reservationSetting/saveOrUpdateStudioWorkTime',
    group: 'sms',
    dataType: 'json'
  },
}

export default apis
