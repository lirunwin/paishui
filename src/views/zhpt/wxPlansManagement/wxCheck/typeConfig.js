export const typeConfig = {
    '00': 'xjYear',
    '01': 'xjMonth',
    '02': 'yhSend',
    '03': 'yhClear',
    '04': 'gdSend',
    '05': 'gdClear',
    '08': 'wxPlanYear',
    '11':"wxYear",
    '10': 'wxDay',
    "07":'planCancle',
    "06":"planStop"
}
// export const typeConfig = [
//     { // 00
//         id: '00',
//         name: '巡检年计划',   //审核任务类型名称  B
//         infoDiv: 'xjYear',  //审核详情 div  B
//         cheakDiv: 'xjYearCheak',    //审核界面 div  B
//         url: '/gps/planyear/page?&issubmit=1',    //记录请求url   B
//         cheakUserField: 'auditUser',    // 审核人字段 B
//         cheakField: 'auditResult',  // 审核意见字段 B
//         cheakNoResult: '未审批',    //未审批 检查属性   B
//         column: [   //表格显示字段  B
//             { value: 'year', label: '年份'},
//             { value: 'submitTime', label: '上报时间'},
//             { value: 'auditResult', label: '审核意见'},
//             { value: 'auditNotes', label: '审核说明'},
//             { value: 'audittime', label: '审核时间'},
//         ],
//         hideColumn: [// 表格不显示字段
//             { value: 'id' },
//             { value: 'auditUser' },
//         ],
//         infoFuntion: 'XjYearsPlanload',// 详情加载 方法     B
//         cacheFuntion: 'XjYearsPlanloadCache',// 审核其他内容提前加载 方法
//         updateFuntion: 'XjYearsPlancheak'// 审核提交 方法   B
//     },
//     { // 01
//         id: '01',
//         name: '巡检月计划',   //审核任务类型名称  B
//         infoDiv: 'xjMonth',  //审核详情 div  B
//         cheakDiv: 'xjMonthCheak',    //审核界面 div  B
//         url: '/gps/planmouth/page?&issubmit=1',    //记录请求url   B
//         cheakUserField: 'auditUser',    // 审核人字段 B
//         cheakField: 'auditResult',  // 审核意见字段 B
//         cheakNoResult: '未审批',    //未审批 检查属性   B
//         column: [   //表格显示字段  B
//             { value: 'year', label: '年份'},
//             { value: 'mouth', label: '月份'},
//             { value: 'submitTime', label: '上报时间'},
//             { value: 'auditResult', label: '审核意见'},
//             { value: 'auditNotes', label: '审核说明'},
//             { value: 'audittime', label: '审核时间'},
//         ],
//         hideColumn: [// 表格不显示字段
//             { value: 'id' },
//             { value: 'auditUser' },
//         ],
//         infoFuntion: 'XjMonthsPlanload',// 详情加载 方法     B
//         cacheFuntion: 'XjMonthsPlanloadCache',// 审核其他内容提前加载 方法
//         updateFuntion: 'XjMonthsPlancheak'// 审核提交 方法   B
//     },
//     { // 06 
//         id: '06',   //审核对应Id B
//         name: '巡检任务暂停审核',   //审核任务类型名称  B
//         infoDiv: 'xjPause',  //审核详情 div  B
//         cheakDiv: 'xjPauseCheak',    //审核界面 div  B
//         url: '/gps/planStop/page?&issubmit=1',    //记录请求url   B
//         cheakUserField: 'auditUser',    // 审核人字段 B
//         cheakField: 'auditResult',  // 审核意见字段 B
//         cheakNoResult: '0',    //未审批 检查属性   B
//         column: [   //表格显示字段  B
//             { value: 'id', label: 'ID' },
//             { value: 'applyStarttime', label: '任务开始时间'},
//             { value: 'applyEndtime', label: '任务结束时间'},
//             { value: 'applyNote', label: '申请说明'},
//             { value: 'auditResult', label: '审核意见'},
//             { value: 'auditNotes', label: '审核说明'},
//             { value: 'audittime', label: '审核时间'},
//         ],
//         hideColumn: [// 表格不显示字段
//             // { value: 'id' },
//             { value: 'auditUser' },
//         ],
//         infoFuntion: 'XjPausePlanload',// 详情加载 方法     B
//         cacheFuntion: 'XjPausePlanloadCache',// 审核其他内容提前加载 方法
//         updateFuntion: 'XjPausePlancheak'// 审核提交 方法   B
//     },
//     { // 07 
//         id: '07',   //审核对应Id B
//         name: '巡检任务作废审核',   //审核任务类型名称  B
//         infoDiv: 'xjOver',  //审核详情 div  B
//         cheakDiv: 'xjOverCheak',    //审核界面 div  B
//         url: '/gps/planCancle/page?&issubmit=1',    //记录请求url   B
//         cheakUserField: 'auditUser',    // 审核人字段 B
//         cheakField: 'auditResult',  // 审核意见字段 B
//         cheakNoResult: '0',    //未审批 检查属性   B
//         column: [   //表格显示字段  B
//             { value: 'id', label: 'ID' },
//             { value: 'applyStarttime', label: '任务开始时间'},
//             { value: 'applyEndtime', label: '任务结束时间'},
//             { value: 'applyNote', label: '申请说明'},
//             { value: 'auditResult', label: '审核意见'},
//             { value: 'auditNotes', label: '审核说明'},
//             { value: 'audittime', label: '审核时间'},
//         ],
//         hideColumn: [// 表格不显示字段
//             // { value: 'id' },
//             { value: 'auditUser' },
//         ],
//         infoFuntion: 'XjOverPlanload',// 详情加载 方法     B
//         cacheFuntion: 'XjOverPlanloadCache',// 审核其他内容提前加载 方法
//         updateFuntion: 'XjOverPlancheak'// 审核提交 方法   B
//     },
//     { // 08 B 必须 
//         id: '08',   //审核对应Id B
//         name: '抢维修年计划',   //审核任务类型名称  B
//         infoDiv: 'wxYear',  //审核详情 div  B
//         cheakDiv: 'wxYearCheak',    //审核界面 div  B
//         url: '/gps/repairplan/page?&issubmit=1',    //记录请求url   B
//         cheakUserField: 'auditUser',    // 审核人字段 B
//         cheakField: 'auditResult',  // 审核意见字段 B
//         cheakNoResult: '未审批',    //未审批 检查属性   B
//         column: [   //表格显示字段  B
//             { value: 'year', label: '年份'},
//             { value: 'submitTime', label: '上报时间'},
//             { value: 'auditResult', label: '审核意见'},
//             { value: 'auditNotes', label: '审核说明'},
//             { value: 'audittime', label: '审核时间'},
//         ],
//         hideColumn: [// 表格不显示字段
//             { value: 'id' },
//             { value: 'auditUser' },
//         ],
//         infoFuntion: 'WxYearsPlanload',// 详情加载 方法     B
//         cacheFuntion: 'WxYearsPlanloadCache',// 审核其他内容提前加载 方法
//         updateFuntion: 'WxYearsPlancheak'// 审核提交 方法   B
//     },
//     { // 10 
//         id: '10',   //审核对应Id B
//         name: '抢维修完成工单',   //审核任务类型名称  B
//         infoDiv: 'wxOver',  //审核详情 div  B
//         cheakDiv: 'wxOverCheak',    //审核界面 div  B
//         url: '/gps/repairrecord/page?&issubmit=1',    //记录请求url   B
//         cheakUserField: 'auditUser',    // 审核人字段 B
//         cheakField: 'auditResult',  // 审核意见字段 B
//         cheakNoResult: '未审批',    //未审批 检查属性   B
//         column: [   //表格显示字段  B
//             { value: 'address', label: '地址描述'},
//             { value: 'bore', label: '口径'},
//             { value: 'notes', label: '情况说明'},
//             { value: 'submitTime', label: '上报时间'},
//             { value: 'submitUserName', label: '上报人'},
//             { value: 'auditResult', label: '审核意见'},
//             { value: 'auditNotes', label: '审核说明'},
//             { value: 'audittime', label: '审核时间'},
//         ],
//         hideColumn: [// 表格不显示字段
//             { value: 'id' },
//             { value: 'repairUserid' },
//             { value: 'auditUser' },
//         ],
//         infoFuntion: 'WxOverPlanload',// 详情加载 方法     B
//         cacheFuntion: 'WxOverPlanloadCache',// 审核其他内容提前加载 方法
//         updateFuntion: 'WxOverPlancheak'// 审核提交 方法   B
//     },
// ]