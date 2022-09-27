const apis = {
  checkImageCodeAndSendSms: { method: 'GET', url: 'coreuser/checkImageCodeAndSendSms', group: 'core', dataType: 'form' },
  checkPersonalInformation: { method: 'GET', url: 'coreuser/checkPersonalInformation', group: 'core', dataType: 'form' },
  checkPhone: { method: 'GET', url: 'coreuser/checkPhone', group: 'core', dataType: 'form' },
  checkvalidateQwCode: { method: 'GET', url: 'coreuser/checkvalidateQwCode', group: 'core', dataType: 'form' },
  getUserByOpenIdOrUnionId: { method: 'GET', url: 'coreuser/getUserByOpenIdOrUnionId', group: 'core' },
  getUserByQwcode: { method: 'GET', url: 'coreuser/getUserByQwcode', group: 'core', dataType: 'form' },
  userUpdateInfo: { method: 'POST', url: 'coreuser/userUpdateInfo', group: 'core', dataType: 'form' }
  }

  export default apis
