import request from '@/utils/request'

/**
 * 报表管理、年度计划、月度计划相关接口
 */
let base = "/psjc"

// 根据条件新增数据
export function addData(data) {
    return request({
        url: base + '/projectInfo',
        method: 'post',
        data
    })
}

// 根据条件获取分页查询数据
export function projectPagingQuery(params) {
    return request({
        url: base + '/projectInfo/page',
        method: 'get',
        params
    })
}

// 根据条件获取数据库表名及描述
export function projectDataQuery(data) {
    return request({
        url: base + '/commonInter/getDBTable',
        method: 'get',
        data
    })
}

// 根据条件获取
export function projectIdQuery(data) {
    return request({
        url: base + '/projectInfo/page',
        method: 'get',
        data
    })
}


