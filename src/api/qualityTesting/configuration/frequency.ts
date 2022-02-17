import request from '@/utils/request'

// 获取分页
export function getList() {
  return request({
    url: `/qc/scanFrequencyConfig/list`,
    method: 'get'
  })
}

// 获取分页
export function config(data) {
  return request({
    url: `/qc/scanFrequencyConfig/config`,
    method: 'post',
    data
  })
}

// 获取分页
export function save(data) {
  return request({
    url: `/qc/scanFrequencyConfig/newConfig`,
    method: 'post',
    data
  })
}

// 获取分页
export function del(params) {
  return request({
    url: `/qc/scanFrequencyConfig/deleteConfig`,
    method: 'get',
    params
  })
}

// 获取分页
export function configScanFrequency(params) {
  return request({
    url: `/qc/scanFrequencyConfig/configScanFrequency`,
    method: 'get',
    params
  })
}
