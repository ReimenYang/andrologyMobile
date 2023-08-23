export default {
  methods: {
    async questionFormat (question, group) {
      switch (question.questionType) {
        case '计算':
          question.uiStyle = 'computer'
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
            config: { placeholder: question.placeholder }
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
          group.uiStyle = 'table'
          for (let _question of group.questionList) {
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
    }
  }
}