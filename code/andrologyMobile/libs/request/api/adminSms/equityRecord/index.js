const apis = {
  save: {
    method: 'POST',
    url: 'equityRecord/save',
    group: 'adminSms',
    dataType: 'json'
  },
  updateById: {
    method: 'POST',
    url: 'equityRecord/updateById',
    group: 'adminSms',
    dataType: 'json'
  },

  page: {
    method: 'GET',
    url: 'equityRecord/page',
    group: 'adminSms',
    dataType: 'form'
  },
}

export default apis
