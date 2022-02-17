import request from '@/utils/request'

// 汇总首页数据
export function summary(data) {
  return request({
    url: '/qc/certificationOrder/summary',
    method: 'post',
    data
  })
}

// 质检 工单上报 汇总列表
export function reportSummary(data) {
  return request({
    url: '/qc/certificationOrder/reportSummary',
    method: 'post',
    data
  })
}
// 质检 检验记录 汇总列表
export function inspectSummary(data) {
  return request({
    url: '/qc/certificationOrder/inspectSummary',
    method: 'post',
    data
  })
}

// 质检 审核下达 汇总列表
export function issueSummary(data) {
  return request({
    url: '/qc/rectifyOrder/issueSummary',
    method: 'post',
    data
  })
}

// 质检 整改处置 汇总列表
export function rectifySummary(data) {
  return request({
    url: '/qc/rectifyOrder/rectifySummary',
    method: 'post',
    data
  })
}

// 质检 整改审核 汇总列表
export function auditSummary(data) {
  return request({
    url: '/qc/rectifyOrder/auditSummary',
    method: 'post',
    data
  })
}
// 质检 整改验证 汇总列表
export function verifySummary(data) {
  return request({
    url: '/qc/rectifyOrder/verifySummary',
    method: 'post',
    data
  })
}
// 质检 验证审核 汇总列表
export function validateSummary(data) {
  return request({
    url: '/qc/rectifyOrder/validateSummary',
    method: 'post',
    data
  })
}
