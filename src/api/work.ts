import request from '@/utils/request'

/**
  * 说明：
  * get和delete传值用params,
  * post和put传值用data
  */
// 获取工单类型数据
const grouping = '/mis'
// const grouping = '/meter'

// 获取客户信息
export function getNames(params) {
  return request({
    url: '/meter/qfkhjbxx/commonKh',
    method: 'get',
    params
  })
}

// 获取编grouping+码/ grouping+ /
export function getCode(params) {
  return request({
    url: '/base/syscommoncode/all',
    method: 'get',
    params
  })
}

// 获取编grouping+码 根据父级编码，查询子集码表
export function getCodeParent(params) {
  return request({
    url: '/base/syscommoncode/getByfjId',
    method: 'get',
    params
  })
}

// 获取配置后工单类型
export function getSelectBygdlx(params) {
  return request({
    url: grouping + '/gdflowconfig/selectBygdlx',
    method: 'get',
    params
  })
}

// 获取菜单部门人员
export function getPersonnelAndDepartment(params) {
  return request({
    url: grouping + '/gdglinfo/getDepartmentIdByUser',
    method: 'get',
    params
  })
}
// 获取菜单权限人员
export function getPersonnel(params) {
  return request({
    url: '/base/user/getUserpermissionsByDepatmentAndMune',
    method: 'get',
    params
  })
}

// 获取部门
export function getDepartment(params) {
  return request({
    url: '/base/department/list',
    method: 'get',
    params
  })
}
// 修改接单状态
export function editOrderStatus(params) {
  return request({
    url: grouping + '/gdglinfo/jd',
    method: 'get',
    params
  })
}

// 列表分页查询
export function getList(params) {
  return request({
    url: grouping + '/gdglinfo/pageTypeSelect',
    method: 'get',
    params
  })
}
// 列表分页查询
export function getRegisterList(params) {
  return request({
    url: grouping + '/gdglinfo/page',
    method: 'get',
    params
  })
}
// 热线工单列表分页查询
export function getRegisterListNew(params, download) {
  return request({
    url: grouping + '/gdglinfo/gdInfoQuery',
    method: 'get',
    params,
    responseType: download ? 'arraybuffer' : 'json'
  })
}

// 列表分页查询
export function downloadRegisterList(params) {
  return request({
    url: grouping + '/gdglinfo/page',
    method: 'get',
    responseType: 'arraybuffer',
    params
  })
}
// 删除业务工单
export function delRegister(params) {
  return request({
    url: grouping + '/gdglinfo/deleteByIds',
    method: 'delete',
    params
  })
}

// 修改工单列表
export function editRegister(data) {
  return request({
    url: grouping + '/gdglinfo/updateById',
    method: 'put',
    data
  })
}

// 驳回分页信息
export function getRejectList(params) {
  return request({
    url: grouping + '/gdglflow/page',
    method: 'get',
    params
  })
}

// 转派分页信息
export function getRedeploy(params) {
  return request({
    url: grouping + '/redeploy/page',
    method: 'get',
    params
  })
}
// 结果审核处置记录
export function getReturnHis(params) {
  return request({
    url: grouping + '/gdglinfo/getorderReturnHis',
    method: 'get',
    params
  })
}
// 转派工单
export function editOrderSent(data) {
  return request({
    url: grouping + 'gdglinfo/orderSent',
    method: 'put',
    data
  })
}
// 新增工单列表 工单登记
export function addRegister(data) {
  return request({
    url: grouping + '/gdglinfo/save',
    method: 'post',
    data
  })
}
// 认证处置
export function editHandle(data) {
  return request({
    url: grouping + '/gdglinfo/saveCertification',
    method: 'post',
    data
  })
}

// 认证审核
export function editCheck(data) {
  return request({
    url: grouping + '/gdglinfo/orderReview',
    method: 'post',
    data
  })
}

// 认证质检
export function editQuality(data) {
  return request({
    url: grouping + '/gdglinfo/qcCheck',
    method: 'post',
    data
  })
}

// 结果处置
export function editResult(data) {
  return request({
    url: grouping + '/gdglinfo/actionResults',
    method: 'post',
    data
  })
}

// 结果审核 - 当前工单是否已添加审批链
export function isAuditChain(params) {
  return request({
    url: grouping + '/gdglinfo/isAuditChain',
    method: 'get',
    params
  })
}
// 结果审核 - 新增审批链
export function saveAuditChain(data) {
  return request({
    url: grouping + '/gdglinfo/saveAuditChain',
    method: 'post',
    data
  })
}
// 结果审核 - 修改审批链
export function updateAuditChain(data) {
  return request({
    url: grouping + '/gdglinfo/updateAuditChain',
    method: 'post',
    data
  })
}
// 结果审核 - 审核提交
export function orderReturnVisit(data) {
  return request({
    url: grouping + '/gdglinfo/orderReturnVisit',
    method: 'post',
    data
  })
}
// 工单回访统计信息
export function getReturnVisitStatistics(params) {
  return request({
    url: grouping + '/gdhftj/proportionStatistics',
    method: 'get',
    params
  })
}
// 修改比率
export function editProportion(data) {
  return request({
    url: grouping + '/gdhftj/updateProportion',
    method: 'put',
    data
  })
}
// 工单回访日期内详情
export function getReturnVisitList(params) {
  return request({
    url: grouping + '/gdglinfo/orderResturnByTime',
    method: 'get',
    params
  })
}
// 工单回访
export function editReturnVisit(data) {
  return request({
    url: grouping + '/gdglinfo/orderReturnVisit',
    method: 'post',
    data
  })
}

// 驳回分页信息
export function getMonitoringList(params) {
  return request({
    url: grouping + '/gdglinfo/orderMonitoring',
    method: 'get',
    params
  })
}

// 查询派单数量
export function getBusinessList(params) {
  return request({
    url: grouping + '/gdglinfo/orderMonitoringDetails',
    method: 'get',
    params
  })
}

//  催单
export function reminder(data) {
  return request({
    url: grouping + '/gdglinfo/reminder',
    method: 'post',
    data
  })
}

// 获取树形结构的工单类型数据
export function getGdgltypeTree(params) {
  return request({
    url: grouping + '/gdgltypebm/getGdgltypeTree',
    method: 'get',
    params
  })
}
// 获取树形工单类型（新）
export function getGdgltypeTreeNew(params) {
  return request({
    url: grouping + '/gdflowconfig/getTypeTree',
    method: 'get',
    params
  })
}
// 树形结构的工单类型数据 修改
export function editGdgltypeTree(data) {
  return request({
    url: grouping + '/gdgltypebm',
    method: 'put',
    data
  })
}
// 新增业务工单类型编码表
export function addWorkType(data) {
  return request({
    url: grouping + '/gdgltypebm',
    method: 'post',
    data
  })
}
// 树形结构工单类型管理修改
export function editWorkType(data) {
  return request({
    url: grouping + '/gdgltypebm',
    method: 'put',
    data
  })
}
// 通过ID批量删除业务工单类型编码表
export function delWorkType(params) {
  return request({
    url: grouping + '/gdgltypebm/deleteByIds',
    method: 'delete',
    params
  })
}

// 工单回访统计信息
export function getGdgltypebm(params) {
  return request({
    url: grouping + '/gdgltypebm',
    method: 'get',
    params
  })
}

// 工单配置管理分页
export function getFlowPathPage(params) {
  return request({
    url: grouping + '/gdflowconfig/page',
    method: 'get',
    params
  })
}
// 工单配置管理删除
export function delWorkFlowPath(params) {
  return request({
    url: grouping + '/gdflowconfig/deleteByIds',
    method: 'delete',
    params
  })
}
// 工单配置管理新增
export function addWorkFlowPath(data) {
  return request({
    url: grouping + '/gdflowconfig',
    method: 'post',
    data
  })
}
// 工单配置管理修改
export function editWorkFlowPath(data) {
  return request({
    url: grouping + '/gdflowconfig',
    method: 'put',
    data
  })
}

// 统计第一层
export function getStatistics(params) {
  return request({
    url: grouping + '/gdglinfo/collectGd',
    method: 'get',
    params
  })
}
// 统计详情
export function getStatisticsDetails(params) {
  return request({
    url: grouping + '/gdglinfo/gdinfo',
    method: 'get',
    params
  })
}

// 维修类型 => 码表
export function getRepairType(params) {
  return request({
    url: '/gps/repairtype/page',
    method: 'get',
    params
  })
}

// 抢维修人员 => 获取当前部门的处理人员
export function getDeptUserList(params) {
  return request({
    url: '/base/user/getDeptUserList',
    method: 'get',
    params
  })
}

// 抢维修详情 =>
export function gdGdQWXInfo(params) {
  return request({
    url: grouping + '/gdglinfo/gdGdQWXInfo',
    method: 'get',
    params
  })
}

// 抢维修继续派单
export function qwxPlaceOrder(data) {
  return request({
    url: grouping + '/gdglinfo/qwxPlaceOrder',
    method: 'post',
    data
  })
}

// 抢维修继续派单
export function archivedOrder(data) {
  return request({
    url: grouping + '/gdglinfo/gdgdfl',
    method: 'post',
    data
  })
}
// 工单统计
export function gdGdHotlineInfo(params) {
  return request({
    url: '/gis/newHotline/workOrderStatistics',
    method: 'get',
    params
  })
}

// 回访统计
export function gdGdHfInfo(params) {
  return request({
    url: '/gis/newHotline/returnVisitCount',
    method: 'get',
    params
  })
}

// 质检统计
export function gdGdZJInfo(params) {
  return request({
    url: '/gis/newHotline/orderQualityCount',
    method: 'get',
    params
  })
}

// 流程配置新 新增
export function gdGdLcPOST(data) {
  return request({
    url: '/mis/gdflowconfig/saveConfig',
    method: 'post',
    data
  })
}

// 流程配置新 修改
export function gdGdLcPUT(data) {
  return request({
    url: '/mis/gdflowconfig/updateConfig',
    method: 'post',
    data
  })
}

// 汇总信息表
export function gdGdCollect(params) {
  return request({
    url: '/mis/gdglinfo/collectGdIndex',
    method: 'get',
    params
  })
}

// 各工单信息表
export function gdGdCoInfo(params) {
  return request({
    url: '/mis/gdglinfo/collectGdInfo',
    method: 'get',
    params
  })
}

// 各工单状态信息表
export function gdGdXqInfo(params) {
  return request({
    url: '/mis/gdglinfo/collectDetails',
    method: 'get',
    params
  })
}

// 报单汇总
export function gdGdBdInfo(params) {
  return request({
    url: '/mis/gdglinfo/collectGdAll',
    method: 'get',
    params
  })
}

// 结果处置
export function gdGdJgInfo(params) {
  return request({
    url: '/mis/gdglinfo/collectInfoByJgcz',
    method: 'get',
    params
  })
}

// 结果审核
export function gdGdShInfo(params) {
  return request({
    url: '/mis/gdglinfo/collectInfoByJgsh',
    method: 'get',
    params
  })
}

// 获取已分配用户
export function getWatchAllocation(params) {
  return request({
    url: '/meter/readData/watchAllocation',
    method: 'get',
    params
  })
}
// 获取区域与区域段(树形结构)
export function getQyAndQd(params) {
  return request({
    url: '/meter/readRegion/getQyAndQd',
    method: 'get',
    params
  })
}
// 查询用户信息
export function getUserInfo(params) {
  return request({
    url: `/meter/read/getSlInfoByYh`,
    method: 'get',
    params
  })
}

// 查询用户信息
export function getUserByDepts(params) {
  return request({
    url: `/base/user/getUserByDepts`,
    method: 'get',
    params
  })
}

// 查询已删除的流程
export function getById(params) {
  return request({
    url: `/mis/gdflowconfig/getById`,
    method: 'get',
    params
  })
}

// 热线添加工单备注
export function postGdBz(data) {
  return request({
    url: `/gis/newHotline/insertOrderNote`,
    method: 'post',
    data
  })
}

// 获取当前用户角色
export function getUserRole(params) {
  return request({
    url: `/gis/newHotline/getRoleInfo`,
    method: 'get',
    params
  })
}

// 来电获取用户信息
export function getPhoneUserInfo(params) {
  return request({
    url: `/gis/newHotline/telGetInfo`,
    method: 'get',
    params
  })
}

// 来电获取用户信息
export function getQWXList(params) {
  return request({
    url: `/mis/gdglinfo/getRepairreOrderCode`,
    method: 'get',
    params
  })
}

// 工单完成率查询

export function getWCLList(params, isExport) {
  return request({
    url: `/mis/gdglinfo/collectGd`,
    method: 'get',
    params,
    responseType: isExport === 1 ? 'arraybuffer' : 'json'
  })
}

// 获取用户
export function getUserList(params) {
  return request({
    url: `/gis/newHotline/allocation`,
    method: 'get',
    params
  })
}
