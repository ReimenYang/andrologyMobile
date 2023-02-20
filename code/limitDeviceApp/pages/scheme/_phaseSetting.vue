<template>
  <view class="phaseSetting">
    <view>{{ setting.channel }}通道-阶段{{ setting.phase }}程序设置</view>
    <xnw-from
      :config="setting"
      ref="phaseSetting"
    />
    <view class="btnGroup fix">
      <view
        class="btn"
        @click="onCancel"
      >
        取消
      </view>
      <view
        class="btn primary"
        @click="onConfirm"
      >
        确定
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    setting: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    onCancel () {
      this.$emit('onCancel')
    },
    onConfirm () {
      let hasError = []
      this.setting.data.forEach(item => {
        let frequency = item
        let pulseWidth = {}
        let needCheck = false
        if (item.key.startsWith('frequency')) {
          pulseWidth = this.setting.data.find(obj => obj.key === ('pulseWidth' + (item.key[9] || '')))
          needCheck = item.key === 'frequency' || frequency.input.value || pulseWidth.input.value
        }
        if (!needCheck) return
        hasError.push(frequency.input.input('', frequency))
        hasError.push(pulseWidth.input.input('', pulseWidth))
      })
      if (hasError.includes(false)) return
      let params = this.$refs.phaseSetting.getFromData()
      params.waveform = params.waveform[0].value
      for (let key in params) params[key] = Number(params[key] || 0)
      params.channel = params.channelID = this.setting.channelID
      params.channelName = this.setting.channelName
      params.phase = this.setting.phase
      this.$emit('onConfirm', params)
    }
  }
}
</script>
<style lang="scss" scoped>
.phaseSetting {
  padding: 30rpx;
  /deep/ {
    .form {
      .title {
        width: 10em;
      }
      .radio .label {
        display: block;
      }
    }
  }
}
</style>
