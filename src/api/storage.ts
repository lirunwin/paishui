import request from '@/utils/request'
// 水表编号查询
export function queryList(data) {
  return request({
    url: '/meter/sbmanager?sbbh=' + data,
    method: 'get'
    // data
  })
}
export function queryJBList(data) {
  return request({
    url: '/meter/sbmanager/hbGetOldInfo?sbbh=' + data,
    method: 'get'
    // data
  })
}
// 入库流水编号查询
export function queryIDList(data) {
  return request({
    url: '/meter/sbmanager/getbylsbh?lsbh=' + data.lsbh + '&current=' + data.current + '&size=' + data.size,
    method: 'get'
    // data
  })
}
// 新增入库
export function putStockList(data) {
  return request({
    url: '/meter/sbmanager/rk',
    method: 'post',
    data
  })
}
// 入库记录查询
export function getRecordList(params, download) {
  return request({
    url: '/meter/sbmanager/rk',
    method: 'get',
    params,
    responseType: download === true ? 'arraybuffer' : 'json'
  })
}
// 入库记录ID查询
// export function getRecordID(id) {
//   return request({
//     url: '/giswjl/sbrecord/' + id,
//     method: 'get'
//     // data
//   })
// }

// 库存分页查询
export function getDeliveryList(data) {
  return request({
    url: '/meter/sbmanager/sbkc?current=' + data.current + '&size=' + data.size + '&sbkj=' + data.search + '&sblx=' + data.sblx + '&sbcj=' + data.sbcj,
    method: 'get',
    data
  })
}

// 出库

export function postDeliveryList(data) {
  return request({
    url: '/meter/sbmanager/ck',
    method: 'post',
    data
  })
}
// 首检分页查询
export function getfirstList(data) {
  return request({
    url: '/meter/sbmanager/sbsj?current=' + data.current + '&size=' + data.size + '&bwSbkj=' + data.search + '&bwSblx=' + data.sblx + '&bwSbcj=' + data.sbcj + '&isState=' + data.isState,
    method: 'get',
    data
  })
}

// 首检录入
export function postfirstList(data) {
  return request({
    url: '/meter/sbmanager/sbsj',
    method: 'post',
    data
  })
}
// 水表新装查询
export function getinstallList(params, download) {
  return request({
    url: '/meter/sbmanager/azsb',
    method: 'get',
    params,
    responseType: download === true ? 'arraybuffer' : 'json'
  })
}
// 单个水表安装
export function postinstall(data) {
  return request({
    url: '/meter/sbmanager/azsb',
    method: 'post',
    data
  })
}
// 安装过水表删除
export function deleteinstallList(params) {
  return request({
    url: `/meter/sbmanager/deleteAz/${params.id}`,
    method: 'delete'
  })
}
// 水表批量安装添加
export function postinstallList(data) {
  return request({
    url: '/meter/sbmanager/batchImport',
    method: 'post',
    data
  })
}

// 水表批量入库（新）
export function postRKList(data) {
  return request({
    url: '/meter/sbmanager/saveTwo',
    method: 'post',
    data
  })
}
// 水表批量出库（新）
export function postCKlList(data) {
  return request({
    url: '/meter/sbmanager/ckTwo',
    method: 'post',
    data
  })
}

// 水表换表分页查询
export function getchangeList(params, download) {
  return request({
    url: '/meter/sbmanager/exchange',
    method: 'get',
    params,
    responseType: download === true ? 'arraybuffer' : 'json'
  })
}

// 水表换表新增
export function postchangeList(data) {
  return request({
    url: '/meter/sbmanager/exchange',
    method: 'post',
    data
  })
}
// 水表换表修改
export function putchangeList(data) {
  return request({
    url: '/meter/sbmanager/exchange',
    method: 'put',
    data
  })
}

// 水表移交 ！
// 移交分页查询
export function gettransferList(data) {
  return request({
    url: '/meter/sbmanager/turnover?current=' + data.current + '&size=' + data.size + '&bwSbcj=' + data.sbcj + '&bwSblx=' + data.sblx + '&bwSbkj=' + data.search,
    method: 'get',
    data
  })
}
// 新增移交
// export function posttransferList(data) {
//   return request({
//     url: '/meter/sbmanager/turnover',
//     method: 'post',
//     data
//   })
// }

// 新增移交（新）
export function posttransferList(data) {
  return request({
    url: '/meter/sbmanager/turnoverThree',
    method: 'post',
    data
  })
}
// 移交（退库）
export function posttransferListFour(data) {
  return request({
    url: '/meter/sbmanager/turnoverFour',
    method: 'post',
    data
  })
}
// 争议检定

// 争议检定查询
export function getdisputeList(data) {
  return request({
    url: '/meter/sbcheck/dispute?current=' + data.current + '&size=' + data.size,
    method: 'get',
    data
  })
}
// 争议检定删除
export function getdeleteList(data) {
  return request({
    url: '/meter/sbcheck/dispute/' + data,
    method: 'delete',
    data
  })
}
// 争议检定添加
export function adddisputeList(data) {
  return request({
    url: '/meter/sbcheck/dispute',
    method: 'put',
    data,
    file: true
  })
}

// 首检比例
export function getproportionList(data) {
  return request({
    url: '/meter/sbcheck/sjconfig?current=' + data.current + '&size=' + data.size + '&sbkj=' + data.sbkj,
    method: 'get',
    data
  })
}
// 首检比例新增
export function postproportionList(data) {
  return request({
    url: '/meter/sbcheck/sjconfig',
    method: 'post',
    data
  })
}
// 首检比例修改
export function putproportionList(data) {
  return request({
    url: '/meter/sbcheck/sjupdate',
    method: 'post',
    data
  })
}

// 厂家新增
export function postproportionLists(data) {
  return request({
    url: '/base/syscommoncode',
    method: 'post',
    data
  })
}
// 厂家修改
export function putproportionLists(data) {
  return request({
    url: '/base/syscommoncode',
    method: 'put',
    data
  })
}
// 水表抽检

// 周检表分页查询
export function getinspectionList(data) {
  return request({
    url: '/meter/sbcheck/spotcheck?current=' + data.current + '&size=' + data.size + '&inputContent=' + data.sbbh,
    method: 'get',
    data
  })
}
// 周检表新增
export function postinspectionList(data) {
  return request({
    url: '/meter/sbcheck/spotcheck',
    method: 'post',
    data
  })
}
// 故障表抽检
export function getfaultList(data) {
  return request({
    url: '/meter/sbcheck/excreterecord?current=' + data.current + '&size=' + data.size + '&inputContent=' + data.sbbh,
    method: 'get',
    data
  })
}

// 故障表抽检新增
export function postfaultList(data) {
  return request({
    url: '/meter/sbcheck/excreterecord',
    method: 'post',
    data
  })
}
// 周检计划

export function getWeeklyList(data) {
  return request({
    url: '/meter/sbPlan/getPlan?current=' + data.current + '&size=' + data.size + '&month=' + data.time,
    method: 'get',
    data
  })
}

// 周检计划详情
export function getWeeklyListinfo(data, page) {
  return request({
    url: '/meter/sbPlan/getPlanInfo?month=' + data + '&current=' + page.current + '&size=' + page.size + '&sbcj=' + page.sbcj + '&sblx=' + page.sblx + '&sbkj=' + page.search,
    method: 'get',
    data
  })
}
// 表位资料根据水表编号查询

export function getmapList(data) {
  return request({
    url: '/meter/location/getBySbbh',
    method: 'get',
    data
  })
}

// 统计
// 报废统计
export function getscrappList(data) {
  return request({
    url: '/meter/statistic/scrap?current=' + data.current + '&size=' + data.size + '&sbcj=' + data.sbcj + '&sblx=' + data.sbxh + '&sbkj=' + data.sbkj + '&startTime=' + data.startTime + '&endTime=' + data.endTime,
    method: 'get',
    data
  })
}
export function getscrappListinfo(data, paginationson) {
  return request({
    url: '/meter/statistic/scrapInfo?bwSbcj=' + data.cjId + '&bwSbkj=' + data.kjId + '&bwSblx=' + data.lxId + '&current=' + paginationson.current + '&size=' + paginationson.size,
    method: 'get',
    data
  })
}

// 新装
export function getmountList(data) {
  return request({
    url: '/meter/statistic/getInstall?current=' + data.current + '&size=' + data.size + '&sbcj=' + data.sbcj + '&sblx=' + data.sbxh + '&sbkj=' + data.sbkj + '&startTime=' + data.startTime + '&endTime=' + data.endTime,
    method: 'get',
    data
  })
}
// 新装详情
export function getmountListinfo(data, paginationson) {
  return request({
    url: '/meter/statistic/getInstallInfo?bwSbcj=' + data.cjId + '&bwSbkj=' + data.kjId + '&bwSblx=' + data.lxId + '&current=' + paginationson.current + '&size=' + paginationson.size,
    method: 'get',
    data
  })
}

// 出库水表
export function getsummaryList(data) {
  return request({
    url: '/meter/statistic/getCkSb?current=' + data.current + '&size=' + data.size + '&sbcj=' + data.sbcj + '&sblx=' + data.sbxh + '&sbkj=' + data.sbkj + '&startTime=' + data.startTime + '&endTime=' + data.endTime,
    method: 'get',
    data
  })
}
// 出库水表详情
export function getsummaryListinfo(data, paginationson) {
  return request({
    url: '/meter/statistic/getCkSbInfo?bwSbkj=' + data.kjId + '&bwSblx=' + data.lxId + '&bwSbcj=' + data.cjId + '&current=' + paginationson.current + '&size=' + paginationson.size,
    method: 'get',
    data
  })
}

// 换表
export function getChangeList(params, download) {
  return request({
    url: '/meter/statistic/getHb',
    method: 'get',
    params,
    responseType: download === true ? 'arraybuffer' : 'json'
  })
}
// 换表详情
export function getChangeListinfo(data, paginationson) {
  return request({
    url: '/meter/statistic/getHbInfo?bwSbcj=' + data.cjId + '&bwSbkj=' + data.kjId + '&bwSblx=' + data.lxId + '&current=' + paginationson.current + '&size=' + paginationson.size,
    method: 'get',
    data
  })
}

// 获取图片地址

export function getimginfo(data) {
  return request({
    url: '/tofly-base/file/loadImg?remotePath=' + data,
    method: 'get',
    data
  })
}

// 编码表
export function getBMinfo(data) {
  return request({
    url: '/base/syscommoncode/all',
    method: 'get',
    data
  })
}
// 获取父级编码表

export function getFABMinfo(data) {
  return request({
    url: '/base/syscommoncode/fj',
    method: 'get',
    data
  })
}

// 获取子级编码表

export function getSONBMinfo(data) {
  return request({
    url: '/base/syscommoncode/getByfjId?pCid=' + data,
    method: 'get'
  })
}
// 根据水表编号查询位置

export function getSblocation(data) {
  return request({
    url: '/meter/location/getBySbbh?sbbh=' + data,
    method: 'get'
  })
}
// 客户编号查询

export function getuserinfo(data) {
  return request({
    url: '/meter/qfkhjbxx/page?yhbh=' + data,
    method: 'get'
  })
}

// 获取用户基本信息

export function getusernameinfo(data) {
  return request({
    url: '/base/user/getInfo',
    method: 'get'
  })
}

// 部门编码

export function getdeptinfo(data) {
  return request({
    url: 'meter/dept/getAll',
    method: 'get'
  })
}

// 根据部门获取人员

export function getdeptuserinfo(data) {
  return request({
    url: '/meter/dept/getUserByDepts?depts=' + data,
    method: 'get'
  })
}

// 库存统计

export function getALLsbinfo(data) {
  return request({
    url: '/meter/statistic/getAllSb?current=' + data.current + '&size=' + data.size + '&sbkj=' + data.sbkj + '&sblx=' + data.sbxh + '&sbcj=' + data.sbcj,
    method: 'get'
  })
}

// 库存详情

export function getALLsbinfoList(params) {
  return request({
    url: '/meter/statistic/getAllSb',
    method: 'get',
    params
  })
}

// 周检数据导出

export function getExcel(data) {
  return request({
    url: '/meter/sbPlan/getExcel?dto=' + data + '&templateFlag=1&templateServiceType=sbPlanService',
    method: 'get'
  })
}
export function getchangeGDInfo(data) {
  return request({
    url: '/mis/gdglinfo/waterMeterConversion?current=' + data.current + '&size=' + data.size + '&id=' + data.id + '&gdbh=' + data.gdbh,
    method: 'get'
  })
}
export function getCKGDInfo(params) {
  return request({
    url: '/mis/gdglinfo/waterMeterConversion',
    method: 'get',
    params
  })
}
export function getZYGDInfo(data) {
  return request({
    url: '/mis/gdglinfo/waterMeterConversion?current=' + data.current + '&size=' + data.size + '&id=' + data.id + '&gdbh=' + data.gdbh,
    method: 'get'
  })
}

// 查看争议检定统计

export function getZYJDInfo(params, download) {
  return request({
    url: '/meter/statistic/getAllZySb',
    method: 'get',
    params,
    responseType: download === true ? 'arraybuffer' : 'json'
  })
}
export function getZYJDListinfo(data, paginationson) {
  return request({
    url: '/meter/statistic/getZySbInfo?bwSbcj=' + data.cjId + '&bwSbkj=' + data.kjId + '&bwSblx=' + data.lxId + '&current=' + paginationson.current + '&size=' + paginationson.size,
    method: 'get',
    data
  })
}
// 表位资料
export function getBYZIlist(params, download) {
  return request({
    url: '/meter/statistic/getMeterFlow',
    method: 'get',
    params,
    responseType: download === true ? 'arraybuffer' : 'json'
  })
}
// 表位资料详情
export function getBWlist(data) {
  return request({
    url: '/meter/statistic/getFlowDetails?sbzt=' + data.sbzt + '&sbbh=' + data.sbbh,
    method: 'get',
    data
  })
}
// 模糊查询用户名

export function getusernamelist(data) {
  return request({
    url: '/base/user/getUserInformatiomByLikeName?name=' + data,
    method: 'get',
    data
  })
}

// 出库查询水表前缀

export function getSbqz(data) {
  return request({
    url: '/meter/sbmanager/ckPrefix',
    method: 'post',
    data
  })
}
// 周检表、抽检表详情
export function getJZxq(params) {
  return request({
    url: '/meter/sbmanager/getZjOrGz',
    method: 'get',
    params
  })
}

// 根据当前用户获取本部门人员

export function getBMuser(data) {
  return request({
    url: '/base/user/getDepartmentUser',
    method: 'get',
    data
  })
}

// 统计图

export function getState(data) {
  return request({
    url: '/meter/statistic/getCjSta?queryState=' + data,
    method: 'get',
    data
  })
}

// 水表使用情况

export function getUsageWaterList(data) {
  return request({
    url: '/meter/statistic/getSyDate?current=' + data.current + '&size=' + data.size + '&sbkj=' + data.bwSbkj + '&sblx=' + data.bwSblx + '&sbcj=' + data.bwSbcj + '&syDate=' + data.syDate,
    method: 'get',
    data
  })
}

// 水表使用情况详情

export function getUsageWaterListDetails(params) {
  return request({
    url: '/meter/statistic/getSyDateDetails',
    method: 'get',
    params
  })
}
// 系统使用情况
export function getUsage(params) {
  return request({
    url: '/base/log/getOperationRecords',
    method: 'get',
    params
  })
}
// 系统使用情况下载
export function exportData(params) {
  return request({
    url: '/base/excel-dispose-info/exportData',
    method: 'get',
    params,
    responseType: 'arraybuffer'
  })
}
// 水表周期
export function getPlan(params, download) {
  return request({
    url: '/meter/sbPlan/getPlan',
    method: 'get',
    params,
    responseType: download === true ? 'arraybuffer' : 'json'
  })
}

// 批量删除首检比例
export function deleteBl(data) {
  return request({
    url: '/meter/sbcheck/sjdelete/' + data,
    method: 'delete',
    data
  })
}

// 周期规则配置
export function getPeriodic(params) {
  return request({
    url: '/meter/sbPlan/sbzqQuery',
    method: 'get',
    params
  })
}

// 周期规则配置
export function postPeriodic(data) {
  return request({
    url: '/meter/sbPlan/sbzqConfig',
    method: 'post',
    data
  })
}

// 抽检比例
export function getCjblConfig(params) {
  return request({
    url: '/meter/sbcheck/getCjblConfig',
    method: 'get',
    params
  })
}

export function postCjblConfig(data) {
  return request({
    url: '/meter/sbcheck/updateCjblConfig',
    method: 'post',
    data
  })
}

// 查询用户
export function getuserName(params) {
  return request({
    url: '/base/user/pageNew',
    method: 'get',
    params
  })
}

// 2022-1-21水表入库接口

export function postSbwareHousing(data) {
  return request({
    url: '/tofly-xrtymeterch/wareHousing/wareHousing',
    method: 'post',
    data
  })
}

// 2022-1-21水表入库三层次第一层
export function getwareHousingFirst(params, download) {
  return request({
    url: '/tofly-xrtymeterch/wareHousing/count',
    method: 'get',
    params,
    responseType: download === 1 ? 'arraybuffer' : 'json'
  })
}

// 2022-1-21水表入库三层次第二层
export function getwareHousingSend(params, download) {
  return request({
    url: '/tofly-xrtymeterch/wareHousing/countByVendor',
    method: 'get',
    params,
    responseType: download === 1 ? 'arraybuffer' : 'json'
  })
}

// 2022-1-21水表入库三层次第三层
export function getwareHousingThird(params, download) {
  return request({
    url: '/tofly-xrtymeterch/wareHousing/countByCaliber',
    method: 'get',
    params,
    responseType: download === 1 ? 'arraybuffer' : 'json'
  })
}
