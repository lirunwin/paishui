<template>
  <div style="width: 100%; height: 100%; padding:8px;">
    <el-row>
      <span class="title2" style="margin-left:8px;">巡查日期</span>
      <el-date-picker v-model="searchModel.input.timeForMission" type="datetimerange" size="small" style="width:300px" range-separator="至" start-placeholder="起始时间" end-placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss" align="right" clearable />
      <span class="title2">部门分组</span>
      <el-select v-model="searchModel.input.chooseGroup" :disabled="hasGroup" style="display: inline-block; margin-left: 5px; width:150px;" size="small" placeholder="请选择巡检人" clearable @change="changeGroup('search')">
        <el-option v-for="item of searchModel.optionData.chooseGroup" :index='item.index' :key="item.id" :value="item.id" :label="item.name"></el-option>
      </el-select>
      <span class="title2">人员</span>
      <el-select v-model="searchModel.input.chooseWorker" style="display: inline-block; margin-left: 5px; width:150px;" size="small" placeholder="请选择巡检人" clearable>
        <el-option v-for="item in searchModel.optionData.chooseWorker" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <span class="title2">巡检类型</span>
      <el-select v-model="searchModel.input.planType" style="display: inline-block; margin-left: 5px; width:150px;" size="small" placeholder="请选择计划类型" clearable>
        <el-option v-for="item of searchModel.optionData.planType" :key="item.id" :value="item.id" :label="item.name"></el-option>
      </el-select>
      <el-button size="small" type="primary" @click="getData">查询</el-button>
      <el-button size="small" type="primary" :disabled="buttonControl.canAbandon" @click="canclePage">作废</el-button>
    </el-row>
    <el-table class="mapTable" :data="searchModel.getData.allRow" border style="width: 100%;margin-top: 8px;" ref="table1" height="calc(100% - 88px)" stripe highlight-current-row @select="searchTableSelect" @select-all="searchTableSelect">
      <template slot="empty">
        <img src="@/assets/icon/null.png" alt="">
        <p class="empty-p">暂无数据</p>
      </template>
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" width="50" label="序号" />
      <el-table-column prop="inspectType" sortable label="巡检类型" show-overflow-tooltip />
      <el-table-column prop="createTime" sortable width="200px" label="派发时间" show-overflow-tooltip />
      <el-table-column prop="createUserName" sortable label="创建人" />
      <el-table-column prop="inspectUserList" sortable label="巡查人" show-overflow-tooltip></el-table-column>
      <el-table-column prop="planBegindate" sortable width="200px" label="起始时间" show-overflow-tooltip />
      <el-table-column prop="planEnddate" sortable width="200px" label="结束时间" show-overflow-tooltip />
      <el-table-column prop="planState" sortable label="执行状态" show-overflow-tooltip></el-table-column>
      <el-table-column prop="isDispatching" sortable label="是否派工" show-overflow-tooltip></el-table-column>
      <el-table-column prop="isPlanStop" sortable label="是否暂停" show-overflow-tooltip></el-table-column>
      <el-table-column prop="isPlanInvalid" sortable label="是否作废" show-overflow-tooltip></el-table-column>
      <el-table-column prop="planPercent" sortable label="完成率" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="planInfo(scope.row)">任务详细</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="auditInfo(scope.row)">审核历史</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 8px;width:350px;">
      <el-col :span="20">
        <el-pagination small background layout="total, sizes, prev, pager, next" :current-page="searchModel.pageInfo.current" :page-size="searchModel.pageInfo.size" :page-sizes="searchModel.pageInfo.pageSizes" @size-change="changeSize" @current-change="changeCurrent" @prev-click="changeCurrent" @next-click="changeCurrent" :total="searchModel.getData.tableTotal" />
      </el-col>
    </el-row>
    <el-dialog v-dialogDrag title="任务详细" :visible.sync="pageShow.diaVisiable" width="1200px" top="calc(50vh - 436px)" @close="closeEvent" append-to-body>
      <div style="width:100%;padding-right:8px;">
        <tf-table-legend label="巡检信息" isopen="true" style="margin-top: 8px;">
          <div style="width:100%; display: flex; flex-wrap: wrap;">
            <div class="flexDiv" ref="xjType"><span class="flexTitle">巡查类型：</span>
              <div class="flexInfo"></div>
            </div>
            <div class="flexDiv" ref="xjGroup">
              <span class="flexTitle">巡查组：</span>
              <div class="flexInfo"></div>
            </div>
            <div class="flexDiv" ref="xjWorker">
              <span class="flexTitle">巡查人：</span>
              <div class="flexInfo"></div>
            </div>
            <div class="flexDiv" ref="xjBeginAndEndTime">
              <span class="flexTitle">起止时间：</span>
              <div class="flexInfo"></div>
            </div>
            <div class="flexDiv" ref="xjPlanNumber">
              <span class="flexTitle">计划完成率：</span>
              <div class="flexInfo"></div>
            </div>
          </div>
        </tf-table-legend>
        <tf-table-legend label="内容选取" isopen="true" style="margin-top: 8px;">
          <div style="height: 505px;margin-top: 8px;">
            <div ref="pickContent" style="width:100%; height: 90%;float:left;">
              <div style="width:100%; height: calc(100% - 200px);" ref="mapBox1"></div>
              <el-tabs type="border-card" v-model="planModel.input.currentPlanTypeName" style="width:100%; height: 280px;">
                <template v-for="(item,index) in planModel.input.planTypeInfo">
                  <el-tab-pane :key="index+''" :name="index+''" :label="item.layerName">
                    <div style="width:100%; height: 200px;">
                      <el-table v-show="item.planInfo.isCheckData" :data="item.planInfo.tableData" :ref="'datatable'+index" style="width: 100%;margin-top: 8px;" height="calc(100% - 40px)" stripe highlight-current-row @row-click="rowSelectPlan">
                        <template slot="empty">
                          <img src="@/assets/icon/null.png" alt="">
                          <p class="empty-p">暂无数据</p>
                        </template>
                        <el-table-column type="index" width="50" label="序号" />
                        <el-table-column v-for="(value, index2) in item.planInfo.header" :key="index2" :label="value.label" align="center" :prop="value.value" show-overflow-tooltip />
                      </el-table>
                      <el-table v-show="!item.planInfo.isCheckData" :data="item.planInfo.pageInfo.currentData" style="width: 100%;margin-top: 8px;" height="calc(100% - 40px)" stripe highlight-current-row @row-click="rowSelectPlan">
                        <template slot="empty">
                          <img src="@/assets/icon/null.png" alt="">
                          <p class="empty-p">暂无数据</p>
                        </template>
                        <el-table-column v-for="(value, index2) in item.planInfo.header" :key="index2" :label="value.label" align="center" :prop="value.value" show-overflow-tooltip />
                      </el-table>
                      <el-row style="margin-top: 8px;width:100%;">
                        <el-row style="margin-top: 8px;width:100%;">
                          <el-col :span="20">
                            <template v-if="item.planInfo.isCheckData">
                              <el-pagination v-show="item.planInfo.tableData&&item.planInfo.tableData.length>0" small background layout="total" :total="item.planInfo.total" />
                            </template>
                            <template v-else>
                              <el-pagination v-show="item.planInfo.tableData&&item.planInfo.tableData.length>0" small background @current-change="handleCurrentChange" :page-size="10" layout="total, prev, pager, next" :total="item.planInfo.total">
                              </el-pagination>
                            </template>
                          </el-col>
                        </el-row>
                      </el-row>
                    </div>
                  </el-tab-pane>
                </template>
              </el-tabs>
            </div>
          </div>
        </tf-table-legend>
      </div>
    </el-dialog>
    <div style="width:100%;height:100%;display:none;" ref="cctvMap"></div>
    <el-dialog v-dialogDrag title="废除审核" :visible.sync="diaVisiableCancle" width="520px" top="calc(50vh - 300px)" @close="cancelSubmit" append-to-body>
      <div style="width:100%;padding-right:8px;">
        <div style="width:100%; display: flex; flex-wrap: wrap;">
          <div class="flexOne">
            <span class="flexTitle">申请人：</span>
            <div class="flexInfo">
              <el-input type='text' v-model="cancleInfo.submitUserName" disabled size="small"></el-input>
            </div>
          </div>
          <div class="flexOne">
            <span class="flexTitle">申请说明：</span>
            <div class="flexInfo">
              <el-input type="textarea" :rows="2" disabled size="small" v-model="cancleInfo.applyNotes"></el-input>
            </div>
          </div>
          <div class="flexOne">
            <span class="flexTitle">提交时间：</span>
            <div class="flexInfo">
              <el-input type='text' v-model="cancleInfo.createTime" disabled size="small"></el-input>
            </div>
          </div>
          <div class="flexOne">
            <span class="flexTitle">审核意见：</span>
            <div class="flexInfo">
              <el-select v-model="cancleInfo.auditResult" style="width:100%;" size="small" placeholder="请选择巡检审核意见">
                <el-option key="1" value="1" label="同意"></el-option>
                <el-option key="2" value="2" label="不同意"></el-option>
              </el-select>
            </div>
          </div>
          <div class="flexOne">
            <span class="flexTitle">审核说明：</span>
            <div class="flexInfo">
              <el-input type="textarea" :rows="2" size="small" v-model="cancleInfo.auditNotes"></el-input>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmit" size="small">取消</el-button>
        <el-button type="primary" size="small" @click="abandonCheckInfoSubmit()">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog v-dialogDrag title="审核详情" :visible.sync="auditInfoPage" width="800px" top="calc(50vh - 300px)" @close="cancelSubmit" append-to-body>
      <div style="width:100%;padding-right:8px;">
        <div style="width:100%; display: flex; flex-wrap: wrap;">
          <template v-for="item in auditInfoHisList">
            <div class='itemList' :key='item.id' :value="item.createTime" style=' width:100%; border: 1px solid #EBEEF5; padding: 5px;'>
              <div class='baseInfo' style='width:100%;'>
                <div>
                  <span style="padding-right:40px">申请时间：{{item.createTime}}</span>
                  <span>申请人：{{item.submitUserName}}</span>
                </div>
                <div style="padding-top:20px">
                  <span>申请说明：{{item.applyNotes}}</span>
                </div>
              </div>
              <div class='auditInfoPart' style='width:100%;'>
                <div v-if="item.auditResult=='未审批'" style="padding-top:20px">
                  <span>暂无审批信息</span>
                </div>
                <div v-else>
                  <div style="padding-top:20px">
                    <span style="padding-right:40px">审核时间：{{item.auditTime}}</span>
                    <span style="padding-right:40px">审核人：{{item.auditUserName}}</span>
                    <span>审核意见：{{item.auditResult}}</span>
                  </div>
                  <div style="padding-top:20px">
                    <span>审核说明：{{item.auditNotes}}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {Vue,Component,Prop,Watch} from 'vue-property-decorator'
import tfLegend from "@/views/zhpt/common/Legend.vue";
import tfTableLegend from '@/views/zhpt/common/TableLegend.vue';
import initConfig  from '@/views/zhpt/xjManagement/xjPlanManagement/config.json';
import tool  from '@/views/zhpt/xjManagement/xjPlanManagement/tool';
import { esriConfig, appconfig } from 'staticPub/config';
import { loadModules } from 'esri-loader';
import { queryTaskArrange, addTaskArrange, editTaskArrange, deleteTaskArrange, submitPauseCheckInfo,
        submitAbandonCheckInfo, xjRoundDispose, queryDetail, getGroupPersonById,queryRegionRelation,stopList,cancleList } from '@/api/xjDailyManageApi'
import { disposeXjType,checkData } from '@/api/xjApi'
import { queryBuildList  } from '@/api/xjWorkSiteCheckApi'
import { queryXjPoint,queryXjLine } from '@/api/xjDailyManageApi'
import { queryDangerReport } from '@/api/xjHiddenDangerManageApi'
import { getGroupUserMap} from '@/api/base'
import { graphic } from 'echarts/lib/export';
import $ from 'jquery'
@Component({
    name: 'XjPlanCancle',
    components: { tfTableLegend, tfLegend }
})
export default class XjPlanCancle extends Vue {
    @Prop() data:any
    searchModel={//查询模块
                input:{//多选获取的输入是数组，但后端获取的是字符串，多个值使用逗号进行隔开，故这里将输入和实际发送请求的数据分开
                    timeForMission:"",//巡查日期
                    chooseGroup:"",//部门
                    chooseWorker:"",//人员
                    planType:"",//巡检类型
                    state:""//状态
                },
                pageInfo:{
                    size:30,//当前每页显示条数
                    current:1,//当前第几页
                    pageSizes:[10,20,30,50,100,1000]//可改变的页数
                },
                buttonShow:{
                    editButton:true//是否展示编辑按钮
                },
                sendInfo:{//查询请求发送的数据
                    timeForMission:"",//巡查日期
                    chooseGroup:"",//部门
                    chooseWorker:"",//人员
                    planType:"",//巡检类型
                    state:"9",//状态
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
            };
            buttonControl={//控制按钮的启用与禁用
                canAbandon:true,//控制废除按钮，初始化默认禁用状态
            };
            arcgis={//arcgis相关的对象
                GeometryService: null, //GeometryService服务类   
                LengthsParameters: null, //GeometryService计算长度的参数
                geometryEngine:null,//geometryEngine图形操作工具类
                Polygon:null,//多边形类
            }
            regionLayerId=15;//获取片区图层的ID条件
            comLayerList={//本模块通用的图层
                regionLayer:null,//当前巡检组下的片区图层
                highLayer:null,//高亮图层
            }
            comColorList={//图层颜色管理
                highColor:"#00FFFF",//高亮图层颜色
                planColor:"#1E90FF",//计划图层颜色
                regionLineColor:[64,224,208,0],//片区线的颜色
                regionInColor:[255,165,0,0.2],//片区内部颜色
            }
            pageShow={//控制页面的显示隐藏
                makePlan:false,//控制计划制定页面的显示和隐藏
                lookPlan:false,//控制查看计划页面的显示与隐藏
                buttonShow:false,//制定按钮的显示与隐藏
                showPlanRound:true,//控制巡检周期的显示
                diaVisiable:false//查看页面的展示与隐藏
            }
            planModel={//制定计划模块
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
                    dayPlanTime:[],//巡查时间
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
                regionInfo:{//片区信息
                    allRegions:[],//所有的片区
                    currentRegion:null,//当前的片区
                    singleRegin:null,//巡检组固定的时候保存其巡检组
                    currentRegionGeo:null,//绘制的图形
                },
                updatePlan:[]//数据更新时的数据
            }
            hasGroup=false;//登陆用户是否属于一个巡检组
            splitMonth=1000;//切割查询出的objectids（用于server查询）  
            cancleInfo={//作废信息
                applyNotes:"",
                submitUser:"",
                auditNotes:"",
                auditResult:"",
                createTime:"",
                id:""
            }
            auditInfoHisList=[];//审核信息
            auditInfoPage=false;//审核详情页面
            diaVisiableCancle=false
            mapV=null;
            timeForMission=null;
            addOrUpdateOrLook="";
    mounted() {
        //初始化部分配置
        this.initConfigInfo();
        //获取巡检类型下拉框
        this.initXjType();
        //获取巡检组
        this.getGroupUserMap();
        //获取首页表格数据
        this.getData();  
        //保存输入框的默认配置
        this.planModel.initInput=tool.copyValue(this.planModel.input);
        //添加本模块使用的地图
        this.addMap();
        //获取图层信息
        this.getLayerInfo();
    }
  
        //查询页面信息改变时（页面显示条数及当前第几页）
        @Watch("searchModel.pageInfo.current")
        pageInfocurrentChange(){
            this.getData();
        }
        @Watch("searchModel.pageInfo.size")
        pageInfosizeChange(){
            this.getData();
        }
        //监听选项卡的改变
        @Watch("planModel.input.currentPlanTypeName")
        currentPlanTypeNameChange(){
            this.paneHandleClick();
        }
    destroyed(){
        this.controlComLayer("destory");
        if(this.mapV&&this.mapV.map){
            this.mapV.map.removeAll();
        }
    }
        /**
         * 初始化部分配置
         * */
        initConfigInfo(){
            this.searchModel.optionData.state=initConfig.state;
        }

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
        }

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
                addUser.unshift({id:"",name:'全部'});
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
            })
        }
        
        /**
         * 获取首页表单数据
         */
        getData() {
            //将修改和删除按钮重置为不可操作
            tool.setVaule(this.buttonControl,true);
            if(!this.timeForMission){
                this.timeForMission="";
            }
            let data = {
                current: this.searchModel.pageInfo.current,
                size: this.searchModel.pageInfo.size,
                inspectGroupId:this.searchModel.input.chooseGroup,
                inspectUsers:this.searchModel.input.chooseWorker+"",
                inspectType:this.searchModel.input.planType,
                planState:'9',//9
                planBegindate:this.searchModel.input.timeForMission[0]?this.searchModel.input.timeForMission[0]:"",
                planEnddate:this.searchModel.input.timeForMission[1]?(this.searchModel.input.timeForMission[1].split(" ")[0]+" 23:59:59"):""
            }
            queryTaskArrange(data).then(res => {
                this.searchModel.getData.allRow = res.result.records
                this.searchModel.getData.tableTotal = res.result.total
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
            this.searchModel.getData.selectRow=e;
              //暂停按钮能操作的条件(只能选中一个且是申请作废)
            if(e.length ==1&&e[0].planState == '申请作废'){
                this.buttonControl.canAbandon = false //可作废
            }else{
                this.buttonControl.canAbandon = true //不可作废
            }
        }

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
            if(inputData.period!=='3'){
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
        }
        
        /**
         * 在模块打开的时候预先加载地图
        */
        addMap(){
            var that = this
            var div = this.$refs.cctvMap
            var mapV = this.data.mapView
            var map = mapV.map
            loadModules(['esri/views/MapView',"esri/tasks/GeometryService","esri/tasks/support/LengthsParameters","esri/geometry/geometryEngine","esri/geometry/Polygon"],{ url: esriConfig.baseUrl }).then(([MapView,GeometryService,LengthsParameters,geometryEngine,Polygon]) => {
                const mapview = new MapView({
                    container: div,
                    map: map,
                })
                that.mapV = mapview;
                mapview.ui.components = []
                mapview.constraints.lods = mapV.constraints.lods
                this.controlComLayer("init");
                this.arcgis.GeometryService = GeometryService ;
                this.arcgis.LengthsParameters= LengthsParameters;
                this.arcgis.geometryEngine= geometryEngine;
                this.arcgis.Polygon = Polygon;
            })
        }

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
                        this.data.mapView.map.add(this.comLayerList[item]);
                    }
                }else if(action=='destory'){
                    if(this.comLayerList[item]){
                        this.data.mapView.map.remove(this.comLayerList[item]);
                        this.comLayerList[item]=null;
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
            this.mapV.extent = this.data.mapView.extent      
        }
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
        }

        //改变巡检组的情况
        changeGroup(type?){
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
                    this.planModel.updatePlan[item].data=[];
                }
                this.resetHandlePage();
            }
        }

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
                        this.planModel.input[item][item2]=copyInput[item][item2]
                    }
                }else{
                    this.planModel.input[item]=copyInput[item];
                }
            }
            //清楚公共图层
            this.controlComLayer("init");
            //详情页面关闭
            this.$nextTick(()=>{
                this.pageShow.diaVisiable = false;
            })
        }

        //取消提交任务
        cancelSubmit() {
            this.diaVisiableCancle=false;
            this.auditInfoPage=false;
        }
    
        //展示详细信息
        planInfo(e) {
            this.pageShow.diaVisiable = true //显示详细页面弹窗
            this.$nextTick(()=>{
                this.addOrUpdateOrLook='look';
                //初始化部分数据
                //@ts-ignore
                this.$refs.xjType.innerHTML = '<span class="flexTitle">巡查类型：</span>' + '<span class="flexInfo">' + e.inspectType + '</span>'
                //@ts-ignore
                this.$refs.xjGroup.innerHTML = '<span class="flexTitle">巡查组：</span>' + '<span class="flexInfo">' + (e.inspectGroup==""?"全部":e.inspectGroup) + '</span>'
                //@ts-ignore
                this.$refs.xjWorker.innerHTML = '<span class="flexTitle">巡查人：</span>' + '<span class="flexInfo">' + e.inspectUserList + '</span>'
                //@ts-ignore
                this.$refs.xjBeginAndEndTime.innerHTML = '<span class="flexTitle">起止时间：</span>' + '<span class="flexInfo">' + e.planBegindate + ' - ' + e.planEnddate + '</span>',
                //@ts-ignore
                this.$refs.xjPlanNumber.innerHTML = '<span class="flexTitle">计划完成率：</span>' + '<span class="flexInfo">' + e.planPercent+'%</span>'
                //@ts-ignore
                this.$refs.mapBox1.appendChild(this.$refs.cctvMap);
                //@ts-ignore
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
        }

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
        }
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
        }
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
        }
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
        }

        //处理巡检点数据
        planPoint(saveData){
            let planInfo=saveData.planInfo;
            let data = {
                    current: 1,
                    size: 10000
                };
            queryXjPoint(data).then(res => {
                let dataList=[];
                dataList=res.result.records;
                planInfo.tableData = dataList;
                this.$nextTick(()=>{
                    this.toggleSelection(saveData)
                    let points=[];
                    planInfo.tableData.forEach(item=>{
                        points.push([item.lng,item.lat]);
                    });
                    this.addPointToMap(points,planInfo.layer);
                    planInfo.total = planInfo.tableData.length;
                })
            })
        }
        //处理隐患点数据
        planHidPoint(saveData){
            let planInfo=saveData.planInfo;
            let data = {
                    current: 1,
                    size: 10000,
                    auditResult:"1",//已审核通过
                };  
            queryDangerReport(data).then(res => {
                let dataList=[];
                res.result.records.forEach(item=>{
                    item.lng=item.lgtd;
                    item.lat=item.lttd;
                    dataList.push(item);
                })
                planInfo.tableData = dataList;
                this.$nextTick(()=>{
                    this.toggleSelection(saveData)
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
        }
         //处理工地监护点数据
        planSitePoint(saveData){
            let planInfo=saveData.planInfo;
            let data = {
                    current: 1,
                    size: 10000,
                    auditResult:"1",//已审核通过
                };
            queryBuildList(data).then(res => {
                let dataList=[];
                res.result.records.forEach(item=>{
                        item.lng=item.lgtd;
                        item.lat=item.lttd;
                        dataList.push(item);
                })
                planInfo.tableData = dataList;
                this.$nextTick(()=>{
                    this.toggleSelection(saveData)
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
        }
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
                dataList=res.result.records
                planInfo.tableData = dataList;
                this.$nextTick(()=>{
                    this.toggleSelection(saveData)
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
        }

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
            let rows=[];
            planInfo.tableData.forEach(item=>{
                let index=indexList.findIndex(item2=> {return item2==item.id});
                if(index!=-1){
                    rows.push(item);
                }
            });
            planInfo.tableData=rows;
        }

        /**
         * 巡检类型改变时触发事件
        */
        xjTypeChange(e?) {
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
                    }
                });
                this.planModel.input.planTypeInfo=typeInfo;
                this.initHandlePage();
            }
            //如果没有选择巡检类型则将当前指向的巡检数据置空
            if(this.planModel.input.planTypeInfo.length==0){
                //this.planModel.input.currentPlanTypeInfo=null;
            }
        }

        /**
         * 移除图层
         * */ 
        removeLayer(layer){
            if(layer){
                this.data.mapView.map.remove(layer);
            }
        }

        /**
         * 当巡检片区改变的时候，重新查询出的内容
         */ 
        resetHandlePage(){
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
        }

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
            tool.setVaule(data.planInfo.getQueryResult,[]);
            data.planInfo.sidExist.exist=true;
            data.planInfo.sidExist.layerName='';
        }

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
            this.data.mapView.map.reorder(this.comLayerList.highLayer, this.data.mapView.map.layers.length)
        }

        /**
         * 将数据格式化为planTypeInfo的planInfo
         */        
        initData(header,isCheckData,isServer){
            let layer=new this.data.mapView.TF_graphicsLayer();
            this.data.mapView.map.add(layer);
            return{
                header:header,//表头
                tableData:[],//数据
                isCheckData:isCheckData,//是否需要选择按钮
                selectData:[],//选择的数据
                layer:layer,//渲染的图层
                total:0,//总数
                containReg:[],//包含的片区
                containRegNames:[],//包含的片区的名称
                isServer:isServer,//是否可以查询字段
                where:"",//设置的查询条件（isServer当是true的时候才有用）
                drawGraphic:null,//绘制的图形
                pointLineResult:null,//选择图形的集合
                inspectContents:null,//后端保存的图形数据
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
        }

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
                }
            });
        }

        /*
         *获取当前选项卡的内容
         */
        getCurrentPlanTypeInfo(){
             //选项卡减少过会，如果当前值大于实际值将其设置为实际值
            // if((parseInt(this.planModel.input.currentPlanTypeName)+1)>this.planModel.input.planTypeInfo.length){
            //     if(this.planModel.input.planTypeInfo.length==0){
            //         this.planModel.input.currentPlanTypeName=0+"";
            //     }else{
            //         this.planModel.input.currentPlanTypeName=(this.planModel.input.planTypeInfo.length-1)+"";
            //     }
            // }
            if(this.planModel.input.currentPlanTypeName>=0){
                return this.planModel.input.planTypeInfo[this.planModel.input.currentPlanTypeName];
            }else{
                return null;
            }
        }

        /**
         * 清除图层
        */
        clearLayer(layer){
            if(layer&&layer.removeAll){
                layer.removeAll();
            }
        }

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
        }

        /**
         * 分组求取管网信息
        */
        groupGetInfo(ids,layerid,updata){
            let that=this;
            let currentData=null;
            currentData=updata;
            let getQueryResult=currentData.planInfo.getQueryResult
            tool.setVaule(getQueryResult,[]);
            getQueryResult.allObjectIds=ids;
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
                    getQueryResult.resultInfo.push.apply(getQueryResult.resultInfo,result.features);
                    //判断是否已异步请求完毕所有数据
                    if(getQueryResult.resultInfo.length==getQueryResult.allObjectIds.length){
                        that.conductServerResult(currentData);
                    };
                })
            })
        }

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
        }

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
                    where:''
                });
                currentData.planInfo.layer.add(graphic);
            }
        }

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
        }

        /**
         * 分页显示
         * */ 
        handleCurrentChange(val){
            let data=this.getCurrentPlanTypeInfo();
            let tabalData=data.planInfo.tableData;
            data.planInfo.pageInfo.currentData=tabalData.slice((val-1)*10,val*10);
            data.planInfo.pageInfo.currentIndex=val;
        }

        /**
         * 点击作废审核时触发事件
        */
        canclePage() {
            let data={
                planId:this.searchModel.getData.selectRow[0].id
            }
            cancleList(data).then(res => {
                this.diaVisiableCancle=true;
                if(res.result.records&&res.result.records.length>0){
                    res.result.records.forEach(item=>{
                        if(item.auditResult=='未审批'){
                            this.cancleInfo=item;
                        }
                    })
                }
            })
        }

        /**
         * 提交作废审核意见
        */
        abandonCheckInfoSubmit() {
            let dto = {
                "id": this.cancleInfo.id,
                "auditNotes": this.cancleInfo.auditNotes,
                "auditResult": this.cancleInfo.auditResult,
                "auditId":this.$store.state.user.userId
                }
            let templateServiceType = '07' //上报类型 0代表类型为年计划
            checkData(dto, templateServiceType).then(res => {
                this.diaVisiableCancle=false;
                this.getData();
            }).catch(err => {
                console.log(err);
            })
        }

        /**
         * 审核详情
        */
        auditInfo(e){
            this.auditInfoHisList=[];
            this.auditInfoPage=false;
            let data={
                planId:e.id
            }
            cancleList(data).then(res => {
                if(res.result.records.length>0){
                    this.auditInfoPage=true;
                    this.auditInfoHisList=res.result.records;
                }else{
                    this.$message({type: "info", message: "暂无审核信息" });
                }
            })
        }
}

</script>
<style scoped>
.flexOne {
  width: 80%;
  height: 60px;
  line-height: 30px;
  margin-top: 10px;
}
.flexOne .flexTitle {
  position: relative;
  float: left;
}
.flexOne .flexInfo {
  position: relative;
  float: left;
}
.flexDiv {
  width: 33%;
  height: 30px;
  line-height: 30px;
  margin-top: 10px;
}
.flexTitle {
  min-width: 90px;
  display: inline-block;
  text-align: right;
}
.flexInfo {
  display: inline-block;
  width: calc(100% - 100px);
}
.el-table__empty-text {
  margin-top: 30px;
  line-height: 30px;
}
.el-table__empty-text .empty-p {
  margin-top: -7px;
}
</style>
