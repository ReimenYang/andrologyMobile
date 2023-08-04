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
  </el-dialog>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: () => '新增'
    }
  },
  data () {
    return {
      showDialog: true,
      width: '1300px',
      infoKeys: [
        { prop: 'questionTitle', label: '问题', type: 'input', repeat: [{ prop: 'questionTitle' }] },
        { prop: 'questionAnswer', label: '质疑内容', type: 'input', repeat: [{ prop: 'questionAnswer' }] },
        { prop: 'askContent', label: '意见', type: 'textarea', repeat: [{ prop: 'projectName' }] },
      ],
      form: {
        questionTitle: '',
        questionAnswer: '',
        patientId: '',
        stageId: '',
        questionnaireTypeId: '',
        questionId: '',
        askContent: ''
      }
    }
  },
  methods: {
    async dialogConfirm () {
      this.$emit('close')
      this.$emit('refresh')
    }
  }
}
</script>