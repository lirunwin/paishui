<template>
    <transition 
        appear               
		name="animate__animated animate__move"
		enter-active-class="animate__slideInDown"
        leave-active-class="animate__slideOutUp">
        <div class="widget-bigScreenHeader">
            <div class='header'>
                <div class='title' @click="closeModuleAll()">
                    <span class="caption">{{title}}</span>
                    <span class="border-trail"></span>
                </div>
                <div class="menu">
                    <ul class="main">
                        <li v-for="item in menuList" :key="item.name">
                            <a  :name='item.name' 
                            :class="(currentActive===item.label)?'pick-on':''"
                            @click="currentActive=item.label"
                            >{{item.label}}</a>
                        </li>
                    </ul>
                </div>
                <div class="otherItem">
                    <div class="specificTime" >{{specificTime}}</div>
                    <div class="entrySys" @click="enterSys()">{{operationName}}</div>
                </div>
            </div>  
            <!-- <div class="underline"></div> -->
        </div>
    </transition>
</template>

<script>
import Config from './config.json'
import { getUserMenu } from '@/api/user'
export default {
    name:"bigScreenHeader",//大屏头部菜单栏
    data(){
        return{
            title:null,//标题
            menuList:[],//菜单栏配置
            currentActive:'',//当前激活模块
            specificTime:null,//系统当前时间
            operationName:null,
        }
    },
    computed:{
        config(){
            return Config
        },
        routerData(){
            return this.$store.state.routeSetting.addRoutes
        }
    },
    mounted(){
        this.getUserActiveModule();
        this.title=this.config.title
        // this.menuList=this.config.menuList
        this.showCurrentTime()
        this.getEnterText()
    },
    watch:{
        currentActive:{
            handler(n,o){
                this.activeModule(n)
            },
            immediate:true
        },
    },
    methods:{
        //获取用户激活模块
        getUserActiveModule(){
            const userId = sessionStorage.getItem('userId') || this.$store.state.user.userId
            getUserMenu(userId)
            .then((res) => {
                let arr = res.result.filter((item)=>item.type ==='bigScreen')
                let sort=0
                arr[0].childrens.forEach(item => {
                    if(item.statusFlag==='1'){
                        if(item.sort>sort){
                            this.menuList.unshift({
                                name:item.name,
                                label:item.label
                            })
                        }else{
                            this.menuList.push({
                                name:item.name,
                                label:item.label
                            })   
                        }
                        sort=item.sort
                    }
                });
                this.currentActive=this.menuList[0].label
            })
            .catch((err) => {
                console.log(err)
            })
        },
        //进入系统
        enterSys(){
            if(!this.routerData.some((item) => item.label === '首页')&&!this.routerData.some((item) => item.label === '地图')){
                this.logout()
            }else{
                this.$router.push({ path: '/' })
            }
        },
        async logout() {
            await this.$store.dispatch('user/logout')
            this.$router.push('/login')
        },
        getEnterText(){
            if(!this.routerData.some((item) => item.label === '首页')&&!this.routerData.some((item) => item.label === '地图')){
                this.operationName='退出系统'
            }else{
                this.operationName='进入系统'
            }
        },
        //当前激活模块
        activeModule(module){
            this.$parent.showMonitoringCenter=module=='监测中心'?true:false
            this.$parent.showOverviewData=module=='数据总览'?true:false
        },
        showCurrentTime(){
            this.specificTime=getnow();
            //时间显示
            function getnow(){
                let mynow = new Date();//默认的获取的是当前时间
                //通过调用日期对象的方法来重新获取当前的日期时间
                //mynow.setFullYear(2016);
                let year = mynow.getFullYear();//获取年
                let month = mynow.getMonth()+1;//获取月
                let day = mynow.getDate();//获取日
                let hour =mynow.getHours();//获取小时
                let minute =mynow.getMinutes();//获取分钟
                let second =mynow.getSeconds();//获取秒
                let strdate = year+"年"
                +(month < 0 ?"00" : ("0"+month).slice(-2))+"月"
                +(day < 0 ?"00" : ("0"+day).slice(-2))+"日 "
                +(hour < 0 ?"00" : ("0"+hour).slice(-2))+":"
                +(minute < 0 ?"00" : ("0"+minute).slice(-2))+":"
                +(second < 0 ?"00" : ("0"+second).slice(-2))+"";
                return strdate
            }
            //动态显示时间
            setInterval(()=>{
                this.specificTime=getnow();
            },100)
        },
        closeModuleAll(){
            this.$parent.showMonitoringCenter=false
            this.$parent.showOverviewData=false
            this.currentActive=''
        }
    }
}
</script>

<style lang='scss' scoped>
.animate__slideInDown,.animate__slideOutUp{
    animation-duration: 3s;//动画持续时间
    animation-delay: 0s;//动画延迟时间
}
.widget-bigScreenHeader{
    width: 100%;
    position: absolute;
    z-index: 2;
    background: linear-gradient(#021a2a, rgba(2,26,42,0.3));
    font-family: Source Han Sans CN;
    //public size
    $size30:.15625rem /* 30/192 */;
    $size28:.145833rem /* 28/192 */;
    $size20:.104167rem /* 20/192 */;
    $size17:.088542rem /* 17/192 */;
    $size16:.083333rem /* 16/192 */;
    $size14:.072917rem /* 14/192 */;
    $size10: .052083rem /* 10/192 */;
    $size8: .041667rem /* 8/192 */;
    $size3: .015625rem /* 3/192 */;
    $size1:.005208rem /* 1/192 */;
    .header {
        width: 100%;
        height: .375rem /* 72/192 */;
        display: flex;
        flex-flow: row nowrap;
        .title {
            // width: 20%;
            padding: 0 $size20;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            filter: hue-rotate(0deg);
            transition: all 1s linear;
            .caption{
                white-space: nowrap;
                font-size: $size28;
                font-weight: bold;
                color: #FFFFFF;
                text-shadow: 0 0 10px rgba(65, 105, 225,0.3),0 0 20px rgba(65, 105, 225,0.3),0 0 30px rgba(65, 105, 225,0.3),0 0 40px rgba(65, 105, 225,0.3);
            }
        }
        .menu{
            width: 60%;
            white-space: nowrap;
            ul {
                list-style: none;
                padding: $size10;
                margin: 0 0 0 $size10;
            }
            .main {
                width: 100%;
                display: flex;
            }
            .main > li {
                margin: $size8 $size20;
                float: left;
            }
            .main > li a{
                text-align: center;
            }
            a {
                text-decoration: none;
                color: #FEFEFE;
                text-transform: capitalize;
                display: block;
                padding: $size10 0;
                transition: background-color 0.5s ease-in-out;
                font-size: $size16;
                font-weight: 400;
            }
            a:hover,.pick-on {
                cursor: pointer;
                color: #0EA7FF;
                font-weight: bold;
                border-bottom: 2px solid;
            }
            .drop{
                padding: 0;
            }
            .drop li {
                opacity: 0;
                transform-origin: top center;
            }
            .drop li a {
                background-color: rgba(0,22,42, 0.6);
                border-bottom:1px solid royalblue;
            }
            .main li:hover .menu1 li{
                animation: menu1 0.3s ease-in-out forwards;
                animation-delay: 0.3s;
            }
            @keyframes menu1 {
                0% {
                    opacity: 0;
                    transform: scale(0.7);
                  }
                  50% {
                    opacity: 0.5;
                    transform: scale(1.1);
                  }
                  100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        }
        .otherItem{
            width: 20%;
            height: 100%;
            font-size: $size14;
            font-weight: 400;
            display: flex;
            align-items: center;
            margin-left: .21875rem /* 42/192 */;
            .specificTime{
                flex: 2;
                top: 25%;
                text-align: center;
                font-weight: 400;
                color: #A8D3F1;
            }
            .entrySys {
                flex: 0.6;
                color: #A8D3F1;
                background: url("~@/views/bigScreen/images/entrySys.png") no-repeat;
                background-size: 100% 100%;
                height: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                white-space: nowrap;
            }
            .entrySys:hover {
                cursor: pointer;
                color: #A8D3F1;
                background: url("~@/views/bigScreen/images/entrySysHover.png") no-repeat;
                background-size: 100% 100%;
            }
        }
    }
    .underline{
        width: 9.796875rem /* 1881/192 */;
        height: .010417rem /* 2/192 */;
        background: url("~@/views/bigScreen/images/顶部线.png") no-repeat center center;
        background-size: 100% 100%;
        margin: 0 $size20;
    }
}
</style>