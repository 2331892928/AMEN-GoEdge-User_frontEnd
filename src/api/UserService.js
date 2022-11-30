import _axios from '../axios/AxiosConfig'
// import Vue from 'vue'
import { routerConfig } from '@/routerConfig/routerConfig'

export function loginUser (username, password, ticket = null, randstr = null) {
  return _axios({
    url: routerConfig.proxy + routerConfig.UserService.main + routerConfig.UserService.loginUser,
    method: 'post',
    responseType: 'json',
    data: {
      username: username,
      password: password,
      ticket: ticket,
      randstr: randstr
    }
  })
}
export function registerUser (username, password, code, ticket = null, randstr = null) {
  return _axios({
    url: routerConfig.proxy + routerConfig.UserService.main + routerConfig.UserService.registerUser,
    method: 'post',
    responseType: 'json',
    data: {
      username: username,
      password: password,
      code: code,
      ticket: ticket,
      randstr: randstr
    }
  })
}
export function logout () {
  return _axios({
    url: routerConfig.proxy + routerConfig.UserService.main + routerConfig.UserService.logout,
    method: 'post',
    responseType: 'json',
  })
}
