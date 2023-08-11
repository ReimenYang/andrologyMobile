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
        accordion
        v-if="ready"
      >
        <el-collapse-item
          v-for="(stage,i) in patientInfo.stageList"
          :key="stage.stageId"
          :title="stage.stageName"
          :name="stage.stageId"
        >

          <paper
            v-if="activeStage === stage.stageId"
            :activeQuestionnaire="activeQuestionnaire"
            :stageIndex="i"
            :stage="stage"
            :activeStage="activeStage"
            :patientInfo="patientInfo"
          />
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
  <add-testee
    :title="rowData.patientId?'编辑受试者':'增加受试者'"
    :type="rowData.patientId?'edit':'add'"
    :data="rowData"
    @close="hideDialog"
    v-if="showDialog"
  />
</template>

<script>
import paper from './_paper.vue'
import addTestee from '../testee/_addTestee.vue'
export default {
  components: { paper, addTestee },
  provide () {
    return {
      testTarget: () => this
    }
  },
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
        // { text: '入组', click: row => this.onBtn(row, 'join'), condition: row => !row.groupName },
        // { text: '排除', click: row => this.onBtn(row, 'exclude'), condition: row => !!row.groupName },
        { text: '完成', click: row => this.onBtn(row, 'finish') },
        { text: '中止', click: row => this.onBtn(row, 'stop') },
        { text: '脱落', click: row => this.onBtn(row, 'falloff') },
        { text: '签名', click: row => this.onBtn(row, 'signature') },
        { text: '上传文件', click: row => this.onBtn(row, 'upload') }
      ],
      activeStage: '',
      activeQuestionnaire: [],
      rowData: {},
      showDialog: false
    }
  },
  async created () {
    window.Y = this
    await this.init()
  },
  methods: {
    async init () {
      let patient = await this.getList(this.$route.query.patientId)
      await this.getPatientInfo(patient)
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
    async onBtn (row, type) {
      this.rowDate = row
      switch (type) {
        case 'CRF':
          this.$router.push('/crf?patientId=' + row.id)
          break;
        case 'edit':
          this.rowData = row
          console.log(row, type);
          this.showDialog = true
          break;
        // case 'join':
        // case 'exclude':
        case 'filter':
        case 'filterInfo':
          this.screeningType = type
          this.screeningDialog = true
          console.log(row, type);
          break;
        case 'signature':
        case 'finish':
        case 'stop':
        case 'falloff':
          await this.request(this.api.andrology.patient[type], row)
          break;
        case 'upload':
          this.uploadFileDialog = true
          break;
        case 'del':
          await this.request(this.api.andrology.patient.deletePatient, row)
          await this.getList()
          break;
      }
    },
    async getPatientInfo (params = this.patientList[0].children[0]) {
      this.ready = false
      this.patientId = params.patientId
      this.patientInfo = (await this.request(this.api.andrology.crf.getPatientInfo, params)).data
      this.activeStage = this.patientInfo.stageList[0].stageId
      this.activeQuestionnaire = this.patientInfo.stageList.map(({ questionnaireList }) => questionnaireList[0].questionnaireTypeId)
      this.ready = true
    },
    async hideDialog () {
      if (this.rowData.patientId) await this.getPatientInfo(this.rowData)
      this.rowData = {}
      this.showDialog = false
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
              questionnaireTypeId,
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
      return await this.init()
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

