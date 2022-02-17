import request from '@/utils/request'

// 获取分页
export function getList(data) {
    return request({
        url: `/qc/collectionNumberDetail/list?clientNumber=${data. clientNumber}&collectionNumber=${data.collectionNumber}`,
        method: 'post',
        data: {
            current: data.current,
            size: data.size
        }
    })
}

// 获取子级编码表

export function getSONBMinfo(data) {
    return request({
        url: '/base/syscommoncode/getByfjId?pCid=' + data,
        method: 'get'
    })
}

// 删除
export function Delete(params) {
    return request({
        url: `/qc/collectionNumberDetail/deleteByBatch`,
        method: 'get',
        params
    })
}

// 区域段
export function paraGraph(params) {
    return request({
        url: `/meter/readRegion/paragraph`,
        method: 'get',
        params
    })
}
// 区域
export function readArea(params) {
    return request({
        url: `/meter/readRegion/readArea`,
        method: 'get',
        params
    })
}

export function Sign(data) {
        return request({
            url: '/gis/sxjDocking/send',
            method: 'POST',
            data
        })
    }

    export function Fj(params) {
        return request({
            url: `/base/syscommoncode/all`,
            method: 'get',
            params
        })
    }

