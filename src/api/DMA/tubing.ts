import request from "@/utils/request"

// 管材类别列表
export function tubingMaterialType(params) {
  return request({
    url: "/gis/dmaicf/type",
    method: "get",
    params
  })
}

// 管材类别编辑
export function editTubingMaterailType(data) { 
  return request({
    url: "/gis/dmapietype",
    method: "put",
    data
  })
 }