<template>
  <div>
    <el-menu-item
      v-if="type==='menu'"
      :index="datas.path"
      :style="active===datas.path?this.activeStyle:this.defaultStyle"
    >
      <i
        :class="[datas.icon?datas.icon:'el-icon-s-platform']"
        :style="active===datas.path?this.activeStyle:'color:#909399;'"
      />
      <template #title>
        {{ datas.title }}
      </template>
    </el-menu-item>
    <!-- 新版本里面有警告 -->
    <!-- <el-submenu
      v-if="type==='tree'"
      :index="datas.path"
    >
      <template #title>
        <i :class="[datas.icon?datas.icon:'el-icon-s-platform']" />
        <span v-if="!$store.state.common.menuIsCollapse">{{ datas.title }}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item
          v-for="item in datas.children"
          :key="datas.id+item.id"
          :index="item.path"
          :style="active===item.path?this.activeStyle:this.defaultStyle"
        >
          {{ item.title }}
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu> -->
  </div>
</template>

<script>
export default {
  props: {
    datas: {
      type: Object,
      default () { return {} }
    },
    type: {
      type: String,
      default: ''
    },
    activeStyle: {
      type: String,
      default: 'color: var(--theme-color);'
    },
    defaultStyle: {
      type: String,
      default: 'color: #303133;'
    }
  },
  computed: {
    active () {
      return this.$route.path
    }
  },
}
</script>

<style lang="scss" scoped>
:deep(.iconfont) {
  font-size: var(--font-h2);
  margin-right: 10px;
}
</style>
