import request from '@/utils/request'

// 抄表区域
export function getReadArea(params) {
    return request({
        url: '/meter/report/management',
        method: 'get',
        params
    })
}


export function passRate(params) {
    return request({
        url: '/meter/report/passRate',
        method: 'get',
        params
    })
}

export function unqualifiedQuantity(params) {
    return request({
        url: '/meter/report/unqualifiedQuantity',
        method: 'get',
        params
    })
}

export function getArea() {
    return request({
        url: '/meter/readRegion/readArea?current=1&size=10000',
        method: 'get',
    })
}

