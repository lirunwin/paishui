<template>
  <div id="troubleSearchReport" class="troubleSearchReport">
    <div class="filteroption">
      <span class="title">部门：</span>
      <div>
        <el-select v-model="querySearch.inspectGroupId" style="width:100px;" size="small" @change="Bmchange">
          <el-option v-for="item of groupData" :key="item.id" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </div>
      <span class="title">人员：</span>
      <div>
        <el-select v-model="querySearch.inspectUsers" size="small" multiple collapse-tags clearable>
          <el-option v-for="item of userData" :key="item.id" :value="item.id" :label="item.realName"></el-option>
        </el-select>
      </div>
      <span class="title">管网片区：</span>
      <div>
        <el-select
          v-model="querySearch.pointPlace"
          size="small"
          placeholder="请选择片区"
          style="width: 160px;"
          multiple
          collapse-tags
          clearable
        >
          <el-option v-for="item of pointPlaces" :key="item.CODE" :value="item.CODE" :label="item.NAME"></el-option>
        </el-select>
      </div>
      <span class="title">状态：</span>
      <div>
        <el-select v-model="querySearch.state" style="width: 160px;" size="small" multiple collapse-tags clearable>
          <el-option v-for="item in stateStatus" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <span class="title">时间：</span>
      <el-date-picker
        v-model="querySearch.startTime"
        size="small"
        type="date"
        placeholder="请选择开始时间"
        :picker-options="startOptions"
        value-format="yyyy-MM-dd"
      />
      ~
      <el-date-picker
        v-model="querySearch.endTime"
        size="small"
        type="date"
        placeholder="请选择结束时间"
        :picker-options="endOptions"
        value-format="yyyy-MM-dd"
      />
      <el-button size="small" style="margin-left: 5px;" type="primary" @click="getTroubleSearchAnalysisData()"
        >查询</el-button
      >
      <!-- <el-button size="small" style="margin-left: 10px;"  type="primary" @click="handleDown()" >导出</el-button> -->
      <export-btn table-id="materiaStatistics" style="" :file="chartTitle"></export-btn>
    </div>
    <div id="pdfDom" class="pdfDom">
      <!-- <h3 class="troubleTypeSearchTableName">{{chartTitle}}</h3> -->
      <div class="box-hander">
        <div class="box-icon" />
        <div class="box-title">{{ chartTitle }}</div>
      </div>
      <div class="statistics">
        <el-table
          border
          ref="table1"
          stripe
          style="width: 100%;"
          height="100%"
          :data="reportData"
          :header-cell-style="{ 'text-align': 'center' }"
        >
          <template slot="empty">
            <img src="@/assets/icon/null.png" alt="" />
            <p class="empty-p">暂无数据</p>
          </template>
          <el-table-column type="index" fixed label="序号" width="80px" align="center">
            <template slot-scope="scope">
              <span>{{ (pageInfo.current - 1) * pageInfo.size + (scope.$index + 1) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pipeName" fixed sortable label="管线名称" width="200" align="left" />
          <el-table-column prop="location" fixed sortable label="隐患部位" width="120" align="center" />
          <el-table-column prop="address" fixed label="地址" width="200" :show-overflow-tooltip="true" align="left" />
          <el-table-column prop="typeName" label="隐患原因" width="180px" :show-overflow-tooltip="true" align="left" />
          <el-table-column
            prop="toubleRangeName"
            label="隐患等级"
            width="180px"
            :show-overflow-tooltip="true"
            align="left"
          />
          <el-table-column prop="typeNode" label="备注" width="260" :show-overflow-tooltip="true" align="left" />
          <el-table-column prop="isbuild" sortable label="是否进入工地" width="140" align="center" />
          <el-table-column prop="sgdw" sortable label="施工单位名称" width="140" align="left" />
          <el-table-column prop="gdfzr" sortable label="施工负责人" width="140" align="center" />
          <el-table-column prop="phone" sortable label="联系电话" width="140" align="center" />
          <el-table-column prop="suggest" label="消除隐患建议" width="260" :show-overflow-tooltip="true" align="left" />
          <el-table-column prop="state" sortable label="隐患是否消除" width="140" align="center" />
          <el-table-column prop="auditTime" sortable label="消除时间" width="160" align="center" />
          <el-table-column
            prop="notes"
            sortable
            label="排除隐患情况"
            width="260"
            :show-overflow-tooltip="true"
            align="left"
          />
          <el-table-column prop="submitUserName" fixed="right" width="120" sortable label="上报人" align="center" />
          <el-table-column prop="submitTime" fixed="right" width="160" sortable label="上报时间" align="center" />
        </el-table>
      </div>
    </div>
    <!-- <div class="pagination-area">
		<el-pagination layout="total, sizes, prev, next, pager, jumper"
			:page-sizes="[10,20,30,50,100,1000]"
			:page-size="pageInfo.size"
			:current-page="pageInfo.current"
			:total="pageInfo.tableTotal"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange" />
	</div> -->
    <div v-show="false">
      <el-table
        border
        stripe
        style="width: 100%;"
        height="100%"
        id="materiaStatistics"
        :data="reportDataTotal"
        :header-cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column type="index" label="序号" width="80px" align="center" />
        <el-table-column prop="pipeName" label="管线名称" width="100px" align="left" />
        <el-table-column prop="location" label="隐患部位" width="100px" align="center" />
        <el-table-column prop="address" label="地址" width="200px" align="left" />
        <el-table-column prop="typeName" label="隐患原因" width="180px" align="left" />
        <el-table-column prop="toubleRangeName" label="隐患等级" width="180px" align="left" />
        <el-table-column prop="typeNode" label="备注" align="left" />
        <el-table-column prop="isbuild" label="是否进入工地" align="center" />
        <el-table-column prop="sgdw" label="施工单位名称" align="left" />
        <el-table-column prop="gdfzr" label="施工负责人" align="center" />
        <el-table-column prop="phone" label="联系电话" align="center" />
        <el-table-column prop="suggest" label="消除隐患建议" align="left" />
        <el-table-column prop="state" label="隐患是否消除" align="center" />
        <el-table-column prop="auditTime" label="消除时间" align="center" />
        <el-table-column prop="notes" label="排除隐患情况" align="left" />
        <el-table-column prop="submitUserName" label="上报人" align="center" />
        <el-table-column prop="submitTime" label="上报时间" align="center" />
      </el-table>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { esriConfig, appconfig } from 'staticPub/config'
import { loadModules } from 'esri-loader'
import ExportBtn from './components/ExportBtn.vue'
import { reportTroubleRecordLedger, queryGroupUserMap } from '@/api/xjHiddenDangerManageApi'
import html2pdf from '@/utils/html2pdf'
import { getDepartment, getDeptUserList } from '@/api/work'
Vue.use(html2pdf)

export default {
  name: 'TroubleSearchReport',
  components: { ExportBtn },
  props: ['data'],
  data() {
    return {
      layerId: 17, //片区图层id
      pointPlaces: [], //码表 => 片区
      groupData: [], //组数据
      userData: [], //人员数据
      chartTitle: '', //图表标题
      stateStatus: [
        // 码表 => 隐患状态 0无需处理、1巡查、2已消除、3消除申请
        { id: '', name: '全部' },
        { id: '0', name: '无需处理' },
        { id: '1', name: '巡查' },
        { id: '3', name: '消除申请' },
        { id: '2', name: '已消除' }
      ],
      pageInfo: { current: 1, size: 30, tableTotal: 1 }, //分页数据
      // 查询字段
      querySearch: {
        inspectGroupId: undefined, //分组
        inspectUsers: undefined, //人员
        pointPlace: undefined, //片区
        state: undefined, //状态
        startTime: '',
        endtime: ''
      },
      startOptions: {
        disabledDate: (time) => {
          if (this.querySearch.endTime) {
            return time.getTime() >= new Date(this.querySearch.endTime)
          }
        }
      },
      endOptions: {
        disabledDate: (time) => {
          if (this.querySearch.startTime) {
            return new Date(this.querySearch.startTime) - 1000 * 60 * 60 * 24 > time.getTime()
          }
        }
      },
      reportData: [], //Table表格数据
      reportDataTotal: [], //Table表格数据=>导出
      disableExport: false, //导出按钮是否可用
      //提交请求
      postSearch: {
        // groupId: '',   //巡检组
        userId: '', //用户
        regionCodeList: '', //片区
        troubleState: '', //状态
        startDate: '', //开始时间
        endDate: '', //结束时间
        deptId: ''
      }
    }
  },
  watch: {},
  mounted() {
    this.getPartArea() //获取片区
    this.getInitData() //初始化起止时间
    this.getGroupUserMap() //巡检组、巡检人
  },
  destroyed() {
    console.log('实例销毁完成')
  },
  methods: {
    /*--------------------- 地图相关 ---------------*/
    /**
     * @description 获取片区
     */
    getPartArea() {
      loadModules(['esri/geometry/geometryEngine', 'esri/geometry/Point', 'esri/geometry/geometryEngineAsync'], {
        url: esriConfig.baseUrl
      }).then(([geometryEngine, Point, geometryEngineAsync]) => {
        $.ajax({
          url: appconfig.gisResource.business_map.config[0].url + '/' + this.layerId + '/query?f=pjson',
          type: 'POST',
          data: {
            where: '1=1',
            f: 'pjson',
            outFields: '*'
          },
          success: (data) => {
            this.pointPlaces = []
            data = JSON.parse(data)
            data = data.features
            for (let item of data) {
              this.pointPlaces.push(item.attributes)
            }
          },
          error: (error) => this.$message.error(error)
        })
      })
    },

    /*--------------------- 分页相关 --------------*/
    /**
     * @description 分页每页条数
     */
    handleSizeChange(pageSize) {
      this.pageInfo.size = pageSize
      this.getData()
    },
    /**
     * @description 改变当前页
     */
    handleCurrentChange(currentPage) {
      this.pageInfo.current = currentPage
      this.getData()
    },

    /*--------------------- API相关 ---------------*/
    /**
     * @description 获取隐患台账列表
     */
    getData() {
      var that = this
      that.disableExport = false
      // console.log("page参数："+JSON.stringify(that.pageInfo));
      that.dateDiff()
      ;[that.postSearch.startDate, that.postSearch.endDate] = [
        this.querySearch.startTime + ' 00:00:00',
        this.querySearch.endTime + ' 23:59:59'
      ]
      if (that.strIsNull(this.querySearch.startTime) || that.strIsNull(this.querySearch.endTime)) {
        that.$message.error('请输入时间区间!')
        return
      }

      //追加分页参数
      const query = that.pageInfo
      // debugger
      that.postSearch.regionCodeList = that.querySearch.pointPlace ? that.querySearch.pointPlace.join(',') : ''
      that.postSearch.userId = that.querySearch.inspectUsers ? that.querySearch.inspectUsers.join(',') : ''
      that.postSearch.troubleState = that.querySearch.state ? that.querySearch.state.join(',') : ''
      that.postSearch.deptId = that.querySearch.inspectGroupId || ''
      Object.assign(query, that.postSearch)

      const formdata = new FormData()
      Object.keys(query).forEach((key) => {
        formdata.append(key, query[key])
      })

      // this.disableReport = true
      that.reportData = []
      reportTroubleRecordLedger(formdata).then((res) => {
        if (!res || res.code !== 1) {
          that.$message.error('获取隐患审核列表出错!')
          return
        }
        //数据总数
        that.pageInfo.tableTotal = res.result.total
        that.reportData = res.result.records

        this.handleDown().then(() => (that.disableExport = true))
      })
    },

    /**
     * @description 按钮 => 查询
     */
    getTroubleSearchAnalysisData() {
      this.pageInfo.current = 1
      this.getData()
    },

    /**
     * @description 按钮 => 导出Execl
     */
    async handleDown() {
      var that = this
      that.dateDiff()
      ;[that.postSearch.startDate, that.postSearch.endDate] = [
        this.querySearch.startTime + ' 00:00:00',
        this.querySearch.endTime + ' 23:59:59'
      ]
      if (that.strIsNull(that.postSearch.startDate) || that.strIsNull(that.postSearch.endDate)) {
        that.$message.error('请输入时间区间!')
        return
      }
      that.postSearch.regionCodeList = that.querySearch.pointPlace ? that.querySearch.pointPlace.join(',') : ''
      that.postSearch.userId = that.querySearch.inspectUsers ? that.querySearch.inspectUsers.join(',') : ''
      that.postSearch.troubleState = that.querySearch.state ? that.querySearch.state.join(',') : ''
      that.postSearch.deptId = that.querySearch.inspectGroupId || ''
      // var pages = { size:1000000000 }
      // Object.assign(that.postSearch, pages)

      const formdata = new FormData()
      Object.keys(that.postSearch).forEach((key) => {
        formdata.append(key, that.postSearch[key])
      })
      formdata.append('size', '1000000000')

      reportTroubleRecordLedger(formdata).then((res) => {
        if (res.code !== 1) {
          that.$message.error('导出隐患审核列表出错!')
          return
        }

        // console.log("导出数据："+ res.result.total)
        that.reportDataTotal = res.result.records
      })
    },

    /**
     * @description 计算开始、结束时间
     */
    dateDiff() {
      if (this.arrayIsNull(this.querySearch.startTime) || this.arrayIsNull(this.querySearch.endTime)) {
        return
      }
      var bintime = new Date(this.querySearch.startTime)
      var bindate =
        bintime.getFullYear() +
        '-' +
        this.getMonthOrDay(bintime.getMonth() + 1) +
        '-' +
        this.getMonthOrDay(bintime.getDate())
      //处理时间
      var endtime = new Date(this.querySearch.endTime)
      var enddate =
        endtime.getFullYear() +
        '-' +
        this.getMonthOrDay(endtime.getMonth() + 1) +
        '-' +
        this.getMonthOrDay(endtime.getDate())
      //图表标题
      this.chartTitle =
        '隐患记录台账信息表-' +
        bintime.getFullYear() +
        '年' +
        (bintime.getMonth() + 1) +
        '月' +
        bintime.getDate() +
        '日~' +
        endtime.getFullYear() +
        '年' +
        (endtime.getMonth() + 1) +
        '月' +
        endtime.getDate() +
        '日'
    },

    /**
     * @description 获取/设置初始时间
     */
    getInitData() {
      var that = this
      var date = new Date()
      //开始时间
      var binDate = new Date(date.getFullYear(), 0, 1)
      //结束时间
      var currentMonth = date.getMonth()
      var nextMonth = ++currentMonth
      var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
      var oneDay = 1000 * 60 * 60 * 24
      var endDate = new Date(nextMonthFirstDay - oneDay)
      //赋值
      this.querySearch.startTime = binDate.getFullYear() + '-' + this.getMonthOrDay(binDate.getMonth() + 1) + '-01'
      let tempTime =
        endDate.getFullYear() +
        '-' +
        this.getMonthOrDay(endDate.getMonth() + 1) +
        '-' +
        this.getMonthOrDay(endDate.getDate())
      this.querySearch.endTime = tempTime
    },
    //获取人员
    Bmchange() {
      getDeptUserList({ deptId: this.querySearch.inspectGroupId }).then((res) => {
        if (res.code === 1) {
          this.querySearch.inspectUsers = ''
          this.userData = res.result
        }
      })
    },

    /**
     * @description 获取分组人员
     */
    getGroupUserMap() {
      this.querySearch.inspectGroupId = parseInt(this.$store.state.user.departmentId)
      getDepartment().then((res) => {
        if (res.code === 1) {
          this.groupData = res.result
          this.Bmchange()
          this.getTroubleSearchAnalysisData()
        }
      })
      // var that = this
      // queryGroupUserMap().then(res => {
      // if(res.code !== 1){
      // 	that.$message.error("获取分组信息出错")
      // 	return;
      // }
      // var groupUserVoList = res.result.groupUserVoList    //分组信息
      // var groupUserDeptVoList = res.result.groupUserDeptVoList    //部门用户

      // if(that.arrayIsNull(groupUserVoList) && that.arrayIsNull(groupUserDeptVoList)){
      // 	that.$message.error("获取分组信息出错")
      // 	return;
      // }
      // if(that.arrayIsNull(groupUserVoList) && !that.arrayIsNull(groupUserDeptVoList)){
      // 	//分组为空，部门用户信息不为空
      // 	that.groupData.push({ id:'',name:'全部' })
      // 	var deptUserData = []
      // 	groupUserDeptVoList.forEach(element => {
      // 		deptUserData.push({
      // 			userId:element.userId,
      // 			userIdName: element.userName
      // 		})
      // 	})

      // 	that.groupDeptUser.push({
      // 		groupId: '',
      // 		groupName: '全部',
      // 		data: deptUserData
      // 	})

      // }else if(!that.arrayIsNull(groupUserVoList) && !that.arrayIsNull(groupUserDeptVoList)){
      // 	//获取组合后的数据
      // 	that.groupDeptUser = that.arrayGroupUser(groupUserVoList);

      // 	//分组不为空，部门用户信息也不为空，表示当前登录人员不在巡检组中，增加全部
      // 	var deptUserData = []
      // 	groupUserDeptVoList.forEach(element => {
      // 		deptUserData.push({
      // 			userId:element.userId,
      // 			userIdName: element.userName
      // 		})
      // 	})

      // 	that.groupDeptUser.push({
      // 		groupId: '',
      // 		groupName: '全部',
      // 	data: deptUserData
      // 	})
      // 	}else if(!that.arrayIsNull(groupUserVoList) && that.arrayIsNull(groupUserDeptVoList)){
      // 		//分组不为空，部门用户信息为空，表示当前登录人员在巡检组中
      // 		that.groupDeptUser = that.arrayGroupUser(groupUserVoList);
      // 	}

      // 	// console.log("参数："+JSON.stringify(that.groupDeptUser))
      // 	//利用组合后的参数，拆分巡检组 和 巡检人
      // 	that.groupDeptUser.forEach((element, index) => {
      // 		that.groupData.push({
      // 		groupId: element.groupId,
      // 		groupName: element.groupName,
      // 		})
      // 		if(index===0){
      // 		//默认显示第一个
      // 		that.userData = element.data
      // 		}
      // 	})
      // }).catch(err => {
      // 	console.log(err);
      // })
    },

    // /**
    //    * @description 组合当前分组用户信息
    //    */
    //   arrayGroupUser(aryList){
    //     let map = {}

    //     for (let i = 0; i < aryList.length; i++) {
    //         let ai = aryList[i]
    //         if (!map[ai.groupId]) {
    //             map[ai.groupId] = [{userId:ai.userId,userIdName:ai.userIdName}]
    //             map[ai.groupId].groupName = ai.groupName;
    //         } else {
    //             map[ai.groupId].push({userId:ai.userId,userIdName:ai.userIdName})
    //             map[ai.groupId].groupName = ai.groupName;
    //         }
    //     }
    //     let res = []
    //     Object.keys(map).forEach(key => {
    //         res.push({
    //             groupId: key,
    //             groupName:map[key].groupName,
    //             data: map[key],
    //         })
    //     })
    //     return res;
    //   },

    /*
     *处理月份和天
     */
    getMonthOrDay(month) {
      month = parseInt(month)
      if (month < 10) {
        month = '0' + month
      } else {
        month = month + ''
      }
      return month
    },

    // /**
    //    * @description 巡检组 change事件
    //    */
    //   changeGroupData(groupId){
    //     //根据选择项，选择项中的巡检人员
    //     var newAryList = this.groupDeptUser.filter(item => item.groupId == groupId )
    //     if(newAryList.length>0){
    //       this.userData = newAryList[0].data;
    //     }else{
    //       this.userData = []
    //     }

    //     this.querySearch.inspectGroupId = groupId
    //   this.querySearch.inspectUsers = []
    //   },

    /**
     * @description 判断数组是否为空
     */
    arrayIsNull(aryList) {
      return typeof aryList == 'undefined' || aryList == null || aryList.length == 0
    },

    /**
     * @description 判断字符串是否为空
     */
    strIsNull(strVal) {
      strVal = strVal || ''
      return typeof strVal == 'undefined' || strVal == null || strVal == ''
    }
  }
}
</script>

<style lang="scss" scoped>
.troubleSearchReport {
  height: 100%;
  width: 100%;
  padding: 5px;
  .filteroption {
    width: 100%;
    height: 50px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-bottom: 1px #dedede solid;

    .title {
      margin: 0px 4px 0px 10px;
    }

    .title:first-child {
      margin: 0px 6px 0px 0px;
    }
  }
  .pdfDom {
    flex: 1;
    height: calc(100% - 100px);
    overflow-y: auto;
    overflow-x: hidden;
    .box-hander {
      height: 40px;
      line-height: 40px;
      font-size: 16px;

      .box-icon {
        width: 4px;
        height: 18px;
        margin: 10px 6px 10px 0px;
        background-color: #2a77f7;
        float: left;
      }

      .box-title {
        // padding: 0px 0px 0px 10px;

        height: 40px;
        line-height: 40px;
        font-size: 16px;
        text-align: left;
        font-weight: bold;
        float: left;
        // border: 1px red solid;
      }
    }

    .statistics {
      flex: 1;
      height: calc(100% - 34px);
    }
  }

  .troubleTypeSearchTableName {
    // position: relative;
    text-align: center;
    height: 30px;
    line-height: 30px;
    margin-bottom: 15px;
    font-size: 14px;
  }

  .pagination-area {
    height: 60px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    // align-self: flex-end;
  }
}
</style>
