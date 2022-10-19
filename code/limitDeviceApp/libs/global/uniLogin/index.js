import { appid, apiKey, apiSecret } from '@/projectConfig.js'
import libs from '@/libs'
let uniLogin = {}
function debug (str) {
  libs.request({ method: 'GET', url: 'http://10.10.20.101:8888/f45.png?debug=' + str }, {}, { important: true })
}
// 检查一键登录配置
uniLogin.checkProvider = provider => {
  return new Promise(resolve => {
    uni.getProvider({
      service: 'oauth',
      success (data) {
        console.log('检查一键登录配置', data)
        debug(`一键登录配置&data=${JSON.stringify(data)}&provider=${provider}`)
        // if (data.provider.includes(provider)) resolve({ statusCode: 200, data })
        resolve({ statusCode: 200, data })
      },
      fail (err) {
        debug(`一键登录配置error&err=${JSON.stringify(err)}&provider=${provider}`)
        console.log('检查一键登录配置error', err)
        uni.showToast({
          title: '检查一键登录配置失败,' + err,
          duration: 2000
        })
      }
    })
  })
}

// 预登录，检查登录需要的条件
uniLogin.preLogin = (provider, univerifyStyle) => {
  return new Promise(resolve => {
    uni.preLogin({
      provider,
      success (data) {
        resolve({ statusCode: 200, data })
      },
      fail (err) {
        console.log('预登录error', univerifyStyle.force, err)
        debug(`预登录error&force=${univerifyStyle.force}&err=${JSON.stringify(err)}`)
        uni.showToast({
          title: '预登录失败,' + err.metadata.msg,
          duration: 5000, icon: 'none'
        })
        if (univerifyStyle.force) setTimeout(uniLogin.exitApp, 5000)
      }
    })
  })
}

// 一键登录
uniLogin.login = (provider = 'univerify', univerifyStyle = {}) => {
  return uni.login({ provider, univerifyStyle })
  // return new Promise(resolve => {
  //   uni.login({
  //     provider,
  //     univerifyStyle, // 自定义授权页面信息，参数参考文档  https://uniapp.dcloud.io/univerify
  //     success (data) {
  //       resolve({ statusCode: 200, data })
  //     },
  //     fail (err) {
  //       console.log('一键登录error', err)
  //       resolve({ statusCode: err.code, err })
  //     }
  //   })
  // })
}

// 提取手机号
uniLogin.getPhoneNumber = async (data) => {
  let _res = await uniCloud.callFunction({
    name: 'AppPhoneLogin', data
  })
  let phoneNumber = _res.result.content.phoneNumber
  return phoneNumber
}

uniLogin.auto = async (univerifyStyle = {}, provider = 'univerify') => {
  console.log('检查一键登录配置')
  debug(`检查一键登录配置&univerifyStyle=${JSON.stringify(univerifyStyle)}&provider=${provider}`)
  await uniLogin.checkProvider(provider)
  debug('预登录')
  console.log('预登录')
  await uniLogin.preLogin(provider, univerifyStyle)
  debug('一键登录')
  console.log('一键登录')
  // let loginErr = {}, loginData
  let [loginErr, loginData] = await uniLogin.login(provider, univerifyStyle)
  if (!loginErr) loginErr = {}
  uni.closeAuthView() // 关闭一键登录弹出窗口
  console.log('一键登录结果', loginErr, loginData)
  debug(`一键登录结果&loginErr=${JSON.stringify(loginErr)}&loginData=${JSON.stringify(loginData)}`)
  switch (loginErr.code) {
    case 30002:
      // 点击其他方式登陆
      // uni.navigateTo({
      // 	url:"login/login",
      // 	animationType: 'slide-in-bottom',
      // 	animationDuration: 200
      // })
      break
    // 30003 关闭登陆
    // univerifyStyle.force是自定义强制登录参数,uniapp无相关定义，true:不登录则退出程序，默认值： false
    case 30003:
      if (univerifyStyle.force) {
        uni.showModal({
          title: '确认退出应用？',
          success: function (res) {
            if (res.confirm) return uniLogin.exitApp()
            return uniLogin.auto(provider, univerifyStyle)
          }
        })
      }
      break
  }
  if (!loginData) return new Promise(resolve => resolve({ statusCode: loginErr.code, err: loginErr.errMsg }))
  return new Promise(resolve => {
    switch (provider) {
      case 'univerify':// 手机一键登录
        return resolve(uniLogin.getPhoneNumber({ ...loginData.authResult, appid, apiKey, apiSecret }))
      default:
        console.log('未处理的情况', provider)
        return resolve(provider)
    }
  })
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
