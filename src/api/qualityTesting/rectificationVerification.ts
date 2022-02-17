import request from '@/utils/request'

// 获取分页
export function getList(data) {
  return request({
    url: '/qc/rectifyOrder/getRectifyVerifyList',
    method: 'post',
    data
  })
}

// 获取详情
export function getDetail(params) {
  return request({
    url: '/qc/rectifyOrder/getRectifyVerifyDetail',
    method: 'get',
    params
  })
}
// 处理
export function submit(data, executeAdvice) {
  return request({
    url: `/qc/rectifyOrder/updateRectifyVerify?executeAdvice=${executeAdvice}`,
    method: 'post',
    data
  })
}
