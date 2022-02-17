import request from "@/utils/request"

// 水量数据查询
export function waterVolumeDataQuery(params) {
  return request({
    url: "/gis/dataTrend/waterData",
    method: "get",
    params
  })
}

// 用电量查询
export function eleUseQuery(params) {
  return request({
    url: "/gis/dataTrend/electricityData",
    method: "get",
    params
  })
}

// 材料单耗查询
export function materiaQuery(params) {
  return request({
    url: "/gis/dataTrend/materialsData",
    method: "get",
    params
  })
}

// 制水指标查询
export function waterProductQuery(params) {
  return request({
    url: "/gis/dataTrend/priceData",
    method: "get",
    params
  })
}
