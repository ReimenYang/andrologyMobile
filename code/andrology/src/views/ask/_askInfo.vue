<template>
  <el-dialog
    top="5vh"
    :title="title"
    v-model="showDialog"
    :width="width"
  >
    <el-descriptions
      :column="1"
      border
    >
      <el-descriptions-item
        label="问题"
        labelClassName="labelClass"
      >
        {{ askInfo.question.questionTitle }}
      </el-descriptions-item>
      <el-descriptions-item
        label="质疑值"
        labelClassName="labelClass"
      >
        {{ askInfo.askValue }}
      </el-descriptions-item>
      <el-descriptions-item
        label="当前值"
        labelClassName="labelClass"
      >
        {{ askInfo.question.nowAsnwer }}
      </el-descriptions-item>
      <el-descriptions-item
        label="状态"
        labelClassName="labelClass"
      >
        {{ askInfo.askState }}
      </el-descriptions-item>
    </el-descriptions>
    <xnw-template-list
      style="height: 300px;margin: 20px 0;"
      :tableHeader="tableHeader"
      :tableData="askInfo.askOperationList"
    >
      <template #default />
    </xnw-template-list>
    <template v-if="date.askState!=='已关闭'">
      <el-descriptions
        :column="1"
        border
      >
        <el-descriptions-item label="意见">
          <el-input
            type="textarea"
            v-model.trim="form.replyContent"
          />
        </el-descriptions-item>
        <el-descriptions-item label="修正值">
          <xnwFromComponent
            :col="askInfo.question.col"
            :form="askInfo.question"
          />
          <span class="tips">（选填，如您认为当前值有误，可在此处填上正确的值）</span>
        </el-descriptions-item>
      </el-descriptions>
      <div
        class="formFooter"
        v-if="askInfo.askType!=='系统质疑'"
      >
        <button
          class="btn"
          @click="$emit('close')"
        >取消</button>
        <button
          class="btn plain"
          @click="closeAsk"
        >关闭质疑</button>
        <button
          class="btn primary"
          @click="confirm"
        >回复</button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import questionMixin from '@/views/crf/questionMixin.js'
export default {
  mixins: [questionMixin],
  props: {
    title: {
      type: String,
      default: () => '新增'
    },
    date: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      showDialog: false,
      width: '800px',
      tableHeader: [
        { prop: 'operationType', label: '操作' },
        { prop: 'operationUser', label: '操作人' },
        { prop: 'operationDate', label: '操作日期' },
        { prop: 'operationContent', label: '操作意见' }
      ],
      askInfo: {},
      form: {
        askId: 0,
        replyContent: '',
        newAsnwer: ''
      }
    }
  },
  watch: {
    showDialog: function () {
      if (!this.showDialog) this.$emit('close')
    },
    date: {
      handler: async function () {
        await this.getAskInfo()
      },
      deep: true
    }
  },

  async created () {
    window.ask = this
    this.form.askId = this.date.askId
    await this.getAskInfo()
    this.showDialog = true
  },
  methods: {
    async getAskInfo () {
      this.askInfo = (await this.request(this.api.andrology.crf.getAskInfo, this.date)).data
      let question = this.askInfo.question
      await this.questionFormat(question)
      question.nowAsnwer = await this.getAnswer(question)
      await this.resetQuestion(question)
    },
    async finish () {
      this.$emit('refresh')
    },
    async confirm () {
      await this.setOption(this.askInfo.question)
      this.form.newAsnwer = this.askInfo.question

      let res = await this.request(this.api.andrology.crf.replyQuestionAsk, this.form)
      if (res.code === 200) return this.finish()
    },
    async closeAsk () {
      let res = await this.request(this.api.andrology.crf.closeQuestionAsk, this.form)
      if (res.code === 200) return this.finish()
    }
  }
}
</script>
<style lang="scss" scoped>
.tips {
  color: var(--color-tips);
}
:deep(.labelClass) {
  width: 150px;
}
</style>