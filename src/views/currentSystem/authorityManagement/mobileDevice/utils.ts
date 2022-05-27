import { ElTableColumn } from 'element-ui/types/table-column'

interface ColItem extends Partial<ElTableColumn> {
  _slot?: boolean
  _interval?: boolean
}

export const mdAuditStataus = { '1': '已确认', '0': '未确认' }
export const mdStatus = { '1': '当前', '0': '历史' }
export const mdAppVersion = { '1': '最新版本', '0': '历史版本' }

export const mobileDeviceCols: ColItem[] = [
  { type: 'selection', width: '50px' },
  { type: 'index', label: '序号' },
  { prop: 'no', label: '设备编号', width: '130px' },
  { prop: 'name', label: '设备名称', width: '130px' },
  { prop: 'type', label: '设备型号', width: '110px' },
  { prop: 'meid', label: '设备序列号（MEID）', width: '170px' },
  { prop: 'devicePhone', label: '设备手机号', width: '120px' },
  { prop: 'appVersion', label: 'app版本号', width: '100px' },
  { prop: 'department.departmentName', label: '使用部门', width: '120px' },
  { prop: 'useUser.userName', label: '使用人员' },
  { prop: 'useUser.worknumber', label: '员工编号' },
  { prop: 'createTime', label: '注册时间', width: '170px' },
  {
    prop: 'auditStataus',
    label: '审核状态',
    formatter: (row) => {
      const { auditStataus: val } = (row as any) || {}
      return mdAuditStataus[String(val)] || val || ''
    }
  },
  {
    prop: 'status',
    label: '数据',
    formatter: (row) => {
      const { status: val } = (row as any) || {}
      return mdStatus[String(val)] || val || ''
    }
  },
  { prop: 'action', label: '操作', _slot: true, fixed: 'right' }
]
