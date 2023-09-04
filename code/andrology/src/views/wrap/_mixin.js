import headerBar from './components/header.vue'
import Submenu from './components/_submenu.vue'
import menu from './menu.js'
import projectMenu from './projectMenu.js'
export default {
  components: { headerBar, Submenu },
  provide () {
    return {
      system: () => this.system,
      systems: this.systems,
      menuList: this.menuList
    }
  },
  data () {
    return {
      system: '',
      systems: [],
      ready: false,
      menuList: [],
      activeTab: '',
      curPath: this.$route.path,
      tabList: this.$store.state.common.tabList || []
    }
  },
  watch: {
    $route (to, from) {
      console.log(to.path, from.path)
      this.tabAdd(to.path)
    }
  },
  async created () {
    // 判断菜单权限 todo

    // this.userInfo = this.globalData.userInfo = JSON.parse(_userInfo)
    // if (this.userInfo.logout) return this.$router.push('/login')
    // if (!this.userInfo.id) {
    //   this.$router.push('/login')
    //   this.$message.error({ duration: 3000, message: '用户凭证异常，请联系工作人员' })
    //   return
    // }

    // this.globalData.headers = { openid: this.userInfo.id, unionid: this.userInfo.wxUnionid }

    // if (!this.globalData.studioList.length) return this.$confirm('没有查询到工作室记录，请联系工作人员', '提示', {
    //   confirmButtonText: '我知道了',
    //   type: 'warning'
    // }).then(async () => {
    //   this.$router.push('/login')
    // }).catch(() => { this.$router.push('/login') })

    // this.globalData.studioId = localStorage.studioId || this.globalData.studioList[0].id

    // await this.init()
  },
  methods: {
    async init (path = this.curPath) {
      if (this.$route.path.startsWith('/projectCenter')) {
        this.menuList.push(...projectMenu)
        this.systems[0] = {
          title: '基础信息',
          name: '基础信息',
          path: '/projectCenter/info',
          icon: 'el-icon-s-home',
          theme: '#2d1e02',
          menuId: '01'
        }
      } else {
        this.menuList.push(...menu)
        this.systems[0] = {
          title: '项目运行情况',
          name: '项目运行情况',
          path: '/index/operationInfo',
          // theme: '#43a7ff',
          menuId: '01'
        }
      }
      this.globalData.pagination = {
        currentPage: 1,
        pageSizes: [20, 50, 100, 200],
        pageSize: 20,
        layout: 'total, sizes, prev, pager, next, jumper'
      }
      this.globalData.tabAdd = this.tabAdd

      // 重置tabList
      this.$store.commit('changeTabList', { 'mode': 'clear' })

      // 设置当前系统值
      this.$store.commit('changeSystem', path)

      // 设置当前系统主题颜色
      let nowSystem = this.systems.find(item => path.indexOf(item.path) === 0)
      this.system = nowSystem.path
      if (nowSystem.theme) document.documentElement.style.setProperty('--theme-color', nowSystem.theme)

      // 设置tabList
      this.tabAdd(path)
      this.tabList = this.$store.state.common.tabList || []
      // this.$router.push(this.curPath)
      // this.globalData.paperType = JSON.parse((await this.request(this.api.ums.sysDict.questionnaire.paperType)).data.description)

      this.ready = true
    },
    async tabClick (tab) {
      let activeTab = this.activeTab
      if (!this.globalData.confirmMsg) return this.$router.push(this.tabList[tab.index].path)
      let _confirm = await this.$confirm(this.globalData.confirmMsg).catch(() => '')
      if (_confirm) {
        this.$router.push(this.tabList[tab.index].path)
        delete this.globalData.confirmMsg
      }
      else this.activeTab = activeTab
    },
    tabRemove (name) {
      let delTabIndex = this.tabList.findIndex(item => item.name === name)
      let data = this.tabList[delTabIndex]

      this.$store.commit('changeTabList', { mode: 'del', data })

      let _index = delTabIndex >= this.tabList.length ? this.tabList.length - 1 : delTabIndex
      let preRouter = this.tabList[_index]
      this.activeTab = preRouter.name
      this.$router.push(preRouter.path)
    },
    tabAdd (path) {
      let list = []
      this.menuList.forEach(item => {
        this.libs.object.treeToList(item, list)
      })
      let addTabObj = list.find(item => item.path === path)
      let data = { mode: 'add', data: addTabObj }
      this.$store.commit('changeTabList', data)
      this.activeTab = addTabObj.name
    }
  }
}
