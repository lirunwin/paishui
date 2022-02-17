import request from '@/utils/request'

// 厂家code
export function sbcj_list(params) {
  return request({
    url: '/tofly-xrtymis/bmsbcjgl/page',
    method: 'get',
    params
  })
}
export function sbcj_add(data) {
  return request({
    url: '/tofly-xrtymis/bmsbcjgl',
    method: 'post',
    data
  })
}
export function sbcj_edit(data) {
  return request({
    url: '/tofly-xrtymis/bmsbcjgl',
    method: 'put',
    data
  })
}
export function sbcj_delete(params) {
  return request({
    url: '/tofly-xrtymis/bmsbcjgl/deleteByIds',
    method: 'delete',
    params
  })
}
// 水表类型
export function sblx_list(params) {
  return request({
    url: '/tofly-xrtymis/bmsblx/page',
    method: 'get',
    params
  })
}
export function sblx_add(data) {
  return request({
    url: '/tofly-xrtymis/bmsblx',
    method: 'post',
    data
  })
}
export function sblx_edit(data) {
  return request({
    url: '/tofly-xrtymis/bmsblx',
    method: 'put',
    data
  })
}
export function sblx_delete(params) {
  return request({
    url: '/tofly-xrtymis/bmsblx/deleteByIds',
    method: 'delete',
    params
  })
}
// 水表型号
export function sbxh_list(params) {
  return request({
    url: '/tofly-xrtymis/bmsbxh/page',
    method: 'get',
    params
  })
}
export function sbxh_add(data) {
  return request({
    url: '/tofly-xrtymis/bmsbxh',
    method: 'post',
    data
  })
}
export function sbxh_edit(data) {
  return request({
    url: '/tofly-xrtymis/bmsbxh',
    method: 'put',
    data
  })
}
export function sbxh_delete(params) {
  return request({
    url: '/tofly-xrtymis/bmsbxh/deleteByIds',
    method: 'delete',
    params
  })
}
// 定检计划
export function djjh_list(params) {
  return request({
    url: '/tofly-xrtymis/custombgwldjjh/page',
    method: 'get',
    params
  })
}

// 储存仓库
export function ccck_list(params) {
  return request({
    url: '/tofly-xrtymis/bmck/page',
    method: 'get',
    params
  })
}
export function ccck_add(data) {
  return request({
    url: '/tofly-xrtymis/bmck',
    method: 'post',
    data
  })
}
export function ccck_edit(data) {
  return request({
    url: '/tofly-xrtymis/bmck',
    method: 'put',
    data
  })
}
export function ccck_delete(params) {
  return request({
    url: '/tofly-xrtymis/bmck/deleteByIds',
    method: 'delete',
    params
  })
}

// 入库
export function ckrk_list(params) {
  return request({
    url: '/tofly-xrtymis/customsbzc/selectsbzcdetail',
    method: 'get',
    params
  })
}
export function ckrk_delete(params) {
  return request({
    url: '/tofly-xrtymis/bwglsbzc/deleteByIds',
    method: 'delete',
    params
  })
}
export function ckrk_add(data) {
  return request({
    url: '/tofly-xrtymis/bwglsbzc/sbzcinsert',
    method: 'post',
    data
  })
}
export function ckrk_edit(data) {
  return request({
    url: '/tofly-xrtymis/bwglsbzc',
    method: 'put',
    data
  })
}
// 水表出库
export function rkrk_list(params) {
  return request({
    url: '/tofly-xrtymis/bwglckqd/page',
    method: 'get',
    params
  })
}
export function sbck_add(data) {
  return request({
    url: '/tofly-xrtymis/bwglsbzc/updatesbck',
    method: 'post',
    data
  })
}
// 出库清单列表
export function ckqd_list(params) {
  return request({
    url: '/tofly-xrtymis/bwglsbzc/selectsbckbyids',
    method: 'get',
    params
  })
}
export function ckqd_details(params) {
  return request({
    url: '/tofly-xrtymis/sbinstallabout/qddetails',
    method: 'get',
    params
  })
}
// 删除出库清单
export function ckqd_delete(params) {
  return request({
    url: '/tofly-xrtymis/other/delete',
    method: 'delete',
    params
  })
}
// 水表安装
export function sbaz_add(data) {
  return request({
    url: '/tofly-xrtymis/sbinstallabout/sbinstall',
    method: 'post',
    data
  })
}
// 撤销安装
export function sbaz_delete(params) {
  return request({
    url: '/tofly-xrtymis/sbinstallabout/revokeinstall',
    method: 'delete',
    params
  })
}
// 安装列表
export function sbaz_list(params) {
  return request({
    url: '/tofly-xrtymis/custombwglbwgl/selectall',
    method: 'get',
    params
  })
}
// 客户信息
export function yhxx_list(params) {
  return request({
    url: '/tofly-xrtymis/gdglyhxx/page',
    method: 'get',
    params
  })
}
// 水表更换
export function sbaz_edit(data) {
  return request({
    url: '/tofly-xrtymis/sbinstallabout/sbreplace',
    method: 'post',
    data
  })
}
// 换表列表
export function hblb_list(params) {
  return request({
    url: '/tofly-xrtymis/custombwglhb/page',
    method: 'get',
    params
  })
}

// 水表验收
export function sbys_add(data) {
  return request({
    url: '/tofly-xrtymis/sbinstallabout/bwglsbys',
    method: 'post',
    data
  })
}
// 水表报废
export function sbbf_add(data) {
  return request({
    url: '/tofly-xrtymis/bwglsbzc/updatesbbf',
    method: 'post',
    data
  })
}

// 水表位置修改
export function bwgl_edit(data) {
  return request({
    url: '/tofly-xrtymis/custombwglbwgl/updateBw',
    method: 'put',
    data
  })
}
// 水表位置列表
export function sbwzmx_list(params) {
  return request({
    url: '/tofly-xrtymis/custombwglbwgl/page',
    method: 'get',
    params
  })
}
// 水表位置明细列表
export function sbwzmx_id(params) {
  return request({
    url: '/tofly-xrtymis/custombwglbwgl/address/' + params,
    method: 'get'
  })
}
// 生成周期
export function cbzq_list(params) {
  return request({
    url: '/tofly-xrtymis/bmcbzq/page',
    method: 'get',
    params
  })
}
export function cbzq_delete(params) {
  return request({
    url: '/tofly-xrtymis/bmcbzq/deleteByIds',
    method: 'delete',
    params
  })
}
export function cbzq_add(data) {
  return request({
    url: '/tofly-xrtymis/bmcbzq',
    method: 'post',
    data
  })
}
export function cbzq_edit(data) {
  return request({
    url: '/tofly-xrtymis/bmcbzq',
    method: 'put',
    data
  })
}
// 周期定检生成  生成计划名字
export function plan_add(data) {
  return request({
    url: '/tofly-xrtymis/custombgwldjjh/addPlan',
    method: 'post',
    data
  })
}
// 删除计划
export function plan_delete(params) {
  return request({
    url: '/tofly-xrtymis/custombgwldjjh/' + params,
    method: 'delete'
  })
}

// 添加客户
export function user_add(data) {
  return request({
    url: '/tofly-xrtymis/custombgwldjjhzjb',
    method: 'post',
    data
  })
}
// 下次定检
export function xcdj_list(params) {
  return request({
    url: '/tofly-xrtymis/customsbzc/docimasy',
    method: 'get',
    params
  })
}
// ID查计划
export function plan_list(params) {
  return request({
    url: '/tofly-xrtymis/custombgwldjjh',
    method: 'get',
    params
  })
}
// 未指派计划
export function planNo_list(params) {
  return request({
    url: '/tofly-xrtymis/custombgwldjjh/assign',
    method: 'get',
    params
  })
}

// 获取客户列表
export function getUserList(params) {
  return request({
    url: '/tofly-xrtymis/user/pageNew',
    method: 'get',
    params
  })
}
// 分派

export function zjzp_list(data) {
  return request({
    url: '/tofly-xrtymis/custombgwldjjh',
    method: 'post',
    data
  })
}
// 获取列表
export function ycsq_list(params) {
  return request({
    url: '/tofly-xrtymis/customsbzc/sbStatus',
    method: 'get',
    params
  })
}
// 异常申请 撤销
export function ycsq_add(data) {
  return request({
    url: '/tofly-xrtymis/customBwglsbjd/applyFor',
    method: 'post',
    data
  })
}

// 未审批的争议检定查看列表
export function wsp_list(params) {
  return request({
    url: '/tofly-xrtymis/customBwglsbjd/noApplyFor',
    method: 'get',
    params
  })
}
// 已审批的争议检定查看列表
export function ysp_list(params) {
  return request({
    url: '/tofly-xrtymis/customBwglsbjd/applyFor',
    method: 'get',
    params
  })
}
// 批量审批、指派检定人员
export function ycsq_edit(data) {
  return request({
    url: '/tofly-xrtymis/customBwglsbjd/applyFor',
    method: 'put',
    data
  })
}
export function xbrk_PPT(data) {
  return request({
    url: '/tofly-xrtymis/bwglsbzctemp/copy',
    method: 'post',
    data
  })
}
// 检测结果批量录入
export function wjsc_PPT(data) {
  return request({
    url: '/tofly-xrtymis/customBwglsbjd/excelResult',
    method: 'post',
    data
  })
}

// 检测结果录入
export function jglr_add(data) {
  return request({
    url: '/tofly-xrtymis/customBwglsbjd/docimasyResult',
    method: 'post',
    data
  })
}
// 撤销录入
export function jglr_delete(params) {
  return request({
    url: '/tofly-xrtymis/bmjdjg/deleteByIds',
    method: 'delete',
    params
  })
}
// 未检定水表列表
export function jglr_list(params) {
  return request({
    url: '/tofly-xrtymis/customBwglsbjd/docimasyResult',
    method: 'get',
    params
  })
}
// 未检定水表列表
export function zcmx_list(params) {
  return request({
    url: '/tofly-xrtymis/customsbzc/groupbysbzc',
    method: 'get',
    params
  })
}
