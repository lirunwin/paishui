<template>
    <div style="height:100%;width:100%">
        <div class="chart-title">
            <div class="name">按道路名称统计</div>
            <div class="operation">
                <el-button size="mini"  plain @click="initTable()">
                    <span class="icon iconfont icontongjibiao"></span>
                </el-button>
                <el-button size="mini"  plain @click="initPieChart()">
                    <span class="icon iconfont iconbingtu"></span>
                </el-button>
                <el-button size="mini"  plain @click="initBarChart()">
                    <span class="icon iconfont icontongjitu"></span>
                </el-button>
                <el-button size="mini"  plain @click="downLoadInfo()">
                    <span class="el-icon-download"></span>
                </el-button>
            </div>
        </div>
        <div class="dataContainer">
            <div class="chart" ref="chart" v-show="!isShowTable"></div>
            <el-table
            id="roadNameTable"
            :data="tableData"
            v-show="isShowTable"
            style="width: 100%;height:100%">
            <el-table-column 
            v-for="item of tabelColumn" :key="item.value"
             :prop="item.prop" 
             :label="item.label"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import echarts from 'echarts'
import html2canvas from 'html2canvas'
import XLSX from "xlsx";
import FileSaver from "file-saver";
export default {
    name:"roadNameChart",//按排放口类别统计图表
    data(){
        return{
            portTypeChart:null,
            colorList:['#3AA1FF','#36CBCB','#4ECB73'],
            result:null,
            isShowTable:false,
            tableData:[],
            tabelColumn:[
                {
                    prop:"rain",
                    label:"雨水"
                },
                {
                    prop:"sweage",
                    label:"污水"
                },
                {
                    prop:"mix",
                    label:"雨污合流"
                },
            ]
        }
    },
    mounted(){
        this.result=[
            { value: 104, name: '道路1' },
            { value: 73, name: '道路2' },
            { value: 80, name: '道路2'},
            { value: 58, name: '道路3'},
            { value: 68, name: '道路4'},
            { value: 50, name: '道路5'},
            { value: 82, name: '道路6'},
            { value: 53, name: '道路7'},
        ]
        this.initBarChart();
    },
    methods:{
        initTable(){
            this.isShowTable=true
            this.tableData=[{
                rain: this.result[0].value,
                sweage: this.result[1].value,
                mix: this.result[2].value
            }]
        },
        initPieChart(){
            let data=this.result
            let option = {
                color:this.colorList,
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'horizontal',
                    icon:'circle',
                    bottom:0
                },
                series: [
                    {
                        name: '排放口类别',
                        type: 'pie',
                        radius: '50%',
                        data: data,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 5,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        label:{
                            formatter: function (params) {
                                return params.name+"："+params.value
                            },
                        },
                        labelLine: {
                            length2: 0
                        },
                        itemStyle: {
                            borderWidth: 1, // 间距的宽度
                            borderColor: '#fff', //背景色
                        },
                    }
                ]
            };
            this.initCharts(option)
        },
        initBarChart(){
            let xData=[],data=[],that=this;
            this.result.forEach(item => {
                xData.push(item.name)
                data.push(item.value)
            });
            let option = {
                xAxis: {
                    type: 'category',
                    data: xData
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: data,
                        type: 'bar',
                        itemStyle: {
                            // 这里就可以实现，配置柱状图的颜色
                            color:'#3AA1FF',
                        },
                    }
                ]
            };
            this.initCharts(option)
        },
        initCharts(option){
            this.isShowTable=false
            if(this.portTypeChart!=null){
                this.portTypeChart.dispose();
            }
            this.$nextTick(()=>{
                this.portTypeChart = echarts.init(this.$refs.chart);
                this.portTypeChart.resize();
                this.portTypeChart.setOption(option,{
                    notMerge: true,
                });
                //图表大小自适应
                window.addEventListener("resize", ()=>{
                    this.portTypeChart.resize()
                })
            })
        },
        downLoadInfo(){
            if(this.isShowTable){
                this.exportTable()
            }else{
                this.exportChart()
            }
        },
        exportTable(){
            let wb = XLSX.utils.table_to_book(document.querySelector("#roadNameTable"));
            let wbout = XLSX.write(wb, {
                bookType: "xlsx",
                bookSST: true,
                type: "array",
            });
            try {
                FileSaver.saveAs(
                new Blob([wbout], { type: "application/octet-stream" }),
                "按道路名称统计导出数据.xlsx"
                );
            } catch (e) {
                if (typeof console !== "undefined") console.log(e, wbout);
            }
            return wbout;
        },
        exportChart(){
            // 图表转换成canvas
            html2canvas(this.$refs.chart).then(function (canvas) {
                var img = canvas
                .toDataURL("image/png")
                .replace("image/png", "image/octet-stream");
                // 创建a标签，实现下载
                var creatIMg = document.createElement("a");
                creatIMg.download = "按道路名称统计图表.png"; // 设置下载的文件名，
                creatIMg.href = img; // 下载url
                document.body.appendChild(creatIMg);
                creatIMg.click();
                creatIMg.remove(); // 下载之后把创建的元素删除
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.chart-title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .operation{
        .el-button{
            padding: 2px;
            border: none;
            color: royalblue;
        }
    }
}
.dataContainer{
    width: 100%;
    height: calc(100% - 20px);
    .chart{
        width: 100%;
        height: 100%;
    }
}
</style>