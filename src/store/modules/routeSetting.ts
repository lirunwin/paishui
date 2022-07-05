import { packageRouter, ERROR } from '@/router/routes'
import { getUserMenu } from '@/api/user'
import userx from './user'
import { disabledMenus, gisNames } from '@/utils/constant'

const state = {
  routes: [],
  addRoutes: [],
  menus: [],
  dynamicRoutes: {}
}
const bigScreenRoutes = {
  path: '/bigScreen',
  component: () => import('@/views/bigScreen/index.vue'),
  meta: { title: '一张图' },
  type: 'sys',
  label: '一张图',
  icon: 'el-icon-star-on'
}
const dashboardRoute = {
  path: '/',
  component: () => import('@/layout/index.vue'),
  redirect: '/dashboard',
  type: 'sys',
  label: '首页',
  icon: 'el-icon-star-on',
  children: [
    {
      path: 'dashboard',
      name: 'Dashboard',
      type: 'sys',
      label: '首页',
      icon: 'el-icon-star-on',
      component: () => import('@/views/currentSystem/dashboard/index.vue'),
      meta: { title: '首页' }
    },
    {
      path: '/dashboard/report',
      name: 'Report',
      type: 'sys',
      label: '首页报表',
      icon: 'el-icon-star-on',
      component: () => import('@/views/currentSystem/dashboard/report/index.vue'),
      meta: { title: '首页报表' }
    }
  ]
}

const mapRoute = {
  path: '/map',
  component: () => import('@/layout/index.vue'),
  type: 'sys',
  label: '地图',
  icon: 'el-icon-star-on',
  hidden: true,
  children: [
    {
      path: '',
      name: 'Map',
      type: 'sys',
      label: '地图',
      icon: 'el-icon-star-on',
      component: () => import('@/views/zhpt/index.vue'),
      meta: { title: '地图' }
    }
  ]
}

const noDashboardRedict = {
  path: '/',
  redirect: ''
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    const existRoutes = sessionStorage.getItem('last-route')
    if (existRoutes) {
      state.addRoutes = routes
      state.routes = JSON.parse(existRoutes)
    } else {
      state.addRoutes = routes
      state.routes = routes.concat(ERROR)
    }
  },
  LOGIN_OUT_DEL: (state) => {
    state.addRoutes = []
  },
  CHANGESYS: (state, data) => {
    console.log('state.dynamicRoutes: ', state.dynamicRoutes, data)
    state.routes = state.dynamicRoutes[data] && state.dynamicRoutes[data]
    sessionStorage.setItem('last-route', JSON.stringify(state.routes))
  },
  SET_NAVMENUS: (state, menus) => {
    state.menus = menus
  },
  SET_DYNAMICROUTES: (state, routes) => {
    state.dynamicRoutes = routes
  }
}

const actions = {
  getRouter({ commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      const userId = sessionStorage.getItem('userId') || userx.state.userId
      getUserMenu(userId)
        .then((res) => {
          if (res.result.length !== 0) {
            const data = res.result.filter((item) => !disabledMenus.includes(item.type || ''))
            const result = {}
            for (const item of data) {
              const obj = {}
              obj[item.type] = packageRouter(item.childrens)
              Object.assign(result, obj)
            }
            commit('SET_DYNAMICROUTES', result)
            const exclude = ['map', 'dashboard', ...gisNames]
            const autoLink = (type, arr) => {
              if (!exclude.includes(type)) {
                // return `${arr.childrens[0].path}/${arr.childrens[0].childrens[0].path}`
                if (arr.childrens.length > 0 && arr.childrens[0].childrens.length > 0) {
                  return `${arr.childrens[0].path}/${arr.childrens[0].childrens[0].path}`
                } else {
                  return ''
                }
              } else return ''
            }
            const menus = data.map((item) => {
              return {
                title: item.label,
                name: item.type,
                path: autoLink(item.type, item)
              }
            })
            commit('SET_NAVMENUS', menus)
            let routes = data.map((item) => item.childrens)
            routes = routes.flat()

            const addRouter = packageRouter(routes)
            commit('SET_ROUTES', addRouter)
            if (data.some((item) => item.type === 'bigScreen')) addRouter.unshift(bigScreenRoutes)
            if (data.some((item) => item.type === 'map' || gisNames.includes(item.type))) addRouter.unshift(mapRoute)
            if (data.some((item) => item.type === 'dashboard')) addRouter.unshift(dashboardRoute)
            else if (!data.some((item) => item.type === 'dashboard') && data.some((item) => item.type === 'map')) {
              const redirectParent = state.addRoutes[0]
              noDashboardRedict.redirect =
                redirectParent.path !== '/map' ? `${redirectParent.path}/${redirectParent.children[0].path}` : '/map'
              addRouter.unshift(noDashboardRedict)
              const firstKey = Object.keys(state.dynamicRoutes)
              if (redirectParent.path === '/map')
                commit(
                  'SET_ROUTES',
                  firstKey[0] === 'sysSetting' ? state.dynamicRoutes[firstKey[1]] : state.dynamicRoutes[firstKey[0]]
                )
              else commit('SET_ROUTES', state.dynamicRoutes[data[0].type])
            }
            resolve(addRouter)
          } else {
            reject(res)
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // 退出清空
  loginOutdel({ commit }) {
    commit('LOGIN_OUT_DEL')
  },

  changeSys({ commit, dispatch, state }, data) {
    commit('CHANGESYS', data)

    if (data === 'map') return
    setTimeout(() => {
      const getPath = () => {
        let path
        for (let route of state.routes) {
          path = (route.children || []).find((item) => !!item.widgetid && !!item.path)
          if (path) break
        }
        return path
      }

      const path = getPath()
      console.log(path)
      if (path) {
        dispatch('map/changeMethod', path, { root: true })
      }
    }, 100)

    //  state.dynamicRoutes[data]
    // this.$store.dispatch('map/changeMethod', info)
  },
  // tagsView变化 改变左侧sidebar菜单
  routesChangeByTagsView(context, data) {
    for (const key in context.state.dynamicRoutes) {
      for (const item of context.state.dynamicRoutes[key]) {
        if (item.children && item.children.some((target) => target.name === data)) {
          context.commit('CHANGESYS', key)
          return
        }
      }
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
