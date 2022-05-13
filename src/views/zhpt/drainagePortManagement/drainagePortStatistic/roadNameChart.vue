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
    props:{
        resultInfo:{}
    },
    data(){
        return{
            portTypeChart:null,
            result:null,
            isShowTable:false,
            tableData:[],
            tabelColumn:[],
            currentShow:null,
            chartType:['table','pie','bar'],
        }
    },
    mounted(){
        this.result=[
            { value: 0, name: '无' },
        ]
        this.initBarChart();
    },
    watch:{
        resultInfo:{
            handler(n,o){
                this.result=n;
                this.reinitialization()
            }
        }
    },
    methods:{
        reinitialization(){
            switch(this.currentShow){
                case 'table' :this.initTable();
                            break
                case 'pie' :this.initPieChart();
                            break
                case 'bar' :this.initBarChart();
                            break
            }
        },
        initTable(){
            this.currentShow=this.chartType[0]
            this.isShowTable=true
            this.tabelColumn=[];
            this.tableData=[];
            let obj={};
            this.result.forEach(item=>{
                this.tabelColumn.push({label:item.name,prop:item.name})
                obj[item.name] = item.value;
            })
            this.tableData.push(obj)
        },
        initPieChart(){
            this.currentShow=this.chartType[1]
            let data=this.result
            let radius=(this.result.length>10)?'45%':'65%'
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        return params.marker+params.name+"："+params.percent+"%"
                    },
                },
                legend: {
                    type: 'scroll',
                    orient: 'horizontal',
                    icon:'circle',
                    bottom:0
                },
                series: [
                    {
                        type: 'pie',
                        radius: radius,
                        data: data,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 5,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        label:{
                            formatter:'{b}: {d}%',
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
            this.currentShow=this.chartType[2]
            let xData=[],data=[];
            this.result.forEach(item => {
                xData.push(item.name)
                data.push(item.value)
            });
            let rotate=(this.result.length>5)?-30:0;
            let option = {
                xAxis: {
                    type: 'category',
                    axisLabel: { interval: 0, rotate: rotate},
                    data: xData
                },
                yAxis: {
                    type: 'value'
                },
                grid:{
                    top:30,
                    bottom:30
                },
                tooltip: {
                    trigger: "axis"
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