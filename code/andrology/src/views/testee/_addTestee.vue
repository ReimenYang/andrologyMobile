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
    <div class="formFooter">
      <button
        class="btn"
        @click="$emit('close')"
      >取消</button>
      <button
        class="btn primary"
        @click="confirm"
      >{{type === 'add'?'创建':'保存'}}</button>
    </div>
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
      default: () => ({})
    },
    type: {
      type: String,
      default: () => 'add'
    }
  },
  data () {
    return {
      showDialog: true,
      width: '800px',
      infoKeys: [{
        prop: 'patientName', label: '姓名', type: 'input', repeat: [{ prop: 'patientName' }]
      }, {
        prop: 'patientPhone', label: '手机号', type: 'input', repeat: [{ prop: 'patientPhone' }]
      }, {
        prop: 'patientAdmission', label: '住院号', type: 'input', repeat: [{ prop: 'patientAdmission' }]
      }, {
        prop: 'patientWeixin', label: '微信号', type: 'input', repeat: [{ prop: 'patientWeixin' }]
      }, {
        prop: 'patientIdentity', label: '身份证号', type: 'input', repeat: [{ prop: 'patientIdentity' }]
      }],
      form: {
        patientName: '',
        patientPhone: '',
        patientAdmission: '',
        patientWeixin: '',
        patientIdentity: ''
      }
    }
  },
  created () {
    this.form = { ...this.form, ...this.data }
  },
  methods: {
    async confirm () {
      let res = { code: 200 }
      switch (this.type) {
        case 'add':
          res = await this.request(this.api.andrology.patient.newPatient, this.form)
          break;
        case 'edit':
          res = await this.request(this.api.andrology.patient.modifyPatient, this.form)
          break;
      }
      if (res.code !== 200) return
      this.$emit('refresh')
      this.$emit('close')
    }
  }
}
</script>