import request from '@/utils/request'

//抄表率统计--(日)抄表率汇总
export function getReadPercentDay(params) {
  return request({
    url: '/meter/statistics/getReadPercentDay',
    method: 'get',
    params
  })
}

//抄表率统计--抄表率--详情数据(抄表用户列表信息)
export function getReadDayInfo(params) {
  return request({
    url: '/meter/statistics/getReadDayInfo',
    method: 'get',
    params
  })
}

//抄表准确率--汇总数据
export function accuracyCollect(params) {
  return request({
    url: '/meter/qualitysta/accuracyCollect',
    method: 'get',
    params
  })
}

//抄表准确率--详情列表
export function accuracyCollectDeatil(params) {
  return request({
    url: '/meter/qualitysta/accuracyCollectDeatil',
    method: 'get',
    params
  })
}


export function getCodeId(params) {
  return request({
    url: '/base/syscommoncode/getByfjId',
    method: 'get',
    params
  })
}





