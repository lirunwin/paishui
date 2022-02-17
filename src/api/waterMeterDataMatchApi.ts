import request from '@/utils/request'
/**
 * 总表和客户水表的绑定
 */


//获取总表与水表的关联信息
export function viewTablePipe(params) {
    return request({
        url: '/gis/onlineCheck/viewTablePipe',
        method: 'get',
        params
    })
}


//用户关联总表
export function userToTable(data) {
    return request({
        url: '/gis/onlineCheck/userToTable',
        method: 'post',
        data
    })
}

//查询所有的总表
export function getTableInfo(params) {
    return request({
        url: '/gis/onlineCheck/tableInfo',
        method: 'get',
        params
    })
}

//用户表更换总表
export function moveUserTable(data) {
    return request({
        url: '/gis/onlineCheck/moveUserTable',
        method: 'put',
        data
    })
}

//移除用户表
export function removeUser(params) {
    return request({
        url: '/gis/onlineCheck/removeUser',
        method: 'delete',
        params
    })
}

//总表换表
export function inTheTable(data) {
    return request({
        url: '/gis/onlineCheck/inTheTable',
        method: 'put',
        data
    })
}

//未关联客户信息查询
export function customerInfo(params) {
    return request({
        url: `/gis/onlineCheck/customerInfo`,
        method: 'get',
        params
    })
}

//确认客户-总表
export function confirmTableUser(data) {
    return request({
        url: '/gis/onlineCheck/confirmTableUser',
        method: 'put',
        data
    })
}

//确认管线与总表
export function confirmTablePipe(data) {
    return request({
        url: '/gis/onlineCheck/confirmTablePipe',
        method: 'put',
        data
    })
}

//总表绑定管线
export function bindLine(data) {
    return request({
        url: '/gis/onlineCheck/bindLine',
        method: 'post',
        data
    })
}


//查询关联客户信息
export function associatedCustomer(params) {
    return request({
        url: '/gis/onlineCheck/associatedCustomer',
        method: 'get',
        params
    })
}

//设置小区名称
export function setPlotName(data) {
    return request({
        url: '/gis/onlineCheck/setPlotName',
        method: 'put',
        data
    })
}

//自动匹配关联
export function autoMatch(data) {
    return request({
        url: '/gis/onlineCheck/autoMatch',
        method: 'post',
        data
    })
}

//获取自动匹配进度
export function getSchedule(params) {
    return request({
        url: '/gis/onlineCheck/getSchedule',
        method: 'get',
        params
    })
}