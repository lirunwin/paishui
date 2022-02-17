import request from '@/utils/request'
import { readyException } from 'jquery'

/**
  * 说明：
  * 工地巡查相关接口
  * get和delete传值用params,
  * post和put传值用data
  */

//工地列表=>码表
export function getBuildType(params) {
    return request({
        url: '/gps/buildtype/page',
        method: 'get',
        params
    })
}
//审核人=>码表
export function getCheckMan(params) {
    return request({
        url: '/base/user/getDepartmentUser',
        method: 'get',
        params
    })
}

//工地监护=>工地上报列表查询
export function queryBuildList(params) {
    return request({
        url: '/gps/build/page',
        method: 'get',
        params
    })
}

//工地监护=>工地上报
export function reportBuild(data) {
    return request({
        url: '/gps/build/save',
        method: 'post',
        data
    })
}

//工地监护 => 工地信息详情
export function getBuildDetailId(id) {
    return request({
        // url: `/gps/build/getBuildDetail/${id}`,?id=${id}&flag=1
        url: `/gps/build/getBuildDetail?id=${id}&flag=1`,
        method: 'get',
    })
}

//工地监护 => 获取图片
export function getFileImg(token,path) {
    return request({
        url: '/base/file/loadImg?access_token=' + token + '&remotePath=' + path.replace(/\//g, '%2f'), 
        method: 'get', 
        responseType: "blob"
    })
}

//工地监护 => 获取音频
export function getFileAudio(token,path) {
    return request({
        url: '/base/file/loadAudio?access_token=' + token + '&remotePath=' + path.replace(/\//g, '%2f'), 
        method: 'get', 
        responseType: "blob"
    })
}


//工地派工审核 => 获取巡检组、巡检人员
export function queryGroupUserMap(params) {
    return request({
        url: '/gps/groupuser/getGroupUserMap',
        method: 'get',
        params
    })
}


//工地派工审核 => 巡检周期
export function queryPeriod(params) {
    return request({
        url: '/gps/period/page',
        method: 'get',
        params
    })
}


//工地审核 => 派工审核、消除隐患审核
export function reportBuildCheck(typeid,data) {
    return request({
        url: `/gps/audit/auditDispose/?templateServiceType=${typeid}`,
        method: 'post',
        data
    })
}

//隐患消除审核 => 待审核列表
export function getBuildClear(params) {
    return request({
        url: '/gps/bulidclear/page',
        method: 'get',
        params
    })
}