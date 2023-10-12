const apis = {
  getPatientList: { method: 'POST', url: 'patient/getPatientList', group: 'andrology', dataType: 'json' },//项目受试者列表

  newPatient: { method: 'POST', url: 'patient/newPatient', group: 'andrology', dataType: 'json' },//新增受试者

  modifyPatient: { method: 'POST', url: 'patient/modifyPatient', group: 'andrology', dataType: 'json' },//修改受试者

  deletePatient: { method: 'POST', url: 'patient/deletePatient', group: 'andrology', dataType: 'json' },//删除受试者

  getPatientFileInfo: { method: 'POST', url: 'patient/getPatientFileInfo', group: 'andrology', dataType: 'json' },//获取受试者文件信息（知情同意书，其他文件，图片）

  addPatientFile: { method: 'POST', url: 'patient/addPatientFile', group: 'andrology', dataType: 'json' },//新增受试者文件

  deletePatientFile: { method: 'POST', url: 'patient/deletePatientFile', group: 'andrology', dataType: 'json' },//删除受试者文件

  modifyPatientFileName: { method: 'POST', url: 'patient/modifyPatientFileName', group: 'andrology', dataType: 'json' },//删除受试者文件

  getPatientScreeningInfo: { method: 'POST', url: 'patient/getPatientScreeningInfo', group: 'andrology', dataType: 'json' },//获取受试者筛查信息

  join: { method: 'POST', url: 'patient/join', group: 'andrology', dataType: 'json' },//入组

  exclude: { method: 'POST', url: 'patient/exclude', group: 'andrology', dataType: 'json' },//排除

  signature: { method: 'POST', url: 'patient/signature', group: 'andrology', dataType: 'json' },//签名

  finish: { method: 'POST', url: 'patient/finish', group: 'andrology', dataType: 'json' },//完成

  stop: { method: 'POST', url: 'patient/stop', group: 'andrology', dataType: 'json' },//中止

  falloff: { method: 'POST', url: 'patient/falloff', group: 'andrology', dataType: 'json' },//脱落
}
export default apis
