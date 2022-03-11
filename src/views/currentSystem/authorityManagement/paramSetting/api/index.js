import request from '@/utils/request';

//材料类型模块
export function getMateriaTypeList(params) { // 获取材料类型列表
  return request({
    url: '/gps/repairmaterial/page',
    method: 'get',
    params
  })
}

export function addMateriaType(data) { //新增材料类型
 return request({
   url: '/gps/repairmaterial/save',
   method: 'post',
   data
 })
}

export function editMateriaType(data) { //编辑材料类型
  return request({
    url: '/gps/repairmaterial/updata',
    method: 'put',
    data
  })
}

export function deleteMateriaType(params) { //删除材料类型
  return request({
    url: '/gps/repairmaterial/deleteByIds?ids=' + params,
    method: 'delete'
  })
}

//维修类型模块
export function getRepairTypeList(params) { // 获取维修类型列表
  return request({
    url: '/gps/repairtype/page',
    method: 'get',
    params
  })
}

export function addRepairType(data) { //新增维修类型
 return request({
   url: '/gps/repairtype/save',
   method: 'post',
   data
 })
}

export function editRepairType(data) { //编辑维修类型
  return request({
    url: '/gps/repairtype/updata',
    method: 'put',
    data
  })
}

export function deleteRepairType(params) { //删除维修类型
  return request({
    url: '/gps/repairtype/deleteByIds?ids=' + params,
    method: 'delete'    
  })
}

//参数配置模块
export function getParams() { // 获取参数配置
  return request({
    url: '/base/paramconfig/page',
    method: 'get'
  })
}
export function saveParams(data) { // 保存App端参数配置
  return request({
    url: '/base/paramconfig',
    method: 'put',
    data: data
  })
}