import request from '@/utils/request'

// 获取分页
export function getLists() {
  return request({
    url: `/qc/timeConfig/list`,
    method: 'get'
  })
}

// 修改
export function config(data) {
  return request({
    url: `/qc/timeConfig/config`,
    method: 'post',
    data
  })
}
// 获取分页
export function getList(ccid) {
  return request({
    url: `/base/syscommoncode/${ccid}`,
    method: 'get'
  })
}

// 修改
export function inspectRatio(params) {
  return request({
    url: `/meter/qualitysta/inspectRatio`,
    method: 'get',
    params
  })
}
