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
      @click="onSave"
    >保存问卷</el-button>
  </el-dialog>
</template>
<script>
import paper from '../crf/_paper.vue'
import questionMixin from '@/views/crf/questionMixin.js'
export default {
  mixins: [questionMixin],
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
    async onSave () {
      await this.save(this.params.patientInfo)
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