//排放口排水户模块接口
// import request from '@/utils/temporaryRequest'
import request from '@/utils/request'
/**
  * 说明：
  * get和delete传值用params,
  * post和put传值用data
  */
//排放口分页查询
export function getOutfall(params) {
    return request({
      url: '/psjc/outfall/page',
      method: 'get',
      params
    })
}
//根据key获取系统码表
export function getKeyPage(params){
  return request({
    url: '/base/code/keyPage',
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
//排水户分页查询
export function getDischarger(params) {
  return request({
    url: '/psjc/discharger/page',
    method: 'get',
    params
  })
}
//获取排水户分类类别下拉框
export function getSortList(params) {
  return request({
    url: '/psjc/discharger/getSortList',
    method: 'get',
    params
  })
}
//修改、新增、删除排水户
export function modifyDischarger(data) {
  return request({
    url: '/psjc/discharger',
    method: 'put',
    data
  })
}
export function addDischarger(data) {
  return request({
    url: '/psjc/discharger',
    method: 'post',
    data
  })
}
export function deleteDischarger(params) {
  return request({
    url: '/psjc/discharger/deleteByIds',
    method: 'delete',
    params
  })
}