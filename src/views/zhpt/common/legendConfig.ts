export const LegendConfig = {
    // 管道评估
    pipelineEvaluate: [
        { type: "rect", color: "#f00", label: "立即处理", showCheckBox: false },
        { type: "rect", color: "#ff0", label: "制定计划", showCheckBox: false },
        { type: "rect", color: "#008000", label: "暂不处理", showCheckBox: false },
        { type: "rect", color: "#00f", label: "正常", showCheckBox: false },
        { type: "rect", color: "#000", label: "未评价", showCheckBox: false },
    ],
    // 检测报告
    testReport: [
        { type: "traingle-lb", color: "transparent", label: "Ⅰ级", showCheckBox: false },
        { type: "traingle-b", color: "transparent", label: "Ⅱ级 ", showCheckBox: false },
        { type: "traingle-y", color: "transparent", label: "Ⅲ级", showCheckBox: false },
        { type: "traingle-r", color: "transparent", label: "Ⅳ级", showCheckBox: false },

        { type: "line", color: "#0c9923", label: "Ⅰ级", showCheckBox: false },
        { type: "line", color: "rgb(18, 150, 219)", label: "Ⅱ级", showCheckBox: false },
        { type: "line", color: "rgb(244, 234, 42)", label: "Ⅲ级", showCheckBox: false },
        { type: "line", color: "#f00", label: "Ⅳ级", showCheckBox: false },
    ]
}