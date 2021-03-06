/**
 * @description 该功能为巡检子系统，巡检管理模块中的巡检计划管理功能
 * @author 梁罗、李顺<876330731@qq.com>
 */
import { Vue, Prop, Component, Watch } from 'vue-property-decorator'
import { Feature, Map, View } from 'ol'
import { defaults as controls } from 'ol/control'
import tfLegend from "@/views/zhpt/common/Legend.vue";
import tfTableLegend from '@/views/zhpt/common/TableLegend.vue';
import initConfig from './config.json';
import tool from './tool';
import {
    queryTaskArrange, addTaskArrange, editTaskArrange, deleteTaskArrange, submitPauseCheckInfo,
    submitAbandonCheckInfo, xjRoundDispose, queryDetail, getGroupPersonById, queryRegionRelation, stopList, cancleList
} from '@/api/xjDailyManageApi'
import { disposeXjType } from '@/api/xjApi'
import { queryBuildList } from '@/api/xjWorkSiteCheckApi'
import { queryXjPoint, queryXjLine } from '@/api/xjDailyManageApi'
import { queryDangerReport } from '@/api/xjHiddenDangerManageApi'
import { getGroupUserMap, getGroupUserMap2 } from '@/api/base'
import { TF_Layer } from '@/views/zhpt/common/mapUtil/layer'
import request from '@/utils/request'
import axios from 'axios'
import $ from 'jquery'
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Geometry, LineString, MultiPoint, Point, Polygon } from 'ol/geom';
import { Icon, Stroke, Style } from 'ol/style';
import locationIcon from '@/assets/images/map/location.png'
import SuperMapService from '@/utils/SuperMapService'
import { Draw, DoubleClickZoom } from 'ol/interaction';
import { getLength } from 'ol/sphere';
@Component({
    name: 'XjPlanManagement',
    components: { tfTableLegend, tfLegend }
})
export default class XjPlanManagement extends Vue {
    @Prop() data: any
    @Prop(Object) acceptData: {
        monthId: string,//月份
        planType: string,//计划类型
        editButton: string,//是否展示编辑按钮
        flag: 1//共享人的id
    }
    //表格加载状态
    tableLoading = true;
    tempEvent = null;
    percentageShow = false;//进度条
    percentage = 0;//查询进度
    startOptions = {//开始时间的限定
        disabledDate: time => {
            if (this.searchModel.input.endTime) {
                return time.getTime() >= new Date(this.searchModel.input.endTime);
            }
        },
    };
    endOptions = {//结束时间的限定
        disabledDate: time => {
            if (this.searchModel.input.startTime) {
                return new Date(this.searchModel.input.startTime).getMilliseconds() - 1000 * 60 * 60 * 24 > time.getTime();
            }
        },
    }
    searchModel = {//查询模块
        input: {//多选获取的输入是数组，但后端获取的是字符串，多个值使用逗号进行隔开，故这里将输入和实际发送请求的数据分开
            startTime: "",
            endTime: "",
            chooseGroup: "",//部门
            chooseWorker: "",//人员
            planType: "",//巡检类型
            isDispatching: "0",//是否派工
            state: ""//状态
        },
        pageInfo: {
            size: 30,//当前每页显示条数
            current: 1,//当前第几页
            pageSizes: [10, 25, 50, 100]//可改变的页数
        },
        buttonShow: {
            editButton: true//是否展示编辑按钮
        },
        sendInfo: {//查询请求发送的数据
            timeForMission: "",//巡查日期
            chooseGroup: "",//部门
            chooseWorker: "",//人员
            planType: "",//巡检类型
            state: "",//状态
            size: "",//当前每页显示条数
            current: "",//当前第几页
            mouthId: ""//月份
        },
        optionData: {//查询前获取的下拉框数据
            planType: [],//巡检类型数据
            chooseWorker: [],//人员数据
            chooseGroup: [],//部门数据
            workerAndGroup: [],//部门与人员数据
            state: []//状态数据
        },
        getData: {//查询获取的后端数据
            tableTotal: 0,//总页数
            selectRow: [],//列表中勾选选中的数据
            currentRow: null,//列表中当前高亮的数据
            allRow: [],//查询出的所以数据
            getData: null
        }
    }
    addOrUpdateOrLook = '';//add表示新增，update表示修改,'look',表示查看
    buttonControl = {//控制按钮的启用与禁用
        canAlert: true,//控制修改按钮，初始化默认禁用状态
        canDelete: true//控制删除按钮，初始化默认禁用状态
    }
    arcgis = {//arcgis相关的对象
        GeometryService: null, //GeometryService服务类   
        LengthsParameters: null, //GeometryService计算长度的参数
        geometryEngine: null,//geometryEngine图形操作工具类
        Polygon: null,//多边形类
    }
    regionLayerId = 17//获取片区图层的ID条件
    comLayerList = {//本模块通用的图层
        regionLayer: null,//当前巡检组下的片区图层
        drawLayer: null,//绘制图层
        highLayer: null//高亮图层
    }
    comColorList = {//图层颜色管理
        highColor: "#00FFFF",//高亮图层颜色
        planColor: "#1E90FF",//计划图层颜色
        regionLineColor: [64, 224, 208, 0],//片区线的颜色
        regionInColor: [255, 165, 0, 0.2],//片区内部颜色
    }
    pageShow = {//控制页面的显示隐藏
        endSend: false,//是否完成任务制定
        makePlan: false,//控制计划制定页面的显示和隐藏
        lookPlan: false,//控制查看计划页面的显示与隐藏
        buttonShow: false,//制定按钮的显示与隐藏
        showPlanRound: true,//控制巡检周期的显示
        userDraw: true,//是否可以绘制范围
        showPlace: true,//片区是否显示
        sendPlan: false,//提交按钮是否禁用
        diaVisiable: false,//查看页面的展示与隐藏
        showSQLPage: false,//是否展示sql查询
        showSQLContent: true//展示综合查询内容
    }
    planModel = {//制定计划模块
        optionData: {//制定计划时下拉内容
            planType: [],//巡检类型数据
            chooseWorker: [],//人员数据
            chooseGroup: [],//部门数据
            workerAndGroup: [],//部门与人员数据
            period: [],//巡检周期
            state: [],//是否排工
            layerNames: []//图层信息
        },
        initInput: null,
        input: {//制定计划时输入的内容
            planType: "",//巡检类型数据
            planTypeInfo: [],//巡检类型数据的详细信息
            currentPlanTypeName: "0",//当前展示的巡检类型数据的名称
            chooseWorker: "",//人员数据
            chooseGroup: "",//部门数据
            period: "",//巡检周期
            createUser: "",//创建人
            periodDay: 0,//周期天数
            planBegindatePick: { disabledDate(time) { } },//起始时间选择控制
            planBegindate: "",//起始时间
            planEnddatePick: { disabledDate(time) { } },//终止时间选择控制
            planBegindate2Pick: { disabledDate(time) { } },//终止时间选择控制
            planEnddate2Pick: { disabledDate(time) { } },//终止时间选择控制
            planEnddate: "",//终止时间
            planBegindate2: "",//巡查时间
            planEnddate2: "",//巡查时间
            // dayPlanTime2:"",//巡查时间(按月)
            planPercent: 100,//完成率
            state: "",//是否排工
            planState: ""//计划状态
        },
        inputPlans: {//多个计划下,每个计划的内容
            plans: [{//每个计划需要保存的信息
                layers: [],
                name: "",
                geometry: "",
            }]
        },
        editInfo: {//计划详细信息
            description: "",//备注
            inspectContents: "",//查询内容
            inspectGroupId: "",//巡检组Id
            inspectType: "",//巡检类型
            createUser: "",//创建人
            inspectUsers: "",//巡检人
            inspectUserList: "",
            intervalDay: "",//间隔天数
            planPercent: 100,//计划完成率
            planBegindate: "",//巡检计划开始时间
            planEnddate: "",//巡检计划结束时间
            planType: "3",//计划类型（日常任务都为临时性任务，默认为3）
            regionId: "",//所属片区编码
            regionName: "",//片区名称
            isDispatching: "1",//默认派工
            planState: "",//状态
            periodId: "",//巡查周期
            totalCount: "",
            totalLength: 0,
            id: "",//id
            mouthId: "",//月份
            planTypeOverList: [],
            pointTempList: [
                {
                    geometry: "",//几何信息
                    lat: "",//纬度
                    lng: ""
                }]//点信息列表集合
        },
        regionInfo: {//片区信息
            allRegions: [],//所有的片区
            currentRegion: null,//当前的片区
            singleRegin: null,//巡检组固定的时候保存其巡检组
            currentRegionGeo: null,//绘制的图形
        },
        updatePlan: [],//数据更新时的数据
        updatePlanPercent: []//数据更新时的完成率数据
    }
    hasGroup = false;//登陆用户是否属于一个巡检组
    drawInfo = {//绘制信息集合
        drawEvent: null,//绘制事件
        drawColor: [255, 0, 0, 0.4],//绘制图层颜色
    }
    dateShow = {//时间选择的切换（天和月的切换）
        moreDate: true,
        singeDate: false
    }
    planDataShow = false;//计划内容是否存在
    hideDataContentA = true;//计划内容是否显示
    splitMonth = 1000;//切割查询出的objectids（用于server查询）
    breakLength = 1000;//打断参数
    setIntervalEvent = null//定时事件
    serverSearch = {//图层查询集合
        queText: "",//查询条件
        analysisAtt: [],//图层字段
        layerFix: []//字段的取值
    }
    mapV: Map = null
    view = null;
    draw: Draw = null;
    appconfig = this.$store.getters.appconfig;
    get watchMonthId() {
        if (this.acceptData) {
            return this.acceptData.monthId
        }
    }
    get showWatch() {
        if (this.acceptData) {
            return this.acceptData.editButton
        }
    }

    mounted() {
        if (this.acceptData && typeof (this.acceptData.editButton) == 'boolean') {
            this.searchModel.buttonShow.editButton = this.acceptData.editButton;
        }
        // this.showWatch();
        //初始化部分配置
        this.initConfigInfo();
        //获取巡检类型下拉框
        this.initXjType();
        //获取巡检组
        this.getGroupUserMap();
        //配置巡检周期
        this.disposeDayPlanRound();
        //保存输入框的默认配置
        this.planModel.initInput = tool.copyValue(this.planModel.input);
        //添加本模块使用的地图
        this.addMap();
        //获取图层信息
        this.getLayerInfo();
    }

    //监听月份变化
    @Watch("watchMonthId")
    watchMonthIdChange() {
        //.window.setTimeout()
        this.getData();
    }
    //编辑按钮是否展示
    @Watch("showWatch")
    showWatchChange() {
        if (this.acceptData && typeof (this.acceptData.editButton) == 'boolean') {
            this.searchModel.buttonShow.editButton = this.acceptData.editButton;
        }
    }
    //查询页面信息改变时（页面显示条数及当前第几页）
    @Watch("searchModel.pageInfo.current")
    searchModelcurrentChange() {
        this.getData();
    }
    @Watch("searchModel.pageInfo.size")
    pageInfosizeChange() {
        this.getData();
    }
    //监听选项卡的改变
    @Watch("planModel.input.currentPlanTypeName")
    currentPlanTypeNameChange() {
        this.paneHandleClick();
    }
    destroyed() {
        this.controlComLayer("destory");
        if (this.mapV) {
            this.mapV.dispose();
        }
    }
    /**
     * 渲染数据处理
    */
    formatter(row, column) {
        let typeValue = typeof row[column.property];
        if (typeValue == "undefined") {
            return "-"
        } else if (typeValue == "object" || typeValue == "string") {
            if (!row[column.property]) {
                return "-"
            } else {
                return row[column.property]
            }
        } else {
            return row[column.property]
        }
    }
    /**
     * 初始化部分配置
     * */
    initConfigInfo() {
        this.searchModel.optionData.state = initConfig.state;
        if (this.acceptData && (this.acceptData.planType || this.acceptData.planType == "0")) {
            this.planModel.editInfo.planType = this.acceptData.planType;
        }
    }

    /**
    * 初始化巡检类型
    */
    initXjType() {
        let data = {
            size: 10000,
            current: 1,
        }
        disposeXjType(data).then(res => {
            this.searchModel.optionData.planType = res.result.records;
            this.planModel.optionData.planType = res.result.records;
        }).catch(err => {
            console.log(err);
        });
    }

    /**
     * 获取当前用户下的所有巡检组和人员并初始化巡检组下拉内容
     * */
    getGroupUserMap() {
        let data = {
            size: 10000,
            current: 1
        }
        getGroupUserMap(data).then(res => {
            let userId = this.$store.state.user.userId;
            //初始化显示所有人
            let addUser = [];
            res.result.groupUserDeptVoList.forEach(item => {
                addUser.push({ id: item.userId, name: item.userName });
            })
            let searchWorkerAndGroup = this.searchModel.optionData.workerAndGroup
            res.result.groupUserVoList.forEach(item => {
                let index = searchWorkerAndGroup.findIndex(item2 => { return item2.id == item.groupId });
                if (userId == item.userId) {
                    this.hasGroup = true;
                    this.searchModel.input.chooseGroup = item.groupId;
                }
                if (index == -1) {
                    searchWorkerAndGroup.push({ index: searchWorkerAndGroup.length + 0, id: item.groupId, name: item.groupName, data: [{ id: "", name: '全部' }, { id: item.userId, name: item.userIdName }] })
                } else {
                    searchWorkerAndGroup[index].data.push({ id: item.userId, name: item.userIdName });
                }
                if (item.userId && item.userIdName) {
                    addUser.push({ id: item.userId, name: item.userIdName });
                }
            });
            addUser.unshift({ id: '', name: '全部' });
            searchWorkerAndGroup.unshift({ id: "", name: "全部", data: addUser });
            if (!this.hasGroup) {
                this.searchModel.input.chooseGroup = "";
                this.searchModel.optionData.chooseWorker = addUser;
            } else {
                let sIndex = searchWorkerAndGroup.findIndex(item => { return item.id == this.searchModel.input.chooseGroup });
                this.searchModel.optionData.chooseWorker = searchWorkerAndGroup[sIndex].data;
            }
            this.searchModel.optionData.chooseGroup = tool.copyValue(searchWorkerAndGroup);
            this.getGroupUserMap2();
        })
    }

    /**
     * 获取当前用户下的所有巡检组和人员并初始化巡检组下拉内容(已启用)
     * */
    getGroupUserMap2() {
        let data = {
            size: 10000,
            current: 1
        }
        getGroupUserMap2(data).then(res => {
            let userId = this.$store.state.user.userId;
            //初始化显示所有人
            let addUser2 = [];
            res.result.groupUserDeptVoList.forEach(item => {
                addUser2.push({ id: item.userId, name: item.userName });
            })
            let planWorkerAndGroup = this.planModel.optionData.workerAndGroup;
            res.result.groupUserVoList.forEach(item => {
                let index = planWorkerAndGroup.findIndex(item2 => { return item2.id == item.groupId });
                if (userId == item.userId) {
                    this.hasGroup = true;
                    this.planModel.input.chooseGroup = item.groupId;
                }
                if (index == -1) {
                    planWorkerAndGroup.push({ index: planWorkerAndGroup.length + 0, id: item.groupId, name: item.groupName, data: [{ id: item.userId, name: item.userIdName }] })

                } else {
                    planWorkerAndGroup[index].data.push({ id: item.userId, name: item.userIdName });
                }
                if (item.userId && item.userIdName) {
                    addUser2.push({ id: item.userId, name: item.userIdName });
                }
            });
            planWorkerAndGroup.unshift({ id: "", name: "全部", data: addUser2 });
            if (!this.hasGroup) {
                this.planModel.input.chooseGroup = "";
                this.planModel.optionData.chooseWorker = addUser2;
            } else {
                let aIndex = planWorkerAndGroup.findIndex(item => { return item.id == this.planModel.input.chooseGroup });
                this.planModel.optionData.chooseWorker = planWorkerAndGroup[aIndex].data;
            }
            this.planModel.optionData.chooseGroup = tool.copyValue(planWorkerAndGroup);

            this.$nextTick(() => {
                this.getData();
            })
        })
    }

    /**
     * 获取首页表单数据
     */
    getData() {
        this.tableLoading = true;
        //this.dataT1 = [];
        //将修改和删除按钮重置为不可操作
        tool.setVaule(this.buttonControl, true);
        // if(!this.timeForMission){
        //     this.timeForMission="";
        // }
        let user = [];
        if (this.searchModel.input.chooseWorker == '') {
            this.searchModel.optionData.chooseWorker.forEach(item => {
                if (item.id != "") {
                    user.push(item.id)
                }
            })
        } else {
            user = [this.searchModel.input.chooseWorker];
        }
        // if(this.acceptData&&this.acceptData.monthId){
        //     this.searchModel.input.isDispatching="";
        // }
        let data = {
            current: this.searchModel.pageInfo.current,
            size: this.searchModel.pageInfo.size,
            // inspectGroupId:this.searchModel.input.chooseGroup,
            // inspectUsers:this.searchModel.input.chooseWorker+"",
            inspectUsers: user.join(','),
            inspectType: this.searchModel.input.planType + "",
            planState: this.searchModel.input.state,
            isDispatching: this.searchModel.input.isDispatching,
            planBegindate: this.searchModel.input.startTime ? (this.searchModel.input.startTime + " 00:00:00") : "",
            planEnddate: this.searchModel.input.endTime ? (this.searchModel.input.endTime + " 23:59:59") : "",
            deptId: this.$store.state.user.departmentId,
            mouthId: null,
            flag: null
        }
        if (this.acceptData && this.acceptData.monthId) {
            data.mouthId = this.acceptData.monthId;
            data.flag = 1;
            delete data.inspectUsers
        }
        queryTaskArrange(data).then(res => {
            this.searchModel.getData.allRow = res.result.records
            this.searchModel.getData.tableTotal = res.result.total
            this.tableLoading = false
        }).catch(err => {
            console.log(err);
        })
    }

    /**
    * 查询表格翻页改变
    */
    changeCurrent(data) {
        this.searchModel.pageInfo.current = data;
    }

    /**
     * 查询表格页数改变
     * */
    changeSize(data) {
        this.searchModel.pageInfo.size = data;
    }

    /**
     * 查询表格选中时的操作
     * */
    searchTableSelect(e, s) {
        this.searchModel.getData.getData = e;
        let typeName = "临时性任务"
        if (this.acceptData) { //这里是针对非计划型的编辑
            typeName = "月计划"
        }
        //修改按钮能操作的条件(只能选中一个且是未开始、临时性任务的时候才能操作)
        if (e.length == 1 && e[0].isDispatching == '未派工' && e[0].planType == typeName && e[0].createUser == this.$store.state.user.userId) {
            this.buttonControl.canAlert = false//可修改
        } else {
            this.buttonControl.canAlert = true;//不可修改
        }
        //删除按钮能操作的条件
        if (e.length > 0) {
            //1.首先必须有选中2.选中的计划必须都是临时性且都未开始的选项
            //是否全部都是临时性计划
            let selectType = e.findIndex(item => { return item.planType != typeName || e[0].createUser != this.$store.state.user.userId });
            //是否全部都是未开始的计划
            let selectState = e.findIndex(item => { return item.isDispatching != "未派工" });
            //同时满足的情况下才能操作删除按钮
            if (selectType == -1 && selectState == -1) {
                this.buttonControl.canDelete = false //可删除
            } else {
                this.buttonControl.canDelete = true //不可删除
            }
        } else {
            this.buttonControl.canDelete = true
        }
    }

    /**
     *计划制定页面的显示与隐藏
     */
    makePageControl(show) {
        if (show) {
            this.pageShow.makePlan = true;
            this.pageShow.buttonShow = true;
            this.tempEvent = document.onkeydown;
            document.onkeydown = function (e) {
                if (e.ctrlKey && e.key === 'z') {
                    e.preventDefault();
                }
            }
        } else {
            this.pageShow.makePlan = false;
            this.pageShow.buttonShow = false;
            document.onkeydown = this.tempEvent;
        }
    }

    /**
     *计划制定
     */
    makeMission(type) {
        this.makePageControl(true);
        if (type == '计划制定') {
            this.addOrUpdateOrLook = 'add';
        } else if (type == '计划修改') {
            this.addOrUpdateOrLook = 'update';
            //获取计划详情
            queryDetail(this.searchModel.getData.getData[0].id).then(res => {
                if (res.code == 1) {
                    this.initUpDateData(res.result)
                } else {
                    this.$message({ type: "info", message: res.message });
                }
            })
        }
        if (this.hasGroup) {
            this.planModel.regionInfo.currentRegion = this.planModel.regionInfo.singleRegin;
            this.drawRegion();
        }
        this.$nextTick(() => {
            this.loadMap();
        })
    }

    /**
     * 更新数据的初始化
     * */
    initUpDateData(data) {
        let inputData = this.planModel.input;
        inputData.chooseGroup = data.inspectGroup ? data.inspectGroup : "";   //巡检组赋值
        this.changeGroup();//获取人员
        this.planModel.updatePlan = JSON.parse(data.inspectContents);
        this.planModel.updatePlanPercent = data.planTypeOverList;
        inputData.planType = data.inspectType.split(',').map(item => { return parseInt(item) });//巡检类型赋值
        this.xjTypeChange();//el-tabs初始化
        inputData.period = data.periodId;
        inputData.periodDay = data.intervalDay;
        if (inputData.period == "4") {
            this.pageShow.showPlanRound = false;
        };
        this.chooseCheckPeriod();
        inputData.createUser = data.createUser;
        // inputData.planPercent=data.planPercent;
        inputData.state = data.isDispatching;
        inputData.planState = data.planState;
        this.planModel.editInfo.planType = data.planType;//更新时的巡检类型由更新数据决定
        this.$nextTick(() => {
            if (inputData.period != '3') {
                [inputData.planBegindate, inputData.planEnddate] = [data.planBegindate, data.planEnddate]
            } else {
                let currentDate = data.planBegindate.split(' ')[0];
                let dateArr = currentDate.split('-');
                inputData.planBegindate2 = dateArr[0] + '-' + dateArr[1];
                let currentDate2 = data.planEnddate.split(' ')[0];
                let dateArr2 = currentDate2.split('-');
                inputData.planEnddate2 = dateArr2[0] + '-' + dateArr2[1];
            }
        })
        //dom更新完毕后
        this.$nextTick(() => {
            inputData.chooseWorker = data.inspectUserList.split(',').map(item => { return parseInt(item) });//人员获取完成后，初始赋值
        })
    }

    /**
     * 配置巡检周期
     * */
    disposeDayPlanRound() {
        xjRoundDispose({}).then(res => {
            this.planModel.optionData.period = res.result.records
        })
    }
    /**
     * 获取根据巡检组获取片区
    */
    getRegionIds() {
        // let data = {
        //     current: 1,
        //     size: 10000,
        //     respGroup: parseInt(this.planModel.input.chooseGroup)
        // };
        // //详情页面不需要,当巡检组是空的时候，将当前巡检片区设置为空
        // if (this.planModel.input.chooseGroup) {
        //     queryRegionRelation(data).then(res => {
        //         let dataInfo = [];
        //         res.result.records.forEach(item => {
        //             let index = this.planModel.regionInfo.allRegions.findIndex(item2 => { return (item2.id + "") == item.regionId })
        //             let index2 = dataInfo.findIndex(item3 => { return item3.id == item.regionId });
        //             if (index != -1 && index2 == -1) {
        //                 dataInfo.push({ id: item.regionId, geometry: this.planModel.regionInfo.allRegions[index].geometry, geometry2: this.planModel.regionInfo.allRegions[index].geometry2, name: item.regionName })
        //             }
        //         });
        //         //如果没查询到则将其重置为空的数组
        //         if (dataInfo.length == 0) {
        //             this.planModel.regionInfo.currentRegion = null;
        //             this.planModel.regionInfo.currentRegionGeo = null;
        //         } else {
        //             this.planModel.regionInfo.currentRegion = dataInfo;
        //         }
        //         if (this.hasGroup) {
        //             this.planModel.regionInfo.singleRegin = this.planModel.regionInfo.currentRegion;
        //         };
        //         this.drawRegion();
        //         if (!this.hasGroup) {
        //             this.resetHandlePage();
        //         }
        //     });
        // } else {
        //     //如果直接设置为全区域则将其置为null
        //     this.planModel.regionInfo.currentRegion = null;
        //     this.planModel.regionInfo.currentRegionGeo = null;
        //     this.comLayerList.regionLayer.removeAll();
        //     this.resetHandlePage();
        // }
    }

    /**
     * 绘制片区
    */
    drawRegion() {
        // let rings = [];
        // if (this.planModel.regionInfo.currentRegion && this.planModel.regionInfo.currentRegion.length > 0) {
        //     this.planModel.regionInfo.currentRegion.forEach(item => {
        //         rings.push(item.geometry);
        //     })
        //     const polygon = {
        //         rings: rings,
        //         type: "polygon",
        //         spatialReference: this.mapV.spatialReference
        //     };
        //     this.planModel.regionInfo.currentRegionGeo = polygon;
        //     var symbol = {
        //         type: "simple-fill",  // autocasts as new SimpleFillSymbol()
        //         color: this.comColorList.regionInColor,
        //         style: "solid",
        //         outline: {  // autocasts as new SimpleLineSymbol()
        //             color: this.comColorList.regionLineColor,
        //             width: 1
        //         }
        //     };
        //     let polygonGra = new this.data.mapView.TF_graphic({
        //         geometry: polygon,
        //         symbol: symbol
        //     });
        //     this.comLayerList.regionLayer.removeAll();
        //     this.comLayerList.regionLayer.add(polygonGra);
        // }
    }

    /**
     * 在模块打开的时候预先加载地图
    */
    addMap() {
        if (!this.appconfig) {
            this.$message('服务加载失败 启用默认服务配置')
            return;
        }
        let { initCenter, initZoom } = this.appconfig
        var div = this.$refs.cctvMap as HTMLElement;
        let layerResource = this.appconfig.gisResource['iserver_resource'].layerService.layers;
        const map = new Map({
            target: div,
            controls: controls({
                zoom: true,
                attribution: true
            }),
            view: new View({
                center: initCenter,
                zoom: initZoom,
                maxZoom: 21,
                minZoom: 5,
                projection: "EPSG:4326"
            })
        })
        this.mapV = map;
        this.addLayers(layerResource);
        this.controlComLayer("init");
    }
    addLayers(layers) {
        new TF_Layer().createLayers(layers).then((layers:any[]) => {
            layers.forEach(layer => {
              layer && this.mapV.addLayer(layer)
            })
          })
        // layers.forEach((layerConfig) => {
        //     let { name, type, url, parentname, id, visible = true } = layerConfig
        //     let layer = new TF_Layer().createLayer({ url, type, visible, properties: { id, name, parentname } })
        //     this.mapV.addLayer(layer)
        // })
    }
    /**
     * 通用的图层的打开和移除及清理(传入init初始化图层，如果图层已初始化则清空图层内容，
     * 传入destory则删除图层，将 图层移除地图)
    */
    controlComLayer(action) {
        for (let item in this.comLayerList) {
            if (action == "init") {
                if (this.comLayerList[item]) {
                    this.comLayerList[item].getSource().clear();
                } else {
                    this.comLayerList[item] = new VectorLayer({
                        source: new VectorSource()
                    })
                    this.mapV.addLayer(this.comLayerList[item]);
                }
            } else if (action == 'destory') {
                if (this.comLayerList[item]) {
                    this.mapV.removeLayer(this.comLayerList[item]);
                    this.comLayerList[item] = null;
                }
            }
        }
    }

    /**
     * 将地图放置在弹出框中
    */
    loadMap() {
        //@ts-ignore
        this.$refs.mapBox.appendChild(this.$refs.cctvMap)
        //@ts-ignore
        this.$refs.cctvMap.style.display = ''
        //地图容器初始隐藏，需要更新size
        if (this.mapV) {
            this.mapV.updateSize()
        }
    }

    /**
     * 获取图层信息
    */
    getLayerInfo() {
        // $.ajax({
        //     url: appconfig.gisResource.business_map.config[0].url + "/?f=pjson",
        //     type: 'GET',
        //     success: (data) => {
        //         data = JSON.parse(data).layers
        //         if (!data) return this.$message.error('图层字段获取失败')
        //         var tId = []
        //         for (let i = 0, ii = data.length; i < ii; i++) {
        //             var layer = data[i]
        //             // if([0, 16, 17].indexOf(layer.id) < 0){
        //             //     tId.push({ value: layer.id, label: layer.name })
        //             // }
        //             if (layer.parentLayerId != -1) {
        //                 tId.push({ value: layer.id, label: layer.name })
        //             }
        //         }
        //         this.planModel.optionData.layerNames = tId
        //     },
        //     error: (error) => this.$message.error(error)
        // })
    }

    //改变巡检组的情况
    changeGroup(type?) {
        if (type == "search") {
            let dataList = this.searchModel.optionData.workerAndGroup;
            let index = dataList.findIndex(item => { return item.id == this.searchModel.input.chooseGroup });
            let data = dataList[index].data;
            this.searchModel.optionData.chooseWorker = data;
        } else {
            debugger
            let dataList = this.planModel.optionData.workerAndGroup;
            let index = dataList.findIndex(item => { return item.id == this.planModel.input.chooseGroup });
            let data = dataList[index].data;
            this.planModel.optionData.chooseWorker = data;
            this.planModel.input.chooseWorker = "";
            for (let item in this.planModel.updatePlan) {
                this.planModel.updatePlan[item] = [];
            }
            this.getRegionIds();
        }
    }

    //清空数据
    closeEvent() {
        //清空查询出来的数据
        this.planModel.input.planTypeInfo.forEach(item => {
            this.resetSingePlanInfo(item);
        })
        //重置输入框内的信息
        let copyInput = tool.copyValue(this.planModel.initInput)
        for (let item in copyInput) {
            if (Array.isArray(copyInput[item])) {
                this.planModel.input[item] = copyInput[item];
            } else if (copyInput[item] instanceof Object) {
                for (let item2 in copyInput[item]) {
                    this.planModel.input[item][item2] = copyInput[item][item2];
                }
            } else {
                if (this.hasGroup) {
                    if (item != 'chooseGroup') {
                        this.planModel.input[item] = copyInput[item];
                    }
                } else {
                    this.planModel.input[item] = copyInput[item];
                }
            }
        }
        //将绘制事件重置
        if (this.drawInfo.drawEvent) {
            this.drawInfo.drawEvent.reset();
        };
        this.pageShow.showPlanRound = true
        //清楚公共图层
        this.controlComLayer("init");
        //关闭页面
        this.pageShow.userDraw = true;
        this.pageShow.showSQLPage = false;
        this.pageShow.showSQLContent = true;
        this.pageShow.showPlace = true;
        this.pageShow.sendPlan = false;
        //关闭页面
        this.makePageControl(false);
        //详情页面关闭
        this.$nextTick(() => {
            this.planDataShow = false;
            this.pageShow.diaVisiable = false;
        })
    }

    /**
     * 提交任务前的验证
    */
    taskArrangeSubmit() {
        let tempValue = this.planModel.input;
        let editInfo = this.planModel.editInfo;
        let planNum = 0;
        let currentPlan = [];
        let title = "";
        if (tempValue.planType == "" && title == "") {
            title = '请选择巡检类型！';
        }
        if (tempValue.chooseWorker == "" && title == "") {
            title = '请选择巡检人员！';
        }
        if (tempValue.period == "" && title == "") {
            title = '请选择巡检周期';
        }
        if ((((!tempValue.planBegindate || !tempValue.planEnddate) && tempValue.period !== '3') || (tempValue.period === '3' && (!tempValue.planBegindate2 || !tempValue.planEnddate2))) && title == "") {
            title = '请选择巡检时间！';
        }
        if (tempValue.planPercent.toString() === '' && title == "") {
            title = '请填写计划完成率！';
        }
        if (tempValue.planTypeInfo.length == 0 && title == "") {
            title = '请完成计划！';
        } else {
            tempValue.planTypeInfo.forEach(item => {
                if (!item.planInfo) {
                    planNum++;
                } else {
                    if (item.planInfo.isCheckData && item.planInfo.selectData.length == 0) { //针对需要勾选的计划
                        planNum++;
                    } else if (!item.planInfo.isCheckData && item.planInfo.tableData.length == 0) {//针对需要框选的计划
                        planNum++;
                    } else {
                        currentPlan.push(item);
                    }
                }
            })
        }
        if (title != "") {
            this.$message({ type: "info", message: title });
            return;
        }
        if (planNum == tempValue.planTypeInfo.length) {
            this.$message({ type: "info", message: "请至少完成一个类型的计划！" });
            return;
        } else if (planNum != 0) {
            this.$confirm('计划类型未完全制定, 是否制定巡检计划?', '提示', {
                confirmButtonText: '计划制定',
                cancelButtonText: '继续制定',
                type: 'warning'
            }).then(() => {
                tempValue.planTypeInfo = currentPlan;
                this.addPlan(tempValue, editInfo);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消制定'
                });
            });
        } else {
            this.addPlan(tempValue, editInfo);
        }
    }

    /**
     * 提交任务制定内容
    */
    addPlan(tempValue, editInfo) {
        let planTypeInfo = tempValue.planTypeInfo;
        let lastPlanType = [];
        this.pageShow.endSend = true;
        tempValue.planType.forEach(item => {
            let index = planTypeInfo.findIndex(val => {
                return val.typeId == item;
            });
            if (index != -1) {
                lastPlanType.push(item);
            }
        })
        editInfo.inspectType = tool.getSelectValue(lastPlanType);//巡检类型
        editInfo.inspectGroupId = tool.getSelectValue(tempValue.chooseGroup);//巡检组
        editInfo.inspectUsers = tool.getSelectValue(tempValue.chooseWorker).replace(/,/g, ';');//巡检人员
        editInfo.planPercent = tempValue.planPercent;//巡检完成率
        editInfo.periodId = tempValue.period;//巡检周期
        let time = [tempValue.planBegindate, tempValue.planEnddate];
        if (tempValue.period == 3) {
            time = [tempValue.planBegindate2, tempValue.planEnddate2];
        }
        let dateList = tool.DateDiff(time, tempValue.period, tempValue.periodDay);//获取时间段及时间间隔
        debugger
        editInfo.planBegindate = dateList.planBegindate;//起始时间
        editInfo.planEnddate = dateList.planEnddate;//截止时间
        editInfo.intervalDay = dateList.intervalDay;//时间段
        editInfo.planType = '3'
        editInfo.isDispatching = tempValue.state;//是否派发（非计划型内容由下拉框决定）（与下面的isDispatching设置不重复，分别表示计划与非计划型的赋值）
        if (this.acceptData && this.acceptData.monthId) {//计划型任务默认暂时不派发
            editInfo.mouthId = this.acceptData.monthId;
            editInfo.isDispatching = '0';//是否派发
            editInfo.planType = '0'
        }
        let messageInfo = '';
        //首先循环巡检计划数组，清理是否存在sid缺失的管网设备，如果存在，则不能下达巡检计划
        // for (let i = 0; i < planTypeInfo.length; i++) {
        //     let data = planTypeInfo[i];
        //     if (!data.planInfo.sidExist.exist) {
        //         this.pageShow.endSend = false;
        //         this.$message({ type: "info", message: data.planInfo.sidExist.layerName + "设备缺少SID设备编码，不能派发任务，请联系管理员处理管网设备数据" });
        //         return;
        //     }
        // }
        //处理巡检计划的点及线
        planTypeInfo.forEach(item => {
            if (!item.planInfo.sidExist.exist) {
                messageInfo = item.planInfo.sidExist.layerName
            }
            if (item.layerName == '巡检点') {
                let planInfo = item.planInfo;
                if (planInfo.selectData.length > 0) {
                    planInfo.sendInfo.totalLength = 0;
                    planInfo.sendInfo.totalCount = planInfo.selectData.length;
                    planInfo.selectData.forEach(value => {
                        planInfo.containReg.push(value.regionId);
                        planInfo.containRegNames.push(value.regionName);
                        planInfo.getQueryResult.allSidIds.push(value.id);
                        planInfo.sendInfo.pointTempList.push(tool.getPointTempPointItem(item.typeId, item.layerName, value.lat, value.lng, this.data.mapView.spatialReference));
                    });
                }
                planInfo.isComplete = true;//表示该类型在提交前完成计算
            } else if (item.layerName == '隐患点') {
                let planInfo = item.planInfo;
                if (planInfo.selectData.length > 0) {
                    planInfo.sendInfo.totalLength = 0;
                    planInfo.sendInfo.totalCount = planInfo.selectData.length;
                    planInfo.selectData.forEach(value => {
                        planInfo.containReg.push(value.regionId);
                        planInfo.containRegNames.push(value.regionName);
                        planInfo.getQueryResult.allSidIds.push(value.id);
                        planInfo.sendInfo.pointTempList.push(tool.getPointTempPointItem(item.typeId, item.layerName, value.lttd, value.lgtd, this.data.mapView.spatialReference));
                    })
                }
                planInfo.isComplete = true;//表示该类型在提交前完成计算
            } else if (item.layerName == '工地监护点') {
                let planInfo = item.planInfo;
                if (planInfo.selectData.length > 0) {
                    planInfo.sendInfo.totalLength = 0;
                    planInfo.sendInfo.totalCount = planInfo.selectData.length;
                    planInfo.selectData.forEach(value => {
                        planInfo.containReg.push(value.regionId);
                        planInfo.containRegNames.push(value.regionName);
                        planInfo.getQueryResult.allSidIds.push(value.id);
                        planInfo.sendInfo.pointTempList.push(tool.getPointTempPointItem(item.typeId, item.layerName, value.lttd, value.lgtd, this.data.mapView.spatialReference));
                    })
                }
                planInfo.isComplete = true;//表示该类型在提交前完成计算
            } else if (item.layerName == '巡检线') {
                let planInfo = item.planInfo;
                if (planInfo.selectData.length > 0) {
                    let polylines = [];
                    planInfo.selectData.forEach(value => {
                        planInfo.sendInfo.totalLength += isNaN(value.length) ? parseFloat(value.length) : value.length;
                        planInfo.containReg.push(value.regionId);
                        planInfo.containRegNames.push(value.regionName);
                        planInfo.getQueryResult.allSidIds.push(value.id);
                        let geo = JSON.parse(value.geometry);
                        for (let i = 0; i < (geo.length - 1); i++) {
                            let itemGeometry = {
                                paths: [geo[i], geo[i + 1]],
                                // spatialReference: this.mapV.spatialReference,
                                type: "polyline"
                            }
                            polylines.push(itemGeometry);
                        }
                    })
                    this.mathLength({ polylines: polylines }, item);
                }
            } else if (item.layerName == '排水管道') {
                this.conductPipe(item);
            } else {
                this.conductPoint(item);//其它节点
            }
        });
        //因为有异步计算长度，所有这里使用定时任务进行监听
        this.setIntervalEvent = window.setInterval(function () {
            let index = planTypeInfo.findIndex(item => { return item.planInfo.isComplete == false });
            if (index == -1) {
                window.clearInterval(this.setIntervalEvent);
                this.pageShow.sendPlan = true;//提交按钮禁用
                let regionId = [];
                let regionName = [];
                let totalCount = 0;
                let totalLength = 0;
                let pointTempList = [];
                let inspectContents = [];
                let planTypeOverList = [];
                planTypeInfo.forEach(item => {//组装计划信息
                    let planInfo = item.planInfo;
                    regionId = regionId.concat(planInfo.containReg);
                    regionName = regionName.concat(planInfo.containRegNames);
                    totalCount += planInfo.sendInfo.totalCount;
                    totalLength += planInfo.sendInfo.totalLength;
                    inspectContents.push({
                        layerName: item.layerName,
                        layerId: item.layerId,
                        typeId: item.typeId,
                        data: item.planInfo.getQueryResult.allSidIds
                    })
                    pointTempList = pointTempList.concat(planInfo.sendInfo.pointTempList);
                    planTypeOverList.push({
                        completionRate: item.planPercent,
                        typeId: item.typeId,
                        typeName: item.layerName,
                        totalCount: planInfo.sendInfo.pointTempList.length
                    })
                });
                editInfo.planTypeOverList = planTypeOverList;
                editInfo.inspectContents = JSON.stringify(inspectContents);
                editInfo.pointTempList = pointTempList;//涉及的临时点
                editInfo.regionId = tool.arrayToHeavy(regionId).join(',');//涉及的片区ID
                editInfo.regionName = tool.arrayToHeavy(regionName).join(',');//涉及的片区名称
                editInfo.totalCount = totalCount;//总个数
                editInfo.totalLength = totalLength;//总长度
                let send = null
                if (this.addOrUpdateOrLook == 'add') {
                    send = addTaskArrange;
                    delete editInfo.planState;
                } else if (this.addOrUpdateOrLook == 'update') {
                    send = editTaskArrange;
                    editInfo.id = this.searchModel.getData.getData[0].id;
                    editInfo.planState = tempValue.planState;
                    editInfo.createUser = tempValue.createUser;
                    if (this.acceptData) {
                        editInfo.mouthId = this.acceptData.monthId;
                    } else {
                        editInfo.mouthId = '';
                    }
                }
                send(editInfo).then(res => {
                    let messageText = '制定成功';
                    this.pageShow.endSend = false;
                    if (res.message) {
                        messageText = res.message;
                    }
                    this.closeEvent();
                    this.$message({ type: "success", message: messageText });
                    this.getData();
                })
            }
        }.bind(this), 200)
    }

    //取消提交任务
    cancelSubmit() {
        this.closeEvent();
    }

    //点击主页面删除按钮后触发
    taskArrangeDelete() {
        this.$confirm('确定删除选中的' + this.searchModel.getData.getData.length + '条计划信息?', '提示', {
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
    }
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
            let messageText = '删除成功';
            if (res.message) {
                messageText = res.message;
            }
            this.$message.success(messageText);
            this.getData();
        })
        //this.dialogDelete = false
    }

    //时间选择器切换
    changeDate(show) {
        if (show) {
            this.dateShow.moreDate = true;
            this.dateShow.singeDate = false;
        } else {
            this.dateShow.moreDate = false;
            this.dateShow.singeDate = true;
        }
    }

    //时间间隔改变
    changePeriodDay() {
        this.chooseCheckPeriod();
    }

    //选择巡查周期时触发
    chooseCheckPeriod() {
        let input = this.planModel.input;
        //input.planBegindatePick.onPick = item => { };
        //input.planEnddatePick.onPick = item => { };
        input.planBegindatePick.disabledDate = item => { };
        input.planEnddatePick.disabledDate = item => { };
        input.planBegindate2Pick.disabledDate = item => { };
        input.planEnddate2Pick.disabledDate = item => { };
        input.planBegindate = "";
        input.planBegindate2 = "";
        input.planEnddate2 = "";
        input.planEnddate = "";
        if (input.period === '1') { //一天一巡
            this.pageShow.showPlanRound = true
            this.changeDate(true);
            //只能选择当天及以后并且小于等于结束时间
            input.planBegindatePick.disabledDate = time => {
                let greaterThanNew = (time.getTime() < Date.now() - 8.64e7);//大于等于当前
                if (input.planEnddate) {
                    let lessThanEnd = (time.getTime() >= new Date(input.planEnddate));//小于等于最后一天
                    return lessThanEnd || greaterThanNew;
                } else {
                    return greaterThanNew;
                }
            };
            //只能选择当天及以后并且大于等于结束时间
            input.planEnddatePick.disabledDate = time => {
                let greaterThanNew = (time.getTime() < Date.now() - 8.64e7);//大于等于当前
                if (input.planBegindate) {
                    let greaterThanStart = (new Date(input.planBegindate).getMilliseconds() - 1000 * 60 * 60 * 24 > time.getTime());//大于等于开始时间
                    return greaterThanStart || greaterThanNew;
                } else {
                    return greaterThanNew;
                }
            }
        } else if (input.period === '2') { //一周一巡
            this.pageShow.showPlanRound = true;
            this.changeDate(true);
            input.planBegindatePick.disabledDate = time => {
                let greaterThanNew = (time.getTime() < Date.now() - 8.64e7);//大于等于当前
                if (input.planEnddate) {
                    let lessThanEnd = new Date(input.planEnddate) > time.getTime();//小于等于最后一天
                    return greaterThanNew || !lessThanEnd
                } else {
                    return greaterThanNew
                }
            }
            input.planEnddatePick.disabledDate = time => {
                let greaterThanNew = (time.getTime() < Date.now() - 8.64e7);//大于等于当前
                if (input.planBegindate) {
                    let greaterThanStart = (new Date(input.planBegindate).getMilliseconds() - 1000 * 60 * 60 * 24 > time.getTime());//大于等于开始时间
                    return greaterThanNew || greaterThanStart;
                } else {
                    return greaterThanNew
                }
            }
        } else if (input.period === '3') { //一月一巡
            this.pageShow.showPlanRound = true;
            this.changeDate(false);
            // input.planBegindate2Pick.disabledDate = time => (time.getTime() < Date.now() - 8.64e7);

            input.planBegindate2Pick.disabledDate = time => {
                let greaterThanNew = (time.getTime() < Date.now() - 8.64e7);//大于等于当前
                if (input.planEnddate) {
                    let lessThanEnd = (time.getTime() >= new Date(input.planEnddate));//小于等于最后一天
                    return lessThanEnd || greaterThanNew;
                } else {
                    return greaterThanNew;
                }
            };
            //只能选择当天及以后并且大于等于结束时间
            input.planEnddate2Pick.disabledDate = time => {
                let greaterThanNew = (time.getTime() < Date.now() - 8.64e7);//大于等于当前
                if (input.planBegindate) {
                    let greaterThanStart = (new Date(input.planBegindate).getMilliseconds() - 1000 * 60 * 60 * 24 > time.getTime());//大于等于开始时间
                    return greaterThanStart || greaterThanNew;
                } else {
                    return greaterThanNew;
                }
            }
        } else if (input.period === '4') { //自定义
            this.pageShow.showPlanRound = false;
            this.changeDate(true);
            //this.periodDay = '';
            //只能选择当天及以后并且小于等于结束时间
            input.planBegindatePick.disabledDate = time => {
                let greaterThanNew = (time.getTime() < Date.now() - 8.64e7);//大于等于当前
                return greaterThanNew;
            };
            //只能选择当天及以后并且大于等于结束时间
            input.planEnddatePick.disabledDate = time => {
                let greaterThanNew = (time.getTime() < Date.now() + 8.64e7 * parseInt((input.periodDay - 1).toString()));//大于等于当前
                if (input.planBegindate) {
                    let greaterThanStart = (new Date(input.planBegindate).getMilliseconds() + 1000 * 60 * 60 * 24 > time.getTime());//大于等于开始时间
                    return greaterThanStart || greaterThanNew;
                } else {
                    return greaterThanNew;
                }
            }
        }
    }

    //自定义开始时间的改变
    changeCustomS() {
        let input = this.planModel.input;
        // if(input.period== 4){
        //     let timeSplit=24 * 60 * 60 * 1000 * parseInt(input.periodDay - 1);
        //     let planBegindate=new Date(input.planBegindate);
        //     let nextDay = new Date(planBegindate.getTime() + timeSplit);
        //     let nextDate = nextDay.getFullYear() + "-" + (nextDay.getMonth()+1) + "-" + nextDay.getDate();
        //     input.planEnddate=nextDate;
        // }
    }

    //自定义结束时间的改变
    changeCustomE() {
        let input = this.planModel.input;
        // if(input.period== 4){
        //     let timeSplit=24 * 60 * 60 * 1000 * parseInt(input.periodDay - 1);
        //     let planEnddate=new Date(input.planEnddate);
        //     let nextDay = new Date(planEnddate - timeSplit);
        //     let nextDate = nextDay.getFullYear() + "-" + (nextDay.getMonth()+1) + "-" + nextDay.getDate();
        //     input.planBegindate=nextDate;
        // }
    }

    //展示详细信息
    planInfo(e) {
        this.pageShow.diaVisiable = true //显示详细页面弹窗
        this.$nextTick(() => {
            this.addOrUpdateOrLook = 'look';
            //初始化部分数据
            //@ts-ignore
            this.$refs.xjType.innerHTML = '<span class="flexTitle">巡查类型：</span>' + '<span class="flexInfo">' + e.inspectType + '</span>'
            //@ts-ignore
            this.$refs.xjGroup.innerHTML = '<span class="flexTitle">巡查组：</span>' + '<span class="flexInfo">' + (e.inspectGroup == "" ? "全部" : e.inspectGroup) + '</span>'
            //@ts-ignore
            this.$refs.xjWorker.innerHTML = '<span class="flexTitle">巡查人：</span>' + '<span class="flexInfo">' + e.inspectUserList + '</span>'
            //@ts-ignore
            this.$refs.xjBeginAndEndTime.innerHTML = '<span class="flexTitle">起止时间：</span>' + '<span class="flexInfo">' + e.planBegindate + ' - ' + e.planEnddate + '</span>';
            let planPercents = [];
            if (e.planTypeOverList && e.planTypeOverList.length > 0) {
                e.planTypeOverList.forEach(item => {
                    planPercents.push(item.typeName + ":" + item.completionRate + "%");
                })
            }
            let planPercentStr = planPercents.join(";");
            //@ts-ignore
            this.$refs.xjPlanNumber.innerHTML = '<span class="flexTitle" style="position: relative;float: left;">计划完成率：</span>' +
                '<span class="flexInfo" style="width: calc(100% - 100px);display: block; position: relative;float: left; overflow: hidden;text-overflow: ellipsis; white-space: nowrap;" title="'
                + planPercentStr + '">' + planPercentStr + '</span>'
            //@ts-ignore
            this.$refs.mapBox1.appendChild(this.$refs.cctvMap);
            //@ts-ignore
            this.$refs.cctvMap.style.display = '';
            //地图容器初始隐藏，需要更新size
            if (this.mapV) {
                this.mapV.updateSize()
            }
            //获取计划详情
            queryDetail(e.id).then(res => {
                if (res.code == 1) {
                    if (res.result)
                        this.initUpDateData(res.result);
                } else {
                    this.$message({ type: "info", message: res.message });
                }
            })
        })

    }

    /**
     * 处理地图点数据(points格式[[x,y]])
    */
    addPointToMap(points: number[][], layer: VectorLayer<VectorSource<any>>) {
        this.clearLayer(layer);
        const map = this.mapV;
        const style = new Style({
            image: new Icon({
                src: locationIcon,
                color: "#2D74E7",
                scale: 0.5
            })
        })
        const feature = new Feature({
            geometry: new MultiPoint(points)
        })
        feature.setStyle(style);
        layer.getSource().addFeature(feature);
    }

    //处理线地图数据(lines的格式[[[x,y],[x1,x2]],[[x3,y3],[x4,x4]]])
    addLineToMap(lines: number[][][], layer: VectorLayer<VectorSource<any>>) {
        this.clearLayer(layer);
        const source = layer.getSource();
        const style = new Style({
            stroke: new Stroke({
                width: 2,
                color: "#2D74E7"
            })
        })
        for (let i = 0; i < lines.length; i++) {
            const geo = lines[i];
            const linestring = new LineString(geo);
            const feature = new Feature({
                geometry: linestring
            })
            feature.setStyle(style);
            source.addFeature(feature);
        }
    }
    //高亮点及定位pointData的格式[x,y]
    highPointToMap(pointData: number[]) {
        //清空高亮图层
        this.clearLayer(this.comLayerList.highLayer);
        const style = new Style({
            image: new Icon({
                src: locationIcon,
                scale: 0.5,
                color: this.comColorList.highColor
            })
        })
        const feature = new Feature({
            geometry: new Point(pointData)
        })
        feature.setStyle(style)
        this.comLayerList.highLayer.getSource().addFeature(feature);
        //定位
        this.mapV.getView().animate({
            center: [pointData[0], pointData[1]],
            zoom: 17
        })
    }
    //高亮线及定位(lines的格式[[[x,y],[x1,x2]],[[x3,y3],[x4,x4]]])
    hLineToMap(lines: number[][]) {
        this.clearLayer(this.comLayerList.highLayer);
        const line = new LineString(lines);
        const feature = new Feature({
            geometry: line
        })
        const style = new Style({
            stroke: new Stroke({
                width: 2,
                color: this.comColorList.highColor
            })
        })
        feature.setStyle(style);
        const mainmap = this.mapV;
        this.comLayerList.highLayer.getSource().addFeature(feature);
        mainmap.getView().fit(line, {
            size: mainmap.getSize(),
            maxZoom: 19,
            duration: 1000
        });
    }

    /**
     * 计算长度
     * */
    mathLength(data, planItem) {
        let url = "";
        let sendInfo = planItem.planInfo.sendInfo;
        data.pointTempList = [];
        if (!data.polylines || data.polylines.length == 0) {
            if (sendInfo.pointTempList.length > 0) {
                sendInfo.totalCount = sendInfo.pointTempList.length;
                planItem.planInfo.isComplete = true;//表示该类型在提交前完成计算
            } else {
                return;
            }
        }

        if (planItem.layerName.indexOf('管道') >= 0) {
            // if (res && res.lengths && res.lengths.length > 0) {
            //     res.lengths.forEach((item, index) => {
            //         sendInfo.pointTempList.push({
            //             "inspectTypeId": planItem.typeId,
            //             "layerName": planItem.layerName,
            //             "lat": data.polylines[index].paths[0][1][1],
            //             "lng": data.polylines[index].paths[0][1][0],
            //             "length": item,
            //             "geometry": JSON.stringify(data.polylines[index]),
            //         })
            //     })
            // }
        } else if (planItem.layerName == '巡检线') {
            //if (res && res.lengths && res.lengths.length > 0) {
            sendInfo.pointTempList.push({
                "inspectTypeId": planItem.typeId,
                "layerName": planItem.layerName,
                "lat": data.polylines[0].paths[0][1],
                "lng": data.polylines[0].paths[0][0],
                "length": 0,
                "geometry": JSON.stringify(data.polylines[0]),
            });
            data.polylines.forEach((item, index) => {
                sendInfo.pointTempList.push({
                    "inspectTypeId": planItem.typeId,
                    "layerName": planItem.layerName,
                    "lat": data.polylines[index].paths[1][1],
                    "lng": data.polylines[index].paths[1][0],
                    "length": this.calculateLength(data.polylines[index].paths),
                    "geometry": JSON.stringify(data.polylines[index]),
                })
            })
            //}
        }
        sendInfo.totalCount = sendInfo.pointTempList.length;
        planItem.planInfo.isComplete = true;//表示该类型在提交前完成计算

        // if (
        //     !appconfig.gisResource.geometry ||
        //     !appconfig.gisResource.geometry.config[0] ||
        //     !appconfig.gisResource.geometry.config[0].url
        // ) {
        //     url =
        //         "http://192.168.2.245:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer";
        // } else {
        //     url = appconfig.gisResource.geometry.config[0].url;
        // }
        // let geometryService = new this.arcgis.GeometryService(url);
        // let lengthsParameters = new this.arcgis.LengthsParameters({
        //     geodesic: true,
        //     polylines: data.polylines,
        //     lengthUnit: this.arcgis.GeometryService.UNIT_METER
        // });
        // geometryService.lengths(lengthsParameters).then(res => {
        //     if (planItem.layerName == '管线') {
        //         if (res && res.lengths && res.lengths.length > 0) {
        //             res.lengths.forEach((item, index) => {
        //                 sendInfo.pointTempList.push({
        //                     "inspectTypeId": planItem.typeId,
        //                     "layerName": planItem.layerName,
        //                     "lat": data.polylines[index].paths[0][1][1],
        //                     "lng": data.polylines[index].paths[0][1][0],
        //                     "length": item,
        //                     "geometry": JSON.stringify(data.polylines[index]),
        //                 })
        //             })
        //         }
        //     } else if (planItem.layerName == '巡检线') {
        //         if (res && res.lengths && res.lengths.length > 0) {
        //             sendInfo.pointTempList.push({
        //                 "inspectTypeId": planItem.typeId,
        //                 "layerName": planItem.layerName,
        //                 "lat": data.polylines[0].paths[0][0][1],
        //                 "lng": data.polylines[0].paths[0][0][0],
        //                 "length": 0,
        //                 "geometry": JSON.stringify(data.polylines[0]),
        //             });
        //             res.lengths.forEach((item, index) => {
        //                 sendInfo.pointTempList.push({
        //                     "inspectTypeId": planItem.typeId,
        //                     "layerName": planItem.layerName,
        //                     "lat": data.polylines[index].paths[0][1][1],
        //                     "lng": data.polylines[index].paths[0][1][0],
        //                     "length": item,
        //                     "geometry": JSON.stringify(data.polylines[index]),
        //                 })
        //             })
        //         }
        //     }
        //     sendInfo.totalCount = sendInfo.pointTempList.length;
        //     planItem.planInfo.isComplete = true;//表示该类型在提交前完成计算
        // });
    }

    /**
     * 打断线并求取长度
    */
    breakLine(currentData) {
        let overlengthPipe = currentData.planInfo.overlengthPipe;
        var cnum = overlengthPipe.paths.length;
        let lengths = overlengthPipe.lengths;
        let polylines = [];
        let d = this.breakLength;
        for (var i = 0; i < cnum; i++) {
            var len = lengths[i];
            let path = overlengthPipe.paths[i];
            let pointOne = path[0];
            let pointTwo = path[1];
            let prePoint = path[0];
            if (len > d) {//大于规定距离
                var count = Math.floor(len / d) - 1;
                if (count > 0) {
                    var pt1 = pointOne, pt2 = pointTwo;
                    var k = (pt2[1] - pt1[1]) / (pt2[0] - pt1[0]);
                    var mlen = Math.sqrt((pt2[1] - pt1[1]) * (pt2[1] - pt1[1]) + (pt2[0] - pt1[0]) * (pt2[0] - pt1[0]));
                    var md = mlen / (count + 1);
                    var sqk = Math.sqrt(1 + k * k);
                    var dd = md;
                    let x, y;
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
                            paths: [[prePoint, [x, y]]],
                            type: "polyline"
                        });
                        prePoint = [x, y];
                    }
                    polylines.push({
                        paths: [[[x, y], pointTwo]],
                        type: "polyline"
                    })
                } else {
                    polylines.push({
                        paths: [path],
                        type: "polyline"
                    })
                }
            }
        }
        this.mathLength({ polylines: polylines }, currentData)
    }
    /**
     * 该方法用于计算长度
     * @param points 
     */
    calculateLength(points: number[][]) {
        const geometry = new LineString(points);
        const length = getLength(geometry, { projection: "EPSG:4326" });
        return length
    }
    //处理巡检点数据
    planPoint(saveData) {
        let planInfo = saveData.planInfo;
        let data = {
            current: 1,
            size: 10000
        };
        queryXjPoint(data).then(res => {
            let dataList = [];
            if (this.planModel.regionInfo.currentRegion) {
                res.result.records.forEach(item => {
                    let index = this.planModel.regionInfo.currentRegion.findIndex(item2 => { return item2.id == item.regionId });
                    if (index != -1) {
                        dataList.push(item);
                    }
                })
            } else {
                dataList = res.result.records;
            }
            planInfo.tableData = dataList;
            this.$nextTick(() => {
                if (this.addOrUpdateOrLook != "add") { this.toggleSelection(saveData); }
                let points = [];
                planInfo.tableData.forEach(item => {
                    points.push([item.lng, item.lat]);
                });
                this.addPointToMap(points, planInfo.layer);
                planInfo.total = planInfo.tableData.length;
            })
        })
    }
    //处理隐患点数据
    planHidPoint(saveData) {
        let planInfo = saveData.planInfo;
        let data = {
            current: 1,
            size: 10000,
            auditResult: "1",//已审核通过
            state: "1"//未被消除的隐患
        };
        queryDangerReport(data).then(res => {
            let dataList = [];
            if (this.planModel.regionInfo.currentRegion) {
                res.result.records.forEach(item => {
                    let index = this.planModel.regionInfo.currentRegion.findIndex(item2 => { return item2.id == item.regionId });
                    if (index != -1) {
                        item.lng = item.lgtd;
                        item.lat = item.lttd;
                        dataList.push(item);
                    }
                })
            } else {
                res.result.records.forEach(item => {
                    item.lng = item.lgtd;
                    item.lat = item.lttd;
                    dataList.push(item);
                })
            }
            planInfo.tableData = dataList;
            this.$nextTick(() => {
                if (this.addOrUpdateOrLook != "add") { this.toggleSelection(saveData); }
                let points = [];
                planInfo.tableData.forEach(item => {
                    item.lng = item.lgtd;
                    item.lat = item.lttd;
                    points.push([item.lgtd, item.lttd]);
                });
                this.addPointToMap(points, planInfo.layer);
                planInfo.total = planInfo.tableData.length;
            })
        })
    }
    //处理工地监护点数据
    planSitePoint(saveData) {
        let planInfo = saveData.planInfo;
        let data = {
            current: 1,
            size: 10000,
            auditResult: "1",//已审核通过
            state: "1"//未被消除的隐患
        };
        queryBuildList(data).then(res => {
            let dataList = [];
            if (this.planModel.regionInfo.currentRegion) {
                res.result.records.forEach(item => {
                    let index = this.planModel.regionInfo.currentRegion.findIndex(item2 => { return item2.id == item.regionId });
                    if (index != -1) {
                        item.lng = item.lgtd;
                        item.lat = item.lttd;
                        dataList.push(item);
                    }
                })
            } else {
                res.result.records.forEach(item => {
                    item.lng = item.lgtd;
                    item.lat = item.lttd;
                    dataList.push(item);
                })
            }
            planInfo.tableData = dataList;
            this.$nextTick(() => {
                if (this.addOrUpdateOrLook != "add") { this.toggleSelection(saveData); }
                let points = [];
                planInfo.tableData.forEach(item => {
                    item.lng = item.lgtd;
                    item.lat = item.lttd;
                    points.push([item.lgtd, item.lttd]);
                });
                this.addPointToMap(points, planInfo.layer);
                planInfo.total = planInfo.tableData.length;
            })
        })
    }
    //巡检线
    planLine(saveData) {
        let planInfo = saveData.planInfo;
        let data = {
            current: 1,
            size: 10000
        };
        queryXjLine(data).then(res => {
            let lines = [];
            let dataList = [];
            if (this.planModel.regionInfo.currentRegion) {
                res.result.records.forEach(item => {
                    let index = this.planModel.regionInfo.currentRegion.findIndex(item2 => { return item2.id == item.regionId });
                    if (index != -1) {
                        dataList.push(item);
                    }
                })
            } else {
                res.result.records.forEach(item => {
                    dataList.push(item);
                })
            }
            planInfo.tableData = dataList;
            this.$nextTick(() => {
                if (this.addOrUpdateOrLook != "add") { this.toggleSelection(saveData); }
                planInfo.total = planInfo.tableData.length;
                if (planInfo.tableData && planInfo.tableData.length > 0) {
                    planInfo.tableData.forEach(item => {
                        if (item.geometry && item.geometry != "") {
                            let geo = JSON.parse(item.geometry);
                            //item.geometryPaths = geo;
                            lines.push(lines, geo);
                        }
                    });
                } else {
                    return;
                }
                this.addLineToMap(lines, planInfo.layer);
            })
        });
    }

    /**
     * 修改时默认选中及查看时数据的显示
    */
    toggleSelection(saveData) {
        let planInfo = saveData.planInfo;
        let indexList = [];
        this.planModel.updatePlan.forEach(item => {
            if (item.typeId == saveData.typeId) {
                indexList = item.data
            }
        });
        if (this.addOrUpdateOrLook == 'update') {
            let index = this.planModel.input.planTypeInfo.findIndex(item => { return item.typeId == saveData.typeId });
            let refDom = "datatable" + index;
            let itemList = [];
            planInfo.tableData.forEach(item => {
                let index = indexList.findIndex(item2 => { return item2 == item.id });
                if (index != -1) {
                    this.$refs[refDom][0].toggleRowSelection(item, true);
                    itemList.push(item);
                }
            });
            planInfo.selectData = itemList;
        };
        if (this.addOrUpdateOrLook == 'look') {
            let rows = [];
            planInfo.tableData.forEach(item => {
                let index = indexList.findIndex(item2 => { return item2 == item.id });
                if (index != -1) {
                    rows.push(item);
                }
            });
            planInfo.tableData = rows;
        }
    }

    /**
     * 巡检类型改变时触发事件
    */
    xjTypeChange(e?) {
        let typeInfo = this.planModel.input.planTypeInfo.concat([]);
        let planType = this.planModel.input.planType;
        let planTypeList = this.planModel.optionData.planType;
        let layerNames = this.planModel.optionData.layerNames;
        if (planType) {//判断是否选择了巡检类型
            //将获取的巡检类型转换成数据
            let typeList = [];
            if (Array.isArray(planType)) {
                typeList = planType;
            } else {
                typeList.push(planType);
            }
            typeList.forEach(item => {
                let index = typeInfo.findIndex(item2 => { return item2.typeId == item });
                //当未加入巡检信息列表时，查询改类型的图层名称及图层id
                if (index == -1) {
                    let layerName = "";
                    let layerId = "";
                    let layerNameEn = "";
                    for (let value of planTypeList) {
                        if (value.id === item) {
                            layerName = value.layerName
                            layerNameEn = value.layerNameEn
                        }
                    }
                    for (let value of layerNames) {
                        if (value.label === layerName) {
                            layerId = value.value
                        }
                    }
                    typeInfo.push({ name: layerName, layerName: layerName, layerNameEn: layerNameEn, planPercent: 100, layerId: layerId, typeId: item, planInfo: null, exist: true, fristSelect: true })
                } else {
                    typeInfo[index].exist = true;
                    typeInfo[index].fristSelect = false;
                }
            });
            //提取出下拉框里面的巡检类型
            let currentTypeInfo = typeInfo.filter(item => {
                if (item.exist) {
                    item.exist = false;
                    return item
                } else {
                    //将取消掉的巡检类型的图层给去掉
                    this.removeLayer(item.planInfo.layer);
                    item.planInfo.layer = null;
                }
            })
            this.planModel.input.planTypeInfo = currentTypeInfo;
            this.initHandlePage();
        } else {
            //将取消掉的巡检类型的图层给去掉
            this.planModel.input.planTypeInfo.forEach(item => {
                this.removeLayer(item.planInfo.layer);
                item.planInfo.layer = null;
            })
            this.planModel.input.planTypeInfo = [];
        }
        //如果没有选择巡检类型则将当前指向的巡检数据置空
        if (this.planModel.input.planTypeInfo.length == 0) {
            //this.planModel.input.currentPlanTypeInfo=null;
            this.planDataShow = false;
            this.pageShow.showSQLPage = false;
        } else {
            this.planDataShow = true;
        }
        //确认是否存在需要绘制范围的管线数据
        if (this.planModel.input.planTypeInfo) {
            let showD = true;
            for (let item in this.planModel.input.planTypeInfo) {
                let serchItem = this.planModel.input.planTypeInfo[item];
                if (serchItem.planInfo.isServer) {
                    showD = false;
                }
            }
            this.pageShow.userDraw = showD;
        }
    }

    /**
     * 移除图层
     * */
    removeLayer(layer) {
        if (layer) {
            this.mapV.removeLayer(layer);
        }
    }


    /**
     * 当巡检片区改变的时候，重新查询出的内容
     */
    resetHandlePage() {
        this.comLayerList.drawLayer.removeAll();
        this.comLayerList.highLayer.removeAll();
        for (let item in this.planModel.input.planTypeInfo) {
            let data = this.planModel.input.planTypeInfo[item];
            this.resetSingePlanInfo(data);
            if (data.layerName == '') {
                return;
            } else if (data.layerName == '巡检点') {
                this.planPoint(data);
            } else if (data.layerName == '巡检线') {
                this.planLine(data);
            } else if (data.layerName == '隐患点') {
                this.planHidPoint(data);
            } else if (data.layerName == '工地监护点') {
                this.planSitePoint(data);
            }
        }
    }

    /**
     * 清空页面结果,但保留SQL设置部分
     */
    resetSingePlanInfoSaveWhere(data) {
        this.clearLayer(data.planInfo.layer);
        data.planInfo.tableData = [];
        data.planInfo.pageInfo.currentData = [];
        data.planInfo.pageInfo.currentIndex = 1;
        data.planInfo.selectData = [];
        data.planInfo.total = 0;
        data.planInfo.drawGraphic = null;
        data.planInfo.pointLineResult = null;
        data.planInfo.inspectContents = null;
        data.planInfo.sendInfo.pointTempList = [];
        data.planInfo.sendInfo.totalCount = 0;
        data.planInfo.sendInfo.totalLength = 0;
        tool.setVaule(data.planInfo.overlengthPipe, []);
        tool.setVaule(data.planInfo.getQueryResult, []);
        data.planInfo.sidExist.exist = true;
        data.planInfo.sidExist.layerName = '';
    }

    /**
     * 清空单个页面的内容
     */
    resetSingePlanInfo(data) {
        this.resetSingePlanInfoSaveWhere(data);
    }

    /**
     * 初始化内容页面
     */
    initHandlePage() {
        for (let item in this.planModel.input.planTypeInfo) {
            let data = this.planModel.input.planTypeInfo[item];
            if (this.addOrUpdateOrLook == 'update' && this.planModel.updatePlanPercent) {
                let index = this.planModel.updatePlanPercent.findIndex(val => { return val.typeId == data.typeId });
                data.planPercent = this.planModel.updatePlanPercent[index].completionRate;
            }
            //第一次加入的时候才进行初始化
            if (data.fristSelect) {
                if (data.layerName == '') {
                    return;
                } else if (data.layerName == '巡检点') {
                    data.planInfo = this.initData(initConfig.planHeader.xj, true, false)
                    this.planPoint(data);
                } else if (data.layerName == '巡检线') {
                    data.planInfo = this.initData(initConfig.planHeader.xj, true, false)
                    this.planLine(data);
                } else if (data.layerName == '隐患点') {
                    data.planInfo = this.initData(initConfig.planHeader.yh, true, false)
                    this.planHidPoint(data);
                } else if (data.layerName == '工地监护点') {
                    data.planInfo = this.initData(initConfig.planHeader.gd, true, false)
                    this.planSitePoint(data);
                } else if (data.layerName.indexOf("管道") != -1) {
                    data.planInfo = this.initData(initConfig.planHeader.pipeLine, false, true);
                    if (this.addOrUpdateOrLook != 'add') {
                        this.groupGetInfoBySid(data);
                    }
                } else {
                    data.planInfo = this.initData(initConfig.planHeader.pipePoint, false, true)
                    if (this.addOrUpdateOrLook != 'add') {
                        this.groupGetInfoBySid(data);
                    }
                }
            }
        }
        if (this.planModel.input.planTypeInfo.length > 0) {
            this.paneHandleClick();
        }
        //this.mapV.map.reorder(this.comLayerList.highLayer, this.mapV.map.layers.length)
    }

    /**
     * 将数据格式化为planTypeInfo的planInfo
     */
    initData(header, isCheckData, isServer) {
        const layer = new VectorLayer({
            source: new VectorSource()
        })
        //防止遮挡高亮图层
        const layers = this.mapV.getLayers();
        layers.setAt(2, layer);
        return {
            header: header,//表头
            tableData: [],//数据
            isCheckData: isCheckData,//是否需要选择按钮
            selectData: [],//选择的数据
            layer: layer,//渲染的图层
            total: 0,//总数
            isComplete: false,//提交前数据是否计算完毕
            containReg: [],//包含的片区
            containRegNames: [],//包含的片区的名称
            isServer: isServer,//是否可以查询字段
            where: "",//设置的查询条件（isServer当是true的时候才有用）
            drawGraphic: null,//绘制的图形
            pointLineResult: null,//选择图形的集合
            inspectContents: null,//后端保存的图形数据
            overlengthPipe: {//管线处理的集合
                paths: [],//大于限制值的管线（这部分管线需要进行切割处理）
                lengths: [],//大于限制值的管线的长度
                breakLine: [],//已经打断过后的线段
            },
            pageInfo: {
                currentIndex: 1,//当前页面
                currentData: [],//当前页面的数据
            },
            sendInfo: {//后端需要的信息
                pointTempList: [],//点信息
                totalCount: 0,//数量
                totalLength: 0//总长度
            },
            getQueryResult: {//获取查询数据的集合
                allObjectIds: [],//最开始查询出的objectid
                groupObjectIds: [],//根据1000为刻度分割出的objectid组
                resultInfo: [],//请求出的所有图形信息
                allSidIds: [],//管网的sid集合
            },
            sidExist: {//查询的管网设备中必须保证所有的设备都有sid，不存在sid则不能下派计划
                exist: true,//默认都存在
                layerName: ''//不存在sid的图层
            }
        }
    }

    /**
     * 监听页面切换(巡检类型改变时也进行切换)
     */
    paneHandleClick() {
        let data = this.getCurrentPlanTypeInfo();
        if (!data) {
            return;
        }
        this.comLayerList.highLayer.getSource().clear();
        this.planModel.input.planTypeInfo.forEach((item, index) => {
            if (data.planInfo.layer != item.planInfo.layer) {
                item.planInfo.layer.visible = false;
            } else {
                item.planInfo.layer.visible = true;
                this.clearLayer(this.comLayerList.drawLayer);
                if (item.planInfo.drawGraphic) {
                    //this.comLayerList.drawLayer.add(item.planInfo.drawGraphic);
                }
            }
        });
        if (data.planInfo.isServer && this.addOrUpdateOrLook != 'look') {
            //获取SQL查询中的字段
            tool.setVaule(this.serverSearch);
            this.serverSearch.queText = data.planInfo.where;
            // this.pageShow.userDraw=false; 
            this.pageShow.showSQLPage = true;
            //@ts-ignore
            var div = this.$refs.noneLayer.children;
            div[0].style.display = ''
            div[1].innerText = '加载中'
            this.serverSearch.analysisAtt = [] //存储图层字段信息
            SuperMapService.getLayerFields({
                url: this.appconfig.gisResource.business_map.config[0].url,
                layer: data.layerNameEn
            }).then(result => {
                const fieldNames = result.result.recordsets[0].fields;
                const fieldcaptions = result.result.recordsets[0].fieldCaptions;
                if (!fieldNames || !fieldcaptions) return this.$message.error('图层信息获取失败')
                const fields = [];
                for (let i = 0, ii = fieldNames.length; i < ii; i++) {
                    const field = fieldNames[i] as string;
                    if (field.toLowerCase().indexOf('sm') >= 0) {
                        continue;
                    }
                    const title = fieldcaptions[i];
                    fields.push({ value: field, label: title })
                }
                this.serverSearch.analysisAtt = fields
                div[0].style.display = 'none'
                if (this.serverSearch.analysisAtt.length == 0) {
                    div[1].innerText = '图层无字段'
                } else {
                    div[1].innerText = ''
                }
            }).catch(err => {
                this.$message.error('获取图层字段失败');
                console.log(err);
            })
        } else {
            this.pageShow.showSQLPage = false
        }
    }

    /*
     *获取当前选项卡的内容
     */
    getCurrentPlanTypeInfo() {
        //选项卡减少过会，如果当前值大于实际值将其设置为实际值
        if ((parseInt(this.planModel.input.currentPlanTypeName.toString()) + 1) > this.planModel.input.planTypeInfo.length) {
            if (this.planModel.input.planTypeInfo.length == 0) {
                this.planModel.input.currentPlanTypeName = 0 + "";
            } else {
                this.planModel.input.currentPlanTypeName = (this.planModel.input.planTypeInfo.length - 1) + "";
            }
        }
        if (parseInt(this.planModel.input.currentPlanTypeName) >= 0) {
            return this.planModel.input.planTypeInfo[this.planModel.input.currentPlanTypeName];
        } else {
            return null;
        }
    }

    /*
     *向条件查询输入框中输入内容
     */
    addText(text, length, isField) {
        //@ts-ignore
        var myField = this.$refs.textBox.$el.children[0]
        var startL = myField.selectionStart || 0
        this.serverSearch.queText = this.serverSearch.queText.substring(0, startL) + text + this.serverSearch.queText.substring(myField.selectionEnd, myField.value.length)
        myField.blur()
        setTimeout(() => {
            myField.selectionStart = myField.selectionEnd = startL + length
            myField.focus()
        })
        if (isField) this.getAtt(text.replace(/(\s*$)/g, ""))
    }

    /**
     * 获取字段信息
    */
    getAtt(field) {
        //@ts-ignore
        var div = this.$refs.noneFixed.children;
        let currentData = this.getCurrentPlanTypeInfo();
        div[0].style.display = ''
        div[1].innerText = '加载中'
        this.serverSearch.layerFix = []
        SuperMapService.getFieldUniqueValue({
            url: this.appconfig.gisResource.business_map.config[0].url,
            layer: currentData.layerNameEn,
            uniqueField: field
        }).then(result => {
            const features = result.result.recordsets[0].features.features;
            const recordSet = result.result.recordsets[0];
            const data = features.map(item => {
                // switch (recordSet.fieldTypes[0]) {
                //     case "INT32":
                //     case "DOUBLE":
                //         return { uniqueVal: item.attributes[field] };
                //         break;
                //     default:
                //         return { uniqueVal: '\'' + item.attributes[field] + '\'' };
                //         break;
                // }
                return item.properties[field];
            });
            this.serverSearch.layerFix = data;
            if (this.serverSearch.layerFix.length > 0) {
                div[1].innerText = ''
            } else {
                div[1].innerText = '字段无属性'
            }
            div[0].style.display = 'none'
        }).catch(err => {
            this.$message.error('获取唯一值失败');
            console.log(err);
        })
    }

    /**
     * 清除图层
    */
    clearLayer(layer: VectorLayer<VectorSource<any>>) {
        if (layer) {
            layer.getSource().clear();
        }
    }

    /**
     * 隐藏或者显示计划内容
    */
    hideDataContent() {
        if (this.hideDataContentA) {
            this.hideDataContentA = false;
        } else {
            this.hideDataContentA = true;
        }
    }

    /**
     * 查询地图服务(option：查询条件，id:图层id,call回调函数)
    */
    queryServce(option, id, call) {
        $.ajax({
            url: this.appconfig.gisResource.business_map.config[0].url + "/" + id + "/query?f=pjson",
            type: 'POST',
            data: option,
            success: (data) => {
                data = JSON.parse(data);
                call(data);
            },
            error: (error) => this.$message.error(error)
        })
    }

    /**
     * 将可以进行空间查询的数据进行清空
     * */
    clearSearchLayer() {
        this.planModel.input.planTypeInfo.forEach(item => {
            if (item.planInfo.isServer) {
                //清空的时候需要保留where查询的语句
                this.resetSingePlanInfoSaveWhere(item);
            }
        })
    }

    /**
     *清除范围绘制
    */
    clearDraw() {
        this.clearSearchLayer();
        if (this.drawInfo.drawEvent) {
            this.drawInfo.drawEvent.reset();
        }
        this.clearLayer(this.comLayerList.drawLayer);

    }

    /**
     * 绘制范围进行空间查询
    */
    drawAndQuery() {
        this.clearSearchLayer();
        const mapV = this.data.mapView;
        const map = this.mapV;
        if (this.draw) {
            this.mapV.removeInteraction(this.draw);
            this.draw = null;
        }
        if (this.comLayerList.drawLayer) {
            this.comLayerList.drawLayer.getSource().clear();
        }
        //this.isDrawEnd = false
        this.draw = new Draw({
            type: "Polygon",
            source: this.comLayerList.drawLayer.getSource()
        })
        //地图默认的双击事件
        const dblclickevt = map.getInteractions().getArray().find(interaction => {
            return interaction instanceof DoubleClickZoom;
        })
        this.draw.on('drawstart', (e) => {
            //删除默认的双击事件，防止双击完成绘制时放大地图
            map.removeInteraction(dblclickevt);
        })
        this.draw.on('drawend', (e) => {
            const geometry = (e.feature as Feature<Polygon>).getGeometry();

            //记录组成线的点信息
            let geometrys = geometry.getCoordinates();
            const geo = SuperMapService.convertPolygon(geometrys);
            this.drawEndHandle(geo)
            //this.editInfo.geometry = JSON.stringify(geometrys);
            map.removeInteraction(this.draw);
            //延时开启地图双击放大事件
            setTimeout(() => {
                map.addInteraction(dblclickevt);
            }, 100)
            this.draw = null;
        })
        map.addInteraction(this.draw);
        // loadModules(["esri/views/draw/Draw", "esri/geometry/Polygon"], { url: esriConfig.baseUrl }).then(([Draw, Polygon]) => {
        //     mapView.when(() => {
        //         if (this.drawInfo.drawEvent) {
        //             this.drawInfo.drawEvent.reset();
        //         }
        //         this.drawInfo.drawEvent = new Draw({
        //             view: mapView
        //         })
        //         let action = this.drawInfo.drawEvent.create("polygon")
        //         action.on("vertex-add", function (evt) {
        //             addPolygon(evt);
        //         });
        //         action.on("cursor-update", function (evt) {
        //             addPolygon(evt);
        //         });
        //         action.on("vertex-remove", function (evt) {
        //             addPolygon(evt);
        //         });
        //         action.on("draw-complete", function (evt) {
        //             //@ts-ignore
        //             that.$refs.mapBox.style.cursor = 'default'
        //             addPolygon(evt, true);
        //         });
        //         function addPolygon(evt, action?) {
        //             that.clearLayer(that.comLayerList.drawLayer);
        //             var symbol = {
        //                 type: "simple-fill",
        //                 color: that.drawInfo.drawColor,
        //                 style: "solid",
        //                 outline: {
        //                     color: that.drawInfo.drawColor,
        //                     width: 1
        //                 }
        //             };
        //             let polygon = new Polygon({
        //                 rings: [evt.vertices],
        //                 spatialReference: that.mapV.spatialReference,
        //                 type: "polygon"
        //             })
        //             let graphic = new that.data.mapView.TF_graphic({
        //                 geometry: polygon,
        //                 symbol: symbol
        //             });
        //             if (action) {
        //                 that.drawEndHandle(graphic);
        //             }
        //             that.comLayerList.drawLayer.add(graphic);
        //         }
        //     })
        // })
    }

    /**
     *绘制完成,对可以进行空间查询的数据进行graphic赋值
    */
    drawEndHandle(geometry: any) {
        this.planModel.input.planTypeInfo.forEach(item => {
            if (item.planInfo.isServer) {
                item.planInfo.drawGraphic = geometry;
                this.getGeoData2(item);
            }
        })
    }
    /**
         * 根据条件查询管网数据数据
         * currentData 当前查询的管网数据（不传入的值，则会使用当前的显示的面板）
        */
    getGeoData2(searChPlan) {
        let currentData = null;
        if (!searChPlan.planInfo) {
            currentData = this.getCurrentPlanTypeInfo();
            currentData.planInfo.where = this.serverSearch.queText
        } else {
            currentData = searChPlan;
        }
        let currentPlane = this.getCurrentPlanTypeInfo();
        if (currentPlane == currentData) {
            currentData.planInfo.where = this.serverSearch.queText;
        }
        let data = {
            where: currentData.planInfo.where,
            returnGeometry: false,
            returnIdsOnly: true,
            f: "pjson",
            geometry: null,
            geometryType: ""
        };
        this.clearLayer(currentData.planInfo.layer);
        this.clearLayer(this.comLayerList.highLayer);
        currentData.planInfo.tableData = [];
        currentData.planInfo.pageInfo.currentData = [];
        currentData.planInfo.pageInfo.currentIndex = 1;
        //求取片区与绘制区域的交集
        // if (currentData.planInfo.drawGraphic && currentData.planInfo.drawGraphic.geometry) {
        //     let dataGeo = null;
        //     if (that.planModel.regionInfo.currentRegionGeo) {
        //         dataGeo = that.arcgis.geometryEngine.intersect(currentData.planInfo.drawGraphic.geometry, that.planModel.regionInfo.currentRegionGeo);
        //     } else {
        //         dataGeo = currentData.planInfo.drawGraphic.geometry;
        //     }
        //     if (dataGeo) {
        //         //that.selectGeo=dataGeo.toJSON();
        //     } else {
        //         this.$message({ type: "info", message: "未查询到数据" });
        //         return;
        //     }
        //     //data.geometry=JSON.stringify(that.selectGeo);
        //     data.geometryType = "esriGeometryPolygon";
        // } else {
        //     if (that.planModel.regionInfo.currentRegionGeo) {
        //         data.geometry = JSON.stringify(that.planModel.regionInfo.currentRegionGeo);
        //         data.geometryType = "esriGeometryPolygon";
        //     }
        // }
        //查询
        SuperMapService.queryByMapService({
            url: this.appconfig.gisResource.business_map.config[0].url,
            geometry: currentData.planInfo.drawGraphic,
            datasetNames: [currentData.layerNameEn],
            whereclause: currentData.planInfo.where
        }).then((result: any) => {
            console.log(result);
            const features = result.result.recordsets[0].features.features;
            if (searChPlan) {
                this.groupGetInfo(features, currentData);
            } else {
                this.groupGetInfo(features);
            }
        }).catch(err => {
            this.$message.error('查询数据失败');
            console.log(err)
        })

    }
    /**
     * 根据条件查询管网数据数据
     * currentData 当前查询的管网数据（不传入的值，则会使用当前的显示的面板）
    */
    getGeoData(searChPlan) {
        let that = this;
        let currentData = null;
        if (!searChPlan.planInfo) {
            currentData = this.getCurrentPlanTypeInfo();
            currentData.planInfo.where = that.serverSearch.queText
        } else {
            currentData = searChPlan;
        }
        let currentPlane = this.getCurrentPlanTypeInfo();
        if (currentPlane == currentData) {
            currentData.planInfo.where = that.serverSearch.queText;
        }
        let data = {
            where: currentData.planInfo.where,
            returnGeometry: false,
            returnIdsOnly: true,
            f: "pjson",
            geometry: null,
            geometryType: ""
        };
        this.clearLayer(currentData.planInfo.layer);
        this.clearLayer(this.comLayerList.highLayer);
        currentData.planInfo.tableData = [];
        currentData.planInfo.pageInfo.currentData = [];
        currentData.planInfo.pageInfo.currentIndex = 1;
        //求取片区与绘制区域的交集
        // if (currentData.planInfo.drawGraphic && currentData.planInfo.drawGraphic.geometry) {
        //     let dataGeo = null;
        //     if (that.planModel.regionInfo.currentRegionGeo) {
        //         dataGeo = that.arcgis.geometryEngine.intersect(currentData.planInfo.drawGraphic.geometry, that.planModel.regionInfo.currentRegionGeo);
        //     } else {
        //         dataGeo = currentData.planInfo.drawGraphic.geometry;
        //     }
        //     if (dataGeo) {
        //         //that.selectGeo=dataGeo.toJSON();
        //     } else {
        //         this.$message({ type: "info", message: "未查询到数据" });
        //         return;
        //     }
        //     //data.geometry=JSON.stringify(that.selectGeo);
        //     data.geometryType = "esriGeometryPolygon";
        // } else {
        //     if (that.planModel.regionInfo.currentRegionGeo) {
        //         data.geometry = JSON.stringify(that.planModel.regionInfo.currentRegionGeo);
        //         data.geometryType = "esriGeometryPolygon";
        //     }
        // }
        //根据求取的交集查询交集区域内的设备或者管线的objectId
        that.queryServce(data, currentData.layerId, function (result) {
            if (searChPlan) {
                that.groupGetInfo(currentData.layerId, currentData);
            } else {
                that.groupGetInfo(currentData.layerId);
            }

        }.bind(that));
    }

    /**
     * 分组求取管网信息
    */
    groupGetInfo(resultFeatures, updata?) {
        let currentData = null;
        if (updata) {
            currentData = updata;
        } else {
            currentData = this.getCurrentPlanTypeInfo()
        }
        let overlengthPipe = currentData.planInfo.overlengthPipe;
        let getQueryResult = currentData.planInfo.getQueryResult
        tool.setVaule(overlengthPipe, []);
        tool.setVaule(getQueryResult, []);
        getQueryResult.resultInfo = resultFeatures;
        this.conductServerResult(currentData);
        //getQueryResult.allObjectIds = [].concat(ids);
        //将获取的objecids每1000进行数据重组
        // if (ids && ids.length > 0) {
        //     if (ids.length <= that.splitMonth) {
        //         getQueryResult.groupObjectIds.push([getQueryResult.allObjectIds]);
        //     } else {
        //         let index = Math.floor(ids.length / that.splitMonth);
        //         let index2 = ids.length % that.splitMonth;
        //         for (let i = 0; i < index; i++) {
        //             let startIndex = that.splitMonth * i;
        //             let endIndex = that.splitMonth * (i + 1);
        //             getQueryResult.groupObjectIds.push(getQueryResult.allObjectIds.slice(startIndex, endIndex));
        //             if (i == index - 1 && index2 != 0) {
        //                 getQueryResult.groupObjectIds.push(getQueryResult.allObjectIds.slice(endIndex, ids.length));
        //             }
        //         }
        //     }
        // } else {
        //     this.$message({ type: "info", message: "未查询到数据" });
        //     return;
        // }

        // let copyValue = null;
        // copyValue = tool.copyValue(getQueryResult);
        // /**
        //  * 根据重组的数据进行数据请求获取矢量信息
        // */
        // getQueryResult.groupObjectIds.forEach(item => {
        //     let data = {
        //         objectIds: item.join(','),
        //         returnGeometry: true,
        //         returnIdsOnly: false,
        //         outFields: '*',
        //         f: "pjson"
        //     }
        //     that.queryServce(data, layerid, function (result) {
        //         if (getQueryResult.allObjectIds.length == 0 && result.features.length != 0) {
        //             for (item in getQueryResult) {
        //                 getQueryResult[item] = copyValue[item];
        //             }
        //         }
        //         getQueryResult.resultInfo.push.apply(getQueryResult.resultInfo, result.features);
        //         //判断是否已异步请求完毕所有数据
        //         //if(getQueryResult.resultInfo.length==getQueryResult.allObjectIds.length||getQueryResult.resultInfo.length==ids.length){
        //         if (getQueryResult.resultInfo.length == getQueryResult.allObjectIds.length) {
        //             that.conductServerResult(currentData);
        //         };
        //     }.bind(this))
        // })
    }

    /***
     * 使用sid查询管网信息
    */
    groupGetInfoBySid(data) {
        let that = this;
        let index = this.planModel.updatePlan.findIndex(item => { return item.typeId == data.typeId });
        let searchData = this.planModel.updatePlan[index];
        searchData.data = searchData.data.map(item => { return "'" + item.toUpperCase() + "'" });
        let ids = searchData.data;
        let queryArr = [];
        if (ids && ids.length > 0) {
            if (ids.length <= that.splitMonth) {
                queryArr.push(ids);
            } else {
                let index = Math.floor(ids.length / that.splitMonth);
                let index2 = ids.length % that.splitMonth;
                for (let i = 0; i < index; i++) {
                    let startIndex = that.splitMonth * i;
                    let endIndex = that.splitMonth * (i + 1);
                    queryArr.push(ids.slice(startIndex, endIndex));
                    if (i == index - 1 && index2 != 0) {
                        queryArr.push(ids.slice(endIndex, ids.length));
                    }
                }
            }
        }
        let currentIndex = 0;
        let objectids = [];
        //临时判断为点还是线
        queryArr.forEach(item => {
            const where = data.layerName.indexOf('管道') >= 0 ? 'lno in (' + item.join(',') + ')' : 'exp_no in (' + item.join(',') + ')';
            let senddata = {
                where: where,
                returnGeometry: false,
                returnIdsOnly: true,
                f: "pjson"
            };
            //查询
            SuperMapService.queryByMapService({
                url: this.appconfig.gisResource.business_map.config[0].url,
                datasetNames: [data.layerNameEn],
                whereclause: where
            }).then((result: any) => {
                console.log(result);
                const features = result.result.recordsets[0].features.features;
                this.groupGetInfo(features, data);
            }).catch(err => {
                this.$message.error('查询数据失败');
                console.log(err)
            })
            // //根据求取的交集查询交集区域内的设备或者管线的objectId
            // this.queryServce(senddata, data.layerId, function (result) {
            //     objectids = objectids.concat(result.objectIds);
            //     currentIndex++;
            //     if (currentIndex == queryArr.length) {
            //         this.groupGetInfo(objectids, data.layerId, data);
            //     }
            // }.bind(this));
        })
    }

    /***
     * 处理查询出的结果(查询结果在this.getQueryResult中，主要的结果在getQueryResult.resultInfo中)
    */
    conductServerResult(currentData) {
        let getQueryResult = currentData.planInfo.getQueryResult;
        let geo = [];
        let geometry = null;
        let symbol = null;
        let dataList = [];

        currentData.planInfo.tableData = dataList;
        currentData.planInfo.pageInfo.currentData = dataList.slice(0, 10);
        currentData.planInfo.total = dataList.length;

        if (getQueryResult.resultInfo.length > 0) {
            let ids = [];
            if (getQueryResult.resultInfo[0].geometry.type === "LineString") {
                symbol = {
                    color: this.comColorList.planColor,
                    width: "2px",
                    type: "simple-line",
                };
                getQueryResult.resultInfo.forEach((item, index) => {

                    const coordinates = item.geometry.coordinates.map(coordinate => {
                        return [coordinate[0], coordinate[1]];
                    })
                    geo.push(coordinates);
                    let listitem = JSON.parse(JSON.stringify(item.properties).toLowerCase());
                    listitem.geometry = coordinates;
                    //listitem.geometry.paths = item.geometry.paths;
                    listitem.pipelength = parseFloat(listitem.pipelength).toFixed(2);
                    listitem.sid = listitem["lno"];
                    dataList.push(listitem);
                    ids.push(listitem["lno"]);
                });
                geometry = {
                    type: "LineString",
                    paths: geo,
                    spatialReference: this.data.mapView.spatialReference
                };
                currentData.planInfo.pointLineResult = geometry;
            } else {
                symbol = {
                    type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                    color: this.comColorList.planColor,
                    outline: {  // autocasts as new SimpleLineSymbol()
                        color: this.comColorList.planColor,
                        width: "0.5px"
                    }
                };
                getQueryResult.resultInfo.forEach(item => {
                    geo.push([item.geometry.x, item.geometry.y]);
                    let listitem = JSON.parse(JSON.stringify(item.properties).toLowerCase());
                    listitem.lng = item.geometry.coordinates[0];
                    listitem.lat = item.geometry.coordinates[1];
                    listitem.sid = listitem["exp_no"];
                    geo.push([listitem.lng, listitem.lat]);
                    dataList.push(listitem);
                    ids.push(listitem["exp_no"]);
                });
                geometry = {
                    type: "MultiPoint",
                    points: geo,
                    spatialReference: this.data.mapView.spatialReference
                }
                currentData.planInfo.pointLineResult = geometry;
            }
            dataList.forEach(item => {
                if (item.sid) {
                    currentData.planInfo.getQueryResult.allSidIds.push(item.sid)
                } else {
                    currentData.planInfo.sidExist.exist = false;
                    currentData.planInfo.sidExist.layerName = currentData.layerName;
                }
            })
            currentData.planInfo.tableData = dataList;
            currentData.planInfo.pageInfo.currentData = dataList.slice(0, 10);
            currentData.planInfo.total = dataList.length;
            // let graphic = new this.data.mapView.TF_graphic({
            //     geometry: geometry,
            //     symbol: symbol
            // });
            currentData.planInfo.inspectContents = JSON.stringify({
                geometryInfo: geometry,
                type: currentData.layerId,
                ids: ids.join(','),
                where: currentData.where
            });
            //currentData.planInfo.layer.add(graphic);
        }
    }

    //查询当前绘制的管线属于那几个片区
    currentDarwRe(currentData) {
        let regionsList = null;
        if (this.planModel.regionInfo.currentRegion) {
            regionsList = this.planModel.regionInfo.currentRegion;
        } else {
            regionsList = this.planModel.regionInfo.allRegions;
        }
        regionsList.forEach(item => {
            let result = this.arcgis.geometryEngine.intersect(currentData.planInfo.pointLineResult, item.geometry2);
            if (result) {
                currentData.planInfo.containReg.push(item.id);
                currentData.planInfo.containRegNames.push(item.name);
            }
        })
    }
    /**
     * 处理选择的管线
    */
    conductPipe(currentData) {
        let getQueryResult = currentData.planInfo.getQueryResult;
        let overlengthPipe = currentData.planInfo.overlengthPipe;
        let data = currentData.planInfo.sendInfo;
        if (!getQueryResult.resultInfo || getQueryResult.resultInfo.length == 0) {
            this.$message({ type: "info", message: "请绘制或者查询管线，获取管线信息" });
        }
        getQueryResult.resultInfo.forEach((item, index) => {
            let listitem = JSON.parse(JSON.stringify(item.properties).toLowerCase());
            const coordinates = item.geometry.coordinates.map(coordinate => {
                return [coordinate[0], coordinate[1]];
            })
            data.totalLength += parseFloat(listitem.pipelength);
            if (listitem.pipelength > this.breakLength) {
                overlengthPipe.paths.push(item.geometry.paths[0]);
                overlengthPipe.lengths.push(listitem.pipelength);
            } else {
                data.pointTempList.push({
                    "inspectTypeId": currentData.typeId,
                    "layerName": currentData.layerName,
                    "lat": item.geometry.coordinates[0][1],
                    "lng": item.geometry.coordinates[0][0],
                    "length": listitem.pipelength,
                    "geometry": JSON.stringify({
                        paths: coordinates,
                        spatialReference: null,
                        type: "polyline"
                    }),
                })
            }
        });
        //this.currentDarwRe(currentData);
        this.breakLine(currentData);
    }
    //处理选择的管点:
    conductPoint(currentData) {
        let getQueryResult = currentData.planInfo.getQueryResult;
        let data = currentData.planInfo.sendInfo;
        getQueryResult.resultInfo.forEach(item => {
            data.pointTempList.push({
                "inspectTypeId": currentData.typeId,
                "layerName": currentData.layerName,
                "lat": item.geometry.coordinates[1],
                "lng": item.geometry.coordinates[0],
                "length": 0,
                "geometry": JSON.stringify({
                    type: "point",
                    latitude: item.geometry.coordinates[1],
                    longitude: item.geometry.coordinates[0],
                    spatialReference: null
                }),
            })
        });
        data.totalCount = data.pointTempList.length;
        data.totalLength = 0;
        //this.currentDarwRe(currentData);
        currentData.planInfo.isComplete = true;//表示该类型在提交前完成计算
    }
    //点击清空按钮执行事件
    clearQueryCondition() {
        this.serverSearch.queText = ''
    }
    //单击查询结果表格数据项触发事件
    rowSelectPlan(row) {
        if (row.geometry) {
            let geo = null;
            if (typeof (row.geometry) === "string") {
                geo = JSON.parse(row.geometry);
            } else {
                geo = row.geometry;
            }
            let lines = geo;
            this.hLineToMap(lines);
            return;
        }
        if (row.lat && row.lng) {
            this.highPointToMap([row.lng, row.lat]);
        }
    }

    //选中查询结果表格数据项时执行
    selectPlan(selection, row) {
        let currentData = this.getCurrentPlanTypeInfo();
        currentData.planInfo.selectData = selection;
    }

    /**
     * 控制片区的显示与隐藏
     * */
    regionShow() {
        this.comLayerList.regionLayer.visible = this.pageShow.showPlace;//控制片区的显示与隐藏
    }

    /**
     * 分页显示
     * */
    handleCurrentChange(val) {
        let data = this.getCurrentPlanTypeInfo();
        let tabalData = data.planInfo.tableData;
        data.planInfo.pageInfo.currentData = tabalData.slice((val - 1) * 10, val * 10);
        data.planInfo.pageInfo.currentIndex = val;
    }
}

