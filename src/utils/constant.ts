export const gisNames = ['xjxt', 'whxt', 'monitor', 'psjc', 'psxc']

export const pageSizes = [10, 20, 30, 50, 100, 1000]

export const getDefaultPagination = () => ({ current: 1, size: 30 })

/** 体系默认levels
 * 正常黑色#333333、优质绿色#06B64C、轻度黄色#E29F3B、中度粉色#F25FFF、严重红色#F65252、无效黑色#333333+透明度60%
 */
export const defaultValuesForMonitorStandardLevel = [
  { codeValue: '0', notes: '优质', sort: 0, color: '#06B64C' },
  { codeValue: '1', notes: '轻度', sort: 1, color: '#E29F3B' },
  { codeValue: '2', notes: '中度', sort: 2, color: '#F25FFF' },
  { codeValue: '3', notes: '严重', sort: 3, color: '#F65252' }
]

export const monitorStandardLevelKey = { codeKey: 'monitor_indicate_level', codeRemark: '体系指标判定' }

export const getIntervalValue = (start: string | number, end: string | number) =>
  !start && !end ? '∞' : `${start || 0} ~ ${end || '∞'}`

export const translate = ({
  arr = [],
  key,
  value,
  label = 'label'
}: {
  arr: any[]
  key: string
  value: string | number
  label: string
}) => (arr.find((item) => item[key] === String(value)) || {})[label] || value

export const telAndMobileReg = () => /(^(0\d{2,3}-?)?\d{7,8}$)|(^1[3-9]\d{9}$)/

/** return number
 *  unit: km
 */
export const getDistance = ([lat1, lng1]: number[], [lat2, lng2]: number[]): number => {
  const radLat1 = (lat1 * Math.PI) / 180.0
  const radLat2 = (lat2 * Math.PI) / 180.0
  const a = radLat1 - radLat2
  const b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0
  let s =
    2 *
    Math.asin(
      Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2))
    )
  s = s * 6378.137 // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000
  return s
}

export const monitorAutoRefreshInterval = 1000 * 60

export const pointState = { '0': '离线', '1': '正常', '2': '报警' }

export const monitorStatusColor = { '0': 'rgba(51,51,51,0.6)', '1': '#333333', '2': '#F65252' }

export const disabledMenus = ['']
