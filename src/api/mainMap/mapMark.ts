import request from '@/utils/request'

// 获取地图书签 { page }
export function getMapMark (params) { 
    return request({
        url: "/psgw/titleLabel/page",
        method: "get",
        params
    })
}

// 添加地图书签 {  }
export function addMapMark (data) {
    return request({
        url: "/psgw/titleLabel",
        method: "post",
        data
    })
}

// 删除地图书签 { id }
export function deleteMapMark (params) {
    return request({
        url: `/psgw/titleLabel/removeByIds`,
        method: "delete",
        params
    })
}