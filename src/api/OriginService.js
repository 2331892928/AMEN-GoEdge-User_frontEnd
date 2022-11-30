import _axios from '../axios/AxiosConfig'
// import Vue from 'vue'
import { routerConfig } from '@/routerConfig/routerConfig'

export function findEnabledOrigin (originId) {
  return _axios({
    url: routerConfig.proxy + routerConfig.OriginService.main + routerConfig.OriginService.findEnabledOrigin,
    method: 'post',
    responseType: 'json',
    data: {
      originId: originId
    }
  })
}

export function updateOrigin (originJson) {
  return _axios({
    url: routerConfig.proxy + routerConfig.OriginService.main + routerConfig.OriginService.updateOrigin,
    method: 'post',
    responseType: 'json',
    data: {
      OriginJson: originJson
    }
  })
}

export function deleteOrigin (originId, reverseProxyId, isOn, originJson) {
  return _axios({
    url: routerConfig.proxy + routerConfig.OriginService.main + routerConfig.OriginService.deleteOrigin,
    method: 'post',
    responseType: 'json',
    data: {
      originId: originId,
      reverseProxyId: reverseProxyId,
      isOn: isOn,
      originJson: originJson
    }
  })
}

export function createOrigin (originJson, isOn, reverseProxyId) {
  return _axios({
    url: routerConfig.proxy + routerConfig.OriginService.main + routerConfig.OriginService.createOrigin,
    method: 'post',
    responseType: 'json',
    data: {
      originJson: originJson,
      isOn: isOn,
      reverseProxyId: reverseProxyId
    }
  })
}
export function updateOriginSSL (serverId, certId) {
  return _axios({
    url: routerConfig.proxy + routerConfig.OriginService.main + routerConfig.OriginService.updateOriginSSL,
    method: 'post',
    responseType: 'json',
    data: {
      serverId: serverId,
      certId: certId
    }
  })
}
