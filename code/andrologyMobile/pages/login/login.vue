<template>
  <view class="bg">
    <view
      v-if="!projectInfo.projectCode"
      class="fieldForm"
    >
      非法请求路径
    </view>
    <view v-else>
      <view class="title">
        {{ projectInfo.projectName||libs.configProject.name }}
      </view>
      <view class="fieldForm">
        <view
          class="fieldBox"
          v-for="item in btnList"
          :key="item.name"
          v-show="item.btnStatus"
        >
          <view
            class="label"
            :class="{ smallLabel: item.smallLabel }"
          >
            {{ item.label }}
          </view>
          <input
            v-if="item.name!=='password'"
            class="input"
            v-model="form[item.name]"
            :class="item.config&&item.config.class"
            @blur="item.smallLabel = !!form[item.name]"
            @focus="item.smallLabel = true"
            @input="item.onInput && item.onInput(item)"
            @keyup.enter="item.click && item.click()"
          >
          <input
            v-else
            class="input"
            v-model="form[item.name]"
            type="password"
            :class="item.config&&item.config.class"
            @blur="item.smallLabel = !!form[item.name]"
            @focus="item.smallLabel = true"
            @input="item.onInput && item.onInput(item)"
            @keyup.enter="item.click && item.click()"
          >
          <image
            v-if="item.name === 'verifyCode'"
            class="imgCode"
            mode="aspectFit"
            :src="imgCodeUrl"
            @click="getImgCodeUrl"
          />
          <view
            class="getCode"
            :class="{ disabled: smsLocker }"
            v-if="item.name === 'smsCode'"
            @click="getCode"
          >
            {{ item.text }}
          </view>
        </view>

        <button
          type="primary"
          class="submit"
          size="large"
          @click="submit"
        >
          确定提交
        </button>
      </view>
      <view
        class="toggleType"
        @click="changeLoginType"
      >
        {{ btnList[1].btnStatus?'短信登录':'密码登录' }}
      </view>
    </view>
    <view
      class="vision"
      v-if="projectInfo.projectCode"
    >
      {{ `&copy; ${libs.data.dateNow('', 'xxxx')} 北京迈博蓝管理咨询有限公司 ${libs.configProject.vision} ${libs.configProject.updateTime}` }}
    </view>
  </view>
</template>

<script>
import mixin from './_mixin.js'
export default {
  mixins: [mixin],
  data () {
    return {
    }
  },
  async onLoad () {
    window.Y = this
    let _userInfo = this.libs.data.getStorage('userInfo')
    if (_userInfo) {
      this.globalData.userInfo = JSON.parse(_userInfo)
      this.form.phone = this.globalData.userInfo.phone
      this.btnList[0].smallLabel = true
    }
    let projectCode = this.options.projectCode
    if (projectCode) {
      this.globalData.headers = { projectCode }
      let getProjectBaseInfo = (await this.request(this.api.andrology.project.getProjectBaseInfo)).data
      this.projectInfo = { ...getProjectBaseInfo, projectCode }
    }
  },
  methods: {
    async submit () {
      let message = []
      let { password, smsCode, phone } = this.form
      if (!phone) message.push('账号')
      if (!password && !this.btnList[2].btnStatus) message.push('密码')
      if (smsCode.length !== 6 && this.btnList[2].btnStatus) message.push('短信验证')
      if (message.length) return this.toast('请输入正确' + message.join('，'))
      let res = await this.request(this.api.andrology.user.loginForProject, this.form)
      if (res.code !== 200) return
      let projectCode = this.options.projectCode
      this.globalData.userInfo = { phone, ...res.data, projectCode, beforeunload: new Date() - 0 }
      this.libs.data.setStorage('userInfo', JSON.stringify(this.globalData.userInfo))

      console.log(this.globalData.userInfo)
      this.globalData.headers = { token: res.data.loginToken, projectCode }
      this.globalData.projectState = (await this.request(this.api.andrology.project.getProjectBaseInfo)).data.projectState
      this.globalData.orgList = (await this.request(this.api.andrology.projectMgt.getProjectOrgList)).data
      this.globalData.groupList = (await this.request(this.api.andrology.projectMgt.getProjectGroupList)).data
      uni.redirectTo({ url: '/pages/testee/index' })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./login.scss";
</style>
