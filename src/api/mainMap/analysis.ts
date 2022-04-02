import request from '@/utils/request'

// 缓冲区分析 获取字段
export function getFields(data) {
    return request({
        url: '/kxc/pipelineMaintain/getPipelineColName/',
        method: 'get',
        data
    })
}

// 追踪分析
export function trackingAnalysis(data) {
    return request({
        url: '/kxc/pipelineMaintain/getPipelineConnect',
        method: 'post',
        data
    })
}

// 净距分析接口
export function getPipelineDistance(data) {
    return request({
        url: '/kxc/pipelineMaintain/getPipelineDistance',
        method: 'post',
        data
    })
}
