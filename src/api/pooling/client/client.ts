import request from '@/utils/request'

// 获取分页
export function getList(data) {
    return request({
        url: `/qc/collectionNumber/list?input=${data.input}&collectionStatus=${data.collectionStatus}&collectionType=${data.collectionType}`,
        method: 'post',
        data: {
            current: data.current,
            size: data.size
        }
    })
}

// 新增
export function setSave(data) {
    return request({
        url: `/qc/collectionNumber/save`,
        method: 'post',
        data
    })
}

// 修改
export function upDate(data) {
    return request({
        url: `/qc/collectionNumber/update`,
        method: 'post',
        data
    })
}

// 删除
export function Delete(params) {
    return request({
        url: `/qc/collectionNumber/delete`,
        method: 'get',
        params
    })
}

export function Fj(params) {
    return request({
        url: `/base/syscommoncode/all`,
        method: 'get',
        params
    })
}

export function changeStatus(data) {
    return request({
        url: `/qc/collectionNumber/changeStatus?id=${data.id}&collectionStatus=${data.collectionStatus}`,
        method: 'post',
        data
    })
}