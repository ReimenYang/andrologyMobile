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
        { prop: 'groupName', label: '组名称', type: 'input', repeat: [{ prop: 'groupName' }] },
        { prop: 'groupDesc', label: '描述', type: 'input', config: { span: 2 }, repeat: [{ prop: 'groupDesc', type: 'textarea', rows: 4, maxlength: 200 }] },
      ],
      form: {
        groupName: '',
        groupDesc: '',
      }
    }
  },
  methods: {
    async confirm () {
      let res = { code: 200 }
      switch (this.type) {
        case 'add':
          res = await this.request(this.api.andrology.projectMgt.addProjectGroup, this.form)
          break;
        case 'edit':
          res = await this.request(this.api.andrology.projectMgt.modifyProjectGroup, this.form)
          break;
      }
      if (res.code !== 200) return
      this.$emit('refresh')
      this.$emit('close')
    }
  }
}
</script>