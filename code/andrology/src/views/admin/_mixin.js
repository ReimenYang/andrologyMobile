
export default {
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
      imgCodeUrl: '',
      projectInfo: {}
    }
  },
  async created () {
    sessionStorage.clear()
    document.documentElement.style.setProperty('--theme-color', '')
    let _userInfo = this.libs.data.getStorage('userInfo')
    if (!_userInfo) return
    this.globalData.userInfo = JSON.parse(_userInfo)
    this.form.phone = this.globalData.userInfo.phone
    this.btnList[0].smallLabel = true
    if (!this.$route.query.projectCode) return
    this.globalData.headers = { projectCode: this.$route.query.projectCode }
    let getProjectBaseInfo = (await this.request(this.api.andrology.project.getProjectBaseInfo)).data
    this.projectInfo = { ...getProjectBaseInfo, projectCode: this.$route.query.projectCode }
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
    }
  }
}