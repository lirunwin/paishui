import request from '@/utils/request'

// 获取用户数据
export function getList(data) {
    return request({
        url: `/qc/collectionNumberSummary/getDetailList?collectionNumber=${data.collectionNumber}&startDate=${data.startDate}&endDate=${data.endDate}&input=${data.input}&waterCategory=${data.waterCategory}`,
        method: 'post',
        data: {
            current: data.current,
            size: data.size,
        }
    })
}

// 归集月份水量波动图
export function getCollectionMonthGraph(data) {
    return request({
        url: `/qc/collectionNumberSummary/getCollectionMonthGraph?collectionNumber=${data.collectionNumber}&startDate=${data.startDate}&endDate=${data.endDate}`,
        method: 'get',
        data
    })
}

// 客户月份水量波动图
export function MonthGraph(data) {
    return request({
        url: `/qc/collectionNumberSummary/getClientMonthGraph?clientNumber=${data.clientNumber}&startDate=${data.startDate}&endDate=${data.endDate}`,
        method: 'get',
        data
    })
}

// 客户三月水量波动图
export function threeMonthGraph(data) {
    return request({
        url: `/qc/collectionNumberSummary/getClientHistoryGraph?clientNumber=${data.clientNumber}`,
        method: 'get',
        data
    })
}
export function Sign(data) {
        return request({
            url: '/gis/sxjDocking/send',
            method: 'POST',
            data
        })
    }


