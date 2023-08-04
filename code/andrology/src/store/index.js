import { createStore } from 'vuex'

let modules = {
  common: {
    state: {
      menuIsCollapse: false,
      tabList: [],
      system: '',
    },
    mutations: {
      changeMenuIsCollapse (state) {
        state.menuIsCollapse = !state.menuIsCollapse
      },
      changeTabList (state, obj) {
        let mode = obj.mode, data = obj.data || {}
        let hasRepeat = state.tabList.find(item => item.path === data.path)
        if (mode === 'add' && !hasRepeat) state.tabList.push(data)
        if (mode === 'del') {
          let delIndex = state.tabList.findIndex(item => item.path === data.path)
          state.tabList.splice(delIndex, 1)
        }
        if (mode === 'clear') state.tabList = []
      },
      changeSystem (state, value) {
        state.system = value
      }
    }
  }
}

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules
})
