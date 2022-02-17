import request from '@/utils/request'

/**
  * 说明：
  * get和delete传值用params,
  * post和put传值用data
  */

// export function addScheduling(data) {
//   return request({
//     url: '/giswjl/gsrx/dutymanager',
//     method: 'post',
//     data
//   })
// }

// 获取客户信息
export function getLowPressureAnalysisInfos(data) {
  return request({
    url: '/gis/sxjDocking/send',
    method: 'post',
    data
  })
}
export function getSchedulingList(params) {
  return request({
    url: '/gis/dutyroster',
    method: 'get',
    params
  })
}
// 获取全部部门
export function getAllDepartment(params) {
  return request({
    url: `/meter/dept/getAll`,
    method: 'get',
    params
  })
}
// 获取人员
export function getUserAll(params) {
  return request({
    url: `/base/user/getUserpermissionsByDepatmentAndMune`,
    method: 'get',
    params
  })
}
// 获取知识库
export function getKnowledgeList(params) {
  return request({
    url: '/gis/gsrx/knowledge',
    method: 'get',
    params
  })
}
// 添加知识库
export function addKnowledge(data) {
  return request({
    url: '/gis/gsrx/knowledge',
    method: 'post',
    data
  })
}
// 删除知识库
export function delKnowledge(params) {
  return request({
    url: '/gis/gsrx/knowledge/' + params,
    method: 'delete',
    params
  })
}
// 修改知识库
export function editKnowledge(data) {
  return request({
    url: '/gis/gsrx/knowledge',
    method: 'put',
    data
  })
}
// 下载文件
export function getFilet(params) {
  return request({
    url: '/base/file/downloadFile',
    method: 'get',
    params
  })
}

// 删除文件
export function editFile(data) {
  return request({
    url: '/gis/gsrx/delKnowledgePic',
    method: 'put',
    data
  })
}

// 排班管理
export function getDate(data) {
  return request({
    url: '/gis/gsrx/dutymanager1',
    method: 'post',
    data
  })
}

// 获取当月所有排班
export function getPBmonth(data) {
  return request({
    url: '/gis/gsrx/dutyMonth',
    method: 'post',
    data
  })
}
// 新增修改排班
export function postPBmanager(data) {
  return request({
    url: '/gis/gsrx/dutymanager',
    method: 'post',
    data
  })
}
// 获取交班管理信息
export function getJBlist(data) {
  return request({
    url: '/gis/gsrx/handOver?current=' + data.current + '&size=' + data.size + '&startTime=' + data.startTime + '&endTime=' + data.endTime,
    method: 'get',
    data
  })
}
// 上传交班管理信息
export function departmentUploading(data) {
  return request({
    url: '/gis/gsrx/importdutymanager',
    method: 'post',
    data
  })
}
export function getJBlistEx(params) {
  return request({
    url: '/gis/gsrx/handOver',
    method: 'get',
    params,
    responseType: 'arraybuffer'
  })
}
// 填写交班管理信息
export function postJBlist(data) {
  return request({
    url: '/gis/gsrx/handOver',
    method: 'post',
    data
  })
}

// 接收拒绝接班
export function putJBlist(data) {
  return request({
    url: '/gis/gsrx/updateHandOver',
    method: 'post',
    data
  })
}

// 查看通话记录

export function getMails(data) {
  return request({
    url: '/tofly-xrtycallcenter/pltcall/record?empcode=' + data.empcode + '&current=' + data.current + '&size=' + data.size + '&telephone=' + data.telephone,
    method: 'get',
    data
  })
}
// 查询来电记录
export function getMail(data) {
  return request({
    url: '/tofly-xrtycallcenter/pltcall/record?telephone=' + data.telephone + '&current=' + data.current + '&size=' + data.size + '&callType=1' + '&empcode=' + data.empcode,
    method: 'get',
    data
  })
}
// 查询未接来电
export function getMailNot(data) {
  return request({
    url: '/tofly-xrtycallcenter/pltcall/record?telephone=' + data.telephone + '&current=' + data.current + '&size=' + data.size + '&callState=2' + '&empcode=' + data.empcode,
    method: 'get',
    data
  })
}
// 查询电话号码
export function getUserPhone(params) {
  return request({
    url: '/gis/newHotline/getContactsInfo',
    method: 'get',
    params
  })
}
// 查询电话号码
export function getUserPhoneZY(params) {
  return request({
    url: '/gis/newHotline/callShiftQuery',
    method: 'get',
    params
  })
}
// 查询今日话务流量
export function getFlowday(params) {
  return request({
    url: '/tofly-xrtycallcenter/statis/getTodayFlow    ',
    method: 'get',
    params
  })
}
// 录音质检查询通话记录
export function getLYMail(data) {
  return request({
    url: '/tofly-xrtycallcenter/pltcall/record?empcode=' + data.empcode + '&current=' + data.current + '&size=' + data.size + '&callType=' + data.callType + '&isQuerySatis=1&startTime=' + data.startTime + '&endTime=' + data.endTime,
    method: 'get',
    data
  })
}
// 查看流量预警
export function getWaring(data) {
  return request({
    url: '/tofly-xrtycallcenter/pltcall/waring',
    method: 'get',
    data
  })
}
// 查询内部通讯
export function getPhone(data) {
  return request({
    url: '/gis/note/addressBook?deptId=' + data.deptId + '&inputContent=' + data.inputContent + '&size=' + data.size + '&current=' + data.current,
    method: 'get',
    data
  })
}
// 查询内部通讯(工作台)
export function getPhones(params) {
  return request({
    url: '/gis/note/addressBook',
    method: 'get',
    params
  })
}
// 修改内部通讯
export function postPhone(data) {
  return request({
    url: '/gis/note/addressBook',
    method: 'post',
    data
  })
}
// 终止工单
export function closeWorkOrder(data) {
  return request({
    url: '/mis/gdglinfo/updateById',
    method: 'put',
    data
  })
}
// 完结工单分类
export function endClassify(data) {
  return request({
    url: '/mis/gdglinfo/gdgdfl',
    method: 'post',
    data
  })
}
// 应急记录
export function getEmer(params) {
  return request({
    url: '/gis/emergency/emer',
    method: 'get',
    params
  })
}
// 删除应急记录
export function deleteEmer(data) {
  return request({
    url: '/gis/emergency/emer1?ids=' + data.ids,
    method: 'get',
    data
  })
}

// 应急审核
export function audit(data) {
  return request({
    url: '/gis/emergency/audit',
    method: 'post',
    data
  })
}

// 问题模板
export function getProblem(data) {
  return request({
    url: '/gis/gsrx/problem?current=' + data.current + '&size=' + data.size + '&wtms=' + data.wtms + '&shbz=' + data.shbz,
    method: 'get',
    data
  })
}
// 新增问题模板
export function postProblem(data) {
  return request({
    url: '/gis/gsrx/problem',
    method: 'post',
    data
  })
}
// 问题审批
export function putProblem(data) {
  return request({
    url: '/gis/gsrx/problem',
    method: 'put',
    data
  })
}

// SMS短信模板

export function getTemplate(data) {
  return request({
    url: '/gis/note/noteTemplate?current=' + data.current + '&size=' + data.size + '&txmc=' + data.search,
    method: 'get',
    data
  })
}

// 新增短信模板
export function postTemplate(data) {
  return request({
    url: '/gis/note/noteTemplate',
    method: 'post',
    data
  })
}
// 修改
export function putTemplate(data) {
  return request({
    url: '/gis/note/noteTemplate',
    method: 'put',
    data
  })
}
// 坐席满意度
export function getSatisfaction(data) {
  return request({
    url: '/tofly-xrtycallcenter/pltcall/satisfaction?yearMonth=' + data,
    method: 'get',
    data
  })
}
// 评分模板查询
export function getGrade(data) {
  return request({
    url: '/gis/gsrx/getGradeTemplate',
    method: 'get',
    data
  })
}
// 评分模板修改
export function postGrade(data) {
  return request({
    url: '/gis/gsrx/gradeTemplate',
    method: 'post',
    data
  })
}

// 发送模板短信
export function postTempNote(data) {
  return request({
    url: '/gis/send/tempNote',
    method: 'post',
    data
  })
}

// 指定用户发短信
export function postNote(data) {
  return request({
    url: '/gis/send/note',
    method: 'post',
    data
  })
}

// 查看已发送短信
export function getNote(data) {
  return request({
    url: '/gis/send/getNote?startTime=' + data.startTime + '&endTime=' + data.endTime + '&state=' + data.state + '&inputContent=' + data.inputContent + '&current=' + data.current + '&size=' + data.size,
    method: 'get',
    data
  })
}

// 查看发送短信数量
export function getNoteNum(data) {
  return request({
    url: '/gis/send/getNoteNum',
    method: 'get',
    data
  })
}

// 删除排班人员
export function deletePbname(data) {
  return request({
    url: '/gis/gsrx/' + data,
    method: 'delete',
    data
  })
}

// 添加应急记录
export function postEme(data) {
  return request({
    url: '/gis/emergency/emer',
    method: 'post',
    data
  })
}
// 预警流量个数配置
export function editPreset(data) {
  return request({
    url: '/tofly-xrtycallcenter/record/configFlow',
    method: 'put',
    data
  })
}
// 录音评分新增
export function postrecord(data) {
  return request({
    url: '/gis/grade/addGrade',
    method: 'post',
    data
  })
}
// 录音评分听取

export function getlisten(data) {
  return request({
    url: '/tofly-xrtycallcenter/record/listen?connectionid=' + data,
    method: 'get',
    data
  })
}
// 回访工单查询

export function gethotlineGd(data) {
  return request({
    url: '/mis/gdglinfo/gdSpotCheck?bl=' + data.bl + '&startTime=' + data.startTime + '&endTime=' + data.endTime + '&current=' + data.current + '&size=' + data.size + '&isRxlx=' + data.isRxlx,
    method: 'get',
    data
  })
}

// 填写工单回访
export function postgdreturn(data) {
  return request({
    url: '/gis/grade/gdReturn',
    method: 'post',
    data
  })
}

// 工单回访统计
export function getreturntJ(data) {
  return request({
    url: '/gis/gsStatis/returnStatis',
    method: 'get',
    data
  })
}

// 填写工单质检
export function postgdGrade(data) {
  return request({
    url: '/gis/newHotline/theQuality',
    method: 'post',
    data
  })
}

// 录音质检统计
export function getQuality(params) {
  return request({
    url: '/gis/gsStatis/LyQuality',
    method: 'get',
    params
  })
}
// 工单质检统计
export function getGdQuality(params) {
  return request({
    url: '/gis/gsStatis/gdQuality',
    method: 'get',
    params
  })
}
// 工单回访统计
export function getGdReturn(params) {
  return request({
    url: '/gis/gsStatis/gdReturn',
    method: 'get',
    params
  })
}
// 坐席状态统计
export function getZXstate(params) {
  return request({
    url: '/tofly-xrtycallcenter/statis/stateStatis',
    method: 'get',
    params
  })
}
// 坐席话务统计
export function getZXtelephone(params) {
  return request({
    url: '/tofly-xrtycallcenter/statis/telephoneSta',
    method: 'get',
    params
  })
}
// 满意度统计
export function getZXfaction(params) {
  return request({
    url: '/tofly-xrtycallcenter/statis/satisfactionStatis',
    method: 'get',
    params
  })
}

// 短信重发

export function postDxCf(data) {
  return request({
    url: '/gis/send/aginSend',
    method: 'post',
    data
  })
}

// 工单详情
export function getGDOrderInfo(params, download) {
  return request({
    url: '/gis/newHotline/workOrderInfo',
    method: 'get',
    params,
    responseType: download === true ? 'arraybuffer' : 'json'
  })
}
// 回访工单详情
export function getHFOrderInfo(params, download) {
  return request({
    url: '/gis/newHotline/returnVisitInfo',
    method: 'get',
    params,
    responseType: download === true ? 'arraybuffer' : 'json'
  })
}

// 录音评分统计（新）
export function getLyNum(params) {
  return request({
    url: '/gis/newHotline/getRecordGrade',
    method: 'get',
    params
  })
}

// 录音详情/导出
export function getLyInfo(params, download) {
  return request({
    url: '/gis/newHotline/getRecordInfo',
    method: 'get',
    params,
    responseType: download === true ? 'arraybuffer' : 'json'
  })
}

// 回访工单详情
export function getHfzj(params) {
  return request({
    url: '/gis/newHotline/notTheQuality',
    method: 'get',
    params
  })
}

// 用户信息查询
export function getUserinfo(params) {
  return request({
    url: '/gis/newHotline/clientInfo',
    method: 'get',
    params
  })
}

// 故障类型查询
export function getGzlxpage(params) {
  return request({
    url: '/gis/rxyjbtbm/page',
    method: 'get',
    params
  })
}

// 故障类型修改、新增
export function postGzlxpage(data) {
  return request({
    url: '/gis/rxyjbtbm',
    method: 'post',
    data
  })
}
export function putGzlxpage(data) {
  return request({
    url: '/gis/rxyjbtbm',
    method: 'put',
    data
  })
}
// 故障类型删除
export function deleteGzlxpage(data) {
  return request({
    url: '/gis/rxyjbtbm/' + data,
    method: 'delete',
    data
  })
}

// 应急标题
export function getYjList(params) {
  return request({
    url: '/gis/rxyjbtbm/page',
    method: 'get',
    params
  })
}

// 问题回复
export function postproblemBack(data) {
  return request({
    url: '/gis/gsrx/replyProlem',
    method: 'post',
    data
  })
}
