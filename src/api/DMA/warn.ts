import request from "@/utils/request"

// 异常信息列表
export function warnList(params) {
  return request({
    url: "/gis/warn/getWarn",
    method: "get",
    params
  })
}
// 异常占比信息
export function warnTypePercentage(params) {
  return request({
    url: "/gis/warn/analyze",
    method: "get",
    params
  })
}
// 异常数据操作
export function warnDataOperation(data) {
  return request({
    url: "/gis/warn/warnHandle",
    method: "post",
    data
  })
}