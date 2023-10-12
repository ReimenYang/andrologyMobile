<template>
  <view class="bg">
    <p-header
      backIcon="show"
      title="筛查详情"
    />
    <p-wrap
      :hasHeader="true"
      :hasFooter="showFooter"
      v-if="ready"
    >
      <view class="tabs">
        <view
          v-for="tab in tabPane"
          :key="tab.key"
          @click="changeTab(tab)"
          class="tab"
          :class="{active:activeTab===tab.key}"
        >
          {{ tab.name }}
        </view>
      </view>
      <view class="tabPane">
        <xnw-from
          v-for="tab in tabPane"
          :key="tab.key"
          :config="{data:tab.dataList}"
          v-show="activeTab===tab.key"
        />
      </view>
    </p-wrap>
    <xnw-footer
      v-if="showFooter"
      @onConfirm="onConfirm"
      @onCancel="onCancel"
      :textConfirm="'入组'"
      :textCancel="'排除'"
    />
    <xnw-dialog
      v-bind="dialog"
      v-if="globalData.groupList&&showDialog"
    >
      <view class="box">
        <view class="item">
          <view class="title">
            分组
          </view>
          <picker
            v-bind="picker"
            :range="globalData.groupList"
            @click="e=>pickerHandle(e,picker,'click')"
            @cancel="e=>pickerHandle(e,picker,'cancel')"
            @change="e=>pickerHandle(e,picker,'change')"
            class="picker"
          >
            <view
              class="iconfont"
              :class="picker.setClass"
            >
              {{ globalData.groupList[picker.value].groupName }}
            </view>
          </picker>
        </view>
        <view class="item">
          <view class="title">
            入组日期
          </view>
          <picker
            mode="date"
            :value="form.enterDate"
            @change="e=>pickerHandle(e,picker,'date')"
            class="picker"
          >
            <view class="iconfont">
              {{ form.enterDate }}
            </view>
          </picker>
        </view>
      </view>
    </xnw-dialog>
  </view>
</template>

<script>
export default {
  data () {
    return {
      ready: false,
      showFooter: this.globalData.patientInfo.patientState === '未入组',
      screeningInfo: {},
      activeTab: 'inclusionCriteriaList',
      tabPane: [
        { key: 'inclusionCriteriaList', name: '入组标准', dataList: [] },
        { key: 'exclusionCriteriaList', name: '排除标准', dataList: [] }
      ],
      dialog: {
        config: { visible: true },
        onConfirm: this.confirm,
        onClose: () => this.showDialog = false
      },
      picker: { value: 0, mode: 'selector', setClass: 'icon-down', rangeKey: 'groupName' },
      showDialog: false,
      form: {
        groupId: '',
        enterDate: this.libs.data.dateNow('', 'xxxx-xx-xx'),
      }
    }
  },
  async onLoad () {
    await this.getList()
    this.ready = true
  },
  methods: {
    async getList () {
      this.screeningInfo = (await this.request(this.api.andrology.patient.getPatientScreeningInfo, this.options)).data
      Object.keys(this.screeningInfo).forEach(key => {
        let _item = this.screeningInfo[key]

        _item.forEach(item => {
          item.title = item.criteria
          item.textContent = item.result
          item.style = { color: item.result === '请医师判断' ? 'blue' : ((item.result === '符合' || item.result === '否') ? '' : 'red') }
        })
        let tab = this.tabPane.find(item => item.key === key)
        tab.dataList = _item
      })
    },
    async changeTab (tab) {
      this.activeTab = tab.key
    },
    async onConfirm () {
      this.showDialog = true
      this.form.groupId = this.globalData.groupList[this.picker.value].id
    },
    async confirm () {
      let error = []
      if (!this.form.groupId) error.push('分组')
      if (!this.form.enterDate) error.push('入组日期')
      if (error.length) {
        this.toast(error.join() + '不能为空')
        return false
      }
      let res = await this.request(this.api.andrology.patient.join, { ...this.form, ...this.options })
      if (res.code !== 200) return false
      this.toast('入组成功')
      this.showDialog = false
      uni.navigateBack()
    },
    async onCancel () {
      let res = await this.request(this.api.andrology.patient.exclude, this.options)
      if (res.code !== 200) return uni.navigateBack()
    },
    pickerHandle (e, obj, type) {
      switch (type) {
        case 'date':
          this.form.enterDate = e.detail.value
          break
        case 'click':
          obj.setClass = 'icon-up'
          break
        case 'cancel':
          obj.setClass = 'icon-down'
          break
        case 'change':
          obj.value = e.detail.value
          this.form.groupId = this.globalData.groupList[obj.value].id
          obj.setClass = 'icon-down'
          break
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.tabs {
  width: 100%;
  display: flex;
  text-align: center;
  line-height: 3;
  .tab {
    flex: 1;
    &.active {
      color: var(--theme-color);
      background-color: #fff;
    }
  }
}
.tabPane {
  padding: 20rpx;
  background: #fff;
}
/deep/ .form .formGroup .title {
  width: 70%;
  color: #333;
}
.box {
  width: 80vw;
  padding: 20rpx;
  line-height: 3;
  .item {
    padding: 10rpx 0;
    display: flex;
    justify-content: space-between;
  }
}
</style>
