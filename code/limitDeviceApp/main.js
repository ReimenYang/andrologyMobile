import Vue from 'vue'
import App from './App'
import checkReady from '@/libs/uniInit'
import libs from '@/libs'
// import jsencrypt from '@/js_sdk/jsencrypt-Rsa/jsencrypt/jsencrypt.vue'
let { mode, vision, updateTime, globalData, deviceTypeId, subName, isNewDevice, whiteList, blackList } = libs.configProject
let BioStimBleModule = libs.global.ble.BioStimBleModule
if (whiteList.length) BioStimBleModule.whiteList = whiteList
if (blackList.length) BioStimBleModule.blackList = blackList
console.log('初始化蓝牙模块')
globalData.isNewDevice = isNewDevice || 'N'
console.log('是否使用新设备:', globalData.isNewDevice)
console.log('白名单', BioStimBleModule.whiteList)
console.log('黑名单', BioStimBleModule.blackList)
// 以下三项设置改动机会不大，因此没有放到projectConfig
// 停止搜索蓝牙设备超时设置,默认:1000 * 10,单位：毫秒
// BioStimBleModule.discoveryTimeout = 1000 * 3
console.log('停止搜索蓝牙设备超时设置', BioStimBleModule.discoveryTimeout)
// 连接低功耗蓝牙设备超时设置,默认:1000 * 10,单位：毫秒
// BioStimBleModule.connectTimeOut(1000 * 3)
console.log('连接低功耗蓝牙设备超时设置', BioStimBleModule.connectTimeOut())
// 控制writeBLECharacteristicValue时间间隔,默认:100,单位：毫秒
// BioStimBleModule.writeTime(100)
console.log('控制writeBLECharacteristicValue时间间隔', BioStimBleModule.writeTime())

async function login (phone) {
  // 之前ssl生成的公钥，复制的时候要小心不要有空格
  //   const publiukey = `-----BEGIN PUBLIC KEY-----
  // MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDXmihNG2sviXVLaTzuWQ5WEYU6ZUV177quq1veOlVW12gsbEoEgJzRtbwr3bqoTM1C9n18nA1VdCs451ZUPTpJFclj01sethwg4nBsyqYzKN/ELRi3DWpkH35v2Pno+W8O0vXNeHKUFXOxsVdeXzq8zSo4Iy3fH3fwTGFyl/kPSwIDAQAB
  // -----END PUBLIC KEY-----`.trim()
  // let encryptedPhone = jsencrypt.setEncrypt(publiukey, phone)  // 对内容进行加密

  let accessToken = ''
  let appid = {
    PE: '8aa43396-9283-4eba-88ad-efe30d4ef2cf',
    periodPain: 'a4d3eb8f-bab7-49b6-a2d9-1b6e8be181d8'
  }[subName]
  globalData.headers = {
    appTerminalPlatform: libs.data.systemInfo.platform,
    appVersion: [mode, vision, updateTime].join('.'),
    appGroup: mode,
    accessToken,
    deviceTypeId,
    appid,
    phone
  }
  // 请求用户信息
  // console.log('请求用户信息', phone, encryptedPhone)
  // 优E康
  // let { data } = await libs.request(libs.api.wyjkDevice.user.oneClickLoginNormalPhone, { phone })
  // accessToken=data.userLogin.accessToken
  // let userInfo = globalData.userInfo = data.coreUser

  // 易循环
  let { data } = await libs.request(libs.api.ECirculation.user.login, { phone })
  data.realname = data.userName
  let userInfo = globalData.userInfo = data

  // console.log('请求用户信息', data)
  console.log('当前用户：', userInfo.realname, userInfo)
}

let univerifyStyle = { // 一键登录设置
  force: true, // 自定义强制登录参数，不登录则退出程序，默认值： false
  fullScreen: true, // 是否全屏显示，默认值： false
  icon: { path: '/static/logo.png' },
  closeIcon: { path: '/static/transparent.png' }, // 自定义关闭按钮，仅支持本地图片。 HBuilderX3.3.7+版本支持
  otherLoginButton: {
    visible: false, // 是否显示其他登录按钮，默认值：true
  }
}
App.mpType = 'app'
const app = new Vue({ ...App })
!(async function initReady (n = 0) {
  if (n > 10) return console.log('初始化失败')
  if (checkReady() !== true) return setTimeout(() => { initReady(n + 1) }, 100)
  if (libs.data.networkType === 'none') return libs.data.exitbyNetwork()
  let phone = libs.data.getStorage('phone')
  if (!phone) {
    phone = libs.data.random(7)
    // phone = 13268125215//罗
    // phone = 18924166730// 红米
    // phone = 15914214657 //邦森
    // 检查是否应用市场审核中
    if (!globalData.updateAppConfig.review.includes(vision)) phone = await libs.global.uniLogin.auto(univerifyStyle)
    libs.data.setStorage('phone', phone)
  }

  await login(phone)
  app.$mount()
})()
