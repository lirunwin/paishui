import request from '@/utils/request'

// 维护情况统计接口
// 查询
export function maintenanceSituationList(params) {
  return request({
    url: '/gps/statement/getMaintenanceStatistics',
    method: 'post',
    data: params
  })
}

// 人员工时统计接口
// 查询
export function stuffWorkTimeStatistic(params) {
  return request({
    url: '/gps/statement/getMaintenanceWork',
    method: 'post',
    data: params
  })
}

// 耗材情况统计接口
// 查询
export function consumabelSituationList(params) {
  return request({
    url: '/gps/statement/getMaterialConditions',
    method: 'post',
    data: params
  })
}

// 维修类型分析接口
// 查询
export function repairTypeStatistic(params) {
  return request({
    url: '/gps/statement/getMaintenanceTypeStatistics',
    method: 'post',
    data: params
  })
}

// 维修记录台账接口
// 查询
export function repairRecords(params) {
  return request({
    url: '/gps/statement/getMaintenanceLogLedger?' + params.join('&'),
    method: 'post'
  })
}

export function exportRepairRecords(params) {
  return request({
    url: '/gps/statement/getMaintenanceLogLedger?' + params.join('&'),
    method: 'post',
    responseType: 'blob'
  })
}

// 维修保养记录台账接口
// 查询
export function getMaintenanceMaintain(params) {
  return request({
    url: '/gps/statement/getMaintenanceMaintain?' + params.join('&'),
    method: 'post'
  })
}

// 维修保养记录台账接口
// 导出
export function exportMaintenanceMaintain(params) {
  return request({
    url: '/gps/statement/getMaintenanceMaintain?' + params.join('&'),
    method: 'post',
    responseType: 'blob'
  })
}

// 维修保养记录台账接口
// 查询
export function pipemfrecord(params) {
  return request({
    url: '/gps/pipemfrecord/page?' + params.join('&'),
    method: 'get'
  })
}

// 终端记录台账
// 查询
export function terminalRecords(params) {
  return request({
    url: '/gps/pda/page?' + params.join('&'),
    method: 'get',
  })
}

export function terminalRecords2(params) {
  return request({
    url: '/gps/statement/getTerminalRecord?' + params.join('&'),
    method: 'POST',
  })
}

export function exportTerminalRecords(params) {
  return request({
    url: '/gps/statement/getTerminalRecord?' + params.join('&'),
    method: 'POST',
    responseType: 'blob'
  })
}


// 人员排班查询
// 查询
export function personSheculing(params) {
  return request({
    url: '/gis/gsrx/dutymanager1',
    method: 'post',
    data: params
  })
}

// 维护分类统计
// 查询
export function maintenanceClassfication(params) {
  return request({
    url: '',
    method: 'get',
    params
  })
}
// 获取左侧条件列表
export function conditionsList(params) {
  return request({
    url: '',
    method: 'get',
    params
  })
}
// 删除点击项
export function deleteCondition(params) {
  return request({
    url: '',
    method: 'delete',
    params
  })
}


