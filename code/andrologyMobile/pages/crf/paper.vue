<template>
  <view class="bg">
    <p-header
      backIcon="show"
      :title="title"
    />
    <p-wrap
      :hasHeader="true"
      :hasFooter="showFooter"
      v-if="ready"
    >
      <xnw-nav
        v-bind="stage"
        @onClick="changeTab"
        ref="stage"
        style="position: fixed;margin-top: -6rpx;z-index: 2;background-color: #fff;"
      />
      <view
        class="tabPane"
        v-if="activeQuestionnaire.length"
      >
        <!-- 卡片式问卷 -->
        <paper-by-list
          ref="paper"
          v-for="questionGroup in activeQuestionnaire"
          :key="questionGroup.groupId"
          :paper="questionGroup"
        />
      </view>
    </p-wrap>
    <xnw-footer
      v-if="showFooter"
      @onConfirm="onConfirm"
      @onCancel="onCancel"
      :textConfirm="'保存'"
      :textCancel="'返回'"
    />
  </view>
</template>

<script>
import paperByList from './_paperByList.vue'
import questionMixin from './questionMixin.js'
export default {
  mixins: [questionMixin],
  components: { paperByList },
  provide () {
    return {
      testStage: () => this
    }
  },
  data () {
    return {
      ready: false,
      showFooter: this.globalData.projectState === '已开始',
      title: '问卷',
      patientFileInfo: {},
      activeQuestionnaire: [],
      stage: {
        list: [],
        activeStyle: 'color: var(--theme-color);background-color: #fff;'
      },
    }
  },
  async onLoad () {
    window.Y = this
    console.log(this.options)
    if (!this.globalData.patientInfo) this.globalData.patientInfo = (await this.request(this.api.andrology.crf.getPatientInfo, this.options)).data
    let stage = this.globalData.patientInfo.stageList.find(item => item.stageId === (this.options.stageId - 0))
    stage.questionnaireList.forEach((questionnaire, i) => {
      this.stage.list.push({
        ...questionnaire,
        txt: questionnaire.questionnaireTypeName,
        value: i,
      })
    })
    await this.getList()

    this.title = this.globalData.patientInfo.patientName + this.options.stageName + '问卷'
    document.title = this.title
  },
  methods: {
    async getList () {
      let _questionnaire = this.stage.list[(this.$refs.stage && String(this.$refs.stage.curTab)) || 0]
      if (_questionnaire.paper) return this.ready = true
      _questionnaire.paper = (await this.request(
        this.api.andrology.crf.getQuestionnaire,
        { ...this.options, questionnaireTypeId: _questionnaire.questionnaireTypeId }
      )).data.groupList
      for (let paper of _questionnaire.paper) {
        paper.patientId = this.options.patientId
        paper.stageId = this.options.stageId
        paper.questionnaireTypeId = _questionnaire.questionnaireTypeId
        paper.questionnaireName = _questionnaire.questionnaireTypeName
        paper.watchIds = {}
        paper.table = {
          tableHeader: [
            { isSDV: true, width: 80 },
            { prop: 'questionTitle', label: '检查项目' },
            {
              prop: 'questionAnswer', label: paper.examineAnswerTitle, type: 'input',
              repeat: [{ prop: 'questionAnswer' }]
            },
            {
              prop: 'examineSence', label: paper.examineSenceTitle, type: 'select', value: 0,
              repeat: [
                {
                  options: [
                    { label: '正常', value: '正常' },
                    { label: '异常无临床意义', value: '正常' },
                    { label: '异常有临床意义', value: '正常' },
                    { label: '未查', value: '正常' },
                    { label: '不适用', value: '正常' }
                  ]
                }
              ]
            },
            { prop: 'examineNormalValue', label: paper.examineNormalValueTitle },
            {
              prop: 'examineRemark', label: paper.examineRemarkTitle, type: 'input',
              repeat: [{ prop: 'examineRemark' }]
            },
          ]
        }
        for (let question of paper.questionList) {
          if (!question.askOperationList) question.askOperationList = []
          await this.questionFormat(question, paper)
        }
      }

      this.activeQuestionnaire = _questionnaire.paper
      this.ready = true
    },
    async onCancel () {
      uni.navigateBack()
    },
    async onConfirm () {
      let { patientId, stageId } = this.options
      let patientInfo = { patientId, stageList: [{ stageId, questionnaireList: this.stage.list }] }
      this.save(patientInfo)
      uni.navigateBack()
    },
    async changeTab (tab) {
      await this.getList()
      this.activeQuestionnaire = tab.paper
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .nav {
  line-height: 3;
  .item {
    padding: 10rpx 40rpx;
    font-size: var(--font-h4);
  }
}
.tabs {
  width: 100%;
  display: flex;
  text-align: center;
  line-height: 3;
  .tab {
    flex: 1;
    &.active {
      color: var(--theme-color);
      background-color: #fff;
    }
  }
}
.tabPane {
  padding: 120rpx 20rpx 20rpx;
  background: #fff;
  /deep/ .bg-img {
    border: var(--border-normal);
    display: inline-block;
  }
  /deep/ .formGroup {
    margin-right: 30rpx;
    .checkbox .label,
    .radio .label {
      margin: 0 50rpx 30rpx 0;
      display: inline-block;
    }
  }
}
</style>
