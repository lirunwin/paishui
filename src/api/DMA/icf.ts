import request from "@/utils/request"

// ICF状况因子列表
export function icfInfoList(params) {
  return request({
    url: "/gis/dmaicf/icf",
    method: "get",
    params
  })
}

// ICF状况因子编辑
export function editIcfInfo(data) { 
  return request({
    url: "/gis/dmaicf/icfUpdate",
    method: "post",
    data
  })
 }