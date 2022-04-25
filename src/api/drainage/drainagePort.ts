//排放口模块接口
import request from '@/utils/temporaryRequest'
/**
  * 说明：
  * get和delete传值用params,
  * post和put传值用data
  */

//排放口分页查询
export function getOutfall(params) {
    return request({
      url: '/psjc/outfall/page ',
      method: 'get',
      params
    })
  }
