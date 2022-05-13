/**
 * 当前版本地图是打开过会重新加载的，已过滤查询的英文字段
 * */ 
import tfLegend from "@/views/zhpt/common/Legend";
import tfTableLegend from '@/views/zhpt/common/TableLegend';
import initConfig  from './config';
import tool  from './tool';
import { esriConfig, appconfig } from 'staticPub/config';
import { loadModules } from 'esri-loader';
import { queryTaskArrange, addTaskArrange, editTaskArrange, deleteTaskArrange, submitPauseCheckInfo,
        submitAbandonCheckInfo, xjRoundDispose, queryDetail, getGroupPersonById,queryRegionRelation,stopList,cancleList } from '@/api/xjDailyManageApi'
import { disposeXjType } from '@/api/xjApi'
import { queryBuildList  } from '@/api/xjWorkSiteCheckApi'
import { queryXjPoint,queryXjLine } from '@/api/xjDailyManageApi'
import { queryDangerReport } from '@/api/xjHiddenDangerManageApi'
import { getGroupUserMap} from '@/api/base'
import { graphic } from 'echarts/lib/export';
import { stringify } from "qs";
export default {
    name: 'wxCheck',
    components: { },
    components: { tfTableLegend, tfLegend },
    props: { data: Object,
            acceptData:{
                monthId:String,//月份
                planType:String,//计划类型
                editButton:Boolean,//是否展示编辑按钮
                flag:1//共享人的id
            } 
        },
    computed: { watchMonthId() {  
                    if(this.acceptData){
                        return this.acceptData.monthId
                    }
                },showWatch(){
                    if(this.acceptData){
                        return this.acceptData.editButton
                    }
                }},    
    data() {
        return {
            searchModel:{//查询模块
                input:{//多选获取的输入是数组，但后端获取的是字符串，多个值使用逗号进行隔开，故这里将输入和实际发送请求的数据分开
                    timeForMission:"",//巡查日期
                    chooseGroup:"",//部门
                    chooseWorker:"",//人员
                    planType:"",//巡检类型
                    isDispatching:"0",//是否派工
                    state:""//状态
                },
                pageInfo:{
                    size:10,//当前每页显示条数
                    current:1,//当前第几页
                    pageSizes:[10, 25, 50, 100]//可改变的页数
                },
                buttonShow:{
                    editButton:true//是否展示编辑按钮
                },
                sendInfo:{//查询请求发送的数据
                    timeForMission:"",//巡查日期
                    chooseGroup:"",//部门
                    chooseWorker:"",//人员
                    planType:"",//巡检类型
                    state:"",//状态
                    size:"",//当前每页显示条数
                    current:"",//当前第几页
                    mouthId:""//月份
                },
                optionData:{//查询前获取的下拉框数据
                    planType:[],//巡检类型数据
                    chooseWorker:[],//人员数据
                    chooseGroup:[],//部门数据
                    workerAndGroup:[],//部门与人员数据
                    state:[]//状态数据
                },
                getData:{//查询获取的后端数据
                    tableTotal:0,//总页数
                    selectRow:[],//列表中勾选选中的数据
                    currentRow:null,//列表中当前高亮的数据
                    allRow:[]//查询出的所以数据
                }
            },
            addOrUpdateOrLook:'',//add表示新增，update表示修改,'look',表示查看
            buttonControl:{//控制按钮的启用与禁用
                canAlert:true,//控制修改按钮，初始化默认禁用状态
                canDelete:true//控制删除按钮，初始化默认禁用状态
            },
            arcgis:{//arcgis相关的对象
                GeometryService: null, //GeometryService服务类   
                LengthsParameters: null, //GeometryService计算长度的参数
                geometryEngine:null,//geometryEngine图形操作工具类
                Polygon:null,//多边形类
            },
            regionLayerId:17,//获取片区图层的ID条件
            comLayerList:{//本模块通用的图层
                regionLayer:null,//当前巡检组下的片区图层
                highLayer:null,//高亮图层
                drawLayer:null//绘制图层
            },
            comColorList:{//图层颜色管理
                highColor:"#00FFFF",//高亮图层颜色
                planColor:"#1E90FF",//计划图层颜色
                regionLineColor:[64,224,208,0],//片区线的颜色
                regionInColor:[255,165,0,0.2],//片区内部颜色
            },
            pageShow:{//控制页面的显示隐藏
                makePlan:false,//控制计划制定页面的显示和隐藏
                lookPlan:false,//控制查看计划页面的显示与隐藏
                buttonShow:false,//制定按钮的显示与隐藏
                showPlanRound:true,//控制巡检周期的显示
                userDraw:true,//是否可以绘制范围
                showPlace:true,//片区是否显示
                sendPlan:false,//提交按钮是否禁用
                diaVisiable:false//查看页面的展示与隐藏
            },
            planModel:{//制定计划模块
                optionData:{//制定计划时下拉内容
                    planType:[],//巡检类型数据
                    chooseWorker:[],//人员数据
                    chooseGroup:[],//部门数据
                    workerAndGroup:[],//部门与人员数据
                    period:[],//巡检周期
                    state:[],//是否排工
                    layerNames:[]//图层信息
                },
                initInput:null,
                input:{//制定计划时输入的内容
                    pickerOptions:{ disabledDate(time) {} },//时间选择的控制
                    pickerOptions2:{ disabledDate(time) {} },//时间选择的控制
                    planType:"",//巡检类型数据
                    planTypeInfo:[],//巡检类型数据的详细信息
                    currentPlanTypeName:0,//当前展示的巡检类型数据的名称
                    chooseWorker:"",//人员数据
                    chooseGroup:"",//部门数据
                    period:"",//巡检周期
                    createUser:"",//创建人
                    periodDay:"",//周期天数
                    dayPlanTime:"",//巡查时间
                    dayPlanTime2:"",//巡查时间(按月)
                    planPercent:100,//完成率
                    state:"",//是否排工
                    planState:""//计划状态
                },
                inputPlans:{//多个计划下,每个计划的内容
                    plans:[{//每个计划需要保存的信息
                        layers:[],
                        name:"",
                        geometry:"",
                    }]
                },
                editInfo:{//计划详细信息
                    description:"",//备注
                    inspectContents:"",//查询内容
                    inspectGroupId:"",//巡检组Id
                    inspectType:"",//巡检类型
                    createUser:"",//创建人
                    inspectUsers:"",//巡检人
                    inspectUserList:"",
                    intervalDay:"",//间隔天数
                    planPercent:100,//计划完成率
                    planBegindate:"",//巡检计划开始时间
                    planEnddate:"",//巡检计划结束时间
                    planType:"3",//计划类型（日常任务都为临时性任务，默认为3）
                    regionId:"",//所属片区编码
                    regionName:"",//片区名称
                    isDispatching:"1",//默认派工
                    planState:"",//状态
                    periodId:"",//巡查周期
                    totalCount:"",
                    totalLength:0,
                    id:"",//id
                    mouthId:"",//月份
                    pointTempList:[
                        { geometry:"",//几何信息
                        lat:"",//纬度
                        lng:""
                    }]//点信息列表集合
                },
                regionInfo:{//片区信息
                    allRegions:[],//所有的片区
                    currentRegion:null,//当前的片区
                    singleRegin:null,//巡检组固定的时候保存其巡检组
                    currentRegionGeo:null,//绘制的图形
                },
                updatePlan:[]//数据更新时的数据
            },
            hasGroup:false,//登陆用户是否属于一个巡检组
            drawInfo:{//绘制信息集合
                drawEvent:null,//绘制事件
                drawColor:[255,0,0,0.4],//绘制图层颜色
            },
            dateShow:{//时间选择的切换（天和月的切换）
                moreDate:true,
                singeDate:false
            },
            splitMonth:1000,//切割查询出的objectids（用于server查询）
            breakLength:10,//打断参数
            setIntervalEvent:null,//定时事件
            serverSearch:{//图层查询集合
                queText:"",//查询条件
                analysisAtt:"",//图层字段
                layerFix:""//字段的取值
            }
        }
    },
    mounted: function() {
        //初始化部分配置
        this.initConfigInfo();
        //获取巡检类型下拉框
        this.initXjType();
        //获取巡检组
        this.getGroupUserMap(); 
        //配置巡检周期
        this.disposeDayPlanRound();
        //保存输入框的默认配置
        this.planModel.initInput=tool.copyValue(this.planModel.input);
        //添加本模块使用的地图
        this.addMap();
        //获取图层信息
        this.getLayerInfo();
    },
    watch:{
        //监听月份变化
        "watchMonthId":function(){
            this.getData();
        },
        //编辑按钮是否展示
        "showWatch":function(){
            if(this.acceptData&&typeof(this.acceptData.editButton)=='boolean'){
                this.searchModel.buttonShow.editButton=this.acceptData.editButton;
            }
        },
        //查询页面信息改变时（页面显示条数及当前第几页）
        "searchModel.pageInfo.current":function(){
            this.getData();
        },
        "searchModel.pageInfo.size":function(){
            this.getData();
        },
        //监听选项卡的改变
        "planModel.input.currentPlanTypeName":function(){
            this.paneHandleClick();
        }
    },
    created() { },
    destroyed(){
        this.controlComLayer("destory");
        if(this.mapV&&this.mapV.map){
            this.mapV.map.removeAll();
            this.mapV.destroy();
        }
    },
    methods: {
        /**
         * 初始化部分配置
         * */
        initConfigInfo(){
            this.searchModel.optionData.state=initConfig.state;
            if(this.acceptData&&(this.acceptData.planType||this.acceptData.planType=="0")){
                this.planModel.editInfo.planType=this.acceptData.planType;
            }
        },

        /**
        * 初始化巡检类型
        */
        initXjType(){
            let data={
                size:10000,
				current:1,
            }
            disposeXjType(data).then(res => {
                this.searchModel.optionData.planType=res.result.records;
                this.planModel.optionData.planType=res.result.records;
            }).catch(err => {
                console.log(err);
            });
        },

        /**
         * 获取当前用户下的所有巡检组和人员并初始化巡检组下拉内容
         * */
        getGroupUserMap(){
            let data={
                size:10000,
                current:1
            }
            getGroupUserMap(data).then(res=>{
                let userId=this.$store.state.user.userId;                                                                                     
                //初始化显示所有人
                let addUser=[];
                let addUser2=[];
                res.result.groupUserDeptVoList.forEach(item=>{
                    addUser.push({id:item.userId,name:item.userName});
                    addUser2.push({id:item.userId,name:item.userName});
                })
                let planWorkerAndGroup=this.planModel.optionData.workerAndGroup;
                let searchWorkerAndGroup=this.searchModel.optionData.workerAndGroup
                res.result.groupUserVoList.forEach(item=>{
                    let index=planWorkerAndGroup.findIndex(item2=>{ return item2.id==item.groupId});
                    if(userId==item.userId){
                        this.hasGroup=true;
                        this.searchModel.input.chooseGroup=item.groupId;
                        this.planModel.input.chooseGroup=item.groupId;
                    }
                    if(index==-1){
                        planWorkerAndGroup.push({index:planWorkerAndGroup.length+0,id:item.groupId,name:item.groupName,data:[{id:item.userId,name:item.userIdName}]})
                        searchWorkerAndGroup.push({index:planWorkerAndGroup.length+0,id:item.groupId,name:item.groupName,data:[{id:"",name:'全部'},{id:item.userId,name:item.userIdName}]})
                    }else{
                        planWorkerAndGroup[index].data.push({id:item.userId,name:item.userIdName});
                        searchWorkerAndGroup[index].data.push({id:item.userId,name:item.userIdName});
                    }
                    if(item.userId&&item.userIdName){
                        addUser.push({id:item.userId,name:item.userIdName});
                        addUser2.push({id:item.userId,name:item.userIdName});
                    }
                });
                addUser.unshift({id:'',name:'全部'});
                searchWorkerAndGroup.unshift({id:"",name:"全部",data:addUser});
                planWorkerAndGroup.unshift({id:"",name:"全部",data:addUser2});
                if(!this.hasGroup){
                    this.searchModel.input.chooseGroup="";
                    this.planModel.input.chooseGroup="";
                    this.searchModel.optionData.chooseWorker=addUser;
                    this.planModel.optionData.chooseWorker=addUser2;
                }else{
                    let sIndex=searchWorkerAndGroup.findIndex(item=>{ return item.id== this.searchModel.input.chooseGroup});
                    let aIndex=planWorkerAndGroup.findIndex(item=>{return item.id== this.planModel.input.chooseGroup});
                    this.searchModel.optionData.chooseWorker=searchWorkerAndGroup[sIndex].data;
                    this.planModel.optionData.chooseWorker=planWorkerAndGroup[aIndex].data;
                }
                this.searchModel.optionData.chooseGroup=tool.copyValue(searchWorkerAndGroup);
                this.planModel.optionData.chooseGroup=tool.copyValue(planWorkerAndGroup);
                //获取片区图形信息
                this.getAllRegions();
                this.$nextTick(()=>{
                    //获取首页表格数据
                    this.getData(); 
                })
            })
        },

        /**
         * 获取首页表单数据
         */
        getData() {
            this.dataT1 = [];
            //将修改和删除按钮重置为不可操作
            tool.setVaule(this.buttonControl,true);
            if(!this.timeForMission){
                this.timeForMission="";
            }
            let user=[];
            if(this.searchModel.input.chooseWorker==''){
                this.searchModel.optionData.chooseWorker.forEach(item=>{
                    if(item.id!=""){
                        user.push(item.id)
                    }
                })
            }else{
                user=[this.searchModel.input.chooseWorker];
            }
            let data = {
                current: this.searchModel.pageInfo.current,
                size: this.searchModel.pageInfo.size,
                // inspectGroupId:this.searchModel.input.chooseGroup,
                // inspectUsers:this.searchModel.input.chooseWorker+"",
                inspectUsers:user.join(','),
                inspectType:this.searchModel.input.planType,
                planState:this.searchModel.input.state,
                isDispatching:this.searchModel.input.isDispatching,
                planBegindate:this.searchModel.input.timeForMission[0]?this.searchModel.input.timeForMission[0]:"",
                planEnddate:this.searchModel.input.timeForMission[1]?(this.searchModel.input.timeForMission[1].split(" ")[0]+" 23:59:59"):"",
                deptId:this.$store.state.user.departmentId
            }
            if(this.acceptData&&this.acceptData.monthId){
                data.mouthId=this.acceptData.monthId;
                data.flag=1;
                delete data.inspectUsers
            }
            queryTaskArrange(data).then(res => {
                this.searchModel.getData.allRow = res.result.records
                this.searchModel.getData.tableTotal = res.result.total
            }).catch(err => {
                console.log(err);
            })
        },

        /**
        * 查询表格翻页改变
        */
        changeCurrent(data) {
            this.searchModel.pageInfo.current = data;
        },

        /**
         * 查询表格页数改变
         * */
        changeSize(data) {
            this.searchModel.pageInfo.size = data;
        },

        /**
         * 查询表格选中时的操作
         * */
        searchTableSelect: function(e, s) {
            this.searchModel.getData.getData=e;
            let typeName="临时性任务"
            if(this.acceptData){ //这里是针对非计划型的编辑
                typeName="月计划"
            }
            //修改按钮能操作的条件(只能选中一个且是未开始、临时性任务的时候才能操作)
            if(e.length ==1&&e[0].isDispatching == '未派工'&&e[0].planType == typeName&&e[0].createUser==this.$store.state.user.userId){
                this.buttonControl.canAlert= false//可修改
            }else{
                this.buttonControl.canAlert = true;//不可修改
            }
            //删除按钮能操作的条件
            if(e.length >0){
                //1.首先必须有选中2.选中的计划必须都是临时性且都未开始的选项
                //是否全部都是临时性计划
                let selectType=e.findIndex(item=>{return item.planType!=typeName||e[0].createUser!=this.$store.state.user.userId});
                //是否全部都是未开始的计划
                let selectState=e.findIndex(item=>{return item.isDispatching!="未派工" });
                //同时满足的情况下才能操作删除按钮
                if(selectType==-1&&selectState==-1){
                    this.buttonControl.canDelete = false //可删除
                }else{
                    this.buttonControl.canDelete = true //不可删除
                }
            }else{
                this.buttonControl.canDelete = true 
            }
        },

        /**
         *计划制定页面的显示与隐藏
         */
        makePageControl:function(show){
            if(show){
                this.pageShow.makePlan=true;
                this.pageShow.buttonShow=true;
            }else{
                this.pageShow.makePlan=false;
                this.pageShow.buttonShow=false;
            }
        },

        /**
         *计划制定
         */
        makeMission: function(type) {
            this.makePageControl(true);
            if(type=='计划制定'){
                this.addOrUpdateOrLook='add';
            }else if(type=='计划修改'){
                this.addOrUpdateOrLook='update';
                //获取计划详情
                queryDetail(this.searchModel.getData.getData[0].id).then(res => {
                    if(res.code==1){
                        this.initUpDateData(res.result)
                    }else{
                        this.$message({type: "info", message: res.message});
                    }
                })
            }
            if(this.hasGroup){
                this.planModel.regionInfo.currentRegion=this.planModel.regionInfo.singleRegin;
                this.drawRegion();
            }
            this.$nextTick(()=>{
                this.loadMap();
            })
        },

        /**
         * 更新数据的初始化
         * */
        initUpDateData(data){
            let inputData=this.planModel.input;
            inputData.chooseGroup=data.inspectGroup?data.inspectGroup:"";   //巡检组赋值
            this.changeGroup();//获取人员
            this.planModel.updatePlan=JSON.parse(data.inspectContents);
            inputData.planType=data.inspectType.split(',').map(item=>{return parseInt(item)});//巡检类型赋值
            this.xjTypeChange();//el-tabs初始化
            inputData.period=data.periodId;
            inputData.createUser=data.createUser;
            inputData.planPercent=data.planPercent;
            inputData.state=data.isDispatching;
            inputData.planState=data.planState;
            this.planModel.editInfo.planType=data.planType;//更新时的巡检类型由更新数据决定
            if(inputData.period!=3){
                inputData.dayPlanTime=[data.planBegindate,data.planEnddate]
            }else{
                let currentDate=data.planBegindate.split(' ')[0];
                let dateArr=currentDate.split('-');
                inputData.dayPlanTime2=dateArr[0]+'-'+dateArr[1];
            }
            //dom更新完毕后
            this.$nextTick(()=>{
                inputData.chooseWorker=data.inspectUserList.split(',').map(item=>{return parseInt(item)});//人员获取完成后，初始赋值
            })
        },

        /**
         * 配置巡检周期
         * */
        disposeDayPlanRound() {
            xjRoundDispose().then(res => {
                this.planModel.optionData.period = res.result.records
            })
        },

        //获取所有片区的图形信息
        getAllRegions(){
            let data={
                where: "1=1",
                outFields: "*",
                returnGeometry: true,
                f: "pjson"
            }
            this.queryServce(data,this.regionLayerId,function(result){
                if(result&&result.features&&result.features.length>0){
                    result.features.forEach(item=>{
                        this.planModel.regionInfo.allRegions.push({
                            id:item.attributes['CODE'],
                            name:item.attributes['NAME'],
                            geometry:item.geometry.rings[0],
                            geometry2:{
                                rings: item.geometry.rings,
                                type:"polygon",
                                spatialReference:this.data.mapView.spatialReference
                            }
                        })
                    })
                }
                //当巡检组固定的时候直接获取当前巡检组的片区
                if(this.hasGroup){
                    //获取片区图形信息
                    this.getRegionIds();
                }
            }.bind(this));
        },
        
        /**
         * 获取根据巡检组获取片区
        */
        getRegionIds(){
            let data = {
                current: 1,
                size: 10000,
                respGroup:parseInt(this.planModel.input.chooseGroup)
            };
            //详情页面不需要,当巡检组是空的时候，将当前巡检片区设置为空
            if(this.planModel.input.chooseGroup){
                queryRegionRelation(data).then(res => {
                    let dataInfo=[];
                    res.result.records.forEach(item=>{
                        let index=this.planModel.regionInfo.allRegions.findIndex(item2=>{return (item2.id+"")==item.regionId})
                        let index2=dataInfo.findIndex(item3=>{return item3.id==item.regionId});
                        if(index!=-1&&index2==-1){
                            dataInfo.push({id:item.regionId,geometry:this.planModel.regionInfo.allRegions[index].geometry,geometry2:this.planModel.regionInfo.allRegions[index].geometry2,name:item.regionName})
                        }
                    });
                    //如果没查询到则将其重置为空的数组
                    if(dataInfo.length==0){
                        this.planModel.regionInfo.currentRegion=null;
                        this.planModel.regionInfo.currentRegionGeo=null;
                    }else{
                        this.planModel.regionInfo.currentRegion=dataInfo;
                    }
                    if(this.hasGroup){
                        this.planModel.regionInfo.singleRegin=this.planModel.regionInfo.currentRegion;
                    };
                    this.drawRegion();
                    if(!this.hasGroup){
                        this.resetHandlePage();
                    }
                });
            }else{
                //如果直接设置为全区域则将其置为null
                this.planModel.regionInfo.currentRegion=null;
                this.planModel.regionInfo.currentRegionGeo=null;
                this.comLayerList.regionLayer.removeAll(); 
                this.resetHandlePage();
            }
        },

        /**
         * 绘制片区
        */
        drawRegion(){
            let rings=[];
            if(this.planModel.regionInfo.currentRegion&&this.planModel.regionInfo.currentRegion.length>0){
                this.planModel.regionInfo.currentRegion.forEach(item=>{
                    rings.push(item.geometry);
                })
                const polygon = {
                    rings: rings,
                    type:"polygon",
                    spatialReference:this.mapV.spatialReference
                };
                this.planModel.regionInfo.currentRegionGeo=polygon;
                var symbol = {
                    type: "simple-fill",  // autocasts as new SimpleFillSymbol()
                    color: this.comColorList.regionInColor,
                    style: "solid",
                    outline: {  // autocasts as new SimpleLineSymbol()
                        color: this.comColorList.regionLineColor,
                        width: 1
                    }
                };
                let polygonGra=new this.data.mapView.TF_graphic({
                    geometry:polygon,
                    symbol: symbol
                });
                this.comLayerList.regionLayer.removeAll(); 
                this.comLayerList.regionLayer.add(polygonGra);
            } 
        },

        /**
         * 在模块打开的时候预先加载地图
        */
        addMap(){
            var that = this
            var div = this.$refs.cctvMap
            loadModules(
            ['esri/Map','esri/views/MapView',"esri/tasks/GeometryService",
            "esri/tasks/support/LengthsParameters","esri/geometry/geometryEngine",
            "esri/geometry/Polygon",'esri/layers/WebTileLayer','esri/Basemap',
            'esri/layers/TileLayer','esri/layers/MapImageLayer','esri/layers/support/LOD',"esri/config"],
            { url: esriConfig.baseUrl }).then((
            [Map,MapView,GeometryService,LengthsParameters,geometryEngine,Polygon,
                WebTileLayer,Basemap,TileLayer,MapImageLayer,Lod,mapConfig]
            ) => {
                mapConfig.fontsUrl = esriConfig.font_url
                var layerType = { 'webTiled': WebTileLayer, 'dynamic': MapImageLayer, 'tiled': TileLayer }
                var layersConfig
                var aconfig = appconfig
                var key = aconfig.isonline ? aconfig.tianMapKey : ''
                var baselayers
                // 判断在线/离线 设置天地图底图
                var tileInfo = aconfig.isonline ?{
                    visible: true,
                    // 天地图提供了’t0’,‘t1’,‘t2’,‘t3’,‘t4’,‘t5’,‘t6’,'t7’8个域名，服务端TCP最大链接数是有限制的，轮询机制下瓦片下载的速度更有保证； 
                    subDomains: '01234567'.split('').map(e => 't' + e),
                    tileInfo: {
                        rows: 256, cols: 256, origin: { x: -180, y: 90 }, spatialReference: { wkid: 4490 },
                        lods: Array.from({length:20}, (e, i) => i).map((e, i) => { return {level: i + 2, levelValue: i + 2, resolution: 0.3515625 / Math.pow(2, i), scale: 147748796.52937502 / Math.pow(2, i)}})
                    }, spatialReference: 4490, fullExtent: { xmin: -180, ymin: -90, xmax: 180, ymax: 90, spatialReference: 4490 }
                    } : { visible: true }
                    layersConfig = aconfig.isonline ? [
                    [ aconfig.gisResource.tian_online_vector.config[0].url, aconfig.gisResource.tian_online_vector.type ], 
                    [ aconfig.gisResource.tian_online_vector_label.config[0].url, aconfig.gisResource.tian_online_vector_label.type ], 
                    [ aconfig.gisResource.business_map.config[0].url, aconfig.gisResource.business_map.type ]
                    ] : [
                    [ aconfig.gisResource.tian_offline_vector.config[0].url, aconfig.gisResource.tian_offline_vector.type ], 
                    [ aconfig.gisResource.tian_offline_vector_label.config[0].url, aconfig.gisResource.tian_offline_vector_label.type ], 
                    [ aconfig.gisResource.business_map.config[0].url, aconfig.gisResource.business_map.type ]
                ]
                baselayers = [
                    new layerType[layersConfig[0][1]](layersConfig[0][0] + key, tileInfo),
                    new layerType[layersConfig[1][1]](layersConfig[1][0] + key, tileInfo),
                    new layerType[layersConfig[2][1]]({ url: layersConfig[2][0] }),
                    ]
                // 底图
                var basemap = new Basemap({
                        baseLayers: baselayers,
                        title: 'basemap',
                        id: 'basemap'
                    })
                // 地图视角设置缩放步进级别
                basemap.baseLayers.items[2].load().then((e) => {
                    mapview.constraints.lods = [125000, 64000, 32000, 16000, 8000, 4000, 2000, 1000, 500].map((s, i) => { return new Lod({ level: i, scale: s }) })
                })
                let map = new Map({ basemap: basemap });
                let mapview = new MapView({
                    container: div,
                    map: map,
                    spatialReference: { wkid: 4490 }
                });
                that.mapV = mapview;
                var mapV = mapview;
                mapview.ui.components = []
                mapview.constraints.lods = mapV.constraints.lods
                this.controlComLayer("init");
                this.regionShow();
                this.arcgis.GeometryService = GeometryService ;
                this.arcgis.LengthsParameters= LengthsParameters;
                this.arcgis.geometryEngine= geometryEngine;
                this.arcgis.Polygon = Polygon;
            })
        },

        /**
         * 通用的图层的打开和移除及清理(传入init初始化图层，如果图层已初始化则清空图层内容，
         * 传入destory则删除图层，将 图层移除地图)
        */          
        controlComLayer(action){
            for(let item in this.comLayerList){
                if(action=="init"){
                    if(this.comLayerList[item]){
                        this.comLayerList[item].removeAll();
                    }else{
                        this.comLayerList[item]=new this.data.mapView.TF_graphicsLayer();
                        this.mapV.map.add(this.comLayerList[item]);
                    }
                }else if(action=='destory'){
                    if(this.comLayerList[item]){
                        this.mapV.map.remove(this.comLayerList[item]);
                        this.comLayerList[item]=null;
                    }
                }
            }            
        },

        /**
         * 将地图放置在弹出框中
        */        
        loadMap: function() {
            this.$refs.mapBox.appendChild(this.$refs.cctvMap)
            this.$refs.cctvMap.style.display = ''
            this.mapV.extent = this.data.mapView.extent      
        },

        /**
         * 获取图层信息
        */
        getLayerInfo(){
            $.ajax({
                url: appconfig.gisResource.business_map.config[0].url + "/?f=pjson",
                type: 'GET',
                success: (data) => {
                    data = JSON.parse(data).layers
                    if(!data) return this.$message.error('图层字段获取失败')
                    var tId = [] 
                    for(let i=0,ii=data.length;i<ii;i++){
                    var layer = data[i]
                        // if([0, 16, 17].indexOf(layer.id) < 0){
                        //     tId.push({ value: layer.id, label: layer.name })
                        // }
                        if(layer.parentLayerId!=-1){
                            tId.push({ value: layer.id, label: layer.name })
                        } 
                    }
                    this.planModel.optionData.layerNames= tId
                },
                error: (error) => this.$message.error(error)
            })
        },

        //改变巡检组的情况
        changeGroup(type){
            if(type=="search"){
                let dataList=this.searchModel.optionData.workerAndGroup;
                let index=dataList.findIndex(item=>{ return item.id==this.searchModel.input.chooseGroup});
                let data=dataList[index].data;
                this.searchModel.optionData.chooseWorker=data;
            }else{
                let dataList=this.planModel.optionData.workerAndGroup;
                let index=dataList.findIndex(item=>{return item.id==this.planModel.input.chooseGroup});
                let data=dataList[index].data;
                this.planModel.optionData.chooseWorker=data;
                this.planModel.input.chooseWorker="";
                for(let item in this.planModel.updatePlan){
                    this.planModel.updatePlan[item]=[];
                }
                this.getRegionIds();
            }
        },

        //清空数据
        closeEvent(){
            //清空查询出来的数据
            this.planModel.input.planTypeInfo.forEach(item=>{
                this.resetSingePlanInfo(item);
            })
            //重置输入框内的信息
            let copyInput=tool.copyValue(this.planModel.initInput)
            for(let item in copyInput){
                if(Array.isArray(copyInput[item])){
                    this.planModel.input[item]=copyInput[item];
                }else if  (copyInput[item] instanceof Object){
                    for(let item2 in copyInput[item]){
                        this.planModel.input[item][item2]=copyInput[item][item2];
                    }
                }else{
                    if(this.hasGroup){
                        if(item!='chooseGroup'){
                            this.planModel.input[item]=copyInput[item];
                        }
                    }else{
                        this.planModel.input[item]=copyInput[item];
                    }
                }
            }
            //将绘制事件重置
            if(this.drawInfo.drawEvent){
                this.drawInfo.drawEvent.reset();
            }
            //清楚公共图层
            this.controlComLayer("init");
            //关闭页面
            this.pageShow.userDraw=true;
            this.pageShow.showPlace=true;
            this.pageShow.sendPlan=false;
            //关闭页面
            this.makePageControl(false);
            //详情页面关闭
            this.$nextTick(()=>{
                this.pageShow.diaVisiable = false;
            })
        },

        /**
         * 提交任务制定内容
        */
        taskArrangeSubmit() {
            let tempValue=this.planModel.input;
            let editInfo=this.planModel.editInfo;
            let title="";
            if(tempValue.planType==""&&title==""){
                title='请选择巡检类型！';
            }
            if(tempValue.chooseWorker==""&&title==""){
                title='请选择巡检人员！';
            }
            if(tempValue.period==""&&title==""){
                title='请选择巡检周期';
            }            
            if((!tempValue.dayPlanTime||tempValue.dayPlanTime=="")&&title==""){
                title='请选择巡检时间！';
            }
            if(tempValue.planPercent==""&&title==""){
                title='请填写计划完成率！';
            }
            if(tempValue.planTypeInfo.length==0&&title==""){
                title='请完成计划！';
            }else{
                tempValue.planTypeInfo.forEach(item=>{
                    if(!item.planInfo&&title==""){
                        title='请完成'+item.layerName+'类型的计划！';
                    }else{
                        if(item.planInfo.isCheckData&&item.planInfo.selectData.length==0&&title==""){ //针对需要勾选的计划
                            title='请完成'+item.layerName+'类型的计划！';
                        }else if(!item.planInfo.isCheckData&&item.planInfo.tableData.length==0&&title==""){//针对需要框选的计划
                            title='请完成'+item.layerName+'类型的计划！';
                        }
                    }
                })
            }
            if(title!=""){
                this.$message({type: "info", message: title });
                return;
            }
            editInfo.inspectType=tool.getSelectValue(tempValue.planType);//巡检类型
            editInfo.inspectGroupId=tool.getSelectValue(tempValue.chooseGroup);//巡检组
            editInfo.inspectUsers=tool.getSelectValue(tempValue.chooseWorker).replace(/,/g,';');//巡检人员
            editInfo.planPercent=tempValue.planPercent;//巡检完成率
            editInfo.periodId=tempValue.period;//巡检周期
            let dateList=tool.DateDiff(tempValue.dayPlanTime,tempValue.period,tempValue.periodDay);//获取时间段及时间间隔
            editInfo.planBegindate=dateList.planBegindate;//起始时间
            editInfo.planEnddate=dateList.planEnddate;//截止时间
            editInfo.intervalDay=dateList.intervalDay;//时间段
            editInfo.planType='3'
            editInfo.isDispatching=tempValue.state;//是否派发（非计划型内容由下拉框决定）（与下面的isDispatching设置不重复，分别表示计划与非计划型的赋值）
            if(this.acceptData&&this.acceptData.monthId){//计划型任务默认暂时不派发
                editInfo.mouthId=this.acceptData.monthId;
                editInfo.isDispatching='0';//是否派发
                editInfo.planType='0'
            }
            let messageInfo='';
            //首先循环巡检计划数组，清理是否存在sid缺失的管网设备，如果存在，则不能下达巡检计划
            for(let i=0;i<tempValue.planTypeInfo.length;i++){
                let data=tempValue.planTypeInfo[i];
                if(!data.planInfo.sidExist.exist){
                    this.$message({type: "info", message: data.planInfo.sidExist.layerName+"设备缺少SID设备编码，不能派发任务，请联系管理员处理管网设备数据" });
                    return;
                }
            }
            //处理巡检计划的点及线
            tempValue.planTypeInfo.forEach(item=>{
                if(!item.planInfo.sidExist.exist){
                    messageInfo=item.planInfo.sidExist.layerName
                }
                if(item.layerName== '巡检点'){
                    let planInfo=item.planInfo;
                    if(planInfo.selectData.length>0){
                        planInfo.sendInfo.totalLength=0;
                        planInfo.sendInfo.totalCount=planInfo.selectData.length;
                        planInfo.selectData.forEach(value=>{
                            planInfo.containReg.push(value.regionId);
                            planInfo.containRegNames.push(value.regionName);
                            planInfo.getQueryResult.allSidIds.push(value.id);
                            planInfo.sendInfo.pointTempList.push(tool.getPointTempPointItem(item.typeId,item.layerName,value.lat,value.lng,this.data.mapView.spatialReference));
                        });
                    }
                    planInfo.isComplete=true;//表示该类型在提交前完成计算
                }else if(item.layerName== '隐患点'){
                    let planInfo=item.planInfo;
                    if(planInfo.selectData.length>0){
                        planInfo.sendInfo.totalLength=0;
                        planInfo.sendInfo.totalCount=planInfo.selectData.length;
                        planInfo.selectData.forEach(value=>{
                            planInfo.containReg.push(value.regionId);
                            planInfo.containRegNames.push(value.regionName);
                            planInfo.getQueryResult.allSidIds.push(value.id);
                            planInfo.sendInfo.pointTempList.push(tool.getPointTempPointItem(item.typeId,item.layerName,value.lttd,value.lgtd,this.data.mapView.spatialReference));
                        })
                    }
                    planInfo.isComplete=true;//表示该类型在提交前完成计算
                }else if(item.layerName== '工地监护点'){
                    let planInfo=item.planInfo;
                    if(planInfo.selectData.length>0){
                        planInfo.sendInfo.totalLength=0;
                        planInfo.sendInfo.totalCount=planInfo.selectData.length;
                        planInfo.selectData.forEach(value=>{
                            planInfo.containReg.push(value.regionId);
                            planInfo.containRegNames.push(value.regionName);
                            planInfo.getQueryResult.allSidIds.push(value.id);
                            planInfo.sendInfo.pointTempList.push(tool.getPointTempPointItem(item.typeId,item.layerName,value.lttd,value.lgtd,this.data.mapView.spatialReference));
                        })
                    }
                    planInfo.isComplete=true;//表示该类型在提交前完成计算
                }else if(item.layerName== '巡检线'){
                    let planInfo=item.planInfo;
                    if(planInfo.selectData.length>0){
                        let polylines=[];
                        planInfo.selectData.forEach(value=>{
                            planInfo.sendInfo.totalLength+=parseFloat(value.length);
                            planInfo.containReg.push(value.regionId);
                            planInfo.containRegNames.push(value.regionName);
                            planInfo.getQueryResult.allSidIds.push(value.id);
                            let geo = JSON.parse(value.geometry);
                            for(let i=0;i<geo.paths.length;i++){
                            let itemGeometry={
                                    paths: [geo.paths[i]],
                                    spatialReference: this.mapV.spatialReference,
                                    type: "polyline"
                                }
                                polylines.push(itemGeometry);
                            }
                        })
                        this.mathLength({polylines:polylines},item);
                    }
                }else if(item.layerName== '管线'){
                    this.conductPipe(item);
                }else{
                    this.conductPoint(item);//其它节点
                }
            });
            //因为有异步计算长度，所有这里使用定时任务进行监听
            this.setIntervalEvent=window.setInterval(function(){
                let index= this.planModel.input.planTypeInfo.findIndex(item=>{return item.planInfo.isComplete==false});
                if(index==-1){
                    window.clearInterval(this.setIntervalEvent);
                    this.pageShow.sendPlan=true;//提交按钮禁用
                    let regionId=[];
                    let regionName=[];
                    let totalCount=0;
                    let totalLength=0;
                    let pointTempList=[];
                    let inspectContents=[];
                    this.planModel.input.planTypeInfo.forEach(item=>{//组装计划信息
                        let planInfo=item.planInfo;
                        regionId=regionId.concat(planInfo.containReg);
                        regionName=regionName.concat(planInfo.containRegNames);
                        totalCount+=planInfo.sendInfo.totalCount;
                        totalLength+=planInfo.sendInfo.totalLength;
                        inspectContents.push({
                            layerName:item.layerName,
                            layerId:item.layerId,
                            typeId:item.typeId,
                            data:item.planInfo.getQueryResult.allSidIds
                        })
                        pointTempList=pointTempList.concat(planInfo.sendInfo.pointTempList)
                    });
                    editInfo.inspectContents=JSON.stringify(inspectContents);
                    editInfo.pointTempList=pointTempList;//涉及的临时点
                    editInfo.regionId=tool.arrayToHeavy(regionId).join(',');//涉及的片区ID
                    editInfo.regionName=tool.arrayToHeavy(regionName).join(',');//涉及的片区名称
                    editInfo.totalCount=totalCount;//总个数
                    editInfo.totalLength=totalLength;//总长度
                    let send=null
                    if(this.addOrUpdateOrLook=='add'){
                        send=addTaskArrange;
                        delete editInfo.planState;
                    }else if(this.addOrUpdateOrLook=='update'){
                        send=editTaskArrange;
                        editInfo.id=this.searchModel.getData.getData[0].id;
                        editInfo.planState=tempValue.planState;
                        editInfo.createUser=tempValue.createUser;
                        if(this.acceptData){
                            editInfo.mouthId=this.acceptData.monthId;
                        }else{
                            editInfo.mouthId='';
                        }
                    }
                    send(editInfo).then(res => {
                        let messageText='制定成功';
                        if(res.message){
                            messageText=res.message;
                        }
                        this.closeEvent();
                        this.$message({type: "success", message: messageText });
                        this.getData();
                    })
                }
            }.bind(this),200)
        },
        //取消提交任务
        cancelSubmit() {
            this.closeEvent();
        },

        //点击主页面删除按钮后触发
        taskArrangeDelete() {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                this.confirmDelete()
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        //确认删除时触发
        confirmDelete() {
            const ids = []
            for (let i = 0; i < this.searchModel.getData.getData.length; i++) {
                ids.push(this.searchModel.getData.getData[i].id)
            }
            const data = {
                idList: ids.toString()
            }
            deleteTaskArrange(data).then(res => {
                let messageText='删除成功';
                if(res.message){
                    messageText=res.message;
                }
                this.$message.success(messageText);
                this.getData();
            })
            this.dialogDelete = false
        },

        //时间选择器切换
        changeDate(show){
            if(show){
                this.dateShow.moreDate=true;
                this.dateShow.singeDate=false;          
            }else{
                this.dateShow.moreDate=false;
                this.dateShow.singeDate=true; 
            }
        },

        //选择月份的时间
        moreDateChange(){
            this.dayPlanTime=this.dayPlanTimeMonth;
        },

        //选择巡查周期时触发
        chooseCheckPeriod() {
            let input=this.planModel.input;
            input.pickerOptions.onPick = item => { };
            input.pickerOptions.disabledDate = item => { };
            input.pickerOptions2.onPick = item => { };
            input.pickerOptions2.disabledDate = item => { };
            input.dayPlanTime = "";
            input.dayPlanTime2 ="";
            if (input.period == 1) { //一天一巡
                this.pageShow.showPlanRound = true
                this.changeDate(true);
                //从当天开始的一天一巡检
                input.pickerOptions.disabledDate = time => (time.getTime() < Date.now() - 8.64e7)
                //从第二天开始的一天一巡检
                //input.pickerOptions.disabledDate = time => (time.getTime() < Date.now() );
            } else if (input.period == 2) { //一周一巡
                this.pageShow.showPlanRound = true;
                this.changeDate(true);
                let dayList = tool.getTime();
                let mondayTime = new Date(dayList.mondayTime).getDay();
                let sundayTime = new Date(dayList.sundayTime).getDay();
                let splitTime = new Date(dayList.sundayTime);
                input.pickerOptions.disabledDate = time => { return (time.getTime() <= splitTime || time.getDay() != mondayTime) };
                input.pickerOptions.onPick = (data) => {
                    if (data.minDate && !data.maxDate) {
                        input.pickerOptions.disabledDate = time => ((time.getFullYear() + "" + time.getMonth() + "" + time.getDate()) !=
                            (data.minDate.getFullYear() + "" + data.minDate.getMonth() + "" + data.minDate.getDate()) && (time.getTime() <
                                data.minDate.getTime() || time.getDay() != sundayTime));
                    }
                    if (data.minDate && data.maxDate) {
                        input.pickerOptions.disabledDate = time => { return (time.getTime() < splitTime || time.getDay() != mondayTime) };
                    }
                }
            } else if (input.period== 3) { //一月一巡
                this.pageShow.showPlanRound= true;
                this.changeDate(false);
                input.pickerOptions2.disabledDate = time => (time.getTime() < Date.now() - 8.64e7);
            } else if (input.period== 4) { //自定义
                this.pageShow.showPlanRound= false;
                this.changeDate(true);
                this.periodDay = '';
                input.pickerOptions.disabledDate = time => (time.getTime() < Date.now() - 8.64e7)
                input.pickerOptions.onPick = (data) => {
                    if (data.minDate && !data.maxDate) {
                        let dataTime = data.minDate.getTime() + 24 * 60 * 60 * 1000 * parseInt(input.periodDay - 1);
                        let nextDay = new Date(dataTime);
                        input.pickerOptions.disabledDate = time => {
                            let timeDate = time.getFullYear() + "" + time.getMonth() + "" + time.getDate();
                            let fristDate = data.minDate.getFullYear() + "" + data.minDate.getMonth() + "" + data.minDate.getDate();
                            let nextDate = nextDay.getFullYear() + "" + nextDay.getMonth() + "" + nextDay.getDate()
                            return (timeDate != fristDate && timeDate != nextDate)
                        };
                    }
                    if (data.minDate && data.maxDate) {
                        input.pickerOptions.disabledDate = time => (time.getTime() < Date.now() - 8.64e7)
                    }
                }
            }
        },
    
        //展示详细信息
        planInfo: function(e) {
            this.pageShow.diaVisiable = true //显示详细页面弹窗
            this.$nextTick(()=>{
                this.addOrUpdateOrLook='look';
                //初始化部分数据
                this.$refs.xjType.innerHTML = '<span class="flexTitle">巡查类型：</span>' + '<span class="flexInfo">' + e.inspectType + '</span>'
                this.$refs.xjGroup.innerHTML = '<span class="flexTitle">巡查组：</span>' + '<span class="flexInfo">' + (e.inspectGroup==""?"全部":e.inspectGroup) + '</span>'
                this.$refs.xjWorker.innerHTML = '<span class="flexTitle">巡查人：</span>' + '<span class="flexInfo">' + e.inspectUserList + '</span>'
                this.$refs.xjBeginAndEndTime.innerHTML = '<span class="flexTitle">起止时间：</span>' + '<span class="flexInfo">' + e.planBegindate + ' - ' + e.planEnddate + '</span>',
                this.$refs.xjPlanNumber.innerHTML = '<span class="flexTitle">计划完成率：</span>' + '<span class="flexInfo">' + e.planPercent+'%</span>'
                this.$refs.mapBox1.appendChild(this.$refs.cctvMap);
                this.$refs.cctvMap.style.display = '';
                this.mapV.extent=this.data.mapView.extent;
                //获取计划详情
                queryDetail(e.id).then(res => {
                    if(res.code==1){
                        this.initUpDateData(res.result)
                    }else{
                        this.$message({type: "info", message: res.message});
                    }
                }) 
            })
            
        },

        /**
         * 处理地图点数据(points格式[[x,y]])
        */
        addPointToMap(points,layer){
            this.clearLayer(layer);
            let mapView = this.mapV;
            let sp = mapView.spatialReference;
            let Graphic = this.data.mapView.TF_graphic;
            let multipoint = {
                type: "multipoint",
                points: points,
                spatialReference: sp
            };
            const simpleMarkerSymbol = {
                path:
                "M527.676 51c146.71 0 265.919 117.742 268.288 263.887l0.036 4.437C789.928 444.319 695.261 606.878 512 807 329.564 606.484 234.897 443.926 228 319.324 228 171.133 348.133 51 496.324 51h31.352z m-15.31 53h-0.732C390.886 104 293 201.886 293 322.634 298.319 424.162 371.319 556.617 512 720c141.318-163.062 214.318-295.518 219-397.366l-0.03-3.615C729.04 199.938 631.908 104 512.367 104z M512 171c86.709 0 157 70.291 157 157s-70.291 157-157 157-157-70.291-157-157 70.291-157 157-157z m0.5 55C455.89 226 410 271.89 410 328.5S455.89 431 512.5 431 615 385.11 615 328.5 569.11 226 512.5 226z",
                color: this.comColorList.planColor,
                outline: {color: this.comColorList.planColor, width: "1px" },
                size: "30px",
                yoffset: "15px",
                xoffset: "0px",
                type: "simple-marker"
            };
            let graphic = new Graphic({
                geometry: multipoint,
                symbol: simpleMarkerSymbol
            });
            layer.add(graphic);
        },

        //处理线地图数据(lines的格式[[[x,y],[x1,x2]],[[x3,y3],[x4,x4]]])
        addLineToMap(lines,layer){
            this.clearLayer(layer);
            let mapView = this.mapV;
            let sp = mapView.spatialReference;
            let Graphic = this.data.mapView.TF_graphic;
            let lineSymbol = {
                color: this.comColorList.planColor,
                width: "2px",
                type:"simple-line"
            };
            let graphic = new Graphic({
                geometry: {
                    paths: lines,
                    spatialReference:sp,
                    type: "polyline"
                },
                symbol: lineSymbol
            });
            layer.add(graphic);
        },
        //高亮点及定位pointData的格式[x,y]
        highPointToMap(pointData){
            this.clearLayer(this.comLayerList.highLayer);
            let point = {
                type: "point",
                latitude: pointData[0],
                longitude: pointData[1],
                spatialReference: this.data.mapView.spatialReference
            };
            const simpleMarkerSymbol = {
                path:
                "M527.676 51c146.71 0 265.919 117.742 268.288 263.887l0.036 4.437C789.928 444.319 695.261 606.878 512 807 329.564 606.484 234.897 443.926 228 319.324 228 171.133 348.133 51 496.324 51h31.352z m-15.31 53h-0.732C390.886 104 293 201.886 293 322.634 298.319 424.162 371.319 556.617 512 720c141.318-163.062 214.318-295.518 219-397.366l-0.03-3.615C729.04 199.938 631.908 104 512.367 104z M512 171c86.709 0 157 70.291 157 157s-70.291 157-157 157-157-70.291-157-157 70.291-157 157-157z m0.5 55C455.89 226 410 271.89 410 328.5S455.89 431 512.5 431 615 385.11 615 328.5 569.11 226 512.5 226z",
                color: this.comColorList.highColor,
                outline: { color: this.comColorList.highColor, width: "1px" },
                size: "30px",
                yoffset: "15px",
                xoffset: "0px",
                type: "simple-marker"
            };
            let graphic = new this.data.mapView.TF_graphic({
                geometry: point,
                symbol: simpleMarkerSymbol
            });
            let gotoJson = {
                target:graphic,
                zoom: 15
            };
            this.mapV.goTo(gotoJson);
            this.comLayerList.highLayer.add(graphic);
        },
        //高亮线及定位(lines的格式[[[x,y],[x1,x2]],[[x3,y3],[x4,x4]]])
        hLineToMap(lines){
            this.clearLayer(this.comLayerList.highLayer);
            let mapView = this.mapV;
            let sp = mapView.spatialReference;
            let Graphic = this.data.mapView.TF_graphic;
            let lineSymbol = {
                color: this.comColorList.highColor,
                width: "2px",
                type:"simple-line"
            };
            let graphic = new Graphic({
                geometry: {
                    paths: lines,
                    spatialReference: mapView.spatialReference,
                    type: "polyline"
                },
                symbol: lineSymbol
            });
            mapView.extent = graphic.geometry.extent;
            this.comLayerList.highLayer.add(graphic);
        },

        /**
         * 计算长度
         * */
        mathLength(data,planItem) {
            let url = "";
            let sendInfo=planItem.planInfo.sendInfo;
            data.pointTempList=[];
            if(!data.polylines||data.polylines.length==0){
                return;
            }
            if (
                !appconfig.gisResource.geometry ||
                !appconfig.gisResource.geometry.config[0] ||
                !appconfig.gisResource.geometry.config[0].url
            ) {
                url =
                "http://192.168.2.245:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer";
            } else {
                url = appconfig.gisResource.geometry.config[0].url;
            }
            let geometryService = new this.arcgis.GeometryService(url);
            let lengthsParameters = new this.arcgis.LengthsParameters({
                geodesic: true,
                polylines: data.polylines,
                lengthUnit: this.arcgis.GeometryService.UNIT_METER
            });
            geometryService.lengths(lengthsParameters).then(res => {
                if(planItem.layerName=='管线'){
                    if (res && res.lengths && res.lengths.length > 0) {
                        res.lengths.forEach((item,index)=>{
                            sendInfo.pointTempList.push({
                                "inspectTypeId":planItem.typeId,
                                "layerName":planItem.layerName,
                                "lat":data.polylines[index].paths[0][1][1],
                                "lng":data.polylines[index].paths[0][1][0],
                                "length":item,
                                "geometry":JSON.stringify(data.polylines[index]),
                            })
                        })
                    }
                }else if(planItem.layerName=='巡检线'){
                    if (res && res.lengths && res.lengths.length > 0) {
                        sendInfo.pointTempList.push({
                            "inspectTypeId":planItem.typeId,
                            "layerName":planItem.layerName,
                            "lat":  data.polylines[0].paths[0][0][1],
                            "lng":data.polylines[0].paths[0][0][0],
                            "length":0,
                            "geometry":JSON.stringify(data.polylines[0]),
                        });
                        res.lengths.forEach((item,index)=>{
                            sendInfo.pointTempList.push({
                                "inspectTypeId":planItem.typeId,
                                "layerName":planItem.layerName,
                                "lat":data.polylines[index].paths[0][1][1],
                                "lng":data.polylines[index].paths[0][1][0],
                                "length":item,
                                "geometry":JSON.stringify(data.polylines[index]),
                            })
                        })
                    }
                }
                sendInfo.totalCount=sendInfo.pointTempList.length;
                planItem.planInfo.isComplete=true;//表示该类型在提交前完成计算
            });
        },

        /**
         * 打断线并求取长度
        */
        breakLine(currentData){
            let overlengthPipe=currentData.planInfo.overlengthPipe;
            var cnum = overlengthPipe.paths.length;
            let lengths= overlengthPipe.lengths;
            let polylines=[];
            let d=this.breakLength;
            for (var i = 0; i < cnum; i++) {
                var len = lengths[i];
                let path=overlengthPipe.paths[i];
                let pointOne=path[0];
                let pointTwo=path[1];
                let prePoint=path[0];
                if (len > d) {//大于规定距离
                    var count = Math.floor(len / d) - 1;
                    if (count > 0) {
                        var pt1 = pointOne, pt2 = pointTwo;
                        var k = (pt2[1] - pt1[1]) / (pt2[0] - pt1[0]);
                        var mlen = Math.sqrt((pt2[1] - pt1[1]) * (pt2[1] - pt1[1]) + (pt2[0] - pt1[0]) * (pt2[0] - pt1[0]));
                        var md = mlen / (count + 1);
                        var sqk = Math.sqrt(1 + k * k);
                        var dd = md;
                        let x,y;
                        for (var j = 0; j < count; j++) {
                            x = (dd / sqk) + pt1[0];
                            y = (k * dd / sqk) + pt1[1];
                            if ((x > pt1[0] && x > pt2[0]) || (x < pt1[0] && x < pt2[0])) {
                                x = pt1[0] - (dd / sqk);
                            }
                            if ((y > pt1[1] && y > pt2[1]) || (y < pt1[1] && y < pt2[1])) {
                                y = pt1[1] - (k * dd / sqk);
                            }
                            dd = dd + md;
                            polylines.push({
                                paths: [[prePoint,[x,y]]],
                                spatialReference: this.mapV.spatialReference,
                                type: "polyline"
                            });
                            prePoint=[x, y];
                        }
                        polylines.push({
                            paths: [[[x,y],pointTwo]],
                            spatialReference: this.mapV.spatialReference,
                            type: "polyline"
                        })
                    }else{
                        polylines.push({
                            paths: [path],
                            spatialReference: this.mapV.spatialReference,
                            type: "polyline"
                        })
                    }
                }
            }
            this.mathLength({ polylines:polylines},currentData)
        },
        //处理巡检点数据
        planPoint(saveData){
            let planInfo=saveData.planInfo;
            let data = {
                    current: 1,
                    size: 10000
                };
            queryXjPoint(data).then(res => {
                let dataList=[];
                if(this.planModel.regionInfo.currentRegion){
                    res.result.records.forEach(item=>{
                        let index=this.planModel.regionInfo.currentRegion.findIndex(item2=>{return item2.id==item.regionId});
                        if(index!=-1){
                            dataList.push(item);
                        }
                    })
                }else{
                    dataList=res.result.records;
                }
                planInfo.tableData = dataList;
                this.$nextTick(e=>{
                    if(this.addOrUpdateOrLook !="add"){this.toggleSelection(saveData);}
                    let points=[];
                    planInfo.tableData.forEach(item=>{
                        points.push([item.lng,item.lat]);
                    });
                    this.addPointToMap(points,planInfo.layer);
                    planInfo.total = planInfo.tableData.length;
                })
            })
        },
        //处理隐患点数据
        planHidPoint(saveData){
            let planInfo=saveData.planInfo;
            let data = {
                    current: 1,
                    size: 10000,
                    auditResult:"1",//已审核通过
                    state:"1"//未被消除的隐患
                };  
            queryDangerReport(data).then(res => {
                let dataList=[];
                if(this.planModel.regionInfo.currentRegion){
                    res.result.records.forEach(item=>{
                        let index=this.planModel.regionInfo.currentRegion.findIndex(item2=>{return item2.id==item.regionId});
                        if(index!=-1){
                            item.lng=item.lgtd;
                            item.lat=item.lttd;
                            dataList.push(item);
                        }
                    })
                }else{
                    res.result.records.forEach(item=>{
                        item.lng=item.lgtd;
                        item.lat=item.lttd;
                        dataList.push(item);
                    })
                }
                planInfo.tableData = dataList;
                this.$nextTick(e=>{
                    if(this.addOrUpdateOrLook !="add"){this.toggleSelection(saveData);}
                    let points=[];
                    planInfo.tableData.forEach(item=>{
                        item.lng=item.lgtd;
                        item.lat=item.lttd;
                        points.push([item.lgtd,item.lttd]);
                    });
                    this.addPointToMap(points,planInfo.layer);
                    planInfo.total =  planInfo.tableData.length;
                })
            })
        },
         //处理工地监护点数据
        planSitePoint(saveData){
            let planInfo=saveData.planInfo;
            let data = {
                    current: 1,
                    size: 10000,
                    auditResult:"1",//已审核通过
                    state:"1"//未被消除的隐患
                };
            queryBuildList(data).then(res => {
                let dataList=[];
                if(this.planModel.regionInfo.currentRegion){
                    res.result.records.forEach(item=>{
                        let index=this.planModel.regionInfo.currentRegion.findIndex(item2=>{return item2.id==item.regionId});
                        if(index!=-1){
                            item.lng=item.lgtd;
                            item.lat=item.lttd;
                            dataList.push(item);
                        }
                    })
                }else{
                    res.result.records.forEach(item=>{
                        item.lng=item.lgtd;
                        item.lat=item.lttd;
                        dataList.push(item);
                    })
                }
                planInfo.tableData = dataList;
                this.$nextTick(e=>{
                    if(this.addOrUpdateOrLook !="add"){this.toggleSelection(saveData);}
                    let points=[];
                    planInfo.tableData.forEach(item=>{
                        item.lng=item.lgtd;
                        item.lat=item.lttd;
                        points.push([item.lgtd,item.lttd]);
                    });
                    this.addPointToMap(points,planInfo.layer);
                    planInfo.total =  planInfo.tableData.length;
                })
            })
        },
        //巡检线
        planLine(saveData){
            let planInfo=saveData.planInfo;
            let data = {
                    current: 1,
                    size: 10000
                };
            queryXjLine(data).then(res => {
                let lines = [];
                let dataList=[];
                if(this.planModel.regionInfo.currentRegion){
                    res.result.records.forEach(item=>{
                        let index=this.planModel.regionInfo.currentRegion.findIndex(item2=>{return item2.id==item.regionId});
                        if(index!=-1){
                            dataList.push(item);
                        }
                    })
                }else{
                    res.result.records.forEach(item=>{
                        dataList.push(item);
                    })
                }
                planInfo.tableData = dataList;
                this.$nextTick(e=>{
                    if(this.addOrUpdateOrLook !="add"){this.toggleSelection(saveData);}
                    planInfo.total =  planInfo.tableData.length;
                    if (  planInfo.tableData &&   planInfo.tableData.length > 0) { 
                        planInfo.tableData.forEach(item => {
                            if (item.geometry && item.geometry != "") {
                                let geo = JSON.parse(item.geometry);
                                item.geometryPaths=geo.paths;
                                lines.push.apply(lines,geo.paths);
                            }
                        });
                    } else {
                        return;
                    }
                    this.addLineToMap(lines,planInfo.layer);
                })
            });
        },

        /**
         * 修改时默认选中及查看时数据的显示
        */
        toggleSelection(saveData) {
            let planInfo=saveData.planInfo;
            let indexList=[];
            this.planModel.updatePlan.forEach(item=>{
                if(item.typeId==saveData.typeId){
                    indexList =item.data
                }
            });
            if(this.addOrUpdateOrLook=='update'){
                let index=this.planModel.input.planTypeInfo.findIndex(item=>{return item.typeId==saveData.typeId});
                let refDom="datatable"+index;
                let itemList=[];
                planInfo.tableData.forEach(item=>{
                    let index=indexList.findIndex(item2=> {return item2==item.id});
                    if(index!=-1){
                        this.$refs[refDom][0].toggleRowSelection(item,true);
                        itemList.push(item);
                    }
                });
                planInfo.selectData=itemList;
            };
            if(this.addOrUpdateOrLook=='look'){
                let rows=[];
                planInfo.tableData.forEach(item=>{
                    let index=indexList.findIndex(item2=> {return item2==item.id});
                    if(index!=-1){
                        rows.push(item);
                    }
                });
                planInfo.tableData=rows;
            }
        },

        /**
         * 巡检类型改变时触发事件
        */
        xjTypeChange(e) {
            let typeInfo=this.planModel.input.planTypeInfo.concat([]);
            let planType=this.planModel.input.planType;
            let planTypeList=this.planModel.optionData.planType;
            let layerNames=this.planModel.optionData.layerNames;
            if(planType){//判断是否选择了巡检类型
                //将获取的巡检类型转换成数据
                let typeList=[];
                if(Array.isArray(planType)){
                    typeList=planType;
                }else{
                    typeList.push(planType);
                }
                typeList.forEach(item=>{
                    let index=typeInfo.findIndex(item2=>{return item2.typeId==item});
                    //当未加入巡检信息列表时，查询改类型的图层名称及图层id
                    if(index==-1){
                        let layerName="";
                        let layerId="";
                        for(let value of planTypeList) {
                            if(value.id === item) {
                                layerName = value.layerName
                            }
                        }
                        for(let value of layerNames) {
                            if(value.label === layerName) {
                                layerId = value.value
                            }
                        }
                        typeInfo.push({name:layerName,layerName:layerName,layerId:layerId,typeId:item,planInfo:null,exist:true,fristSelect:true})
                    }else{
                        typeInfo[index].exist=true;
                        typeInfo[index].fristSelect=false;
                    }
                });
                //提取出下拉框里面的巡检类型
                let currentTypeInfo=typeInfo.filter(item=>{
                    if(item.exist){
                        item.exist=false;
                        return item
                    }else{
                        //将取消掉的巡检类型的图层给去掉
                        this.removeLayer(item.planInfo.layer);
                        item.planInfo.layer=null;
                    }
                })
                this.planModel.input.planTypeInfo=currentTypeInfo;
                this.initHandlePage();
            }else{
                //将取消掉的巡检类型的图层给去掉
                this.planModel.input.planTypeInfo.forEach(item=>{
                    this.removeLayer(item.planInfo.layer);
                    item.planInfo.layer=null;
                })
                this.planModel.input.planTypeInfo=[];
            }
            //如果没有选择巡检类型则将当前指向的巡检数据置空
            if(this.planModel.input.planTypeInfo.length==0){
                this.planModel.input.currentPlanTypeInfo=null;
            }
        },

        /**
         * 移除图层
         * */ 
        removeLayer(layer){
            if(layer){
                this.mapV.map.remove(layer);
            }
        },

        /**
         * 当巡检片区改变的时候，重新查询出的内容
         */ 
        resetHandlePage(){
            this.comLayerList.drawLayer.removeAll();
            this.comLayerList.highLayer.removeAll();
            for(let item in this.planModel.input.planTypeInfo){
                let data=this.planModel.input.planTypeInfo[item];
                this.resetSingePlanInfo(data);
                if(data.layerName == ''){
                    return;
                }else if(data.layerName == '巡检点') {
                    this.planPoint(data);
                }else if(data.layerName == '巡检线'){
                    this.planLine(data);
                } else if(data.layerName == '隐患点'){
                    this.planHidPoint(data);
                }else if(data.layerName == '工地监护点'){
                    this.planSitePoint(data);
                }
            }
        },

        /**
         * 清空单个页面的内容
         */ 
        resetSingePlanInfo(data){
            this.clearLayer(data.planInfo.layer);
            data.planInfo.tableData=[];
            data.planInfo.pageInfo.currentData=[];
            data.planInfo.pageInfo.currentIndex=1;
            data.planInfo.where="";
            data.planInfo.selectData=[];
            data.planInfo.total=0;
            data.planInfo.drawGraphic=null;
            data.planInfo.pointLineResult=null;
            data.planInfo.inspectContents=null;
            data.planInfo.sendInfo.pointTempList=[];
            data.planInfo.sendInfo.totalCount=0;
            data.planInfo.sendInfo.totalLength=0;
            tool.setVaule(data.planInfo.overlengthPipe,[]);
            tool.setVaule(data.planInfo.getQueryResult,[]);
            data.planInfo.sidExist.exist=true;
            data.planInfo.sidExist.layerName='';
        },

        /**
         * 初始化内容页面
         */        
        initHandlePage(){
            for(let item in this.planModel.input.planTypeInfo){
                let data=this.planModel.input.planTypeInfo[item];
                //第一次加入的时候才进行初始化
                if(data.fristSelect){
                    if(data.layerName == ''){
                        return;
                    }else if(data.layerName == '巡检点') {
                        data.planInfo=this.initData(initConfig.planHeader.xj,true,false)
                        this.planPoint(data);
                    }else if(data.layerName == '巡检线'){
                        data.planInfo=this.initData(initConfig.planHeader.xj,true,false)
                        this.planLine(data);
                    } else if(data.layerName == '隐患点'){
                        data.planInfo=this.initData(initConfig.planHeader.yh,true,false)
                        this.planHidPoint(data);
                    }else if(data.layerName == '工地监护点'){
                        data.planInfo=this.initData(initConfig.planHeader.gd,true,false)
                        this.planSitePoint(data);
                    }else if(data.layerName.indexOf("管线") != -1){
                        data.planInfo=this.initData(initConfig.planHeader.pipeLine,false,true);
                        if(this.addOrUpdateOrLook!='add'){
                            this.groupGetInfoBySid(data);
                        }
                    }else {
                        data.planInfo=this.initData(initConfig.planHeader.pipePoint,false,true)
                        if(this.addOrUpdateOrLook!='add'){
                            this.groupGetInfoBySid(data);
                        }
                    }
                }
            }
            if(this.planModel.input.planTypeInfo.length>0){
                this.paneHandleClick();
            }
            this.mapV.map.reorder(this.comLayerList.highLayer, this.mapV.map.layers.length)
        },

        /**
         * 将数据格式化为planTypeInfo的planInfo
         */        
        initData(header,isCheckData,isServer){
            let layer=new this.data.mapView.TF_graphicsLayer();
            this.mapV.map.add(layer);
            return{
                header:header,//表头
                tableData:[],//数据
                isCheckData:isCheckData,//是否需要选择按钮
                selectData:[],//选择的数据
                layer:layer,//渲染的图层
                total:0,//总数
                isComplete:false,//提交前数据是否计算完毕
                containReg:[],//包含的片区
                containRegNames:[],//包含的片区的名称
                isServer:isServer,//是否可以查询字段
                where:"",//设置的查询条件（isServer当是true的时候才有用）
                drawGraphic:null,//绘制的图形
                pointLineResult:null,//选择图形的集合
                inspectContents:null,//后端保存的图形数据
                overlengthPipe:{//管线处理的集合
                    paths:[],//大于限制值的管线（这部分管线需要进行切割处理）
                    lengths:[],//大于限制值的管线的长度
                    breakLine:[],//已经打断过后的线段
                },
                pageInfo:{
                    currentIndex:1,//当前页面
                    currentData:[],//当前页面的数据
                },
                sendInfo:{//后端需要的信息
                    pointTempList:[],//点信息
                    totalCount:0,//数量
                    totalLength:0//总长度
                },
                getQueryResult:{//获取查询数据的集合
                    allObjectIds:[],//最开始查询出的objectid
                    groupObjectIds:[],//根据1000为刻度分割出的objectid组
                    resultInfo:[],//请求出的所有图形信息
                    allSidIds:[],//管网的sid集合
                },
                sidExist:{//查询的管网设备中必须保证所有的设备都有sid，不存在sid则不能下派计划
                    exist:true,//默认都存在
                    layerName:''//不存在sid的图层
                }
            }
        },

        /**
         * 监听页面切换(巡检类型改变时也进行切换)
         */
        paneHandleClick(){
            let data= this.getCurrentPlanTypeInfo();
            if(!data){
                return;
            }
            this.comLayerList.highLayer.removeAll();
            this.planModel.input.planTypeInfo.forEach((item,index)=>{
                if(data.planInfo.layer!=item.planInfo.layer){
                    item.planInfo.layer.visible=false;
                }else{
                    item.planInfo.layer.visible=true;
                    this.clearLayer(this.comLayerList.drawLayer);
                    if(item.planInfo.drawGraphic){
                        this.comLayerList.drawLayer.add(item.planInfo.drawGraphic);
                    }
                }
            });
            if(data.planInfo.isServer&&this.addOrUpdateOrLook!='look'){
                //获取SQL查询中的字段
                tool.setVaule(this.serverSearch);
                this.serverSearch.queText=data.planInfo.where;
                this.pageShow.userDraw=false; 
                var div = this.$refs.noneLayer.children;
                div[0].style.display = ''
                div[1].innerText = '加载中'
                this.serverSearch.analysisAtt = [] //存储图层字段信息
                $.ajax({
                    url: appconfig.gisResource.business_map.config[0].url + "/" + data.layerId + "/?f=pjson",
                    type: 'GET',
                    success: (data) => {
                    data = JSON.parse(data).fields
                    if(!data) return this.$message.error('图层信息获取失败')
                    var fields = [] 
                    for(let i=0,ii=data.length;i<ii;i++){
                        var layer = data[i]
                        if(layer.alias.search(/[A-Za-z]+/)){
                            fields.push({ value: layer.name, label: layer.alias })
                        }
                    }
                    this.serverSearch.analysisAtt = fields
                    div[0].style.display = 'none'
                    if(this.serverSearch.analysisAtt.length==0){
                        div[1].innerText = '图层无字段'
                    }else{
                        div[1].innerText = ''
                    }
                    },
                    error: (error) => this.$message.error(error)
                })
            }else{
                this.pageShow.userDraw=true; 
            }
        },

        /*
         *获取当前选项卡的内容
         */
        getCurrentPlanTypeInfo(){
            //选项卡减少过会，如果当前值大于实际值将其设置为实际值
            if((parseInt(this.planModel.input.currentPlanTypeName)+1)>this.planModel.input.planTypeInfo.length){
                if(this.planModel.input.planTypeInfo.length==0){
                    this.planModel.input.currentPlanTypeName=0+"";
                }else{
                    this.planModel.input.currentPlanTypeName=(this.planModel.input.planTypeInfo.length-1)+"";
                }
            }
            if(this.planModel.input.currentPlanTypeName>=0){
                return this.planModel.input.planTypeInfo[this.planModel.input.currentPlanTypeName];
            }else{
                return null;
            }
        },

        /*
         *向条件查询输入框中输入内容
         */
        addText: function (text, length, isField) {
            var myField = this.$refs.textBox.$el.children[0]
            var startL = myField.selectionStart || 0
            this.serverSearch.queText = this.serverSearch.queText.substring(0, startL) + text + this.serverSearch.queText.substring(myField.selectionEnd, myField.value.length)
            myField.blur()
            setTimeout(() => {
                myField.selectionStart = myField.selectionEnd = startL + length
                myField.focus()
            })
            if(isField) this.getAtt(text.replace(/(\s*$)/g,""))
        },

        /**
         * 获取字段信息
        */
        getAtt(field) {
            var div = this.$refs.noneFixed.children;
            let currentData=this.getCurrentPlanTypeInfo();
            div[0].style.display = ''
            div[1].innerText = '加载中'
            this.serverSearch.layerFix = []
            $.ajax({
                url: appconfig.gisResource.fieldUniqueValue.config[0].url,
                type: 'POST',
                data: {
                    usertoken: appconfig.usertoken,
                    layerid: currentData.layerId,
                    field_name: field,
                    f: 'pjson'
                },
                success: (data) => {
                    data = JSON.parse(data)
                    if(data.code != 10000) {
                        div[0].style.display = 'none'
                        div[1].innerText = '图层字段获取失败'
                        return this.$message.error('图层字段获取失败')
                    }
                    this.serverSearch.layerFix = data.result.rows
                    if(this.serverSearch.layerFix.length>0){
                        div[1].innerText = ''
                    }else{
                        div[1].innerText = '字段无属性'
                    }
                    div[0].style.display = 'none'
                    
                },
                error: (error) => this.$message.error(error)
            })
        },

        /**
         * 清除图层
        */
        clearLayer(layer){
            if(layer&&layer.removeAll){
                layer.removeAll();
            }
        },

        /**
         * 查询地图服务(option：查询条件，id:图层id,call回调函数)
        */
        queryServce(option,id,call){
            $.ajax({
                url: appconfig.gisResource.business_map.config[0].url + "/" + id + "/query?f=pjson",
                type: 'POST',
                data: option,
                success: (data) => {
                    data = JSON.parse(data);
                    call(data);
                },
                error: (error) => this.$message.error(error)
            })
        },

        /**
         * 绘制范围进行空间查询
        */
        drawAndQuery() {
            this.$refs.mapBox.style.cursor = 'crosshair';
            let mapView = this.mapV;
            let that=this;
            let currentData=that.getCurrentPlanTypeInfo();
            this.resetSingePlanInfo(currentData);
            loadModules(["esri/views/draw/Draw", "esri/geometry/Polygon"],{ url: esriConfig.baseUrl }).then(([Draw, Polygon]) => {
                mapView.when(() => {
                    if(this.drawInfo.drawEvent){
                        this.drawInfo.drawEvent.reset();
                    }
                    this.drawInfo.drawEvent = new Draw({
                        view: mapView
                    })
                    let action = this.drawInfo.drawEvent.create("polygon")
                    action.on("vertex-add", function(evt) {
                        addPolygon(evt);
                    });
                    action.on("cursor-update", function(evt) {
                        addPolygon(evt);
                    });
                    action.on("vertex-remove", function(evt) {
                        addPolygon(evt);
                    });
                    action.on("draw-complete", function(evt) {
                        that.$refs.mapBox.style.cursor = 'default'
                        addPolygon(evt, true);
                    });
                    function addPolygon(evt, action) {
                        that.clearLayer(that.comLayerList.drawLayer);
                        var symbol = {
                                type: "simple-fill",  
                                color: that.drawInfo.drawColor,
                                style: "solid",
                                outline: {  
                                    color: that.drawInfo.drawColor,
                                    width: 1
                                }
                            };
                        let polygon=new Polygon({
                                rings: [evt.vertices],
                                spatialReference: that.mapV.spatialReference,
                                type: "polygon"
                            })    
                        let graphic = new that.data.mapView.TF_graphic({
                            geometry: polygon,
                            symbol: symbol
                        });
                        if (action) {
                            currentData.planInfo.drawGraphic=graphic.clone();
                            that.getGeoData();
                        }
                        that.comLayerList.drawLayer.add(graphic);
                    }
                })
            })
        },

        /**
         * 根据条件查询管网数据数据
        */
        getGeoData(){
            let currentData=this.getCurrentPlanTypeInfo();
            let that=this;
            let data={
                where: (that.serverSearch.queText==''?'1=1':that.serverSearch.queText),
                returnGeometry: false,
                returnIdsOnly: true,
                f: "pjson"
            };
            this.clearLayer(currentData.planInfo.layer);
            this.clearLayer(this.comLayerList.highLayer);
            currentData.planInfo.where=that.serverSearch.queText;
            currentData.planInfo.tableData=[];
            currentData.planInfo.pageInfo.currentData=[];
            currentData.planInfo.pageInfo.currentIndex=1;
            //求取片区与绘制区域的交集
            if(currentData.planInfo.drawGraphic&&currentData.planInfo.drawGraphic.geometry){
                let dataGeo=null;
                if(that.planModel.regionInfo.currentRegionGeo){
                    dataGeo=that.arcgis.geometryEngine.intersect(currentData.planInfo.drawGraphic.geometry,that.planModel.regionInfo.currentRegionGeo);
                }else{
                    dataGeo=currentData.planInfo.drawGraphic.geometry;
                }
                if(dataGeo){
                    that.selectGeo=dataGeo.toJSON();
                }else{
                    this.$message({type: "info", message: "未查询到数据" });
                    return;
                }
                data.geometry=JSON.stringify(that.selectGeo);
                data.geometryType="esriGeometryPolygon";
            }else{
                if(that.planModel.regionInfo.currentRegionGeo){
                    data.geometry=JSON.stringify(that.planModel.regionInfo.currentRegionGeo);
                    data.geometryType="esriGeometryPolygon";
                }
            }
            //根据求取的交集查询交集区域内的设备或者管线的objectId
            that.queryServce(data,currentData.layerId,function(result){
                that.groupGetInfo(result.objectIds,currentData.layerId);
            }.bind(that));
        },

        /**
         * 分组求取管网信息
        */
        groupGetInfo(ids,layerid,updata){
            let that=this;
            let currentData=null;
            if(updata){
                currentData=updata;
            }else{
                currentData=that.getCurrentPlanTypeInfo()
            }
            let overlengthPipe=currentData.planInfo.overlengthPipe;
            let getQueryResult=currentData.planInfo.getQueryResult
            tool.setVaule(overlengthPipe,[]);
            tool.setVaule(getQueryResult,[]);
            getQueryResult.allObjectIds=[].concat(ids);
            //将获取的objecids每1000进行数据重组
            if(ids&&ids.length>0){
                if(ids.length<=that.splitMonth){
                    getQueryResult.groupObjectIds.push([getQueryResult.allObjectIds]);
                }else{
                    let index=Math.floor(ids.length/that.splitMonth);
                    let index2=ids.length%that.splitMonth;
                    for(let i=0;i<index;i++){
                        let startIndex=that.splitMonth*i;
                        let endIndex=that.splitMonth*(i+1);
                        getQueryResult.groupObjectIds.push(getQueryResult.allObjectIds.slice(startIndex,endIndex));
                        if(i==index-1&&index2!=0){
                            getQueryResult.groupObjectIds.push(getQueryResult.allObjectIds.slice(endIndex,ids.length));
                        }   
                    }
                }
            }else{
                this.$message({type: "info", message: "未查询到数据" });
                return;
            }

            let copyValue=null;
            copyValue=tool.copyValue(getQueryResult);
            /**
             * 根据重组的数据进行数据请求获取矢量信息
            */
            getQueryResult.groupObjectIds.forEach(item=>{
                let data={
                    objectIds:item.join(','),
                    returnGeometry: true,
                    returnIdsOnly: false,
                    outFields: '*',
                    f: "pjson"
                }
                that.queryServce(data,layerid,function(result){
                    if(getQueryResult.allObjectIds.length==0&&result.features.length!=0){
                        for(item in getQueryResult){
                            getQueryResult[item]=copyValue[item];
                        }
                    }
                    getQueryResult.resultInfo.push.apply(getQueryResult.resultInfo,result.features);
                    //判断是否已异步请求完毕所有数据
                    //if(getQueryResult.resultInfo.length==getQueryResult.allObjectIds.length||getQueryResult.resultInfo.length==ids.length){
                    if(getQueryResult.resultInfo.length==getQueryResult.allObjectIds.length){  
                        that.conductServerResult(currentData);
                    };
                }.bind(this))
            })
        },

        /***
         * 使用sid查询管网信息
        */
        groupGetInfoBySid(data){
            let that=this;
            let index=this.planModel.updatePlan.findIndex(item=>{return item.typeId==data.typeId});
            let searchData=this.planModel.updatePlan[index];
            searchData.data=searchData.data.map(item=>{return "'"+item.toUpperCase()+"'"});
            let ids=searchData.data;
            let queryArr=[];
            if(ids&&ids.length>0){
                if(ids.length<=that.splitMonth){
                    queryArr.push(ids);
                }else{
                    let index=Math.floor(ids.length/that.splitMonth);
                    let index2=ids.length%that.splitMonth;
                    for(let i=0;i<index;i++){
                        let startIndex=that.splitMonth*i;
                        let endIndex=that.splitMonth*(i+1);
                        queryArr.push(ids.slice(startIndex,endIndex));
                        if(i==index-1&&index2!=0){
                            queryArr.push(ids.slice(endIndex,ids.length));
                        }   
                    }
                }
            }
            let currentIndex=0;
            let objectids=[];
            queryArr.forEach(item=>{
                let senddata={
                    where: 'sid in ('+item.join(',')+')',
                    returnGeometry: false,
                    returnIdsOnly: true,
                    f: "pjson"
                };
                 //根据求取的交集查询交集区域内的设备或者管线的objectId
                this.queryServce(senddata,data.layerId,function(result){
                    objectids=objectids.concat(result.objectIds);
                    currentIndex++;
                    if(currentIndex==queryArr.length){
                        this.groupGetInfo(objectids,data.layerId,data);
                    }
                }.bind(this));
            })
        },

        /***
         * 处理查询出的结果(查询结果在this.getQueryResult中，主要的结果在getQueryResult.resultInfo中)
        */
        conductServerResult(currentData){
            let getQueryResult=currentData.planInfo.getQueryResult;
            let geo=[];
            let geometry=null;
            let symbol=null;
            let dataList=[];
            if(getQueryResult.resultInfo.length>0){
                let ids=[];  
                if(getQueryResult.resultInfo[0].geometry.paths){
                    symbol = {
                            color: this.comColorList.planColor,
                            width: "2px",
                            type:"simple-line",
                        };
                        getQueryResult.resultInfo.forEach((item,index)=>{
                        geo.push.apply(geo,item.geometry.paths);
                        let listitem=JSON.parse(JSON.stringify(item.attributes).toLowerCase());
                        listitem.geometry={paths:null};
                        listitem.geometry.paths=item.geometry.paths;
                        listitem.pipelength=listitem.pipelength.toFixed(2);
                        dataList.push(listitem);
                        ids.push(listitem.objectid);
                    });
                    geometry={
                        type:"polyline",
                        paths:geo,
                        spatialReference:this.data.mapView.spatialReference
                    };
                    currentData.planInfo.pointLineResult=geometry;
                }else{
                    symbol = {
                            type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                            color: this.comColorList.planColor,
                            outline: {  // autocasts as new SimpleLineSymbol()
                                color: this.comColorList.planColor,
                                width: "0.5px"
                            }
                        };
                    getQueryResult.resultInfo.forEach(item=>{
                        geo.push([item.geometry.x,item.geometry.y]);
                        let listitem=JSON.parse(JSON.stringify(item.attributes).toLowerCase());
                        listitem.lat=item.geometry.y;
                        listitem.lng=item.geometry.x;
                        dataList.push(listitem);
                        ids.push(listitem.objectid);
                    });
                    geometry={
                        type:"multipoint",
                        points:geo,
                        spatialReference:this.data.mapView.spatialReference
                    }
                    currentData.planInfo.pointLineResult=geometry;
                }
                dataList.forEach(item=>{
                    if(item.sid){
                        currentData.planInfo.getQueryResult.allSidIds.push(item.sid)
                    }else{
                        currentData.planInfo.sidExist.exist=false;
                        currentData.planInfo.sidExist.layerName=currentData.layerName;
                    }
                })
                currentData.planInfo.tableData=dataList;
                currentData.planInfo.pageInfo.currentData=dataList.slice(0,10);
                currentData.planInfo.total = dataList.length;
                let graphic=new this.data.mapView.TF_graphic({
                    geometry:geometry,
                    symbol: symbol
                });
                currentData.planInfo.inspectContents=JSON.stringify({
                    geometryInfo:geometry,
                    type:currentData.layerId,
                    ids:ids.join(','),
                    where:this.serverSearch.queText
                });
                currentData.planInfo.layer.add(graphic);
            }
        },

        //查询当前绘制的管线属于那几个片区
        currentDarwRe(currentData){
            let regionsList=null;
            if(this.planModel.regionInfo.currentRegion){
                regionsList=this.planModel.regionInfo.currentRegion;
            }else{
                regionsList=this.planModel.regionInfo.allRegions;
            }
            regionsList.forEach(item=>{
                let result=this.arcgis.geometryEngine.intersect(currentData.planInfo.pointLineResult,item.geometry2);
                if(result){
                    currentData.planInfo.containReg.push(item.id);
                    currentData.planInfo.containRegNames.push(item.name);
                }
            })
        },
        /**
         * 处理选择的管线
        */
        conductPipe(currentData){
            let getQueryResult=currentData.planInfo.getQueryResult;
            let overlengthPipe=currentData.planInfo.overlengthPipe;
            let data=currentData.planInfo.sendInfo;
            if(!getQueryResult.resultInfo||getQueryResult.resultInfo.length==0){
                this.$message({type: "info", message: "请绘制或者查询管线，获取管线信息" });
            }
            getQueryResult.resultInfo.forEach((item,index)=>{
                let listitem=JSON.parse(JSON.stringify(item.attributes).toLowerCase());
                // if(index==0){
                //     data.pointTempList.push({
                //         "typeId":currentData.typeId,
                //         "layerName":currentData.layerName,
                //         "lat":item.geometry.paths[0][0][0],
                //         "lng":item.geometry.paths[0][0][1],
                //         "length":0,
                //         "geometry":JSON.stringify({
                //             paths: item.geometry.paths,
                //             spatialReference: this.mapV.spatialReference,
                //             type: "polyline"
                //         }),
                //     })
                // }
                data.totalLength+=parseFloat(listitem.pipelength);
                if(listitem.pipelength>this.breakLength){
                    overlengthPipe.paths.push(item.geometry.paths[0]);
                    overlengthPipe.lengths.push(listitem.pipelength);
                }else{
                        data.pointTempList.push({
                            "inspectTypeId":currentData.typeId,
                            "layerName":currentData.layerName,
                            "lat":item.geometry.paths[0][1][0],
                            "lng":item.geometry.paths[0][1][1],
                            "length":listitem.pipelength,
                            "geometry":JSON.stringify({
                            paths: item.geometry.paths,
                            spatialReference: this.mapV.spatialReference,
                            type: "polyline"
                        }),
                    })
                }
            });
            this.currentDarwRe(currentData);
            this.breakLine(currentData);
        },
        //处理选择的管点:
        conductPoint(currentData){
            let getQueryResult=currentData.planInfo.getQueryResult;
            let data=currentData.planInfo.sendInfo;
            getQueryResult.resultInfo.forEach(item=>{
                data.pointTempList.push({
                    "inspectTypeId":currentData.typeId,
                    "layerName":currentData.layerName,
                    "lat":item.geometry.y,
                    "lng":item.geometry.x,
                    "length":0,
                    "geometry":JSON.stringify({
                        type: "point",
                        latitude: item.geometry.y,
                        longitude:item.geometry.x,
                        spatialReference: this.data.mapView.spatialReference
                    }),
                })
            });
            data.totalCount= data.pointTempList.length;
            data.totalLength=0;
            this.currentDarwRe(currentData);
            currentData.planInfo.isComplete=true;//表示该类型在提交前完成计算
        },
        //点击清空按钮执行事件
        clearQueryCondition() {
            this.serverSearch.queText = ''
        },
        //单击查询结果表格数据项触发事件
        rowSelectPlan(row) {
            if(row.geometry){
                let geo=null;
                if(row.geometry.paths){
                    geo=row.geometry;
                }else{
                    geo = JSON.parse(row.geometry);
                }
                if(geo.paths){
                    let lines=geo.paths;
                    this.hLineToMap(lines);
                };
                return;
            }
            if(row.lat&&row.lng){
                this.highPointToMap([row.lat,row.lng]);
            }
        },

        //选中查询结果表格数据项时执行
        selectPlan(selection, row) {
            let currentData=this.getCurrentPlanTypeInfo();
            currentData.planInfo.selectData=selection;
        },

        /**
         * 控制片区的显示与隐藏
         * */ 
        regionShow(){
            this.comLayerList.regionLayer.visible = this.pageShow.showPlace;//控制片区的显示与隐藏
        },

        /**
         * 分页显示
         * */ 
        handleCurrentChange(val){
            let data=this.getCurrentPlanTypeInfo();
            let tabalData=data.planInfo.tableData;
            data.planInfo.pageInfo.currentData=tabalData.slice((val-1)*10,val*10);
            data.planInfo.pageInfo.currentIndex=val;
        }
    }
}

