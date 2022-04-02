export function getLevelIntervalParam(line) {
    let param = null
        // 燃气管道
    if (line.properties.TYPENAME == '燃气管道') {
        param = {
            type: '燃气管道',
            attr: line.properties.PRESSURE.trim() ? line.properties.PRESSURE.trim() : '低压',
        }
    }
    // 排水类
    else if (line.properties.TYPENAME.search('排水') >= 0) {
        param = {
            type: '排水管道',
            attr: line.properties.BURYTYPE == '直埋' ? '直埋' : '直埋', // 排水管道均按照直埋标准
        }
    }
    //给水管道
    else if (line.properties.TYPENAME == '给水管道') {
        param = {
            type: '给水管道',
            attr: line.properties.BURYTYPE == '直埋' ? '直埋' : '直埋', // 给水管道均按照直埋标准
        }
    }
    // 电信线缆类
    else if (line.properties.TYPENAME == '移动线缆' ||
        line.properties.TYPENAME == '电信线缆' ||
        line.properties.TYPENAME == '广电线缆') {
        param = {
            type: '电信线缆',
            attr: line.properties.BURYTYPE == '直埋' ? '直埋' : '', // 直埋和非直埋
        }
    }
    // 热力管道和电力线缆
    else {
        param = {
            type: line.properties.TYPENAME,
            attr: line.properties.BURYTYPE == '直埋' ? '直埋' : '', // 直埋和非直埋
        }
    }
    return param
}

// 判断管线获取垂直净距
export function getVerticalInterval(line) {
    let param = null
        // 电信线缆类
    if (line.properties.TYPENAME == '移动线缆' ||
        line.properties.TYPENAME == '电信线缆' ||
        line.properties.TYPENAME == '广电线缆') {
        param = {
            type: '电信线缆',
            attr: line.properties.BURYTYPE == '直埋' ? '直埋' : '', // 直埋和非直埋
        }
    }
    // 电力线缆
    else if (line.properties.TYPENAME == '电力线缆') {
        param = {
            type: '电力线缆',
            attr: line.properties.BURYTYPE == '直埋' ? '直埋' : '', // 直埋和非直埋
        }
    }
    // 排水类
    else if (line.properties.TYPENAME.search('排水') >= 0) {
        param = {
            type: '排水管道',
            attr: line.properties.BURYTYPE == '直埋' ? '直埋' : '直埋', // 排水管道均按照直埋标准
        }
    }
    // 给水管道，热力管道，燃气管道
    else {
        param = {
            type: line.properties.TYPENAME,
            attr: line.properties.BURYTYPE == '直埋' ? '直埋' : '直埋', // 均以直埋标准
        }
    }
    return param
}