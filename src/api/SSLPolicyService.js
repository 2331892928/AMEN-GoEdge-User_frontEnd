import _axios from '../axios/AxiosConfig'
// import Vue from 'vue'
import { routerConfig } from '@/routerConfig/routerConfig'

export function updateSSLPolicy (sslPolicyId, ocsp, sslID, hsts, minVersion, http2Enabled) {
  return _axios({
    url: routerConfig.proxy + routerConfig.SSLPolicyService.main + routerConfig.SSLPolicyService.updateSSLPolicy,
    method: 'post',
    responseType: 'json',
    data: {
      sslPolicyId: sslPolicyId,
      ocsp: ocsp,
      sslID: sslID,
      hsts: hsts,
      minVersion: minVersion,
      http2Enabled: http2Enabled
    }
  })
}
