import request from '@/utils/request'

/**
  * 说明：
  * get和delete传值用params,
  * post和put传值用data
  */

//趋势分析相关接口
//获取主页面表格数据
export function queryTrendAnalysis(params) {
  return request({
    url: 'gis/scadaAbout/viewHistory',
    method: 'get',
    params
  })
}

//计算超标次数
export function overTimesCompute(params) {
  return request({
    url: 'gis/scadaAbout/getOverStandardNum',
    method: 'get',
    params
  })
}

//计算合格率
export function getPassRatio(params) {
  return request({
    url: 'gis/scadaAbout/getPassRate',
    method: 'get',
    params
  })
}

//监控历史查询接口
export function queryMonitorHistory(params) {
  return request({
    url: 'gis/scadaAbout/viewHistory',
    method: 'get',
    params
  })
}

//测站指标相关接口
// 测站查询接口
export function queryTestSitesIndex(params) {
  return request({
    url: 'gis/scadaAbout/selectStation',
    method: 'get',
    params
  })
}

// 测站添加接口
export function addTestSites(data) {
  return request({
    url: 'gis/scadaAbout/insertStation',
    method: 'post',
    data
  })
}

// 测站修改接口
export function alterTestSites(data) {
  return request({
    url: 'gis/scadaAbout/updateStation',
    method: 'put',
    data
  })
}

// 测站删除接口
export function deleteTestSites(params) {
  return request({
    url: 'gis/scadaAbout/deleteStation',
    method: 'delete',
    params
  })
}

//指标查询接口
export function queryIndex(params) {
  return request({
    url: 'gis/scadaAbout/selectIndex',
    method: 'get',
    params
  })
}

// 指标配置接口
export function disposeIndex(data) {
  return request({
    url: 'gis/scadaAbout/insertIndex',
    method: 'post',
    data
  })
}

// 指标修改接口
export function alterIndex(data) {
  return request({
    url: 'gis/scadaAbout/updateIndex',
    method: 'put',
    data
  })
}

// 指标删除接口
export function deleteIndex(params) {
  return request({
    url: 'gis/scadaAbout/deleteIndex',
    method: 'delete',
    params
  })
}

//模板下载接口
export function downloadMould(params) {
  return request({
    url: '',
    method: 'get',
    params
  })
}

//获取未被绑定指标
export function getIndexNo(params) {
  return request({
    url: 'gis/scadaAbout/viewIndex',
    method: 'get',
    params
  })
}