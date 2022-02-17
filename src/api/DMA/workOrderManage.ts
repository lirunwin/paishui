import request from "@/utils/request"

// 效果评价
export function effectRate(params, file) {
  return request({
    url: "/gis/warn/resultEval",
    method: "get",
    params,
    responseType: file ? "blob" : "json"
  })
}