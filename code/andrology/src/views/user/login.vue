<template>
  <div class="bg">
    <div class="title">{{ libs.configProject.name }}</div>
    <div class="fieldForm">
      <div
        class="fieldBox"
        v-for="item in btnList"
        :key="item.name"
        v-show="item.name === 'phone' || item.btnStatus !== false"
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
        <div
          class="iconfont icon-right"
          :class="{ smallLabel: item.smallLabel, active: item.btnStatus === 'active' }"
          v-if="item.btnStatus !== ''"
          @click="item.click"
        ></div>
        <el-input
          v-if="item.name === 'imageCode'"
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
        v-if="showSubmit"
        :disabled="submitLocker"
      >确定提交</el-button>
    </div>
    <div class="vision">{{ `&copy; ${libs.data.dateNow('', 'xxxx')} 杉山集团 ${libs.configProject.vision}
          ${libs.configProject.updateTime}` }}</div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      btnList: [
        { name: 'phone', label: '手机号', btnStatus: 'disabled', smallLabel: false, onInput: this.onInputChange, click: this.checkPhone },
        { name: 'password', label: '密码', btnStatus: false, smallLabel: false, onInput: this.onInputChange, click: this.checkPassword, config: { type: "password", showPassword: true } },
        { name: 'passwordRepeat', label: '确认密码', btnStatus: false, smallLabel: false, config: { type: "password", showPassword: true } },
        { name: 'imageCode', label: '图片验证', btnStatus: false, smallLabel: false, config: { class: "short" } },
        { name: 'smsCode', label: '短信验证', btnStatus: false, smallLabel: false, text: '获取验证码', config: { class: "short" } },
      ],
      form: {
        userId: '',
        username: '',
        phone: '',
        password: '',
        passwordRepeat: '',
        imageCode: '',
        randomStr: '',
        smsCode: '',
        requestWyjkMicroServer: true,
        version: "45",
        ptype: "2"
      },
      userInfo: {},
      smsLocker: false,
      submitLocker: true,
      imgCodeUrl: '',
      showSubmit: false
    }
  },
  created () {
    let _userInfo = this.libs.data.getStorage('userInfo')
    if (!_userInfo) return
    this.globalData.userInfo = this.userInfo = { ...JSON.parse(_userInfo), logout: true }
    if (!this.userInfo.id) return this.$message.error({ duration: 3000, message: '用户凭证异常，请联系工作人员' })
    if (!this.userInfo.phone) return

    this.form.phone = this.form.username = this.userInfo.phone
    this.form.userId = this.userInfo.id
    this.globalData.headers = { openid: this.userInfo.id, unionid: this.userInfo.wxUnionid }
    let hasPassword = !!this.userInfo.userPassword
    this.btnList.forEach(item => {
      switch (item.name) {
        case 'phone':
          item.smallLabel = true
          item.btnStatus = hasPassword ? '' : 'active'
          break;
        case 'password':
          item.btnStatus = hasPassword
          break;
      }
    })
  },
  methods: {
    getImgCodeUrl () {
      this.form.randomStr = this.libs.data.random(17)
      this.imgCodeUrl = this.libs.configProject.urlApi + '/wyjk-core/v1/api/weixin/getVerificationCode?randomStr=' + this.form.randomStr
    },
    onInputChange ({ name }) {
      let _phone = this.btnList.find(item => item.name === 'phone')
      let _password = this.btnList.find(item => item.name === 'password')
      let _verify = this.libs.data.verify.phone(this.form.phone)
      let hasPassword = !!this.userInfo.userPassword
      switch (name) {
        case 'phone':
          this.form.username = this.form.phone
          _phone.btnStatus = _verify ? 'active' : 'disabled'
          _password.btnStatus = false
          break;
        case 'password':
          if (hasPassword) _password.btnStatus = !!this.form.password ? 'active' : 'disabled'
          break;
      }
    },
    async checkPhone () {
      let _phone = this.btnList.find(item => item.name === 'phone')
      if (_phone.btnStatus !== 'active') return this.$message.error({ duration: 3000, message: '请输入正确手机号码' })
      let _userInfo = (await this.request(this.api.core.coreuser.getByPhone, this.form)).data
      if (!_userInfo) return this.$message.error({ duration: 3000, message: '手机号未注册，请联系工作人员' })
      if (!_userInfo.id) return this.$message.error({ duration: 3000, message: '用户凭证异常，请联系工作人员' })
      this.globalData.userInfo = this.userInfo = _userInfo
      this.form.userId = this.userInfo.id
      this.globalData.headers = { openid: this.userInfo.id, unionid: this.userInfo.wxUnionid }
      this.libs.data.setStorage('userInfo', this.userInfo)

      // this.userInfo = {
      //   "id": "5cf5da33130bcb995bcdfd388583dbe9", "wxOpenid": "oY5wa1UReurXZpijn3MhAPMsoEFQ", "wxUnionid": "oA68Mv5f8RFPw5YCW7ktF46SRydM",
      //   "phone": "13411038260",
      //   "userPassword": "",
      //   "oldUserPassword": null, "realname": "民哥", "userIdcardno": "440107199209120656", "wxSigninOpenid": null, "wxCheckinOpenid": null, "isWyjkAccount": "Y", "isBleAccount": "Y", "accountType": "doctor", "qwCode": "13411038260", "qwcodeCtime": "2021-02-05 15:47:49", "qwcodeValidtime": "2031-02-05 15:47:49", "wxNickname": "伟民", "wxSex": 1, "wxCountry": "中非共和国", "wxProvince": "", "wxCity": null, "wxHeadPic": "http://thirdwx.qlogo.cn/mmopen/Q3auHgzwzM5CaegdIgAeSUQ7QeibEibOXbTr5iaDoo2dGeZWTr1u8aqsnbzj6Zj1KxIY2icYSIB8PMh4Fb2AXSNoMKskfribsJArN3XbgprcFRIQ/132", "wxLanguage": "zh_CN", "wxSubscribeTime": "1631761564", "wxIsSubscribe": 1, "wxSubscribeScene": "ADD_SCENE_PROFILE_CARD", "dcHospital": null, "dcDept": null, "createDate": "2020-12-30 10:59:21", "modifyDate": "2022-11-15 07:54:18", "delFlag": "0", "remarks": null, "age": 34, "homeAddress": null, "jobTitle": "初级", "career": "医生", "weight": 66, "height": 158, "appCanOffline": "Y", "companyName": null, "email": "2219543424@qq.com", "birthday": null, "qwcodeSeq": "1000", "appOfflineUuid": null, "tmpNewStudioId": null, "tmpOldStudioId": null, "wxMiniAppSessionKey": null, "realNameAndPhone": "民哥-13411038260", "specialEquipmentSn": null, "hospitalId": 339, "medicalCard": null, "isScpdAccount": "N", "joinSubjectCodeRole": null, "realNameOrNickName": "民哥", "regionDash": "-", "region": ""
      // }
      let hasPassword = !!this.userInfo.userPassword
      this.btnList.forEach(item => {
        switch (item.name) {
          case 'phone':
            item.smallLabel = true
            item.btnStatus = hasPassword ? '' : 'active'
            break;
          case 'password':
            item.btnStatus = hasPassword || ''
            if (this.form.password) item.btnStatus = 'active'
            break;
          default:
            if (!hasPassword) item.btnStatus = ''
            break;
        }
      })
      if (!hasPassword) this.getImgCodeUrl()
      this.showSubmit = !hasPassword
    },
    async checkPassword () {
      let _password = this.btnList.find(item => item.name === 'password')
      if (_password.btnStatus !== 'active') return this.$message.error({ duration: 3000, message: '密码不能为空' })
      let res = await this.request(this.api.adminSsyypt.user.reservationLogin, this.form)
      if (res.statuscode === '0000') this.toIndex()
    },
    async getCode () {
      if (this.form.imageCode.length !== 3) return this.$message.error({ duration: 3000, message: '请输入正确图片验证' })
      let res = await this.request(this.api.core.coreuser.checkImageCodeAndSendSms, this.form)
      // this.getImgCodeUrl()
      if (res.code !== 0) return
      this.submitLocker = false
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
      let { password, passwordRepeat, smsCode } = this.form
      if (!password) message.push('设置密码')
      if (!passwordRepeat) message.push('确认密码')
      if (smsCode.length !== 6) message.push('短信验证')
      if (message.length) return this.$message.error({ duration: 3000, message: '请输入正确' + message.join('，') })
      if (password !== passwordRepeat) return this.$message.error({ duration: 3000, message: '设置密码和确认密码不一致' })
      let res = await this.request(this.api.core.coreuser.checkSmsCode, this.form)
      if (res.code !== 0) return
      if (!this.userInfo.userPassword) {
        let _res = await this.request(this.api.core.coreuser.editPassword, this.form)
        if (_res.code !== 0) return
      }
      let _userInfo = (await this.request(this.api.core.coreuser.getByPhone, this.form)).data
      this.libs.data.setStorage('userInfo', _userInfo)
      this.toIndex()
    },
    toIndex () {
      this.globalData.userInfo = this.userInfo = { ...this.userInfo, logout: false }
      this.libs.data.setStorage('userInfo', this.userInfo)
      this.$router.push('/recordList')
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
    margin-bottom: 30vh;
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
