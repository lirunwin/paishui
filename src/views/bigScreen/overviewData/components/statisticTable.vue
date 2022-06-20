<template>
  <div class="statisticTable">
    <el-table
    ref="statisticTable"
    :data="tableData"
    tooltip-effect="dark"
    :style="{width: '100%'}"
    :height="'100% '"
    :max-height="'100%'"
    :header-cell-style="headerStyle"
    :cell-style="cellStyle"
    :show-overflow-tooltip="true"
    :row-class-name="tableRowClassName"
    :row-style="rowStyle"
    @selection-change="handleSelectionChange"
    @row-click="rowClick"
    >
    <el-table-column label="序号" type="index" width="50" />
    <el-table-column
        v-for="(item,colIndex) of column.filter(
          ele => ele.prop && ele.prop !== 'operation'&& ele.prop !== 'status'&& ele.prop !== 'deviceStatus')"
        :key="colIndex"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :show-overflow-tooltip="true"
    >
    </el-table-column>
    <el-table-column
        v-for="item of column.filter(
          ele => ele.prop && ele.prop === 'status')"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
    >
        <!-- 通过 slot-Scoped 可以获取到 row, column, $index 和 store（table 内部的状态管理）的数据-->
        <template slot-scope="data">
            <div style="display:flex;align-items:center">
                <div style="border-radius:50%;height:5px;width:5px;" 
                :style="data.row.status==='上班'?'background:#06B062':(data.row.status==='下班'?'background:#FFB54C':'background:#81A5CA')">
                </div>
                <div style="white-space: nowrap;">{{data.row.status}}</div>
            </div>
        </template>
    </el-table-column>
    <el-table-column
        v-for="item of column.filter(
          ele => ele.prop && ele.prop === 'deviceStatus')"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
    >
        <template slot-scope="data">
            <div style="display:flex;align-items:center">
                <div style="border-radius:50%;height:5px;width:5px;" 
                :style="data.row.deviceStatus==='正常'?'background:#06B062':(data.row.deviceStatus==='报警'?'background:#FF3131':'background:#6F93AC')">
                </div>
                <div style="white-space: nowrap;" :style="data.row.deviceStatus==='报警'?'color:#FF3131':''">{{data.row.deviceStatus}}</div>
            </div>
        </template>
    </el-table-column>
    <el-table-column
        v-for="item of column.filter(
          ele => ele.prop && ele.prop === 'operation')"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
    >
        <template slot-scope="data">
              <img src="../images/轨迹.png" alt="" 
              style="width:.083333rem;height:.09375rem;cursor:pointer" 
              @click.stop="operation(item.prop,data)"
              >
        </template>
    </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
    name:'statisticTable',//大屏表格
    props:{
        tableData: {
            type: Array,
            required: true
        },
        column: {
            type: Array,
            required: true
        },
        isScroll:{
            type:Boolean,
            default:false
        },
        cellStyle: {
            type: Object,
            default: () => {
                return {
                    fontSize:'.067708rem',
                    textAlign: 'center',
                    'border-bottom':'1px solid #0E3856'
                }
            }
        }
    },
    data(){
        return{
            headerStyle:{
                background: 'rgba(14, 56, 86, 0.57)',
                color: '#0EA7FF',
                fontSize:'.072917rem',
                textAlign: 'center',
                'border':'none'
            },
            selectionRow:[],
            hasScroll:null,
            timerId:null,
        }
    },
    mounted(){
        this.$refs.statisticTable.setCurrentRow(this.tableData[0])
        if(this.isScroll){
            this.$refs.statisticTable.$el.style.setProperty('--tableScroll', 'hidden') // 给变量赋值
            this.tableScroll()
        }else{
            this.$refs.statisticTable.$el.style.setProperty('--tableScroll', 'auto') // 给变量赋值
        }

    },
    methods:{
        tableScroll(){
            const that=this;
            const table = this.$refs.statisticTable;
            // 拿到表格中承载数据的div元素
            const area = table.bodyWrapper;
            // 拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每100毫秒移动1像素)
            area.scrollTop=0
            function scrollUp(){
                if(area.scrollTop>=(area.scrollHeight-area.offsetHeight)){
                    area.scrollTop=0;
                }else{
                    area.scrollTop++
                }
            }
            if(!this.hasScroll) {
                this.hasScroll=true;
                let time = 50;
                this.setAnimationFrame(scrollUp,time)
                area.onmouseover=function(){
                    cancelAnimationFrame(that.timerId);
                }
                area.onmouseout=function(){
                    that.setAnimationFrame(scrollUp,time)
                }
            }
        },
        //使用requestAnimationFrame重写setInterval，进行性能优化
        setAnimationFrame(render,time) {
            //当前执行时间
            var nowTime = 0;
            //记录每次动画执行结束的时间
            var lastTime = Date.now();
            //我们自己定义的动画时间差值
            var diffTime = time;
            //当前requestAnimationFrame的id
            //此处使用对象，对象存储在地址空间，函数内部更新了对象的值，函数外部也可以接收到
            var that = this;
            function animloop() {
                //记录当前时间
                nowTime = Date.now();
                if (nowTime - lastTime > diffTime) {
                    lastTime = nowTime
                    render();
                }
                //timerid为数字
                that.timerId = requestAnimationFrame(animloop);
            }
            animloop()
        },
        tableRowClassName({ row, rowIndex }) {
            let rowName = ''
            const findRow = this.selectionRow.find(c => c.rowIndex === row.rowIndex)
            if (findRow) {
                rowName = 'current-row'// elementUI 默认高亮行的class类 也可通过css覆盖改变背景颜色
            }
            return rowName // 也可以再加上其他类名 如果有需求的话
        },
        rowStyle({ row, rowIndex }) {
            // 给每一行添加不可枚举属性rowIndex来标识当前行
            Object.defineProperty(row, 'rowIndex', {
                value: rowIndex,
                writable: true,
                enumerable: false
            })
        },
        rowClick(row, column, event) {
            const findRow = this.selectionRow.find(c => c.rowIndex == row.rowIndex)
            if (findRow) {
                this.$refs.statisticTable.toggleRowSelection(row, false)
                return
            }
            this.$refs.statisticTable.clearSelection()
            this.$refs.statisticTable.toggleRowSelection(row, true) // 点击行选中效果
        },
        // 选择数据
        handleSelectionChange(value) {
            this.selectionRow = value
        },
        //操作
        operation(field,data) {
            this.$emit(field, data.row)
        },
    }
}
</script>

<style lang='scss' scoped>
.statisticTable{
    height:100%;
    width:100%;
    >>> .el-table{
        background: transparent;
        font-size: .072917rem /* 14/192 */;
        color: #FFFFFF;
        &.el-table--border::after, &.el-table--group::after, &::before{
            height: 0;
        }
        td,th{
            padding: .010417rem /* 2/192 */ 0 !important;
        }
        tr{
            background-color: transparent;
        }
        th.el-table__cell>.cell{
            padding: .026042rem /* 5/192 */ 0;
        }
        td.el-table__cell div {
            padding: .026042rem /* 5/192 */;
        }
        &.el-table--scrollable-y .el-table__body-wrapper{
            // height: 240px !important;
            overflow-y: var(--tableScroll);
            // overflow-x:hidden;
        }
        th.gutter {
            width: 0px !important;
            display: table-cell !important;
            background: transparent;
        }
        // 去除自定义表格header和body不对其方式
        &.el-table--border th.gutter:last-of-type {
            display: block !important;
        }
        th > .cell {
            white-space: nowrap;
        }
        //实现hover前行样式背景高亮
        &.el-table--enable-row-hover .el-table__body tr:hover>td {
            color: #5991ff;
            background-color: rgb(62, 70, 112);
        }
        //行样式
        .el-table__body tr.current-row>td{
            background-color: rgba(105, 167, 234,0.3) !important;
            color: #fff;
        }
    }
}
</style>