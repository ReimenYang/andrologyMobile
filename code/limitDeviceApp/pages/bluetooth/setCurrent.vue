<template>
  <view
    class="wrapBox themeBg"
    :style="{'--theme-color':globalData.config.theme}"
  >
    <p-header
      backIcon="show"
      title="准备训练"
    />
    <p-wrap
      :hasHeader="true"
      :hasFooter="true"
    >
      <!-- <p-steps :active="2" /> -->
      <block
        v-for="item in currentList"
        :key="item.id"
      >
        <view class="itemBox">
          <view class="itemTitle">
            {{ `${item.channelName}1刺激强度` }}
          </view>
          <xnw-number
            v-model="item.settingCHL"
            :min="0"
            :max="900"
            :step="step"
            @minus="n => currentChange(n,'settingCHL','minus',item)"
            @plus="n => currentChange(n,'settingCHL','plus',item)"
            :typeDisabled="true"
          />
        </view>
        <view
          class="itemBox"
          v-if="item.splices===2"
        >
          <view class="itemTitle">
            {{ `${item.channelName}2刺激强度` }}
          </view>
          <xnw-number
            v-model="item.settingCHR"
            :min="0"
            :max="900"
            :step="step"
            @minus="n => currentChange(n,'settingCHR','minus',item)"
            @plus="n => currentChange(n,'settingCHR','plus',item)"
            :typeDisabled="true"
          />
        </view>
      </block>
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
      currentList: [{ settingCHL: 0, settingCHR: 0, channel: 1, splices: 2 }],
      step: .5,
      showModal: false
    }
  },
  async onLoad () {
    uni.showLoading({
      title: '请等待..',
      mask: true
    })
    this.globalData.handleLongRecived = this.handleLongRecived
    // 获取硬件的最后一个训练程序的状态
    // this.getRecord()
  },
  onShow () {
    this.currentList = this.globalData.workout.channelList.map(item => ({
      id: item.id,
      channel: item.channel,
      channelName: ['A', 'B', 'C', 'D'][item.channel - 1],
      settingCHL: 0, settingCHR: 0, splices: item.splices
    }))
  },
  onBackPress () {
    this.endTreatment()
    delete this.globalData.handleLongRecived
    delete this.globalData.deviceState
  },
  methods: {
    currentChange (n, side, type, item) {
      let channel = item.channel
      let deviceState = this.globalData.deviceState[channel]
      console.log(n, side, type, item, this.globalData.deviceState, channel, deviceState)
      let value = deviceState[side]
      console.log(value)
      if (n - value === 0) return
      if (type === 'minus') side === 'settingCHL' ? this.leftMinus(channel) : this.rightMinus(channel)
      if (type === 'plus') side === 'settingCHL' ? this.leftPlus(channel) : this.rightPlus(channel)
      // 修改设备指定通道强度，防止界面跳动，如果s指令返回值不一样，还是会跳动
      deviceState[side] = n
    },
    async handleLongRecived (data) {
      let _ready = this.globalData.workout.channelList.length === Object.keys(this.globalData.deviceState).length
      if (_ready) uni.hideLoading() // 通道数据健全

      let channel = data.channel - 0
      let _deviceState = this.globalData.deviceState[channel]
      let { settingCHL, settingCHR } = _deviceState
      let target = this.currentList.find(item => item.channel === channel)
      if (Number(target.settingCHL) !== Number(settingCHL)) {
        console.log('settingCHL', channel, settingCHL, typeof settingCHL, target.settingCHL, typeof target.settingCHL)
        target.settingCHL = settingCHL
      }
      if (Number(target.settingCHR) !== Number(settingCHR)) {
        console.log('settingCHR', channel, settingCHR)
        target.settingCHR = settingCHR
      }
    },
    async nextStep () {
      if (!this.bleState.paired) return this.toast('请先配对并初始化设备')
      let currentReady = this.currentList.map(item => {
        let { settingCHL, settingCHR } = this.globalData.deviceState[item.channel]
        return Number(settingCHL) !== 0 && (item.splices !== 2 || Number(settingCHR) !== 0)
      })

      if (currentReady.includes(false)) return this.toast('刺激强度不能设置为0')

      uni.showLoading({
        title: '准备开始',
        mask: true
      })

      let recordId = this.libs.data.random(7)// 代替请求recordId
      await this.setRecord(recordId)
      setTimeout(async () => {// 设备写入recordId需要时间
        await this.startTreatment()
        // 请求训练id，写入训练设备
        let { workoutId, duration, workoutName, workoutDescription, portNum = 2, initCommand = '0,0,0' } = this.globalData.workout
        let [, , phaseNumber] = initCommand.split(',')
        let { sn, phone } = this.globalData.userInfo
        let params = this.globalData.workoutRecord = {
          workoutId, duration, workoutName, workoutDescription, portNum, phaseNumber,
          totalTime: duration,
          workout: this.globalData.workout,
          time: 0, // 已训练时间
          recordId,
          deviceName: this.device.name,
          terminalInfo: { deviceName: this.device.name },
          startTime: new Date().valueOf(),
          startDateTime: this.libs.data.dateNow(),
          isStop: 0,
          phone, sn
        }
        console.log('请求训练id，写入训练设备', this.globalData.workoutRecord)
        uni.hideLoading()
        uni.reLaunch({ url: '/pages/bluetooth/running' })
        let _data = (await this.libs.request(this.libs.api.limitDeviceApp.treatment.startTreatment, params)).data
        this.globalData.workoutRecord = { ..._data, ...params }
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
  .itemBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .uni-numbox {
    zoom: 1.5;
    margin: 15rpx 0;
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
