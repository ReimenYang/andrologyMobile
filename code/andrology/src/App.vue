<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script>
import { defineComponent } from 'vue'
import { ElConfigProvider } from 'element-plus'

import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
export default defineComponent({
  name: 'App',
  components: {
    ElConfigProvider,
  },
  setup () {
    return {
      locale: zhCn,
    }
  },
  data () {
    return {
      ready: false
    }
  },
  // 在实例初始化之后，数据观测（data observer）和event/watcher事件配置之前被调用
  beforeCreate () {
    console.log('beforeCreate')
  },
  // 在实例创建完成后被立即调用。在这一步，实例已完成以下配置：数据观测（data observer）
  // 属性和方法的运算，watch/event事件回调。但是，挂载阶段还没开始，$el属性目前不可见
  created () {
    console.log('created')
  },
  // 在挂载开始之前被调用：相关的编译函数首次被调用
  beforeMount () {
    console.log('beforeMount')
  },
  // el被新创建的vm.$el替换，挂载成功
  async mounted () {
    console.log('mounted')
    window.addEventListener("beforeunload", () => {
      try {
        this.globalData.userInfo.beforeunload = new Date() - 0
        this.libs.data.setStorage('userInfo', JSON.stringify(this.globalData.userInfo))
      } catch (e) {
        console.log(e);
      }
    });
  },
  // 数据更新时调用
  beforeUpdate () {
    console.log('beforeUpdate')
  },
  // 组件DOM已经更新，组件更新完毕
  updated () {
    console.log('updated')
  },
  beforeUnmount () {
    console.log('beforeUnmount')
  },
  unmounted () {
    console.log('unmounted')
  },
  // destroyed () {
  //   console.log('destroy')
  // },
  methods: {
    async checkLogin () {
      let _userInfo = this.libs.data.getStorage('userInfo')
      if (!_userInfo) return this.$router.push('/admin/login')
      this.globalData.userInfo = JSON.parse(_userInfo)
      let { beforeunload, loginToken, projectCode } = this.globalData.userInfo
      console.log(new Date() - beforeunload, (new Date() - beforeunload > 3 * 1000), !loginToken);

      if ((new Date() - beforeunload > 3 * 1000) || !loginToken) {
        // 根据用户角色判断跳转路径 todo
        let url = location.href.split('#')[0] + `#/${projectCode ? ('user/login?projectCode=' + projectCode) : 'admin/login'}`
        history.pushState(null, null, url);
        window.addEventListener('popstate', function () {
          history.pushState(null, null, url);
        });

        location.replace(url)
        return
      }
      this.globalData.headers = { token: loginToken, projectCode: sessionStorage.projectCode || '' }
      if (!sessionStorage.projectCode) return
      this.globalData.orgList = (await this.request(this.api.andrology.projectMgt.getProjectOrgList)).data
      this.globalData.groupList = (await this.request(this.api.andrology.projectMgt.getProjectGroupList)).data
    }
  }
})
</script>

<style lang="scss">
@import "./assets/css/reset.scss";
@import "./assets/fonts/iconfont.css";
@import "//at.alicdn.com/t/font_2308054_fi39pku6shj.css";
#app {
  height: 100%;
}
.btn {
  margin: 0 10px;
  font-size: 16px;
  border-color: var(--theme-color);
}

.primary {
  background-color: var(--theme-color);
  color: var(--color-white);
}
.plain {
  background-color: var(--color-plain);
  color: var(--theme-color);
}
.formFooter {
  margin: 10px;
  display: flex;
  justify-content: center;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 10px;
  .topbarTitle {
    font-size: 18px;
  }
  .btnGroup {
    display: block;
    text-align: right;
    button {
      margin: 0 0 0 10px;
    }
  }
}
</style>