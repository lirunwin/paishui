export default (file) => {
  // console.log(file);
  return map[file] || null
}
const map = {
  Layout: () => import('@/layout/index.vue'),
  Dashboard: () => import('@/views/currentSystem/dashboard/index.vue'), // 首页
  currentSystem: () => import('@/views/currentSystem/index.vue'), // 当前系统的路由
  Map: () => import('@/views/zhpt/index.vue'),
  // facilityEvaluation: () => import('@/views/facilityEvaluation/index.vue'), // 设施评价
  // funMap: () => import('@/views/currentSystem/map/funCom/index'),
  // 系统权限
  userManage: () => import('@/views/currentSystem/authorityManagement/userRights/index.vue'), // 用户管理
  roleManage: () => import('@/views/currentSystem/authorityManagement/rolePermission/index.vue'), // 角色管理
  journalManage: () => import('@/views/currentSystem/authorityManagement/journal/index.vue'), // 日志管理
  appManage: () => import('@/views/currentSystem/authorityManagement/APPV/index.vue'), // APP管理
  ModulesManage: () => import('@/views/currentSystem/authorityManagement/modulesManage/index.vue'), // 模块管理
  dataBackup: () => import('@/views/currentSystem/authorityManagement/dataBackup/index.vue'), // 数据备份
  metaDataManage: () => import('@/views/currentSystem/authorityManagement/metaManage/index.vue'), // 元数据管理
  departmentManage: () => import('@/views/currentSystem/authorityManagement/section/index.vue'), // 单位管理
  serviceManage: () => import('@/views/currentSystem/authorityManagement/serviceConfig/index.vue'), // 服务配置
  paramSetting: () => import('@/views/currentSystem/authorityManagement/paramSetting/index.vue'), // 参数配置
  dictManagement: () => import('@/views/currentSystem/authorityManagement/dictManagement/index.vue'), // 字典管理
  coveringSpecification: () => import('@/views/currentSystem/authorityManagement/coveringSpecification/index.vue'), // 覆土规范
  mobileDevice: () => import('@/views/currentSystem/authorityManagement/mobileDevice/index.vue'), // 移动设备管理

  //综合展示-工具栏
  //左侧顶部工具栏
  leftTopTool: () => import('@/views/zhpt/tongyonggongju/leftTopTool/widget.vue'), // 左侧顶部工具栏
  searchTool: () => import('@/views/zhpt/tongyonggongju/leftTopTool/searchTool/widget.vue'), // 搜索工具
  upOrDownView: () => import('@/views/zhpt/tongyonggongju/leftTopTool/upOrDownView/widget.vue'), // 上下视图
  //左侧底部工具栏
  leftBottomTool: () => import('@/views/zhpt/tongyonggongju/leftBottomTool/widget.vue'), // 左侧底部工具栏
  propScale: () => import('@/views/zhpt/tongyonggongju/leftBottomTool/propScale/widget.vue'), // 比例尺
  showLoaction: () => import('@/views/zhpt/tongyonggongju/leftBottomTool/showLoaction/widget.vue'), // 坐标展示
  //右侧顶部工具栏
  rightTopTool: () => import('@/views/zhpt/tongyonggongju/rightTopTool/widget.vue'), // 右侧顶部工具栏

  measureTool: () => import('@/views/zhpt/tongyonggongju/rightTopTool/measureTool/widget.vue'), //测量工具
  distanceTool: () => import('@/views/zhpt/tongyonggongju/rightTopTool/measureTool/distanceTool.vue'), //距离测量
  areaTool: () => import('@/views/zhpt/tongyonggongju/rightTopTool/measureTool/areaTool.vue'), //面积测量
  angleTool: () => import('@/views/zhpt/tongyonggongju/rightTopTool/measureTool/angleTool.vue'), //角度测量
  coordinateTool: () => import('@/views/zhpt/tongyonggongju/rightTopTool/measureTool/coordinateTool.vue'), //坐标
  clearMeasureTool: () => import('@/views/zhpt/tongyonggongju/rightTopTool/measureTool/clearMeasureTool.vue'), //清除测量

  toolBox: () => import('@/views/zhpt/tongyonggongju/rightTopTool/toolBox/widget.vue'), //工具箱
  fullScreen: () => import('@/views/zhpt/tongyonggongju/rightTopTool/toolBox/fullScreen.vue'), //全屏
  mapScreenshot: () => import('@/views/zhpt/tongyonggongju/rightTopTool/toolBox/mapScreenshot.vue'), //截图

  mapLegend: () => import('@/views/zhpt/tongyonggongju/rightTopTool/otherTools/mapLegend.vue'), // 图例

  //右侧底部工具栏
  rightBottomTool: () => import('@/views/zhpt/tongyonggongju/rightBottomTool/widget.vue'), // 右侧底部工具栏
  overView: () => import('@/views/zhpt/tongyonggongju/rightBottomTool/overView/widget.vue'), // 鹰眼
  regionZoomIn: () => import('@/views/zhpt/tongyonggongju/rightBottomTool/regionZoomIn/widget.vue'), // 缩小
  regionZoomOut: () => import('@/views/zhpt/tongyonggongju/rightBottomTool/regionZoomOut/widget.vue'), // 放大
  initExtent: () => import('@/views/zhpt/tongyonggongju/rightBottomTool/initExtent/widget.vue'), // 初始范围
  viewSwitch: () => import('@/views/zhpt/tongyonggongju/rightBottomTool/viewSwitch/widget.vue'), // 视图切换
  mapCompass: () => import('@/views/zhpt/tongyonggongju/rightBottomTool/mapCompass/widget.vue') // 指北针

  // 监测中心
  //    检测配置
  //设备类型配置
  // '/monitoring/settings/device/types': () => import('@/views/monitoring/settings/device/types/index.vue'),
  // //设备档案管理
  // '/monitoring/settings/device/archives': () => import('@/views/monitoring/settings/device/archives/index.vue'),
  // //监测点管理
  // '/monitoring/settings/points': () => import('@/views/monitoring/settings/points/index.vue'),
  // //监测站管理
  // '/monitoring/settings/sites': () => import('@/views/monitoring/settings/sites/index.vue'),
  // //图标管理
  // '/monitoring/settings/icons': () => import('@/views/monitoring/settings/icons/index.vue'),
  // //指标标准配置
  // '/monitoring/settings/standards': () => import('@/views/monitoring/settings/standards/index.vue'),

  // // 监控中心
  // '/monitoring/monitor': () => import('@/views/monitoring/monitor/widget.vue'),
  // // 指标实时监测
  // '/monitoring/monitor/points': () => import('@/views/monitoring/monitor/points/index.vue'),
  // // 站点实时监测
  // '/monitoring/monitor/sites': () => import('@/views/monitoring/monitor/sites/index.vue'),
  // '/monitoring/report/detail': () => import('@/views/monitoring/report/detail/index.vue'),
  // '/monitoring/report/points': () => import('@/views/monitoring/report/points/index.vue'),
  // '/monitoring/report/sites': () => import('@/views/monitoring/report/sites/index.vue'),
  // '/monitoring/report/warnings': () => import('@/views/monitoring/report/warnings/index.vue')

  // 设施评估
  // 管道检测数据管理
  // EngineeringManage: () => import('@/views/facilityEvaluation/pipelineManage/engineeringManage/index.vue'), // 工程管理
  // TestResultDiagram: () => import('@/views/facilityEvaluation/pipelineManage/testResultDiagram/index.vue'), // 检测成果专题图

  // // 营销业务管理系统
  // register: () => import('@/views/currentSystem/work/order/register/index'), // 工单登记
  // WorkList: () => import('@/views/currentSystem/work/WorkList/work/index'), // 工单汇总
  // handle: () => import('@/views/currentSystem/work/order/handle/index'), // 认证处置
  // check: () => import('@/views/currentSystem/work/order/check/index'), // 工单审核
  // quality: () => import('@/views/currentSystem/work/order/quality/index'), // 工单质检
  // writeOff: () => import('@/views/currentSystem/work/order/writeOff/index'), // 结果处置
  // finalDecision1: () => import('@/views/currentSystem/work/order/finalDecision1/index'), // 1
  // returnVisit: () => import('@/views/currentSystem/work/order/returnVisit/index'), // 工单回访
  // reportSearch: () => import('@/views/currentSystem/work/monitoring/reportSearch/index'), // 工单查询
  // allWork: () => import('@/views/currentSystem/work/monitoring/allWork/index'), // 工单总览
  // businessWorkOrder: () => import('@/views/currentSystem/work/monitoring/businessWorkOrder/index'), // 业务监控
  // staffWorkOrder: () => import('@/views/currentSystem/work/monitoring/staff/index'), // 人员监控
  // flowPath: () => import('@/views/currentSystem/work/configuration/flowPath/index'), // 流程配置
  // workOrderType: () => import('@/views/currentSystem/work/configuration/workOrderType/index'), // 工单类型
  // workOrderArchive: () => import('@/views/currentSystem/work/configuration/workOrderArchive/index'), // 维修类型
  // percentageComplete: () => import('@/views/currentSystem/work/statistics/percentageComplete/index'), // 完成率
  // abnormal: () => import('@/views/currentSystem/work/statistics/abnormal/index'), // 异常

  // // 供水服务热线系统
  // workbench: () => import('@/views/currentSystem/waterHotline/workbench/index'), // 坐席工作台
  // business: () => import('@/views/currentSystem/work/monitoring/businessWorkOrder/index'), // 业务监控
  // staff: () => import('@/views/currentSystem/work/monitoring/staff/index'), // 人员监控
  // squad: () => import('@/views/currentSystem/waterHotline/monitor/squad/index'), // 班长监控
  // faultType: () => import('@/views/currentSystem/waterHotline/monitor/faultType/index'), // 故障分类
  // rate: () => import('@/views/currentSystem/waterHotline/monitor/rate/index'), // 评分模板
  // addressBook: () => import('@/views/currentSystem/waterHotline/monitor/addressBook/index'), // 内部通讯
  // Event: () => import('@/views/currentSystem/waterHotline/monitor/Event/index'), // 事件类型
  // warning: () => import('@/views/currentSystem/waterHotline/monitor/warning/index'), // 流量预警
  // emergency: () => import('@/views/currentSystem/waterHotline/monitor/emergency/index'), // 应急记录
  // emergencyAudit: () => import('@/views/currentSystem/waterHotline/monitor/emergencyAudit/index'), // 应急审核
  // scheduling: () => import('@/views/currentSystem/waterHotline/manualSeat/scheduling/index'), // 排班管理
  // ShiftChange: () => import('@/views/currentSystem/waterHotline/manualSeat/shiftChange/index'), // 交接班管理
  // record: () => import('@/views/currentSystem/waterHotline/qualityTesting/record/index'), // 录音质检
  // // workOrderQuality: () => import('@/views/currentSystem/waterHotline/qualityTesting/workOrderQuality/index'), // 工单质检
  // workOrderQuality: () => import('@/views/currentSystem/waterHotline/qualityTesting/workOrderQuality/index'), // 工单质检
  // repository: () => import('@/views/currentSystem/waterHotline/knowledge/repository/index'), // 知识库管理
  // seeRepository: () => import('@/views/currentSystem/waterHotline/knowledge/seeRepository/index'), // 知识库管理
  // problem: () => import('@/views/currentSystem/waterHotline/monitor/problem/index'), // 问题模板
  // SMSinform: () => import('@/views/currentSystem/waterHotline/SMS/SMSinform'), // 短信通知
  // SMStemplate: () => import('@/views/currentSystem/waterHotline/SMS/SMStemplate'), // 短信模板
  // SMSsent: () => import('@/views/currentSystem/waterHotline/SMS/SMSsent'), // 发送管理
  // comprehensiveData: () => import('@/views/currentSystem/waterHotline/comprehensiveData/index'), // 客户综合查询
  // callLog: () => import('@/views/currentSystem/waterHotline/statisticalReport/callLog'), // 录音评分统计
  // Monthly: () => import('@/views/currentSystem/waterHotline/statisticalReport/Monthly'),
  // allWorkS: () => import('@/views/currentSystem/waterHotline/statisticalReport/allWork'), // 业务工单统计（新加）
  // Returnvisit: () => import('@/views/currentSystem/waterHotline/statisticalReport/Returnvisit'), // 回访记录统计（新加）
  // Qualityinspection: () => import('@/views/currentSystem/waterHotline/statisticalReport/Qualityinspection'), // 工单质检统计（新加）
  // Recordingquality: () => import('@/views/currentSystem/waterHotline/statisticalReport/Recordingquality'), // 录音质检统计（新加）
  // seatStatus: () => import('@/views/currentSystem/waterHotline/statisticalReport/seatStatus'), // 坐席状态统计
  // customerSatisfaction: () => import('@/views/currentSystem/waterHotline/statisticalReport/customerSatisfaction'), // 客户满意度报表
  // disposeType: () => import('@/views/currentSystem/waterHotline/statisticalReport/disposeType'), // 处理工单分类统计
  // complete: () => import('@/views/currentSystem/waterHotline/statisticalReport/complete'), // 工单统计
  // timeout: () => import('@/views/currentSystem/waterHotline/statisticalReport/timeout'), // 超时统计
  // SchedulSee: () => import('@/views/currentSystem/waterHotline/manualSeat/SchedulSee/index'), // 应急管理
  // WorkConfigure: () => import('@/views/currentSystem/waterHotline/qualityTesting/WorkConfigure/index'), // 质检配置

  // // 表务管理
  // Warehousing: () => import('@/views/currentSystem/meter/circulation/Warehousing/index'), // 入库
  // Delivery: () => import('@/views/currentSystem/meter/circulation/Delivery/index'), // 出库
  // first: () => import('@/views/currentSystem/meter/verification/first/index'), // 首检
  // install: () => import('@/views/currentSystem/meter/circulation/install/index'), // 新装
  // swop: () => import('@/views/currentSystem/meter/circulation/swop/index'), // 换表
  // scrap: () => import('@/views/currentSystem/meter/circulation/scrap/index'), // 移交
  // dispute: () => import('@/views/currentSystem/meter/verification/dispute/index'), // 争议检定
  // alternate: () => import('@/views/currentSystem/meter/verification/Sampling/alternate/index'), // 周检表抽检
  // inspection: () => import('@/views/currentSystem/meter/verification/Sampling/inspection/index'), // 故障表拆检
  // meterSite: () => import('@/views/currentSystem/meter/epitopeData/meterSite/index'), // 表位资料
  // produce: () => import('@/views/currentSystem/meter/period/produce/index'), // 周检计划
  // Scrap: () => import('@/views/currentSystem/meter/reports/Scrap/index'), // 报废表统计
  // Mount: () => import('@/views/currentSystem/meter/reports/Mount/index'), // 新装表统计
  // Summary: () => import('@/views/currentSystem/meter/reports/Summary/index'), // 出库表统计
  // Change: () => import('@/views/currentSystem/meter/reports/Change/index'), // 换表统计
  // Inventory: () => import('@/views/currentSystem/meter/reports/Inventory/index'), // 库存统计
  // controversy: () => import('@/views/currentSystem/meter/reports/Controversy/index'), // 争议检定查询
  // UsageWater: () => import('@/views/currentSystem/meter/reports/UsageWater/index'), // 水表使用情况
  // Water: () => import('@/views/currentSystem/meter/reports/Water/index'), // 水表查询
  // inspections: () => import('@/views/currentSystem/meter/inspection/inspection/index'), // 首检比例
  // manufactor: () => import('@/views/currentSystem/meter/inspection/manufactor/index'), // 厂家维护
  // Periodic: () => import('@/views/currentSystem/meter/inspection/Periodic/index'), // 周期规则
  // SpotCheck: () => import('@/views/currentSystem/meter/inspection/SpotCheck/index'), // 抽检比例

  // //   // 抄表系统
  // device: () => import('@/views/currentSystem/meterReading/deploy/device/index'), //
  // district: () => import('@/views/currentSystem/meterReading/deploy/district/index'), //
  // sector: () => import('@/views/currentSystem/meterReading/deploy/section/index'), //
  // clientApportion: () => import('@/views/currentSystem/meterReading/deploy/clientApportion/index'), //
  // sequence: () => import('@/views/currentSystem/meterReading/deploy/sequence/index'), // 抄表顺序
  // recordSwitch: () => import('@/views/currentSystem/meterReading/deploy/recordSwitch/index'), // 开关记录
  // abnormalConfiguration: () => import('@/views/currentSystem/meterReading/deploy/abnormalConfiguration/index'), // 异常配置
  // plan: () => import('@/views/currentSystem/meterReading/planProgramme/plan/index'), // 抄表计划管理
  // pnad: () => import('@/views/currentSystem/meterReading/planProgramme/pnad/index'), // 抄表计划管理 普查
  // offLine: () => import('@/views/currentSystem/meterReading/planProgramme/offLine/index'), // 离线抄表
  // meterReadingReview: () => import('@/views/currentSystem/meterReading/planProgramme/meterReadingReview/index'), // 抄表审核
  // meterReaderPersonnel: () => import('@/views/currentSystem/meterReading/meterReaderPersonnel/index'), // 抄表人员管理

  // MRDquery: () => import('@/views/currentSystem/meterReading/statistics/MRDquery/index'), // 抄表数据查询
  // CMRDquery: () => import('@/views/currentSystem/meterReading/statistics/CMRDquery/index'), // 客户抄表查询
  // GIDquery: () => import('@/views/currentSystem/meterReading/statistics/GIDquery/index'), // 普查数据查询
  // CMRHistory: () => import('@/views/currentSystem/meterReading/statistics/CMRHistory/index'), // 分配统计
  // MRRstatistics: () => import('@/views/currentSystem/meterReading/statistics/MRRstatistics/index'), // 月抄表率统计
  // MRRstatisticsDaily: () => import('@/views/currentSystem/meterReading/statistics/MRRstatisticsDaily/index'), // 日抄表率统计
  // MRTstatistics: () => import('@/views/currentSystem/meterReading/statistics/MRTstatistics/index'), // 抄表时间统计
  // MRTstatisticsOvertime: () => import('@/views/currentSystem/meterReading/statistics/MRTstatisticsOvertime/index'), // 抄表超时统计
  // MRAccuracyQuery: () => import('@/views/currentSystem/meterReading/statistics/MRAccuracyQuery/index'), // 抄表准确率统计
  // changeHistory: () => import('@/views/currentSystem/meterReading/statistics/changeHistory/index'), // 抄表历史
  // // 区域计量
  // zoningManage: () => import('@/views/currentSystem/regionalMetering/DMAManage'), // DMA分区
  // zoningManageUser: () => import('@/views/currentSystem/regionalMetering/DMAManageUser'), // DMA用户邦定
  // icf: () => import('@/views/currentSystem/regionalMetering/DMAManage/icf'), // ICF状况因子
  // tubing: () => import('@/views/currentSystem/regionalMetering/DMAManage/tubing'), // 管材类别
  // sheetsForObserve: () => import('@/views/currentSystem/regionalMetering/zone/sheetsForObserve'), // 区域视察表
  // zoneSplitManage: () => import('@/views/currentSystem/regionalMetering/zone/zoneSplitManage'), // 区域分表
  // cumulativeWaterDiff: () => import('@/views/currentSystem/regionalMetering/statisticAnalyse/cumulativeWaterDiff'), // 产销差分析
  // minStroomAnalyse: () => import('@/views/currentSystem/regionalMetering/statisticAnalyse/minStroomAnalyse'), // 夜间最小流量
  // utizonderingInfo: () => import('@/views/currentSystem/regionalMetering/statisticAnalyse/utizonderingInfo'), // 异常信息
  // observeSheets: () => import('@/views/currentSystem/regionalMetering/statisticAnalyse/observeSheets'), // 观察表统计分析
  // observeMeterSupplyMonthly: () => import('@/views/currentSystem/regionalMetering/statisticAnalyse/observeMeterSupplyMonthly'), // 观察表月供水量分析
  // historyFlowCollection: () => import('@/views/currentSystem/regionalMetering/statisticAnalyse/historyFlowCollection'), // 流量历史采集分析
  // historyPressureCollection: () => import('@/views/currentSystem/regionalMetering/statisticAnalyse/historyPressureCollection'), // 流量历史采集分析
  // workorderDeal: () => import('@/views/currentSystem/regionalMetering/workorder/workorderDeal'), // 工单跟踪
  // effectRate: () => import('@/views/currentSystem/regionalMetering/workorder/effectRate'), // 绩效评价

  // // 质量管理
  // summarize: () => import('@/views/currentSystem/qualityTesting/workOrder/summarize'), // 质检汇总
  // workOrderSumbit: () => import('@/views/currentSystem/qualityTesting/workOrder/workOrderSumbit'), // 工单上报
  // authentication: () => import('@/views/currentSystem/qualityTesting/workOrder/authentication'), // 检验记录
  // rectificationOrder: () => import('@/views/currentSystem/qualityTesting/workOrder/rectificationOrder'), // 整改下达
  // rectificationResult: () => import('@/views/currentSystem/qualityTesting/workOrder/rectificationResult'), // 整改处置
  // rectificationAudit: () => import('@/views/currentSystem/qualityTesting/workOrder/rectificationAudit'), // 整改审核
  // rectificationVerification: () => import('@/views/currentSystem/qualityTesting/workOrder/rectificationVerification'), // 整改验证
  // validationAudits: () => import('@/views/currentSystem/qualityTesting/workOrder/validationAudits'), // 验证审核

  // auditTypeSet: () => import('@/views/currentSystem/qualityTesting/configuration/auditTypeSet'), // 通过原因管理
  // modelParameter: () => import('@/views/currentSystem/qualityTesting/configuration/ModelParameter'), // 模型参数
  // modelParameterOld: () => import('@/views/currentSystem/qualityTesting/configuration/ModelParameterOld'), // 模型参数检验
  // timeConfiguration: () => import('@/views/currentSystem/qualityTesting/configuration/timeConfiguration'), // 配置时限
  // reject: () => import('@/views/currentSystem/qualityTesting/configuration/reject'), // 驳回次数配置
  // frequency: () => import('@/views/currentSystem/qualityTesting/configuration/frequency'), // 扫描配置
  // proportion: () => import('@/views/currentSystem/qualityTesting/configuration/proportion'), // 抽查比例

  // project: () => import('@/views/currentSystem/qualityTesting/configuration/project'), // 检查项目（1级） 2
  // problemLevel: () => import('@/views/currentSystem/qualityTesting/configuration/problemLevel'), // 问题级别（1级） 3
  // effect: () => import('@/views/currentSystem/qualityTesting/configuration/effect'), // 整改成效（1级）4
  // flaw: () => import('@/views/currentSystem/qualityTesting/configuration/flaw'), // 质量缺陷类型（2级）5

  // monitoring: () => import('@/views/currentSystem/qualityTesting/workOrder/monitoring'), // 业务监控
  // client: () => import('@/views/currentSystem/qualityTesting/pooling/client/index'), // 客户归集
  // // ClientCollection: () => import('@/views/currentSystem/qualityTesting/pooling/client/index'), // 客户归集
  // pooledAnalysis: () => import('@/views/currentSystem/qualityTesting/pooling/clientTotal/index'), // 汇总分析
  // planReview: () => import('@/views/currentSystem/qualityTesting/QualityPlan/planReview/index'), // 计划审核
  // planManagement: () => import('@/views/currentSystem/qualityTesting/QualityPlan/planManagement/index'), // 计划管理
  // eventQuery: () => import('@/views/currentSystem/qualityTesting/statisticAnalysis/eventQuery/index'), //  抽查
  // random: () => import('@/views/currentSystem/qualityTesting/statisticAnalysis/random/index'), // 事件查询
  // SYSscreening: () => import('@/views/currentSystem/qualityTesting/statisticAnalysis/SYSscreening/index'), // 系统筛查
  // artificialScreening: () => import('@/views/currentSystem/qualityTesting/statisticAnalysis/artificialScreening/index'), // 人工筛查
  // administration: () => import('@/views/currentSystem/qualityTesting/statisticAnalysis/statement/index'), // 管理效益
  // social: () => import('@/views/currentSystem/qualityTesting/statisticAnalysis/social/index'), // 经济效益

  // OrderCompleteRate: () => import('@/views/currentSystem/qualityTesting/statisticAnalysis/OrderCompleteRate/index'), // 工单完成率
  // QulDefectStatistic: () => import('@/views/currentSystem/qualityTesting/statisticAnalysis/QulDefectStatistic/index'), // 质量缺陷统计
  // QulDefectTrend: () => import('@/views/currentSystem/qualityTesting/statisticAnalysis/QulDefectTrend/index'), // 质量缺陷趋势
  // DeptOrdAdjustRate: () => import('@/views/currentSystem/qualityTesting/statisticAnalysis/DeptOrdAdjustRate/index'), // 部门工单整改率
  // FreqClaimTable: () => import('@/views/currentSystem/qualityTesting/statisticAnalysis/FreqClaimTable/index'), // 认证频次明细表

  // Qcstatistics: () => import('@/views/currentSystem/qualityTesting/statisticAnalysis/Qcstatistics/index'), // 工单完成率
  // usersQuery: () => import('@/views/currentSystem/qualityTesting/statisticAnalysis/usersQuery/index'), // 户数查询
  // usersStatistics: () => import('@/views/currentSystem/qualityTesting/statisticAnalysis/usersStatistics/index'), // 户数统计

  // waterTrend: () => import('@/views/currentSystem/qualityTesting/statisticAnalysis/waterTrend/index'), // 水量趋势
  // waterVolatility: () => import('@/views/currentSystem/qualityTesting/statisticAnalysis/waterVolatility/index'), // 水量波动
  // waterQuery: () => import('@/views/currentSystem/qualityTesting/statisticAnalysis/waterQuery/index'), // 水量查询

  // authenticationSum: () => import('@/views/currentSystem/qualityTesting/statisticAnalysis/authenticationSum/index'), // 认证总量统计
  // authenticationState: () => import('@/views/currentSystem/qualityTesting/statisticAnalysis/authenticationState/index'), // 认证状态统计
  // rectificationState: () => import('@/views/currentSystem/qualityTesting/statisticAnalysis/rectificationState/index'), // 整改状态统计
  // authenticationFrequency: () => import('@/views/currentSystem/qualityTesting/statisticAnalysis/authenticationFrequency/index'), // 认证频次统计
  // QCSummary: () => import('@/views/currentSystem/qualityTesting/statisticAnalysis/QCcollection/index'), //	质检汇总统计？？

  // WOpercentageComplete: () => import('@/views/currentSystem/qualityTesting/statisticAnalysis/QCcollection/index'), //	完成率统计111
  // WOTimeoutSummary: () => import('@/views/currentSystem/qualityTesting/statisticAnalysis/QCcollection/index'), //	超时统计111
  // WOSummary: () => import('@/views/currentSystem/qualityTesting/statisticAnalysis/QCcollection/index'), //	工单汇总统计111

  // // 制水成本
  // waterYieldBudget: () => import('@/views/zhpt/waterProductionCost/budgetCostManagement/waterYieldBudget/widget'), // 水量计划
  // totalProduceWaterPerCostBudget: () => import('@/views/zhpt/waterProductionCost/budgetCostManagement/totalProduceWaterPerCostBudget/widget'), // 制水单耗
  // totalProduceWaterIndexBudget: () => import('@/views/zhpt/waterProductionCost/budgetCostManagement/totalProduceWaterIndexBudget/widget'), // 制水指标
  // totalProduceWaterUnitPriceBudget: () => import('@/views/zhpt/waterProductionCost/budgetCostManagement/totalProduceWaterUnitPriceBudget/widget'), // 指标单价
  // totalProduceWaterPerChangeBudget: () => import('@/views/zhpt/waterProductionCost/budgetCostManagement/totalProduceWaterPerChangeBudget/widget'), // 制水单变
  // basicElectricityBill: () => import('@/views/zhpt/waterProductionCost/budgetCostManagement/basicElectricityBill/widget'), // 基本电费
  // produceWaterRealUsage: () => import('@/views/zhpt/waterProductionCost/realCostManagement/produceWaterRealUsage/widget'), // 制水指标
  // produceWaterRealUnitPrice: () => import('@/views/zhpt/waterProductionCost/realCostManagement/produceWaterRealUnitPrice/widget'), // 指标单价
  // produceWaterRealPerCost: () => import('@/views/zhpt/waterProductionCost/realCostManagement/produceWaterRealPerCost/widget'), // 制水单耗
  // produceWaterRealPerChange: () => import('@/views/zhpt/waterProductionCost/realCostManagement/produceWaterRealPerChange/widget'), // 制水单变
  // pressurizationStationIndicators: () => import('@/views/zhpt/waterProductionCost/realCostManagement/pressurizationStationIndicators/widget'), // 加压站指标
  // simulation: () => import('@/views/zhpt/waterProductionCost/realCostManagement/simulation/widget'), // 模拟纠偏
  // waterBudget: () => import('@/views/zhpt/waterProductionCost/historyDataQuery/waterBudget/widget'), // 水量计划值
  // waterRealValue: () => import('@/views/zhpt/waterProductionCost/historyDataQuery/waterRealValue/widget'), // 水量实际值
  // produceWaterMaterialBudget: () => import('@/views/zhpt/waterProductionCost/historyDataQuery/produceWaterMaterialBudget/widget'), // 制水材料计划值
  // produceWaterMaterialRealValue: () => import('@/views/zhpt/waterProductionCost/historyDataQuery/produceWaterMaterialRealValue/widget'), // 制水材料实际值
  // produceWaterCostBudget: () => import('@/views/zhpt/waterProductionCost/historyDataQuery/produceWaterCostBudget/widget'), // 制水成本计划值
  // produceWaterCostRealValue: () => import('@/views/zhpt/waterProductionCost/historyDataQuery/produceWaterCostRealValue/widget'), // 制水成本实际值
  // indexUnitPriceBudget: () => import('@/views/zhpt/waterProductionCost/historyDataQuery/indexUnitPriceBudget/widget'), // 指标单价计划值
  // indexUnitPriceRealValue: () => import('@/views/zhpt/waterProductionCost/historyDataQuery/indexUnitPriceRealValue/widget'), // 指标单价实际值
  // produceCostUnitPriceQuery: () => import('@/views/zhpt/waterProductionCost/historyDataCompare/produceCostUnitPriceQuery/widget'), // 生产成本单价
  // produceDataQuery: () => import('@/views/zhpt/waterProductionCost/historyDataCompare/produceDataQuery/widget'), // 生产数据查询
  // costDataQuery: () => import('@/views/zhpt/waterProductionCost/historyDataCompare/costDataQuery/widget'), // 成本数据查询
  // waterDataQuery: () => import('@/views/zhpt/waterProductionCost/dataTrendAnalysis/waterDataQuery/widget'), // 水量数据查询
  // electricityUsageQuery: () => import('@/views/zhpt/waterProductionCost/dataTrendAnalysis/electricityUsageQuery/widget'), // 用电量查询
  // materialPerCostQuery: () => import('@/views/zhpt/waterProductionCost/dataTrendAnalysis/materialPerCostQuery/widget'), // 材料单耗查询
  // produceWaterIndexQuery: () => import('@/views/zhpt/waterProductionCost/dataTrendAnalysis/produceWaterIndexQuery/widget'), // 制水指标查询
  // produceWaterIndexSupply: () => import('@/views/zhpt/waterProductionCost/dataTrendAnalysis/produceWaterIndexSupply/widget'), // 供售水量查询
  // produceWaterIndexNrw: () => import('@/views/zhpt/waterProductionCost/dataTrendAnalysis/produceWaterIndexNrw/widget'), // 产销差查询
  // produceWaterIndexLeakage: () => import('@/views/zhpt/waterProductionCost/dataTrendAnalysis/produceWaterIndexLeakage/widget'), // 漏损率查询
  // materialCost: () => import('@/views/zhpt/waterProductionCost/produceWaterUnitCost/materialCost/widget'), // 制水材料趋势图
  // electricityCost: () => import('@/views/zhpt/waterProductionCost/produceWaterUnitCost/electricityCost/widget'), // 电费成本趋势图
  // rawWaterCostUnit: () => import('@/views/zhpt/waterProductionCost/produceWaterUnitCost/rawWaterCostUnit/widget'), // 原水费趋势图
  // waterResouceTax: () => import('@/views/zhpt/waterProductionCost/produceWaterUnitCost/waterResouceTax/widget'), // 水资源税费趋势图
  // unitCostPie: () => import('@/views/zhpt/waterProductionCost/produceWaterUnitCost/unitCostPie/widget'), // 单位成本饼图
  // materialCostPie: () => import('@/views/zhpt/waterProductionCost/produceWaterUnitCost/materialCostPie/widget'), // 材料成本饼图
  // annualSupply: () => import('@/views/zhpt/waterProductionCost/waterCompanySupply/annual/widget'), // 年度供水量
  // quarterlySupply: () => import('@/views/zhpt/waterProductionCost/waterCompanySupply/quarterly/widget'), // 季度供水量
  // monthlySupply: () => import('@/views/zhpt/waterProductionCost/waterCompanySupply/monthly/widget'), // 月度供水量
  // produceMaterial: () => import('@/views/zhpt/waterProductionCost/monthlyTimelyBudget/produceMaterial/widget'), // 制水材料
  // costCalculate: () => import('@/views/zhpt/waterProductionCost/monthlyTimelyBudget/costCalculate/widget'), // 成本核算

  // // 在线水力模型
  // forecast: () => import('@/views/currentSystem/onlineHydrualicsModel'),	// 在线预测
  // smartScheduling: () => import('@/views/currentSystem/onlineHydrualicsModel'),	// 智能调度
  // schedulingPlan: () => import('@/views/currentSystem/onlineHydrualicsModel'),	// 调度预案
  // planEvaluation: () => import('@/views/currentSystem/onlineHydrualicsModel'),	// 规划评估
  // pipeFlushing: () => import('@/views/currentSystem/onlineHydrualicsModel'),	// 管道冲洗
  // riskAssessment: () => import('@/views/currentSystem/onlineHydrualicsModel'),	// 风险评估
  // hydrualicsSysSetting: () => import('@/views/currentSystem/onlineHydrualicsModel')	// 系统设置
}
