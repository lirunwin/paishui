import request from '@/utils/request'

// 查询用户信息
export function getUserInfo(params) {
  return request({
    url: '/meter/quality/qualityKh',
    method: 'get',
    params
  })
}
// 获取编grouping+码/ grouping+ /
export function getCode(params) {
  return request({
    url: '/base/syscommoncode/all',
    method: 'get',
    params
  })
}
// 添加归集详情
export function addByBatch(data) {
    return request({
        url: `/qc/collectionNumberDetail/addByBatch`,
        method: 'post',
        data
    })
}
// 获取抄表区域与区域段
export function getAreasAndRegion(params) {
  return request({
    url: '/meter/readRegion/getQyAndQd',
    method: 'get',
    params
  })
}
// 区域段
export function paraGraph(params) {
    return request({
        url: `/meter/readRegion/paragraph`,
        method: 'get',
        params
    })
}
// 区域
export function readArea(params) {
    return request({
        url: `/meter/readRegion/readArea`,
        method: 'get',
        params
    })
}

export function Sign(data) {
    return request({
        url: '/gis/sxjDocking/send',
        method: 'POST',
        data
    })
}

