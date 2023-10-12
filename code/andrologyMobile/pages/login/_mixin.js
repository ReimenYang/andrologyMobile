
export default {
  data () {
    return {
      btnList: [
        { name: 'phone', label: '手机号', btnStatus: true, smallLabel: false, },
        { name: 'password', label: '密码', btnStatus: true, smallLabel: false, config: { type: 'password', showPassword: true }, click: this.submit },
        { name: 'verifyCode', label: '图片验证', btnStatus: false, smallLabel: false, config: { class: 'short' } },
        { name: 'smsCode', label: '短信验证', btnStatus: false, smallLabel: false, text: '获取验证码', config: { class: 'short' }, click: this.submit },
      ],
      form: {
        phone: '',
        password: '',
        verifyCode: '',
        smsCode: '',
        isMobile: true,
        clientKey: String(new Date() - 0)
      },
      smsLocker: false,
      imgCodeUrl: '',
      projectInfo: {}
    }
  },
  methods: {
    changeLoginType () {
      this.btnList.forEach(item => item.name !== 'phone' && (item.btnStatus = !item.btnStatus))
      if (!this.btnList[2].btnStatus) return
      this.getImgCodeUrl()
      this.form.password = ''
    },
    async getImgCodeUrl () {
      let _file = await this.request(this.api.andrology.user.getUserVerifyCode, this.form, { headers: this.globalData.headers, responseType: 'arraybuffer' })
      this.imgCodeUrl = 'data:image/png;base64,' + btoa(new Uint8Array(_file).reduce((_file, byte) => _file + String.fromCharCode(byte), ''))
      console.log(this.imgCodeUrl)
    },
    async getCode () {
      if (this.form.verifyCode.length !== 4) return this.toast('请输入正确图片验证')
      let res = await this.request(this.api.andrology.user.sendSMSCode, this.form)
      // this.getImgCodeUrl()
      if (res.code !== 200) return
      this.toast('发送成功')
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
    }
  }
}
