import request from '@/utils/request'
/**
 * 抢维修计划管理相关接口
 */

//计划制定主页面查询接口
export function queryPlansMake(params) {
    return request({
        url: '',
        method: 'get',
        params
    })
}

//计划制定添加子页面查询接口
export function _queryPlansMake(params) {
    return request({
        url: '',
        method: 'get',
        params
    })
}

//添加子页面增加月计划确定提交接口
export function addMonthPlan(data) {
    return request({
        url: '',
        method: 'post',
        data
    })
}

//添加子页面修改月计划确定提交接口
export function alterMonthPlan(data) {
    return request({
        url: '',
        method: 'post',
        data
    })
}

//添加子页面删除月计划确定提交接口
export function _deleteMonthPlan(data) {
    return request({
        url: '',
        method: 'delete',
        data
    })
}

//主页面删除接口
export function deleteMainPageData(data) {
    return request({
        url: '',
        method: 'delete',
        data
    })
}

//计划审核主页面查询接口
export function queryPlansCheck(params) {
    return request({
        url: '',
        method: 'get',
        params
    })
}

//计划查询主页面查询接口
export function queryPlansSearch(params) {
    return request({
        url: '',
        method: 'get',
        params
    })
}

//排班管理主页面查询接口
export function queryMissionManagement(params) {
    return request({
        url: '',
        method: 'get',
        params
    })
}

//排班管理主页面制定接口
export function addMissionManagement(data) {
    return request({
        url: '',
        method: 'post',
        data
    })
}

//排班管理主页面修改接口
export function alterMissionManagement(data) {
    return request({
        url: '',
        method: 'put',
        data
    })
}

//排班管理主页面删除接口
export function deleteMissionManagement(data) {
    return request({
        url: '',
        method: 'delete',
        data
    })
}
