<template>
  <div
    class="project"
    v-if="ready"
  >
    <el-row
      type="flex"
      align="middle"
      class="topbar"
      style="padding-top: 10px"
    >
      <el-col
        :span="20"
        class="topbarTitle"
      >
        我的项目
      </el-col>
      <el-col
        v-if="globalData.userInfo.canCreateProject==='Y'"
        :span="4"
        class="btnGroup"
      ><button
          class="primary"
          @click="showDialog=true"
        >发起新项目</button></el-col>
    </el-row>
    <div class="list">
      <div
        class="item"
        v-for="item in list"
        :key="item.id"
      >
        <dl>
          <dt>项目名称</dt>
          <dd>{{item.projectName}}</dd>
          <!-- <dt>创建时间</dt>
          <dd>{{item.time}}</dd> -->
          <dt>项目描述</dt>
          <dd class="description">{{item.projectDesc}}</dd>
        </dl>
        <div class="btnGroup">
          <el-button
            size="large"
            class="plain"
            @click="goPage(item,'/index/operationInfo')"
          >进入项目</el-button>
          <template v-if="item.canManage">
            <el-button
              size="large"
              @click="delProject(item)"
            >删除项目</el-button>
            <el-button
              size="large"
              @click="switchState(item)"
            >{{item.projectState==='暂停'?'启动项目':'暂停项目'}}</el-button>
            <el-button
              size="large"
              @click="goPage(item,'/projectCenter/info')"
            >项目配置</el-button>
          </template>
        </div>
      </div>
    </div>
    <add-project
      title="发起新项目"
      @close="hideDialog"
      @refresh="getList"
      v-if="showDialog"
    />
  </div>
</template>

<script>
import addProject from './_addProject.vue'
export default {
  components: { addProject },
  data () {
    return {
      ready: false,
      list: [],
      showDialog: false
    }
  },
  async created () {
    sessionStorage.clear()
    this.globalData.headers.projectCode = ''
    await this.getList()
  },
  methods: {
    async getList () {
      this.list = (await this.request(this.api.andrology.projectMgt.getProjectList)).data
      this.ready = true
    },
    hideDialog () { this.showDialog = false },
    goPage ({ projectCode, projectName, projectState }, path) {
      let routeData = this.$router.resolve({ path, query: { projectCode, projectName, projectState } })
      this.globalData.userInfo.beforeunload = new Date() - 0
      this.libs.data.setStorage('userInfo', JSON.stringify(this.globalData.userInfo))
      window.open(routeData.href, '_blank')
    },
    async delProject ({ projectCode }) {
      await this.request(this.api.andrology.projectMgt.deleteProject, {}, { headers: { ...this.globalData.headers, projectCode } })
      await this.getList()
    },
    async switchState ({ projectState, projectCode }) {
      await this.request(this.api.andrology.projectMgt[projectState === '暂停' ? 'startProject' : 'stopProject'], {}, { headers: { ...this.globalData.headers, projectCode } })
      await this.getList()
    }
  }
}
</script>
<style lang="scss" scoped>
.project {
  width: 90%;
  margin: auto;
  box-sizing: border-box;
  .list {
    display: grid;
    justify-content: space-between;
    grid: auto / auto auto auto;
    gap: 20px;
    .item {
      width: 28vw;
      padding: 20px;
      border: var(--border-normal);
      box-sizing: border-box;
      background-color: #fff;
      dl {
        display: grid;
        grid: auto / 20% auto;
        gap: 10px 0;
        dt {
          color: var(--color-tips);
        }
        dd {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          &.description {
            height: 3.6em;
            margin-bottom: 30px;
            white-space: pre-wrap;
            line-height: 1.8;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
      }
      .btnGroup {
        flex-direction: row-reverse;
      }
    }
  }
}
</style>