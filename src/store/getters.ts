const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  appconfig: (state) => state.gis.appconfig,
  avatar: (state) => state.user.avatar,
  name: (state) => state.user.username,
  deptId: (state) => state.user.departmentId,
  visitedViews: (state) => state.tagsView.visitedViews,
  cachedViews: (state) => state.tagsView.cachedViews,
  addRoutes: (state) => state.routeSetting.addRoutes,
  dashboard: (state) => {
    let result = []
    function extractDashboardAuth(arr) {
      for (const item of arr) {
        result.push(item)
        if (item.children) extractDashboardAuth(item.children)
      }
      return result
    }
    if (result.length !== 0) result = []
    else return extractDashboardAuth(state.routeSetting.dynamicRoutes.dashboard)
  }
}
export default getters
