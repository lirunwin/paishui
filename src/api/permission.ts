import request from '@/utils/request'

/**
  * 说明：
  * get和delete传值用params,
  * post和put传值用data
  */
// 获取router
export function getRouter(params) {
  return request({
    url: '/base/user/userlistByTree',
    method: 'get',
    params
  })
}
