import request from '@/utils/request'

// 水量分析汇总
export function getTotalInfo(params) {
    return request({
        url: '/meter/qualitysta/analyze',
        method: 'get',
        params
    })
}

// 水量分析详情书
export function getDetailedInfo(params) {
    return request({
        url: '/meter/qualitysta/analyzeDeatils',
        method: 'get',
        params
    })
}

// 抄表区域
export function getQy(params) {
    return request({
      url: `/meter/readRegion/readArea`,
      method: 'get',
      params
    })
  }

// 水量分析详情书
export function getReadArea(params) {
    return request({
        url: '/meter/readRegion/readArea',
        method: 'get',
        params
    })
}

// 水量分析审核
export function auditRow(data) {
    return request({
        url: '/meter/read/audit',
        method: 'post',
        data
    })
}

// 水量分析审核
export function auditRow2(data) {
    return request({
        url: '/meter/read/auditRedDeploy',
        method: 'post',
        data
    })
}


// 水量分析第二个汇总页面
export function getTotalInfo2(params) {
    return request({
        url: '/meter/qualitysta/analyzeAbnromal',
        method: 'get',
        params
    })
}
