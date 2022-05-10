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
        { type: "circle", color: "#f00", label: "Ⅰ级 ", showCheckBox: false },
        { type: "circle", color: "#ff0", label: "Ⅱ级", showCheckBox: false },
        { type: "circle", color: "#008000", label: "Ⅲ级", showCheckBox: false },

        { type: "line", color: "#0ff", label: "Ⅰ级", showCheckBox: false },
        { type: "line", color: "#0c9923", label: "Ⅱ级", showCheckBox: false },
        { type: "line", color: "#f405ff", label: "Ⅲ级", showCheckBox: false },
        { type: "line", color: "#f00", label: "Ⅳ级", showCheckBox: false },
    ]
}