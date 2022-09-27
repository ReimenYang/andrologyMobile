<template>
  <image
    v-if="target.showModal==='bg'"
    style="width:100%"
    :src="target.bg"
    mode="widthFix"
    @click="jumpTo"
  />
</template>

<script>
export default {
  props: {
    setting: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      config: {
        ble: {
          title: '杉山低频神经肌肉治疗仪下载',
          ios: 'https://apps.apple.com/cn/app/id1526096144',
          android: 'https://sapi.xinuowang.com:9000/product-public/donwload/ble/lastest.apk',
          app: 'https://a.app.qq.com/o/simple.jsp?pkgname=com.shanshan.ble',
          bg: 'https://sapi.xinuowang.com:9000/product-public/donwload/ble/downBg.jpg'
        },
        consume: {
          title: '优E康app下载',
          // ios: 'https://apps.apple.com/cn/app/id1526096144',
          android: 'https://sapi.xinuowang.com:9000/product-public/donwload/consume/lastest.apk',
          // app: 'https://a.app.qq.com/o/simple.jsp?pkgname=com.shanshan.ble',
          bg: 'https://sapi.xinuowang.com:9000/product-public/donwload/consume/downBg.jpg'
        }
      },
      target: {}
    }
  },
  created () {
    this.target = {
      ...this.config[this.setting.type],
      type: 'ble',
      showModal: 'bg',
      from: 'web',
      isForce: 'N',
      ...this.setting
    }
    let { showModal, from } = this.target
    if (from === 'web') uni.setNavigationBarTitle({ title: this.target.title })
    if (showModal === 'dialog') this.showModal()
  },
  methods: {
    showModal () {
      uni.showModal({
        title: '更新提示',
        content: '新版本已上线，请点击更新',
        confirmText: '更新',
        showCancel: this.target.isForce === 'N',
        success: res => {
          if (res.confirm) this.jumpTo()
          if (res.cancel) this.$emit('onCancel')
        }
      })
    },
    jumpTo () {
      let platform = uni.getSystemInfoSync().platform
      let url = this.target[platform] + '?timeStamp=' + new Date().valueOf()
      // #ifdef APP-PLUS
      plus.runtime.openURL(url)
      // #endif
      // #ifdef H5
      if (platform !== 'ios' && navigator.userAgent.match('MicroMessenger')) return location.href = this.target.app
      location.href = url
      // #endif
    }
  }
}
</script>
