import request from '@/utils/request'

// 获取分页
export function getList(params) {
    return request({
      url: `/meter/qualitysta/queryCollect`,
      method: 'get',
      params
    })
  }

  
// 查询用户信息
export function getUserInfo(params) {
    return request({
      url: `/meter/qualitysta/queryCollectDeatil`,
      method: 'get',
      params
    })
  }

    
// 查询区域
export function getQy(params) {
  return request({
    url: `/meter/readRegion/readArea`,
    method: 'get',
    params
  })
}

// 查询区段
export function getQd(params) {
  return request({
    url: `/meter/readRegion/paragraph`,
    method: 'get',
    params
  })
}