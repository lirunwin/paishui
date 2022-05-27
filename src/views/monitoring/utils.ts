import { ElTableColumn } from 'element-ui/types/table-column'
import { ITypeParam } from './api'

interface ColItem extends Partial<ElTableColumn> {
  _slot?: boolean
  _interval?: boolean
}

/**设备类型配置 - 类型 */
export const settingDeviceTypeCols: ColItem[] = [
  { type: 'selection', width: '50px' },
  { type: 'index', label: '序号', width: '60px' },
  { prop: 'name', label: '设备类型名称', minWidth: '150px', align: 'left', headerAlign: 'left' },
  { prop: 'typeCode', label: '设备类型代码', minWidth: '110px', align: 'left', headerAlign: 'left' },
  { prop: 'collectTime', label: '数据归集时间（分钟）', width: '160px' }
]

/**设备类型配置 - 参数 */
export const settingDeviceTypeParamCols: ColItem[] = [
  { type: 'selection', width: '50px' },
  { type: 'index', label: '序号' },
  { prop: 'name', label: '参数名称', align: 'left' },
  { prop: 'code', label: '参数代码', align: 'left' },
  { prop: 'codeAbridge', label: '参数缩写', align: 'left' },
  { prop: 'unit', label: '参数单位' },
  { prop: 'lrange', label: '量程' },
  { prop: 'isDisplay', label: '是否显示', formatter: ({ isDisplay }: ITypeParam) => (isDisplay ? '是' : '否') },
  { prop: 'note', label: '备注' }
]

/**设备档案管理 */
export const settingArchiveCols: ColItem[] = [
  { type: 'selection', width: '50px' },
  { type: 'index', label: '序号' },
  { prop: 'name', label: '设备编码' },
  { prop: 'name1', label: 'SN序列号' },
  { prop: 'name2', label: '设备类型名称' },
  { prop: 'name3', label: '设备型号' },
  { prop: 'name4', label: '设备名称' },
  { prop: 'name5', label: '设备厂商' },
  { prop: 'name6', label: '厂商联系人' },
  { prop: 'name7', label: '联系人电话' },
  { prop: 'name8', label: '采购时间' },
  { prop: 'name9', label: '设备状态' },
  { prop: 'name0', label: '备注' }
]

/**指标标准被指 */
export const settingStandardCols: ColItem[] = [
  { type: 'selection', width: '50px' },
  { type: 'index', label: '序号' },
  { prop: 'name', label: '监测体系名称' },
  { prop: 'name1', label: '设备类型' }
]
/**指标标准被指 -参数*/
export const settingStandardParamCols: ColItem[] = [
  { type: 'selection', width: '50px' },
  { type: 'index', label: '序号' },
  { prop: 'name1', label: '参数名称' },
  { prop: 'name2', label: '单位' },
  { prop: 'name3', label: '监测值判定' },
  { prop: 'name4', label: '阈值下限' },
  { prop: 'name5', label: '下限容差' },
  { prop: 'name6', label: '阈值上限' },
  { prop: 'name7', label: '上限容差' },
  { prop: 'name8', label: '有效时段' },
  { prop: 'name9', label: '是否推送消息' }
]

/**监测点管理 */
export const settingPointCols: ColItem[] = [
  { type: 'selection', width: '50px' },
  { type: 'index', label: '序号' },
  { prop: 'name', label: '监测点编号' },
  { prop: 'name1', label: '监测点编码' },
  { prop: 'name2', label: '监测点名称' },
  { prop: 'name3', label: '设备类型' },
  { prop: 'name4', label: '设备名称' },
  { prop: 'name5', label: '设备出厂唯一编码' },
  { prop: 'name6', label: '负责人' },
  { prop: 'name7', label: '联系方式' },
  { prop: 'name8', label: '安装地址' },
  { prop: 'name9', label: '安装时间' },
  { prop: 'name0', label: '监测站点' },
  { prop: 'name11', label: '排水分区' },
  { prop: 'name12', label: '监测分组' },
  { prop: 'name13', label: '监测点状态' },
  { prop: 'name14', label: '数据首次采集时间' },
  { prop: 'name15', label: '数据最近采集时间' }
]

/**监测站点管理 */
export const settingSiteCols: ColItem[] = [
  { type: 'selection', width: '50px' },
  { type: 'index', label: '序号' },
  { prop: 'name', label: '监测断面编号' },
  { prop: 'name', label: '监测断面编码' },
  { prop: 'name', label: '监测断面名称' },
  { prop: 'name', label: '绑定监测点名称' },
  { prop: 'name', label: '监测点状态' },
  { prop: 'name', label: '安装日期' },
  { prop: 'name', label: '首次数据采集时间' },
  { prop: 'name', label: '最近数据采集时间' }
]

/**图标管理 */
export const settingIconCols: ColItem[] = [
  { type: 'selection', width: '50px' },
  { type: 'index', label: '序号' },
  { prop: 'name', label: '图标代码' },
  { prop: 'name1', label: '图标名称' },
  { prop: 'name2', label: '图标预览' },
  { prop: 'name3', label: '文件类型' },
  { prop: 'name4', label: '图标格式' },
  { prop: 'name5', label: '图标尺寸' },
  { prop: 'name6', label: '图标分组' },
  { prop: 'name7', label: '备注' },
  { prop: 'action', label: '操作' }
]

/**监测点管理 - 监控台 */
export const settingMonitorCols: ColItem[] = [
  { type: 'index', label: '序号', width: '50px' },
  { prop: 'name', label: '监测分组', width: '80px' },
  { prop: 'code', label: '监测站点', width: '80px' },
  { prop: 'unit', label: '地址' },
  { prop: 'action', label: '操作', width: '80px', _slot: true }
]

/**监测点管理 - 监测参数基本设置 */
export const settingPointBasisCols: ColItem[] = [
  { prop: 'name', label: '参数名称' },
  { prop: 'code', label: '参数代码' },
  { prop: 'unit', label: '参数单位' },
  { prop: 'distance', label: '量程' },
  { prop: 'index', label: '序号', _slot: true },
  { prop: 'paramCode', label: '站点参数代码', _slot: true },
  { prop: 'display', label: '是否显示', _slot: true },
  { prop: 'note', label: '备注', _slot: true }
]

/**监测点管理 - 监测参数阈值设置 */
export const settingPointParamCols: ColItem[] = [
  { prop: 'name', label: '参数名称', _slot: true, width: '150px' },
  { prop: 'value', label: '监测值判定', _slot: true, width: '120px' },
  { prop: 'interval', label: '监测阈值', _slot: true, _interval: true, width: '200px' },
  { prop: 'interval1', label: '阈值容差', _slot: true, _interval: true, width: '200px' },
  { prop: 'time', label: '有效时段', _slot: true, width: '160px' },
  { prop: 'msgPush', label: '消息推送', _slot: true, width: '80px' },
  { prop: 'action', label: '操作', _slot: true }
]

export const monitorStates = [
  { name: 'normal', label: '正常', color: '#333333' },
  { name: 'offline', label: '离线', color: 'rgba(51,51,51,0.6)' },
  { name: 'warning', label: '报警', color: '#F65252' }
]

export const monitorResultStates = [
  { name: 'normal', label: '正常', color: '#333333' },
  { name: 'good', label: '优质', color: '#06B64C' },
  { name: 'light', label: '轻度', color: '#E29F3B' },
  { name: 'medium', label: '中度', color: '#F25FFF' },
  { name: 'heavy', label: '严重', color: '#F65252' },
  { name: 'invalid', label: '无效', color: 'rgba(51,51,51,0.6)' }
]

export const monitorPointsCols: ColItem[] = [
  { type: 'selection', width: '50px' },
  { type: 'index', label: '序号' },
  { prop: 'name', label: '监测分区' },
  { prop: 'name', label: '监测站点' },
  { prop: 'name', label: '地址' },
  { prop: 'name', label: '数据采集时间' },
  // 距离当前（分钟，当前时刻-数据时间）
  { prop: 'name', label: '距离当前（分钟）' },
  { prop: 'name', label: '监测指标' },
  { prop: 'name', label: '监测值' },
  { prop: 'name', label: '单位' },
  //判定结果（正常、优质、轻度、中度、严重、无效，超出量程的数据即为无效数据）
  { prop: 'name', label: '判定结果' },
  // 例如：10℃~40℃
  { prop: 'name', label: '监测阈值' },
  { prop: 'action', label: '操作', _slot: true }
]

export const monitorSiteCols: ColItem[] = [
  { type: 'selection', width: '50px' },
  { type: 'index', label: '序号' },
  { prop: 'name', label: '监测分组' },
  { prop: 'name', label: '监测站点' },
  { prop: 'name', label: '地址' },
  { prop: 'name', label: '监测状态' },
  // 数据时间（指数据归集时间）
  { prop: 'name', label: '数据采集时间' },
  // 距离当前（分钟，当前时刻-数据时间）
  { prop: 'name', label: '距离当前（分钟）' },
  { prop: 'name', label: '温度（℃）' },
  { prop: 'name', label: '浊度（NTU）化学需氧量（mg/L）' },
  { prop: 'name', label: '溶解氧（mg/L）' },
  { prop: 'name', label: '悬浮物（mg/L）' },
  { prop: 'name', label: '操作' }
]

export const monitorPointReportCols: ColItem[] = [
  { type: 'selection', width: '50px' },
  { type: 'index', label: '序号' },
  { prop: 'name', label: '监测分区' },
  { prop: 'name', label: '监测站点' },
  { prop: 'name', label: '地址' },
  { prop: 'name', label: '数据时间' },
  { prop: 'name', label: '监测指标' },
  { prop: 'name', label: '监测值' },
  { prop: 'name', label: '单位' },
  { prop: 'name', label: '判定结果' },
  { prop: 'name', label: '监测阈值' },
  { prop: 'name', label: '数据i有效性' },
  { prop: 'name', label: '操作' }
]
export const monitorSiteReportCols: ColItem[] = [
  { type: 'selection', width: '50px' },
  { type: 'index', label: '序号' },
  { prop: 'name', label: '监测分区' },
  { prop: 'name', label: '监测站点' },
  { prop: 'name', label: '地址' },
  { prop: 'name', label: '数据时间' },
  { prop: 'name', label: '监测状态' },
  { prop: 'name', label: '监测指标1' },
  { prop: 'name', label: '监测指标2' },
  { prop: 'name', label: '监测指标3' },
  { prop: 'name', label: '监测指标4' },
  { prop: 'name', label: '监测指标5' },
  { prop: 'name', label: '操作' }
]

export const monitorWarningReportCols: ColItem[] = [
  { type: 'selection', width: '50px' },
  { type: 'index', label: '序号' },
  { prop: 'name', label: '监测分区' },
  { prop: 'name', label: '监测站点' },
  { prop: 'name', label: '地址' },
  { prop: 'name', label: '数据时间' },
  { prop: 'name', label: '类别' },
  { prop: 'name', label: '类型' },
  { prop: 'name', label: '监测指标' },
  { prop: 'name', label: '监测值' },
  { prop: 'name', label: '单位' },
  { prop: 'name', label: '监测阈值' },
  { prop: 'name', label: '阈值下限容差' },
  { prop: 'name', label: '阈值上限容差' },
  { prop: 'name', label: '操作' }
]
