const apis = {
  getOrganizationList: { method: 'POST', url: 'crf/getOrganizationList', group: 'andrology', dataType: 'json' },//根据权限获取组织机构列表
  getPatientList: { method: 'POST', url: 'crf/getPatientList', group: 'andrology', dataType: 'json' },//根据权限获取受试者列表
  getPatientInfo: { method: 'POST', url: 'crf/getPatientInfo', group: 'andrology', dataType: 'json' },//获取受试者信息
  getQuestionnaire: { method: 'POST', url: 'crf/getQuestionnaire', group: 'andrology', dataType: 'json' },//获取受试者问卷信息
  submitQuestionnaire: { method: 'POST', url: 'crf/submitQuestionnaire', group: 'andrology', dataType: 'json' },//批量提交问卷
  questionSDV: { method: 'POST', url: 'crf/questionSDV', group: 'andrology', dataType: 'json' },//问题验证通过
  cancelQuestionSDV: { method: 'POST', url: 'crf/cancelQuestionSDV', group: 'andrology', dataType: 'json' },//取消问题验证通过
  newQuestionAsk: { method: 'POST', url: 'crf/newQuestionAsk', group: 'andrology', dataType: 'json' },//新增人工质疑
  replyQuestionAsk: { method: 'POST', url: 'crf/replyQuestionAsk', group: 'andrology', dataType: 'json' },//回答人工质疑
  closeQuestionAsk: { method: 'POST', url: 'crf/closeQuestionAsk', group: 'andrology', dataType: 'json' },//关闭人工质疑
  getAskList: { method: 'POST', url: 'crf/getAskList', group: 'andrology', dataType: 'json' },//根据权限获取质疑列表
  getAskInfo: { method: 'POST', url: 'crf/getAskInfo', group: 'andrology', dataType: 'json' },//获取质疑明细
  getAskReport: { method: 'POST', url: 'crf/getAskReport', group: 'andrology', dataType: 'json' },//获取质疑报告
  getFollowupList: { method: 'POST', url: 'crf/getFollowupList', group: 'andrology', dataType: 'json' },//获取随访列表
  getQuestionnaireTypeListByStageId: { method: 'POST', url: 'crf/getQuestionnaireTypeListByStageId', group: 'andrology', dataType: 'json' },//根据随访阶段Id获取问卷类型列表
  modifyPatientFollowupRemark: { method: 'POST', url: 'crf/modifyPatientFollowupRemark', group: 'andrology', dataType: 'json' },//修改受试者随访备注
}
export default apis
