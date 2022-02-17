import request from '@/utils/request'

// 区域视察表
// 查询表列表
export function obeserveMeterList(params) {
  return request({
    url: '/gis/dmaTable/selectTableInfo',
    method: 'get',
    params
  })
}
// 添加表信息
export function addNewMeterInfos(data) {
  return request({
    url: '/gis/dmaTable/insertTableInfo',
    method: 'post',
    data
  })
}
// 修改表信息
export function editMeterInfos(data) {
  return request({
    url: '/gis/dmaTable/updateTableInfo',
    method: 'put',
    data
  })
}
// 删除表信息
export function deleteMeterInfos(params) {
  return request({
    url: '/gis/dmaTable/deleteTableInfo',
    method: 'delete',
    params
  })
}
// 获取站点列表
export function getStationList(params) {
  return request({
    url: '/gis/scadaAbout/selectStation',
    method: 'get',
    params
  })
}
// 获取指标列表
export function getTargetList(params) {
  return request({
    url: '/gis/dmaTable/viewIndex',
    method: 'get',
    params
  })
}
// 绑定指标
export function bindingTarget(data) {
  return request({
    url: '/gis/dmaTable/bindIndex',
    method: 'post',
    data
  })
}
// 获取绑定的指标列表
export function getBindedTargetList(params) {
  return request({
    url: '/gis/dmaTable/bindTableInfo',
    method: 'get',
    params
  })
}
// 解绑指标
export function unbindTarget(params) {
  return request({
    url: '/gis/dmaTable/untieIndex',
    method: 'delete',
    params
  })
}
// 区域表导出
export function exportZoningMeter(params) {
  return request({
    url: '/gis/dmaTable/exportTableInfo',
    method: 'get',
    responseType: 'blob',
    params
  })
}
// 表平均流量
export function getMeterAvgFlow(params) {
  return request({
    url: '/gis/dmaTable/avgFlow',
    method: 'get',
    params
  })
}
// 表历史流量
export function getMeterHistoryFlow(params) {
  return request({
    url: '/gis/dmaTable/historicalTraffic',
    method: 'get',
    params
  })
}
// 旧表数据
export function getOldMeterData(params) {
  return request({
    url: '/gis/dmaTable/oldTableData',
    method: 'get',
    params
  })
}
// 换表
export function changeMeter(data) {
  return request({
    url: '/gis/dmaTable/changeTable',
    method: 'post',
    data
  })
}

// 水表查询
export function getusernamelist(params) {
  return request({
    url: '/meter/waterGis/numberGetInfo',
    method: 'get',
    params
  })
}

