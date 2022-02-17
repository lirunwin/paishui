import request from '@/utils/request'

// 查询区域
export function getQy(params) {
    return request({
      url: `/meter/readRegion/readArea`,
      method: 'get',
      params
    })
  }
  
  // 查询区段
  export function getQd(params) {
    return request({
      url: `/meter/readRegion/paragraph`,
      method: 'get',
      params
    })
  }
// 列表
export function getList(params) {
    return request({
        url: '/meter/water/trend',
        method: 'get',
        params
    })
}

// 区域详情
export function getTrend(params) {
    return request({
        url: '/meter/water/trend-Detail',
        method: 'get',
        params
    })
}

// 区域段详情
export function detail(params) {
    return request({
        url: '/meter/water/trend-water-Detail',
        method: 'get',
        params
    })
}

//趋势分析第一个页面
export function trendOne(params) {
    return request({
        url: '/meter/qualitysta/trendOne',
        method: 'get',
        params
    })
}

//趋势分析第二个页面
export function trendTwo(params) {
    return request({
        url: '/meter/qualitysta/trendTwo',
        method: 'get',
        params
    })
}

//趋势分析第三个页面
export function trendThree(params) {
    return request({
        url: '/meter/qualitysta/trendThree',
        method: 'get',
        params
    })
}

//趋势分析第四个页面
export function trendFour(params) {
    return request({
        url: '/meter/qualitysta/trendFour',
        method: 'get',
        params
    })
}
