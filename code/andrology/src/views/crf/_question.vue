<template>
  <div class="question">
    <!-- TODO -->
    <!-- 题目数：{{ testTarget().getPaper().questionList.length }} -->

    <sdv :question="question" />
    <div>
      <div :class="['title',question.required==='Y'&&'required']">
        <text>{{ index }}</text>
        <text>{{ question.col.label }}</text>
      </div>
      <div style="display: flex;">
        <xnwFromComponent
          :col="question.col"
          :form="question"
        />
        <div>{{ question.questionSuffix }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import sdv from './_SDV.vue'
export default {
  components: { sdv },
  inject: ['testStage', 'testPaper'],
  props: {
    question: {
      type: Object,
      default: () => ({ error: true })
    },
    index: {
      type: String,
      default: () => '0'
    }
  },
  watch: {
    question: {
      handler: async function () {
        let paper = this.testPaper().paper
        let computerQuestionId = paper.watchIds[this.question.questionId]
        let computerQuestion
        if (computerQuestionId) computerQuestion = paper.questionList.find(item => item.questionId === computerQuestionId)
        if (computerQuestion) await this.testStage().questionComputer(computerQuestion, 'questionAnswer', paper, 'questionId')

        if (this.$route.path.startsWith('/crf')) this.globalData.confirmMsg = '当前页面有信息未保存，确定仍要关闭页面？'
        if (!paper.hasChanged) this.testStage().stage.hasChanged = paper.hasChanged = true
        if (this.question.uiStyle === 'dateTimePicker') this.question.questionAnswer = this.libs.data.dateNow(this.question.questionAnswer, 'xxxx-xx-xx')
      },
      deep: true
    }
  },
  // async created () {
  // window.question = this
  // console.log('question', this.question);
  // },
  methods: {
    hasError () {
      return this.question.error && this.question.error !== true
    },
    inputClass () {
      return ['input', this.hasError() && 'error']
    },
    getInputType (type) {
      if (!type) return 'text'
      return {
        text: 'text',
        computer: 'text',
        num: 'number'
      }[type] || 'text'
    },
    uploadSuccess (imgObj) {
      this.question.userTestReportImage = imgObj.url
      this.onChange()
    },
    delImage () {
      this.question.userTestReportImage = ''
      this.onChange()
    },
  }
}
</script>
<style lang="scss" scoped>
.question {
  margin: 0 0 20px 0;
  display: flex;
  font-size: 16px;
}
.title {
  padding: 0 0 5px;
  &.required:before {
    content: "*";
    color: var(--color-warning);
  }
}
.questionImage {
  width: 320px;
  height: 240px;
}
.content {
  padding: 5px 0;
}
.input {
  box-sizing: border-box;
  outline-style: none;
  border: var(--border-normal);
  border-radius: var(--border-radius);
  background-color: #fff;
  //font-size:100%;
  font-size: 16px;
  //font-weight:normal;
}
.error {
  border-color: var(--color-warning);
  color: var(--color-warning);
}
</style>
