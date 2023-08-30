<template>
  <div
    class="info"
    :class="type"
  >
    <el-descriptions
      :column="2"
      border
    >
      <el-descriptions-item
        :label="col.label"
        v-for="col in infoKeys"
        :key="col.prop"
        v-bind="col.config"
      >
        <div class="box">
          <xnwFromComponent
            :col="col"
            :form="form"
          />
          <span
            class="red"
            v-if="col.required"
          >*</span>
        </div>
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
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: () => 'add'
    }
  },
  data () {
    return {
      width: '1300px',
      infoKeys: [
        { prop: 'projectName', label: '项目名称', required: true, type: 'input', repeat: [{ prop: 'projectName' }] },
        {
          prop: 'patientOptional', label: '受试者选填项', type: 'checkbox', repeat: [
            { label: '姓名', value: '姓名' },
            { label: '手机号', value: '手机号' },
            { label: '微信号', value: '微信号' },
            { label: '身份证号', value: '身份证号' },
            { label: '住院号', value: '住院号' },
          ]
        },
        {
          prop: 'projectType',
          label: '项目类型',
          type: 'select',
          repeat: [{
            options: [
              { label: '请选择', value: '' },
              { label: '临床项目', value: '临床项目' },
              { label: '科研项目', value: '科研项目' },
              { label: 'HCRM', value: 'HCRM' }
            ],
            placeholder: '请选择'
          }]
        },
        {
          prop: 'projectScope',
          label: '项目范围',
          type: 'select',
          repeat: [{
            options: [
              { label: '请选择', value: '' },
              { label: '项目', value: '项目' },
              { label: '中心', value: '中心' }
            ],
            placeholder: '请选择'
          }]
        },
        { prop: 'planStartDate', label: '预计开始时间', type: 'dateTimePicker', repeat: [{ prop: 'planStartDate', type: 'date' }] },
        { prop: 'planEndDate', label: '预计结束时间', type: 'dateTimePicker', repeat: [{ prop: 'planEndDate', type: 'date' }] },
        { prop: 'patientCodePrefix', label: '受试者编号前缀', required: true, type: 'input', repeat: [{ prop: 'patientCodePrefix' }] },
        { prop: 'patientCodeLength', label: '受试者编号位数', required: true, type: 'input', repeat: [{ prop: 'patientCodeLength' }] },
        { prop: 'projectDesc', label: '项目描述', type: 'input', config: { span: 2 }, repeat: [{ prop: 'projectDesc', type: 'textarea', rows: 4, style: 'width:60vw', maxlength: 200 }] },
        { prop: 'inclusionCriteria', label: '纳入标准', type: 'input', config: { span: 2 }, repeat: [{ prop: 'inclusionCriteria', type: 'textarea', rows: 4, style: 'width:60vw' }] },
        { prop: 'exclusionCriteria', label: '排除标准', type: 'input', config: { span: 2 }, repeat: [{ prop: 'exclusionCriteria', type: 'textarea', rows: 4, style: 'width:60vw' }] },
        { prop: 'falloffCriteria', label: '脱落标准', type: 'input', config: { span: 2 }, repeat: [{ prop: 'falloffCriteria', type: 'textarea', rows: 4, style: 'width:60vw' }] },
        { prop: 'suspendCriteria', label: '中止标准', type: 'input', config: { span: 2 }, repeat: [{ prop: 'suspendCriteria', type: 'textarea', rows: 4, style: 'width:60vw' }] },
        { prop: 'therapeuticMethod', label: '治疗方法', type: 'input', config: { span: 2 }, repeat: [{ prop: 'therapeuticMethod', type: 'textarea', rows: 4, style: 'width:60vw' }] },
        { prop: 'therapeuticPeriod', label: '治疗周期', type: 'input', config: { span: 2 }, repeat: [{ prop: 'therapeuticPeriod', type: 'textarea', rows: 4, style: 'width:60vw' }] },
        { prop: 'curativeEffectCriteria', label: '疗效标准', type: 'input', config: { span: 2 }, repeat: [{ prop: 'curativeEffectCriteria', type: 'textarea', rows: 4, style: 'width:60vw' }] },
      ],
      form: {
        projectName: '',
        projectType: '',
        projectScope: '',
        projectDesc: '',
        planStartDate: '',
        planEndDate: '',
        patientCodePrefix: '',
        patientCodeLength: 0,
        patientOptional: [],
        inclusionCriteria: '',
        exclusionCriteria: '',
        falloffCriteria: '',
        suspendCriteria: '',
        therapeuticMethod: '',
        therapeuticPeriod: '',
        curativeEffectCriteria: ''
      }
    }
  },
  async created () {
    if (this.type === 'add') return
    this.form = (await this.request(this.api.andrology.projectMgt.getProjectBaseInfo)).data
    this.form.patientOptional = this.form.patientOptional.split(',')
  },
  methods: {
    async confirm () {
      let _required = this.infoKeys.filter(item => item.required && !this.form[item.prop]).map(item => item.label)
      if (_required.length) return this.$message.error(_required.join() + '不能为空')

      let res = { code: 200 }
      let parmes = { ...this.form, patientOptional: this.form.patientOptional.join(), projectCode: this.globalData.headers.projectCode }
      switch (this.type) {
        case 'add':
          res = await this.request(this.api.andrology.projectMgt.createProject, parmes)
          break;
        case 'edit':
          res = await this.request(this.api.andrology.projectMgt.modifyProjectBaseInfo, parmes)
          break;
      }
      if (res.code !== 200) return
      this.$message.success('保存成功')
      this.$emit('confirm')
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
.info {
  &.edit {
    padding: 30px;
    background: #fff;
  }
  .box {
    display: flex;
    align-items: center;
  }
  .red {
    margin: 0 10px;
    color: red;
    font-size: 24px;
  }
  .footer {
    margin: 10px;
    display: flex;
    justify-content: center;
    .btn {
      font-size: 16px;
      border-color: var(--theme-color);
    }

    .primary {
      background-color: var(--theme-color);
      color: var(--color-white);
    }
    .plain {
      background-color: var(--color-plain);
      color: var(--theme-color);
    }
  }
}
:deep(.el-descriptions__label) {
  width: 130px;
}
:deep(.el-descriptions__content) {
  width: 500px;
}
</style>