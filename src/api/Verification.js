import _axios from '../axios/AxiosConfig'
// import Vue from 'vue'
import { routerConfig } from '@/routerConfig/routerConfig'

export function getcode (username, ticket = null, randstr = null) {
  return _axios({
    url: routerConfig.proxy + routerConfig.Verification.main + routerConfig.Verification.getcode,
    method: 'post',
    responseType: 'json',
    data: {
      number: username,
      ticket: ticket,
      randstr: randstr
    }
  })
}
