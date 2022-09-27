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
      <!-- <p-steps :active="2" /> -->
      <view class="itemBox">
        <view class="itemTitle">
          {{ `电极口${pasteChannel*2-1}：请设置刺激强度` }}
        </view>
        <xnw-number
          v-model="firstPhase.settingCHL"
          :min="0"
          :max="900"
          :step="step"
          @change="n => currentChange(n,'settingCHL')"
          :typeDisabled="true"
        />
      </view>
      <view
        class="itemBox"
        v-if="portNum===2"
      >
        <view class="itemTitle">
          {{ `电极口${(pasteChannel)*2}：请设置刺激强度` }}
        </view>
        <xnw-number
          v-model="firstPhase.settingCHR"
          :min="0"
          :max="900"
          :step="step"
          @change="n => currentChange(n,'settingCHR')"
          :typeDisabled="true"
        />
      </view>
    </p-wrap>
    <xnw-footer
      textConfirm="下一步"
      :showCancel="false"
      @onConfirm="nextStep"
    />
  </view>
</template>
<script>
import mixinBLE from '@/pages/index/mixinBLE.js'
export default {
  mixins: [mixinBLE],
  data () {
    return {
      phaseList: [{ left: 0, right: 0, phaseSeqNo: 1 }],
      portNum: 2,
      step: 5,
      index: 1,
      firstPhase: { settingCHL: 0, settingCHR: 0 },
      showModal: false,
      pasteChannel: this.globalData.pasteChannel
    }
  },
  async onLoad () {
    uni.showLoading({
      title: '请等待..',
      mask: true
    })
    this.globalData.handleLongRecived = this.handleLongRecived
    this.portNum = this.globalData.workout.portNum || this.globalData.workout.channelList.find(item => item.channel === this.pasteChannel).splices
    // 获取硬件的最后一个治疗程序的状态
    // this.getRecord()
  },
  onShow () {
    this.firstPhase = { settingCHL: 0, settingCHR: 0 }
  },
  onBackPress () {
    this.endTreatment()
    delete this.globalData.handleLongRecived
    delete this.globalData.deviceState
  },
  methods: {
    currentChange (n, side) {
      let channel = this.pasteChannel
      let deviceState = this.globalData.deviceState[channel]
      let value = deviceState[side]
      console.log(channel, n, value)
      if (n - value < 0) side === 'settingCHL' ? this.leftMinus(channel) : this.rightMinus(channel)
      if (value - n < 0) side === 'settingCHL' ? this.leftPlus(channel) : this.rightPlus(channel)
      // 修改设备指定通道强度，防止界面跳动，如果s指令返回值不一样，还是会跳动
      deviceState[side] = n
    },
    async handleLongRecived (data) {
      let channel = data.channel

      if (this.globalData.deviceState['1']) uni.hideLoading() // 通道数据健全

      if (this.pasteChannel - channel !== 0) return
      let { settingCHL, settingCHR } = this.globalData.deviceState[channel]
      this.firstPhase = { settingCHL, settingCHR }
    },
    async nextStep () {
      if (!this.globalData.paired) return this.toast('请先配对并初始化设备')
      let { settingCHL, settingCHR } = this.globalData.deviceState[this.pasteChannel]
      let currentReady = Number(settingCHL) !== 0 && !(this.portNum === 2 && Number(settingCHR) === 0)
      if (!currentReady) return this.toast('刺激强度不能设置为0')

      this.globalData.pasteChannel += 1
      if (this.globalData.pasteChannel <= this.globalData.maxChannel) return uni.redirectTo({ url: '/pages/bluetooth/paste' })

      uni.showLoading({
        title: '准备开始',
        mask: true
      })

      let recordId = this.libs.data.random(6)// 代替请求recordId
      await this.setRecord(recordId)
      setTimeout(async () => {// 设备写入recordId需要时间
        await this.startTreatment()
        // 请求治疗id，写入治疗设备
        let { workoutId, duration, workoutName, workoutDescription, portNum = 2, initCommand = '0,0,0' } = this.globalData.workout
        let [, , phaseNumber] = initCommand.split(',')
        let { sn, phone } = this.globalData.userInfo
        let params = {
          workoutId, duration, workoutName, workoutDescription, portNum, phaseNumber,
          totalTime: duration,
          workout: this.globalData.workout,
          time: 0, // 已治疗时间
          recordId,
          terminalInfo: { deviceName: this.device.name },
          startTime: new Date().valueOf(),
          startDateTime: this.libs.data.dateNow(),
          isStop: 0,
          phone, sn
        }

        let _data = (await this.libs.request(this.libs.api.limitDeviceApp.treatment.startTreatment, params)).data
        this.globalData.workoutRecord = { ..._data, ...params }
        this.libs.data.setStorage('workoutRecord' + recordId, this.globalData.workoutRecord)
        uni.hideLoading()
        uni.reLaunch({ url: '/pages/bluetooth/running' })
      }, 1000)
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

  .setStep {
    display: flex;
    justify-content: space-between;

    .nextStep {
      padding: 0 40rpx;
      border-radius: 30rpx;
      font-size: var(--font-h4);
      line-height: 60rpx;
      background: var(--theme-color);
      color: #fff;
    }
  }

  .uni-numbox {
    zoom: 2;
    margin: 75rpx auto;
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
