<template>
  <el-container class="wrap">
    <el-aside
      :width="$store.state.common.menuIsCollapse ? 'auto' : 'var(--nav-width)'"
      v-if="ready"
    >
      <submenu
        @tabAdd="tabAdd"
        :title="libs.configProject.name"
      />
    </el-aside>
    <el-container>
      <el-header
        class="headerBar"
        height="var(--header-height)"
      >
        <header-bar @init="init" />
      </el-header>
      <el-main
        class="mainBox"
        v-if="ready"
      >
        <el-tabs
          class="tabBox"
          v-model="activeTab"
          type="card"
          :closable="tabList.length > 1"
          @tab-click="tabClick"
          @tab-remove="tabRemove"
        >
          <el-tab-pane
            class="hideTabPage"
            :key="item.name"
            v-for="item in tabList"
            :label="item.title"
            :name="item.name"
          />
        </el-tabs>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import mixin from './_mixin.js'
export default {
  name: 'Index',
  mixins: [mixin],
  data () {
    return {
    }
  }
}
</script>

<style scoped lang="scss">
@import "./style.scss";
</style>
