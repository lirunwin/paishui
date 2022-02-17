import request from '@/utils/request'

// 生产成本单价查询
export function productionPerCosts(params, download) {
  return request({
    url: '/gis/dataContrast/produceCostPrice',
    method: 'get',
    params,
    responseType: download === true ? 'arraybuffer' : 'json'
  })
}

// 成本数据查询
export function productionCostsData(params, download) {
  return request({
    url: '/gis/dataContrast/costData',
    method: 'get',
    params,
    responseType: download === true ? 'arraybuffer' : 'json'
  })
}

// 生产数据查询
export function productionData(params, download) {
  return request({
    url: '/gis/dataContrast/produceDataQuery',
    method: 'get',
    params,
    responseType: download === true ? 'arraybuffer' : 'json'
  })
}

