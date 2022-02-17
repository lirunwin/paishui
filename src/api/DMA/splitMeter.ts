import request from '@/utils/request'

// 获取抄表片区
export function getAreas(params) {
  return request({
    url: '/gis/AreaSubTable/getArea',
    method: 'get',
    params
  })
}
// 获获取抄表本
export function getBooks(params) {
  return request({
    url: '/gis/AreaSubTable/getCopybook',
    method: 'get',
    params
  })
}
// 查询用户水表档案
export function getArchives(params) {
  return request({
    url: '/gis/AreaSubTable/getSubTable',
    method: 'get',
    params
  })
}
// 获取用户用水量
export function getUserWaterCost(params) {
  return request({
    url: '/gis/AreaSubTable/getUseWater',
    method: 'get',
    params
  })
}
// 用户水表档案导出
export function exportUserWaterCost(params) {
  return request({
    url: '/gis/AreaSubTable/exportSubTable',
    method: 'get',
    responseType: 'blob',
    params
  })
}
