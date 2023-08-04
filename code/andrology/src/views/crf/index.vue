<template>
  <el-container class="crf">
    <el-aside class="aside">
      <!-- <el-input
      v-model="filterText"
      placeholder="Filter keyword"
      /> -->
      <el-tree
        ref="treeRef"
        class="filter-tree"
        :data="patientList"
        :default-expanded-keys="[patientId]"
        :props="{...defaultProps,class:setActiveNodeClass}"
        :filter-node-method="filterNode"
        @node-click="clickTree"
      />
    </el-aside>

    <el-main class="main">
      <el-collapse
        v-model="activeStage"
        @change="collapseChange(i)"
        accordion
        v-if="ready"
      >
        <el-collapse-item
          v-for="(stage,i) in patientInfo.stageList"
          :key="stage.stageId"
          :title="stage.stageName"
          :name="stage.stageId"
        >
          <el-tabs
            v-model="activeQuestionnaire[i]"
            @tab-click="tabClick"
          >
            <el-tab-pane
              v-for="{questionnaireTypeId,questionnaireTypeName,paper} in stage.questionnaireList"
              :key="questionnaireTypeId"
              :label="questionnaireTypeName"
              :name="questionnaireTypeId"
            >
              <div v-if="activeQuestionnaire[i] === questionnaireTypeId && activeStage === stage.stageId">
                <!-- 卡片式问卷 -->
                <paper-by-card
                  ref="paper"
                  v-for="questionGroup in paper"
                  :key="questionGroup.groupId"
                  :paper="questionGroup"
                />
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-collapse-item>
      </el-collapse>
      <el-button
        class="submitBtn"
        type="primary"
        @click="save"
      >保存问卷</el-button>
    </el-main>
    <el-aside class="aside patientInfo">
      <el-descriptions
        :column="1"
        border
      >
        <el-descriptions-item
          :label="col.label"
          label-class-name="infoLabel"
          v-for="col in infoKeys"
          :key="col.prop"
        >
          {{ patientInfo[col.prop] }}
        </el-descriptions-item>
      </el-descriptions>
      <div class="btnList">
        <el-button
          type="primary"
          plain
          v-for="btn in btnList"
          :key="btn.text"
          @click="btn.click(patientInfo)"
          v-show="!btn.condition||(btn.condition&&btn.condition(patientInfo))"
        >{{ btn.text }}</el-button>
      </div>
    </el-aside>
  </el-container>
</template>

<script>
import paperByCard from './_paperByCard.vue'
export default {
  components: { paperByCard },
  data () {
    return {
      ready: false,
      filterText: '',
      defaultProps: {
        label: 'label',
        children: 'children'
      },
      patientList: [],
      patientId: '',
      patientInfo: {},
      infoKeys: [{
        prop: 'patientCode', label: '编号'
      }, {
        prop: 'patientName', label: '姓名'
      }, {
        prop: 'patientPhone', label: '手机号'
      }, {
        prop: 'patientIdentity', label: '身份证号'
      }, {
        prop: 'patientAdmission', label: '住院号'
      }, {
        prop: 'patientState', label: '筛查状态'
      }, {
        prop: 'groupName', label: '分组'
      }, {
        prop: 'patientAdmission', label: '研究状态'
      }, {
        prop: 'consentState', label: '知情同意书'
      }],
      btnList: [
        { text: '编辑', click: row => this.onBtn(row, 'edit') },
        { text: '入组', click: row => this.onBtn(row, 'join'), condition: row => !row.groupName },
        { text: '排除', click: row => this.onBtn(row, 'exclude'), condition: row => !!row.groupName },
        { text: '完成', click: row => this.onBtn(row, 'finish') },
        { text: '中止', click: row => this.onBtn(row, 'stop') },
        { text: '脱落', click: row => this.onBtn(row, 'falloff') },
        { text: '签名', click: row => this.onBtn(row, 'signature') },
        { text: '上传文件', click: row => this.onBtn(row, 'upload') }
      ],
      activeStage: '',
      activeQuestionnaire: []
    }
  },
  // watch: {
  //   filterText: function () {
  //     if (this.filterText) this.$refs.treeRef.filter(this.filterText)
  //   }
  // },
  async created () {
    window.W = this
    await this.init()
  },
  methods: {
    async init () {
      let patient = await this.getList(this.$route.query.patientId)
      await this.getPatientInfo(patient)
      await this.getQuestionnaire()
    },
    async getList (patientId) {
      let list = (await this.request(this.api.andrology.crf.getPatientList)).data
      let orgList = this.libs.array.unique(list, a => a.organizationId)
      this.patientList = orgList.map(({ organizationId, organization }) => ({
        organizationId,
        label: organization,
        children: list.filter(item => {
          item.label = item.patientCode
          return item.organizationId === organizationId
        })
      }))
      return list.find(patient => patient.patientId === patientId - 0)
    },
    async getPatientInfo (params = this.patientList[0].children[0]) {
      this.patientId = params.patientId
      this.ready = false
      this.patientInfo = (await this.request(this.api.andrology.crf.getPatientInfo, params)).data
      this.activeStage = this.patientInfo.stageList[0].stageId
      this.activeQuestionnaire = this.patientInfo.stageList.map(({ questionnaireList }) => questionnaireList[0].questionnaireTypeId)
    },
    async getQuestionnaire () {
      let i = this.patientInfo.stageList.findIndex(stage => stage.stageId === this.activeStage)
      let questionnaireTypeId = this.activeQuestionnaire[i]
      let _questionnaire
        = this.patientInfo.stageList
          .find(stage => stage.stageId === this.activeStage).questionnaireList
          .find(questionnaire => questionnaire.questionnaireTypeId === questionnaireTypeId)

      if (_questionnaire.paper) return this.ready = true

      _questionnaire.paper = (await this.request(
        this.api.andrology.crf.getQuestionnaire,
        { ...this.patientInfo, stageId: this.activeStage, questionnaireTypeId }
      )).data.groupList
      _questionnaire.paper.forEach(group => {
        group.patientId = this.patientId
        group.stageId = this.activeStage
        group.questionnaireTypeId = questionnaireTypeId
        group.questionnaireName = _questionnaire.questionnaireTypeName
        group.table = {
          tableHeader: [
            { prop: 'questionTitle', label: '检查项目' },
            {
              prop: 'questionAnswer', label: group.examineAnswerTitle, type: 'input',
              repeat: [
                { prop: 'questionAnswer' }
              ]
            },
            {
              prop: 'examineSence', label: group.examineSenceTitle, type: 'select',
              repeat: [
                {
                  options: [
                    { value: '正常' },
                    { value: '异常无临床意义' },
                    { value: '异常有临床意义' },
                    { value: '未查' },
                    { value: '不适用' }
                  ]
                }
              ]
            },
            { prop: 'examineNormalValue', label: group.examineNormalValueTitle },
            { prop: 'examineRemark', label: group.examineRemarkTitle },
          ]
        }
        group.questionList.forEach(question => {
          if (!question.askOperationList) question.askOperationList = []
          switch (question.questionType) {
            case '计算':
              question.uiStyle = 'computer'
              break;
            case '日期':
              question.uiStyle = 'dateTimePicker'
              // question.uiStyle = 'date'

              question.col = {
                label: question.questionTitle,
                prop: 'questionAnswer',
                type: question.uiStyle
              }
              break;
            case '上传图片':
              question.uiStyle = 'uploadImg'
              break;
            case '数字':
              question.uiStyle = 'num'
              break;
            case '单行文本':
              question.uiStyle = 'input'

              question.col = {
                label: question.questionTitle,
                prop: 'questionAnswer',
                type: question.uiStyle,
                repeat: [
                  { prop: 'questionAnswer' }
                ]
              }
              break;
            case '多行文本':
              question.uiStyle = 'textarea'
              question.col = {
                label: question.questionTitle,
                prop: 'questionAnswer',
                type: question.uiStyle
              }
              break;
            case '单选':
              question.uiStyle = 'radio'
              question.checked = (question.optionList.find(option => option.checked) || {}).optionText
              question.col = {
                label: question.questionTitle,
                prop: 'checked',
                type: question.uiStyle,
                repeat: question.optionList.map(({ optionText: label }) => ({ label }))
              }
              break;
            case '多选':
              question.uiStyle = 'checkbox'
              question.checked = question.optionList.reduce((a, b) => b.checked ? [...a, b.optionText] : a, [])
              question.col = {
                label: question.questionTitle,
                prop: 'checked',
                type: question.uiStyle,
                repeat: question.optionList.map(({ optionText: label }) => ({ label }))
              }
              break;
            case '检查项目':
              group.uiStyle = 'table'
              return;
          }
          if (!question.col) question.col = {
            label: question.questionTitle,
            prop: 'questionAnswer',
            type: question.uiStyle
          }
        });
      });
      this.ready = true
    },
    // getPaper (groupId) {
    //   return this.paper.questionList.find(paper => paper.groupId === groupId)
    // },
    async collapseChange () {
      return await this.getQuestionnaire()
    },
    async tabClick (tab) {
      let i = this.patientInfo.stageList.findIndex(stage => stage.stageId === this.activeStage)
      this.activeQuestionnaire[i] = tab.paneName
      return await this.getQuestionnaire()
    },
    async cancelShowDialog () {
      this.showDialog = false
      await this.getList({})
    },
    setActiveNodeClass (object) {
      return this.patientId === object.patientId ? 'active' : ''
    },
    filterNode (value, data) {
      console.log(value, data);
      // if (!value) return true
      // return value.includes(data.label)
    },
    async clickTree (object) {
      if (!object.patientId) return
      await this.getPatientInfo(object)

      await this.getQuestionnaire()
    },
    async save () {
      let paperList = this.patientInfo.stageList.map(stage => stage.questionnaireList.map(questionnaire => questionnaire.paper))
        .flat()
        .filter(paper => paper)
        .flat()
        .filter(paper => paper && paper.hasChanged)
      if (!paperList.length) this.$message.warning({ duration: 3000, message: '没有问卷被修改，无需提交' })

      // 按问卷提交
      // let saveList = paperList.map(paper => ({
      //   patientId: paper.patientId,
      //   stageId: paper.stageId,
      //   questionnaireList: [{
      //     questionnaireTypeId: paper.questionnaireTypeId,
      //     questionnaireName: paper.questionnaireName,
      //     entryUser: this.globalData.userInfo.userName,
      //     entryDate: new Date(),
      //     groupList: [paper]
      //   }]
      // }))

      // 按阶段提交
      let stageList = this.libs.array.unique(paperList, a => a.stageId)

      let saveList = stageList.map(({ patientId, stageId }) => ({
        patientId,
        stageId,
        questionnaireList:
          paperList.filter(item => item.stageId === stageId)
            .map(({ questionnaireTypeId, questionnaireName, groupId }) => ({
              questionnaireTypeId: stageId === 110 ? questionnaireTypeId : '',
              questionnaireName,
              entryUser: this.globalData.userInfo.userName,
              entryDate: new Date(),
              groupList: paperList.filter(item => item.stageId === stageId && item.groupId === groupId)
            }))
      }))
      let res = await Promise.all(saveList.map(async stage => {
        let _res = await this.request(this.api.andrology.crf.submitQuestionnaire, stage)
        return { stageId: stage.stageId, ..._res }
      }))
      console.log(saveList, res);
    }
  }
}
</script>
<style lang="scss" scoped>
.crf {
  height: calc(100% - 70px);
}
.aside {
  width: var(--nav-width);
  background-color: #fff;
}
.main {
  margin: 0 10px;
  background-color: #fff;
}
.patientInfo {
  width: 350px;
  :deep(.infoLabel) {
    width: 100px;
  }
  .btnList {
    padding: 5px 10px;
    .el-button {
      margin: 5px;
    }
  }
}
:deep(.el-tree-node__content) {
  height: 2.5em;
  line-height: 2;
}
:deep(.active) {
  background-color: var(--color-plain);
  border-color: var(--theme-color);
  color: var(--theme-color);
  font-weight: bold;
}
.submitBtn {
  margin: 20px auto;
  display: block;
}
</style>

