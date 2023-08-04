const apis = {
  save: {
    method: 'POST',
    url: 'patientStudio/save',
    group: 'adminSms',
    dataType: 'json'
  },
  updateById: {
    method: 'POST',
    url: 'patientStudio/updateById',
    group: 'adminSms',
    dataType: 'form'
  },
  getById: {
    method: 'GET',
    url: 'patientStudio/getById',
    group: 'adminSms',
    dataType: 'form'
  },
  removeById: {
    method: 'GET',
    url: 'patientStudio/removeById',
    group: 'adminSms',
    dataType: 'form'
  },
  page: {
    method: 'GET',
    url: 'patientStudio/page',
    group: 'adminSms',
    dataType: 'form'
  },
}

export default apis
