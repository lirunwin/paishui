import request from '@/utils/request'

export function getbackUpData(params) {
    return request({
        url: 'base/dataBack/page',
        method: 'get',
        params
    })
}

export function doBackup() {
    return request({
        url: 'base/dataBack/doDataBack',
        method: 'post'
    })
}

// TODO 下载
export function downloadFile(params) {
    return request({
        url: '/base/file/downloadFile',
        method: 'get',
        responseType: 'blob'
    })
}