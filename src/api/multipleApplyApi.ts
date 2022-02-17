import request from '@/utils/request'

/**
  * 说明：
  * get和delete传值用params,
  * post和put传值用data
  */

//取供水趋势查询接口
export function queryGetAndSupplyWaterTrend(params) {
    return request({
        url: 'gis/customDisplay/waterVolumeTrend',
        method: 'get',
        params
    })
}

//水质趋势查询接口
export function queryWaterQualityTrend(params) {
    return request({
        url: '',
        method: 'get',
        params
    })
}

//水压趋势查询接口
export function queryWaterPowerTrend(params) {
    return request({
        url: 'gis/scadaAbout/viewHistory',
        method: 'get',
        params
    })
}