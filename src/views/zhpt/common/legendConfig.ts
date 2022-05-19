export const LegendConfig = {
    // 管道评估
    pipelineEvaluate: [
        { type: "rect", color: "#f00", label: "立即处理", showCheckBox: false },
        { type: "rect", color: "#ff0", label: "处理计划", showCheckBox: false },
        { type: "rect", color: "green", label: "修复计划", showCheckBox: false },
        { type: "rect", color: "#008000", label: "尽快处理", showCheckBox: false },
        { type: "rect", color: "#00f", label: "尽快修复", showCheckBox: false },
        { type: "rect", color: "#fff", label: "暂不处理", showCheckBox: false },
    ],
    // 排水检测
    testReport: [
        { type: "traingle1", color: "transparent", label: "一级", showCheckBox: false },
        { type: "traingle2", color: "transparent", label: "二级 ", showCheckBox: false },
        { type: "traingle3", color: "transparent", label: "三级", showCheckBox: false },
        { type: "traingle4", color: "transparent", label: "四级", showCheckBox: false },
        { type: "traingle0", color: "transparent", label: "未定级", showCheckBox: false },

        { type: "line", color: "green", label: "Ⅰ级", showCheckBox: false },
        { type: "line", color: "blue", label: "Ⅱ级", showCheckBox: false },
        { type: "line", color: "pink", label: "Ⅲ级", showCheckBox: false },
        { type: "line", color: "red", label: "Ⅳ级", showCheckBox: false },
        { type: "line", color: "#070358", label: "未定级", showCheckBox: false },
    ]
}