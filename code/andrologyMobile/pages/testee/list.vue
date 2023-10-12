<template>
  <view class="bg">
    <view class="filter">
      <view style="display: flex;">
        <xnw-search
          ref="search"
          placeholderTxt="搜索姓名电话"
          :showIcon="true"
          @confirm="search"
          class="search"
        />
        <view
          class="addTestee icon-plus-circle iconfont"
          @click="gotoAdd"
        >
          新增
        </view>
      </view>
      <picker
        v-bind="picker"
        :range="patientState"
        @click="e=>pickerHandle(e,picker,'click')"
        @cancel="e=>pickerHandle(e,picker,'cancel')"
        @change="e=>pickerHandle(e,picker,'change')"
        class="picker"
      >
        <view
          class="iconfont"
          :class="picker.setClass"
        >
          {{ patientState[picker.value].label }}
        </view>
      </picker>
    </view>

    <p-wrap offset="220rpx">
      <view
        class="box"
        v-for="item in list"
        :key="item.id"
      >
        <view class="title">
          <view class="name">
            {{ item.patientName }}
          </view>
          <view class="phone">
            {{ item.patientPhone }}
          </view>
          <view class="code">
            {{ item.patientCode }}
          </view>
        </view>
        <view class="dl">
          <view class="dt">
            状态
          </view>
          <view
            class="dd state"
            :style="{color:patientState.find(obj=>obj.label===item.patientState).color}"
          >
            {{ item.patientState }}
          </view>
        </view>
        <view class="dl">
          <view class="dt">
            所属机构
          </view>
          <view class="dd">
            {{ item.organization }}
          </view>
        </view>
        <view class="dl">
          <view class="dt">
            所属组
          </view>
          <view class="dd">
            {{ item.groupName }}
          </view>
        </view>
      </view>
    </p-wrap>

    <!-- <p-menu :defaultIndex="0" /> -->
  </view>
</template>

<script>
export default {
  data () {
    return {
      picker: { value: 0, mode: 'selector', setClass: 'icon-down', rangeKey: 'label' },
      list: [],
      patientState: [
        { value: '', label: '全部状态', active: true },
        { value: '未入组', label: '未入组', color: '#df6b66' },
        { value: '已入组', label: '已入组', color: '#209cdd' },
        { value: '完成', label: '完成', color: '#5bb75b' },
        { value: '排除', label: '排除' },
        { value: '脱落', label: '脱落' },
        { value: '中止', label: '中止' },
      ]
    }
  },
  async onLoad () {
    window.Y = this
    console.log(this.options)
    await this.getList()
  },
  methods: {
    async getList () {
      this.list = (await this.request(this.api.andrology.patient.getPatientList)).data
      this.list.forEach(item => item.patientId = item.id)
      // this.onPage({})
      this.ready = true
    },
    pickerHandle (e, obj, type) {
      switch (type) {
        case 'click':
          obj.setClass = 'icon-up'
          break
        case 'cancel':
          obj.setClass = 'icon-down'
          break
        case 'change':
          obj.value = e.detail.value
          this.patientState.forEach((item, i) => item.active = obj.value === i)
          this.search()
          break
      }
    },
    async search () {
      await this.getList()
      let state = this.patientState.find(({ active }) => active).value
      let keyword = this.$refs.search.searchWord

      this.list = this.list.filter(({ patientState, patientPhone, patientName }) => {
        let _state = true, _keyword = true
        if (state) _state = patientState === state
        if (keyword) _keyword = [patientPhone, patientName].join().includes(keyword)

        return _state && _keyword
      })
    },
    gotoAdd () {
      uni.navigateTo({ url: '/pages/testee/add' })
    }
  }
}
</script>
<style lang="scss" scoped>
.bg {
  .filter {
    width: 100%;
    padding: 20rpx;
    margin-bottom: 20rpx;
    box-sizing: border-box;
    background-color: #fff;
    text-align: center;
    .search {
      width: 80%;
      height: 80rpx;
      margin-bottom: 20rpx;
      border-radius: 40rpx;
      overflow: hidden;
      :deep(.search .inputBox .searchIcon) {
        left: calc(50% - 4.5em);
      }
    }
    .addTestee {
      width: 20%;
      height: 80rpx;
      line-height: 80rpx;
      color: var(--theme-color);
      text-align: center;
      &.iconfont::before {
        margin-right: 10rpx;
      }
    }
  }
  .box {
    padding: 20rpx 30rpx;
    margin: 0 20rpx 20rpx;
    border: var(--border-normal);
    border-radius: var(--border-radius);
    line-height: 1.8;
    background-color: #fff;
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--color-tips);
      .name {
        color: var(--color-normal);
        font-size: var(--font-h3);
      }
    }
    .dl {
      display: flex;
      .dt {
        width: 5em;
      }
      .dd {
        color: var(--color-tips);
        &.state {
          padding: 0 20rpx;
          font-size: var(--font-h4);
          border: var(--border-style);
          border-radius: var(--border-radius);
        }
      }
    }
  }
}
</style>
