<template>
  <view class="menu">
    <xnw-nav
      :list="menu.list"
      :defaultIndex="defaultIndex"
      :activeStyle="menu.activeStyle"
      @onClick="onClick"
    />
  </view>
</template>
<script>
export default {
  props: {
    defaultIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      menu: {
        list: [
          { txt: '受试者管理', icon: 'yaoxiang', url: '/testee/index' },
          { txt: '受试者CRF', icon: 'baogao', url: '/crf/index' }
        ],
        activeStyle: `
        color: var(--theme-color);
        // font-weight: bold;
        `
      }
    }
  },
  methods: {
    onClick ({ url }) {
      console.log(url)
      uni.reLaunch({ url })
    }
  },
  // #ifdef MP-WEIXIN
  options: {
    styleIsolation: 'shared'
  }
  // #endif
}
</script>
<style lang="scss" scoped>
.menu {
  height: 120rpx;
  line-height: 120rpx;
  border-top: var(--border-normal);
  box-sizing: border-box;
  background-color: #fff;
}
/deep/ .list .item {
  padding: 10rpx 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  color: var(--color-light);
  .iconfont {
    font-size: 48rpx;
  }
}
</style>
