import request from '@/utils/request'

/**
  * 说明：
  * get和delete传值用params,
  * post和put传值用data
  */

// 水量计划相关接口
// 水量计划查询接口
export function queryWaterYieldBudget(params) {
  return request({
    url: '/gis/waterPlan/pagePlan',
    method: 'get',
    params
  })
}

// 新增年份
export function addPlanYear(data) {
  return request({
    url: '/gis/waterPlan/insertPlan',
    method: 'post',
    data
  })
}

// 保存年计划值填报
export function writePlan(data) {
  return request({
    url: '/gis/waterMakingPlan/insertWaterPlan',
    method: 'post',
    data
  })
}

// 删除年计划
export function deletePlanYear(params) {
  return request({
    url: '/gis/waterPlan/deletePlan',
    method: 'delete',
    params
  })
}

// 查看年计划详情
export function yearPlanDetail(params) {
  return request({
    url: '/gis/waterPlan/selectPlanInfo',
    method: 'get',
    params
  })
}

// 修改年计划详情
export function editYearPlan(data) {
  return request({
    url: '/gis/waterMakingPlan/updateWaterPlan',
    method: 'put',
    data
  })
}

// 制水单耗相关接口
// 查询接口
export function yearPlanQuery(params) {
  return request({
    url: '/gis/unitPlan/pagePlan',
    method: 'get',
    params
  })
}

// 增加计划接口
export function yearAdd(data) {
  return request({
    url: '/gis/unitPlan/insertPlan',
    method: 'post',
    data
  })
}
// 增加计划详情接口
export function yearPlanAdd(data) {
  return request({
    url: '/gis/unitPlan/insertPlanInfo',
    method: 'post',
    data
  })
}

// 获取选中项的详情
export function unitPlanDetail(params) {
  return request({
    url: '/gis/unitPlan/pagePlanIngo',
    method: 'get',
    params
  })
}

// 修改接口
export function yearPlanAlter(data) {
  return request({
    url: '/gis/unitPlan/updatePlan',
    method: 'put',
    data
  })
}

// 删除接口
export function yearPlanDelete(params) {
  return request({
    url: 'gis/unitPlan/deletePlan',
    method: 'delete',
    params
  })
}

// 制水指标
// 查询
export function indicatorQuery(params) {
  return request({
    url: '/gis/indexPlan/selectPlan',
    method: 'get',
    params
  })
}
// 填报新增年份
export function indicatorYearAdd(data) {
  return request({
    url: '/gis/indexPlan/insertPlan',
    method: 'post',
    data
  })
}
// 年份计划详情
export function indicatorPlanDetail(params) {
  return request({
    url: '/gis/indexPlan/selectPlanInfo',
    method: 'get',
    params
  })
}
// 年份计划详情填报
export function indicatorPlanAdd(data) {
  return request({
    url: '/gis/indexPlan/insertPlanInfo',
    method: 'post',
    data
  })
}
// 修改
export function indicatorEdit(data) {
  return request({
    url: '/gis/waterMakingPlan/updateIndexPlan',
    method: 'put',
    data
  })
}
// 删除
export function indicatorDelete(params) {
  return request({
    url: '/gis/indexPlan/deletePlan',
    method: 'delete',
    params
  })
}

// 指标单价
// 增加指标单价
export function priceAdd(data) {
  return request({
    url: '/gis/waterMakingPlan/insertPricePlan',
    method: 'post',
    data
  })
}
// 删除单价指标项
export function priceDelete(params) {
  return request({
    url: 'gis/pricePlan/deletePlan',
    method: 'delete',
    params
  })
}
// 修改某项
export function priceEdit(data) {
  return request({
    url: '/gis/waterMakingPlan/updatePricePlan',
    method: 'put',
    data
  })
}
// 查询列表
export function priceList(params) {
  return request({
    url: 'gis/pricePlan/viewNewPlan',
    method: 'get',
    params
  })
}
// 查询历史详细
export function priceHistoryList(params) {
  return request({
    url: 'gis/pricePlan/viewHistoryPlan',
    method: 'get',
    params
  })
}

// 制水单变
// 添加制水单变年计划
export function unitChangeYear(data) {
  return request({
    url: 'gis/fixedPlan/insertPlan',
    method: 'post',
    data
  })
}
// 添加制水单变计划项
export function unitChangeInfoAdd(data) {
  return request({
    url: 'gis/fixedPlan/insertPlanInfo',
    method: 'post',
    data
  })
}
// 删除制水单变年计划
export function unitChangeYearDelete(params) {
  return request({
    url: 'gis/fixedPlan/deletePlan',
    method: 'delete',
    params
  })
}
// 修改制水单变年计划
export function unitChangePlanEdit(data) {
  return request({
    url: 'gis/fixedPlan/updatePlanInfo',
    method: 'put',
    data
  })
}
// 查询制水单变年计划
export function unitChangeList(params) {
  return request({
    url: 'gis/fixedPlan/selectPlan',
    method: 'get',
    params
  })
}
// 查询制水单变年计划详情
export function unitChangeInfo(params) {
  return request({
    url: '/gis/waterMakingPlan/viewFixedPlan',
    method: 'get',
    params
  })
}

// 基本电费填报接口
export function basicElectricityBillInsert(data) {
  return request({
    url: '/gis/waterMakingPlan/insertBill',
    method: 'post',
    data
  })
}
// 基本电费列表
export function basicElectricityBillList(params) {
  return request({
    url: '/gis/waterMakingPlan/viewBill',
    method: 'get',
    params
  })
}
// 查询预算制水费用
export function waterProducePreBill(params) {
  return request({
    url: '/gis/waterMakingPlan/viewExpense',
    method: 'get',
    params
  })
}
// 查获取制水用量
export function waterProduceUsing(params) {
  return request({
    url: '/gis/waterMakingPlan/getDosage',
    method: 'get',
    params
  })
}
