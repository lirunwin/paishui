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