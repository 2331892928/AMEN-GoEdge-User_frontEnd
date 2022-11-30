/**
 * 公共路由
 */
const constantRoutes = [
  {
    path: '/',
    name: 'index.vue',
    redirect: '/console',
    meta: {
      title: ''
    },
    component: () => import('@/views/index/index')
  },
  {
    path: '/logon',
    name: 'Logon.vue',
    meta: {
      title: '登录'
    },
    component: () => import('@/views/logon/Logon')
  },
  {
    path: '/NoFound404',
    name: 'NoFound404',
    meta: {
      title: '404',
      icon: 'sentiment_dissatisfied',
      isHidden: true
    },
    component: () => import('@/components/404/NoFound404')
  },
  {
    path: '/NoFound500',
    name: 'NoFound500',
    meta: {
      title: '500',
      icon: 'sentiment_dissatisfied',
      isHidden: true
    },
    component: () => import('@/components/500/NoFound500')
  }
]

export default constantRoutes
