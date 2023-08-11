<template>
  <div class="question">
    <!-- TODO -->
    <!-- 题目数：{{ testTarget().getPaper().questionList.length }} -->
    <div class="ask">
      <div
        :class="{setAsk:true, isActive:hasAsk}"
        @click="setAsk"
      >Q</div>
      <div
        :class="{passAsk:true,  isActive:passAsk}"
        @click="handlerSDV"
      >SDV</div>
    </div>
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
      default: () => ({ error: true })
    },
    index: {
      type: String,
      default: () => '0'
    }
  },
  data () {
    return {
      params: {},
      showDialog: false
    }
  },
  watch: {
    question: {
      handler: function () {
        this.testPaper().paper.hasChanged = true
        if (this.question.uiStyle === 'dateTimePicker') this.question.questionAnswer = this.libs.data.dateNow(this.question.questionAnswer, 'xxxx-xx-xx')
      },
      deep: true
    }
  },
  computed: {
    hasAsk () {
      return this.question.verificationState === 'Q'
    },
    passAsk () {
      return this.question.verificationState === 'SDV'
    }
  },
  async created () {
    let { patientId, stageId, questionnaireTypeId } = this.testPaper().paper
    let { questionId, questionTitle, questionAnswer } = this.question
    this.params = { patientId, stageId, questionnaireTypeId, questionId, questionTitle, questionAnswer }
    // window.question = this
    // console.log('question', this.question);
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
    setAsk () {
      if (this.passAsk) return this.$message.warning('质疑前请先取消验证')
      this.showDialog = true
    },
    async handlerSDV () {
      if (this.hasAsk) return this.$message.warning('验证前请先关闭质疑')
      if (this.passAsk) await this.request(this.api.andrology.crf.cancelQuestionSDV, this.params)
      else await this.request(this.api.andrology.crf.questionSDV, this.params)
      console.log(this.question);
      await this.testStage().getQuestionnaire(true)
    },
    hideDialog () { this.showDialog = false },

  }
}
</script>
<style lang="scss" scoped>
.question {
  margin: 0 0 20px 0;
  display: flex;
  font-size: 16px;
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
