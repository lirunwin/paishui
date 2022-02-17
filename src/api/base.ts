import request from '@/utils/request'
/**
  * 说明：
  * get和delete传值用params,
  * post和put传值用data
  */

// 下载文件
export function getFiles(params) {
  return request({
    url: '/base/file/downloadFile',
    method: 'get',
    params,
    // responseType: 'arraybuffer'
    responseType: 'blob'
  })
}

// 修改密码
export function changePassword(data) {
  return request({
    url: '/base/user/updatePassword',
    method: 'put',
    data
  })
}

// 获取角色列表
export function getRoleList(params) {
  return request({
    url: '/base/role/page',
    method: 'get',
    params
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/base/role',
    method: 'post',
    data
  })
}

// 修改角色
export function editRole(data) {
  return request({
    url: '/base/role',
    method: 'put',
    data
  })
}

// 角色绑定菜单
export function bindMenus(data) {
  return request({
    url: '/base/rolemenu/roleMenuBound',
    method: 'post',
    data
  })
}

// 删除角色
export function deleteRole(params) {
  return request({
    url: '/base/role/removeByIds',
    method: 'delete',
    params
  })
}

// 新增客户
export function addUser(data) {
  return request({
    url: '/base/user/saveNew',
    method: 'post',
    data
  })
}
export function getSystemList() {
  return request({
    url: '/base/role/sysList',
    method: 'get'
  })
}

// 获取菜单列表
export function getRoutes() {
  return request({
    url: '/base/menu/getTreeMenu',
    method: 'get'
  })
}

// 修改客户
export function editUser(data) {
  return request({
    url: '/base/user/updateNew',
    method: 'put',
    data
  })
}

// 获取客户列表
export function getUserList(params) {
  return request({
    url: '/base/user/pageNew',
    method: 'get',
    params
  })
}

// 删除客户
export function deleteUser(params) {
  return request({
    url: '/base/user/removeByIds',
    method: 'delete',
    params
  })
}

// 审核用户
export function auditUser(data) {
  return request({
    url: '/base/user/applyForReview',
    method: 'put',
    data
  })
}

// 角色绑定
export function roleBind(data) {
  return request({
    url: '/base/userrole',
    method: 'put',
    data
  })
}

// 锁定用户
export function setUserLock(data) {
  return request({
    url: '/base/user/lock',
    method: 'put',
    data
  })
}

// 解锁用户
export function setUserUnlock(data) {
  return request({
    url: '/base/user/unlock',
    method: 'put',
    data
  })
}

// 禁用用户
export function setUserDisable(data) {
  return request({
    url: '/base/user/statusFlag',
    method: 'put',
    data
  })
}

// 启用用户
export function setUserEnable(data) {
  return request({
    url: '/base/user/unStatusFlag',
    method: 'put',
    data
  })
}

// 获取单位信息
export function getCompany(params) {
  return request({
    url: '/base/department/page',
    method: 'get',
    params
  })
}

// 获取所有单位信息
export function getCompanyAll() {
  return request({
    url: '/base/department/listAll',
    method: 'get'
  })
}

// 获取所有可选择的审核人
export function getAllAuditors(params) {
  return request({
    url: '/base/user/getUserpermissions',
    method: 'get',
    params
  })
}

// 部门列表
export function getSectionList(params) {
  return request({
    url: '/base/department/page',
    method: 'get',
    params
  })
}

// 新增部门
export function addSection(data) {
  return request({
    url: '/base/department',
    method: 'post',
    data
  })
}

// 修改部门
export function editSection(data) {
  return request({
    url: '/base/department',
    method: 'put',
    data
  })
}

// 删除部门
export function deleteSection(params) {
  return request({
    url: '/base/department/removeByIds',
    method: 'delete',
    params
  })
}

// 日志列表
export function getJournalList(params) {
  return request({
    url: '/base/log/pageNew',
    method: 'get',
    params
  })
}

// 日志部门合计
export function getCountLogType(params) {
  return request({
    url: '/base/log/countLogType',
    method: 'get',
    params
  })
}

// 公司列表
export function getCompanyInfoList(params) {
  return request({
    url: '/tofly-xrtymis/gdglgsxx/page',
    method: 'get',
    params
  })
}

// 删除公司
export function delCompanyInfo(params) {
  return request({
    url: '/tofly-xrtymis/gdglgsxx/deleteByIds',
    method: 'delete',
    params
  })
}

// 新增公司
export function addCompanyInfo(data) {
  return request({
    url: '/tofly-xrtymis/gdglgsxx',
    method: 'post',
    data
  })
}

// 修改公司
export function editCompanyInfo(data) {
  return request({
    url: '/tofly-xrtymis/gdglgsxx',
    method: 'put',
    data
  })
}

// 下载批量增加用户的模板
export function downloadTemplate(params) {
  return request({
    url: '/base/excel-dispose-info/exportData',
    method: 'get',
    responseType: 'arraybuffer',
    params
  })
}

// 批量新增用户
export function batchUser(data) {
  return request({
    url: '/base/excel-dispose-info/importData',
    method: 'post',
    file: true,
    data
  })
}

// 重置密码
export function initialPwd(data) {
  return request({
    url: '/base/user/resetPassword',
    method: 'put',
    data
  })
}

// 获取单位绑定资源
export function getUnitList() {
  return request({
    url: '/base/departmentsource/page',
    method: 'get'
  })
}

// 获取资源列表
export function getSourceList() {
  return request({
    url: '/base/source/list',
    method: 'get'
  })
}

// 获取树形资源列表
export function getTreeSourceList() {
  return request({
    url: '/base/sourcedic/getTreeService',
    method: 'get'
  })
}

// 修改单位资源列表
export function editUnitSource(data) {
  return request({
    url: '/base/departmentsource',
    method: 'put',
    data
  })
}

// 根据部门/单位Id来获取其已经绑定的资源
export function getResouceById(params) {
  return request({
    url: `/base/departmentsource${params}`,
    method: 'get'
  })
}

// 单位管理批量导入
export function departmentBatchImport(data) {
  return request({
    url: '/base/department/batchDepartment',
    method: 'post',
    file: true,
    data
  })
}

// 服务配置左侧服务列表增加
export function serviceAdd(data) {
  return request({
    url: '/base/sourcedic',
    method: 'post',
    data
  })
}

// 服务配置左侧服务列表删除
export function serviceDelete(params) {
  return request({
    url: `/base/sourcedic/removeByIds`,
    method: 'delete',
    params
  })
}

// 服务配置左侧服务列表修改
export function serviceEdit(data) {
  return request({
    url: '/base/sourcedic/update',
    method: 'put',
    data
  })
}

// 服务配置左侧服务列表查询(分页)
export function serviceList(params) {
  return request({
    url: '/base/sourcedic/page',
    method: 'get',
    params
  })
}

// 服务配置右侧资源列表增加
export function sourceAdd(data) {
  return request({
    url: '/base/source',
    method: 'post',
    data
  })
}

// 服务配置右侧资源列表删除
export function sourceDelete(params) {
  return request({
    url: '/base/source/removeByIds',
    method: 'delete',
    params
  })
}

// 服务配置右侧资源列表编辑
export function sourceEdit(data) {
  return request({
    url: '/base/source',
    method: 'put',
    data
  })
}

// 服务配置右侧资源列表查询 根据左侧id
export function sourceList(params) {
  return request({
    url: '/base/source/selectSourceById/',
    method: 'get',
    params
  })
}

// APP管理接口
// APP记录查询
export function recordList(params) {
  return request({
    url: '/base/app/pageNew',
    method: 'get',
    params
  })
}

// 上传APP文件和版本说明文件
export function upLoadFiles(data) {
  return request({
    url: '/base/app/upLoadApp',
    method: 'put',
    data
  })
}

// 删除记录
export function deleteRecord(params) {
  return request({
    url: '/base/app/deleteByIds',
    method: 'delete',
    params: params
  })
}
// export function deleteRecord(params, batch) {
//   return request({
//     url: batch ? '/base/app/deleteByIds' : `/base/app/${params}`,
//     method: 'delete',
//     params: batch ? params : null
//   })
// }

// 发布App
export function publishRecord(data) {
  return request({
    url: '/base/app',
    method: 'put',
    data
  })
}

// 账号申请接口
// 账号申请历史记录
export function accountApplyHistory(params) {
  return request({
    url: '/base/user/historySelect',
    method: 'get',
    params
  })
}

// 账号申请信息填写
export function accountApplyFill(data) {
  return request({
    url: '/base/user/accountApplication',
    method: 'put',
    data
  })
}
// 获取部门和人员
export function getDepartment(params) {
  return request({
    url: '/mis/gdglinfo/getDepartmentIdByUser',
    method: 'get',
    params
  })
}

// 获取当前登录用户的信息
export function getCurrentUserInfo(params) {
  return request({
    url: '/gps/inspectgroup/getInspectGroupInfo',
    // url: '/gps/inspectgroup/page',
    method: 'get',
    params
  })
}

// 获取当前用户所关联的所有组和所有人员
export function getGroupUserMap(params) {
  return request({
    url: '/gps/groupuser/getGroupUserMap',
    // url: '/gps/inspectgroup/page',
    method: 'get',
    params
  })
}

// 获取巡检组下面的人员
export function getGroupUserInfo(params) {
  return request({
    url: '/gps/groupuser/getGroupUserIdNameMap',
    method: 'get',
    params
  })
}

// 获取片区和抄表册
export function getAreas(params) {
  return request({
    url: '/meter/read/getPqAndCbd',
    method: 'get',
    params
  })
}

// 获取用户信息
export function getAllUserInfo(params) {
  return request({
    url: '/base/user/getUserByDepts',
    method: 'get',
    params
  })
}

// 获取当前部门的处理人员
export function getDeptUserList(params) {
  return request({
    url: '/base/user/getDeptUserList',
    method: 'get',
    params
  })
}


// 模块管理接口
// 子系统管理
// 查询子系统列表
export function querySystemList(params) {
  return request({
    url: '/base/basesys/page',
    method: 'get',
    params
  })
}
// 新增子系统
export function addNewSystem(data) {
  return request({
    url: '/base/basesys',
    method: 'post',
    data
  })
}
// 编辑子系统
export function editSystem(data) {
  return request({
    url: '/base/basesys',
    method: 'put',
    data
  })
}
// 删除子系统
export function delSystem(params) {
  return request({
    url: '/base/basesys/deleteByIds',
    method: 'delete',
    params
  })
}
// 菜单管理
// 查询菜单列表
export function queryMenuList(params) {
  return request({
    url: '/base/menu/list',
    method: 'get',
    params
  })
}
// 新增菜单
export function addNewMenu(data) {
  return request({
    url: '/base/menu',
    method: 'post',
    data
  })
}
// 编辑菜单
export function editMenu(data) {
  return request({
    url: '/base/menu',
    method: 'put',
    data
  })
}
// 删除菜单
export function delMenu(params) {
  return request({
    url: '/base/menu/removeByIds',
    method: 'delete',
    params
  })
}

// 获取码表
export function getCommonCode(params) {
  return request({
    url: '/base/syscommoncode/getByfjId',
    method: 'get',
    params
  })
}

// 通过菜单权限获取部门及其用户
export function getUserAndDepatmentByPerssion(params) {
  return request({
    url: '/base/user/getUserAndDepatmentByPerssion',
    method: 'get',
    params
  })
}

// 产销差查询
export function getNrw(params) {
  return request({
    url: '/gis/waterAnalysis/getNrw',
    method: 'get',
    params
  })
}
// 产销差详细查询
export function getMore(params) {
  return request({
    url: '/gis/waterAnalysis/nrwMore',
    method: 'get',
    params
  })
}
// 产销差查询
export function getSupply(params) {
  return request({
    url: '/gis/waterAnalysis/getSupSellWater',
    method: 'get',
    params
  })
}
// 产销差详细查询
export function getMoreSupply(params) {
  return request({
    url: '/gis/waterAnalysis/supSellWaterMore',
    method: 'get',
    params
  })
}

// 漏损率查询
export function getLeakage(params) {
  return request({
    url: '/gis/waterAnalysis/getLeakage',
    method: 'get',
    params
  })
}
// 漏损率详细查询
export function getMoreLeakage(params) {
  return request({
    url: '/gis/waterAnalysis/leakageMore',
    method: 'get',
    params
  })
}
