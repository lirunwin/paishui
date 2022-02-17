import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/oauth/login',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  })
}

export function logout(data) {
  return request({
    url: `/auth/token/${data.token}`,
    method: 'delete',
    data
  })
}

// 提交路由配置
export function uploadRoute(data) {
  return request({
    url: `/base/basesysmenu/updateSysmenu`,
    method: 'post',
    data
  })
}

// 判断用户是否是首次登录或者重置过密码
export function userFirstLogin(params) {
  return request({
    url: `/base/user/${params}`,
    method: 'get'
  })
}

// 获取用户拥有的菜单
export function getUserMenu(id) {
  return request({
    url: `/base/menu/getTreeMenuByUser/${id}`,
    method: 'get'
  })
}
