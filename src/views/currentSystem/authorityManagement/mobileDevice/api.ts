import request from '@/utils/request'

type IRes<T = any> = Promise<{
  code: number
  message: string
  result: T
}>

export interface IPagination {
  current?: string | number
  size?: string | number
  total?: string | number
}

export interface IMobileDevice extends IPagination {
  /** 审核状态 0 未审核 1已审核 */
  auditStataus?: string
  /** 上报时间 */
  createTime?: string
  /** 上报人 */
  createUserid?: string | number
  department: object
  /** 设备电话 */
  devicePhone?: string
  id?: string | number
  /** 设备meid */
  meid?: string
  /** 设备名称 */
  name?: string
  /** 设备编号 */
  no?: string
  /** 备注 */
  note?: string
  /** 状态 0 历史 1 当前 如查询 历史 当前 传入 0,1 */
  status?: string
  /** 设备类型 */
  type?: string
  /** 使用部门id */
  useDeptId?: string
  /** 使用人员id */
  userUserId?: string
}
export interface IMobileDeviceQuery extends IPagination {
  /** app 历史当前状态 0 历史 1 当前 多个以,分割 */
  auditQuery?: string
  /** 审核状态 0 未审核 1已审核 */
  auditStataus?: string
  /** 上报时间 */
  createTime?: string
  /** 上报人 */
  createUserid?: string | number
  /** 设备电话 */
  devicePhone?: string
  id?: string | number
  /** 设备meid */
  meid?: string
  /** 设备名称 */
  name?: string
  /** 设备编号 */
  no?: string
  /** 备注 */
  note?: string
  /** 设备名称序列号模糊搜索 */
  queryLike?: string
  /** 状态 0 历史 1 当前 如查询 历史 当前 传入 0,1 */
  status?: string
  /** 设备类型 */
  type?: string
  /** 使用部门id */
  useDeptId?: string
  /** 使用人员id */
  userUserId?: string
}

interface IMobileDeviceRes extends IPagination {
  hitCount: boolean
  optimizeCountSql: boolean
  orders: { asc: boolean; column: string }[]
  pages: number
  records: IMobileDevice[]
  searchCount: boolean
}

const uris = {
  device: '/gps/mobiledevice',
  deleteDeviceByIds: '/gps/mobiledevice/deleteByIds',
  page: '/gps/mobiledevice/page',
  departments: '/base/department/list',
  users: '/base/user/getDeptUserList',
  registers: '/gps/mobiledevice/register',
  review: 'gps/mobiledevice/deviceAudit'
}

export const getMobileDevice = (id: string): IRes<IMobileDevice> =>
  request({ url: `${uris.device}/${id}`, method: 'get' })

export const delMobileDevice = (id: string): IRes => request({ url: `${uris.device}/${id}`, method: 'delete' })

export const postMobileDevice = (data: {
  auditStataus?: string
  createTime?: string
  createUserid?: string | number
  delFlag?: string
  devicePhone?: string
  id?: string | number
  meid?: string
  name?: string
  no?: string
  note?: string
  status?: string
  type?: string
  useDeptId?: string | number
  userUserId?: string | number
}): IRes => request({ url: uris.device, method: 'post', data })

export const putMobileDevice = (data: {
  auditStataus?: string
  createTime?: string
  createUserid: string | number
  delFlag?: string
  devicePhone?: string
  id: string | number
  meid?: string
  name?: string
  no?: string
  note?: string
  status?: string
  type?: string
  useDeptId: string | number
  userUserId: string | number
}): IRes => request({ url: uris.device, method: 'put', data })

export const deleteMobileDeviceByIds = (ids: string): IRes =>
  request({ url: uris.deleteDeviceByIds, method: 'delete', params: { ids } })

export const getDevices = (params?: IMobileDeviceQuery): IRes<IMobileDeviceRes> =>
  request({ url: uris.page, method: 'get', params })

export const getDepartments = () =>
  request({
    url: uris.departments,
    method: 'get'
  })

export const getUsers = (deptId: string) =>
  request({
    url: uris.users,
    method: 'get',
    params: { deptId }
  })
export const getRegisters = (): IRes => request({ url: uris.registers, method: 'get' })

export const reviewMobileDeviceByIds = (params: { ids: string; auditStatus?: string }): IRes =>
  request({ url: uris.review, method: 'get', params: { auditStatus: '1', ...params } })
