<template>
  <el-dialog
    top="5vh"
    :title="title"
    v-model="showDialog"
    :width="width"
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
    type: {
      type: String,
      default: () => 'add'
    },
    roleList: {
      type: Array,
      default: () => []
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      showDialog: true,
      width: '800px',
      infoKeys: [
        { prop: 'userPhone', label: '手机号码', type: 'input', repeat: [{ prop: 'userPhone' }] },
        { prop: 'userName', label: '用户姓名', type: 'input', repeat: [{ prop: 'userName' }] },
        { prop: 'userEmail', label: '邮箱地址', type: 'input', repeat: [{ prop: 'userEmail' }] },
        {
          prop: 'organizationId', label: '所属机构', type: 'select', repeat: [
            { options: this.globalData.orgList.map(({ orgName, organizationId }) => ({ label: orgName, value: organizationId })), placeholder: '请选择' }
          ]
        }, {
          prop: 'roleName', label: '权限角色', type: 'select', repeat: [
            { options: this.roleList.map(({ roleName, id }) => ({ label: roleName, value: id })), placeholder: '请选择' }
          ]
        }, {
          prop: 'projectRole', label: '项目角色', type: 'select', repeat: [{
            options: ['申办方', '项目维护者', '主要研究者', '次要研究者', '临床检查员', '数据经理'].map(label => ({ label, value: label })),
            placeholder: '请选择'
          }]
        },
        {
          prop: 'dataPrivilege', label: '数据权限', type: 'select', repeat: [{
            options: [{ label: '全部机构', value: '全部机构' }, { label: '本机构', value: '本机构' }],
            placeholder: '请选择'
          }]
        },
        {
          prop: 'enableLabel', label: '患者状态', type: 'radio', repeat: [
            { label: '启用', value: 'Y' },
            { label: '禁用', value: 'N' },
          ]
        }
      ],
      form: {
        userPhone: '',
        userName: '',
        userEmail: '',
        organizationId: '',
        projectRole: '',
        dataPrivilege: '',
        enableLabel: '',
        organization: {},
        roleName: '',
        role: {}
      }
    }
  },
  created () {
    this.form = { ...this.form, ...this.data }
  },
  methods: {
    async confirm () {
      this.form.enable = this.form.enableLabel === '启用' ? 'Y' : 'N'
      this.form.organization = this.globalData.orgList.find(item => item.organizationId === this.form.organizationId)
      this.form.role = this.roleList.find(item => item.roleName)
      let res = { code: 200 }
      switch (this.type) {
        case 'add':
          res = await this.request(this.api.andrology.projectMgt.addProjectUser, this.form)
          break;
        case 'edit':
          res = await this.request(this.api.andrology.projectMgt.modifyProjectUser, this.form)
          break;
      }
      if (res.code !== 200) return
      this.$emit('refresh')
      this.$emit('close')
    }
  }
}
</script>