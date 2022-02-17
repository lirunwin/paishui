import request from '@/utils/request'

const grouping = '/meter'
// const grouping = '/tofly-xrtymeterwjl'

// 获取编grouping+码/ grouping+ /
export function getCode(params) {
  return request({
    url: '/base/syscommoncode/all',
    method: 'get',
    params
  })
}
export function getCodeId(params) {
  return request({
    url: '/base/syscommoncode/getByfjId',
    method: 'get',
    params
  })
}
// 根据部门id查询所属部门的用户
export function getUserByDepts(params) {
  return request({
    url: '/meter/dept/getUserByDepts',
    method: 'get',
    params
  })
}
// 获取所有部门信息
export function getDepartment(params) {
  return request({
    url: '/base/department/listAll',
    method: 'get',
    params
  })
}
// 获取所有部门下人员
export function getDepartmentPersonnel(params) {
  return request({
    url: '/base/user/getUserByDepts',
    method: 'get',
    params
  })
}

// 获取抄表区域与区域段
export function getAreasAndRegion(params) {
  return request({
    url: grouping + '/readRegion/getQyAndQd',
    method: 'get',
    params
  })
}
// 获取抄表区域
export function getAreas(params) {
  return request({
    url: grouping + '/readRegion/readArea',
    method: 'get',
    params
  })
}
// 新增抄表区域
export function addAreas(data) {
  return request({
    url: grouping + '/readRegion/readArea',
    method: 'post',
    data
  })
}
// 删除抄表区域
export function delAreas(params) {
  return request({
    url: grouping + '/readRegion/deleteAreaByIds',
    method: 'delete',
    params
  })
}
// 修改抄表区域
export function updateAreas(data) {
  return request({
    url: grouping + '/readRegion/updateArea',
    method: 'post',
    data
  })
}
// 区域和区域段汇总数据
export function getCollect(params) {
  return request({
    url: '/meter/readRegion/qydCollect',
    method: 'get',
    params
  })
}
// 获取抄表区段
export function getRegion(params) {
  return request({
    url: grouping + '/readRegion/paragraph',
    method: 'get',
    params
  })
}

// 删除抄表区段
export function delRegion(params) {
  return request({
    url: grouping + '/readRegion/paragraph',
    method: 'delete',
    params
  })
}

// 新增抄表区段
export function addRegion(data) {
  return request({
    url: grouping + '/readRegion/paragraph',
    method: 'post',
    data
  })
}

// 修改抄表区段
export function updateRegion(data) {
  return request({
    url: grouping + '/readRegion/updateParagraph',
    method: 'post',
    data
  })
}
// 上传
export function importCbqydFile(data) {
  return request({
    url: '/meter/readRegion/importCbqydFile',
    method: 'post',
    data
  })
}

// =====================================================
// 开关记录查询
export function getRecordSwitch(params) {
  return request({
    url: grouping + '/switch/query',
    method: 'get',
    params
  })
}
// =====================================================
// 分配页面首页--区域  左
export function getQyCllect(params) {
  return request({
    url: '/meter/readData/getQyCllect',
    method: 'get',
    params
  })
}
// 分配页面首页--区域段 右
export function getAllocationParagraph(params) {
  return request({
    url: '/meter/readData/allocationParagraph',
    method: 'get',
    params
  })
}
// 获取已分配用户
export function getWatchAllocation(params) {
  return request({
    url: grouping + '/readData/watchAllocation',
    method: 'get',
    params
  })
}
// 获取未分配用户列表
export function getNoAllocationTwo(params) {
  return request({
    url: grouping + '/readData/getNoAllocationTwo',
    method: 'get',
    params
  })
}

// 分配--用户分配
export function allocation(data) {
  return request({
    url: grouping + '/readData/allocation',
    method: 'post',
    data
  })
}
// 分配--用户分配
export function undock(data) {
  return request({
    url: '/meter/readData/undock',
    method: 'post',
    data
  })
}
// 获取抄表本 抄表片区  客户
export function getCbbOrCbpq(params) {
  return request({
    url: '/meter/readData/getCbbOrCbpq',
    method: 'get',
    params
  })
}

// =====================================================
// 获取区域与区域段(树形结构)
export function getQyAndQd(params) {
  return request({
    url: '/meter/readRegion/getQyAndQd',
    method: 'get',
    params
  })
}
// =====================================================
// 抄表序号
export function editCbOrder(data) {
  return request({
    url: '/meter/readData/cbOrder',
    method: 'post',
    data
  })
}
//  获取未选择排序客户
export function getNoOrderYh(params) {
  return request({
    url: '/meter/readData/getNoOrderYh',
    method: 'get',
    params
  })
}

// ======================== 抄表计划 =============================

//  首页年计划--查看
export function getYearPlan(params) {
  return request({
    url: '/meter/readPlan/getYearPlan',
    method: 'get',
    params
  })
}
// 首页年计划--制定
export function makeYearPlan(data) {
  return request({
    url: '/meter/readPlan/makeYearPlan',
    method: 'post',
    data
  })
}
// 首页年计划--修改
export function updateYearPlan(data) {
  return request({
    url: '/meter/readPlan/updateYearPlan',
    method: 'post',
    data
  })
}
// 首页年计划--删除
export function delYearPlan(params) {
  return request({
    url: '/meter/readPlan/delYearPlan',
    method: 'delete',
    params
  })
}

// 计划详情--添加
export function addDeatilPlan(data) {
  return request({
    url: '/meter/readPlan/addDeatilPlan',
    method: 'post',
    data
  })
}
//  计划详情--查看
export function getDeatilByPlan(params) {
  return request({
    url: '/meter/readPlan/getDeatilByPlan',
    method: 'get',
    params
  })
}

//  计划详情--复制
export function copeYearPlan(data) {
  return request({
    url: '/meter/readPlan/copeYearPlan',
    method: 'post',
    data
  })
}

// 计划详情--计划移除
export function deleteDeatilsPlan(params) {
  return request({
    url: '/meter/readPlan/deleteDeatilsPlan',
    method: 'delete',
    params
  })
}
//  计划详情--查看已经制定计划的区域和区域段
export function getQyInfoByPlan(params) {
  return request({
    url: '/meter/readPlan/getQyInfoByPlan',
    method: 'get',
    params
  })
}

// 计划详情--修改
export function updateDeatilPlan(data) {
  return request({
    url: '/meter/readPlan/updateDeatilPlan',
    method: 'put',
    data
  })
}

// =======================抄表审核=============================
// --异常汇总数据=
export function getStatisAudit(params) {
  return request({
    url: '/meter/read/getStatisAudit',
    method: 'get',
    params
  })
}
// =======================离线抄表==============================
// 离线抄表汇总数据
export function getOffline(params) {
  return request({
    url: '/meter/appRead/getOffline',
    method: 'get',
    params
  })
}

// 离线抄表汇   详情数据
export function getOfflineInfo(params) {
  return request({
    url: '/meter/appRead/getOfflineInfo',
    method: 'get',
    params
  })
}
// 离线抄表--查询客户信息
export function getOfflineByYhbh(params) {
  return request({
    url: '/meter/appRead/getOfflineByYhbh',
    method: 'get',
    params
  })
}

// 抄表数据填写
export function readRecord(data) {
  return request({
    url: '/meter/appRead/readRecord',
    method: 'post',
    data
  })
}
// 离线抄表--异常提醒
export function abnormalRemind(params) {
  return request({
    url: '/meter/appRead/abnormalRemind',
    method: 'get',
    params
  })
}
// 离线抄表--同步抄表水量
export function updateSynCbsl(data) {
  return request({
    url: '/meter/appRead/synCbsl',
    method: 'put',
    data
  })
}
// 离线抄表--修改抄表水量
export function updateCbsl(data) {
  return request({
    url: '/meter/appRead/updateCbsl',
    method: 'put',
    data
  })
}
// =====================================================
// 获取未分配用户列表
export function getData(params) {
  return request({
    url: grouping + '/readData/getNoAllocationTwo',
    method: 'get',
    params
  })
}

// 设备列表分页查询
export function getDeviceList(params) {
  return request({
    url: grouping + '/equi/getEqui',
    method: 'get',
    params
  })
}
// 删除设备
export function delDevice(params) {
  return request({
    url: grouping + '/equi/deleteByIds',
    method: 'delete',
    params
  })
}
// 新增设备
export function addDevice(data) {
  return request({
    url: grouping + '/equi/saveEqui',
    method: 'post',
    data
  })
}
// 发放设备
export function grantDevice(data) {
  return request({
    url: '/meter/equi/grand',
    method: 'put',
    data
  })
}
// 修改设备
export function editDevice(data) {
  return request({
    url: grouping + '/equi/updateEqui',
    method: 'put',
    data
  })
}

// 抄表计划查询
export function getPlanList(params) {
  return request({
    url: grouping + '/read/getReadPcPlan',
    method: 'get',
    params
  })
}

// 设置
export function addPlan(data) {
  return request({
    url: grouping + '/read/pcgenerPlan',
    method: 'post',
    data
  })
}

// 抄表数据查询
export function getReadPc(params) {
  return request({
    url: grouping + '/read/getReadPc',
    method: 'get',
    params
  })
}
// // 修改抄表顺序1
// export function editReadPc(data) {
//   return request({
//     url: grouping + '/read/cbOrder',
//     method: 'post',
//     data
//   })
// }
// 修改抄表顺序2
export function editReadPc(data) {
  return request({
    url: grouping + '/read/cbOrderTwo',
    method: 'post',
    data
  })
}
// 修改抄表顺序3
export function editReadPcT(data) {
  return request({
    url: grouping + '/read/cbOrderThree',
    method: 'post',
    data
  })
}
// 抄表审核数据查看
export function getAudit(params) {
  return request({
    url: grouping + '/read/getAudit',
    method: 'get',
    params
  })
}

// 抄表数据审核
export function addAudit(data) {
  return request({
    url: grouping + '/read/audit',
    method: 'post',
    data
  })
}
// 获取抄表周期
export function getMonth(params) {
  return request({
    url: grouping + '/readRegion/period',
    method: 'get',
    params
  })
}

// 获取算法配置
export function getArith(params) {
  return request({
    url: grouping + '/arithmetic/getArith',
    method: 'get',
    params
  })
}

// 更改算法配置
export function updateAudit(data) {
  return request({
    url: grouping + '/arithmetic/getArith',
    method: 'post',
    data
  })
}
// _____________统计___________________

// 抄表分配统计--汇总数据
export function allocationClloect(params) {
  return request({
    url: '/meter/statistics/allocationClloect',
    method: 'get',
    params
  })
}
// 抄表分配统计--详情数据
export function allocationInfo(params) {
  return request({
    url: '/meter/statistics/allocationInfo',
    method: 'get',
    params
  })
}
// 抄表查询
export function readQuery(params) {
  return request({
    url: grouping + '/statistics/readQuery',
    method: 'get',
    params
  })
}
// 客户抄表查询
export function getClient(params) {
  return request({
    url: '/meter/statistics/getClient',
    method: 'get',
    params
  })
}

// 抄表率统计
// 区域
export function readPercent(params) {
  return request({
    url: grouping + '/statistics/readPercent',
    method: 'get',
    params
  })
}

//  抄表区域段
export function readPercentByQy(params) {
  return request({
    url: grouping + '/statistics/readPercentByQy',
    method: 'get',
    params
  })
}

// 抄表人员
export function readPercentDeatil(params) {
  return request({
    url: grouping + '/statistics/readPercentByCbry',
    method: 'get',
    params
  })
}

// 抄表时间统计
// 第一层
// export function readTime(params) {
//   return request({
//     url: grouping + '/statistics/readTime',
//     method: 'get',
//     params
//   })
// }

// 第二层
export function readTimeDeatil(params) {
  return request({
    url: grouping + '/statistics/readTimeDeatil',
    method: 'get',
    params
  })
}
/**
 * @description 质检统计分析
 */
//  抄表抽查--当天核查情况汇总  （第一层页面）
export function getInspect(params) {
  return request({
    url: '/meter/qualitysta/inspect',
    method: 'get',
    params
  })
}

//  抄表抽查--详情数据列表  （第二层页面）
export function getInspectDetail(params) {
  return request({
    url: '/meter/qualitysta/inspectDetail',
    method: 'get',
    params
  })
}
//  抄表抽查--上报质检 （第四层页面）
export function reportQuality(data) {
  return request({
    url: '/meter/read/audit',
    method: 'post',
    data
  })
}

//  抄表超时统计--汇总 左
export function getOvertimeCollect(params) {
  return request({
    url: '/meter/statistics/getOvertimeCollect',
    method: 'get',
    params
  })
}
//  抄表超时统计--详情 右
export function getOvertimeCollectDeatil(params) {
  return request({
    url: '/meter/statistics/getOvertimeCollectDeatil',
    method: 'get',
    params
  })
}

// 抄表超时统计--详情  第二页
export function getReadDayInfo(params) {
  return request({
    url: '/meter/statistics/getReadDayInfo',
    method: 'get',
    params
  })
}
