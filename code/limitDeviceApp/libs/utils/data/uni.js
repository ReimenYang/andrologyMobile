import libs from '@/libs'
function getNetworkType () {
  return new Promise(resolve => {
    uni.getNetworkType({
      success: function (res) {
        resolve(res.networkType)
      },
      fail: function (err) {
        resolve(err)
      }
    })

  })
}
function exitNoNotice () {
  // 判断为安卓的手机
  if (libs.data.systemInfo.platform === 'android') {
    plus.runtime.quit()
  } else {
    // 判断为ios的手机，退出App
    plus.ios.import('UIApplication').sharedApplication().performSelector('exit')
  }
}
function exitWhenAppNotReady (content = 'app即将退出') {
  uni.showToast({ title: content + ', app即将退出', duration: 5000, icon: 'none' })
  setTimeout(exitNoNotice, 5000)
}
function exit (content = 'app即将退出') {
  if (!getApp()) return exitWhenAppNotReady(content)

  uni.showModal({
    title: '关闭app提示',
    content,
    showCancel: false,
    success: res => {
      if (res.confirm) exitNoNotice()
    }
  })

}
async function initUni () {
  return {
    exit,
    exitNoNotice,
    exitWhenAppNotReady,
    networkType: await getNetworkType(),
    exitbyNetwork () {
      exit('请打开网络后重新进入')
    },
    exitbyServer () {
      exit('网络请求有误，请重新进入')
    }
  }
}
export default initUni

