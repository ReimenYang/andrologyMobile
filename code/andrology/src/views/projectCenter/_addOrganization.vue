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
      infoKeys: [
        {
          prop: 'orgType', label: '机构类型', type: 'radio', repeat: [
            { label: '医疗中心', value: '医疗中心' },
            { label: '其他', value: '其他' }
          ]
        },
        {
          prop: 'orgClassify', label: '机构分类', type: 'radio', repeat: [
            { label: '医疗机构', value: '医疗机构' },
            { label: '健医', value: '健医' },
            { label: '企业', value: '企业' },
            { label: '保险公司', value: '保险公司' }
          ]
        },
        { prop: 'orgName', label: '机构名称', type: 'input', repeat: [{ prop: 'orgName' }] },
        { prop: 'orgShortname', label: '机构简称', type: 'input', repeat: [{ prop: 'orgShortname' }] },
        { prop: 'targetNum', label: '目标数', type: 'input', repeat: [{ prop: 'targetNum' }] },
      ],
      form: {
        orgName: '',
        orgShortname: '',
        orgClassify: '',
        orgType: '',
        targetNum: 0
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
          res = await this.request(this.api.andrology.projectMgt.addProjectOrg, this.form)
          break;
        case 'edit':
          res = await this.request(this.api.andrology.projectMgt.modifyProjectOrg, this.form)
          break;
      }
      if (res.code !== 200) return
      this.$emit('refresh')
      this.$emit('close')
    }
  }
}
</script>