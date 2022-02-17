import request from '@/utils/request'

// 获取字典表
export function getCodeAll() {
  return request({
    url: `/base/syscommoncode/all`,
    method: 'get'
  })
}

// 获取字典表
export function getCodeId(params) {
  return request({
    url: `/base/syscommoncode/getByfjId`,
    method: 'get',
    params
  })
}
// 用水性质
export function getNature(params) {
  return request({
    url: '/meter/quality/nature',
    method: 'get',
    params
  })
}

// 抄表区域
export function getReadArea(params) {
  return request({
    url: '/meter/readRegion/readArea',
    method: 'get',
    params
  })
}

// 抄表区段
export function paragraph(params) {
  return request({
    url: '/meter/readRegion/paragraph',
    method: 'get',
    params
  })
}

// 查询
export function getList(data) {
  return request({
    url: `/meter/qualitysta/householdsCollect`,
    method: 'post',
    data
  })
}

// 双击
export function detail(params) {
  return request({
    url: '/meter/qualitysta/householdsCollectDeatil',
    method: 'get',
    params
  })
}
