import request from '@/utils/request'

/**
  * 说明：
  * 巡检配置管理相关接口
  * get和delete传值用params,
  * post和put传值用data
  */

// 分组管理接口
// 获取分组信息
export function groupQuery(params) {
    return request({
        // url: '/gps/inspectgroup/page',
        url: '/gps/groupuser/getGroupUserMap',
        method: 'get',
        params
    })
}

// 获取成员信息
export function membersQuery(params) {
    return request({
        url: '/gps/groupuser/getGroupUserMap',
        method: 'get',
        params
    })
}
// 新增分组接口
export function groupManageAdd(data) {
    return request({
        url: '/gps/inspectgroup/save',
        method: 'post',
        data
    })
}

// 修改分组接口
export function groupManageAlter(data) {
    return request({
        url: '/gps/inspectgroup/updata',
        method: 'put',
        data
    })
}

// 删除分组接口
export function groupManageDelete(params) {
    return request({
        url: '/gps/inspectgroup/deleteByIds',
        method: 'delete',
        params
    })
}

// 组员添加接口
export function groupMembersAdd(data) {
    return request({
        url: '/gps/groupuser/save',
        method: 'post',
        data
    })
}

// 组员移除接口
export function groupMembersRemove(params) {
    return request({
        url: '',
        method: 'delete',
        params
    })
}

// 巡查类型相关接口
// 巡查类型查询接口
export function xjTypeQuery(params) {
    return request({
        url: '/gps/inspecttype/page',
        method: 'get',
        params
    })
}

// 新增接口
export function xjTypeAdd(data) {
    return request({
        url: '/gps/inspecttype/save',
        method: 'post',
        data
    })
}

// 修改接口
export function xjTypeAlter(data) {
    return request({
        url: '/gps/inspecttype/updata',
        method: 'put',
        data
    })
}

// 删除接口
export function xjTypeDelete(params) {
    return request({
        url: '/gps/inspecttype/deleteByIds',
        method: 'delete',
        params
    })
}

// 隐患原因相关接口
// 隐患原因查询接口
export function problemReasonQuery(params) {
    return request({
        url: '/gps/toubletyped/page',
        method: 'get',
        params
    })
}

// 新增接口
export function problemReasonAdd(data) {
    return request({
        url: '/gps/toubletyped/save',
        method: 'post',
        data
    })
}

// 修改接口
export function problemReasonAlter(data) {
    return request({
        url: '/gps/toubletyped/updata',
        method: 'put',
        data
    })
}

// 删除接口
export function problemReasonDelete(params) {
    return request({
        url: '/gps/toubletyped/deleteByIds',
        method: 'delete',
        params
    })
}

// 工地类型相关接口
// 工地类型查询接口
export function workSiteTypeQuery(params) {
    return request({
        url: '/gps/buildtype/page',
        method: 'get',
        params
    })
}

// 新增接口
export function workSiteTypeAdd(data) {
    return request({
        url: '/gps/buildtype/save',
        method: 'post',
        data
    })
}

// 修改接口
export function workSiteTypeAlter(data) {
    return request({
        url: '/gps/buildtype/updata',
        method: 'put',
        data
    })
}

// 删除接口
export function workSiteTypeDelete(params) {
    return request({
        url: '/gps/buildtype/deleteByIds',
        method: 'delete',
        params
    })
}

// 定位终端相关接口
// 定位终端查询接口
export function terminalLocationQuery(params) {
    return request({
        url: '/gps/gpsdevice/page',
        method: 'get',
        params
    })
}

// 新增接口
export function terminalLocationAdd(data) {
    return request({
        url: '/gps/gpsdevice/save',
        method: 'post',
        data
    })
}

// 修改接口
export function terminalLocationAlter(data) {
    return request({
        url: '/gps/gpsdevice/updata',
        method: 'put',
        data
    })
}

// 删除接口
export function terminalLocationDelete(params) {
    return request({
        url: '/gps/gpsdevice/deleteByIds',
        method: 'delete',
        params
    })
}


// 隐患等级相关接口
// 隐患等级查询接口
export function troubleLevelQuery(params) {
    return request({
        url: '/gps/toublerange/page',
        method: 'get',
        params
    })
}

// 新增接口
export function troubleLevelAdd(data) {
    return request({
        url: '/gps/toublerange/save',
        method: 'post',
        data
    })
}

// 修改接口
export function troubleLevelAlter(data) {
    return request({
        url: '/gps/toublerange/updata',
        method: 'put',
        data
    })
}

// 删除接口
export function troubleLevelDelete(params) {
    return request({
        url: '/gps/toublerange/deleteByIds',
        method: 'delete',
        params
    })
}