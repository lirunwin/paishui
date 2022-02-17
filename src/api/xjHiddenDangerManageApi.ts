import request from '@/utils/request'

/**
  * 说明：
  * 巡检隐患管理相关接口
  * get和delete传值用params,
  * post和put传值用data
  */

// 获取编grouping+码/ grouping+ /
export function getCode(params) {
    return request({
      url: '/base/syscommoncode/all',
      method: 'get',
      params
    })
  }

//隐患上报主页面数据获取
export function queryDangerReport(params) {
    return request({
        url: '/gps/trouble/page',
        method: 'get',
        params
    })
}

//隐患上报，获取工地列表
export function queryDangerBuild(params) {
    return request({
        url: '/gps/build/page',
        method: 'get',
        params
    })
}

//隐患详情页面 => 工地信息详情
export function getHiddenDangerBuildId(id) {
    return request({
        url: `/gps/build/getBuildDetail?id=${id}`,
        method: 'get',
    })
}

//隐患上报主页面上报接口
export function reportDanger(data) {
    return request({
        url: '/gps/trouble/save',
        method: 'post',
        data
    })
}

//隐患审核界面 => 审核 编辑隐患
export function updateReportDanger(data) {
    return request({
        url: '/gps/trouble/updata',
        method: 'put',
        data
    })
}

//隐患上报页面隐患原因获取
export function getHiddenDangerReason(params) {
    return request({
        url: '/gps/toubletyped/page',
        method: 'get',
        params
    })
}

//隐患上报页面隐患等级获取
export function getToubleRange(params) {
    return request({
        url: '/gps/toublerange/page',
        method: 'get',
        params
    })
}


//隐患上报页面审核人获取
export function getHiddenDangerCheckMan(params) {
    return request({
        url: '/base/user/getDepartmentUser',
        method: 'get',
        params
    })
}

//隐患详情页面 => 隐患详情信息
export function getHiddenDangerUpdateId(id) {
    return request({
        url: `/gps/trouble/${id}`,
        method: 'get',
    })
}


//隐患详情页面 => 隐患详情信息
export function getHiddenDangerId(id) {
    return request({
        url: `/gps/trouble/getTroubleDetail?id=${id}&flag=1`,
        method: 'get',
    })
}

//隐患审核派工主页面数据获取
export function queryGroupUserMap(params) {
    return request({
        url: '/gps/groupuser/getGroupUserMap',
        method: 'get',
        params
    })
}

//隐患审核派工 => 巡检周期
export function queryPeriod(params) {
    return request({
        url: '/gps/period/page',
        method: 'get',
        params
    })
}

//隐患审核派工主页面上报审核 => 审核
export function reportDangerCheck(typeid,data) {
    return request({
        url: `/gps/audit/auditDispose/?templateServiceType=${typeid}`,
        method: 'post',
        data
    })
}

//获取图片信息
export function getFileImg(token,path) {
    return request({
        url: '/base/file/loadImg?access_token=' + token + '&remotePath=' + path.replace(/\//g, '%2f'), 
        method: 'get', 
        responseType: "blob"
    })
}


/*------------------ 消除隐患审核 ----------------*/
//隐患消除审核列表
export function getHiddenDangerClear(params) {
    return request({
        url: '/gps/toubleclear/page',
        method: 'get',
        params
    })
}


/*------------------ 隐患统计接口-----------------*/
/**
 * @description 码表=> 获取部门信息
 */
export function queryDept(params) {
    return request({
        url: '/base/department/list',
        method: 'get',
        params
    })
}

/**
 * @description 报表=> 获取隐患原因
 */
export function reportTroubleCause(data) {
    return request({
        url: '/gps/statement/getTroubleCause',
        method: 'post',
        data
    })
}

/**
 * @description 报表=> 获取隐患趋势
 */
 export function reportTroubleTrendAnalysis(data) {
    return request({
        url: '/gps/statement/getTroubleTrendAnalysis',
        method: 'post',
        data
    })
}

/**
 * @description 报表=> 获取隐患台账
 */
 export function reportTroubleRecordLedger(data) {
    return request({
        url: '/gps/statement/getTroubleRecordLedger',
        method: 'post',
        data
    })
}