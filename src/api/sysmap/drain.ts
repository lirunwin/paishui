import request from '@/utils/request'

// 获取缺陷数据
export function getDefectDataById (id) {
    return request({
        url: `/psjc/wordInfo/pipeState/${id}`,
        method: "get"
    })
}

export function getDefectData () {
    return request({
        url: "/psjc/wordInfo/pipeState/list",
        method: "get"
    })
}