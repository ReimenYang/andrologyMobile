<template>
  <view
    class="wrapBox themeBg"
    :style="{'--theme-color':globalData.config.theme}"
  >
    <p-header
      backIcon="show"
      title="准备治疗"
    />
    <p-wrap
      :hasHeader="true"
      :hasFooter="true"
    >
      <!-- <p-steps :active="1" /> -->
      <view class="item">
        <view class="itemTitle">
          请按示意图贴片
        </view>
        <image
          :src="imageList[index].url"
          class="swiperImg"
          mode="widthFix"
        />
      </view>
    </p-wrap>
    <xnw-footer
      textConfirm="下一步"
      textCancel="上一步"
      @onConfirm="nextStep"
      @onCancel="prevStep"
    />
  </view>
</template>
<script>
import mixinBLE from '@/pages/index/mixinBLE.js'
export default {
  mixins: [mixinBLE],
  data () {
    return {
      imageList: [],
      index: 0
    }
  },
  onShow () {
    let channel = this.globalData.pasteChannel
    this.imageList = this.globalData.workout.imageList
      .filter(item => item.channel === channel)
      .map(item => item.imageUrl)
      .join().split(',').map(url => ({ url }))
  },
  onBackPress () {
    this.endTreatment()
    delete this.globalData.handleLongRecived
    delete this.globalData.deviceState
  },
  methods: {
    nextStep () {
      if (this.index + 1 < this.imageList.length) return this.index++
      uni.redirectTo({ url: '/pages/bluetooth/setCurrent' })
    },
    prevStep () {
      if (1 < this.index) return this.index--
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
  .item {
    margin-bottom: 20rpx;
    padding: 20rpx;
    border-radius: var(--border-radius);
    background: #fff;
    font-size: var(--font-h35);
    line-height: 3;
    .itemTitle {
      font-size: var(--font-h4);
      line-height: 1.5;
      color: var(--theme-color);
    }
  }
  .swiperImg {
    width: 100%;
  }
  .btn {
    height: 140rpx;
    padding: 0 20rpx;
    display: flex;
    align-items: center;
    border-top: var(--border-normal);
    background: #fff;
  }
}
</style>
