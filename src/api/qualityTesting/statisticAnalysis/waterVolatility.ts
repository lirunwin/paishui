import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/meter/water/fluctuation',
        method: 'get',
        params
    })
}

export function getDetealList(params) {
    return request({
        url: '/meter/water/fluctuation-detail',
        method: 'get',
        params
    })
}

//质量管理水量波动汇总
export function fluctuateCollect(params) {
    return request({
        url: '/meter/qualitysta/fluctuateCollect',
        method: 'get',
        params
    })
}


//质量管理水量波动汇总
export function fluctuateCollectDeatil(params) {
    return request({
        url: '/meter/qualitysta/fluctuateCollectDeatil',
        method: 'get',
        params
    })
}


//
export function getWaterDiameter(params) { 
    return request({
        url: '/base/syscommoncode/getByfjId',
        method: 'get',
        params
    })
}

// 获取用水性质
export function getNature() {
    return request({
      url: `/meter/quality/nature`,
      method: 'get'
    })
}
  
// 获取分页模型参数信息
export function getModel(params) {
    return request({
      url: `/meter/arithmetic/getAbnormalArith`,
      method: 'get',
      params
    })
  }