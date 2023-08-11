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
        {{ askInfo.question.questionAnswer }}
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
          <el-input
            placeholder="选填，如您认为当前值有误，可在此处填上正确的值"
            v-model.trim="form.newAsnwer"
          />
        </el-descriptions-item>
      </el-descriptions>
      <div class="formFooter">
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
        >提交意见</button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
export default {
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
        console.log(12213132);
        this.askInfo = (await this.request(this.api.andrology.crf.getAskInfo, this.date)).data
      },
      deep: true
    }
  },

  async created () {
    this.askInfo = (await this.request(this.api.andrology.crf.getAskInfo, this.date)).data
    this.form.askId = this.date.askId
    this.showDialog = true
  },
  methods: {
    async finish () {
      this.$emit('refresh')
    },
    async confirm () {
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
:deep(.labelClass) {
  width: 150px;
}
</style>