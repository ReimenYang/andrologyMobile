import axios from 'axios'
import api from './api'
import configProject from '@/libs/config.js'
import utils from '@/libs/utils'
// 校验请求 ，类似拦截请求报错
const validateStatus = status => {
  // console.log(status)
  return status >= 200 && status < 300 // default
}

async function request (api, params, config = {}) {
  configProject.globalData.axios = axios
  api = JSON.parse(JSON.stringify(api))
  let data = {}
  switch (api.dataType) {
    case 'formData':
      {
        let _formData = new FormData()
        Object.keys(params).forEach(key => {
          _formData.append(key, params[key])
        })
        data = _formData
      }
      break
    case 'form':
    case 'json':
      data = params
      break
    case 'keyValue':
    case undefined:
      api.dataType = 'keyValue'
      data = utils.object.paramsToKeyValue(params)
      break
  }
  if (api.method === 'GET') data = utils.object.paramsToKeyValue(params)

  if (api.group) api.url = configProject.apiGroup[api.group] + api.url
  if (api.url.indexOf('http://') !== 0 && api.url.indexOf('https://') !== 0)
    api.url = configProject.urlApi + api.url

  if (api.dataType === 'keyValue') api.url += '?' + data
  //   const response = await axios({ ...api, data, validateStatus, ...config });
  if (configProject.globalData.headers && !config.important) config = { headers: configProject.globalData.headers, ...config }

  // #ifdef APP-PLUS || MP-WEIXIN
  return new Promise((resolve, reject) => {
    uni.request({ // 发送请求
      ...api, data, ...config,
      header: configProject.globalData.headers,
      success: (res) => { // 数据获取成功
        // console.log('成功', res, validateStatus(res.statusCode))
        if (configProject.projectName === 'limitDeviceApp') {
          // limitDeviceApp项目特有逻辑
          if (validateStatus(res.statusCode)) {// 网络层拦截错误
            let _data = {}
            try {
              _data = JSON.parse(res.data)
            } catch (e) {
              _data = res.data
            }
            if (utils.object.isObject(_data) && _data.code === 200) return resolve(_data)
            if (utils.object.isObject(_data) && _data.errorMessage) return uni.showToast({ title: _data.errorMessage, icon: 'none', duration: 2000 })
            reject(_data)

          } else {
            let err = ''
            try {
              err = JSON.stringify(JSON.parse(res.data).errors)
            } catch (e) {
              err = res.data
            }
            uni.showToast({ title: err, icon: 'none', duration: 2000 })
            reject(err)
          }
          return
        }
        try {
          resolve(JSON.parse(res.data))
        } catch (e) {
          resolve(res.data)
        }
      },
      fail: (err) => { // 失败操作
        uni.showToast({ title: String(err), icon: 'none', duration: 2000 })
        reject(err)
      }
    })
  })
  // #endif

  // #ifndef APP-PLUS || MP-WEIXIN
  // eslint-disable-next-line no-unreachable
  const response = await axios({ ...api, data, ...config })
  // 拦截请求报错
  // .catch(function(error) {
  //   if (error.response) console.log(error.response.status);
  // });
  // 请求正常，后端返回状态不正常
  if (response.data.code && response.data.code !== 0) uni.showToast({ title: String(response.data.msg), icon: 'none', duration: 2000 })
  switch (response.status) {
    case 200:
      return response.data

    default:
      return response
  }
  // #endif
}
export default { request, api, configProject }
