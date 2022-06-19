import { ElTableColumn } from 'element-ui/types/table-column'
import { IEvent, IFlood, IVehicle } from './api'

const alignLeft = (tooltips: boolean = true): Partial<ElTableColumn> => ({
  align: 'left',
  headerAlign: 'left',
  showOverflowTooltip: tooltips
})

export const DICTONARY = {
  event: {
    category: { '1': '普通事件', '2': '紧急事件' },
    type: { '1': '事件类型1', '2': '事件类型2', '3': '事件类型3' },
    status: { '0': '未审核', '1': '不处理', '2': '未派工', '3': '待处理', '4': '处理中', '5': '处理完成' }
  },
  assign: {
    type: { '1': '1事件管理', '2': '汛情管理' }
  }
}

export const eventCols: Partial<ElTableColumn>[] = [
  { type: 'selection', width: '50px' },
  { type: 'index', label: '序号', width: '60px' },
  {
    prop: 'category',
    label: '事件类别',
    minWidth: '150px',
    ...alignLeft(),
    formatter: ({ category }: IEvent) => DICTONARY.event.category[String(category)]
  },
  { prop: 'type', label: '事件类型', minWidth: '150px', ...alignLeft() },
  { prop: 'name', label: '事件名称', minWidth: '150px', ...alignLeft() },
  { prop: 'address', label: '地址', minWidth: '150px', ...alignLeft() },
  { prop: 'facility', label: '关联设施', minWidth: '150px', ...alignLeft() },
  { prop: 'detail', label: '详细描述', minWidth: '150px', ...alignLeft() },
  { prop: 'handingAdvice', label: '处理建议', minWidth: '150px', ...alignLeft() },
  { prop: 'findUserVo.userName', label: '发现人员', minWidth: '150px', ...alignLeft() },
  { prop: 'findUserVo.phone', label: '联系电话', minWidth: '150px', ...alignLeft() },
  { prop: 'findDate', label: '发现日期', minWidth: '150px', ...alignLeft() },
  { prop: 'createTime', label: '上报时间', minWidth: '150px', ...alignLeft() },
  {
    prop: 'status',
    label: '状态',
    minWidth: '150px',
    ...alignLeft(),
    formatter: ({ status }: IEvent) => DICTONARY.event.status[String(status)]
  },
  { prop: 'reciveUser.realName', label: '处理人', minWidth: '150px', ...alignLeft() }
]

export const floodCols: Partial<ElTableColumn>[] = [
  { type: 'selection', width: '50px' },
  { type: 'index', label: '序号', width: '60px' },
  {
    prop: 'police',
    label: '是否为警情',
    minWidth: '150px',
    ...alignLeft(),
    formatter: ({ police }: IFlood) => (police ? '是' : '否')
  },
  { prop: 'position', label: '汛情位置', minWidth: '150px', ...alignLeft() },
  { prop: 'address', label: '详细地址', minWidth: '150px', ...alignLeft() },
  { prop: 'facility', label: '关联设施', minWidth: '150px', ...alignLeft() },
  { prop: 'detail', label: '详细描述', minWidth: '150px', ...alignLeft() },
  { prop: 'suggest', label: '处理建议', minWidth: '150px', ...alignLeft() },
  { prop: 'createTime', label: '上报时间', minWidth: '150px', ...alignLeft() },
  { prop: 'status', label: '状态', minWidth: '150px', ...alignLeft() },
  { prop: 'reciveUser.realName', label: '处理人', minWidth: '150px', ...alignLeft() }
]

export const vehicleCols: Partial<ElTableColumn>[] = [
  { type: 'selection', width: '50px' },
  { type: 'index', label: '序号', width: '60px' },
  { prop: 'carNo', label: '车牌号', minWidth: '150px', ...alignLeft() },
  { prop: 'type', label: '车辆类型', minWidth: '150px', ...alignLeft() },
  { prop: 'model', label: '型号', minWidth: '150px', ...alignLeft() },
  { prop: 'department', label: '部门', minWidth: '150px', ...alignLeft() },
  { prop: 'chargePersonName', label: '负责人', minWidth: '150px', ...alignLeft() },
  { prop: 'phone', label: '联系方式', minWidth: '150px', ...alignLeft() },
  {
    prop: 'status',
    label: '状态',
    minWidth: '150px',
    ...alignLeft(),
    formatter: ({ status }: IVehicle) => ({ '1': '在用', '2': '维修', '3': '报废' }[String(status)])
  }
]

export const vehicleArchiveCols: Partial<ElTableColumn>[] = [
  { type: 'selection', width: '50px' },
  { type: 'index', label: '序号', width: '60px' },
  { prop: 'eventMangeList.findDate', label: '日期', minWidth: '150px', ...alignLeft() },
  { prop: 'carNo', label: '车牌号', minWidth: '150px', ...alignLeft() },
  { prop: 'type', label: '车辆类型', minWidth: '150px', ...alignLeft() },
  { prop: 'model', label: '车辆型号', minWidth: '150px', ...alignLeft() },
  { prop: 'department', label: '管理部门', minWidth: '150px', ...alignLeft() },
  { prop: 'chargePerson', label: '负责人', minWidth: '150px', ...alignLeft() },
  { prop: 'userName', label: '使用人', minWidth: '150px', ...alignLeft() },
  { prop: 'gpsDeviceId', label: '巡检设备', minWidth: '150px', ...alignLeft() },
  { prop: 'name1', label: '巡查上报', minWidth: '150px', ...alignLeft() },
  { prop: 'name2', label: '巡查轨迹', minWidth: '150px', ...alignLeft() },
  { prop: 'name3', label: '巡查里程', minWidth: '150px', ...alignLeft() },
  { prop: 'beginTime', label: '巡查开始时间', minWidth: '150px', ...alignLeft() },
  { prop: 'endTime', label: '巡查结束时间', minWidth: '150px', ...alignLeft() }
]
