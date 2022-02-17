import request from '@/utils/request'

// 获取分页
export function getList(data) {
  return request({
    url: `/qc/rectifyOrder/getBusinessMonitorList?startDate=${data.startDate}&endDate=${data.endDate}&number=${data.number}&currentProcess=${data.currentProcess}&orderExceptionStatus=${data.orderExceptionStatus}`,
    method: 'post',
    data: {
      current: data.current,
      size: data.size
    }
  })
}

// 获取详情
export function getDetail(params) {
  return request({
    url: `/qc/rectifyOrder/getAllDetail`,
    method: 'get',
    params
  })
}
