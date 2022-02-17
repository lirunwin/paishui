import request from '@/utils/request'

// 月度实时计划
// 制水材料
export function waterMaterial(params) {
  return request({
    url: '/gis/monthPlan/makeWater',
    method: 'get',
    params
  })
}

// 成本核算
export function costing(params) {
  return request({
    url: '/gis/monthPlan/costCalculate',
    method: 'get',
    params
  })
}

