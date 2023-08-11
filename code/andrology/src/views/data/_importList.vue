<template>
  <el-dialog
    top="5vh"
    :title="title"
    v-model="showDialog"
    :width="width"
  >
    <xnw-template-list
      :tableHeader="tableHeader"
      :tableData="list"
    >
      <template #default />
    </xnw-template-list>
    <import-log
      title="异常内容"
      @close="hideDialog"
      :data="rowData"
      v-if="logDialog"
    />
  </el-dialog>
</template>
<script>
import importLog from './_importLog.vue'
export default {
  components: { importLog },
  props: {
    title: {
      type: String,
      default: () => '新增'
    }
  },
  data () {
    return {
      showDialog: true,
      width: '1600px',
      list: [],
      tableHeader: [
        { prop: 'index', label: '序号', width: 70, type: 'index' },
        { prop: 'importState', label: '导入情况', width: 100 },
        { prop: 'stageType', label: '导入阶段类型', width: 120 },
        { prop: 'stageName', label: '阶段名称', width: 100 },
        { prop: 'questionnaireTypeName', label: '导入问卷名称', width: 120 },
        { prop: 'fileName', label: '导入文件名称' },
        { prop: 'addNum', label: '新增问卷数', width: 100 },
        { prop: 'modifyNum', label: '更新问卷数', width: 100 },
        { prop: 'errorNum', label: '异常数量', width: 100 },
        { prop: 'importUser', label: '操作人', width: 80 },
        { prop: 'importDate', label: '导入时间', width: 160 },
        {
          prop: 'btnList', label: '操作', width: 100, btnList: [
            { text: '查看异常', click: row => this.showInfo(row) },
          ]
        }
      ],
      logDialog: false
    }
  },
  watch: {
    showDialog: function () {
      if (!this.showDialog) this.$emit('close')
    }
  },
  async created () {
    this.list = (await this.request(this.api.andrology.data.getImportLogList))
  },
  methods: {
    showInfo (row) {
      this.rowData = row
      this.logDialog = true
    },
    hideDialog () {
      this.logDialog = false
    }
  }
}
</script>