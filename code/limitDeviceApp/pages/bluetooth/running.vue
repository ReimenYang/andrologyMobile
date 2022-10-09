<template>
  <view
    class="wrap"
    :style="{'--theme-color':globalData.config.theme}"
    v-if="recordReady"
  >
    <clock
      class="info"
      :percent="(totalTime-remain)/totalTime"
    >
      <view>
        <view class="remain">
          剩余时间
        </view>
        <view class="countdown">
          {{ remain ? `${minute}:${second}` : '已结束' }}
        </view>
        <view class="workoutName">
          {{ totalTime/60 }}分钟
        </view>
      </view>
    </clock>
    <view class="schemeName">
      {{ workoutName }}
      <!-- 连接中 -->
    </view>
    <!-- <view class="note">
      如需要调整刺激强度，请在设备进行调整<br>
      如需要停止治疗，请直接点击设备的电源键
    </view> -->
    <view :class="remain? 'itemBox' : 'itemBox lockBtn' ">
      <view class="control">
        <view
          class="btn primary"
          @click="controlBtn()"
        >
          <view :class="isRunning? 'pause' : 'play'" />
        </view>
        <view
          class="btn"
          @click="stopBtn()"
        >
          <view class="stop" />
        </view>
      </view>
      <xnw-from :config="config" />
    </view>
    <xnw-footer
      v-if="!remain"
      :isFix="true"
      textConfirm="返回首页"
      :showCancel="false"
      @onConfirm="toIndex"
    />
  </view>
</template>
<script>
import clock from '@/libs/components/uniapp/simplePie/simplePie.vue'
import mixinBLE from '@/pages/index/mixinBLE.js'
export default {
  components: {
    clock
  },
  mixins: [mixinBLE],
  data () {
    return {
      workoutName: '',
      totalTime: 0,
      remain: 0,
      minute: 0,
      second: 0,
      step: 5,
      config: {
        data: [{
          key: 'name',
          title: '治疗程序',
          setClass: '',
          style: '',
          textContent: ''
        }]
      },
      isRunning: null,
      holdState: false, // 拦截心跳包改变状态
      phaseNumber: 0,
      loopCountdown: null,
      setRecordIntervalTime: 2000, // r指令获取周期
      // showModal: false,
      // longRecivedReady: false,
      recordReady: false
    }
  },
  async onLoad () {
    uni.showLoading({
      title: '请等待..',
      mask: true
    })
    this.globalData.handleRecord = this.handleRecord
    this.globalData.handleLongRecived = this.handleLongRecived
    // await this.initCurrent()

    // this.longRecivedReady = true
    this.countStar()
    // uni.hideLoading()
  },
  beforeDestroy () {
    clearInterval(this.globalData.loopRecord)
    delete this.globalData.handleLongRecived
    delete this.globalData.handleRecord
    delete this.globalData.deviceState
  },
  methods: {
    // 通过r指令获取运行状态
    countStar () {
      this.isRunning = true
      clearInterval(this.globalData.loopRecord)
      this.globalData.loopRecord = setInterval(this.getRecord, this.setRecordIntervalTime)
    },
    // r指令返回运行状态后对界面进行初始化
    handleRecord () {
      let { duration, workoutName, phaseNumber } = this.globalData.workoutRecord
      this.phaseNumber = phaseNumber
      this.workoutName = workoutName
      this.totalTime = Number(duration)
      console.log('运行初始化', this.globalData.workoutRecord, this.totalTime)
      this.recordReady = true
    },
    // 暂停倒计时
    countStop () {
      this.isRunning = false
    },
    // 防止点击调电时同时接收s指令，导致界面上出现按钮状态闪动
    lockState () {
      this.holdState = true
      setTimeout(() => { this.holdState = false }, 2000)
    },
    // 倒计时运行方法
    async countdown () {
      this.minute = Math.floor(this.remain / 60)
      this.second = this.remain % 60
      if (this.second < 10) this.second = '0' + this.second
      if (0 < this.remain) return
      console.log('倒计时结束')
      this.countStar()
    },
    async handleLongRecived (data) {
      // 设置过程中，心跳包的值可能导致界面设置值跳动所以采取迂回的方式处理，但可能会导致设置和实际不同
      let { channel, stateRunning, remainingTime } = this.globalData.deviceState[data.channel]

      this.config.data[0].textContent = `${this.workoutName} ${this.totalTime / 60}分钟`

      // stateRunning 运行状态，可以是: 0 设置 ，1 运行，2 暂停，3 停止，4 锁定
      // 停止倒计时：设置，暂停，停止
      // 不可调电：暂停，停止，锁定
      // 判断跌落：设置，运行
      let _isRunning = stateRunning === '1'
      // console.log('状态锁定：', this.holdState, '显示运行', this.isRunning, '指令运行', _isRunning)
      // 状态没有锁 且 设备的状态和显示状态不同
      if (!this.holdState && this.isRunning !== _isRunning) {
        switch (stateRunning) {
          case '2':
          case '0':
            this.countStop()
            break
          case '1':
            this.countStar()
            break
        }
      }

      this.recivedCurrent(channel)

      this.remain = remainingTime - 0
      this.countdown()

      // 断开蓝牙再进会出现卡死
      // console.log('从s指令获取信息', channel, this.config.data)
      let isDone = !!this.config.data.find(item => item.channel === channel)
      if (!isDone) await this.initCurrent()
      // this.longRecivedReady = isDone

      if (isDone) uni.hideLoading()
    },
    // 从s指令获取强度信息，设置调电按钮
    setCurrentFun (n, side, channel) {
      let deviceState = this.globalData.deviceState[channel]
      let value = deviceState[side]
      console.log(side, '数字控件', n, value, deviceState)
      if (n - value < 0) side === 'settingCHL' ? this.leftMinus(channel) : this.rightMinus(channel)
      if (value - n < 0) side === 'settingCHL' ? this.leftPlus(channel) : this.rightPlus(channel)
      deviceState[side] = n
      this.lockState()
      this.countStop()
    },
    // 初始化强度按钮
    async initCurrent () {
      for (const channel in this.globalData.deviceState) {
        let target = this.globalData.workoutRecord.workout.channelList.find(item => item.channel === Number(channel))
        console.log('初始化强度按钮', typeof channel, channel, target, this.globalData.workoutRecord.workout)
        if (!target) continue
        const item = this.globalData.deviceState[channel]
        let { settingCHL, settingCHR, stateRunning } = item
        let _global = { min: 0, max: 900, step: this.step, typeDisabled: true, style: 'float:right', disabled: stateRunning === '2' }
        for (let i = 0; i < target.splices; i++) {
          let value = (i ? settingCHR : settingCHL)
          let key = i ? 'settingCHR' : 'settingCHL'
          this.config.data.push({
            channel,
            key,
            title: ['A', 'B', 'C', 'D'][channel - 1] + (i ? 1 : 2),
            setClass: '',
            style: '',
            number: {
              ..._global,
              value,
              change: (n) => this.setCurrentFun(n, key, channel)
            }
          })
        }
      }
    },
    recivedCurrent (channel) {
      let { settingCHL, settingCHR, stateRunning } = this.globalData.deviceState[channel]
      this.config.data.forEach(item => {
        if (item.channel !== channel) return
        item.number.disabled = stateRunning === '2'
        item.number.value = item.key === 'settingCHL' ? settingCHL : settingCHR
      })
    },
    toIndex () {
      clearInterval(this.globalData.loopRecord)
      this.countStop()
      uni.reLaunch({
        url: '/pages/scheme/index?from=running'
      })
    },
    async controlBtn (isRunning = this.isRunning) {
      this.lockState()
      if (isRunning) {
        clearInterval(this.globalData.loopRecord)
        this.countStop()
        await this.pauseTreatment()
      } else {
        this.countStar()
        await this.startTreatment()
      }

      this.isRunning = !isRunning
    },
    stopBtn () {
      this.countStop()
      this.endTreatment()
      this.toIndex()
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  height: 100vh;
  padding: 20rpx;
  color: var(--color-light);
  font-size: var(--font-h3);
  text-align: center;

  .info {
    margin: auto;

    .countdown {
      padding: 40rpx 0;
      font-size: var(--font-h1);
      color: var(--color-normal);
    }
  }
  .workoutName {
    padding: 0 20rpx;
    margin: 20rpx auto;
    display: inline-block;
    line-height: 80rpx;
    border-radius: 30rpx;
    background: #f3f8f9;
  }

  .schemeName {
    padding: 0 0 2em;
    color: var(--color-normal);
  }
  .note {
    font-size: var(--font-h4);
  }
  .lockBtn {
    position: relative;
    z-index: -1;
    opacity: 0.5;
  }
  .control {
    font-size: 80rpx;
    margin-top: -1em;
    display: flex;
    align-items: center;
    justify-content: center;

    .btn {
      width: 1em;
      height: 1em;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      box-shadow: var(--shadow-light);
      border-radius: 50%;

      &.primary {
        width: 1.5em;
        height: 1.5em;
        margin: 0 1em 0 2em;
        background-color: var(--theme-color);
      }

      .play {
        width: 0;
        height: 0;
        margin-left: 0.1em;
        border-top: 0.35em solid transparent;
        border-left: 0.7em solid #fff;
        border-bottom: 0.35em solid transparent;
      }

      .pause {
        width: 0.2em;
        height: 0.6em;
        border: 0.2em solid #fff;
        border-width: 0 0.2em;
      }

      .stop {
        width: 0.45em;
        height: 0.45em;
        background: var(--color-normal);
        border-radius: 0.1em;
      }
    }
  }
}
</style>
