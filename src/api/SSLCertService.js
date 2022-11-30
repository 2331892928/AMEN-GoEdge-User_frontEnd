
import _axios from '../axios/AxiosConfig'
// import Vue from 'vue'
import { routerConfig } from '@/routerConfig/routerConfig'
import { Cookies } from 'quasar'

export function createSSLCert (name, isCA, certData, keyData) {
  return _axios({
    url: routerConfig.proxy + routerConfig.SSLCertService.main + routerConfig.SSLCertService.createSSLCert,
    method: 'post',
    responseType: 'json',
    data: {
      name: name,
      isCA: isCA,
      certData: certData,
      keyData: keyData
    }
  })
}
export function listSSLCerts (offset, size, keyword) {
  return _axios({
    url: routerConfig.proxy + routerConfig.SSLCertService.main + routerConfig.SSLCertService.listSSLCerts,
    method: 'post',
    responseType: 'json',
    data: {
      offset: offset,
      size: size,
      keyword: keyword
    }
  })
}
export function deleteSSLCert (sslCertId) {
  return _axios({
    url: routerConfig.proxy + routerConfig.SSLCertService.main + routerConfig.SSLCertService.deleteSSLCert,
    method: 'post',
    responseType: 'json',
    data: {
      sslCertId: sslCertId,
    }
  })
}
