import request from '@/utils/request'

// 分区管理分区树
export function zoningTree(params) {
  return request({
    url: '/gis/area/partition',
    method: 'get',
    params
  })
}

// 通过点击左侧树获取该分区下的列表
export function getTargetZoningList(params) {
  return request({
    url: '/gis/area/partitionById',
    method: 'get',
    params
  })
}

// 获取不同分区的个数
export function getDifferentZoningNum(params) {
  return request({
    url: '/gis/area/partitionNum',
    method: 'get',
    params
  })
}

// 删除选定项
export function deleteSelections(params) {
  return request({
    url: '/gis/area/partition',
    method: 'delete',
    params
  })
}

// 新增或修改分区
export function createAndEditZoning(data) {
  return request({
    url: '/gis/area/partition',
    method: 'post',
    data
  })
}

// 获取管材列表
export function getMaterialList(params) {
  return request({
    url: '/base/syscommoncode/getByfjId',
    method: 'get',
    params
  })
}
// 获取用户信息
export function getBingUser(params) {
  return request({
    url: '/gis/AreaBingYh/getBing',
    method: 'get',
    params
  })
}
// 用户批量解绑
export function postBingUser(data) {
  return request({
    url: '/gis/AreaBingYh/unbing',
    method: 'POST',
    data
  })
}

// 解绑分区下所有用户
export function postBingAllUser(data) {
  return request({
    url: '/gis/AreaBingYh/unbingAreaId',
    method: 'POST',
    data
  })
}
// 用户批量绑定
export function postBingUserBD(data) {
  return request({
    url: '/gis/AreaBingYh/bing',
    method: 'POST',
    data
  })
}
// 获取用户信息
export function getCbb(data) {
  return request({
    url: '/gis/AreaBingYh/cbb',
    method: 'get',
    data
  })
}
