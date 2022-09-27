let uniLogin = {}
// 检查一键登录配置
uniLogin.checkProvider = (provider, success, fail) => {
  uni.getProvider({
    service: 'oauth',
    success (res) {
      if (res.provider.includes(provider) && success) return success(res)
    },
    fail (err) {
      console.log('检查一键登录配置error', err)
      if (fail) return fail(err)
    }
  })
}

// 预登录，检查登录需要的条件
uniLogin.preLogin = (provider, univerifyStyle, success, fail) => {
  uni.preLogin({
    provider,
    success () {
      if (success) return success()
    },
    fail (err) {
      console.log('预登录error', err)
      if (univerifyStyle.force) return uni.showModal({
        title: '初始化失败',
        content: err.metadata.msg + '，如有疑问请联系客服',
        showCancel: false,
        confirmText: '我知道了',
        complete () {
          uniLogin.exitApp()
        }
      })
      if (fail) return fail(err)
      uni.showToast({
        title: '初始化失败,' + err.metadata.msg,
        duration: 2000
      })
    }
  })
}

// 一键登录
uniLogin.login = (provider = 'univerify', univerifyStyle = {}, success, fail) => {
  uni.login({
    provider,
    univerifyStyle, // 自定义授权页面信息，参数参考文档  https://uniapp.dcloud.io/univerify
    success (res) {
      if (success) return success(res)
    },
    fail (err) {
      console.log('一键登录error', err)
      if (err.code === 30002) {
        // 点击其他方式登陆
        // uni.navigateTo({
        // 	url:"login/login",
        // 	animationType: 'slide-in-bottom',
        // 	animationDuration: 200
        // })
      }
      // 30003 关闭登陆
      // univerifyStyle.force是自定义强制登录参数,uniapp无相关定义，true:不登录则退出程序，默认值： false
      if (err.code === 30003 && univerifyStyle.force) {
        uni.showModal({
          title: '确认退出应用？',
          success: function (res) {
            if (res.confirm) return uniLogin.exitApp()
            return uniLogin.login(provider, univerifyStyle, success, fail)
          }
        })
      }
      if (fail) return fail(err)
    },
    complete () {
      uni.closeAuthView() // 关闭一键登录弹出窗口
    }
  })
}

// 提取手机号
uniLogin.getPhoneNumber = async (res) => {
  let data = res.authResult
  let _res = await uniCloud.callFunction({
    name: 'AppPhoneLogin', data
  })
  let phoneNumber = _res.result.content.phoneNumber
  return phoneNumber
}

uniLogin.auto = async (callFunction, univerifyStyle = {}, provider = 'univerify') => {
  uniLogin.checkProvider(
    provider,
    () => uniLogin.preLogin(
      provider,
      univerifyStyle,
      () => uniLogin.login(
        provider,
        univerifyStyle,
        async (res) => {
          switch (provider) {
            case 'univerify':// 手机一键登录
              if (callFunction) return callFunction(await uniLogin.getPhoneNumber(res))
              break
            default:
              console.log('未处理的情况', provider)
              break
          }
        }
      )
    ))
}

uniLogin.exitApp = () => {
  uni.getSystemInfo({
    success: function (res) {
      // 判断为安卓的手机
      if (res.platform === 'android') {
        plus.runtime.quit()
      } else {
        // 判断为ios的手机，退出App
        plus.ios.import('UIApplication').sharedApplication().performSelector('exit')
      }
    }
  })
}
export default uniLogin
