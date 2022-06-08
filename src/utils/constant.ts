export const gisNames = ['xjxt', 'whxt', 'monitor', 'psjc', 'psxc']

export const pageSizes = [10, 20, 30, 50, 100, 1000]

export const getDefaultPagination = () => ({ current: 1, size: 20 })

/** 体系默认levels */
export const defaultValuesForMonitorStandardLevel = [
  { codeValue: '0', notes: '优质', sort: 0 },
  { codeValue: '1', notes: '轻度', sort: 1 },
  { codeValue: '2', notes: '中度', sort: 2 },
  { codeValue: '3', notes: '严重', sort: 3 }
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
