<template>
  <el-scrollbar class="_submenu">
    <div class="menuTitle">
      {{ title }}
    </div>
    <el-menu
      :collapse="$store.state.common.menuIsCollapse"
      :defaultActive="$route.path"
      @select="updateTabList"
      router
    >
      <submenu-item
        v-for="(item,index) in systemMenu"
        :key="'tree'+index"
        :datas="item"
        :type="item.type"
      />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import submenuItem from './submenuItem.vue'
export default {
  components: { submenuItem },
  inject: ['systems', 'menuList'],
  props: {
    title: {
      type: String,
      default: '后台管理系统'
    }
  },
  computed: {
    system () {
      return this.$store.state.common.system
    }
  },
  watch: {
    system: {
      immediate: true,
      handler: function () {
        this.getSubmenuList()
      }
    },
  },
  data () {
    return {
      systemMenu: [],
    }
  },
  methods: {
    getSubmenuList () {
      // let menuId = this.systems.find(item => this.system.indexOf(item.path) === 0).menuId
      let menuId = '01'
      this.systemMenu = this.menuList.filter(item => item.menuId === menuId)
    },
    updateTabList (path) {
      this.$emit('tabAdd', path)
    }
  }
}
</script>

<style scoped lang="scss">
._submenu .el-menu {
  min-height: calc(100vh - 3.6rem);
}
.menuTitle {
  position: sticky;
  top: 0;
  z-index: 500;
  width: 100%;
  height: 3.6rem;
  line-height: 3.6rem;
  text-align: center;
  color: #fff;
  background: var(--theme-color);
}
</style>
