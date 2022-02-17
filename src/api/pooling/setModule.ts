import request from '@/utils/request'

// 获取分页
export function getList(data) {
    return request({
        url: `/qc/collectionNumberDetail/list?input=${data.input}&zoneSection=${data.zoneSection}&meterBook=${data.meterBook}&waterCategory=${data.waterCategory}`,
        method: 'post',
        data: {
            current: data.current,
            size: data.size
        }
    })
}