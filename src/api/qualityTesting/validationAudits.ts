import request from '@/utils/request'

// 获取分页
export function getList(data) {
  return request({
    url: '/qc/rectifyOrder/getRectifyValidateList',
    method: 'post',
    data
  })
}

// 获取详情
export function getDetail(params) {
  return request({
    url: '/qc/rectifyOrder/getRectifyValidateDetail',
    method: 'get',
    params
  })
}
// 处理
export function submit(data, executeAdvice) {
  return request({
    url: `/qc/rectifyOrder/updateRectifyValidate?executeAdvice=${executeAdvice}`,
    method: 'post',
    data
  })
}
