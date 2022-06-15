import request from '@/utils/request'

/**
 * 报表管理、年度计划、月度计划相关接口
 */

// 根据条件获取巡检日报表格数据
export function queryDailyReport(data) {
    return request({
        url: '/gps/statement/getInspectionDay',
        method: 'post',
        data
    })
}

// 根据条件获取巡检月报表格数据
export function queryMonthlyReport(data) {
    return request({
        url: '/gps/statement/getInspectionMonth',
        method: 'post',
        data
    })
}

// 根据条件获取周报统计表格数据
export function queryWeeklyStatistics(params) {
    return request({
        url: '',
        method: 'get',
        params
    })
}

// 根据条件获取月报统计表格数据
export function queryMonthlyStatistics(params) {
    return request({
        url: '',
        method: 'get',
        params
    })
}

// 根据条件获取年报统计表格数据
export function queryYearlyStatistics(params) {
    return request({
        url: '',
        method: 'get',
        params
    })
}

// 根据条件获取隐患类型分析表格数据
export function queryTroubleTypeAnalysis(params) {
    return request({
        url: '',
        method: 'get',
        params
    })
}

// 根据条件获取隐患趋势分析表格数据
export function queryTroubleTrendAnalysis(params) {
    return request({
        url: '',
        method: 'get',
        params
    })
}

// 根据条件获取隐患查询分析表格数据
export function queryTroubleSearchAnalysis(params) {
    return request({
        url: '',
        method: 'get',
        params
    })
}

// 根据条件获取考勤记录表格数据
export function queryWorkLogReport(data) {
    return request({
        url: '/gps/statement/getAttendanceRecords',
        method: 'post',
        data
    })
}

// 根据条件获取排班信息数据
export function getScheduling(data) {
    return request({
        url: '/gps/statement/getScheduling',
        method: 'post',
        data
    })
}


// 根据条件获取终端使用表格数据
export function queryTerminalUseReport(params) {
    return request({
        url: '',
        method: 'get',
        params
    })
}

// 根据条件获取人员巡检统计表格数据
export function queryPersonnelXjStatistics(data) {
    return request({
        url: '/gps/statement/getInspectionStatistics',
        method: 'post',
        data
    })
}

// 根据条件获取排班计划表格数据
export function queryWorkAssignmentReport(params) {
    return request({
        url: '',
        method: 'get',
        params
    })
}

/**
 * 年度计划相关接口
 */
// 获取年计划制定表格数据
export function queryYearPlanMake(params) {
    return request({
        url: '/gps/planyear/page',
        method: 'get',
        params
    })
}

// 新增年计划制定数据
export function addYearPlan(data) {
    return request({
        url: '/gps/planyear/save',
        method: 'post',
        data
    })
}
//通过id查询年计划数据
export function getById(params) {
    return request({
        url: `/gps/planyear/${params}`,
        method: 'get'
    })
}

// 编辑年计划数据
export function editYearPlan(data) {
    return request({
        url: '/gps/planyear/updata',
        method: 'put',
        data
    })
}

// 删除年计划数据
export function deleteYearPlan(params) {
    return request({
        url: '/gps/planyear/deleteByIds',
        method: 'delete',
        params
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

// 展示年计划制定中详细内容
export function showYearPlanDetail(params) {
    return request({
        // url: '/gps/planyear/getPlanYearDetail/{id}',
        url: `/gps/planyear/getPlanYearDetail/${params}`,
        method: 'get',
    })
}

// 根据条件查询年计划审核表格数据
export function queryYearPlanCheck(params) {
    return request({
        url: '',
        method: 'get',
        params
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



// 展示年计划审核中详细内容
export function showYearPlanCheckDetail(params) {
    return request({
        url: '',
        method: 'get',
        data:params.data
    })
}

// 根据条件查询年计划查询表格数据
export function queryYearPlanSearch(params) {
    return request({
        url: '',
        method: 'get',
        params
    })
}

// 展示年计划查询中详细内容
export function showYearPlanSearchDetail(params) {
    return request({
        url: '',
        method: 'get',
        data:params.data
    })
}

/**
 * 月度计划相关接口
 */
// 月计划制定主页面查询接口
export function queryMonthlyPlanMake(params) {
    return request({
        url: '/gps/planmouth/page',
        method: 'get',
        params
    })
}

// 月计划制定非主页面查询接口
export function _queryMonthlyPlanMake(params) {
    return request({
        url: `/gps/plan/page`,
        method: 'get',
        params
    })
}

// 月计划制定主页面删除接口
export function deleteMonthlyPlanMake(params) {
    return request({
        url: '/gps/planmouth/deleteByIds',
        method: 'delete',
        params
    })
}

// 月计划制定非主页面删除接口
export function _deleteMonthlyPlanMake(data) {
    return request({
        url: '',
        method: 'delete',
        data
    })
}

// 月计划制定任务添加接口
export function addMonthlyPlanMake(data) {
    return request({
        url: '/gps/planmouth/save',
        method: 'post',
        data
    })
}

//月计划制定巡查类型配置
export function disposeXjType(params) {
    return request({
        url: '/gps/inspecttype/page',
        method: 'get',
        params
    })
}

//月计划参考内容查询
export function queryMonthPlanReferenceContent(params) {
    return request({
        url: '/gps/planmouth/getPlanYearDetail',
        method: 'get',
        params
    })
}

// 月计划制定任务编辑接口
export function editMonthlyPlanMake(data) {
    return request({
        url: '',
        method: 'put',
        data
    })
}

// 月计划制定上报接口
export function reportMonthlyPlanMake(data, data1) {
    return request({
        url: `/gps/report/reportDispose?templateServiceType=${data1}`,
        method: 'post',
        data
    })
}

// 月计划审核主页面查询接口
export function queryMonthlyPlanCheck(params) {
    return request({
        url: '',
        method: 'get',
        params
    })
}

// 月计划审核审核页面查询接口
export function _queryMonthlyPlanCheck(params) {
    return request({
        url: '',
        method: 'get',
        params
    })
}

// 月计划审核审核页面提交接口
export function submitMonthlyPlanCheck(data) {
    return request({
        url: '',
        method: 'post',
        data
    })
}

// 月计划查询页面查询接口
export function queryMonthlyPlanSearch(params) {
    return request({
        url: '',
        method: 'get',
        params
    })
}

//月计划查询详细页面查询接口
export function queryMonthlyPlanSearch_detail(params) {
    return request({
        url: `/gps/planmouth/getPlanMonthDetail/${params}`,
        method: 'get'
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


//过程上报记录
export function getReportRecord(params) {
    return request({
        url: '/gps/record/page',
        method: 'get',
        params
    })
}

//水压测试记录
export function getPressrecord(params) {
    return request({
        url: '/gps/pressrecord/page',
        method: 'get',
        params
    })
}

//管线测试记录
export function getPiperecord(params) {
    return request({
        url: '/gps/piperecord/page',
        method: 'get',
        params
    })
}

//管线测试记录
export function getPlanDetail(params) {
    return request({
        url: '/gps/plan/getPlanDetail',
        method: 'get',
        params
    })
}

//获取已完成的管线
export function getPointTemp(params) {
    return request({
        url: '/gps/pointtemp/page',
        method: 'get',
        params
    })
}


//获取已完成的管线
export function getAllPointTemp(params) {
    return request({
        url: '/gps/pointtemp/all',
        method: 'get',
        params
    })
}


// 获取年计划制定表格数据(年计划查询，跨部门，本部门的任务加上自己审核过的任务,)
export function queryYearPlanMakeOther(params) {
    return request({
        url: '/gps/planyear/getAllPage',
        method: 'get',
        params
    })
}

// 获取年计划制定表格数据(年计划审核历史查询，自己审核过的任务)
export function getAuditPage(params) {
    return request({
        url: '/gps/planyear/getAuditPage',
        method: 'get',
        params
    })
}

// 获取年计划制定表格数据(年计划审核查询，当前需要自己审核的任务)
export function getNeedAuditPage(params) {
    return request({
        url: '/gps/planyear/getNeedAuditList',
        method: 'get',
        params
    })
}

// 月计划内容查询(查询已完成的计划、包括自己审核过的)
export function repairPlanPageOther(params) {
    return request({
        url: '/gps/planmouth/getAllPage',
        method: 'get',
        params
    })
}

// 月计划审核内容查询(只查询该自己审核的)
export function repairNeedAuditListPage(params) {
    return request({
        url: '/gps/planmouth/getNeedAuditList',
        method: 'get',
        params
    })
}

// 月计划审核历史内容查询
export function repairPlanAuditPage(params) {
    return request({
        url: '/gps/planmouth/getAuditPage',
        method: 'get',
        params
    })
}

//获取人员签到信息
export function getUserSignList(params) {
    return request({
        url: '/gps/pdasign/getUserSignList',
        method: 'get',
        params
    })
}

//获取人员轨迹分段信息
export function getSection(params) {
    return request({
        url: '/gps/gps/getSection',
        method: 'get',
        params
    })
}

//获取多人员轨迹分段信息
export function getSectionMulti(params) {
    return request({
        url: '/gps/gps/getSectionMulti',
        method: 'get',
        params
    })
}


//获取人员轨迹详细信息
export function getGPSAll(params) {
    return request({
        url: '/gps/gps/getAll',
        method: 'get',
        params
    })
}

//获取GPS设备信息
export function getEquipmentInfo(params) {
    return request({
        url: '/gps/gps/page',
        method: 'get',
        params
    })
}

//获取巡检计划内容
export function getPlanTimeIntervalPage(params) {
    return request({
        url: '/gps/plan/getPlanTimeIntervalPage',
        method: 'get',
        params
    })
}

//获取某部门某一天的所有计划
export function getDayPlan(params) {
    return request({
        url: '/gps/plan/page',
        method: 'get',
        params
    })
}

//获取车辆列表
export function getCarMonitor(params) {
    return request({
        url: '/gps/monitorCenter/carMonitor',
        method: 'get',
        params
    })
}

export function getTrouble(params) {
    return request({
        url: '/gps/trouble/page',
        method: 'get',
        params
    })
}
