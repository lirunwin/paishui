import request from '@/utils/request'

// 获取专题地图
export function getThemLayer (params) {
    return request({
        url: "/psgw/thematicMap/page",
        method: "get",
        params
    })
}

// 添加专题地图
export function addThemLayer (data) {
    return request({
        url: "/psgw/thematicMap",
        method: "post",
        data
    })
}

// 删除专题地图
export function deleteThemLayer (id) {
    return request({
        url: `/psgw/thematicMap/${id}`,
        method: "delete"
    })
}