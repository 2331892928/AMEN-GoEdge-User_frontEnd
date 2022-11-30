import _axios from '../axios/AxiosConfig'
// import Vue from 'vue'
import { routerConfig } from '@/routerConfig/routerConfig'

export function getWebConfig () {
  return _axios({
    url: routerConfig.proxy + routerConfig.ConfigService.main + routerConfig.ConfigService.get,
    method: 'get',
    responseType: 'text'
  })
}
