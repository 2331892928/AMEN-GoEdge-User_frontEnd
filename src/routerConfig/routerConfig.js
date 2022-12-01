const routerConfig = {
  // rootUrl: rootUrl,
  // semanticSearchUrl: rootUrl + '/search/semantic',
  // detailUrl: rootUrl + '/detail',
  // summaryUrl: rootUrl + '/summary',
  // transformUrl: rootUrl + '/transform',
  // keywordPickUrl: rootUrl + '/keywordpick'
  proxy: '/api',
  ConfigService: {
    main: '/ConfigService',
    get: '/get'
  },
  UserService: {
    main: '/UserService',
    loginUser: '/loginUser',
    registerUser: '/registerUser',
    logout: '/logout'
  },
  Verification: {
    main: '/Verification',
    getcode: '/getcode'
  },
  ServerService: {
    main: '/ServerService',
    findAllUserServers: '/findAllUserServers',
    createServer: '/createServer',
    updateDomainNameStatus: '/updateServerIsOn',
    deleteServer: '/deleteServer',
    findEnabledServerConfig: '/findEnabledServerConfig',
    updateServerReverseProxy: '/updateServerReverseProxy',
    updateServerHTTPS: '/updateServerHTTPS',
    updateServerHTTP: '/updateServerHTTP',
    updateSSLPolicy: '/updateSSLPolicy'
  },
  OriginService: {
    main: '/OriginService',
    findEnabledOrigin: '/findEnabledOrigin',
    updateOrigin: '/updateOrigin',
    deleteOrigin: '/deleteOrigin',
    createOrigin: '/createOrigin',
    updateOriginSSL: '/updateOriginSSL'
  },
  SSLCertService: {
    main: '/SSLCertService',
    createSSLCert: '/createSSLCert',
    listSSLCerts: '/listSSLCerts',
    deleteSSLCert: '/deleteSSLCert'
  },
  SSLPolicyService: {
    main: '/SSLPolicyService',
    updateSSLPolicy: '/updateSSLPolicy'
  },
  HTTPWebService: {
    main: '/HTTPWebService',
    updateHTTPWebRedirectToHTTPS: '/updateHTTPWebRedirectToHTTPS'
  }
}
// export default routerConfig
export {
  routerConfig
}
