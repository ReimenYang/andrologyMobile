const apis = {
  getProjectList: { method: 'POST', url: 'projectMgt/getProjectList', group: 'andrology', dataType: 'json' },//获取项目列表
  createProject: { method: 'POST', url: 'projectMgt/createProject', group: 'andrology', dataType: 'json' },//创建项目
  getProjectBaseInfo: { method: 'POST', url: 'projectMgt/getProjectBaseInfo', group: 'andrology', dataType: 'json' },//获取项目基本信息
  modifyProjectBaseInfo: { method: 'POST', url: 'projectMgt/modifyProjectBaseInfo', group: 'andrology', dataType: 'json' },//修改项目基本信息
  startProject: { method: 'POST', url: 'projectMgt/startProject', group: 'andrology', dataType: 'json' },//启用项目
  stopProject: { method: 'POST', url: 'projectMgt/stopProject', group: 'andrology', dataType: 'json' },//暂停项目
  getProjectFileList: { method: 'POST', url: 'projectMgt/getProjectFileList', group: 'andrology', dataType: 'json' },//项目文件列表
  addProjectFile: { method: 'POST', url: 'projectMgt/addProjectFile', group: 'andrology', dataType: 'json' },//增加项目文件
  deleteProjectFile: { method: 'POST', url: 'projectMgt/deleteProjectFile', group: 'andrology', dataType: 'json' },//删除项目文件
  getProjectVideoList: { method: 'POST', url: 'projectMgt/getProjectVideoList', group: 'andrology', dataType: 'json' },//项目视频列表
  addProjectVideo: { method: 'POST', url: 'projectMgt/addProjectVideo', group: 'andrology', dataType: 'json' },//增加项目视频
  deleteProjectVideo: { method: 'POST', url: 'projectMgt/deleteProjectVideo', group: 'andrology', dataType: 'json' },//删除项目视频
  getProjectGroupList: { method: 'POST', url: 'projectMgt/getProjectGroupList', group: 'andrology', dataType: 'json' },//项目分组列表
  addProjectGroup: { method: 'POST', url: 'projectMgt/addProjectGroup', group: 'andrology', dataType: 'json' },//增加项目分组
  modifyProjectGroup: { method: 'POST', url: 'projectMgt/modifyProjectGroup', group: 'andrology', dataType: 'json' },//修改项目分组
  deleteProjectGroup: { method: 'POST', url: 'projectMgt/deleteProjectGroup', group: 'andrology', dataType: 'json' },//删除项目分组
  getProjectOrgList: { method: 'POST', url: 'projectMgt/getProjectOrgList', group: 'andrology', dataType: 'json' },//项目机构列表
  addProjectOrg: { method: 'POST', url: 'projectMgt/addProjectOrg', group: 'andrology', dataType: 'json' },//增加项目机构
  modifyProjectOrg: { method: 'POST', url: 'projectMgt/modifyProjectOrg', group: 'andrology', dataType: 'json' },//修改项目机构
  deleteProjectOrg: { method: 'POST', url: 'projectMgt/deleteProjectOrg', group: 'andrology', dataType: 'json' },//删除项目机构
  getProjectRoleList: { method: 'POST', url: 'projectMgt/getProjectRoleList', group: 'andrology', dataType: 'json' },//项目角色列表
  addProjectRole: { method: 'POST', url: 'projectMgt/addProjectRole', group: 'andrology', dataType: 'json' },//增加项目角色
  modifyProjectRole: { method: 'POST', url: 'projectMgt/modifyProjectRole', group: 'andrology', dataType: 'json' },//修改项目角色
  deleteProjectRole: { method: 'POST', url: 'projectMgt/deleteProjectRole', group: 'andrology', dataType: 'json' },//删除项目角色
  getProjectUserList: { method: 'POST', url: 'projectMgt/getProjectUserList', group: 'andrology', dataType: 'json' },//项目用户列表
  addProjectUser: { method: 'POST', url: 'projectMgt/addProjectUser', group: 'andrology', dataType: 'json' },//增加项目用户
  modifyProjectUser: { method: 'POST', url: 'projectMgt/modifyProjectUser', group: 'andrology', dataType: 'json' },//修改项目用户
  deleteProjectUser: { method: 'POST', url: 'projectMgt/deleteProjectUser', group: 'andrology', dataType: 'json' },//删除项目用户
  sendProjectSMS: { method: 'POST', url: 'projectMgt/sendProjectSMS', group: 'andrology', dataType: 'json' },//群发验证码
  disableProjectUser: { method: 'POST', url: 'projectMgt/disableProjectUser', group: 'andrology', dataType: 'json' },//停用项目用户
  enableProjectUser: { method: 'POST', url: 'projectMgt/enableProjectUser', group: 'andrology', dataType: 'json' },//启用项目用户
  searchUser: { method: 'POST', url: 'projectMgt/searchUser', group: 'andrology', dataType: 'json' },// 搜索用户
}
export default apis
