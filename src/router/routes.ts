export const constantRoutes = [
  {
    path: '/login',
    meta: { title: '登录' },
    type: 'sys',
    label: '',
    icon: 'el-icon-star-on',
    component: () => import('@/views/login/index.vue'),
    hidden: true
  },
  {
    path: '/404',
    hidden: true,
    component: () => import('@/views/404.vue')
  }
]
// 404
export const ERROR = [
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
import _import from './_import' // 获取组件的方法
/**
 * 生成路由
 * @param {Array} routerlist 格式化路由
 * @returns
 */
export function packageRouter(routerlist) {
  function extractIcon(icon) {
    let result
    if (icon !== null && icon) {
      result = icon.substr(9)
    } else result = ''
    return `iconfont ${result}`
  }
  const router:any[] = []
  routerlist.forEach(e => {
    let e_new = {
      path: e.path || '',
      name: e.name,
      id: e.pathId,
      type: e.type,
      label: e.label,
      icon: extractIcon(e.icon),
      widgetid: e.widgetid || '',
      component: _import(e.component),
      meta: e.meta && e.meta !== null && JSON.parse(e.meta)
    }
    if (e.childrens && e.childrens.length > 0) {
      e_new = Object.assign({}, e_new, {
        children: packageRouter(e.childrens)
      })
    }
    if (e.redirect) {
      e_new = Object.assign({}, e_new, { redirect: e.redirect })
    }
    if (e.path === '/map') {
      e_new = Object.assign({}, e_new, { hidden: true })
    }
    router.push(e_new)
  })
  return router
}
