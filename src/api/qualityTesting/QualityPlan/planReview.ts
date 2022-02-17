import request from '@/utils/request'

// 获取分页
export function getList(params) {
    return request({
      url: `/qc/plan/getAuditList`,
      method: 'post',
      params
    })
  }

  // 审核
export function auditPlan(params) {
  return request({
    url: `/qc/plan/auditPlan`,
    method: 'get',
    params
  })
}
