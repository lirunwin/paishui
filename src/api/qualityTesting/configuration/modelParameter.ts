//质量管理-模型参数的接口
import request from '@/utils/request'

// 获取分页模型参数信息
export function getModel(params) {
  return request({
    url: `/meter/arithmetic/getAbnormalArith`,
    method: 'get',
    params
  })
}

// 新增模型参数
export function addModel(data) {
  return request({
    url: `/meter/arithmetic/saveAbnormalArith`,
    method: 'post',
    data
  })
}

// 修改模型参数信息
export function updateModel(data) {
  return request({
    url: `/meter/arithmetic/updateAbnormalArith`,
    method: 'PUT',
    data
  })
}

// 删除模型参数信息
export function deleteModel(params) {
  return request({
    url: `/meter/arithmetic/deleteAbnormalArith`,
    method: 'DELETE',
    params
  })
}

//获取码表信息
export function getCodeInfo(params) {
  return request({
    url: `/base/syscommoncode/getByfjId`,
    method: 'get',
    params
  })
}

// 获取用水性质
export function getNature() {
  return request({
    url: `/meter/quality/nature`,
    method: 'get'
  })
}

// 获取模型参数说明
export function getArithmetic(params) {
  return request({
    url: `/meter/arithmetic/page`,
    method: 'get',
    params
  })
}

// 新增模型参数说明
export function addArithmetic(data) {
  return request({
    url: `/meter/arithmetic`,
    method: 'post',
    data
  })
}

// 修改模型参数说明
export function upArithmetic(data) {
  return request({
    url: `/meter/arithmetic`,
    method: 'put',
    data
  })
}

// 删除模型参数信息
export function delArithmetic(params) {
  return request({
    url: `/meter/arithmetic/`+params.id,
    method: 'DELETE'
  })
}

// // 删除模型参数信息
// export function delArithmetic(params) {
//   return request({
//     url: `/meter/arithmetic/`+params.id,
//     method: 'DELETE'
//   })
// }

// 获取用水性质大类
export function getBigWaterType(params) {
  return request({
    url: `/meter/abnormal/readbigysxz`,
    method: 'get',
    params
  })
}

// 新增用水性质大类
export function addBigWaterType(data) {
  return request({
    url: `/meter/abnormal/readbigysxz`,
    method: 'post',
    data
  })
}

// 修改用水性质大类
export function updateBigWaterType(data) {
  return request({
    url: `/meter/abnormal/readbigysxz`,
    method: 'put',
    data
  })
}

// 删除用水性质大类
export function deleteBigWaterType(params) {
  return request({
    url: `/meter/abnormal/readbigysxz`,
    method: 'delete',
    params
  })
}

// 获取未分类的用水性质
export function getExceptWater(params) {
  return request({
    url: `/meter/abnormal/getNoBingYsxz`,
    method: 'get',
    params
  })
}

// 保存分类设置
export function saveSet(data) {
  return request({
    url: `/meter/abnormal/saveBingYsxz`,
    method: 'post',
    data
  })
}

// 获取归类模型参数配置
export function getModelSet(params) {
  return request({
    url: `/meter/abnormal/getModel`,
    method: 'get',
    params
  })
}

// 保存归类模型参数配置
export function saveModelSet(data) {
  return request({
    url: `/meter/abnormal/saveModel`,
    method: 'post',
    data
  })
}
