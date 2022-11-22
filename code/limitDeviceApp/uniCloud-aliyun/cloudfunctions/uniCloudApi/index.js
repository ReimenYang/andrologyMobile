'use strict'
exports.main = async (event, context) => {
  // event为客户端上传的参数
  let res = {
    code: 0,
    message: '',
    content: {}
  }
  switch (event.actionType) {
    case 'sendSms':
      res.content = await uniCloud.sendSms(event)
      res.message = '短信发送'
      console.log('短信发送结果 : ', res.content)
      break
    case 'getPhoneNumber':
      res.content = await uniCloud.getPhoneNumber(event)
      console.log('一键登录结果 : ', res.content.phoneNumber)
      break
  }
  // 返回数据给客户端
  return res
}
