<template>
   <div class="dataPanel">
        <div class="header">
            <el-row :gutter="20">
                <el-col :span="6">
                    <label style="width: 30%">指标性</label>
                    <el-select v-model="value" placeholder="请选择" size="mini" style="width: 60%">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="11">
                    <label style="width: 15%">时间</label>
                    <el-date-picker
                        v-model="startTime"
                        size="mini"
                        style="width: 60%"
                        type="date"
                        placeholder="开始时间"
                        :picker-options="pickerOptionsStart"
                        value-format="yyyy-MM-dd"
                    ></el-date-picker>-
                    <el-date-picker
                        size="mini"
                        style="width: 60%"
                        v-model="endTime"
                        type="date"
                        placeholder="结束时间"
                        :picker-options="pickerOptionsEnd"
                        value-format="yyyy-MM-dd"
                    ></el-date-picker>
                </el-col>
                <el-col :span="7">
                    <el-button type="primary" size="mini">查询</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="content">
            <div class="infoList">
                <div class="title">
                    <div>序号</div>
                    <div>监测时间</div>
                    <div>指标值</div>
                </div>
                <div class="details">
                    <div class="infoItem" v-for="(item,index) of itemList" :key="index">
                        <div class="index">{{index+1}}</div>
                        <div class="time">{{item.time}}</div>
                        <div class="value">{{item.value}}</div>
                    </div>
                </div>
            </div>
            <div class="infoChart">
                <historyIndexChart 
                    :timeData="timeData" 
                    :infoData="infoData" 
                    :fontSize="$listeners.fontSize"/>
            </div>
        </div>
    </div>
</template>

<script>
import historyIndexChart from './historyIndexChart.vue'
export default {
    name:'historyInfo',//历史监测信息
    components:{
        historyIndexChart
    },
    data(){
        return{
            options: [{
            value: '选项1',
            label: '黄金糕'
            }, {
            value: '选项2',
            label: '双皮奶'
            }],
            value: '',
            //日期选择模块
            startTime:"",
            endTime:"",
            // 开始结束日期限制
            pickerOptionsStart: {
            disabledDate: (time) => {
                if (this.endTime) {
                return (
                    time.getTime() > Date.now() ||
                    time.getTime() > new Date(this.endTime).getTime()
                );
                }
                return time.getTime() > Date.now();
            }
            },
            // 结束日期限制
            pickerOptionsEnd: {
            disabledDate: (time) => {
                if (this.startTime) {
                return (
                    time.getTime() > Date.now() ||
                    time.getTime() < new Date(this.startTime).getTime()
                );
                }
                return time.getTime() > Date.now();
            }
            },
            //
            itemList:[
                {
                    time:"2022-6-14 10:30:00",
                    value:100
                },
                {
                    time:"2022-6-14 10:30:00",
                    value:203
                },
                {
                    time:"2022-6-14 10:30:00",
                    value:304
                },
                {
                    time:"2022-6-14 10:30:00",
                    value:500
                },
                {
                    time:"2022-6-14 10:30:00",
                    value:607
                },
                {
                    time:"2022-6-14 10:30:00",
                    value:230
                },
                {
                    time:"2022-6-14 10:30:00",
                    value:240
                },
                {
                    time:"2022-6-14 10:30:00",
                    value:0
                },
                {
                    time:"2022-6-14 10:30:00",
                    value:0
                },
                {
                    time:"2022-6-14 10:30:00",
                    value:0
                },
                {
                    time:"2022-6-14 10:30:00",
                    value:0
                },
                {
                    time:"2022-6-14 10:30:00",
                    value:0
                },
            ],
            timeData:['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'],
            infoData:[502.84, 205.97, 332.79, 281.55, 398.35, 214.02,502.84, 205.97, 332.79, 281.55, 398.35, 214.02,214.02],
        }
    },
}
</script>

<style lang='scss' scoped>
.dataPanel{
    display: flex;
    flex-flow: column;
    .header{
        color: #88B4CE;
        .el-col{
            display: flex;
            align-items: center;
            padding: 0 .052083rem /* 10/192 */;
        }
        .el-col:last-child{
            display: block;
            padding: 0 .052083rem /* 10/192 */;
        }
        /deep/ .el-input__inner{
            background-color: #01233E;
            border:1px solid #0E4069;
            color: #1c8dbd !important;
        }
    }
    .content{
        display: flex;
        height: 1.5625rem /* 300/192 */;
        width: 100%;
        margin-top: .15625rem /* 30/192 */;
        .infoList{
            flex: 0.4;
            color: #eee;
            box-shadow: inset 0 0 30px #234a80;
            /*里面的代码可以根据自己需求去进行更改*/
            /* 设置滚动条的样式 */
            ::-webkit-scrollbar {
                width:8px;
            }
            /* 滚动槽 */
            ::-webkit-scrollbar-track {
                box-shadow:inset 0 0 6px rgba(0,0,0,0.3);
                border-radius:10px;
            }
            /* 滚动条滑块 */
            ::-webkit-scrollbar-thumb {
                border-radius:10px;
                background:#0F669A;
                box-shadow:inset 0 0 6px rgba(0,0,0,0.5);
            }

            .title{
                display: flex;
                justify-content: space-between;
                margin: .052083rem /* 10/192 */;
                padding: .026042rem /* 5/192 */;
                border-bottom: 1px solid #234a80;
                color: #1c8dbd;
            }
            .details{
                display: flex;
                flex-flow: column;
                overflow-y: auto;
                height: 80%;
                .infoItem{
                    display: flex;
                    justify-content: space-between;
                    padding: .052083rem /* 10/192 */ .104167rem /* 20/192 */;
                    color: #26a8df;
                    .index{
                        flex: 0.2;
                    }
                    .time{
                        flex: 1;
                        display: flex;
                        justify-content: center;
                    }
                    .value{
                        flex: 0.2;
                        display: flex;
                        justify-content: flex-end;
                    }
                }
            }
        }
        .infoChart{
            flex: 0.6
        }
    }
}
</style>