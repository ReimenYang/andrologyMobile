const apis = {
  page: {
    method: 'GET',
    url: 'studioProject/page',
    group: 'adminSms',
    dataType: 'form'
  },
  getById: {
    method: 'GET',
    url: 'studioProject/getById',
    group: 'adminSms',
    dataType: 'form'
  },
  save: {
    method: 'POST',
    url: 'studioProject/save',
    group: 'adminSms',
    dataType: 'json'
  },
  updateById: {
    method: 'POST',
    url: 'studioProject/updateById',
    group: 'adminSms',
    dataType: 'json'
  },
  removeById: {
    method: 'GET',
    url: 'studioProject/removeById',
    group: 'adminSms',
    dataType: 'form'
  },
}

export default apis
