module.exports = {
  name: '男科大数据平台web', // 项目名称
  projectName: 'andrologyMobile', // 项目代号
  port: 8866, // 本地运行的端口
  framework: 'uni', // 使用前端框架:vue||uni
  appid: '__UNI__F0B9371', // 个人appid __UNI__F0B9371 // 公司appid __UNI__F017811
  // 一键登录
  // apiKey: '2cbeb0083ca06ce71e0c8aa700f8da9b', // 公司appid apiKey
  // apiSecret: '2523bede5154496dd21c9a9f68b2362c', // 公司appid apiSecret
  apiKey: 'e72a85e683138b13b23129f065768f49', // 个人appid apiKey
  apiSecret: '61e88a6b012b160a927a064c9fb7ef52', // 个人appid apiSecret
  // 发短信
  smsKey: 'c2dd9accc4efb6d179eb1c986d9a0c22', // 个人appid apiKey
  smsSecret: 'e328f8ba8628ecb3b0561ebbe06bbe15', // 个人appid apiSecret
  // 云数据库
  provider: 'aliyun', // aliyun、tencent
  spaceId: 'ec34b204-8f78-4a39-8ebd-3c4b40bf1b0a', // 个人appid apiKey
  clientSecret: 'Gwb8Fu5rEfeQEms8WnmjwA==', // 个人appid apiSecret
  projectType: { wechat: false, browser: true, app: false }, // 项目要运行的环境
  loginType: {
    phone: false // 一键登录
  }, // 用户登录方式
  vision: '0.01Bate', // 项目版本
  updateTime: '20230901', // 版本升级时间
  // webDeveloper: '127.0.0.1', // 前端开发本地路径
  webDeveloper: '10.10.20.101', 	// Reimen
  // webDeveloper: 'dev-weiming.xinuowang.com', 	// Reimen
  // webDeveloper: '10.10.20.41',
  // webDeveloper: 'localhost'
  mode: 'test', // dev 开发环境、test 测试环境、produce 正式环境、demo 演示环境
}
