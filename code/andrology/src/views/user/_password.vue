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
    }
  },
  data () {
    return {
      showDialog: false,
      width: '600px',
      infoKeys: [{
        prop: 'oldPassword', label: '旧密码', type: 'password', config: { type: "password", showPassword: true }, repeat: [{ prop: 'oldPassword' }]
      }, {
        prop: 'newPassword', label: '新密码', type: 'password', config: { type: "password", showPassword: true }, repeat: [{ prop: 'newPassword' }]
      }, {
        prop: 'confirmPassword', label: '确认新密码', type: 'password', config: { type: "password", showPassword: true }, repeat: [{ prop: 'confirmPassword' }]
      }],
      form: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  async created () {
    this.showDialog = true
  },
  methods: {
    async confirm () {
      let { oldPassword, newPassword, confirmPassword } = this.form
      if (!oldPassword || !newPassword || !confirmPassword) return this.$message.error('旧密码、新密码、确认新密码不能为空')
      if (this.form.newPassword !== this.form.confirmPassword) return this.$message.error('两次输入新密码不一致，请重新输入')
      let res = await this.request(this.api.andrology.user.modifyPassword, this.form)
      if (res.code !== 200) return
      this.$emit('close')
    }
  }
}
</script>