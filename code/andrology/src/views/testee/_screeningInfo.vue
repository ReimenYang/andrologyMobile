<template>
  <el-dialog
    top="5vh"
    :title="title"
    v-model="showDialog"
    :width="width"
  >
    <div style="display: flex;">
      <el-descriptions
        :column="1"
        border
        v-for="(list,i) in screeningInfo"
        :key="i"
        style="flex: 1;margin:0 10px;"
      >
        <el-descriptions-item
          :label="{inclusionCriteriaList:'入组标准',exclusionCriteriaList:'排除标准'}[i]"
          labelClassName="labelClass"
        >
          筛查结果
        </el-descriptions-item>

        <el-descriptions-item
          :label="col.criteria"
          v-for="col in list"
          :key="col.criteria"
          labelClassName="labelClass"
        >
          <span :style="{color:col.result==='请医师判断'?'blue':((col.result==='符合'||col.result==='否')?'':'red')}">{{ col.result }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="formFooter">
      <button
        class="btn"
        @click="$emit('close')"
      >取消</button>
      <button
        v-if="title==='筛查'"
        class="btn primary"
        @click="confirm('join')"
      >入组</button>
      <button
        v-if="title==='筛查'"
        class="btn primary"
        @click="confirm"
      >排除</button>
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
      width: '1200px',
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
    this.screeningInfo = (await this.request(this.api.andrology.patient.getPatientScreeningInfo, { patientId: this.date.id })).data
  },
  methods: {
    async finish () {
      this.$emit('refresh')
      this.$emit('close')
    },
    async confirm (type) {
      if (type === 'join') return this.joinDialog = true
      let res = await this.request(this.api.andrology.patient.exclude, { patientId: this.date.id })
      if (res.code !== 200) return this.finish()
    },
    hideDialog () {
      this.joinDialog = false
    },
  }
}
</script>
<style lang="scss" scoped>
:deep(.labelClass) {
  width: 450px;
}
</style>