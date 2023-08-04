<template>
  <el-descriptions
    :column="1"
    border
  >
    <el-descriptions-item
      :label="col.label"
      v-for="col in infoKeys"
      :key="col.prop"
    >
      <xnwFromComponent
        :col="col"
        :form="form"
      />
    </el-descriptions-item>
  </el-descriptions>
</template>
<script>

export default {
  name: 'updateUser',
  props: {
    data: {
      type: Object,
      default () { return {} }
    }
  },
  data () {
    return {
      infoKeys: [
        { prop: 'realName', label: '患者姓名', type: 'input', repeat: [{ prop: 'realName', placeholder: '请输入姓名' }] },
        { prop: 'phone', label: '联系电话', type: 'input', repeat: [{ prop: 'phone', maxlength: '11', placeholder: '请输入联系电话' }] },
      ],
      form: {
        realName: '',
        phone: ''
      }
    }
  },
  async created () {
    if (this.data.phone) for (let name in this.data) this.form[name] = this.data[name]
  }
}
</script>