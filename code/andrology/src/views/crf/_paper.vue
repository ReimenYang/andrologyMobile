<template>
  <el-tabs
    v-if="ready"
    v-model="activeQuestionnaire[stageIndex]"
    @tab-click="tabClick"
  >
    <el-tab-pane
      v-for="{questionnaireTypeId,questionnaireTypeName,paper} in stage.questionnaireList"
      :key="questionnaireTypeId"
      :label="questionnaireTypeName"
      :name="questionnaireTypeId"
    >
      <div v-if="activeQuestionnaire[stageIndex] === questionnaireTypeId && activeStage === stage.stageId">
        <!-- 卡片式问卷 -->
        <paper-by-card
          ref="paper"
          v-for="questionGroup in paper"
          :key="questionGroup.groupId"
          :paper="questionGroup"
        />
      </div>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import paperByCard from './_paperByCard.vue'
export default {
  components: { paperByCard },
  provide () {
    return {
      testStage: () => this
    }
  },
  props: {
    patientInfo: {
      type: Object,
      default: () => ({})
    },
    stage: {
      type: Object,
      default: () => ({})
    },
    activeStage: {
      type: Number,
      default: () => ''
    },
    activeQuestionnaire: {
      type: Array,
      default: () => []
    },
    stageIndex: {
      type: Number,
      default: () => 0
    }
  },
  data () {
    return {
      ready: false,
    }
  },
  async created () {
    window.paper = this
    await this.getQuestionnaire()
    // console.log('paper', this.paper);
  },
  methods: {
    async tabClick (tab) {
      let i = this.patientInfo.stageList.findIndex(stage => stage.stageId === this.activeStage)
      this.activeQuestionnaire[i] = tab.paneName
      return await this.getQuestionnaire()
    },
    async getQuestionnaire (refresh = false) {
      this.ready = false
      let i = this.patientInfo.stageList.findIndex(stage => stage.stageId === this.activeStage)
      let questionnaireTypeId = this.activeQuestionnaire[i]
      let _questionnaire
        = this.patientInfo.stageList
          .find(stage => stage.stageId === this.activeStage).questionnaireList
          .find(questionnaire => questionnaire.questionnaireTypeId === questionnaireTypeId)

      if (_questionnaire.paper && !refresh) return this.ready = true

      _questionnaire.paper = (await this.request(
        this.api.andrology.crf.getQuestionnaire,
        { ...this.patientInfo, stageId: this.activeStage, questionnaireTypeId }
      )).data.groupList
      _questionnaire.paper.forEach(group => {
        group.patientId = this.patientInfo.patientId
        group.stageId = this.activeStage
        group.questionnaireTypeId = questionnaireTypeId
        group.questionnaireName = _questionnaire.questionnaireTypeName
        group.table = {
          tableHeader: [
            { prop: 'questionTitle', label: '检查项目' },
            {
              prop: 'questionAnswer', label: group.examineAnswerTitle, type: 'input',
              repeat: [
                { prop: 'questionAnswer' }
              ]
            },
            {
              prop: 'examineSence', label: group.examineSenceTitle, type: 'select',
              repeat: [
                {
                  options: [
                    { value: '正常' },
                    { value: '异常无临床意义' },
                    { value: '异常有临床意义' },
                    { value: '未查' },
                    { value: '不适用' }
                  ]
                }
              ]
            },
            { prop: 'examineNormalValue', label: group.examineNormalValueTitle },
            { prop: 'examineRemark', label: group.examineRemarkTitle },
          ]
        }
        group.questionList.forEach(question => {
          if (!question.askOperationList) question.askOperationList = []
          switch (question.questionType) {
            case '计算':
              question.uiStyle = 'computer'
              break;
            case '日期':
              question.uiStyle = 'dateTimePicker'
              // question.uiStyle = 'date'

              question.col = {
                label: question.questionTitle,
                prop: 'questionAnswer',
                type: question.uiStyle
              }
              break;
            case '上传图片':
              question.uiStyle = 'uploadImg'
              break;
            case '数字':
              question.uiStyle = 'num'
              break;
            case '单行文本':
              question.uiStyle = 'input'

              question.col = {
                label: question.questionTitle,
                prop: 'questionAnswer',
                type: question.uiStyle,
                repeat: [
                  { prop: 'questionAnswer' }
                ]
              }
              break;
            case '多行文本':
              question.uiStyle = 'textarea'
              question.col = {
                label: question.questionTitle,
                prop: 'questionAnswer',
                type: question.uiStyle
              }
              break;
            case '单选':
              question.uiStyle = 'radio'
              question.checked = (question.optionList.find(option => option.checked) || {}).optionText
              question.col = {
                label: question.questionTitle,
                prop: 'checked',
                type: question.uiStyle,
                repeat: question.optionList.map(({ optionText: label }) => ({ label }))
              }
              break;
            case '多选':
              question.uiStyle = 'checkbox'
              question.checked = question.optionList.reduce((a, b) => b.checked ? [...a, b.optionText] : a, [])
              question.col = {
                label: question.questionTitle,
                prop: 'checked',
                type: question.uiStyle,
                repeat: question.optionList.map(({ optionText: label }) => ({ label }))
              }
              break;
            case '检查项目':
              group.uiStyle = 'table'
              return;
          }
          if (!question.col) question.col = {
            label: question.questionTitle,
            prop: 'questionAnswer',
            type: question.uiStyle
          }
        });
      });
      this.ready = true
    },
  }
}
</script>
<style lang="scss" scoped>
.preface {
  margin: 20rpx 0;
}
.desc {
  color: var(--color-tips);
  font-size: var(--font-h4);
  margin: 20rpx 0;
}
.content :deep(.question) {
  // border: var(--border-normal);
  // background-color: #fff;
  // .title {
  //   border-bottom: var(--border-normal);
  // }
  .content {
    padding: 0 20rpx;
  }
}
</style>
