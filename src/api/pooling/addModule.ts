import request from '@/utils/request'

// 查询用户信息
export function getUserInfo(params) {
    return request({
        url: `/meter/qfkhjbxx/page`,
        method: 'get',
        params
    })
}