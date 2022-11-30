import Layout from '../components/Layout/Layout'

/**
 * 需要授权访问的路由
 */
const asyncRoutesChildren = [
  {
    path: '/console',
    name: 'Home',
    meta: {
      roles: ['admin', 'editor', 'test'],
      title: '主页',
      icon: 'home',
      keepAlive: true
    },
    component: () => import('@/views/home/Home.vue')
  },
  {
    path: '/domainName',
    name: 'domainNameMain',
    meta: {
      roles: ['admin', 'editor'],
      title: '站点管理',
      itemLabel: 'SOME LABEL1',
      icon: 'fas fa-globe-asia',
      isOpen: true
    },
    component: Layout,
    children: [
      {
        path: 'domainNameList',
        name: 'domainName',
        meta: {
          roles: ['admin', 'editor'],
          title: '域名管理',
          icon: 'apps',
          keepAlive: true
        },
        component: () => import('@/views/domainName/domainNameList')
      },
      {
        path: 'domain',
        name: 'domain',
        meta: {
          roles: ['admin', 'editor'],
          title: '站点配置',
          icon: 'apps',
          keepAlive: true
        },
        component: () => import('@/views/domainName/domain')
      },
    ]
  },
  {
    path: '/certMain',
    name: 'certMain',
    meta: {
      roles: ['admin', 'editor'],
      title: '证书管理',
      icon: 'fas fa-globe-asia',
      isOpen: true
    },
    component: Layout,
    children: [
      {
        path: 'cert',
        name: 'cert',
        meta: {
          roles: ['admin', 'editor'],
          title: '证书管理',
          icon: 'apps',
          keepAlive: true
        },
        component: () => import('@/views/cert/cert')
      },
    ]
  },
  {
    path: '/console/tableDetail',
    name: 'TableDetail',
    meta: {
      roles: ['admin', 'editor'],
      title: 'Treats 详情',
      icon: 'blur_linear',
      isHidden: true
    },
    component: () => import('@/views/home/TableDetail')
  },
  {
    path: '*', // 此处需置于最底部
    redirect: '/NoFound404',
    meta: {
      roles: ['admin', 'test'],
      isHidden: true
    }
  }
]

const asyncRoutes = [
  {
    path: '/console',
    name: 'index',
    redirect: '/console',
    component: () => import('@/views/Index'),
    children: asyncRoutesChildren
  },
  {
    path: '*', // 此处需置于最底部
    redirect: '/NoFound404',
    meta: {
      isHidden: true
    }
  }
]

export default asyncRoutes

export { asyncRoutesChildren }
