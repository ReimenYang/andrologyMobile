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
      <el-descriptions-item label="随访备注">
        <el-input
          type="textarea"
          v-model="form.followupRemark"
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
      form: {
        patientId: this.date.patientId,
        followupRemark: this.date.followupRemark
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
      let res = await this.request(this.api.andrology.crf.modifyPatientFollowupRemark, this.form)
      if (res.code !== 200) return
      this.$emit('finish')
      this.$emit('close')
    }
  }
}
</script>