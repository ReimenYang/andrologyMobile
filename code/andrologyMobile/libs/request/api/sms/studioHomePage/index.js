const apis = {
  save: {
    method: 'POST',
    url: 'studioHomePage/save',
    group: 'sms',
    dataType: 'json'
  },
  getByStudioId: {
    method: 'GET',
    url: 'studioHomePage/getByStudioId',
    group: 'sms',
    dataType: 'form'
  },
  updateById: {
    method: 'POST',
    url: 'studioHomePage/updateById',
    group: 'sms',
    dataType: 'form'
  },
}

export default apis
