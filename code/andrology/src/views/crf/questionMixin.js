export default {
  methods: {
    async questionFormat (question, paper) {
      switch (question.questionType) {
        case '计算':
          if (paper) {
            paper.question = paper.questionList
            this.questionComputer(question, 'questionAnswer', paper, 'questionId')
          }
          console.log(paper, question);
          question.uiStyle = 'computer'
          question.col = {
            label: question.questionTitle,
            prop: 'questionAnswer',
            type: 'word'
          }
          break;
        case '日期':
          question.uiStyle = 'dateTimePicker'
          // question.uiStyle = 'date'
          question.hasAnswer = !!String(question.questionAnswer)
          question.col = {
            label: question.questionTitle,
            prop: 'questionAnswer',
            type: question.uiStyle
          }
          break;
        case '上传图片':
          question.uiStyle = 'uploadImg'
          question.hasAnswer = !!String(question.questionAnswer)
          break;
        case '数字':
          question.uiStyle = 'num'
          question.hasAnswer = !!String(question.questionAnswer)
          break;
        case '单行文本':
          question.uiStyle = 'input'
          question.hasAnswer = !!String(question.questionAnswer)
          question.col = {
            label: question.questionTitle,
            prop: 'questionAnswer',
            type: question.uiStyle,
            repeat: [{
              prop: 'questionAnswer',
              placeholder: question.placeholder
            }]
          }
          break;
        case '多行文本':
          question.uiStyle = 'textarea'
          question.hasAnswer = !!String(question.questionAnswer)
          question.col = {
            label: question.questionTitle,
            prop: 'questionAnswer',
            type: question.uiStyle,
            config: { placeholder: question.placeholder, inputStyle: { width: '30vw', height: '6em' } }
          }
          break;
        case '单选':
          question.uiStyle = 'radio'
          question.checked = (question.optionList.find(option => option.checked) || {}).optionText || ''
          question.hasAnswer = !!String(question.checked)
          question.optionList.forEach(item => { item.label = item.optionText })
          question.col = {
            label: question.questionTitle,
            prop: 'checked',
            type: question.uiStyle,
            repeat: question.optionList
          }
          break;
        case '多选':
          question.uiStyle = 'checkbox'
          question.checked = question.optionList.reduce((a, b) => b.checked ? [...a, b.optionText] : a, [])
          question.hasAnswer = !!question.checked.length
          question.optionList.forEach(item => { item.label = item.optionText })
          question.col = {
            label: question.questionTitle,
            prop: 'checked',
            type: question.uiStyle,
            repeat: question.optionList
          }
          break;
        case '检查项目':
          // 质疑详情
          if (!paper) {
            question.uiStyle = 'input'
            question.hasAnswer = !!String(question.questionAnswer)
            question.col = {
              label: question.questionTitle,
              prop: 'questionAnswer',
              type: question.uiStyle,
              repeat: [{
                prop: 'questionAnswer',
                placeholder: question.placeholder
              }]
            }
            return
          }

          // 问卷
          paper.uiStyle = 'table'
          for (let _question of paper.questionList) {
            _question.questionType = '单行文本'
            this.questionFormat(_question)
          }
          return;
      }
      if (!question.col) question.col = {
        label: question.questionTitle,
        prop: 'questionAnswer',
        type: question.uiStyle
      }
    },
    async getAnswer (question) {
      switch (question.uiStyle) {
        case 'dateTimePicker':
          return this.libs.data.dateNow(question.questionAnswer, 'xxxx-xx-xx')
        case 'radio':
          return question.checked
        case 'checkbox':
          return question.checked.join()
        default:
          return question.questionAnswer
      }
    },
    async setOption (question) {
      switch (question.uiStyle) {
        case 'radio':
          question.optionList.forEach(option => option.checked = option.label === question.checked)
          break
        case 'checkbox':
          question.optionList.forEach(option => option.checked = question.checked.includes(option.label))
          break
      }
    },
    async resetQuestion (question) {
      switch (question.uiStyle) {
        case 'radio':
          question.checked = ''
          break
        case 'checkbox':
          question.checked = []
          break
        default:
          question.questionAnswer = ''
          break
      }
    },
    // 编译公式 参数示例：('{question[2]}/(({question[1]}/100)**2)', 'optionValue')
    buileComputer (computerQuestion, getKey, paper, matchKey) {
      // 设置基础计算数据
      // 年龄用出生计算 必须使用填空题 optionValue字段
      // let _age = (this.computerBaseData.question.find(item => item.remark === 'age') || {}).optionValue
      // if (_age) {
      //   let ydm = this.libs.data.timeDifference(
      //     new Date() -
      //     this.libs.data.dateIOSFormat(_age)
      //   )
      //   this.computerBaseData.user.age = (ydm.split('年').length > 1) ? parseInt(ydm) : 0
      //   // 直接写年龄
      //   if (_age.indexOf('年') < 0) this.computerBaseData.user.age = parseFloat(_age) || 0
      // }
      // // 性别 必须使用单选题 optionValue的值必须使用 ‘男’ 或 ‘女’
      // let _sexArr = (this.computerBaseData.question.find(item => item.remark === 'sex') || {}).optionList
      // if (_sexArr) {
      //   this.computerBaseData.user.sex = (_sexArr.find(item => item.checked === 'Y') || {}).id
      // }

      // 数据源  病症和问题有两个表保存，意味着有可能一个id存在两条记录，也许存在取值错误的问题
      // let paper = this.computerBaseData
      // 术式
      let _computeRule = computerQuestion.questionFormula
      // 提取变量关键字
      let keyArr = computerQuestion.questionFormula.match(/\{(.+?)\}/img)
      // 变量去除括号
      let objKeyArr = keyArr.map(key => key.slice(1, -1))
      // 提取对象
      let objTargetArr = objKeyArr.map(key => this.libs.object.getValue(key.split('[')[0], paper))
      // 提取id
      let objIdArr = objKeyArr.map(key => key.match(/\[(.+?)\]/img) || ['[]']).reduce((a, b) => [...a, ...b]).map(key => key.slice(1, -1))
      // 获取变量值
      let objValueArr = objIdArr.map((id, i) => {
        if (!id) return objTargetArr[i]
        // 记录监听问题和计算题的关联id
        paper.watchIds[id] = computerQuestion[matchKey]
        let target = objTargetArr[i].find(obj => String(obj[matchKey]) === (id))
        if (!target) console.error(objTargetArr[i], `找不到${matchKey}为${id}的对象`)
        return target ? this.libs.object.getValue(getKey, target) : ''
      })
      let ready = true
      for (let i = 0; i < keyArr.length; i++) {
        let key = keyArr[i]
        let value = objValueArr[i]
        if (typeof value === 'string') value = '\'' + value + '\''
        if (value && value.length < 1) {// 这个判断可能存在瑕疵
          ready = false
          break
        }
        _computeRule = _computeRule.replace(key, value)
      }
      if (ready) return _computeRule
    },
    // 根据其他问题混算出结果，如：BMI
    questionComputer (computerQuestion, getKey, paper, matchKey) {
      // TODO 暂时所有计算都是精确到小数点后一位
      let result = eval(this.buileComputer(computerQuestion, getKey, paper, matchKey))
      result = result === Infinity ? 0 : result
      computerQuestion[getKey] = isNaN(result) ? 0 : result.toFixed(1)
    },
    async save (patientInfo) {
      let paperList = patientInfo.stageList.map(stage => stage.questionnaireList.map(questionnaire => questionnaire.paper))
        .flat()
        .filter(paper => paper)
        .flat()
        .filter(paper => paper && paper.hasChanged)
      if (!paperList.length) this.$message.warning({ duration: 3000, message: '没有问卷被修改，无需提交' })

      let stageIds = this.libs.array.unique(paperList.map(({ stageId }) => stageId), a => a)
      let questionnaireIds = this.libs.array.unique(paperList.map(({ questionnaireTypeId }) => questionnaireTypeId), a => a)

      // 设置答案
      for (let paper of paperList) for (let question of paper.questionList) await this.setOption(question)

      // 有更改的阶段
      let stageList = patientInfo.stageList.filter(({ stageId }) => stageIds.includes(stageId))

      // 有变更的问卷
      stageList.forEach(stage => {
        stage.patientId = patientInfo.patientId
        stage.questionnaireList =
          stage.questionnaireList
            .filter(({ questionnaireTypeId }) => questionnaireIds.includes(questionnaireTypeId))
            .map(({ questionnaireTypeId, questionnaireTypeName: questionnaireName, paper: groupList }) => ({
              questionnaireTypeId,
              questionnaireName,
              entryUser: this.globalData.userInfo.userName,
              entryDate: new Date(),
              groupList
            }))
      });

      let res = await Promise.all(stageList.map(async stage => {
        let _res = await this.request(this.api.andrology.crf.submitQuestionnaire, stage)
        return { stageId: stage.stageId, ..._res }
      }))
      this.$message.success('保存成功')
      delete this.globalData.confirmMsg
      console.log(stageList, res);
    }
  }
}