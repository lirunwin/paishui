import request from '@/utils/request'

// 获取分页
export function getList(params) {
  return request({
    url: `/qc/plan/getManageList`,
    method: 'post',
    params
  })
}

// 获取全部部门
export function getAll() {
  return request({
    url: `/meter/dept/getAll`,
    method: 'get',

  })
}

// 获取认证人员
export function getUserAll(params) {
  return request({
    url: `/meter/dept/getUserByDepts`,
    method: 'get',
    params
  })
}

// 添加
export function savePlan(data) {
  return request({
    url: `/qc/plan/savePlan`,
    method: 'post',
    data,
    file: true,
  })
}

// 获取文件列表 
export function getFileList(params) {
  return request({
    url: `/qc/certificationOrder/getFilePath`,
    method: 'get',
    params,
  })
}

// 上报
export function reportPlan(data) {
  return request({
    url: `/qc/plan/reportPlan`,
    method: 'post',
    data,
  })
}

// 获取文件列表 
export function detail(params) {
  return request({
    url: `/qc/plan/getDetailAndHistoryList`,
    method: 'get',
    params,
  })
}

// 获取字典表
export function getCode() {
  return request({
    url: `/base/syscommoncode/all`,
    method: 'get',
  })
}

// 修改
export function edit(data) {
  return request({
    url: `/qc/plan/updatePlan`,
    method: 'post',
    data
  })
}
