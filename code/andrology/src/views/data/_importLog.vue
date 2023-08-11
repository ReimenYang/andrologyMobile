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
  </el-dialog>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: () => '新增'
    },
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      showDialog: true,
      width: '1600px',
      list: [],
      tableHeader: [
        { prop: 'index', label: '序号', width: 70, type: 'index' },
        { prop: 'rowIndex', label: '行数', width: 100 },
        { prop: 'exceptionQuestion', label: '异常问题' },
        { prop: 'exceptionInfo', label: '异常情况' }
      ]
    }
  },
  watch: {
    showDialog: function () {
      if (!this.showDialog) this.$emit('close')
    }
  },
  async created () {
    this.list = (await this.request(this.api.andrology.data.getImportLogDetail, { importId: this.data.id }))
  },
  methods: {
    hideDialog () {
      this.joinDialog = false
    }
  }
}
</script>