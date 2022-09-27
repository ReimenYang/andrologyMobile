<template>
  <view
    class="wrapBox"
    :style="{'--theme-color':globalData.config.theme}"
  >
    <p-wrap :hasFooter="true">
      <view class="itemBox">
        <view class="itemTitle">
          请开启设备电源以连接蓝牙
        </view>
        <image
          class="guide"
          :src="globalData.config.guideConnect"
          mode="widthFix"
        />
      </view>
      <connect-ble @onSelect="nextStep" />
    </p-wrap>
    <xnw-footer
      textConfirm="连接"
      :showCancel="false"
      @onConfirm="nextStep"
    />
  </view>
</template>
<script>
import mixinBLE from '@/pages/index/mixinBLE.js'
import connectBle from '@/pages/bluetooth/_connect'
export default {
  mixins: [mixinBLE],
  components: { connectBle },
  data () {
    return {
      nextTo: '/pages/scheme/index'
    }
  },
  async onLoad (option) {
    console.log(this.globalData.config.guideConnect)
    this.globalData.handlePair = this.pageHandlePair
    this.nextTo = option.nextTo || '/pages/scheme/index'
    setTimeout(() => {
      if (this.bleReady) this.bleSearch()
    }, 500)
  },
  beforeDestroy () {
    this.stopSearch()
    // delete this.globalData.handlePair
  },
  methods: {
    async nextStep () {
      console.log('开始链接')
      this.globalData.handlePair = this.pageHandlePair
      uni.showLoading({
        title: '连接中...',
        mask: true
      })
      this.stopSearch()
      // 保存设备信息，方便其他地方调用
      // this.globalData.device = this.device
      // this.libs.data.setStorage('device', this.globalData.device)
      let res = await this.connectDevice()
      if (res.statusCode !== 200) return this.toast('连接失败')
    },
    pageHandlePair (boolean) {
      console.log('链接配对跳转', this.nextTo)
      if (boolean) uni.redirectTo({ url: this.nextTo })
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapBox {
  height: 100vh;
  padding: 0 20rpx 20rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .guide {
    width: 100%;
    padding-top: 20rpx;
  }
}
</style>
