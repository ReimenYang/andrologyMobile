const apis = {
    // 获取问卷基础信息
    getQuestionnaireByPageType: { method: 'GET', url: 'cmsAIQuestionnaireNew/getQuestionnaireByPageType', group: 'cms', dataType: 'form' },
    // 获取问卷问题列表
    getQuestionnaireList: { method: 'GET', url: 'cmsAIQuestionnaireNew/getQuestionnaireList', group: 'cms', dataType: 'json' },
    // 患者查看自己填写的问卷列表
    getUserAnswerList: { method: 'GET', url: 'cmsAIQuestionnaireNew/getUserAnswerList', group: 'cms', dataType: 'json' },
    // 查看问卷结果(基础信息+主诉+量表项列表)
    getUserAnswerDetail: { method: 'GET', url: 'cmsAIQuestionnaireNew/getUserAnswerDetail', group: 'cms', dataType: 'json' },
    // 查看患者填写问卷值（问答列表）
    getAnswerDetailValue: { method: 'GET', url: 'cmsAIQuestionnaireNew/getAnswerDetailValue', group: 'cms', dataType: 'json' },
    // 保存用户问卷数据
    saveUserQuestionnaire: { method: 'POST', url: 'cmsAIQuestionnaireNew/saveUserQuestionnaire', group: 'cms', dataType: 'form' },
    // 医生查看患者填写的问卷列表
    getUserAnswerListWithDoctor: { method: 'GET', url: 'cmsAIQuestionnaireNew/getUserAnswerListWithDoctor', group: 'cms', dataType: 'json' },
    // 获取问卷详情报表
    getTotalRecordByIdNew: { method: 'GET', url: 'cmsAIQuestionnaireNew/getTotalRecordByIdNew', group: 'cms', dataType: 'json' },

}

export default apis
