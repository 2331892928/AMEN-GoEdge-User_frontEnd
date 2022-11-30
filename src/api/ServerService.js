import _axios from '../axios/AxiosConfig'
// import Vue from 'vue'
import { routerConfig } from '@/routerConfig/routerConfig'
import { Cookies } from 'quasar'

export function createServer (domian, name) {
  const clusterId = Cookies.get('clusterId')
  return _axios({
    url: routerConfig.proxy + routerConfig.ServerService.main + routerConfig.ServerService.createServer,
    method: 'post',
    responseType: 'json',
    data: {
      domian: domian,
      name: name,
      clusterId: clusterId === undefined ? 1 : clusterId
    }
  })
}
export function findAllUserServers () {
  return _axios({
    url: routerConfig.proxy + routerConfig.ServerService.main + routerConfig.ServerService.findAllUserServers,
    method: 'get',
    responseType: 'json'
  })
}
export function updateServerIsOn (serverId, isOn) {
  return _axios({
    url: routerConfig.proxy + routerConfig.ServerService.main + routerConfig.ServerService.updateDomainNameStatus,
    method: 'post',
    responseType: 'json',
    data: {
      serverId: serverId,
      isOn: isOn
    }
  })
}
export function deleteServer (serverId) {
  return _axios({
    url: routerConfig.proxy + routerConfig.ServerService.main + routerConfig.ServerService.deleteServer,
    method: 'post',
    responseType: 'json',
    data: {
      serverId: serverId
    }
  })
}
export function findEnabledServerConfig (serverId) {
  return _axios({
    url: routerConfig.proxy + routerConfig.ServerService.main + routerConfig.ServerService.findEnabledServerConfig,
    method: 'post',
    responseType: 'json',
    data: {
      serverId: serverId
    }
  })
}

export function updateServerReverseProxy (serverId,reverseProxyJSON) {
  return _axios({
    url: routerConfig.proxy + routerConfig.ServerService.main + routerConfig.ServerService.updateServerReverseProxy,
    method: 'post',
    responseType: 'json',
    data: {
      serverId: serverId,
      reverseProxyJSON: reverseProxyJSON
    }
  })
}
export function updateServerHTTPS (serverId,isOn) {
  return _axios({
    url: routerConfig.proxy + routerConfig.ServerService.main + routerConfig.ServerService.updateServerHTTPS,
    method: 'post',
    responseType: 'json',
    data: {
      serverId: serverId,
      isOn: isOn
    }
  })
}
export function updateServerHTTP (serverId,isOn) {
  return _axios({
    url: routerConfig.proxy + routerConfig.ServerService.main + routerConfig.ServerService.updateServerHTTP,
    method: 'post',
    responseType: 'json',
    data: {
      serverId: serverId,
      isOn: isOn
    }
  })
}
