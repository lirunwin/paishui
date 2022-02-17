import request from '@/utils/request'

// 获取数据
export function readCode(params) {
  return request({
    url: '/mis/gdgltypebm/getGdgltypeTree',
    method: 'get',
    params
  })
}
// 修改
export function updateCode(data) {
  return request({
    url: '/mis/gdgltypebm',
    method: 'put',
    data
  })
}
// 新增
export function createCode(data) {
  return request({
    url: '/mis/gdgltypebm',
    method: 'post',
    data
  })
}
// 删除
export function deleteCode(params) {
  return request({
    url: '/mis/gdgltypebm/deleteByIds',
    method: 'delete',
    params
  })
}

// 用水性质
export function getnature(params) {
  return request({
    url: '/meter/quality/nature',
    method: 'get',
    params
  })
}
