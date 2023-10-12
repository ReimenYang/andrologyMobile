const apis = {
  page: {
    method: 'GET',
    url: 'studioDevice/page',
    group: 'adminSms',
    dataType: 'form'
  },
  getById: {
    method: 'GET',
    url: 'studioDevice/getById',
    group: 'adminSms',
    dataType: 'form'
  },
  save: {
    method: 'POST',
    url: 'studioDevice/save',
    group: 'adminSms',
    dataType: 'json'
  },
  updateById: {
    method: 'POST',
    url: 'studioDevice/updateById',
    group: 'adminSms',
    dataType: 'json'
  },
  removeById: {
    method: 'GET',
    url: 'studioDevice/removeById',
    group: 'adminSms',
    dataType: 'form'
  },
}

export default apis
