// 最小覆土深度标准
export const CoverSoilStandard = [{
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
    subtype: '给水管道',
    direct: 0.65,
    ditch: 0.65
},
{
    subtype: '雨水排水管道',
    direct: 0.6,
    ditch: 0.6
},
{
    subtype: '污水排水管道',
    direct: 0.65,
    ditch: 0.65
},
{
    subtype: '雨污合排管道',
    direct: 0.65,
    ditch: 0.65
}
]

// 净距标准
export const DisStandard = [
    {
        subtype: '给水管线',
        hStandardDis: 0.75,
        vStandardDis: 0.55
    },
    {
        subtype: '广电线缆',
        hStandardDis: 0.75,
        vStandardDis: 0.55
    },
]