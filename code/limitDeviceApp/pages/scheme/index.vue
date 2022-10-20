<template>
  <view
    class="wrap indexBg"
    :style="{'--indexBg': `url(${globalData.config.indexBg})`,'--theme-color':globalData.config.theme}"
  >
    <p-header :title="globalData.config.appName" />
    <p-wrap
      :hasHeader="true"
      :hasFooter="true"
    >
      <view class="userInfo">
        <xnw-item
          :info="userInfo"
          v-if="userInfo.title"
        >
          <view
            v-if="bleState.paired"
            slot="footer"
            @click="toConnect('navigateTo')"
          >
            <view class="toConnect">
              更换设备
            </view>
            {{ userInfo.footer }}
          </view>
        </xnw-item>
      </view>
      <view
        class="unPaired"
        v-if="!bleState.paired"
        @click="toConnect()"
        :style="setBg()"
      >
        <view
          v-if="device.name"
          class="deviceName"
        >
          设备号：{{ device.name }}
        </view>
      </view>
      <view
        class="workout"
        v-if="bleState.paired"
      >
        <view class="itemBoxTitle">
          推荐方案
        </view>
        <view class="workoutList">
          <xnw-item
            v-for="item in workoutList"
            :key="item.workoutId"
            :info="item"
            @click="toReady(item)"
          >
            <view
              slot="footer"
              v-if="item.todayState === 'Y'"
            >
              <view class="today">
                <view class="after">
                  √<br>今日
                </view>
              </view>
            </view>
          </xnw-item>
        </view>
      </view>
    </p-wrap>
    <p-menu :defaultIndex="0" />
  </view>
</template>
<script>
import mixinBLE from '@/pages/index/mixinBLE.js'
export default {
  mixins: [mixinBLE],
  data () {
    return {
      userInfo: {
        post: '/static/face.png'
      },
      from: '',
      workoutList: [],
      RecordId: 0
    }
  },
  async onLoad (option) {
    this.from = option.from
    await this.getWorkoutList()
    // this.init()
  },
  onHide () {
    delete this.globalData.pageInit
    delete this.globalData.handlePair
  },
  async onShow () {
    this.globalData.pageInit = this.init
    this.globalData.handlePair = this.pageHandlePair

    let _hour = new Date().getHours()
    if (_hour <= 5) this.userInfo.title = '凌晨好！'
    if (6 <= _hour && _hour <= 10) this.userInfo.title = '早上好！'
    if (11 <= _hour && _hour <= 13) this.userInfo.title = '中午好！'
    if (14 <= _hour && _hour <= 17) this.userInfo.title = '下午好！'
    if (18 <= _hour && _hour <= 19) this.userInfo.title = '傍晚好！'
    if (20 <= _hour) this.userInfo.title = '晚上好！'

    this.userInfo.contents = [{
      txt: this.globalData.userInfo.phone.replace(/(\d{3})\d*(\d{4})/, '$1****$2')
    }]
    console.log('首页show')
    // 20221019 需求 减少请求
    // await this.getWorkoutList()
    this.pageHandlePair(this.bleState.paired)
  },
  methods: {
    async init () {
      // this.device = this.globalData.device = this.libs.data.getStorage('device')
      // 获取上次使用的设备
      // console.log('首页init')
      // this.pageHandlePair(this.bleState.paired)

      // 防止死循环 自动连接
      if (!this.from && this.device.name) return await this.toConnect()
    },
    pageHandlePair (boolean) {
      // this.paired = boolean
      let str = '点击连接设备'
      console.log('首页handlePair', this.globalData.device, boolean)
      if (this.globalData.device && this.globalData.device.name) str = '设备 ' + this.globalData.device.name + (boolean ? '已连接 ' : '未连接 ')
      this.$set(this.userInfo, 'footer', str)
      if (!boolean) return
      this.workoutList = this.globalData.workoutList
      // 过滤多通道方案，易循环特有
      this.workoutList = this.globalData.workoutList.filter(item => item.deviceType.split(',').includes(this.globalData.device.mode))
      if (boolean) this.getRecord()
    },
    async getWorkoutList () {
      // deviceTypeId 设备类型id
      // 14:DJZ-A
      // 15:ble
      // 16:优E康
      let params = {
        pageSize: 100, deviceTypeId: '16',
        // composeName: 'ble2',
        // workoutNameOrDesc: 'ee6'// 测试用
        isNewDevice: this.libs.configProject.isNewDevice,
        phone: this.globalData.userInfo.phone
      }
      this.globalData.workoutList = (await this.libs.request(this.libs.api.ECirculation.scheme.getSchemeList, params)).data

      this.globalData.workoutList.forEach(item => {
        // let note = ''
        // if (item.todayState === 'Y') note = '（今天已训练）'
        item.workoutName = item.name
        item.workoutDescription = item.description
        item.workoutId = item.id
        item.title = item.workoutName // + note,
        item.tags = [{ txt: '训练' }],
          item.contents = [{
            txt: `训练时长 ${item.duration / 60}分钟`
          }, {
            txt: item.workoutDescription
          }]
      })
    },
    async toConnect (type) {
      let _connected = this.bleState.paired ? {} : await this.connectDevice()
      if (type === 'navigateTo' || (!this.bleState.paired && _connected.statusCode !== 200)) return uni.navigateTo({ url: '/pages/bluetooth/connect' })
      // if(this.globalData.paired) return this.getRecord()
    },
    async toReady (workout) {
      // 第一次连接
      // if (!this.device.name) return this.toast('未绑定设备')
      // if (!this.device.name) return uni.navigateTo({ url: '/pages/bluetooth/connect?nextTo=/pages/bluetooth/paste' })
      // 曾连接，未配对，尝试配对
      // if (!this.bleState.paired) await this.connectDevice()
      // 尝试失败
      // if (!this.bleState.paired) return
      // this.globalData.workout = (await this.libs.request(this.libs.api.wyjkDevice.consumerElectronics.viewWorkoutDetail, { workoutId: workout.workoutId })).data
      this.globalData.workout = workout
      console.log('workoutDetail程序明细', this.globalData.workout)
      // 此时可能处于匹配状态
      uni.navigateTo({ url: '/pages/bluetooth/paste' })
    },
    setBg () {
      if (this.device.name) return 'background-image: url("/static/neverLink.png")'
      return 'background-image: url("/static/unLink.png")'
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  /deep/ .wrap {
    padding: 20rpx;
  }
  &.indexBg {
    background: var(--indexBg) no-repeat top center/100%;
  }
  .userInfo {
    .toConnect {
      float: right;
      color: var(--theme-color);
    }
    /deep/ .itemBox {
      padding: 20rpx;
      box-sizing: border-box;
      border-radius: var(--border-radius);
      background: #fff;
      line-height: 2;
      .post {
        width: 150rpx;
        height: 150rpx;
        padding: 10rpx;
        box-sizing: border-box;
        border-radius: 50%;
      }
      .title {
        font-size: var(--font-h3);
      }
      .infoFooter {
        padding: 20rpx;
        border-top: var(--border-normal);
        color: #999;
      }
    }
  }
  .unPaired {
    width: 80vw;
    height: 80vw;
    margin: 60rpx auto 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: no-repeat center/cover;
    font-size: var(--font-h3);
    text-align: center;
    line-height: 1.5;
    .deviceName {
      margin-top: 100%;
      padding-top: 100rpx;
      color: var(--theme-color);
    }
  }
  .workoutList {
    .today {
      --tab-height: -3em;
      width: 0;
      height: 0;
      margin-top: var(--tab-height);
      position: absolute;
      right: 0;
      border: calc(var(--tab-height) / -2) solid;
      border-color: transparent var(--theme-color) var(--theme-color)
        transparent;
      border-radius: 0 0 var(--border-radius);
      color: #fff;
      white-space: nowrap;
      text-align: right;
      .after {
        position: absolute;
        top: calc(var(--tab-height) / 3);
        right: calc(var(--tab-height) / 2);
        z-index: 2;
        font-size: var(--font-h4);
      }
    }
    /deep/ .itemBox {
      margin-bottom: 20rpx;
      position: relative;
      font-size: var(--font-h35);

      .title {
        font-size: var(--font-h3);
      }

      .tagBox {
        position: absolute;
        top: 30rpx;
        right: 0;

        .txt {
          padding: 0 40rpx;
          border-radius: 30rpx;
          font-size: var(--font-h4);
          line-height: 60rpx;
          color: var(--theme-color);
          border: var(--border-style);
        }
      }

      .contents {
        line-height: 1.5;
        color: var(--color-light);
      }
    }
  }
}
</style>
