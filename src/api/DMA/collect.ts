import request from "@/utils/request"

// 历史流量采集
export function flowCollectHistory(data, file) {
  return request({
    url: "/gis/dmaflow/list",
    method: "post",
    data,
    responseType: file ? 'blob' : 'json'
  })
}
// 历史压力采集
export function pressureCollectHistory(data, file) {
  return request({
    url: "/gis/dmapress/list",
    method: "post",
    data,
    responseType: file ? 'blob' : 'json'
  })
}