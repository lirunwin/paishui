import { ElTableColumn } from 'element-ui/types/table-column'

export const settingDeviceTypeCols: Partial<ElTableColumn>[] = [
  { type: 'index', label: '序号', width: '100px' },
  { prop: 'name', label: '设备类型名称' },
  { prop: 'code', label: '设备类型代码' },
  { prop: 'time', label: '数据归集时间（分钟）' }
]

export const settingDeviceTypeParamCols: Partial<ElTableColumn>[] = [
  { type: 'index', label: '序号' },
  { prop: 'name', label: '参数名称' },
  { prop: 'code', label: '参数代码' },
  { prop: 'short', label: '参数缩写' },
  { prop: 'unit', label: '参数单位' },
  { prop: 'distance', label: '量程' },
  { prop: 'display', label: '是否显示' },
  { prop: 'note', label: '备注' }
]
