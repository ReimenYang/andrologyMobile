let verify = {}
verify.rule = {
  phone: /^1[23456789]\d{9}$/, // 校验手机
  phoneOrTel: /(^1[23456789]\d{9}$)|((\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14})/, // 校验手机或电话号码
  mail: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/ // 校验邮箱
}

Object.keys(verify.rule).forEach(key => {
  verify[key] = (str) => {
    return verify.rule[key].test(str)
  }
})

verify.isEmpty = data => {// 可判断null,undefined,false,'', 0,{},[]
  if (!(data || '')) return true
  if (Array.isArray(data)) return !data.length
  return !Object.keys(data).length
}
export default verify
