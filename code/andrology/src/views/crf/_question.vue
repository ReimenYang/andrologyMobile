<template>
  <div class="question">
    <!-- TODO -->
    <!-- 题目数：{{ testTarget().getPaper().questionList.length }} -->

    <sdv :question="question" />
    <div>
      <div
        v-if="question.uiStyle !== 'computer'"
        :class="['title',question.required==='Y'&&'required']"
      >
        <text>{{ index }}</text>
        <text>{{ question.col.label }}</text>
      </div>
      <xnwFromComponent
        :col="question.col"
        :form="question"
      />
    </div>
  </div>
</template>
<script>
import sdv from './_SDV.vue'
export default {
  components: { sdv },
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
      handler: function () {
        if (this.question.uiStyle === 'dateTimePicker') this.question.questionAnswer = this.libs.data.dateNow(this.question.questionAnswer, 'xxxx-xx-xx')
      },
      deep: true
    }
  },
  async created () {
    window.question = this
    console.log('question', this.question);
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
