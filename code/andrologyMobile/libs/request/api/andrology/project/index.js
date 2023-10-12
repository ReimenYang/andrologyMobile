const apis = {
  getProjectInfo: { method: 'POST', url: 'project/getProjectInfo', group: 'andrology', dataType: 'json' },//获取项目基本信息
  getProjectFullReport: { method: 'POST', url: 'project/getProjectFullReport', group: 'andrology', dataType: 'json' },//获取项目运行情况（整个项目）
  exportProjectFullReport: { method: 'POST', url: 'project/exportProjectFullReport', group: 'andrology', dataType: 'json' },//导出项目运行情况（整个项目）
  getProjectOrgReport: { method: 'POST', url: 'project/getProjectOrgReport', group: 'andrology', dataType: 'json' },//获取项目运行情况（单个机构）
  exportProjectOrgReport: { method: 'POST', url: 'project/exportProjectOrgReport', group: 'andrology', dataType: 'json' },//导出项目运行情况（单个机构）
  getProjectBaseInfo: { method: 'POST', url: 'project/getProjectBaseInfo', group: 'andrology', dataType: 'json' },//获取项目简易信息
}
export default apis
