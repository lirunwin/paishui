import request from '@/utils/request'

// 获取分页
export function getList() {
  return request({
    url: `/qc/rejectedCountConfig/list`,
    method: 'get'
  })
}

// 获取分页
export function config(data) {
  return request({
    url: `/qc/rejectedCountConfig/config`,
    method: 'post',
    data
  })
}
