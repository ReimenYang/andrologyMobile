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
import questionMixin from '@/views/crf/questionMixin.js'
export default {
  mixins: [questionMixin],
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

      for (let group of _questionnaire.paper) {
        group.patientId = this.patientInfo.patientId
        group.stageId = this.activeStage
        group.questionnaireTypeId = questionnaireTypeId
        group.questionnaireName = _questionnaire.questionnaireTypeName
        group.table = {
          tableHeader: [
            { isSDV: true, width: 80 },
            { prop: 'questionTitle', label: '检查项目' },
            {
              prop: 'questionAnswer', label: group.examineAnswerTitle, type: 'input',
              repeat: [{ prop: 'questionAnswer' }]
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
            {
              prop: 'examineRemark', label: group.examineRemarkTitle, type: 'input',
              repeat: [{ prop: 'examineRemark' }]
            },
          ]
        }
        for (let question of group.questionList) {
          if (!question.askOperationList) question.askOperationList = []
          await this.questionFormat(question, group)
        }
      };
      this.ready = true
    },
  }
}
</script>
