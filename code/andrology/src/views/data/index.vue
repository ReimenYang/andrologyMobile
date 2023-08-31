<template>
  <div>
    <div class="header">
      <div>导出条件:</div>
      <xnw-template-form
        style=" margin-bottom: -14px;flex:1"
        :data="form"
        :repeat="formRepeat"
      />
      <button
        class="btn primary"
        @click="importDialog=true"
      >
        查看导入结果
      </button>
    </div>
    <el-table
      :data="list"
      :span-method="spanM"
    >
      <el-table-column
        v-for="col in tableHeader"
        :key="col.name"
        v-bind="col"
      >
        <template #default="scope">
          <div v-if="col.prop==='btnList'">
            <el-button
              v-for="btn in col.btnList"
              v-bind="btn.bind"
              @click="btn.click(scope.row)"
              :key="btn.text"
            >
              {{ btn.text }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <upload-file
      title="导入数据"
      :config="{data:rowData}"
      @close="hideDialog"
      v-if="uploadFileDialog"
    />
    <import-list
      title="导入结果"
      @close="hideDialog"
      v-if="importDialog"
    />
  </div>
</template>

<script>
import uploadFile from './_uploadFile.vue'
import importList from './_importList.vue'
export default {
  components: { uploadFile, importList },
  data () {
    return {
      uploadFileDialog: false,
      importDialog: false,
      form: { patientState: '', organizationId: '' },
      formRepeat: [[{
        prop: 'organizationId', label: '所属机构', type: 'select', span: 6, repeat: [
          {
            options: [
              { label: '全部', value: '' },
              ...this.globalData.orgList.map(({ orgName, organizationId }) => ({ label: orgName, value: organizationId }))
            ]
          }]
      }, {
        prop: 'patientState', label: '患者状态', type: 'radio', span: 12, repeat: [
          { label: '不限', value: '' },
          { label: '未入组', value: '未入组' },
          { label: '已入组', value: '已入组' },
          { label: '排除', value: '排除' },
          { label: '完成', value: '完成' },
          { label: '脱落', value: '脱落' },
          { label: '中止', value: '中止' },
        ]
      }]],
      tableHeader: [
        { prop: 'stageName', label: '阶段名称', width: 250 },
        { prop: 'questionnaireTypeName', label: '问卷名称' },
        {
          prop: 'btnList', label: '操作', btnList: [
            { text: '下载导入模板', click: row => this.onBtn(row, 'downImportTemplate') },
            { text: '导入', click: row => this.onBtn(row, 'import') },
            { text: '导出', click: row => this.onBtn(row, 'exportQuestionnaire') },
          ]
        }
      ],
      list: [],
      rowData: {}
    }
  },
  async created () {
    await this.getList()
  },
  methods: {
    spanM ({ row, columnIndex }) {
      if (columnIndex !== 0) return
      return row.colspan ? row.colspan : [0, 0]
    },
    async getList () {
      let _list = (await this.request(this.api.andrology.data.getQuestionnaireListForExport)).data
      this.list = _list.map(
        ({ stageId, stageName, stageRound, questionnaireList }) =>
          questionnaireList.map(
            (item, i) =>
              i ? { ...item, stageId, stageRound } : { stageId, stageRound, stageName, colspan: [questionnaireList.length, 1], ...item, })
      ).flat()
    },
    async onBtn (row, type) {
      let req = { headers: this.globalData.headers, responseType: 'blob' }
      let { stageId, stageRound, questionnaireTypeId } = row
      this.rowData = { stageId, stageRound, questionnaireTypeId }
      let res, url
      switch (type) {
        case 'downImportTemplate':
        case 'exportQuestionnaire':
          res = await this.request(this.api.andrology.data[type], { ...row, ...this.form }, req)
          url = window.URL.createObjectURL(new Blob([res], { type: 'application/vnd.ms-excel' }))
          window.open(url, '_blank')
          break;
        case 'import':
          this.uploadFileDialog = true
          break;
      }
    },
    hideDialog () {
      this.uploadFileDialog = this.importDialog = false
    },
  }
}
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  margin-bottom: 20px;
  padding: 10px;
  align-items: center;
  background-color: #fff;
}
</style>

