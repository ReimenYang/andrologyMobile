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
function exit () {
  // 判断为安卓的手机
  if (libs.data.systemInfo.platform === 'android') {
    plus.runtime.quit()
  } else {
    // 判断为ios的手机，退出App
    plus.ios.import('UIApplication').sharedApplication().performSelector('exit')
  }
}
async function initUni () {
  return {
    exit,
    networkType: await getNetworkType(),
    exitbyNetwork () {
      uni.showToast({
        title: '请打开网络后重新进入',
        duration: 2000,
        icon: 'none'
      })
      setTimeout(exit, 2000)
    },
    exitbyServer () {
      uni.showToast({
        title: '网络请求有误，请重新进入',
        duration: 2000,
        icon: 'none'
      })
      setTimeout(exit, 2000)
    }
  }
}
export default initUni
