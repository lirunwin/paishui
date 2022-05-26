import request from '@/utils/request'

// 根据报告 id 获取全部缺陷数据
export function getDefectDataById (id) {
    return request({
        url: `/psjc/wordInfo/pipeState/${id}`,
        method: "get"
    })
}
// 获取全部缺陷
export function getDefectData (params) {
    return request({
        url: "/psjc/wordInfo/pipeState/list",
        method: "get",
        params
    })
}
// 获取全部工程
export function getProject (params) {
    return request({
        url: "/psjc/projectInfo/pageNew",
        method: "get",
        params
    })
}
// 根据工程 id 获取报告 prjNo
export function getReportByProjecetId (params) {
    return request({
        url: `/psjc/wordInfo/list`,
        method: "get",
        params
    })
}

// 根据日期 报告 获取缺陷

export function getDefectDataByFilter (params) {
    return request({
        url: '/psjc/wordInfo/pipeDataMap',
        method: 'get',
        params
    })
}

// 根据条件获取缺陷

export function getDefectDataBySE (params) {
    return request({
        url: '/psjc/pipeState/getPipeStateConutNew',
        method: 'get',
        params
    })
}

// 获取字段
export function getFieldByLayerName (params) {
    return request({
        url: '/analyse/dataSet/getDataSetData',
        method: 'get',
        params
    })
}
// 获取字段唯一值
export function getUniqueValueByFiled (params) {
    return request({
        url: '/analyse/dataSet/getFieldData',
        method: 'get',
        params
    })
}