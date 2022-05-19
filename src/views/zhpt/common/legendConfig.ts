export const LegendConfig = {
    // 管道评估
    pipelineEvaluate: [
        { type: "rect", color: "#f00", label: "立即处理", showCheckBox: false },
        { type: "rect", color: "#ff0", label: "制定计划", showCheckBox: false },
        { type: "rect", color: "#008000", label: "暂不处理", showCheckBox: false },
        { type: "rect", color: "#00f", label: "正常", showCheckBox: false },
        { type: "rect", color: "#000", label: "未评价", showCheckBox: false },
    ],
    // 排水检测
    testReport: [
        { type: "traingle1", color: "transparent", label: "一级", showCheckBox: false },
        { type: "traingle2", color: "transparent", label: "二级 ", showCheckBox: false },
        { type: "traingle3", color: "transparent", label: "三级", showCheckBox: false },
        { type: "traingle4", color: "transparent", label: "四级", showCheckBox: false },
        { type: "traingle0", color: "transparent", label: "未定级", showCheckBox: false },
        { type: "line", color: "#0c9923", label: "Ⅰ级", showCheckBox: false },
        { type: "line", color: "rgb(18, 150, 219)", label: "Ⅱ级", showCheckBox: false },
        { type: "line", color: "rgb(244, 234, 42)", label: "Ⅲ级", showCheckBox: false },
        { type: "line", color: "#f00", label: "Ⅳ级", showCheckBox: false },
    ]
}