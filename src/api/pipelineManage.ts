import request from '@/utils/request'

/**
  * 管道检测数据管理所有接口
  * 说明：
  * get和delete传值用params,
  * post和put传值用data
  */
let psjc = "/psjc"
let base = "/base"


// 导出 / 下载附件
export function downloadFile(params) {
    return request({
        url: psjc + '/sysUploadFile/downloadFile/' + params,
        method: 'get',
    })
}

// 系统码表接口
// 通过key查询系统码表
export function queryDictionariesId(params) {
    return request({
        url: base + '/code/getByKeys',
        method: 'get',
        params
    })
}

// 管道评估结果管理接口
// 分页查询
export function queryPageAssessment(params) {
    return request({
        url: psjc + '/pipeState/page',
        method: 'get',
        params
    })
}

// 通过id查询管段检测信息（详情）
// /pipeState/{id}
export function assessmentDetails(params) {
    return request({
        url: psjc + '/pipeState/' + params,
        method: 'get',
    })
}
// 通过id查询管段缺陷信息(缩略提示框)
export function assessmentDefect(params) {
    return request({
        url: psjc + '/pipeState/getDefectById/' + params,
        method: 'get',
    })
}

// 附件分页查询接口
export function queryPageEnclosure(params) {
    return request({
        url: psjc + '/sysUploadFile/page',
        method: 'get',
        params
    })
}


// 管道内窥检测数据导入(文件导入) / 检测报告管理
// export function importFiles(params) {
//     return request({
//         url: psjc + '/pipeState/pipeStateUpload',
//         method: 'POST',
//         params
//     })
// }

// --管道内窥检测缺陷数据信息接口(管道缺陷管理)--
// 管道内窥检测缺陷数据信息分页查询
export function queryPageDefectInfo(params) {
    return request({
        url: psjc + '/pipeDefect/page',
        method: 'get',
        params
    })
}

// 通过ID查询管道内窥检测缺陷数据信息 (详情)
export function queryDefectdetails(params) {
    return request({
        url: psjc + '/pipeDefect/'+params,
        method: 'get',
    })
}

// 报告上传
export function importFiles(params) {
    return request({
        url: psjc + '/wordInfo/wordInfoUpload',
        method: 'POST',
        params
    })
}

// 批量发布 ids(字符串)
export function batchRelease(data) {
    return request({
        url: psjc + '/wordInfo/publishByIds?ids=' + data,
        method: 'post',
    })
}

// 通过ID删除管道内窥检测报告信息
export function deleteIdData(params) {
    return request({
        url: psjc + "/wordInfo/" + params,
        method: 'delete',
    })
}
// 分页查询
export function queryPageTestReport(params) {
    return request({
        url: psjc + '/wordInfo/page',
        method: 'get',
        params
    })
}
// 分页查询(可模糊查询)
export function queryPageTestReportNew(params) {
    return request({
        url: psjc + '/wordInfo/pageNew',
        method: 'get',
        params
    })
}

// 通过IDS删除管道内窥检测报告信息
export function deleteTestReport(params) {
    return request({
        url: psjc + "/wordInfo/removeByIds",
        method: 'delete',
        params
    })
}



// --管道缺陷管理--
// 新增管段检测缺陷与评估成果信息表
export function addDefectinfo(data) {
    return request({
        url: psjc + '/defectinfo',
        method: 'post',
        data
    })
}

// 修改管段检测缺陷与评估成果信息表


// 通过ID查询

// 通过ID删除管段检测缺陷与评估成果信息表

// 分页查询
export function queryPageDefectinfo(params) {
    return request({
        url: psjc + '/defectinfo/page',
        method: 'get',
        params
    })
}

// --工程管理--
// 上传附件
// export function uploadFile(data) {
//     return request({
//         url: psjc + '/sysUploadFile/uploadFile',
//         method: 'post',
//         data
//     })
// }


// 根据条件新增数据
export function addData(data) {
    return request({
        url: psjc + '/projectInfo',
        method: 'post',
        data
    })
}

// 删除数据(单个)
export function deleteData(params) {
    return request({
        url: psjc + "/projectInfo/" + params,
        method: 'delete',
    })
}

// 删除数据(多个)
export function deleteDatas(params) {
    return request({
        url: psjc + "/projectInfo/removeByIds/",
        method: 'delete',
        params
    })
}


// 修改数据
export function changeInfo(data) {
    return request({
        url: psjc + '/projectInfo',
        method: 'put',
        data
    })
}

// 详情
export function projectDetailsQuery(params) {
    return request({
        url: psjc + '/projectInfo/' + params,
        method: 'get',
    })
}

// 根据条件获取分页查询数据
export function projectPagingQuery(params) {
    return request({
        url: psjc + '/projectInfo/page',
        method: 'get',
        params
    })
}

// 根据条件获取分页查询数据(可模糊查询)
export function projectPagingQueryNew(params) {
    return request({
        url: psjc + '/projectInfo/pageNew',
        method: 'get',
        params
    })
}

// 根据条件获取数据库表名及描述
export function projectDataQuery(params) {
    return request({
        url: psjc + '/commonInter/getDBTable',
        method: 'get',
        params
    })
}

// 根据条件获取
export function projectIdQuery(params) {
    return request({
        url: psjc + '/projectInfo/page',
        method: 'get',
        params
    })
}


// 管道检测历史管理
// 管段历史分页查询 queryParams（管段，道路）
export function queryPageHistory(params) {
    return request({
        url: psjc + '/pipeState/histroyPage',
        method: 'get',
        params
    })
}

// 详情(根据管段编号查询历史检测列表（包含缺陷数据）)
export function histroyPipeData(params) {
    return request({
        url: psjc + '/pipeState/histroyPipeData',
        method: 'get',
        params
    })
}

// 检测报告管理
// 通过检测报告id查询报告内缺陷数量统计(详情查看/发布)
// /wordInfo/pipeDefectCount/{id}
export function queryPipecheckDetails(params) {
    return request({
        url: psjc + '/wordInfo/pipeDefectCount/' + params,
        method: 'get',
    })
}


// 批量撤回检测报告
export function withdrawReport(data) {
    return request({
        url: psjc + '/wordInfo/returnByIds?ids=' + data,
        method: 'post',
    })
}

// 新增管段检测信息表
export function addPipecheck(data) {
    return request({
        url: psjc + '/pipecheck',
        method: 'post',
        data
    })
}

// 修改管段检测信息表
export function updataPipecheck(data) {
    return request({
        url: psjc + '/pipecheck',
        method: 'put',
        data
    })
}


// 通过ID查询
export function queryPipecheck(params) {
    return request({
        url: psjc + '/pipecheck',
        method: 'get',
        params
    })
}

// 通过分页查询
export function queryPagePipecheck(params) {
    return request({
        url: psjc + '/pipecheck/page',
        method: 'get',
        params
    })
}