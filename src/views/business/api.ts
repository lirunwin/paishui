import { serialize } from 'object-to-formdata'
import axios from '@/utils/request'

const base = '/gps'
const uris = {
  // users: '/base/user/pageNew',
  users: '/base/user/getUserByDepts',
  events: {
    base: `${base}/eventmange`,
    page: `${base}/eventmange/page`
  },
  assign: {
    base: `${base}/dispatch`,
    page: `${base}/dispatch/page`,
    delBatch: `${base}/dispatch/deleteByIds`
  },
  flood: {
    base: `${base}/floodseasonw`,
    page: `${base}/floodseasonw/page`,
    delBatch: `${base}/floodseasonw/deleteByIds`
  },
  vehicle: {
    base: `${base}/car`,
    page: `${base}/car/page`,
    delBatch: `${base}/car/deleteByIds`,
    archive: {
      page: `${base}/cartrack/page`
    }
  }
}

type IRes<T = any> = Promise<{
  code: number
  message: string
  result: IQueryCommon & { records: T }
}>

type IResult<T = any> = Promise<{
  code: number
  message: string
  result: T
}>

export interface IPagination {
  current?: string | number
  size?: string | number
  total?: string | number
}

// interface ICreator {
//   /** 创建时间 */
//   createTime?: string
//   /** 创建人 */
//   createUser?: string
// }

interface IQueryCommon extends IPagination {
  hitCount?: boolean
  optimizeCountSql?: boolean
  orders?: { asc?: boolean; column?: string }[]
  pages?: number
  searchCount?: boolean
}
export interface IDepartment {
  name: string
  id: string | number
  users: {
    realName: string
    phone: string
    departmentId: string | number
    id: string | number
  }[]
}

export interface IEvent {
  address: string
  /** 事件类别 1普通事件 2紧事件 */
  category: string
  createTime: string
  createUserid: string | number
  detail: string
  facility:string,
  findDate: string
  findPhone: string
  findUser: string
  handingAdvice: string
  id: string | number
  name: string
  reciveUser: string
  /** 状态：0 未审核 1 不处理  2 未派工  3 待处理  4处理中  5 处理完成 */
  status: string
  type: string
  uploadFileids: string
  filePathList: string[]
  x: string | number
  y: string | number
}

export interface IAssign {
  /** 协同处理人id 多个,分割 */
  collaborateHanler: string
  /** 上报时间 */
  createTime: string
  /** 上报人 */
  createUserid: string | number
  delFlag: string
  id: string | number
  /** 是否发送短信 0false 1true */
  isPush: boolean
  majorHandler: string
  message: string
  sourceId: string | number
  status: string
  /** 1事件管理 2汛情管理 */
  type: string
}
export interface IFlood {
  address: string
  createTime: string
  createUserid: string | number
  detail: string
  facility: string
  id: string | number
  police: true
  position: string
  suggest: string
  uploadFileids: string
  x: string | number
  y: string | number

  filePathList: string[]
  createUserDetail: IEasyUserInfo
}

export interface IVehicle {
  carNo: string
  carNoAndUser: string
  chargePerson: string | number
  chargePersonName: string
  createTime: string
  createUser: string | number
  delFlag: string
  department: string | number
  id: string | number
  model: string
  note: string
  phone: string
  planState: string
  status: string
  type: string
  isUsed: boolean
}

export interface IVehicleArchive {
  beginDate: string
  carNo: string
  carId: string
  chargePersonName: string
  departmentName: string
  endDate: string
  eventMangeList: IEvent[]
  id: string | number
  length: string
  type: string
  userId: string
  userName: string
}

export interface IVehicleArchiveQuery {
  carNo: string
  chargePerson: string | number
  department: string | number
  endTime: string
  gpsDeviceId: string | number
  id: string | number
  model: string | number
  note: string | number
  phone: string | number
  type: string | number
}

export interface IEasyUserInfo {
  id: string
  isLatest: boolean
  phone: string
  userName: string
  worknumber: string
}

export const addEvent = (data: Partial<Omit<IEvent, 'id'>>) =>
  axios.request<IResult<IEvent>>({
    url: uris.events.base,
    method: 'post',
    data: serialize(data, { dotsForObjectNotation: true, noFilesWithArrayNotation: true })
  })

export const deleteEvent = (id: string) =>
  axios.request<IRes<boolean>>({ url: `${uris.events.base}/${id}`, method: 'delete' })

export const updateEvent = (data: Partial<IEvent>) =>
  axios.request<IResult<IEvent>>({
    url: uris.events.base,
    method: 'put',
    data: serialize(data, { dotsForObjectNotation: true, noFilesWithArrayNotation: true })
  })

export const getEvent = (id: string) =>
  axios.request<IResult<IEvent>>({ url: `${uris.events.base}/${id}`, method: 'get' })

export const eventsPage = (params: Partial<IEvent & IQueryCommon>) =>
  axios.request<
    IRes<
      (IEvent & {
        findUserVo: IEasyUserInfo
      })[]
    >
  >({
    url: uris.events.page,
    method: 'get',
    params
  })

export const addFlood = (data: Partial<Omit<IFlood, 'id'>>) =>
  axios.request<IResult<IFlood>>({
    url: uris.flood.base,
    method: 'post',
    data: serialize(data, { dotsForObjectNotation: true, noFilesWithArrayNotation: true })
  })

export const deleteFlood = (id: string) =>
  axios.request<IRes<boolean>>({ url: `${uris.flood.base}/${id}`, method: 'delete' })

export const updateFlood = (data: Partial<IFlood>) =>
  axios.request<IResult<IFlood>>({ url: uris.flood.base, method: 'put', data })

export const getFlood = (id: string) =>
  axios.request<IResult<IFlood>>({ url: `${uris.flood.base}/${id}`, method: 'get' })

export const floodPage = (params: Partial<IFlood & IQueryCommon>) =>
  axios.request<IRes<(IFlood & { createUserDetail: IEasyUserInfo })[]>>({
    url: uris.flood.page,
    method: 'get',
    params
  })

export const deleteFloodBatch = (ids: string) =>
  axios.request<IRes<boolean>>({ url: uris.flood.delBatch, method: 'delete', params: { ids } })

export const addVehicle = (data: Partial<Omit<IVehicle, 'id'>>) =>
  axios.request<IRes<boolean>>({ url: uris.vehicle.base, method: 'post', data })

export const deleteVehicle = (id: string) =>
  axios.request<IRes<boolean>>({ url: `${uris.vehicle.base}/${id}`, method: 'delete' })

export const updateVehicle = (data: Partial<IVehicle>) =>
  axios.request<IRes<boolean>>({ url: uris.vehicle.base, method: 'put', data })

export const getVehicle = (id: string) =>
  axios.request<IResult<IVehicle>>({ url: `${uris.vehicle.base}/${id}`, method: 'get' })

export const vehiclePage = (params: Partial<IVehicle & IQueryCommon>) =>
  axios.request<
    IRes<
      (IVehicle & {
        carUser: IEasyUserInfo
      })[]
    >
  >({
    url: uris.vehicle.page,
    method: 'get',
    params
  })

export const deleteVehicleBatch = (ids: string) =>
  axios.request<IRes<boolean>>({ url: uris.vehicle.delBatch, method: 'delete', params: { ids } })

export const vehicleArchivePage = (params: Partial<IVehicleArchiveQuery & IQueryCommon>) =>
  axios.request<IRes<IVehicleArchive[]>>({
    url: uris.vehicle.archive.page,
    method: 'get',
    params
  })

export const addAssign = (data: Partial<Omit<IAssign, 'id'>>) =>
  axios.request<IRes<boolean>>({ url: uris.assign.base, method: 'post', data })

export const deleteAssign = (id: string) =>
  axios.request<IRes<boolean>>({ url: `${uris.assign.base}/${id}`, method: 'delete' })

export const updateAssign = (data: Partial<IAssign>) =>
  axios.request<IRes<boolean>>({ url: uris.assign.base, method: 'put', data })

export const getAssign = (id: string) =>
  axios.request<IResult<IAssign>>({ url: `${uris.assign.base}/${id}`, method: 'get' })

export const assignPage = (params: Partial<IAssign & IQueryCommon>) =>
  axios.request<IRes<(IAssign & { createUserDetail: IEasyUserInfo; collaborateHandlers: IEasyUserInfo[] })[]>>({
    url: uris.assign.page,
    method: 'get',
    params
  })

export const deleteAssignBatch = (ids: string) =>
  axios.request<IRes<boolean>>({ url: uris.assign.delBatch, method: 'delete', params: { ids } })

export const getUsers = (depts?: string) =>
  axios.request<IResult<IDepartment[]>>({
    url: uris.users,
    method: 'get',
    params: { depts }
  })
