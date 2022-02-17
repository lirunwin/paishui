import request from '@/utils/request'
/**
 * 日常管理相关接口
 */

//任务制定安排接口

//任务制定安排主页面查询接口
export function queryTaskArrange(params) {
    return request({
        url: '/gps/plan/page',
        method: 'get',
        params
    })
}

//任务制定安排主页面查询接口
export function queryTaskArrange2(params) {
    return request({
        url: '/gps/planmouth/getPlanMonthDetail/'+params.id,
        method: 'get'
    })
}

//任务制定安排主页面详细信息接口
export function queryDetail(params) {
    return request({
        url: `/gps/plan/${params}`,
        method: 'get'
    })
}

//任务制定安排主页面制定接口
export function addTaskArrange(data) {
    return request({
        url: '/gps/plan/save',
        method: 'post',
        data
    })
}

//通过id查询分组内人员
export function getGroupPersonById(params) {
    return request({
        url: '/gps/groupuser/getGroupUserIdNameMap',
        method: 'get',
        params
    })
}

//任务制定安排主页面修改接口
export function editTaskArrange(data) {
    return request({
        url: '/gps/plan/updata',
        method: 'put',
        data
    })
}

//任务制定安排主页面删除接口
export function deleteTaskArrange(params) {
    return request({
        url: '/gps/plan/deleteByIds',
        method: 'delete',
        params
    })
}

//巡检周期配置
export function xjRoundDispose(params) {
    return request({
        url: '/gps/period/page',
        method: 'get',
        params
    })
}

//获取暂停信息
export function stopList(params) {
    return request({
        url: `/gps/planStop/page`,
        method: 'get',
        params
    })
}

//提交暂停审核信息
export function submitPauseCheckInfo(data) {
    return request({
        url: '/gps/planStop/updata',
        method: 'put',
        data
    })
}

//获取作废信息
export function cancleList(params) {
    return request({
        url: `/gps/planCancle/page`,
        method: 'get',
        params
    })
}

//提交作废审核信息
export function submitAbandonCheckInfo(data) {
    return request({
        url: '/gps/planCancle/updata',
        method: 'put',
        data
    })
}

//巡检点管理接口

//巡检点管理主页面查询接口
export function queryXjPoint(params) {
    return request({
        url: '/gps/planpoint/page',
        method: 'get',
        params
    })
}

//巡检点管理主页面添加接口
export function addXjPoint(data) {
    return request({
        url: '/gps/planpoint/save',
        method: 'post',
        data
    })
}

//巡检点管理主页面修改接口
export function alterXjPoint(data) {
    return request({
        url: '/gps/planpoint/updata',
        method: 'put',
        data
    })
}

//巡检点管理主页面删除接口
export function deleteXjPoint(params) {
    return request({
        url: '/gps/planpoint/deleteByIds',
        method: 'delete',
        params
    })
}

//巡检线管理接口

//巡检线管理主页面查询接口
export function queryXjLine(params) {
    return request({
        url: '/gps/planpath/page',
        method: 'get',
        params
    })
}

//巡检线管理主页面添加接口
export function addXjLine(data) {
    return request({
        url: '/gps/planpath/save',
        method: 'post',
        data
    })
}

//巡检线管理主页面修改接口
export function alterXjLine(data) {
    return request({
        url: '/gps/planpath/updata',
        method: 'put',
        data
    })
}

//巡检线管理主页面删除接口
export function deleteXjLine(params) {
    return request({
        url: '/gps/planpath/deleteByIds',
        method: 'delete',
        params
    })
}

//片区管理相关接口

//片区管理主页面查询接口
export function queryRegionRelation(params) {
    return request({
        url: '/gps/regionresp/page',
        method: 'get',
        params
    })
}

//片区与巡检组关联添加接口
export function addRegionRelation(data) {
    return request({
        url: '/gps/regionresp/save',
        method: 'post',
        data
    })
}

//片区与巡检组关联修改接口
export function alterRegionRelation(data) {
    return request({
        url: '/gps/regionresp/updata',
        method: 'put',
        data
    })
}

//片区与巡检组关联删除接口
export function deleteRegionRelation(params) {
    return request({
        url: '/gps/regionresp/deleteByIds',
        method: 'delete',
        params
    })
}

//巡检任务查询相关接口

//巡检任务查询主页面查询接口
export function queryXjTaskSearch(params) {
    return request({
        url: '',
        method: 'get',
        params
    })
}

//获取审核历史信息

export function getAuditHis(params) {
    return request({
        url: '/gps/audit/getAuditHis',
        method: 'get',
        params
    })
}
