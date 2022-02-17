import request from '@/utils/request'

// 水量计划值
export function waterVolumePlan(params, download) {
  return request({
    url: "/gis/dataQuery/waterPlanValue",
    method: "get",
    params,
    responseType: download === true ? 'arraybuffer' : 'json'
  })
}

// 水量实际值
export function waterVolumeReal(params, download) {
  return request({
    url: "/gis/dataQuery/waterRealityValue",
    method: "get",
    params,
    responseType: download === true ? 'arraybuffer' : 'json'
  })
}

// 制水材料计划值
export function waterMaterialPlanVolume(params, download) {
  return request({
    url: "/gis/dataQuery/produceMaterialsPlan",
    method: "get",
    params,
    responseType: download === true ? 'arraybuffer' : 'json'
  })
}

// 制水材料实际值
export function waterMaterialRealVolume(params, download) {
  return request({
    url: "/gis/dataQuery/produceMaterialsReality",
    method: "get",
    params,
    responseType: download === true ? 'arraybuffer' : 'json'
  })
}

// 制水成本计划值
export function waterCostPlanVolume(params, download) {
  return request({
    url: "/gis/dataQuery/produceCostPlanValue",
    method: "get",
    params,
    responseType: download === true ? 'arraybuffer' : 'json'
  })
}

// 制水成本实际值
export function waterCostRealVolume(params, download) {
  return request({
    url: "/gis/dataQuery/produceCostRealityValue",
    method: "get",
    params,
    responseType: download === true ? 'arraybuffer' : 'json'
  })
}

// 指标单价计划值
export function indicatorPerPricePlanVolume(params, download) {
  return request({
    url: "/gis/dataQuery/pricePlan",
    method: "get",
    params,
    responseType: download === true ? 'arraybuffer' : 'json'
  })
}

// 指标单价实际值
export function indicatorPerPriceRealVolume(params, download) {
  return request({
    url: "/gis/dataQuery/priceReality",
    method: "get",
    params,
    responseType: download === true ? 'arraybuffer' : 'json'
  })
}
