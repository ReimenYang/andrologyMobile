<template>
  <div class="bg">
    <div class="title">{{ libs.configProject.name }}</div>
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
    <div class="vision">{{ `&copy; ${libs.data.dateNow('', 'xxxx')} 壹零 ${libs.configProject.vision}
          ${libs.configProject.updateTime}` }}</div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      btnList: [
        { name: 'phone', label: '手机号', btnStatus: true, smallLabel: false, },
        { name: 'password', label: '密码', btnStatus: true, smallLabel: false, config: { type: "password", showPassword: true }, click: this.submit },
        { name: 'verifyCode', label: '图片验证', btnStatus: false, smallLabel: false, config: { class: "short" } },
        { name: 'smsCode', label: '短信验证', btnStatus: false, smallLabel: false, text: '获取验证码', config: { class: "short" }, click: this.submit },
      ],
      form: {
        phone: '',
        password: '',
        verifyCode: '',
        smsCode: '',
        clientKey: String(new Date() - 0)
      },
      smsLocker: false,
      imgCodeUrl: ''
    }
  },
  created () {
    sessionStorage.clear()
    let _userInfo = this.libs.data.getStorage('userInfo')
    if (!_userInfo) return
    this.globalData.userInfo = JSON.parse(_userInfo)
    this.form.phone = this.globalData.userInfo.phone
    this.btnList[0].smallLabel = true
  },
  methods: {
    changeLoginType () {
      this.btnList.forEach(item => item.name !== 'phone' && (item.btnStatus = !!!item.btnStatus))
      if (!this.btnList[2].btnStatus) return
      this.getImgCodeUrl()
      this.form.password = ''
    },
    async getImgCodeUrl () {
      let _file = await this.request(this.api.andrology.user.getUserVerifyCode, this.form, { headers: this.globalData.headers, responseType: 'blob' })
      this.imgCodeUrl = window.URL.createObjectURL(_file)
      console.log(this.imgCodeUrl);
    },
    async getCode () {
      if (this.form.verifyCode.length !== 4) return this.$message.error({ duration: 3000, message: '请输入正确图片验证' })
      let res = await this.request(this.api.andrology.user.sendSMSCode, this.form)
      // this.getImgCodeUrl()
      if (res.code !== 200) return
      let _time = 60
      let _obj = this.btnList.find(item => item.name === 'smsCode')
      _time--
      _obj.text = '等待 ' + _time + ' 秒'
      this.smsLocker = true
      let _waiting = setInterval(() => {
        _time--
        this.smsLocker = 0 < _time
        if (this.smsLocker) return _obj.text = '等待 ' + _time + ' 秒'
        _obj.text = '获取验证码'
        clearInterval(_waiting)
      }, 1000)
    },
    async submit () {
      let message = []
      let { password, smsCode, phone } = this.form
      if (!phone) message.push('账号')
      if (!password && !this.btnList[2].btnStatus) message.push('密码')
      if (smsCode.length !== 6 && this.btnList[2].btnStatus) message.push('短信验证')
      if (message.length) return this.$message.error({ duration: 3000, message: '请输入正确' + message.join('，') })
      let res = await this.request(this.api.andrology.user.login, this.form)
      if (res.code !== 200) return
      this.globalData.userInfo = { phone, ...res.data, projectCode: '', beforeunload: new Date() - 0 }
      this.libs.data.setStorage('userInfo', JSON.stringify(this.globalData.userInfo))
      this.globalData.headers = { token: res.data.loginToken }
      this.$router.push('/projectCenter/index')
    }
  }
}
</script>
<style lang="scss" scoped>
.bg {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url("@/assets/images/bg.jpg") no-repeat center/cover;

  .title {
    margin-bottom: 20px;
    font-size: var(--font-h2);
  }

  .fieldForm {
    padding: 10px;
    margin-bottom: 30px;
    border-radius: 15px;
    border: var(--border-normal);
    background: #fff;
    transition: all 0.125s ease-in;

    .fieldBox {
      width: 310px;
      height: 55px;
      position: relative;

      &:not(:first-child) {
        border-top: var(--border-normal);
      }

      .label {
        position: absolute;
        top: 15px;
        left: 10px;
        color: var(--color-tips);
        font-size: var(--font-h4);
        transition: all 0.125s ease-in;

        &.smallLabel {
          top: 5px;
          font-size: var(--font-h6);
        }
      }

      .input {
        width: 260px;

        &.short {
          width: 210px;
        }

        :deep(.el-input__wrapper) {
          padding: 20px 0 0;
          box-shadow: none;
          background: none;

          .el-input__inner {
            height: 35px;
            padding: 0 10px;
            font-size: var(--font-h3);
          }
        }
      }

      .icon-right {
        width: 30px;
        height: 30px;
        box-sizing: border-box;
        position: absolute;
        bottom: 10px;
        right: 0;
        line-height: 28px;
        text-align: center;
        border: 2px solid;
        border-radius: 15px;
        font-weight: bold;
        color: var(--color-tips);
        transition: all 0.125s ease-in;

        &.smallLabel {
          bottom: 5px;
        }

        &.active {
          cursor: pointer;
          color: var(--color-light);
        }
      }
    }

    .imgCode {
      width: 100px;

      :deep(.el-input__wrapper) {
        padding: 0;
        box-shadow: none;
        background: none;

        .el-input__inner {
          height: 40px;
        }
      }
    }

    .getCode {
      width: 100px;
      display: inline-block;
      text-align: center;
      color: var(--theme-color);
      text-decoration: underline;

      &.disabled {
        color: var(--color-tips);
        text-decoration: none;
      }
    }

    .submit {
      width: 310px;
      margin-top: 10px;
      font-size: var(--font-h4);
    }
  }
  .toggleType {
    margin-bottom: 28vh;
    text-decoration: underline;
    cursor: pointer;
  }
  .vision {
    padding: 1em;
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: var(--font-h6);
    color: var(--color-tips);
  }
}
</style>
