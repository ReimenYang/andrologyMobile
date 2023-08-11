<template>
  <el-dialog
    top="5vh"
    :title="title"
    v-model="showDialog"
    :width="width"
  >
    <xnw-template-list
      style="height: 300px;margin-bottom: 20px;"
      :tableHeader="tableHeader"
      :tableData="askList"
    >
      <template #default />
    </xnw-template-list>
    <template v-if="!hasAsk">
      <el-descriptions
        :column="1"
        border
      >
        <el-descriptions-item
          :label="col.label"
          v-for="col in infoKeys"
          :key="col.prop"
          v-bind="col.config"
        >
          <xnwFromComponent
            :col="col"
            :form="form"
          />
        </el-descriptions-item>
      </el-descriptions>
      <div class="formFooter">
        <button
          class="btn"
          @click="$emit('close')"
        >取消</button>
        <button
          class="btn primary"
          @click="confirm"
        >保存</button>
      </div>
    </template>

    <ask-info
      title="质疑详情"
      @close="hideDialog"
      @refresh="refresh"
      :date="rowDate"
      v-if="showInfoDialog"
    />
  </el-dialog>
</template>
<script>
import askInfo from '../ask/_askInfo.vue'
export default {
  components: { askInfo },
  inject: ['testStage'],
  props: {
    title: {
      type: String,
      default: () => '新增'
    },
    hasAsk: {
      type: Boolean,
      default: () => false
    },
    askList: {
      type: Array,
      default: () => []
    },
    form: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      showDialog: true,
      width: '800px',
      infoKeys: [
        { prop: 'questionTitle', label: '问题', type: 'input', repeat: [{ prop: 'questionTitle', disabled: true }] },
        { prop: 'questionAnswer', label: '质疑内容', type: 'input', repeat: [{ prop: 'questionAnswer', disabled: true }] },
        { prop: 'askContent', label: '意见', type: 'textarea', config: { prop: 'projectName' } },
      ],
      tableHeader: [
        { prop: 'askType', label: '状态', width: 170 },
        { prop: 'askState', label: '类别', width: 100 },
        { prop: 'askValue', label: '回答', width: 100 },
        { prop: 'createDate', label: '创建日期', width: 160 },
        {
          prop: 'btnList', label: '操作', btnList: [
            { text: '详情', click: row => this.showInfo(row) },
          ]
        }
      ],
      showInfoDialog: false,
      rowDate: {}
    }
  },
  methods: {
    showInfo (row) {
      console.log(row)
      this.rowDate = row
      this.showInfoDialog = true
    },
    async confirm () {
      let res = await this.request(this.api.andrology.crf.newQuestionAsk, this.form)
      if (res.code !== 200) return
      await this.testStage().getQuestionnaire(true)
      this.$emit('close')
    },
    async refresh () {

      await this.testStage().getQuestionnaire(true)
      this.rowDate = this.askList.find(item => item.askId === this.rowDate.askId)
    },
    hideDialog () {
      this.showInfoDialog = false
    }
  }
}
</script>