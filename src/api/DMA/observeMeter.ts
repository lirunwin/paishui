import requeset from '@/utils/request'

//  获取观察表月供水量
export function observeMeterSupplyMonthlyList(params, file) {
  return requeset({
    url: '/gis/supplyMonth/getSupplyMonth',
    method: 'get',
    params,
    responseType: file ? 'blob' : 'json'
  })
}
//  获取分区内观察表统计信息
export function observeMeterStatisticInfo(params) {
  return requeset({
    url: '/gis/tableCount/getPartition',
    method: 'get',
    params
  })
}
//  获取观察表详细信息
export function observeMeterDetailInfo(params, file) {
  return requeset({
    url: '/gis/tableCount/viewPartition',
    method: 'get',
    params,
    responseType: file ? 'blob' : 'json'
  })
}

//  获取观察表月供水量(按月)
export function observeMeterSupplyMonthlyListM(params, file) {
  return requeset({
    url: '/gis/supplyMonth/getSupplyMonth',
    method: 'get',
    params,
    responseType: file ? 'blob' : 'json'
  })
}
//  获取观察表月供水量(按天)
export function observeMeterSupplyMonthlyListD(params, file) {
  return requeset({
    url: '/gis/supplyMonth/getSupplyDay',
    method: 'get',
    params,
    responseType: file ? 'blob' : 'json'
  })
}
//  获取观察表月供水量(按时)
export function observeMeterSupplyMonthlyListH(params, file) {
  return requeset({
    url: '/gis/supplyMonth/getSupplyHour',
    method: 'get',
    params,
    responseType: file ? 'blob' : 'json'
  })
}
