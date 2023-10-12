<template>
  <view class="question">
    <!-- TODO -->
    <!-- 题目数：{{ testTarget().getPaper().questionList.length }} -->

    <view>
      <view :class="['title',question.required==='Y'&&'required']">
        <text>{{ index }}</text>
        <text>{{ question.col.label }}</text>
      </view>
      <view class="box">
        <xnw-from :config="{data:question.mobileCol}" />
        <view>{{ question.questionSuffix }}</view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
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
        let isMobile = this.libs.configProject.systemInfo.deviceType === 'phone'
        let paper = this.testPaper().paper
        let { col, mobileCol, uiStyle, questionId, questionAnswer } = this.question
        let computerQuestionId = paper.watchIds[questionId]
        let computerQuestion
        if (computerQuestionId) computerQuestion = paper.questionList.find(item => item.questionId === computerQuestionId)
        if (computerQuestion) {
          // 手机版的 mobileCol 是对答案进行深拷贝，答案变更后要手动更新到 questionAnswer
          if (isMobile) this.question[col.prop] = mobileCol[0][col.mobileKey].value
          await this.testStage().questionComputer(computerQuestion, 'questionAnswer', paper, 'questionId')
        }

        if (this.$route.path.startsWith('/crf')) this.globalData.confirmMsg = '当前页面有信息未保存，确定仍要关闭页面？'
        if (!paper.hasChanged) this.testStage().stage.hasChanged = paper.hasChanged = true
        if (uiStyle === 'dateTimePicker') this.question.questionAnswer = this.libs.data.dateNow(questionAnswer, 'xxxx-xx-xx')
        // 手机版自动计算的答案需要手动从 mobileCol 更新到 questionAnswer
        if (isMobile && uiStyle === 'computer') this.question.mobileCol[0].textContent = questionAnswer
      },
      deep: true
    }
  },
  async created () {
    window.question = this
    console.log('question', this.question)
  },
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
  margin: 0 0 40rpx 0;
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
.box {
  width: calc(100vw - 100rpx);
  display: flex;
  align-items: center;
  border-bottom: var(--border-normal);
}
/deep/ .form {
  margin-top: 0;
  .title {
    display: none;
  }
  .formGroup {
    border-bottom: none;
    .txt {
      text-align: left;
    }
  }
}
</style>
