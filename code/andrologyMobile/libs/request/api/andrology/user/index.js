const apis = {
  getUserVerifyCode: { method: 'POST', url: 'user/getUserVerifyCode', group: 'andrology', dataType: 'json' },//获取发送短信用的验证码
  sendSMSCode: { method: 'POST', url: 'user/sendSMSCode', group: 'andrology', dataType: 'json' },//发送短信验证码
  login: { method: 'POST', url: 'user/login', group: 'andrology', dataType: 'json' },//用户登录
  loginForProject: { method: 'POST', url: 'user/loginForProject', group: 'andrology', dataType: 'json' },//用户登录指定项目
  modifyPassword: { method: 'POST', url: 'user/modifyPassword', group: 'andrology', dataType: 'json' },//修改密码
  getUserInfo: { method: 'POST', url: 'user/getUserInfo', group: 'andrology', dataType: 'json' },//获取个人信息
  modifyUserInfo: { method: 'POST', url: 'user/modifyUserInfo', group: 'andrology', dataType: 'json' },//修改个人信息
  updateSignature: { method: 'POST', url: 'user/updateSignature', group: 'andrology', dataType: 'json' },//上传签名
}
export default apis
