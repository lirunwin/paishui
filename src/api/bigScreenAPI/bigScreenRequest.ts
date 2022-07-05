//大屏后台接口请求
import request from '@/utils/request'
/**
  * 说明：
  * get和delete传值用params,
  * post和put传值用data
  */
//获取接口list编码
export function getBlockPage(params) {
    return request({
      url: '/tofly-psjc-panoramic/block/page',
      method: 'get',
      params
    })
}
//通用list查询
export function getResultList(params) {
    return request({
      url: '/tofly-psjc-panoramic/common/list',
      method: 'get',
      params
    })
}
//查询站点指标信息
export function getIndexWarnInfo(params) {
  return request({
    url: '/monitor/monitorParameter/getIndexWarnInfo',
    method: 'get',
    params
  })
}
//车辆信息查询
export function getCarListPage(params) {
  return request({
    url: '/gps/car/page',
    method: 'get',
    params
  })
}
//汛情上报总数查询 
export function getFloodseasonwPage(params) {
  return request({
    url: '/gps/floodseasonw/page',
    method: 'get',
    params
  })
}
//隐患总数查询
export function getTroublePage(params) {
  return request({
    url: '/gps/trouble/page',
    method: 'get',
    params
  })
}
//事件总数查询
export function getEventPage(params) {
  return request({
    url: '/gps/eventmange/page',
    method: 'get',
    params
  })
}
//巡检人员
export function getUserGpsPage(params) {
  return request({
    url: '/gps/userGps/section',
    method: 'get',
    params
  })
}