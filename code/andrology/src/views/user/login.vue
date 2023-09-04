<template>
  <div class="bg">
    <div
      v-if="!projectInfo.projectCode"
      class="fieldForm"
    >
      非法请求路径
    </div>
    <div v-else>
      <div class="title">{{ projectInfo.projectName||libs.configProject.name }}</div>
      <div class="fieldForm">
        <div
          class="fieldBox"
          v-for="item in btnList"
          :key="item.name"
          v-show="item.btnStatus"
        >
          <span
            class="label"
            :class="{ smallLabel: item.smallLabel }"
          >{{ item.label }}</span>
          <el-input
            class="input"
            v-model="form[item.name]"
            v-bind="item.config"
            @blur="item.smallLabel = !!form[item.name]"
            @focus="item.smallLabel = true"
            @input="item.onInput && item.onInput(item)"
            @keyup.enter="item.click && item.click()"
          />
          <el-input
            v-if="item.name === 'verifyCode'"
            type="image"
            :src="imgCodeUrl"
            class="imgCode"
            @click="getImgCodeUrl"
          />
          <span
            class="getCode"
            :class="{ disabled: smsLocker }"
            v-if="item.name === 'smsCode'"
            @click="getCode"
          >{{
          item.text
        }}</span>
        </div>

        <el-button
          type="primary"
          class="submit"
          size="large"
          @click="submit"
        >确定提交</el-button>
      </div>
      <div
        class="toggleType"
        @click="changeLoginType"
      >{{btnList[1].btnStatus?'短信登录':'密码登录'}}</div>
    </div>
    <div
      class="vision"
      v-if="projectInfo.projectCode"
    >
      {{ `&copy; ${libs.data.dateNow('', 'xxxx')} 北京迈博蓝管理咨询有限公司 ${libs.configProject.vision} ${libs.configProject.updateTime}` }}
      <a href="/#/admin">管理员登录</a>
    </div>

  </div>
</template>

<script>
import mixin from '../admin/_mixin.js'
export default {
  mixins: [mixin],
  methods: {
    async submit () {
      let message = []
      let { password, smsCode, phone } = this.form
      if (!phone) message.push('账号')
      if (!password && !this.btnList[2].btnStatus) message.push('密码')
      if (smsCode.length !== 6 && this.btnList[2].btnStatus) message.push('短信验证')
      if (message.length) return this.$message.error({ duration: 3000, message: '请输入正确' + message.join('，') })
      let res = await this.request(this.api.andrology.user.login, this.form)
      if (res.code !== 200) return
      this.globalData.userInfo = { phone, ...res.data, ...this.projectInfo, beforeunload: new Date() - 0 }
      this.libs.data.setStorage('userInfo', JSON.stringify(this.globalData.userInfo))

      this.globalData.headers.token = res.data.loginToken
      this.$router.push('/index/operationInfo?' + this.libs.object.paramsToKeyValue(this.projectInfo))
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../admin/login.scss";
</style>
