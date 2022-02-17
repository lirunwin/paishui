import request from '@/utils/request'

// 站内信消息推送
export function getNotifications(params) {
  return request({
    url: '/base/messagepush/page',
    method: 'get',
    params,
  })
}

// 标记信息已读
export function markAsRead(params) {
  return request({
    url: '/base/messagerecipient/updateBatchMessageFlag',
    method: 'get',
    params
  })
}

// 首页 => 用户信息 => 详情
export function getInfo(params) {
  return request({
    url: '/base/user/getInfo',
    method: 'get',
    params
  })
}

// 首页 => 待办事项 => 饼图
export function taskPie(params) {
  return request({
    url: '/gis/homeInformation/getCommissionStatisticalInfo',
    method: 'get',
    params
  })
}

//  首页 => 待办事项 => 列表
export function taskList(params) {
  return request({
    url: '/gis/homeInformation/getTypeDistributionInfo',
    method: 'get',
    params
  })
}

//  首页 => 待办事项 => 分类详情
export function taskListPage(params) {
  return request({
    url: '/base/usertask/page',
    method: 'get',
    params
  })
}

// 获取编grouping+码 根据父级编码，查询子集码表
export function getCodeParent(params) {
  return request({
    url: '/base/syscommoncode/getByfjId',
    method: 'get',
    params
  })
}

//  首页 => 报警信息 => 列表
export function alarmList(params) {
  return request({
    url: '/gis/homeInformation/getAlarmInformation',
    method: 'get',
    params
  })
}

//  首页 => 报警信息 => 处理
export function handleWarn(params) {
  return request({
    url: '/gis/bigScreen/handleWarn',
    method: 'get',
    params
  })
}


//  首页 => 营销 => 抄表
export function meterReadingList(params) {
  return request({
    url: '/gis/homeInformation/getMeterReadingMonthNum',
    method: 'get',
    params
  })
}

//  首页 => 营销 => 工单
export function businessManageList(params) {
  return request({
    url: '/gis/homeInformation/getRepairOrderNum',
    method: 'get',
    params
  })
}

//  首页 => 营销 => 表务
export function getWaterMeterNumberNum(params) {
  return request({
    url: '/gis/homeInformation/getWaterMeterNumberNum',
    method: 'get',
    params
  })
}


//  首页 => 营销 => 表务 => 表厂家对应水表数
export function getWaterMeterEnterprise(params) {
  return request({
    url: '/gis/homeInformation/getWaterMeterEnterprise',
    method: 'get',
    params
  })
}

//  首页 => 营销 => 表务 => 表厂家对应安装数
export function getWaterMeterInstall(params) {
  return request({
    url: '/gis/homeInformation/getWaterMeterInstall',
    method: 'get',
    params
  })
}

//  首页 => 营销 => 表务 => 表厂家对应报废总数
export function getWaterMeterOld(params) {
  return request({
    url: '/gis/homeInformation/getWaterMeterOld',
    method: 'get',
    params
  })
}

//  首页 => 营销 => 表务 => 表厂家对应出库数
export function getWaterMeterOutbound(params) {
  return request({
    url: '/gis/homeInformation/getWaterMeterOutbound',
    method: 'get',
    params
  })
}

//  首页 => 营销 => 质量管理系统 => 认证类型
export function getQualityCertification(params) {
  return request({
    url: '/gis/homeInformation/getQualityCertification',
    method: 'get',
    params
  })
}

//  首页 => 营销 => 质量管理系统 => 整改成效
export function getQualityBenefit(params) {
  return request({
    url: '/gis/homeInformation/getQualityBenefit',
    method: 'get',
    params
  })
}

//  首页 => 营销 => 质量管理系统 => 合格率/超时率
export function getQualityQualifiedTimeout(params) {
  return request({
    url: '/gis/homeInformation/getQualityQualifiedTimeout',
    method: 'get',
    params
  })
}

//  首页 => 热线 => 呼入呼损(按月统计)
export function getHotlineTrafficFlow(params) {
  return request({
    url: '/gis/homeInformation/getHotlineTrafficFlow',
    method: 'get',
    params
  })
}

//  首页 => 热线 => 呼出呼损(按月统计)
export function getHotlineOutLoss(params) {
  return request({
    url: '/gis/homeInformation/getHotlineOutLoss',
    method: 'get',
    params
  })
}

//  首页 => 热线 => 满意度(按月统计)
export function getHotlineSatisfaction(params) {
  return request({
    url: '/gis/homeInformation/getHotlineSatisfaction',
    method: 'get',
    params
  })
}

//  首页 => 生产运营 =>  产销差 饼状图(按年统计)
export function getProductionMarketingPoor(params) {
  return request({
    url: '/gis/homeInformation/getProductionMarketingPoor',
    method: 'get',
    params
  })
}

//  首页 => 生产运营 => 产销差 柱状(按年统计)
export function getProductionMarketingPoorMonth(params) {
  return request({
    url: '/gis/homeInformation/getProductionMarketingPoorMonth',
    method: 'get',
    params
  })
}

//  首页 => 生产运营 =>  漏损率 饼状图(按年统计)
export function getLeakage(params) {
  return request({
    url: '/gis/homeInformation/getLeakage',
    method: 'get',
    params
  })
}

//  首页 => 生产运营 =>  漏损率 累计值/预算情况  柱状(按年统计)
export function getLeakageMonth(params) {
  return request({
    url: '/gis/homeInformation/getLeakageMonth',
    method: 'get',
    params
  })
}

//  首页 => 生产运营 =>  供水量/售水量 (按年统计)
export function getFeedSale(params) {
  return request({
    url: '/gis/homeInformation/getFeedSale',
    method: 'get',
    params
  })
}

//  首页 => 生产运营 =>  供水量/售水量  柱状(按年统计)
export function getFeedSaleMonth(params) {
  return request({
    url: '/gis/homeInformation/getFeedSaleMonth',
    method: 'get',
    params
  })
}

//  首页 => 生产运营 =>  单位变动成本 (按年统计)
export function getUnitVariableCost(params) {
  return request({
    url: '/gis/homeInformation/getUnitVariableCost',
    method: 'get',
    params
  })
}

//  首页 => 生产运营 =>  单位变动成本  柱状(按年统计)
export function getUnitVariableCostMonth(params) {
  return request({
    url: '/gis/homeInformation/getUnitVariableCostMonth',
    method: 'get',
    params
  })
}

//  首页 => 生产运营 =>  一厂 取、供水
export function getOneFactoryTakingWaterSupply(params) {
  return request({
    url: '/gis/homeInformation/getOneFactoryTakingWaterSupply',
    method: 'get',
    params
  })
}

//  首页 => 生产运营 => 二厂 取、供水
export function getTwoFactoryTakingWaterSupply(params) {
  return request({
    url: '/gis/homeInformation/getTwoFactoryTakingWaterSupply',
    method: 'get',
    params
  })
}

//  首页 => 生产运营 => 一厂 水质出厂余氯
export function getOneFactoryWaterQualityYL(params) {
  return request({
    url: '/gis/homeInformation/getOneFactoryWaterQualityYL',
    method: 'get',
    params
  })
}

//  首页 => 生产运营 => 一厂 水质出厂浊度
export function getOneFactoryWaterQualityZD(params) {
  return request({
    url: '/gis/homeInformation/getOneFactoryWaterQualityZD',
    method: 'get',
    params
  })
}

//  首页 => 生产运营 => 二厂 水质出厂余氯
export function getTwoFactoryWaterQualityYL(params) {
  return request({
    url: '/gis/homeInformation/getTwoFactoryWaterQualityYL',
    method: 'get',
    params
  })
}

//  首页 => 生产运营 => 二厂 水质出厂浊度
export function getTwoFactoryWaterQualityZD(params) {
  return request({
    url: '/gis/homeInformation/getTwoFactoryWaterQualityZD',
    method: 'get',
    params
  })
}

//  首页 => 生产运营 => 一厂 水压
export function getOneFactoryWaterPressure(params) {
  return request({
    url: '/gis/homeInformation/getOneFactoryWaterPressure',
    method: 'get',
    params
  })
}

//  首页 => 生产运营 => 二厂 水压
export function getTwoFactoryWaterPressure(params) {
  return request({
    url: '/gis/homeInformation/getTwoFactoryWaterPressure',
    method: 'get',
    params
  })
}

//  首页 => 生产运营 => 一厂关键指标
export function getOneFactoryKeyIndex(params) {
  return request({
    url: '/gis/homeInformation/getOneFactoryKeyIndex',
    method: 'get',
    params
  })
}

//  首页 => 生产运营 => 二厂关键指标
export function getTwoFactoryKeyIndex(params) {
  return request({
    url: '/gis/homeInformation/getTwoFactoryKeyIndex',
    method: 'get',
    params
  })
}

//  首页 => 管网 => 分片区管线长度情况
export function pipelengthList(params) {
  return request({
    url: '/gis/homeInformation/getGroupAreaPipeLengthStatistical',
    method: 'get',
    params
  })
}

//  首页 => 管网 => 管线材质统计情况
export function materialClassficationList(params) {
  return request({
    url: '/gis/homeInformation/getPipeMaterialStatistical',
    method: 'get',
    params
  })
}

//  首页 => 管网 => 巡检统计人数相关数据(不传则默认为日统计,传1为月统计)
export function usernspectionList(params) {
  return request({
    url: '/gis/homeInformation/getInspectionUserStateNum',
    method: 'get',
    params
  })
}


//  首页 => 管网 => 当日巡查情况
export function dayinspectionList(params) {
  return request({
    url: '/gis/homeInformation/getNowMonthInspectionDayStatistical',
    method: 'get',
    params
  })
}

//  首页 => 管网 => 当月巡查情况
export function monthinspectionList(params) {
  return request({
    url: '/gis/homeInformation/getNowMonthInspectionStatistical',
    method: 'get',
    params
  })
}

//  首页 => 管网 =>  巡检统计所有隐患/工地数据
export function hiddenDangerAndSiteConditionsList(params) {
  return request({
    url: '/gis/homeInformation/getAllInspectionStatistical',
    method: 'get',
    params
  })
}

//  首页 => 管网 => 当月抢维修
export function currentMonthFixConditionsList(params) {
  return request({
    url: '/gis/homeInformation/getRepairOrderStatistical',
    method: 'get',
    params
  })
}

//  首页 => 个人排行
export function getIndividualRanking(params) {
  return request({
    url: '/gis/homeInformation/getIndividualRanking',
    method: 'get',
    params
  })
}