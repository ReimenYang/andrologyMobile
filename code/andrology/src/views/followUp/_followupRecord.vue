<template>
  <el-dialog
    top="5vh"
    :title="title"
    v-model="showDialog"
    :width="width"
  >
    <div
      class="stage"
      v-for="stage in date.followupList"
      :key="stage.stageId"
      @click="getInfo(stage)"
    >
      <div>
        <div class="title">{{ stage.stageName }}</div>
        <div>
          <span class="tips">{{ stage.state }}</span>
          <span class="tips">{{ stage.startDate }}</span>
          <span class="tips">{{ stage.startUser }}</span>
        </div>
      </div>
      <button class="btn plain">
        编辑查看
      </button>
    </div>
    <followup-questionnaire
      title="随访问卷"
      v-if="showQuestionnaire"
      @close="hideDialog"
      :stage="stage"
    />
  </el-dialog>
</template>
<script>
import followupQuestionnaire from './_followupQuestionnaire.vue'
export default {
  components: { followupQuestionnaire },
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
      width: '600px',
      showQuestionnaire: false,
      params: {}
    }
  },
  methods: {
    async getInfo (stage) {
      this.stage = stage
      this.showQuestionnaire = true
    },
    hideDialog () {
      this.showQuestionnaire = false
    }
  }
}
</script>
<style lang="scss" scoped>
.stage {
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-light);
  border: var(--border-normal);
  .title {
    font-size: var(--font-h3);
    line-height: 2;
  }
  .tips {
    padding: 0 20px 0 0;
    color: var(--color-tips);
  }
}
</style>