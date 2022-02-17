import request from '@/utils/request'

// 获取分页
export function getList(data) {
    return request({
        url: `/qc/collectionNumber/list?input=${data.input}`,
        method: 'post',
        data: {
            current: data.current,
            size: data.size
        }
    })
}

// 新增
export function setSave(params) {
    return request({
        url: `/qc/collectionNumber/save`,
        method: 'get',
        params
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