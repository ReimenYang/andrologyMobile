<template>
  <el-dialog
    top="5vh"
    :title="title"
    v-model="showDialog"
    :width="width"
  >
    <paper v-bind="params" />
    <el-button
      class="submitBtn"
      type="primary"
      @click="save"
    >保存问卷</el-button>
  </el-dialog>
</template>
<script>
import paper from '../crf/_paper.vue'
export default {
  components: { paper },
  inject: ['testTarget'],
  props: {
    title: {
      type: String,
      default: () => '新增'
    },
    stage: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      showDialog: false,
      width: '1000px',
      params: {}
    }
  },
  watch: {
    showDialog: function () {
      if (!this.showDialog) this.$emit('close')
    }
  },
  async created () {
    await this.getInfo()
  },
  methods: {
    async getInfo () {
      let stageId = this.stage.stageId
      let questionnaireList = (await this.request(this.api.andrology.crf.getQuestionnaireTypeListByStageId, { stageId })).data
      let stage = { stageId, questionnaireList }
      this.params = {
        patientInfo: {
          patientId: this.testTarget().rowDate.patientId,
          stageList: [stage]
        },
        activeStage: stageId,
        stage,
        activeQuestionnaire: [questionnaireList[0].questionnaireTypeId]
      }
      this.showDialog = true
    },
    async save () {
      let paperList = this.params.patientInfo.stageList.map(stage => stage.questionnaireList.map(questionnaire => questionnaire.paper))
        .flat()
        .filter(paper => paper)
        .flat()
        .filter(paper => paper && paper.hasChanged)
      if (!paperList.length) this.$message.warning({ duration: 3000, message: '没有问卷被修改，无需提交' })

      // 按问卷提交
      // let saveList = paperList.map(paper => ({
      //   patientId: paper.patientId,
      //   stageId: paper.stageId,
      //   questionnaireList: [{
      //     questionnaireTypeId: paper.questionnaireTypeId,
      //     questionnaireName: paper.questionnaireName,
      //     entryUser: this.globalData.userInfo.userName,
      //     entryDate: new Date(),
      //     groupList: [paper]
      //   }]
      // }))

      // 按阶段提交
      let stageList = this.libs.array.unique(paperList, a => a.stageId)

      let saveList = stageList.map(({ patientId, stageId }) => ({
        patientId,
        stageId,
        questionnaireList:
          paperList.filter(item => item.stageId === stageId)
            .map(({ questionnaireTypeId, questionnaireName, groupId }) => ({
              questionnaireTypeId,
              questionnaireName,
              entryUser: this.globalData.userInfo.userName,
              entryDate: new Date(),
              groupList: paperList.filter(item => item.stageId === stageId && item.groupId === groupId)
            }))
      }))
      let res = await Promise.all(saveList.map(async stage => {
        let _res = await this.request(this.api.andrology.crf.submitQuestionnaire, stage)
        return { stageId: stage.stageId, ..._res }
      }))
      console.log(saveList, res);
      this.showDialog = false
      await this.testTarget().hideDialog()
      return await this.testTarget().getList()
    }
  }
}
</script>
<style lang="scss" scoped>
.stage {
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-light);
  border: var(--border-normal);
  .title {
    font-size: var(--font-h3);
    line-height: 2;
  }
  .tips {
    padding: 0 20px 0 0;
    color: var(--color-tips);
  }
}
.submitBtn {
  margin: 20px auto;
  display: block;
}
</style>