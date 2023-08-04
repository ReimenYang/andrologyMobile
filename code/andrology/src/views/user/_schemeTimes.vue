<template>
  <el-descriptions :column="1" border>
    <el-descriptions-item :label="col.label" v-for="col in infoKeys" :key="col.prop">
      <xnwFromComponent :col="col" :form="form" />
    </el-descriptions-item>
  </el-descriptions>
</template>
<script>
export default {
  name: 'schemeTimes',
  props: {
    data: {
      type: Object,
      default () { return {} }
    }
  },
  data () {
    return {
      infoKeys: [
        { prop: 'projectName', label: '服务项目' },
        { prop: 'numberOfTreatments', label: '治疗总次数', type: 'number', config: {}, onInput: this.counter },
        { prop: 'numberOfSignIn', label: '签到次数', type: 'number', config: {}, onInput: this.counter },
        { prop: 'numberOfRemainingTreatments', label: '剩余治疗次数', type: 'number', config: {}, onInput: this.counter },
        { prop: 'numberOfReserve', label: '预约中次数' },
        { prop: 'remark', label: '备注修改原因（选填）', type: 'input', repeat: [{ type: 'textarea', maxlength: '100', placeholder: '如：某人某日期因何种原因，修改治疗项目中的某项次数' }] },
      ],
      form: {
        projectName: '',
        numberOfTreatments: '',
        numberOfSignIn: '',
        numberOfRemainingTreatments: '',
        numberOfReserve: '',
        remark: ''
      }
    }
  },
  created () {
    for (let name in this.data) this.form[name] = this.data[name]
    this.setRang()
  },
  methods: {
    setRang () {
      let { numberOfTreatments, numberOfSignIn } = this.form
      this.infoKeys.find(item => item.prop === 'numberOfTreatments').config = { min: numberOfSignIn }
      this.infoKeys.find(item => item.prop === 'numberOfSignIn').config
        = this.infoKeys.find(item => item.prop === 'numberOfRemainingTreatments').config
        = { min: 0, max: numberOfTreatments }
    },
    counter (n, obj) {
      this.form[obj.prop] = n
      if (obj.prop !== 'numberOfRemainingTreatments') this.form.numberOfRemainingTreatments = this.form.numberOfTreatments - this.form.numberOfSignIn
      else this.form.numberOfSignIn = this.form.numberOfTreatments - this.form.numberOfRemainingTreatments
      this.setRang()
    }
  }
}
</script>