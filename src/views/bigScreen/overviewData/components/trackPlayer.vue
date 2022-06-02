<template>
    <div class="trackPlayer" v-if="showTrackPlayer">
        <div class="settings">
            <div class="playButton" @click="playTheTrack()">
                <img :src="buttonImg"/>
            </div>
            <el-select v-model="value" placeholder="请选择" size="mini">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <el-slider v-model="progressValue"></el-slider>
            <div class="close" @click="closeVideoPlayer()"><i class="el-icon-close"></i></div>
        </div>
    </div>
</template>

<script>
export default {
    name:'trackPlayer',//轨迹播放
    props:{
        show:{}
    },
    data(){
        return{
            //播放轨迹模块
            showTrackPlayer:false,
            buttonImg:"",//
            playButtonImg:require('../images/播放.png'),
            pauseButtonImg:require('../images/暂停.png'),
            isPlaying:false,
            progressValue:0,
            timeTask:null,
            options: [{
                value: '2022-5-25 10:20:10',
                label: '2022-5-25 10:20:10'
            }, {
                value: '2022-5-26 10:20:10',
                label: '2022-5-26 10:20:10'
            }],
            value: '2022-5-25 10:20:10',
        }
    },
    watch:{
        show:{
            handler(n,o){
                if(n) this.showTrackPlayer=true
            }
        },
        isPlaying:{
            handler(n,o){
                if(n){
                    this.buttonImg=this.pauseButtonImg
                    
                }else{
                    this.buttonImg=this.playButtonImg
                }
            },
            immediate:true
        }
    },
    methods:{
        playTheTrack(){
            this.isPlaying=!this.isPlaying
            if(this.isPlaying){
                this.timeTask=setInterval(()=>{
                    if(this.progressValue<100){
                        this.progressValue++
                    }else{
                        this.progressValue=0
                    }
                },200)
            }else{
                this.clearIntervalTask()
            }
        },
        //清除定时任务
        clearIntervalTask(){
            if(this.timeTask){
                clearInterval(this.timeTask);
                this.timeTask=null
            }
        },
        closeVideoPlayer(){
            this.isPlaying=false;
            this.progressValue=0;
            this.clearIntervalTask();
            this.showTrackPlayer=false
            this.$parent.showTrackPlayer=false
        }
    }
}
</script>

<style lang="scss" scoped>
.trackPlayer{
    position: absolute;
    white-space: nowrap;
    left: 2.239583rem /* 430/192 */;
    top:.520833rem /* 100/192 */;
    width: 2.869792rem /* 551/192 */;
    height: .260417rem /* 50/192 */;
    background: linear-gradient(-90deg, rgba(3, 109, 190, 0.56) 0%, rgba(3, 109, 190, 0.26) 100%);
    .settings{
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        .el-slider{
            width: 1.354167rem /* 260/192 */;
        }
        .playButton{
            width: .177083rem /* 34/192 */;
            height: .177083rem /* 34/192 */;
            img{
                height: 100%;
                width: 100%;
            }
            cursor: pointer;
        }
        .close{
            display: flex;
            align-items: flex-start;
            height: 100%;
            color: rgba(138, 211, 253, 1);
            font-size:.09375rem /* 18/192 */;
            cursor: pointer;
        }
        .el-select{
            /deep/ input{
                padding: 0;
                background: transparent;
                border: none;
                font-size: .072917rem /* 14/192 */;
                font-weight: 500;
                color: #2BA7FF;
            }
            /deep/ .el-icon-arrow-up:before {
                content: '';
                display: block;
                // 定义元素宽高
                margin-top:.041667rem /* 8/192 */;
                width: .130208rem /* 25/192 */;
                height: .078125rem /* 15/192 */;
                background: url("../images/三角下.png") no-repeat center center;
                background-size: 100% 100%;
                transform: rotate(180deg);
            }
        }
    }
}
</style>