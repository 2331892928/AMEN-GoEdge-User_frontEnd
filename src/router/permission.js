import _Vue from 'vue'
import router from './index'
import LoadingBar from '../components/LoadingBar/LoadingBar'
import store from '../store/index'
import constantRoutes from './constantRoutes'
import { addTagView, setTagView } from '@/components/TagView/TagViewUtils'
import { setBreadcrumbs } from '@/components/Breadcrumbs/BreadcrumbsUtils'
import { getWebConfig } from '@/api/ConfigService'
import { Cookies, Dark } from 'quasar'
import { findAllUserServers } from '@/api/ServerService'

router.beforeEach((to, from, next) => {
  // 成功登录后处理
  handleTagViewAndBreadcrumbsAndKeepAlive(to)
  // 模拟获取 token
  // const token = sessionStorage.getItem('access_token')
  // const token = Cookies.get('verificationCode')
  const userRole = sessionStorage.getItem('user_role')
  // 存在 token 说明已经登录，且有效
  // 如果是logon页面就不请求，就在这个页面,因为请求失败时重定向到了登录页面，后期调整服务器维护页面
  // if (to.path === '/logon') {
  //   next()
  //   return
  // }
  // findAllUserServers().then((e) => {
  //   // 已经登陆了
  //   // 登录过就不能访问登录界面
  //   if (to.path === '/logon') {
  //     next({ path: '/console' })
  //   }
  //   // 存在用户权限，并且路由不为空则放行
  //   if (userRole && store.getters.getRoutes.length) {
  //     next()
  //   } else {
  //     // 模拟不存在用户权限时，获取用户权限
  //     const userRole = sessionStorage.getItem('user_role')
  //     // 并根据权限设置对应的路由
  //     store.commit('SET_ROLES_AND_ROUTES', userRole)
  //     // 如果提示 addRoutes 已弃用，使用扩展运算符完成该操作
  //     // router.addRoute(...store.getters.getRoutes)
  //     router.addRoutes(store.getters.getRoutes)
  //     // 如果 addRoutes 并未完成，路由守卫会再执行一次
  //     next({ ...to, replace: true })
  //   }
  // }).catch((e) => {
  //   if ('response' in e && e.response.status === 388) {
  //     //  未登录
  //     if (constantRoutes.some((item) => { return item.path === to.path })) {
  //       next()
  //     } else {
  //       next({ path: '/logon' })
  //     }
  //   } else if ('response' in e) {
  //     next({ path: '/NoFound500' })
  //   } else {
  //     next()
  //   }
  // })
  // 公共路由不进入
  if (constantRoutes.some((item) => { return item.path === to.path })) {
    next()
  } else {
    findAllUserServers().then((e) => {
      // 已经登陆了
      // 登录过就不能访问登录界面
      if (to.path === '/logon') {
        next({ path: '/console' })
      }
      // 存在用户权限，并且路由不为空则放行
      if (userRole && store.getters.getRoutes.length) {
        next()
      } else {
        // 模拟不存在用户权限时，获取用户权限
        const userRole = sessionStorage.getItem('user_role')
        if (userRole === null) {
          next({ path: '/logon' })
        }
        // 并根据权限设置对应的路由
        store.commit('SET_ROLES_AND_ROUTES', userRole)
        // 如果提示 addRoutes 已弃用，使用扩展运算符完成该操作
        // router.addRoute(...store.getters.getRoutes)
        router.addRoutes(store.getters.getRoutes)
        // 如果 addRoutes 并未完成，路由守卫会再执行一次
        next({ ...to, replace: true })
      }
    }).catch((e) => {
      if ('response' in e && e.response.status === 388) {
        //  未登录
        if (constantRoutes.some((item) => { return item.path === to.path })) {
          next()
        } else {
          next({ path: '/logon' })
        }
      } else if ('response' in e) {
        next({ path: '/NoFound500' })
      } else {
        next()
      }
    })
  }
})

router.afterEach(() => {
  // 使用多个 stop() 来保证 LoadingBar 在动态添加路由后正确关闭
  LoadingBar.stop()
  LoadingBar.stop()
})

export default router

/**
 * 处理 tagView 和 面包屑
 * @param to
 */
function handleTagViewAndBreadcrumbsAndKeepAlive (to) {
  if (to.name != null) {
    getWebConfig().then((e) => {
      if (to.meta.title === undefined || to.meta.title === '') {
        document.title = e.data.title
      } else {
        document.title = to.meta.title + ' | ' + e.data.title
        Cookies.set('websiteTitle', e.data.title)
      }
      Cookies.set('verificationCode', e.data.whetherVerificationCodeIsEnabl)
      Cookies.set('clusterId', e.data.nodeClusterId)
    }).catch((e) => {
      console.log(e)
      if (to.meta.title === undefined || to.meta.title === '') {
        document.title = _Vue.prototype.$title
      } else {
        document.title = to.meta.title + _Vue.prototype.$title
      }
      Cookies.remove('verificationCode')
    })

    // document.title = to.meta.title + _Vue.prototype.$title
    LoadingBar.start()
    // 判断要添加的 to 是否是公共路由
    for (let i = 0; i < constantRoutes.length; i++) {
      if (constantRoutes[i].path === to.path) {
        return
      }
    }
    // 判断是否为刷新操作，如果是刷新操作则从 sessionStorage 获取保存的 tagView 信息
    let tagViewOnSS = []
    JSON.parse(window.sessionStorage.getItem('tagView')) === null ? window.sessionStorage.setItem('tagView', '[]') : tagViewOnSS = JSON.parse(window.sessionStorage.getItem('tagView'))
    if (store.getters.getTagView.length === 0 && tagViewOnSS.length !== 0) {
      setTagView(tagViewOnSS)
      store.commit('SET_KEEPALIVE_LIST', tagViewOnSS)
    } else {
      addTagView(to)
    }
    setBreadcrumbs(to.matched, to.query)
    handleKeepAlive(to)
  }
}

/**
 * 处理多余的 layout : router-view，让当前组件保持在第一层 index : router-view 之下
 * 这个方法无法过滤用来做嵌套路由的按需加载的 <layout>
 * @param to
 */
function handleKeepAlive (to) {
  if (to.matched && to.matched.length > 2) {
    for (let i = 0; i < to.matched.length; i++) {
      const element = to.matched[i]
      if (element.components.default.name === 'layout') {
        to.matched.splice(i, 1)
        handleKeepAlive(to)
      }
    }
  }
}

/**
 * 这个方法可以过滤用来做嵌套路由的按需加载的 <layout>
 * @param to
 */
// async function handleKeepAlive (to) {
//   if (to.matched && to.matched.length > 2) {
//     for (let i = 0; i < to.matched.length; i++) {
//       const element = to.matched[i]
//       if (element.components.default.name === 'layout') {
//         to.matched.splice(i, 1)
//         await handleKeepAlive(to)
//       }
//       if (typeof element.components.default === 'function') {
//         await element.components.default()
//         await handleKeepAlive(to)
//       }
//     }
//   }
// }
