import request from '@/utils/request'

/**
  * 说明：
  * get和delete传值用params,
  * post和put传值用data
  */

//设置多因组配置
export function setConfigSend(data) {
    return request({
        url: '/gis/customDisplay/config',
        method: 'post',
        data
    })
}

//获取配置数据
export function getConfigInfo(params) {
    return request({
        url: '/gis/customDisplay/viewConfig',
        method: 'get',
        params
    })
}

//获取多因组配置
export function getConfig(params) {
    return request({
        url: '/gis/customDisplay/config',
        method: 'get',
        params
    })
}

//获取多因组数据
export function getInfo(params) {
    return request({
        url: '/gis/customDisplay/relationChart',
        method: 'get',
        params
    })
}

//获取多因组编码
export function getCodeInfo(params) {
    return request({
        url: '/gis/customDisplay/getCodeInfo',
        method: 'get',
        params
    })
}

