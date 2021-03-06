// 覆土深度标准
export const CoverSoilStandard = [
    {
        subtype: '电力线缆',
        direct: 0.6, // 直埋
        ditch: 0.45 // 管沟
    },
    {
        subtype: '电信线缆',
        direct: 0.75,
        ditch: 0.55
    },
    {
        subtype: '热力管道',
        direct: 0.6,
        ditch: 0.2
    },
    {
        subtype: '燃气管道',
        direct: 0.7,
        ditch: 0.7
    },
    {
        subtype: '排水管',
        direct: 0.65,
        ditch: 0.65
    },
    {
        subtype: '排水管道',
        direct: 0.65,
        ditch: 0.65
    },
    {
        subtype: '雨水排水管道',
        direct: 0.6,
        ditch: 0.6
    },
    {
        subtype: '污水',
        direct: 0.65,
        ditch: 0.65
    },
    {
        subtype: '雨水',
        direct: 0.65,
        ditch: 0.65
    },
    {
        subtype: '雨污合排管道',
        direct: 0.65,
        ditch: 0.65
    }
]

// 水平垂直净距标准 
export const DisStandard = [
    {
        subtype: '排水管',
        hStandardDis: 0.75,
        vStandardDis: 0.55
    },
    {
        subtype: '排水管道',
        hStandardDis: 0.65,
        vStandardDis: 0.65
    },
    {
        subtype: '电力',
        hStandardDis: 0.75,
        vStandardDis: 0.55
    },
    {
        subtype: '电力路灯',
        hStandardDis: 0.65,
        vStandardDis: 0.65
    },
    {
        subtype: '给水管道',
        hStandardDis: 0.75,
        vStandardDis: 0.55
    },
    {
        subtype: '燃气管道',
        hStandardDis: 0.65,
        vStandardDis: 0.65
    },
    {
        subtype: '中国电信',
        hStandardDis: 0.65,
        vStandardDis: 0.65
    },
]