import request from '@/utils/request'

// 获取分页
export function getList(params) {
  return request({
    url: `/meter/qualitysta/eventCollect`,
    method: 'get',
    params
  })
}

// 双击列表
export function detail(params) {
  return request({
    url: `/meter/qualitysta/eventCollectInfo`,
    method: 'get',
    params
  })
}

// 详情

export function detailId(params) {
  return request({
    url: `/meter/qualitysta/eventById`,
    method: 'get',
    params
  })
}
