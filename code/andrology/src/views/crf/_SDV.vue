<template>
  <div class="ask">
    <div
      :class="{setAsk:true, isActive:hasAsk}"
      @click="setAsk"
    >Q</div>
    <div
      :class="{passAsk:true,  isActive:passAsk}"
      @click="handlerSDV"
    >SDV</div>
    <aboutAsk
      title="相关质疑"
      @close="hideDialog"
      :hasAsk="hasAsk"
      :form="params"
      :askList="question.askList"
      v-if="showDialog"
    />
  </div>
</template>
<script>
import aboutAsk from './_aboutAsk.vue'
export default {
  components: { aboutAsk },
  inject: ['testStage', 'testPaper'],
  props: {
    question: {
      type: Object,
      default: () => ({})
    }
  },
  // watch: {
  //   question: {
  //     handler: function () {
  //       this.params.questionAnswer =this.question.questionAnswer
  //     },
  //     deep: true
  //   }
  // },
  computed: {
    hasAsk () {
      return this.question.verificationState === 'Q'
    },
    passAsk () {
      return this.question.verificationState === 'SDV'
    }
  },
  data () {
    return {
      params: {},
      showDialog: false
    }
  },
  async created () {
    // window.sdv = this
    let { patientId, stageId, questionnaireTypeId } = this.testPaper().paper
    let { questionId, questionTitle, questionAnswer } = this.question
    this.params = { patientId, stageId, questionnaireTypeId, questionId, questionTitle, questionAnswer }
  },
  methods: {
    setAsk () {
      if (this.passAsk) return this.$message.warning('质疑前请先取消验证')
      let { uiStyle, checked, hasAnswer } = this.question
      if (uiStyle === 'computer') return this.$message.warning('自动计算的题目不能质疑')
      if (!hasAnswer) return this.$message.warning('未提交保存的问题不能质疑')
      switch (uiStyle) {
        case 'radio':
          questionAnswer = checked
          break;
        case 'checkbox':
          questionAnswer = checked.join()
          break;
      }
      this.showDialog = true
    },
    async handlerSDV () {
      if (sessionStorage.projectState !== '已开始') return this.$message.warning('项目未开始，不能操作质疑')
      if (this.hasAsk) return this.$message.warning('验证前请先关闭质疑')
      let { uiStyle, hasAnswer } = this.question
      if (uiStyle === 'computer') return this.$message.warning('自动计算的题目不能质疑')
      if (!hasAnswer) return this.$message.warning('未提交保存的问题不能质疑')
      if (this.passAsk) await this.request(this.api.andrology.crf.cancelQuestionSDV, this.params)
      else await this.request(this.api.andrology.crf.questionSDV, this.params)
      await this.testStage().getQuestionnaire(true)
    },
    hideDialog () { this.showDialog = false },
  }
}
</script>
<style lang="scss" scoped>
.ask {
  width: 50px;
  height: 62px;
  margin-right: 10px;
  font: 14px/30px sans-serif;
  text-align: center;
  background-color: #f4f4f4;
  cursor: pointer;
  .isActive {
    color: #fff;
  }
  .setAsk {
    border-bottom: 2px #fff solid;
    &.isActive {
      background-color: var(--color-warning);
    }
  }
  .passAsk.isActive {
    background-color: #5bb75b;
  }
}
</style>
