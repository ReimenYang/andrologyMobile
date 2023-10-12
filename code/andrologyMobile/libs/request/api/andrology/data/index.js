const apis = {
  getQuestionnaireListForExport: { method: 'POST', url: 'data/getQuestionnaireListForExport', group: 'andrology', dataType: 'json' },//获取问卷列表（数据导出用）
  getOrganizationList: { method: 'POST', url: 'data/getOrganizationList', group: 'andrology', dataType: 'json' },//获取机构列表（数据导出用）
  exportQuestionnaire: { method: 'POST', url: 'data/exportQuestionnaire', group: 'andrology', dataType: 'json' },//导出问卷
  downImportTemplate: { method: 'POST', url: 'data/downImportTemplate', group: 'andrology', dataType: 'json' },//下载导入模板
  importQuestionnaire: { method: 'POST', url: 'data/importQuestionnaire', group: 'andrology', dataType: 'formData' },//导入问卷
  importPatient: { method: 'POST', url: 'data/importPatient', group: 'andrology', dataType: 'json' },//批量导入受试者
  getImportLogList: { method: 'POST', url: 'data/getImportLogList', group: 'andrology', dataType: 'json' },//获取导入记录列表
  getImportLogDetail: { method: 'POST', url: 'data/getImportLogDetail', group: 'andrology', dataType: 'json' },//获取导入记录的明细异常列表
}
export default apis
