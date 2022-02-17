import request from '@/utils/request'

// 经济/社会效益
export function getList(params) {
    return request({
        url: '/meter/report/economic',
        method: 'get',
        params
    })
}

// 经济/社会效益
export function getDeatil(params) {
    return request({
        url: '/meter/report/economic-detail',
        method: 'get',
        params
    })
}

// 获取字典表
export function getCodeAll() {
    return request({
        url: `/base/syscommoncode/all`,
        method: 'get',
    })
}


// 抄表区域
export function getReadArea(params) {
    return request({
        url: '/meter/readRegion/readArea',
        method: 'get',
        params
    })
}

// 抄表区段
export function paragraph(params) {
    return request({
        url: '/meter/readRegion/paragraph',
        method: 'get',
        params
    })
}


// 获取整改工单
export function getPrint(params) {
    return request({
        url: '/meter/report/getRectify',
        method: 'get',
        params
    })
}