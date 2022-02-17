import request from '@/utils/request'

/**
 * 抢维修年计划管理
 */

//新增年计划接口
export function addYearPlan(data) {
    return request({
        url: '/gps/repairplanyear',
        method: 'post',
        data
    })
}

//修改年计划接口
export function editYearPlan(data) {
    return request({
        url:  '/gps/repairplanyear',
        method: 'put',
        data
    })
}

//删除年计划数据
export function deleteYearPlan(params) {
    return request({
        url: '/gps/repairplanyear/deleteByIds',
        method: 'delete',
        params
    })
}

// 获取年计划制定表格数据(不跨部门,年计划制定)
export function queryYearPlanMake(params) {
    return request({
        url: '/gps/repairplanyear/page',
        method: 'get',
        params
    })
}

// 获取年计划制定表格数据(年计划查询，跨部门，本部门的任务加上自己审核过的任务,)
export function queryYearPlanMakeOther(params) {
    return request({
        url: '/gps/repairplanyear/getAllPage',
        method: 'get',
        params
    })
}

// 获取年计划制定表格数据(年计划审核历史查询，自己审核过的任务)
export function getAuditPage(params) {
    return request({
        url: '/gps/repairplanyear/getAuditPage',
        method: 'get',
        params
    })
}

// 获取年计划制定表格数据(年计划审核查询，当前需要自己审核的任务)
export function getNeedAuditPage(params) {
    return request({
        url: '/gps/repairplanyear/getNeedAuditList',
        method: 'get',
        params
    })
}

//通过id查询年计划数据
export function getYearPlanById(params) {
    return request({
        url: `/gps/repairplanyear/${params}`,
        method: 'get'
    })
}

//上报年计划
export function reportYearPlan(data, data1) {
    return request({
        url: `/gps/report/reportDispose?templateServiceType=${data1}`,
        method: 'post',
        data
    })
}

//年计划审核提交审核数据
export function checkData(data, data1) {
    return request({
        url: `/gps/audit/auditDispose/?templateServiceType=${data1}`,
        method: 'post',
        data
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

// 获取抢维修类型
export function getTypeList(params) {
    return request({
        url: '/gps/repairtype/page',
        method: 'get',
        params
    })
}

//获取历史审核数据
export function getHisAud(data) {
    return request({
        url: `/gps/audit/getAuditHisInfo`,
        method: 'post',
        data
    })
}

// 月计划制定内容查询
export function repairPlanPage(params) {
    return request({
        url: '/gps/repairplan/page',
        method: 'get',
        params
    })
}
// 月计划内容查询(查询已完成的计划、包括自己审核过的)
export function repairPlanPageOther(params) {
    return request({
        url: '/gps/repairplan/getAllPage',
        method: 'get',
        params
    })
}

// 月计划审核内容查询(只查询该自己审核的)
export function repairNeedAuditListPage(params) {
    return request({
        url: '/gps/repairplan/getNeedAuditList',
        method: 'get',
        params
    })
}

// 月计划审核历史内容查询
export function repairPlanAuditPage(params) {
    return request({
        url: '/gps/repairplan/getAuditPage',
        method: 'get',
        params
    })
}

// 获取工单详情
export function getNewRepairOrderDetail(params) {
    return request({
        url: '/gps/repairorder/getNewRepairOrderDetail',
        method: 'get',
        params
    })
}
