<template>
  <div class="specificTable">
    <el-table
    ref="specificTable"
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
    @row-dblclick="rowDblclick"
    >
    <el-table-column label="序号" type="index" width="50" />
    <el-table-column
        v-for="(item,colIndex) of column"
        :key="colIndex"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :show-overflow-tooltip="true"
    >
    </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
    name:'specificTable',//大屏表格
    props:{
        tableData: {
            type: Array,
            required: true
        },
        column: {
            type: Array,
            required: true
        },
        cellStyle: {
            type:Function,
            default: () => {
                return Function
            }
        },
        isScroll:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return{
            // cellStyle:{
            //     color:'rgba(255,255,255,0.5)',
            //     fontSize:'.067708rem',
            //     textAlign: 'center',
            //     'border-bottom':'1px solid rgba(236, 236, 236, 0.3)'
            // },
            headerStyle:{
                background: 'transparent',
                color: '#0EA7FF',
                fontSize:'.072917rem',
                textAlign: 'center',
                'border-bottom':'1px solid rgba(236, 236, 236, 0.3)'
            },
            selectionRow:[],
            hasScroll:null,
            timerId:null,
        }
    },
    mounted(){
        this.$refs.specificTable.setCurrentRow(this.tableData[0])
        if(this.isScroll){
            this.$refs.specificTable.$el.style.setProperty('--tableScroll', 'hidden') // 给变量赋值
            this.tableScroll()
        }else{
            this.$refs.specificTable.$el.style.setProperty('--tableScroll', 'auto') // 给变量赋值
        }

    },
    methods:{
        tableScroll(){
            const that=this;
            const table = this.$refs.specificTable;
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
            this.$emit('rowClick',row)
            const findRow = this.selectionRow.find(c => c.rowIndex == row.rowIndex)
            if (findRow) {
                this.$refs.specificTable.toggleRowSelection(row, false)
                return
            }
            this.$refs.specificTable.clearSelection()
            this.$refs.specificTable.toggleRowSelection(row, true) // 点击行选中效果
        },
        rowDblclick(row, column, event) {
            this.$emit('rowDblclick', row)
        },
        // 选择数据
        handleSelectionChange(value) {
            this.selectionRow = value
        },
    }
}
</script>

<style lang='scss' scoped>
.specificTable{
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
            padding: .052083rem /* 10/192 */ .052083rem /* 10/192 */.026042rem /* 5/192 */ .052083rem /* 10/192 */ !important;
        }
        td.el-table__cell div {
            padding: .026042rem /* 5/192 */;
        }
        &.el-table--scrollable-y .el-table__body-wrapper{
            height: 200px !important;
            overflow-y: var(--tableScroll);
        }
        th.gutter {
            display: table-cell !important;
            background: transparent;
        }
        //实现hover前行样式背景高亮
        &.el-table--enable-row-hover .el-table__body tr:hover>td {
            color: #5991ff;
            background-color: rgb(62, 70, 112);
        }
        // 去除自定义表格header和body不对其方式
        &.el-table--border th.gutter:last-of-type {
            display: block !important;
        }
        th > .cell {
            white-space: nowrap;
        }
        .el-table__body tr.current-row>td{
            background-color: rgba(105, 167, 234,0.3) !important;
            color: #fff;
        }
    }
}
</style>