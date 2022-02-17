import request from "@/utils/request"

// 产销差分析
export function produceDiff(params, file) {
  return request({
    url: "/gis/produceDiff/waterDiff",
    method: "get",
    params,
    responseType: file ? 'blob' : 'json'
  })
}
// 获取月份供水量、售水量、产销差量汇总情况
export function threeSituations(params) {
  return request({
    url: "/gis/produceDiff/clloctByDma",
    method: "get",
    params,
  })
}

// 获取区域观察表
export function minStroomMeters(params) {
  return request({
    url: "/gis/night/getTableTree",
    method: "get",
    params,
  })
}
// 夜间最小流量汇总
export function minStroomMeterSets(params, file) {
  return request({
    url: "/gis/night/minFLow",
    method: "get",
    params,
    responseType: file ? 'blob' : 'json'
  })
}