import request from '@/utils/request'
import { AxiosPromise } from 'axios'

type IRes<T> = Promise<{
  code: number
  message: string
  result: T
}>

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

interface IPagination {
  current?: string | number
  size?: string | number
  total?: string | number
}

const uris = {
  review: '/gps/mobiledevice',
  device: '/gps/mobiledevice',
  deleteDeviceByIds: '/gps/mobiledevice/deleteByIds',
  page: '/gps/mobiledevice/page'
}

export const getReviews = (data: { auditStatus?: string; ids?: string }) =>
  request({ url: uris.review, method: 'get', data })

export const getMobileDevice = (id: string): IRes<IMobileDevice> =>
  request({ url: `${uris.device}/${id}`, method: 'get' })

export const delMobileDevice = (id: string) => request({ url: `${uris.device}/${id}`, method: 'delete' })

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
}) => request({ url: uris.device, method: 'post', data })

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
}) => request({ url: uris.device, method: 'put', data })

export const deleteMobileDeviceByIds = (data: { ids: string }) =>
  request({ url: uris.deleteDeviceByIds, method: 'delete', data })

export const getDevices = (data?: IMobileDeviceQuery): IRes<IMobileDeviceRes> =>
  request({ url: uris.page, method: 'get', data })
