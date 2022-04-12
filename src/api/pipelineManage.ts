import request from '@/utils/request'

/**
  * 管道检测数据管理所有接口
  * 说明：
  * get和delete传值用params,
  * post和put传值用data
  */
let base = "/psjc"

// 文件导入
export function importFiles(params) {
    return request({
        url: base + '/import/word',
        method: 'get',
        params
    })
}

// 工程管理
// 根据条件新增数据
export function addData(data) {
    return request({
        url: base + '/projectInfo',
        method: 'post',
        data
    })
}

// 删除数据(单个)
export function deleteData(params) {
    return request({
        url: base + "/projectInfo/" + params,
        method: 'delete',
    })
}

// 删除数据(多个)
export function deleteDatas(params) {
    return request({
        url: base + "/projectInfo/removeByIds/",
        method: 'delete',
        params
    })
}


// 修改数据
export function changeInfo(data) {
    return request({
        url: base + '/projectInfo',
        method: 'put',
        data
    })
}

// 根据条件获取分页查询数据
export function projectPagingQuery(params) {
    return request({
        url: base + '/projectInfo/page',
        method: 'get',
        params
    })
}

// 根据条件获取数据库表名及描述
export function projectDataQuery(params) {
    return request({
        url: base + '/commonInter/getDBTable',
        method: 'get',
        params
    })
}

// 根据条件获取
export function projectIdQuery(params) {
    return request({
        url: base + '/projectInfo/page',
        method: 'get',
        params
    })
}


// 检测报告管理
// 新增管段检测信息表
export function addPipecheck(data) {
    return request({
        url: base + '/pipecheck',
        method: 'post',
        data
    })
}

// 修改管段检测信息表
export function updataPipecheck(data) {
    return request({
        url: base + '/pipecheck',
        method: 'put',
        data
    })
}


// 通过ID查询
export function queryPipecheck(params) {
    return request({
        url: base + '/pipecheck',
        method: 'get',
        params
    })
}

// 通过分页查询
export function queryPagePipecheck(params) {
    return request({
        url: base + '/pipecheck/page',
        method: 'get',
        params
    })
}