import Axios from 'axios'
import Vue from 'vue'
import { Notify } from 'quasar'
import qs from 'qs'

/**
 * axios 初始化
 */
const axios = Axios.create({
  // baseURL: Vue.prototype.$baseURL, // 请求基地址
  timeout: Vue.prototype.$timeOut // 超时时间
})

// 请求拦截器
axios.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('access_token')
    config.headers.Authorization = 'Bearer ' + token
    if (config.type) {
      switch (config.type) {
        case 'FORM-DATA':
          config.transformRequest = [data => { return 'args=' + JSON.stringify(data) }]
          break
        case 'FORM':
          config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
          config.data = qs.stringify(config.data)
          break
        default:
          break
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    const defaultNotify = {
      message: '未知错误',
      icon: 'warning',
      color: 'warning',
      position: 'top',
      timeout: 1500
    }
    if (error.code === 'ECONNABORTED' || error.message.indexOf('timeout') !== -1 || error.message === 'Network Error') {
      defaultNotify.message = '网络异常'
      Notify.create(defaultNotify)
      return Promise.reject(error)
    }
    switch (error.response.status) {
      case 388:
        defaultNotify.message = '你还没有登陆或登录态失效，请重新登陆'
        Notify.create(defaultNotify)
        break
      case 400:
        defaultNotify.message = '你还没有登陆或登录态失效或无权限，请重新登陆'
        Notify.create(defaultNotify)
        break
      case 403:
        defaultNotify.message = '拒绝访问(403)'
        Notify.create(defaultNotify)
        break
      case 404:
        defaultNotify.message = '资源不存在(404)'
        Notify.create(defaultNotify)
        break
      case 405:
        defaultNotify.message = '请求方式不允许'
        Notify.create(defaultNotify)
        break
      case 408:
        defaultNotify.message = '请求超时(408)'
        Notify.create(defaultNotify)
        break
      case 422:
        defaultNotify.message = '参数异常或丢失。如果是注册页面，可能是你的密码不规范，必须大小写+数字+符号'
        Notify.create(defaultNotify)
        break
      case 500:
        defaultNotify.message = '服务器错误(500)'
        Notify.create(defaultNotify)
        break
      case 501:
        defaultNotify.message = '服务未实现(501)'
        Notify.create(defaultNotify)
        break
      case 502:
        defaultNotify.message = '网络错误(502)'
        Notify.create(defaultNotify)
        break
      case 503:
        defaultNotify.message = '服务不可用(503)'
        Notify.create(defaultNotify)
        break
      case 504:
        defaultNotify.message = '网络超时(504)'
        Notify.create(defaultNotify)
        break
      case 505:
        defaultNotify.message = 'HTTP版本不受支持(505)'
        Notify.create(defaultNotify)
        break
      default:
        break
    }
    return Promise.reject(error)
  }
)

export default axios
