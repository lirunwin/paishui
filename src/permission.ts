import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 从cookie中获取令牌
import getPageTitle from '@/utils/get-page-title'

import { ERROR } from '@/router/routes'

NProgress.configure({ showSpinner: false }) // NProgress配置

const whiteList = ['/login'] // 无重定向白名单

router.beforeEach(async(to, from, next) => {
  // 开始进度条
  NProgress.start()

  // 设置浏览器标题
  document.title = getPageTitle(to.meta.title)

  // 确定客户是否已登录
  function check() {
    return new Promise(resolve => {
      let result = false
      const token = sessionStorage.getItem('token') || false
      const userId = sessionStorage.getItem('userId') || false
      if (token && userId) result = true
      else result = false
      resolve(result)
    })
  }
  // const hasToken = getToken()
  const hasToken = await check()
  // console.log(hasToken)
  // console.log('------', hasToken)
  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，请重定向到主页
      next({ path: '/' })
      NProgress.done()
    } else {
      const addRoutes = store.getters.addRoutes && store.getters.addRoutes.length > 0
      if (addRoutes) {
        next()
      } else {
        try {
          // 获取路由
          
          const excludeRoutes = ['marketing', 'meterReadingManage', 'businessManage', 'meterServiceManage', 'hotlineManage', 'productionOperations', 'pipeNets']
          let accessRoutes = await store.dispatch('routeSetting/getRouter')
          accessRoutes = accessRoutes.filter(item => {
            if (!excludeRoutes.includes(item.name)) {
              return item
            }
          })
          // console.log('*******', accessRoutes)
          // 动态添加可访问路由
          // console.log('4444', accessRoutes)
          router.addRoutes(accessRoutes.concat(ERROR))
          // 确保addRoutes完整的hack方法
          // console.log('qqqqq', to)
          next({ ...to })
        } catch (error) {
          debugger
          console.log(error)
          error = { message: '该账号暂无权限，请联系管理员分配权限！' }
          // 移除令牌并转到登录页以重新登录
          await store.dispatch('user/resetToken')
          Message.error(error.message)
          // Message.error(error || 'Has Error')
          // // next(`/login?redirect=${to.path}`)
          next(`/login`)
          NProgress.done()
        }
      }
    }
  } else {
    /* 没有标记*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免费登录白名单中，直接进入
      next()
    } else {
      // 没有访问权限的其他页将重定向到登录页。
      // next(`/login`)
      next(`/login`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 完成进度条
  NProgress.done()
})
