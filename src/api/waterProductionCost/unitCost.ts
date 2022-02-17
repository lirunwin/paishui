import request from "@/utils/request"

// 单位成本
  // 制水材料成本趋势图
  export function waterProductionMateriaTrends(params) {
    return request({
      url: "/gis/unitCost/materials",
      method: "get",
      params
    })
  }
  // 电费成本趋势图
  export function electricCostTrends(params) {
    return request({
      url: "/gis/unitCost/electricCost",
      method: "get",
      params
    })
  }
  // 原水费趋势图
  export function rawBillTrends(params) {
    return request({
      url: "/gis/unitCost/waterRate",
      method: "get",
      params
    })
  }
  // 水资源税费趋势图
  export function waterResourcesTaxTrends(params) {
    return request({
      url: "/gis/unitCost/waterTax",
      method: "get",
      params
    })
  }
  // 单位成本饼图
  export function unitCostPie(params) {
    return request({
      url: "/gis/unitCost/unitCost",
      method: "get",
      params
    })
  }
  // 材料成本饼图
  export function costOfMetriaPie(params) {
    return request({
      url: "/gis/unitCost/meterailsCost",
      method: "get",
      params
    })
  }