import request from '@/utils/request'

// 工单上报列表
export function getOrderList(data) {
  return request({
    url: '/qc/certificationOrder/getOrderList',
    method: 'post',
    data
  })
}

// 检验记录列表
export function getCheckoutList(data) {
  return request({
    url: '/qc/certificationOrder/getCertificationList',
    method: 'post',
    data
  })
}

// 工单详细信息
export function getDetails(params) {
  return request({
    url: `/qc/certificationOrder/order`,
    method: 'get',
    params
  })
}

// 检验记录上传
export function certifyBatch(data) {
  return request({
    url: '/qc/certificationOrder/certifyBatch',
    method: 'post',
    data
  })
}

// 检验记录 本环节修改上传
export function certify(data) {
  return request({
    url: '/qc/certificationOrder/certify',
    method: 'post',
    data
  })
}
/**
 * @description ===========================================================================
 */
// 获取全部部门
export function getAll() {
  return request({
    url: `/base/department/listAll`,
    method: 'get'

  })
}
// 获取id查文件信息
export function getFileList(params) {
  return request({
    url: `/qc/certificationOrder/getFilePath`,
    method: 'get',
    params
  })
}
// 获取用户数据
export function getUserData(params) {
  return request({
    url: `/meter/qfkhjbxx/commonKh`,
    method: 'get',
    params
  })
}

// 获取区域与区域段(树形结构)
export function getQyAndQd(params) {
  return request({
    url: '/meter/readRegion/getQyAndQd',
    method: 'get',
    params
  })
}

// 查询用户信息
export function getUserInfo(params) {
  return request({
    url: `/meter/read/getSlInfoByYh`,
    method: 'get',
    params
  })
}

// 获取已分配用户
export function getWatchAllocation(params) {
  return request({
    url: '/meter/readData/watchAllocation',
    method: 'get',
    params
  })
}

// 获取认证人员
export function getUserAll(params) {
  return request({
    url: `/base/user/getUserpermissionsByDepatmentAndMune`,
    method: 'get',
    params
  })
}
// 获取驳回记录列表
export function getbhList(data, certificationNumber) {
  return request({
    url: `/qc/rejectedRecord/list?certificationNumber=${certificationNumber}`,
    method: 'post',
    data: {
      current: data.current,
      size: data.size
    }
  })
}
// 获取转派记录列表
export function getzpList(data) {
  return request({
    url: '/qc/rejectedRecord/zlTransfers',
    method: 'post',
    data
  })
}
/**
 * @description ===========================================================================
 */
// 获取分页
export function getList(data) {
  return request({
    url: `/qc/certificationOrder/getCertificationList?startDate=${data.startDate}&endDate=${data.endDate}&number=${data.number}`,
    method: 'post',
    data: {
      current: data.current,
      size: data.size
    }
  })
}

// 获取分页
export function getworkList(data) {
  return request({
    url: `/qc/certificationOrder/getOrderList?startDate=${data.startDate}&endDate=${data.endDate}&number=${data.number}&currentProcess=${data.currentProcess}`,
    method: 'post',
    data: {
      current: data.current,
      size: data.size
    }
  })
}

// 查询每条数据详细信息
export function getDetail(params) {
  return request({
    url: `/qc/certificationOrder/detail`,
    method: 'get',
    params
  })
}

// 获取详情
export function getAllDetail(url, params) {
  return request({
    url,
    method: 'get',
    params
  })
}

// 修改
export function SetPageEdit(data) {
  return request({
    url: `/qc/certificationOrder/update`,
    method: 'post',
    data
  })
}

// 获取当前用户部门
export function getUserDepart() {
  return request({
    url: `/base/user/getDepartmentUser`,
    method: 'get'

  })
}

// 新增认证工单
export function setSave(data) {
  return request({
    url: `/qc/certificationOrder/save`,
    method: 'post',
    data
  })
}

// 删除
export function Delete(params) {
  return request({
    url: `/qc/certificationOrder/delete`,
    method: 'get',
    params
  })
}

// 获取驳回记录列表
export function getTurnList(data, certificationNumber) {
  return request({
    url: `/qc/rejectedRecord/list?certificationNumber=${certificationNumber}`,
    method: 'post',
    data
  })
}

// 获取字典表
export function getCodeAll() {
  return request({
    url: `/base/syscommoncode/all`,
    method: 'get'
  })
}

// 获取部门领导
export function getDeptPerson(params) {
  return request({
    url: '/base/user/getUserpermissionsByDepatmentAndMune',
    method: 'get',
    params
  })
}

// 第三方接口
export function getUserList(data) {
  return request({
    url: '/gis/sxjDocking/send',
    method: 'POST',
    data
  })
}

// 转派记录
export function GetzlTransfers(data) {
  return request({
    url: '/qc/rejectedRecord/zlTransfers',
    method: 'POST',
    data
  })
}

