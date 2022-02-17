export const queryConfig = {
    '地名': {
        text: '地址',
        fields: 'ADDRESS', // 地址
        isLike: true,
        layers: [
            'TF_JSJS_WATERINTAKE_B',// 取水口
            'TF_JSJS_WATERHEAD_B',// 水源
            'TF_JSJS_WATERPUMP_B',// 水泵
            'TF_JSJS_WATERMETER_B',// 水表
            'TF_JSJS_COLLECTSITE_B',// 水质取样点
            'TF_JSJS_STATION_B',// 监测点
            'TF_JSJS_VALVE_B',// 控制阀门
            'TF_JSJS_NONVALVE_B',// 非控制阀
            'TF_JSJS_HYDRANT_B',// 消防栓
            'TF_JSJS_MANHOLE_B',// 检查井
            'TF_JSJS_INSPECTSITE_B',// 排污点
            'TF_JSJS_PIPENODE_B',// 节点
            'TF_JSJS_STANDPIPE_B',// 立管
            'TF_JSJS_PIPE_B',// 管线
            'TF_JSQT_MEDIAN_B',// 绿地
            'TF_JSQT_BLOCK_B'// 居民区
        ]
    },
    '管径': {
        text: '管径',
        fields: 'DIAMETER', // 地址
        isLike: false,
        layers: [
            'TF_JSJS_STANDPIPE_B',// 立管
            'TF_JSJS_PIPE_B',// 管线
        ]
    },
    '管材': {
        text: '管线材质',
        fields: 'MATERIAL', // 地址
        isLike: true,
        layers: [
            'TF_JSJS_STANDPIPE_B',// 立管
            'TF_JSJS_PIPE_B',// 管线
        ]
    },
    '设施编号': {
        text: '设施编号',
        fields: 'SID', // 地址
        isLike: true,
        layers: [
            'TF_JSJS_WATERPUMP_B',// 水泵
            'TF_JSJS_WATERMETER_B',// 水表
            'TF_JSJS_STATION_B',// 监测点
            'TF_JSJS_VALVE_B',// 控制阀门
            'TF_JSJS_NONVALVE_B',// 非控制阀
            'TF_JSJS_HYDRANT_B',// 消防栓
            'TF_JSJS_MANHOLE_B',// 检查井
            'TF_JSJS_STANDPIPE_B',// 立管
            'TF_JSJS_PIPE_B'// 管线
        ]
    },
    '阀门类型': {
        text: '阀门类型',
        fields: 'VALVETYPE', // 地址
        isLike: true,
        layers: [
            'TF_JSJS_VALVE_B',// 控制阀门
            'TF_JSJS_NONVALVE_B',// 非控制阀
        ]
    },
    '阀门规格': {
        text: '阀门规格',
        fields: 'DIAMETER', // 地址
        isLike: false,
        layers: [
            'TF_JSJS_VALVE_B',// 控制阀门
            'TF_JSJS_NONVALVE_B',// 非控制阀
        ]
    },
}