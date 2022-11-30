import _axios from '../axios/AxiosConfig'
// import Vue from 'vue'
import { routerConfig } from '@/routerConfig/routerConfig'

export function updateHTTPWebRedirectToHTTPS (httpWebId, serverId,isOn, status) {
  return _axios({
    url: routerConfig.proxy + routerConfig.HTTPWebService.main + routerConfig.HTTPWebService.updateHTTPWebRedirectToHTTPS,
    method: 'post',
    responseType: 'json',
    data: {
      httpWebId: httpWebId,
      serverId: serverId,
      isOn: isOn,
      status: status
    }
  })
}
