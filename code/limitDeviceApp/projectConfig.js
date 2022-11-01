module.exports = {
  name: '易循环', // 项目名称
  projectName: 'ECirculation', // 项目代号
  port: 8862, // 本地运行的端口
  framework: 'uni', // 使用前端框架:vue||uni
  appid: '__UNI__0940A4C',
  // apiKey: '2cbeb0083ca06ce71e0c8aa700f8da9b', // 在开发者中心开通服务并获取apiKey
  // apiSecret: '2523bede5154496dd21c9a9f68b2362c', // 在开发者中心开通服务并获取apiSecret
  apiKey: 'e72a85e683138b13b23129f065768f49', // 在开发者中心开通服务并获取apiKey
  apiSecret: '61e88a6b012b160a927a064c9fb7ef52', // 在开发者中心开通服务并获取apiSecret
  projectType: {
    wechat: false,
    browser: false,
    app: true
  }, // 项目要运行的环境
  vision: '0.02Bate', // 项目版本
  updateTime: '20221101', // 版本升级时间
  // webDeveloper: '127.0.0.1', // 前端开发本地路径
  webDeveloper: '10.10.20.101', // Reimen
  // webDeveloper: 'dev-weiming.xinuowang.com', 	// Reimen
  // webDeveloper: '10.10.20.41',
  // webDeveloper: 'localhost'
  mode: 'dev', // dev 开发环境、 test 测试环境、 produce 正式环境、 demo 演示环境、 pre 预发布环境

  /**  消费电子特有字段*/

  /** 设备类型id(deviceTypeId)
   * 14:DJZ-A
   * 15:ble
   * 16:优E康
   */
  deviceTypeId: 16,
  /** 针对病症分类的app(subName)
   * periodPain 痛经
   * PE 早泄
   */
  subName: 'PE',
  /** 是否使用多通道设备(isNewDevice)
   * Y/N 是/否
   */
  isNewDevice: 'Y',
  /** 允许搜索到的白名单(whiteList)
   * 默认：['MuscStim', 'BioStim', 'SSConsume']
   */
  whiteList: ['OZ-A3', 'OZ-A2', 'SSConsume'],
  /** 不允许搜索到的黑名单(blackList)
   * 默认：[]
   */
  blackList: []
}
