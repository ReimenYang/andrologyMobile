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
        :label="col.criteria"
        v-for="col in screeningInfo"
        :key="col.criteria"
      >
        {{ col.result }}
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
      >{{type === 'join'?'入组':'排除'}}</button>
    </div>
    <join-group
      title="入组"
      @close="hideDialog"
      @finish="finish"
      :date="date"
      v-if="joinDialog"
    />
  </el-dialog>
</template>
<script>
import joinGroup from './_joinGroup.vue'
export default {
  components: { joinGroup },
  props: {
    title: {
      type: String,
      default: () => '新增'
    },
    type: {
      type: String,
      default: () => 'join'
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
      screeningInfo: [],
      joinDialog: false
    }
  },
  watch: {
    showDialog: function () {
      if (!this.showDialog) this.$emit('close')
    }
  },
  async created () {
    this.screeningInfo = (await this.request(this.api.andrology.patient.getPatientScreeningInfo, { patientId: this.date.id })).data[this.type === 'join' ? 'inclusionCriteriaList' : 'exclusionCriteriaList']
  },
  methods: {
    async finish () {
      this.$emit('refresh')
      this.$emit('close')
    },
    async confirm () {
      if (this.type === 'join') return this.joinDialog = true
      let res = await this.request(this.api.andrology.patient.exclude, { patientId: this.date.id })
      if (res.code !== 200) return this.finish()
    },
    hideDialog () {
      this.joinDialog = false
    },
  }
}
</script>