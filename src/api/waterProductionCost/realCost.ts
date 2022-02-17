import request from '@/utils/request'

// 制水指标
// 制水指标列表查询
export function waterProduceIndicatorList(params) {
  return request({
    url: '/gis/customWater/waterTotal',
    method: 'get',
    params
  })
}

// 填报指标
export function waterProduceIndicatorFill(data) {
  return request({
    url: '/gis/waterMaking/insertWaterIndex',
    method: 'post',
    data
  })
}

// 修改指标
export function waterProduceIndicatorEdit(data) {
  return request({
    url: '/gis/waterMaking/updateWaterIndex',
    method: 'put',
    data
  })
}

// 删除指标
export function waterProduceIndicatorDelete(params) {
  return request({
    url: '/gis/customWater/deleteWater',
    method: 'delete',
    params
  })
}

// 获取备注信息
export function getNotesInfo(params) {
  return request({
    url: '/gis/waterMaking/getNotesInfo',
    method: 'get',
    params
  })
}

// 指标单价
// 指标单价列表
export function unitPriceIndicatorList(params) {
  return request({
    url: '/gis/customPrice/viewNewPrice',
    method: 'get',
    params
  })
}

// 添加指标单价
export function unitPriceIndicatorFill(data) {
  return request({
    url: '/gis/waterMaking/insertPrice',
    method: 'post',
    data
  })
}
// 编辑指标单价
export function unitPriceIndicatorEdit(data) {
  return request({
    url: '/gis/waterMaking/updatePrice',
    method: 'put',
    data
  })
}
// 删除指标单价
export function unitPriceIndicatorDelete(params) {
  return request({
    url: '/gis/customPrice/deletePrice',
    method: 'delete',
    params
  })
}
// 查询某年指标单价
export function someYearHistory(params) {
  return request({
    url: '/gis/customPrice/viewPrice',
    method: 'get',
    params
  })
}

// 制水单耗
// 制水单耗列表
export function waterProductionPerCost(params) {
  return request({
    url: '/gis/unit/viewUnit',
    method: 'get',
    params
  })
}

// 制水单变
// 制水单变列表
export function waterProductionPerChange(params) {
  return request({
    url: '/gis/fixed/selectFixed',
    method: 'get',
    params
  })
}

// 填报制水单变
export function waterProductionPerChangeFill(data) {
  return request({
    url: '/gis/waterMaking/insertFixed',
    method: 'post',
    data
  })
}

// 修改制水单变
export function waterProductionPerChangeEdit(data) {
  return request({
    url: '/gis/waterMaking/updateFixed',
    method: 'put',
    data
  })
}

// 删除制水单变
export function waterProductionPerChangeDelete(params) {
  return request({
    url: '/gis/fixed/deleteFixed',
    method: 'delete',
    params
  })
}

// 加压站指标
// 查询
export function addPressureQuery(params) {
  return request({
    url: '/gis/cosTprStation/viewInfo',
    method: 'get',
    params
  })
}
// 加压站平均值
export function getPreValueQuery(params) {
  return request({
    url: '/gis/cosTprStation/getPreValue',
    method: 'get',
    params
  })
}
// 新增
export function addPressureAdd(data) {
  return request({
    url: '/gis/cosTprStation/insertInfo',
    method: 'post',
    data
  })
}
// 编辑
export function addPressureEdit(data) {
  return request({
    url: '/gis/cosTprStation/updateInfo',
    method: 'put',
    data
  })
}
// 删除
export function addPressureDelete(params) {
  return request({
    url: '/gis/cosTprStation/deleteInfo',
    method: 'delete',
    params
  })
}
// 获取加压站
export function getPressureStation(params) {
  return request({
    url: '/gis/cosTprStation/getPreName',
    method: 'get',
    params
  })
}
// 模拟纠偏
export function simulation(params) {
  return request({
    url: '/gis/waterMaking/correction',
    method: 'get',
    params
  })
}

// 报警提醒
// 新增报警提醒
export function newAlarm(data) {
  return request({
    url: '/gis/costwarn',
    method: 'post',
    data
  })
}
// 查询报警提醒
export function getAlarms(params) {
  return request({
    url: '/gis/costwarn/page',
    method: 'get',
    params
  })
}
// 关闭报警
export function closeAlarm(data) {
  return request({
    url: '/gis/costwarn/shutDownWarn',
    method: 'put',
    data
  })
}
