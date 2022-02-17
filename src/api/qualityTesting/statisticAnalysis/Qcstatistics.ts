import request from '@/utils/request'

// 获取分页
export function getList(params) {
    return request({
      url: `/meter/report/quality`,
      method: 'get',
      params
    })
  }

  
// 查询用户信息
export function detail(params) {
    return request({
      url: `/meter/report/quality-detail`,
      method: 'get',
      params
    })
  }

  // 获取字典表
export function getCodeAll() {
  return request({
      url: `/base/syscommoncode/all`,
      method: 'get',
  })
}