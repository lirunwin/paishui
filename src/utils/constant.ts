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
