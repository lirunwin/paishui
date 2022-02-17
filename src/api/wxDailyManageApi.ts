import request from '@/utils/request'
/**
 * 抢维修日常管理相关接口
 */

// 工单派工主页面查询接口
export function queryMissionSend(params) {
    return request({
        url: '',
        method: 'get',
        params
    })
}

// 工单派工主页面制定接口
export function addMissionSend(data) {
    return request({
        url: '',
        method: 'post',
        data
    })
}

// 工单派工主页面派工接口
export function missionSendToWorker(data) {
    return request({
        url: '',
        method: 'put',
        data
    })
}

// 工单派工主页面删除接口
export function deleteMissionSend(params) {
    return request({
        url: '',
        method: 'delete',
        params
    })
}

// 工单审核主页面查询接口
export function queryMissionCheck(params) {
    return request({
        url: '',
        method: 'get',
        params
    })
}

// 工单审核主页面审核接口
export function checkMissionCheck(data) {
    return request({
        url: '',
        method: 'post',
        data
    })
}

// 工单查询主页面查询接口
export function queryMissionSearch(params) {
    return request({
        url: '',
        method: 'get',
        params
    })
}
