import { serialize } from 'object-to-formdata'
import axios from '@/utils/request'
import store from '@/store'
import { defaultValuesForMonitorStandardLevel, monitorStandardLevelKey } from '@/utils/constant'

const base = '/monitor'

const uris = {
  addDictionary: '/base/code',
  dictionary: '/base/code/getByKeys',
  common: {
    /** 导出数据  get*/
    export: `${base}/commonFile/download`,
    /** 返回二进制流  get*/
    getStream: `${base}/commonFile/getStream`
  },
  /** 监测配置 */
  settings: {
    /** 设备设置 */
    device: {
      /** 设备类型配置 */
      types: {
        /** method: POST, DELETE ,PUT, GET, */
        base: `${base}/devicetype`,
        /** method: DELETE */
        del: `${base}/devicetype/deleteByIds`,
        /** method: GET */
        page: `${base}/devicetype/page`,
        /** 设备类型参数 */
        params: {
          /** method: POST, DELETE ,PUT, GET, */
          base: `${base}/devicepara`,
          /** method: DELETE */
          del: `${base}/devicepara/deleteByIds`,
          /** method: GET */
          page: `${base}/devicepara/page`
        }
      },
      /** 设备档案管理 */
      archives: {
        /** method: POST, DELETE ,PUT, GET, */
        base: `${base}/device`,
        /** method: DELETE */
        del: `${base}/device/deleteByIds`,
        /** method: GET */
        page: `${base}/device/page`,
        /** method: GET */
        all: `${base}/device/list`
      }
    },
    /** 监测点管理 */
    points: {
      /** method: POST, DELETE ,PUT, GET, */
      base: `${base}/monitorsite`,
      /** method: DELETE */
      del: `${base}/monitorsite/deleteByIds`,
      /** method: GET */
      page: `${base}/monitorsite/page`,
      /** method: POST */
      bindDevice: `${base}/monitorsite/saveAndBind`,
      /** method: POST */
      operate: `${base}/monitorsite/operate`,
      /** method: GET */
      groups: `${base}/monitorsite/group`,
      /** method: GET */
      sections: `${base}/monitorsite/psArea`,
      /** method: POST */
      bindStandard: `${base}/monitorsiteindicate/saveOrUpdateBatch`,
      /** method: GET */
      isConfigured: `${base}/monitorsiteindicate/validateOtherIndicate`,
      /** method: POST */
      submitSettings: `${base}/monitorsitepara/saveOrUpdateBatch`,
      /** method: POST  获取配置信息 */
      configurations: `${base}/monitorsiteindicate/getByMonitorId`,
      deleteParam: `${base}/monitorsitepara`
    },
    /** 监测站管理 */
    sites: {
      /** method: POST, DELETE ,PUT, GET, */
      base: `${base}/monitorsite`,
      /** method: DELETE */
      del: `${base}/monitorsite/deleteByIds`,
      /** method: GET */
      page: `${base}/monitorsite/page`
    },
    /** 指标标准配置 */
    standards: {
      /** method: POST, DELETE ,PUT, GET, */
      base: `${base}/deviceindicate`,

      /** method: DELETE */
      del: `${base}/deviceindicate/deleteByIds`,
      /** method: GET */
      page: `${base}/deviceindicate/page`,
      /** 指标标准参数 */
      params: {
        /** method: POST, DELETE ,PUT, GET, */
        base: `${base}/indicatepara`,
        /** method: DELETE */
        del: `${base}/indicatepara/deleteByIds`,
        /** method: GET */
        page: `${base}/indicatepara/page`
      }
    },
    /** 图标管理 */
    icons: {
      /** method: POST, DELETE ,PUT, GET, */
      base: `${base}/placeholder`,
      /** method: DELETE */
      del: `${base}/placeholder/deleteByIds`,
      /** method: GET */
      page: `${base}/placeholder/page`
    }
  },
  /** 监测台账 */
  report: {
    /** 监测详情查看 */
    detail: {
      /** method: POST, DELETE ,PUT, GET, */
      base: `${base}/placeholder`,
      /** method: DELETE */
      del: `${base}/placeholder/deleteByIds`,
      /** method: GET */
      page: `${base}/placeholder/page`
    },
    /** 指标监测台账 */
    points: {
      base: `${base}/stationLedger/history`
    },

    /** 监测报警台账 */
    warnings: {
      /** method: POST, DELETE ,PUT, GET, */
      base: `${base}/stationLedger/warnHistory`
    },

    /** 站点监测台账 */
    sites: {
      /** method: POST, DELETE ,PUT, GET, */
      base: `${base}/placeholder`,
      /** method: DELETE */
      del: `${base}/placeholder/deleteByIds`,
      /** method: GET */
      page: `${base}/placeholder/page`
    }
  },
  /** 监控中心 */
  monitor: {
    /** 监控台 */
    index: {
      page: `${base}/mstation/list`,
      summary: `${base}/mstation/getSiteSumByStatus`,
      getById: `${base}/mstation/siteCurrent`,
      getByIdBatch: `${base}/mstation/siteCurrentBySiteIds`
    },
    /** 站点实时监控 */
    sites: {
      /** method: POST, DELETE ,PUT, GET, */
      base: `${base}/placeholder`,
      /** method: DELETE */
      del: `${base}/placeholder/deleteByIds`,
      /** method: GET */
      page: `${base}/placeholder/page`
    },
    /** 指标实时监控 */
    points: {
      watch: `${base}/mstation/getIndicateCurrent`
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

interface ICreator {
  /** 创建时间 */
  createTime?: string
  /** 创建人 */
  createUser?: string
}

interface IQueryCommon extends IPagination {
  hitCount?: boolean
  optimizeCountSql?: boolean
  orders?: { asc?: boolean; column?: string }[]
  pages?: number
  searchCount?: boolean
}

export interface IDeviceType extends ICreator {
  /** 数据归集时间（分钟） */
  collectTime?: string
  /** 设备类型名称 */
  name?: string
  /** 设备类型代码 */
  typeCode?: string
  id?: string
  sort?: number | string
}

export interface IDeviceTypeParam extends ICreator {
  /** 参数代码 */
  code?: string
  /** 参数缩写 */
  codeAbridge?: string
  id?: number | string
  /** 是否显示 0 false 1true */
  isDisplay?: boolean | number
  lrange?: string
  /** 参数名称 */
  name?: string
  /**备注 */
  note?: string
  /** 设备id */
  typeId?: number | string
  /** 设备名 */
  typeName?: string
  /** 单位 */
  unit?: string
  sort?: number | string
  /** 数据采集频率，单位分钟 */
  rate?: number
  /**量程下限 */
  lrangeLow?: string | number
  /** 量程上限 */
  lrangeUp?: string | number
}

export interface IDevice extends ICreator {
  /** 厂商名称 */
  companyName?: string
  /** 厂商电话 */
  companyPhone?: string
  /** 厂商联系人 */
  companyUser?: string
  /** 文件id */
  fileids?: string
  id?: number
  /** 型号 */
  model?: string
  /** 名称 */
  name?: string
  /** 设备编号 新增时后台自动生成 */
  no?: string
  /** 采购时间 */
  purchaseTime?: string
  /** sn编码 */
  sn?: string
  /** 设备类型 关联tf_ywpn_device_type */
  type?: number | string
  /** 设备类型名称 */
  typeName?: string
  delFlag?: string
  note?: string
  /** 设备状态 */
  status?: string
  fileList?: string[]
  filePathList?: string[]
}

export interface IStandard extends ICreator {
  id?: string
  /** 指标名称 */
  name?: string
  /** 设备类型id */
  type?: string | number
}

export interface IStandardParam extends ICreator {
  /** 设备类型参数id tf_ywpn_device_type_para */
  deviceTypeParaId?: number | string
  /** 有效时间开始 */
  start?: string
  /** 有效时间结束 */
  end?: string
  id?: string
  /** 监测体系id 关联表 tf_ywpn_device_indecate */
  indicateId?: string
  /** 是否推送报警 0 false 1是 */
  isPush?: boolean | number
  /** 0 否 1是 */
  isUse?: boolean | number
  /** 关联字典表 优质、轻度、中度、严重 */
  level?: number | string
  /** 上限 */
  upper?: number
  /** 下限 */
  lower?: number
  /** 上限容差 */
  upperTolerance?: number
  /** 下限容差 */
  lowerTolerance?: number
  delFlag?: string
  /** 是否特定阈值 */
  isSpecial?: boolean | number
  /** 特定阀值 */
  specialVal?: number | string
  deviceTypeParaVo?: {
    code?: string | number
    codeAbridge?: string
    id?: number | string
    isDisplay?: boolean | number
    lrangeLow?: string | number
    lrangeUp?: string | number
    name?: string
    note?: string
    rate?: number
    sort?: number
    typeId?: number | string
    typeName?: string
    unit?: string
  } & ICreator
}

export interface IPoint extends ICreator {
  /** 地址 */
  address?: string
  /** 编码 */
  code?: string
  /** 坐标 */
  coordiate?: string
  /** coordiateX */
  coordiateX?: string | number
  /** coordiateY */
  coordiateY?: string | number
  delFlag?: string
  /** 分组 */
  siteGroup?: string
  /** 分区 */
  psArea?: string
  id?: string | number
  /** 名称 */
  name?: string
  /** 编号 */
  no?: string
  /** 1 启用 2停用 */
  status?: string
  note?: string
  /** 是否绑定监测体系 */
  isConfigured?: boolean | number
}

export interface IPointConnectDevice extends IPoint {
  /** 绑定的设施信息 */
  siteFacility?: {
    /** 0正常 1删除 */
    delFlag?: string
    facility?: string
    /** 设施编码 */
    facilityCode?: string
    /** 设施位置json */
    facilityGeometry?: string
    /** 关联设施名称 */
    facilityName?: string
    /** 设施备注 */
    facilityNote?: string
    /** 关联设施道路名称 */
    facilityRoadName?: string
    /** 关联设施类型 */
    facilityType?: string
    id?: string | number
    /** 是否最新 */
    isNew?: boolean
    /** 监测点id */
    siteId?: string | number
    /** 更新时间 */
    updateTime?: string
    /** 更新人 */
    updateUser?: string | number
  } & ICreator
  /** 绑定的设备安装信息 */
  bindDevice?: {
    /** 0正常 1删除 */
    delFlag?: string
    /** 设备id */
    deviceId?: string | number
    id?: string | number
    /** 安装图片id */
    installFileIds?: string
    /** 安装人员联系方式 */
    installPhone?: string
    /** 安装图片id */
    installSmallfileIds?: string
    /** 安装时间 */
    installTime?: string
    /** 安装人员名称 */
    installUser?: string
    /** 是否最新 */
    isNew?: boolean
    /** 监测点id */
    monitorSiteId?: string | number
    typeId?: string | number
    /** 设备信息 */
    deviceVo?: {
      id?: string | number
      sn?: string
      type?: string | number
      typeName?: string
      name?: string
    }
    filePathList?: string[]
  } & ICreator
}

export interface IPointParam {
  /** 参数代码 */
  code?: string | number
  delFlag?: string | boolean
  /** 设备id */
  deviceId?: string | number
  id?: string | number
  /** 监测体系id */
  indicateId?: string | number
  /** 监测体系指标id */
  indicateParaId?: string | number
  /** 是否展示 false true */
  isDisplay?: boolean | number
  /** 量程下限 */
  lrangeLow?: number | string
  /** 量程上限 */
  lrangeUp?: number | string
  /** 参数名称 */
  name?: string
  /** 备注 */
  note?: string
  /** 站点参数代码 */
  siteCode?: string
  /** 序号 */
  sort?: number
  indicateParaVo?: IStandardParam
  unit?: string
}

export interface IPointThreshold extends ICreator {
  delFlag?: string
  /** 有效时间结束 */
  end?: string
  id?: string | number
  /** 是否推送 0 false 1是 */
  isPush?: boolean | number
  /** 是否特殊值 默认false */
  isSpecial?: boolean | number
  /** 关联字典表 优质、轻度、中度、严重 */
  level?: string | number
  levelName?: string
  /** 下限 */
  lower?: number | ''
  /** 下限容差 */
  lowerTolerance?: number | ''
  /** 监测指标参数id 关联 设备基础配置信息id */
  paraId?: string | number
  paraName?: string
  /** 特殊阈值 */
  specialVal?: string | number
  /** 有效时间开始 */
  start?: string
  /** 上限 */
  upper?: number | ''
  /** 上限容差 */
  upperTolerance?: number | ''
}

export interface IDictionary {
  codeKey?: string
  codeRemark?: string
  codeValue?: string
  createTime?: string
  createUser?: string | number
  id?: string | number
  notes?: string
  sort?: string | number
  ulevel?: string | number
}

export interface IPointEnableParams {
  /** 监测点id，多个以,号分割 */
  monitorSiteIds: string
  /** 操作人 */
  operateUserName: string
  /** 操作时间 */
  operateTime: string
  /** 状态 */
  type: 'start' | 'stop'
  /** note */
  note?: string
}

export interface IPointDismountParams {
  /** 监测点id，只能一个*/
  monitorSiteIds: string
  /** 操作人 */
  operateUserName: string
  /** 操作人人电话号码 */
  operateUserPhone: string
  /** 操作时间 */
  operateTime: string
  /** 状态 */
  type: 'del'
  note?: string
}

/** 获取字典值 */
export const getDictKeys = async (keys: string = monitorStandardLevelKey.codeKey) => {
  const { result } = await axios.request<{ result: { [x: string]: IDictionary[] } }>({
    url: uris.dictionary,
    method: 'get',
    params: { keys }
  })
  if (!keys.includes(',')) {
    const { [keys]: values = [] } = result
    if (values.length === 0 && keys === monitorStandardLevelKey.codeKey) {
      const { username: creater = '' }: { username: string } = store.state.user || {}
      const { codeKey, codeRemark } = monitorStandardLevelKey
      await Promise.all([
        addDictionary({ ...monitorStandardLevelKey, ulevel: 1, creater }),
        ...defaultValuesForMonitorStandardLevel.map((item) =>
          addDictionary({ ulevel: 2, ...monitorStandardLevelKey, creater, ...item })
        ),
        addDictionary({ codeKey: `${codeKey}_colors`, codeRemark: `${codeRemark}颜色值`, ulevel: 1, creater }),
        ...defaultValuesForMonitorStandardLevel.map((item) =>
          addDictionary({
            ulevel: 2,
            codeKey: `${codeKey}_colors`,
            codeRemark: `${codeRemark}颜色值-${item.notes}`,
            creater,
            ...item,
            notes: item.color
          })
        )
      ])
      const temp = (await getDictKeys()) as IDictionary[]
      return temp
    }
    return values || []
  }
  return result || {}
}

/** 保存字典值 */
export const addDictionary = (data: IDictionary & { creater?: string }) =>
  axios.request({ url: uris.addDictionary, method: 'post', data })

/** 导出 */
export const download = (fileName: string) =>
  axios.request<IRes>({ url: uris.common.export, method: 'get', params: { fileName } })

/** 获取二进制流 */
export const getStream = (fileName: string) =>
  axios.request<IRes>({ url: uris.common.getStream, method: 'get', params: { fileName } })

// 设备类型
export const addDeviceType = (data: Omit<IDeviceType, 'id'>) =>
  axios.request<IRes<boolean>>({ url: uris.settings.device.types.base, method: 'post', data })

export const deleteDeviceType = (id: string) =>
  axios.request<IRes<boolean>>({ url: `${uris.settings.device.types.base}/${id}`, method: 'delete' })

export const updateDeviceType = (data: IDeviceType) =>
  axios.request<IRes<boolean>>({ url: uris.settings.device.types.base, method: 'put', data })

export const getDeviceType = (id: string) =>
  axios.request<IRes<IDeviceType>>({ url: `${uris.settings.device.types.base}/${id}`, method: 'get' })

export const deviceTypesPage = (params: IDeviceType & IQueryCommon) =>
  axios.request<IRes<IDeviceType[]>>({
    url: uris.settings.device.types.page,
    method: 'get',
    params
  })

export const deleteDeviceTypeBatch = (ids: string) =>
  axios.request<IRes<boolean>>({ url: uris.settings.device.types.del, method: 'delete', params: { ids } })

// 设备类型参数
export const addDeviceTypeParam = (data: Omit<IDeviceTypeParam, 'id'>) =>
  axios.request<IRes<boolean>>({ url: uris.settings.device.types.params.base, method: 'post', data })

export const deleteDeivceTypeParam = (id: string) =>
  axios.request<IRes<boolean>>({ url: `${uris.settings.device.types.params.base}/${id}`, method: 'delete' })

export const updateDeviceTypeParam = (data: IDeviceTypeParam) =>
  axios.request<IRes<boolean>>({ url: uris.settings.device.types.params.base, method: 'put', data })

export const getDeviceTypeParam = (id: string) =>
  axios.request<IRes<IDeviceTypeParam>>({ url: `${uris.settings.device.types.params.base}/${id}`, method: 'get' })

export const deviceTypeParamsPage = (params: IDeviceTypeParam & IQueryCommon & { LRange?: string }) =>
  axios.request<IRes<IDeviceTypeParam[]>>({ url: uris.settings.device.types.params.page, method: 'get', params })

export const deleteDeviceTypeParamBatch = (ids: string) =>
  axios.request<IRes<boolean>>({ url: uris.settings.device.types.params.del, method: 'delete', params: { ids } })

// 设备档案
export const addDevice = (data: Omit<IDevice, 'id'>) =>
  axios.request<IRes<boolean>>({
    url: uris.settings.device.archives.base,
    method: 'post',
    data: serialize(data, { dotsForObjectNotation: true, noFilesWithArrayNotation: true })
  })

export const deleteDevice = (id: string) =>
  axios.request<IRes<boolean>>({ url: `${uris.settings.device.archives.base}/${id}`, method: 'delete' })

export const updateDevice = (data: IDevice) =>
  axios.request<IRes<boolean>>({
    url: uris.settings.device.archives.base,
    method: 'put',
    data: serialize(data, { dotsForObjectNotation: true, noFilesWithArrayNotation: true })
  })

export const getDevice = (id: string) =>
  axios.request<IRes<IDevice>>({ url: `${uris.settings.device.archives.base}/${id}`, method: 'get' })

export const devicesPage = (params: IDevice & IQueryCommon) =>
  axios.request<IRes<IDevice[]>>({ url: uris.settings.device.archives.page, method: 'get', params })

export const devicesAvailable = (params: IDevice & IQueryCommon) =>
  axios.request<IResult<IDevice[]>>({ url: uris.settings.device.archives.all, method: 'get', params })

export const deleteDeviceBatch = (ids: string) =>
  axios.request<IRes<boolean>>({ url: uris.settings.device.archives.del, method: 'delete', params: { ids } })

// 指标标准配置
export const addStandard = (data: Omit<IStandard, 'id'>) =>
  axios.request<IRes<boolean>>({ url: uris.settings.standards.base, method: 'post', data })

export const deleteStandard = (id: string) =>
  axios.request<IRes<boolean>>({ url: `${uris.settings.standards.base}/${id}`, method: 'delete' })

export const updateStandard = (data: IStandard) =>
  axios.request<IRes<boolean>>({ url: uris.settings.standards.base, method: 'put', data })

export const getStandard = (id: string) =>
  axios.request<IRes<IStandard>>({ url: `${uris.settings.standards.base}/${id}`, method: 'get' })

export const standardsPage = (params: IStandard & IQueryCommon) =>
  axios.request<IRes<IStandard[]>>({ url: uris.settings.standards.page, method: 'get', params })

export const deleteStandardBatch = (ids: string) =>
  axios.request<IRes<boolean>>({ url: uris.settings.standards.del, method: 'delete', params: { ids } })

// 指标标准参数配置
export const addStandardParam = (data: Omit<IStandardParam, 'id'>) =>
  axios.request<IRes<boolean>>({ url: uris.settings.standards.params.base, method: 'post', data })

export const deleteStandardParam = (id: string) =>
  axios.request<IRes<boolean>>({ url: `${uris.settings.standards.params.base}/${id}`, method: 'delete' })

export const updateStandardParam = (data: IStandardParam) =>
  axios.request<IRes<boolean>>({ url: uris.settings.standards.params.base, method: 'put', data })

export const getStandardParam = (id: string) =>
  axios.request<IRes<IStandardParam>>({ url: `${uris.settings.standards.params.base}/${id}`, method: 'get' })

export const standardParamsPage = (params: IStandardParam & IQueryCommon) =>
  axios.request<IRes<IStandardParam[]>>({ url: uris.settings.standards.params.page, method: 'get', params })

export const deleteStandardParamBatch = (ids: string) =>
  axios.request<IRes<boolean>>({ url: uris.settings.standards.params.del, method: 'delete', params: { ids } })

// 检测点管理
export const addPoint = (data: Omit<IPoint, 'id'>) =>
  axios.request<IRes<boolean>>({ url: uris.settings.points.base, method: 'post', data })

export const deletePoint = (id: string) =>
  axios.request<IRes<boolean>>({ url: `${uris.settings.points.base}/${id}`, method: 'delete' })

export const updatePoint = (data: IPoint) =>
  axios.request<IRes<boolean>>({ url: uris.settings.points.base, method: 'put', data })

export const getPoint = (id: string) =>
  axios.request<IRes<IPoint>>({ url: `${uris.settings.points.base}/${id}`, method: 'get' })

export const pointsPage = (params: IPointConnectDevice & IQueryCommon) =>
  axios.request<IRes<IPointConnectDevice[]>>({ url: uris.settings.points.page, method: 'get', params })

export const deletePointBatch = (ids: string) =>
  axios.request<IRes<boolean>>({ url: uris.settings.points.del, method: 'delete', params: { ids } })

export const pointBindDevice = (data: IPointConnectDevice) =>
  axios.request<IRes<boolean>>({
    url: uris.settings.points.bindDevice,
    method: 'post',
    data: serialize(data, { dotsForObjectNotation: true, noFilesWithArrayNotation: true })
  })

export const groups = (name?: string) =>
  axios.request<IResult<string[]>>({ url: uris.settings.points.groups, method: 'get', params: { name } })

export const sections = (name?: string) =>
  axios.request<IResult<string[]>>({ url: uris.settings.points.sections, method: 'get', params: { name } })

export const pointEnable = (data: IPointEnableParams) =>
  axios.request<IRes<boolean>>({ url: uris.settings.points.operate, method: 'post', data })

export const pointDismount = (data: IPointDismountParams) =>
  axios.request<IRes<boolean>>({ url: uris.settings.points.operate, method: 'post', data })

export const bindStandardAndSettings = (data: IPointParam[]) =>
  axios.request<IResult<IPointParam[]>>({
    url: uris.settings.points.bindStandard,
    method: 'post',
    data: { siteDeviceIndicates: data }
  })

export const isConfigured = (params: { indicateId: string; deviceId: string }) =>
  axios.request<IResult<string[]>>({ url: uris.settings.points.isConfigured, method: 'get', params })

export const submitPointSettings = (data: IPointThreshold[]) =>
  axios.request<IRes<IPointThreshold>>({
    url: uris.settings.points.submitSettings,
    method: 'post',
    data: { deviceParas: data }
  })

export const getPointConfigurations = (monitorId: string | number) =>
  axios.request<
    IResult<{
      siteDeviceIndicates: IPointParam[]
      siteDeviceParas: IPointThreshold[]
    }>
  >({ url: uris.settings.points.configurations, method: 'get', params: { monitorId } })

export const deleteConfiguredPointParam = (id: string | number) =>
  axios.request<IRes<boolean>>({ url: `${uris.settings.points.deleteParam}/${id}`, method: 'delete' })

export interface IMonitorItem {
  address: string
  code: string
  coordiate: string
  coordiateX: string
  coordiateY: string
  createTime: string
  createUser: number | string
  deviceStatus: string
  id: number | string
  name: string
  no: string
  note: string
  psArea: string
  siteGroup: string
  status: string
  isAlarm: boolean
}
export interface IMonitorItemDetail {
  monitorSiteVo: IPointConnectDevice
  paraVoList: {
    collectTime: string
    direction: number
    name: string
    siteDeviceParaVo: IPointThreshold
    value: string
    unit: string
  }[]
  siteId: number
  status: string
  isAlarm: boolean
}

export interface IMonitorItemSummary {
  label: string
  total: number
  code: string
}

export interface IPointMonitoringItem {
  siteId: string | number
  siteName: string
  address: string
  siteGroup: string
  scadaTime: string
  paraName: string
  itstrVal: string
  unit: string
  levelName: string
  shreshold: string
}

export interface IPointMonitoringQuery {
  indicateNames: string
  levelName: string
  queryLike: string
  siteGroup: string
}

export const monitorItemsPage = (
  params: Partial<IMonitorItem & IQueryCommon & { monitorStatus: string; queryStr: string }>
) => axios.request<IRes<IMonitorItem[]>>({ url: uris.monitor.index.page, method: 'get', params })

export const monitorItemsSummary = async (
  params: Partial<IMonitorItem & IQueryCommon & { monitorStatus: string; queryStr: string }>
): Promise<IMonitorItemSummary[]> => {
  const {
    result: { data, title }
  } = await axios.request<
    IResult<{
      data: { [x: string]: number }
      title: { code: string; value: string; text: string }[]
    }>
  >({ url: uris.monitor.index.summary, method: 'get', params })
  return title.map(({ code, value: label, text }) => {
    return { label, code, total: data[text] || 0 }
  })
}

export const getMonitorItemCurrentInfoById = (siteId: string | number) =>
  axios.request<IResult<IMonitorItemDetail>>({ url: uris.monitor.index.getById, method: 'get', params: { siteId } })

export const getMonitorItemCurrentInfoByIdBatch = (siteIds: string[]) =>
  axios.request<IResult<IMonitorItemDetail[]>>({
    url: uris.monitor.index.getByIdBatch,
    method: 'get',
    params: { siteIds: siteIds.join() }
  })

export const pointsMonitoring = (params: Partial<IPointMonitoringQuery & IQueryCommon>) =>
  axios.request<IRes<IPointMonitoringItem[]>>({ url: uris.monitor.points.watch, method: 'get', params })

export interface IPointReport {
  address: string
  collectId: number | string
  isValid: boolean
  itstrVal: string
  level: number | string
  levelName: string
  minute: number | string
  paraName: string
  scadaTime: string
  shreshold: string
  siteGroup: string
  siteId: number | string
  siteName: string
  unit: string
}
export interface IWarningReport {
  address: string
  id: number | string
  itCd: string
  itVal: string
  levelName: string
  paraName: string
  scadaTime: string
  siteGroup: string
  siteName: string
  sn: string
  unit: string
  vptVal: string
  warnType: string
}

export const pointReports = (params: Partial<IPointReport & IQueryCommon>) =>
  axios.request<IRes<IPointReport[]>>({ url: uris.report.points.base, method: 'get', params })

export const warningReports = (params: Partial<IWarningReport & IQueryCommon>) =>
  axios.request<IRes<IWarningReport[]>>({ url: uris.report.warnings.base, method: 'get', params })
