import request from '@/utils/request'

// 获取分页
export function getList(data) {
    return request({
        url: `/qc/collectionNumberSummary/list?startDate=${data.startDate}&endDate=${data.endDate}&collectionInfo=${data.collectionInfo}&clientNumber=${data.clientNumber}&clientName=${data.clientName}`,
        method: 'post',
        data: {
            current: data.current,
            size: data.size,
        }
    })
}

// // 获取用户编号
// export function getClientNumberList(data) {
//     return request({
//         url: `/qc/collectionNumberSummary/getClientNumberList?collectionNumber=${data.collectionNumber}`,
//         method: 'get',
//         data
//     })
// }


// 归集汇总分析数据导出
export function getExcel(data) {
    return request({
        url: '/qc/collectionNumberSummary/export',
        method: 'POST',
        responseType: "arraybuffer",
        data
    })
}

// 获取用户数据
export function getClientList(data) {
    return request({
        url: `/qc/collectionNumberSummary/getDetailList?collectionNumber=${data.collectionNumber}&startDate=${data.startDate}&endDate=${data.endDate}`,
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

// 归集汇总分析数据导出
export function getClientExcel(data) {
    return request({
        url: '/qc/collectionNumberSummary/exportClientDetail',
        method: 'POST',
        responseType: "arraybuffer",
        data
    })
}
