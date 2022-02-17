import request from '@/utils/request'

// 获取分页
export function getList(data) {
  return request({
    url: '/qc/rectifyOrder/getRectifyIssueList',
    method: 'post',
    data
  })
}

// 获取详情
export function getDetail(params) {
  return request({
    url: '/qc/rectifyOrder/getRectifyIssueDetail',
    method: 'get',
    params
  })
}
// 处理整改下达,推送消息,可上传文件
export function submit(data) {
  return request({
    url: '/qc/rectifyOrder/updateRectifyIssue',
    method: 'post',
    data
  })
}

// 获取分页
// export function getList(data) {
//   return request({
//     url: `/qc/rectifyOrder/getRectifyIssueList?startDate=${data.startDate}&endDate=${data.endDate}&number=${data.number}`,
//     method: 'post',
//     data: {
//       current: data.current,
//       size: data.size
//     }
//   })
// }

// // 获取详情
// export function getDetail(url, params) {
//   return request({
//     url,
//     method: 'get',
//     params
//   })
// }

// // 提交审核
// export function submit(data, executeAdvice) {
//   return request({
//     url: `/qc/rectifyOrder/updateRectifyIssue?executeAdvice=${executeAdvice}`,
//     method: 'post',
//     data
//   })
// }
