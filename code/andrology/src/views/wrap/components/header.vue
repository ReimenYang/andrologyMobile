<template>
  <el-row
    type="flex"
    align="middle"
    style="height: 100%"
  >
    <el-col :span="2">
      <div
        class="iconfont menuCollapseBtn"
        :class="[$store.state.common.menuIsCollapse ? 'icon-right' : 'icon-left']"
        @click="menuCollapse"
      />
    </el-col>
    <el-col
      :span="19"
      class="selectStudio"
    >{{ projectName }}
      <!-- 
        当前工作室
        <el-select
        class="systemSelect"
        v-model="studioId"
        placeholder="请选择"
        @change="studioSelect"
      > -->
      <!-- <el-option v-for="item in studioList" :key="item.id" :label="item.studioName" :value="item.id" /> -->
      <!-- </el-select> -->
    </el-col>
    <!-- <el-col :span="4">
      <span class="userName">您好， {{ userInfo.phone }}</span>
      <el-button
        type="primary"
        plain
      >退 出</el-button>
    </el-col> -->
    <el-col :span="3">
      <el-dropdown>
        <div class="el-dropdown-link">
          您好， {{ userInfo.userName }}
          <i class="iconfont icon-right" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="showDialog=true">个人信息</el-dropdown-item>
            <el-dropdown-item>修改密码</el-dropdown-item>
            <el-dropdown-item @click="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-col>
    <user-info
      v-if="showDialog"
      type='edit'
      title="个人信息"
      @close="hideDialog"
    />
  </el-row>
</template>

<script>
import userInfo from '@/views/user/_userInfo.vue'
export default {
  components: { userInfo },
  // inject: ['systems', 'system'],
  data () {
    return {
      showDialog: false,
      userInfo: {},
      // nowSystem: this.system(),
      studioList: [],
      studioId: '',
      headers: {},
      projectName: ''
    }
  },
  async created () {
    await this.$root.checkLogin()
    this.userInfo = this.globalData.userInfo
    this.$emit('init')
    this.projectName = this.$route.query.projectName || sessionStorage.projectName
  },
  methods: {
    studioSelect (studioId) {
      this.globalData.studioId = localStorage.studioId = studioId
      location.reload()
    },
    logout () {
      this.userInfo.beforeunload = ''
      this.userInfo.loginToken = ''
      sessionStorage.clear()
      this.libs.data.setStorage('userInfo', JSON.stringify(this.userInfo))
      // 根据用户角色判断跳转路径 todo
      let url = location.href.split('#')[0] + `#/${this.userInfo.projectCode ? 'user' : 'admin'}/login`
      history.pushState(null, null, url);
      window.addEventListener('popstate', function () {
        history.pushState(null, null, url);
      });

      location.replace(url)
      // history.replaceState(null, '', url)
      // history.go(0)
      // this.$router.push('/login')
    },
    hideDialog () {
      this.showDialog = false
    },
    menuCollapse () {
      this.$store.commit('changeMenuIsCollapse')
    }
  }
}
</script>

<style scoped lang="scss">
.systemSelect {
  flex: 1;
}

.el-dropdown-link {
  cursor: pointer;
  color: #fff;
}

.menuCollapseBtn {
  margin-left: 0.5rem;
  color: #fff;
}

.selectStudio {
  color: #fff;

  :deep(.el-select) {
    width: 20em;
    margin: 0 10px;
  }
}

.userName {
  padding-right: 20px;
  color: #fff;
}
</style>
