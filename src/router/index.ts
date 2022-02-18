import Vue from 'vue'
import Router from 'vue-router'
import { constantRoutes } from "./routes";
Vue.use(Router)
const routerMap = constantRoutes
const createRouter = () => new Router({
  // mode: 'history', // 控制url地址中是否显示#
  //scrollBehavior: () => ({ y: 0 }), //ts检查不通过，缺少x属性
  scrollBehavior: () => ({x:0, y: 0 }),
  routes: routerMap
})
// 创建路由
const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  //@ts-ignore
  router.matcher = newRouter.matcher // 重置 router
}

export default router
