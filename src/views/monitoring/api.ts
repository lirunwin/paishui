import axios from '@/utils/request'

const base = '/tofly-psjc-monitor'

const uris = {
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
        /** POST, DELETE ,PUT, GET, */
        base: `${base}/devicetype`,
        /** DELETE */
        del: `${base}/devicetype/deleteByIds`,
        /** GET */
        page: `${base}/devicetype/page`,
        /** 设备类型参数 */
        params: {
          /** POST, DELETE ,PUT, GET, */
          base: `${base}/devicepara`,
          /** DELETE */
          del: `${base}/devicepara/deleteByIds`,
          /** GET */
          page: `${base}/devicepara/page`
        }
      },
      /** 设备档案管理 */
      archives: {
        /** POST, DELETE ,PUT, GET, */
        base: `${base}/device`,
        /** DELETE */
        del: `${base}/device/deleteByIds`,
        /** GET */
        page: `${base}/device/page`
      }
    },
    /** 监测点管理 */
    points: {
      /** POST, DELETE ,PUT, GET, */
      base: `${base}/monitorsite`,
      /** DELETE */
      del: `${base}/monitorsite/deleteByIds`,
      /** GET */
      page: `${base}/monitorsite/page`
    },
    /** 监测站管理 */
    sites: {
      /** POST, DELETE ,PUT, GET, */
      base: `${base}/monitorsite`,
      /** DELETE */
      del: `${base}/monitorsite/deleteByIds`,
      /** GET */
      page: `${base}/monitorsite/page`
    },
    /** 指标标准配置 */
    standards: {
      /** POST, DELETE ,PUT, GET, */
      base: `${base}/deviceindicate`,
      /** DELETE */
      del: `${base}/deviceindicate/deleteByIds`,
      /** GET */
      page: `${base}/deviceindicate/page`,
      /** 指标标准参数 */
      params: {
        /** POST, DELETE ,PUT, GET, */
        base: `${base}/indicatepara`,
        /** DELETE */
        del: `${base}/indicatepara/deleteByIds`,
        /** GET */
        page: `${base}/indicatepara/page`
      }
    },
    /** 图标管理 */
    icons: {
      /** POST, DELETE ,PUT, GET, */
      base: `${base}/placeholder`,
      /** DELETE */
      del: `${base}/placeholder/deleteByIds`,
      /** GET */
      page: `${base}/placeholder/page`
    }
  },
  /** 监测台账 */
  report: {
    /** 监测详情查看 */
    detail: {
      /** POST, DELETE ,PUT, GET, */
      base: `${base}/placeholder`,
      /** DELETE */
      del: `${base}/placeholder/deleteByIds`,
      /** GET */
      page: `${base}/placeholder/page`
    },
    /** 指标监测台账 */
    points: {
      /** POST, DELETE ,PUT, GET, */
      base: `${base}/placeholder`,
      /** DELETE */
      del: `${base}/placeholder/deleteByIds`,
      /** GET */
      page: `${base}/placeholder/page`
    },
    /** 站点监测台账 */
    sites: {
      /** POST, DELETE ,PUT, GET, */
      base: `${base}/placeholder`,
      /** DELETE */
      del: `${base}/placeholder/deleteByIds`,
      /** GET */
      page: `${base}/placeholder/page`
    },
    /** 监测报警台账 */
    warnings: {
      /** POST, DELETE ,PUT, GET, */
      base: `${base}/placeholder`,
      /** DELETE */
      del: `${base}/placeholder/deleteByIds`,
      /** GET */
      page: `${base}/placeholder/page`
    }
  },
  /** 监控中心 */
  monitor: {
    /** 监控台 */
    index: {
      /** POST, DELETE ,PUT, GET, */
      base: `${base}/placeholder`,
      /** DELETE */
      del: `${base}/placeholder/deleteByIds`,
      /** GET */
      page: `${base}/placeholder/page`
    },
    /** 站点实时监控 */
    sites: {
      /** POST, DELETE ,PUT, GET, */
      base: `${base}/placeholder`,
      /** DELETE */
      del: `${base}/placeholder/deleteByIds`,
      /** GET */
      page: `${base}/placeholder/page`
    },
    /** 指标实时监控 */
    points: {
      /** POST, DELETE ,PUT, GET, */
      base: `${base}/placeholder`,
      /** DELETE */
      del: `${base}/placeholder/deleteByIds`,
      /** GET */
      page: `${base}/placeholder/page`
    }
  }
}

type IRes<T = any> = Promise<{
  code: number
  message: string
  result: IQueryCommon & { records: T }
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

export interface IType extends ICreator {
  /** 数据归集时间（分钟） */
  collectTime?: string
  /** 设备类型名称 */
  name?: string
  /** 设备类型代码 */
  typeCode?: string
  id?: string
  sort?: number | string
}

export interface ITypeParam extends ICreator {
  /** 参数代码 */
  code?: string
  /** 参数缩写 */
  codeAbridge?: string
  id?: number
  /** 是否显示 0 false 1true */
  isDisplay?: boolean
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
  lrangeLow?: string
  /** 量程上限 */
  lrangeUp?: string
}

export interface ITypeArchive extends ICreator {
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
}

export interface IStandard extends ICreator {
  id?: string
  /** 指标名称 */
  name?: string
  /** 设备类型id */
  type?: string
}

export interface IStandardParam extends ICreator {
  departmentId?: string
  /** 设备类型参数id tf_ywpn_device_type_para */
  deviceTypeParaId?: string
  /** 有效时间开始 */
  start?: string
  /** 有效时间结束 */
  end?: string
  id?: string
  /** 监测体系id 关联表 tf_ywpn_device_indecate */
  indicateId?: string
  /** 是否推送报警 0 false 1是 */
  isPush?: true
  /** 0 否 1是 */
  isUse?: true
  /** 关联字典表 优质、轻度、中度、严重 */
  level?: number
  /** 上限 */
  upper?: number
  /** 下限 */
  lower?: number
  /** 上限容差 */
  upperTolerance?: number
  /** 下限容差 */
  lowerTolerance?: number
}

/** 导出 */
export const download = (fileName: string) =>
  axios.request<IRes>({ url: uris.common.export, method: 'get', params: { fileName } })

/** 获取二进制流 */
export const getStream = (fileName: string) =>
  axios.request<IRes>({ url: uris.common.getStream, method: 'get', params: { fileName } })

// 设备类型
export const addType = (data: Omit<IType, 'id'>) =>
  axios.request<IRes<boolean>>({ url: uris.settings.device.types.base, method: 'post', data })

export const deleteType = (id: string) =>
  axios.request<IRes<boolean>>({ url: `${uris.settings.device.types.base}/${id}`, method: 'delete' })

export const updateType = (data: IType) =>
  axios.request<IRes<boolean>>({ url: uris.settings.device.types.base, method: 'put', data })

export const getType = (id: string) =>
  axios.request<IRes<IType>>({ url: `${uris.settings.device.types.base}/${id}`, method: 'get' })

export const typesPage = (params: IType & IQueryCommon) =>
  axios.request<IRes<IType[]>>({
    url: uris.settings.device.types.page,
    method: 'get',
    params
  })

export const deleteTypeBatch = (ids: string) =>
  axios.request<IRes<boolean>>({ url: uris.settings.device.types.del, method: 'delete', params: { ids } })

// 设备类型参数
export const addTypeParam = (data: Omit<ITypeParam, 'id'>) =>
  axios.request<IRes<boolean>>({ url: uris.settings.device.types.params.base, method: 'post', data })

export const deleteTypeParam = (id: string) =>
  axios.request<IRes<boolean>>({ url: `${uris.settings.device.types.params.base}/${id}`, method: 'delete' })

export const updateTypeParam = (data: ITypeParam) =>
  axios.request<IRes<boolean>>({ url: uris.settings.device.types.params.base, method: 'put', data })

export const getTypeParam = (id: string) =>
  axios.request<IRes<ITypeParam>>({ url: `${uris.settings.device.types.params.base}/${id}`, method: 'get' })

export const typeParamsPage = (params: ITypeParam & IQueryCommon & { LRange?: string }) =>
  axios.request<IRes<ITypeParam[]>>({ url: uris.settings.device.types.params.page, method: 'get', params })

export const deleteTypeParamBatch = (ids: string) =>
  axios.request<IRes<boolean>>({ url: uris.settings.device.types.params.del, method: 'delete', params: { ids } })

// 设备档案
export const addTypeArchive = (data: Omit<ITypeArchive, 'id'>) =>
  axios.request<IRes<boolean>>({ url: uris.settings.device.archives.base, method: 'post', data })

export const deleteTypeArchive = (id: string) =>
  axios.request<IRes<boolean>>({ url: `${uris.settings.device.archives.base}/${id}`, method: 'delete' })

export const updateTypeArchive = (data: ITypeArchive) =>
  axios.request<IRes<boolean>>({ url: uris.settings.device.archives.base, method: 'put', data })

export const getTypeArchive = (id: string) =>
  axios.request<IRes<ITypeArchive>>({ url: `${uris.settings.device.archives.base}/${id}`, method: 'get' })

export const typeArchivesPage = (params: ITypeArchive & IQueryCommon) =>
  axios.request<IRes<ITypeArchive[]>>({ url: uris.settings.device.archives.page, method: 'get', params })

export const deleteTypeArchiveBatch = (ids: string) =>
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
  axios.request<IRes<boolean>>({ url: uris.settings.standards.base, method: 'post', data })

export const deleteStandardParam = (id: string) =>
  axios.request<IRes<boolean>>({ url: `${uris.settings.standards.base}/${id}`, method: 'delete' })

export const updateStandardParam = (data: IStandardParam) =>
  axios.request<IRes<boolean>>({ url: uris.settings.standards.base, method: 'put', data })

export const getStandardParam = (id: string) =>
  axios.request<IRes<IStandardParam>>({ url: `${uris.settings.standards.base}/${id}`, method: 'get' })

export const standardParamsPage = (params: IStandardParam & IQueryCommon) =>
  axios.request<IRes<IStandardParam[]>>({ url: uris.settings.standards.page, method: 'get', params })

export const deleteParamBatch = (ids: string) =>
  axios.request<IRes<boolean>>({ url: uris.settings.standards.del, method: 'delete', params: { ids } })
