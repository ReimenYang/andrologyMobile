
import addTestee from '@/views/testee/_addTestee.vue'
import uploadFile from '@/views/testee/_uploadFile.vue'
export default {
  components: { addTestee, uploadFile },
  data () {
    return {
      showDialog: false,
      uploadFileDialog: false,
      btnListJson: {
        prop: 'btnList', label: '操作', btnList: [
          { text: '编辑', click: row => this.onBtn(row, 'edit'), condition: () => sessionStorage.projectState === '已开始' },
          { text: '筛查', click: row => this.onBtn(row, 'filter'), condition: row => !this.patientInfo && row.patientState === '未入组' },
          { text: '筛查详情', click: row => this.onBtn(row, 'filterInfo'), condition: row => !this.patientInfo && row.patientState !== '未入组' },
          { text: '完成', click: row => this.onBtn(row, 'finish'), condition: row => row.patientState === '已入组' },
          { text: '中止', click: row => this.onBtn(row, 'stop'), condition: row => row.patientState === '已入组' },
          { text: '脱落', click: row => this.onBtn(row, 'falloff'), condition: row => row.patientState === '已入组' },
          { text: 'CRF录入', click: row => this.onBtn(row, 'CRF'), condition: () => !this.patientInfo && sessionStorage.projectState === '已开始' },
          { text: 'CRF显示', click: row => this.onBtn(row, 'CRFInfo'), condition: () => !this.patientInfo && sessionStorage.projectState === '暂停' },
          { text: '上传文件', click: row => this.onBtn(row, 'upload'), condition: () => sessionStorage.projectState === '已开始' },
          { text: '签名', click: row => this.onBtn(row, 'signature'), condition: row => !row.signatureDate && sessionStorage.projectState === '已开始' },
          { text: '删除', click: row => this.onBtn(row, 'deletePatient'), condition: () => !this.patientInfo && sessionStorage.projectState === '已开始' },
        ]
      }
    }
  },
  methods: {
    hideDialog () {
      this.showDialog = this.uploadFileDialog = this.screeningDialog = false
      this.rowData = {}
    },
    async onBtn (row, type) {
      this.rowData = row
      let typeLabel = {
        signature: '签名',
        finish: '完成',
        stop: '中止',
        falloff: '脱落',
        deletePatient: '删除',
      }[type]
      this.screeningTitle = ''
      let _confirm
      switch (type) {
        case 'CRF':
        case 'CRFInfo':
          this.$router.push('/crf?patientId=' + row.id)
          break;
        case 'edit':
          this.rowData = row
          this.showDialog = true
          break;
        case 'join':
        case 'exclude':
        case 'filter':
        case 'filterInfo':
          this.screeningTitle = type === 'filter' ? '筛查' : '筛查详情'
          this.screeningDialog = true
          break;
        case 'signature':
        case 'finish':
        case 'stop':
        case 'falloff':
        case 'deletePatient':
          _confirm = await this.$confirm(`确认${typeLabel + row.patientName}？`).catch(() => this.rowData = {})
          if (_confirm !== 'confirm') return
          await this.request(this.api.andrology.patient[type], row)
          await this.getList()
          this.rowData = {}
          break;
        case 'upload':
          this.uploadFileDialog = true
          break;
      }
    }
  }
}