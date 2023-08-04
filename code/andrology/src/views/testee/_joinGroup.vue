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
      >保存</button>
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
    date: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      showDialog: true,
      width: '800px',
      infoKeys: [{
        prop: 'groupId',
        label: '分组',
        type: 'select',
        repeat: [{
          options: this.globalData.groupList.map(({ groupName: label, id: value }) => ({ label, value })),
          placeholder: '请选择'
        }]
      }, {
        prop: 'enterDate', label: '入组日期', type: 'dateTimePicker', repeat: [{ prop: 'enterDate', type: 'date' }]
      }],
      form: {
        patientId: this.date.id,
        groupId: '',
        enterDate: ''
      }
    }
  },
  watch: {
    showDialog: function () {
      if (!this.showDialog) this.$emit('close')
    }
  },
  methods: {
    async confirm () {
      let error = []
      if (!this.form.groupId) error.push('分组')
      if (!this.form.enterDate) error.push('入组日期')
      if (error.length) return this.$message.error(error.join() + '不能为空')
      let res = await this.request(this.api.andrology.patient.join, this.form)
      if (res.code !== 200) return
      this.$emit('finish')
      this.$emit('close')
    }
  }
}
</script>