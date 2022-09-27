const apis = {
  getTreatmentData: { method: 'POST', url: 'treatment/getTreatmentData', group: 'limitDeviceApp', dataType: 'keyValue' },
  startTreatment: { method: 'POST', url: 'treatment/startTreatment', group: 'limitDeviceApp', dataType: 'keyValue' },
  endTreatment: { method: 'POST', url: 'treatment/endTreatment', group: 'limitDeviceApp', dataType: 'keyValue' }
}

export default apis
