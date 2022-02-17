import request from '@/utils/request'

//质检工单查询
export function workOrderList(data) {
  return request({
    url: '/qc/certificationOrder/workOrderList',
    method: 'post',
    data
  })
}

//工单详情
export function orderDetial(params) {
  return request({
    url: '/qc/certificationOrder/order',
    method: 'get',
    params
  })
}

//社会经济效益
export function economyBenefit(data) {
  return request({
    url: '/qc/rectifyOrder/economyBenefit',
    method: 'post',
    data
  })
}

//管理效益
export function manageBenefit(data) {
  return request({
    url: '/qc/certificationOrder/manageBenefit',
    method: 'post',
    data
  })
}

// 工单完成率(失效)
export function woCompeltRate(params) {
  return request({
    url: '/mis/gdgltypebm/getGdgltypeTree',
    method: 'get',
    params
  })
}
// 工单完成率
export function orderFinishRate(data) {
  return request({
    url: '/qc/certificationOrder/orderFinish',
    method: 'post',
    data
  })
}

//质量缺陷趋势
export function defectTrend(data) {
  return request({
    url: '/qc/certificationOrder/defectTrend',
    method: 'post',
    data
  })
}
//质量缺陷类型统计
export function defectType(data) {
  return request({
    url: '/qc/certificationOrder/defectType',
    method: 'post',
    data
  })
}

//部门工单整改率
export function orderRectifyRate(data) {
  return request({
    url: '/qc/rectifyOrder/orderRectifyList',
    method: 'post',
    data
  })
}

//认证频次表
export function clientAttestation(data){ 
  return request({
    url: '/qc/certificationOrder/clientAttestation',
    method: 'post',
    data
  })
}



