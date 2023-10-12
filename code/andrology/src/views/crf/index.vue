<template>
  <el-container class="crf">
    <el-aside class="aside">
      <div style="padding: 10px 20px;border-bottom: var(--border-normal);">
        <el-input
          v-model="filterText"
          placeholder="请输入姓名或编号"
        />
        <el-checkbox-group v-model="stateFilter">
          <el-checkbox
            v-for="item in patientState"
            :key="item.label"
            :label="item.label"
            style="width: 50%;margin-right: 0;padding-right: 10px;box-sizing: border-box;"
          >
            <div :style="{fontSize: 'var(--font-h5)',color:item.color}">{{ item.label }}</div>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div style="height: calc(100% - 150px); overflow-y:scroll;">
        <el-tree
          ref="treeRef"
          class="filter-tree"
          :data="patientList"
          :default-expanded-keys="[patientId]"
          node-key="patientId"
          :props="{...defaultProps,class:setActiveNodeClass}"
          :filter-node-method="filterNode"
          @node-click="clickTree"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span
                v-if="data.patientState"
                class="tag"
                :style="{color:data.color}"
              >{{ data.patientState }}</span>
              <span>{{ node.label }}</span>
            </span>
          </template>
        </el-tree>
      </div>

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
          <template #title>
            <span style="font-size: var(--font-h4);">{{ stage.stageName }}</span>
          </template>
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
        v-if="projectState"
        class="submitBtn"
        type="primary"
        @click="onSave"
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
    title="编辑受试者"
    type="edit"
    :data="patientInfo"
    @close="hideDialog"
    v-if="showDialog"
  />
  <upload-file
    title="上传文件"
    @close="hideDialog"
    :date="patientInfo"
    v-if="uploadFileDialog"
  />
  <screening-info
    :title="screeningTitle"
    @close="hideDialog"
    @refresh="init"
    :date="rowData"
    v-if="screeningDialog"
  />
</template>

<script>
import paper from './_paper.vue'
import questionMixin from '@/views/crf/questionMixin.js'
import testeeMixin from '../testee/testeeMixin'
import screeningInfo from '../testee/_screeningInfo.vue'
export default {
  mixins: [questionMixin, testeeMixin],
  components: { paper, screeningInfo },
  provide () {
    return {
      testTarget: () => this
    }
  },
  data () {
    return {
      ready: false,
      projectState: sessionStorage.projectState === '已开始',
      filterText: '',
      stateFilter: [],
      defaultProps: {
        label: 'label',
        children: 'children'
      },
      patientList: [],
      patientId: '',
      patientState: [
        { color: '#df6b66', label: '未入组' },
        { color: '#209cdd', label: '已入组' },
        { color: '#5bb75b', label: '完成' },
        { label: '排除' },
        { label: '脱落' },
        { label: '中止' },
      ],
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
      btnList: [],
      activeStage: '',
      activeQuestionnaire: [],
    }
  },
  watch: {
    filterText: function () {
      this.$refs.treeRef.filter(this.filterText)
    },
    stateFilter: function () {
      this.$refs.treeRef.filter(this.stateFilter)
    }
  },
  async created () {
    window.Y = this
    this.btnList = this.btnListJson.btnList
    await this.init()
  },
  methods: {
    async init () {
      let patient = await this.getList(this.$route.query.patientId || this.patientId)
      console.log(patient);
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
          item.color = this.patientState.find(({ label }) => label === item.patientState).color
          return item.organizationId === organizationId
        })
      }))
      return list.find(patient => patient.patientId === patientId - 0) || this.patientList[0].children[0]
    },
    async getPatientInfo (params) {
      this.ready = false
      this.patientId = params.patientId
      this.patientInfo = (await this.request(this.api.andrology.crf.getPatientInfo, params)).data
      if (!this.activeStage) this.activeStage = this.patientInfo.stageList[0].stageId
      this.activeQuestionnaire = this.patientInfo.stageList.map(({ questionnaireList }) => questionnaireList[0].questionnaireTypeId)
      this.ready = true
    },
    setActiveNodeClass (object) {
      return this.patientId === object.patientId ? 'active' : ''
    },
    filterNode (value, data) {
      console.log(value, data);
      if (!value.length) return true
      let { patientState, label, patientCode } = data
      switch (typeof value) {
        case 'object':
          return value.includes(patientState)
        case 'string':
          return [label, patientCode].join().includes(value)
      }
    },
    async clickTree (object) {
      if (!object.patientId) return
      await this.getPatientInfo(object)
    },
    async onSave () {
      await this.save(this.patientInfo)
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
.tag {
  width: 50px;
  margin-right: 5px;
  line-height: 20px;
  display: inline-block;
  border: 1px solid;
  border-radius: 5px;
  font-size: 12px;
  text-align: center;
  &::before {
    font-size: 16px;
    vertical-align: middle;
  }
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
  background-color: var(--color-placeholder);
  border-color: var(--theme-color);
  color: var(--theme-color);
  font-weight: bold;
}
.submitBtn {
  margin: 20px auto;
  display: block;
}
</style>

