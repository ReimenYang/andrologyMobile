<template>
  <el-container class="wrap">
    <el-container>
      <el-header
        class="headerBar"
        height="var(--header-height)"
      >
        <el-row
          type="flex"
          align="middle"
          style="height: 100%"
        >
          <el-col
            :span="4"
            class="menuTitle"
          >
            {{ libs.configProject.name }}
          </el-col>
          <el-col :span="20"><header-bar /></el-col>
        </el-row>
      </el-header>
      <el-main class="mainBox">
        <router-view />
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
import headerBar from './components/header.vue'
export default {
  name: 'NoMenu',
  components: { headerBar },
  async created () {
  }
}
</script>
<style lang="scss" scoped>
@import "./style.scss";
.menuTitle {
  text-align: center;
  color: #fff;
}
:deep(.menuCollapseBtn) {
  display: none;
}
</style>