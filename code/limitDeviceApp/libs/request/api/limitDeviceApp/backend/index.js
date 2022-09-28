const apis = {
  login: { method: 'POST', url: 'backend/login', group: 'limitDeviceApp', dataType: 'keyValue' },
  searchDevice: { method: 'POST', url: 'backend/searchDevice', group: 'limitDeviceApp', dataType: 'keyValue' },
  unbindingDevice: { method: 'POST', url: 'backend/unbindingDevice', group: 'limitDeviceApp', dataType: 'keyValue' },
  searchUser: { method: 'POST', url: 'backend/searchUser', group: 'limitDeviceApp', dataType: 'keyValue' },
  searchTreatmentRecord: { method: 'POST', url: 'backend/searchTreatmentRecord', group: 'limitDeviceApp', dataType: 'keyValue' }
}

export default apis
