<template>
  <div id="personnelXjStatistics" class="personnelXjStatistics">
    <div class="filteroption">
      <span class="select_name"><span style="color: red;">*</span>公司</span>
      <div class="select_option company_select">
        <el-select v-model="company_select.value" size="small" style="width:100px">
          <el-option
            v-for="item in company_select.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <span class="select_name">部门</span>
      <div class="select_option department_select">
        <el-select v-model="department_select.value" size="small" style="width:100px">
          <el-option
            v-for="item in department_select.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <span class="select_name">人员</span>
      <div class="select_option personnel_select">
        <el-select v-model="personnel_select.value" size="small" style="width:100px">
          <el-option
            v-for="item in personnel_select.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <span class="select_name"><span style="color: red;">*</span>管线类型</span>
      <div class="select_option pipeType_select">
        <el-select v-model="pipeType_select.value" size="small" style="width:100px">
          <el-option
            v-for="item in pipeType_select.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <span class="select_name"><span style="color: red;">*</span>巡检周期</span>
      <div class="select_option xjDuration_select">
        <el-select v-model="xjDuration_select.value" size="small" style="width:100px">
          <el-option
            v-for="item in xjDuration_select.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
    <div class="filteroption1">
      <span class="select_name"><span style="color: red;">*</span>查询日期</span>
      <div class="select_option date_select" style="width:240px;">
        <el-date-picker
          v-model="date_select.value"
          size="small"
          align="right"
          type="daterange"
          placeholder="选择日期"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </div>
      <div class="buttons" style="position: relative;float: left;left: 10px;">
        <el-button type="primary" size="small" @click="getPersonnelXjStatistics()">查询</el-button>
        <el-button type="primary" size="small">导出</el-button>
      </div>
    </div>
    <div class="statistics">
      <h3 class="personnelXjStatisticTableName">人员巡检实时统计数据表（2020年12月21日~2020年12月21日）</h3>
      <el-table
        :data="tableData"
        border
        stripe
        :cell-style="{height: '30px', fontSize: '14px', color: '#333333'}"
        :header-cell-style="{height:'50px', fontSize: '14px', color: '#333333'}"
        style="width: 100%"
      >
        <el-table-column
          prop="staffName"
          align="center"
          label="员工姓名"
        />
        <el-table-column
          prop="department"
          align="center"
          label="部门"
        />
        <el-table-column
          prop="xjDuration"
          align="center"
          label="巡检周期"
        />
        <el-table-column
          prop="xjPoint"
          align="center"
          label="巡检点(个)"
        />
        <el-table-column
          prop="xjLine"
          align="center"
          label="巡检线(km)"
        />
        <el-table-column
          prop="completeRatioXjPoint"
          align="center"
          label="完成比例巡检点"
        />
        <el-table-column
          prop="completeRatioXjLine"
          align="center"
          label="完成比例巡检线"
        />
      </el-table>
    </div>
  </div>
</template>
<script>
import tfLegend from '@/views/zhpt/common/Legend'
import { queryPersonnelXjStatistics } from '@/api/xjApi'
export default {
  name: 'PersonnelXjStatistics',
  components: {
    tfLegend
  },
  props: ['data'],
  data() {
    return {
      // 公司筛选信息
      company_select: {
        options: [
          { value: 1, label: '全部公司' },
          { value: 2, label: '德阳自来水公司' }
        ],
        value: 2
      },
      // 部门筛选信息
      department_select: {
        options: [
          { value: '0', label: '全部' },
          { value: '1', label: '巡检组' },
          { value: '2', label: '维护组' }
        ],
        value: '1'
      },
      // 人员筛选信息
      personnel_select: {
		   options: [
			   { value: '0', label: '所有人员' },
			   { value: '1', label: '测试' },
			   { value: '2', label: '张三' },
			   { value: '3', label: '李四' }
		   ],
		   value: '0'
      },
      // 管线类型筛选信息
      pipeType_select: {
        options: [
          { value: '0', label: '全部选中' }
        ],
        value: '0'
      },
      // 巡检周期筛选信息
      xjDuration_select: {
        options: [
          { value: '0', label: '全部选中' }
        ],
        value: '0'
      },
      	// 日期筛选信息
      date_select: {
        value: ''
      },
      tableData: [
        {
          staffName: '测试',
          department: '业务部门',
          xjDuration: '一天一巡',
          xjPoint: '1/2',
          xjLine: '0/311.7',
          completeRatioXjPoint: '50%',
          completeRatioXjLine: '0%'
        },
        {
          staffName: '张三',
          department: '管理部门',
          xjDuration: '一天一巡',
          xjPoint: '12/45',
          xjLine: '0/245.7',
          completeRatioXjPoint: '26.7%',
          completeRatioXjLine: '0%'
        },
        {
          staffName: '李四',
          department: '业务部门',
          xjDuration: '一天一巡',
          xjPoint: '87/100',
          xjLine: '0/213.7',
          completeRatioXjPoint: '87%',
          completeRatioXjLine: '0%'
        }
      ],
      queryData: {} // 将要查询的对象
    }
  },
  watch: {},
  methods: {
	  // 获取个人巡检统计表单数据
	  getPersonnelXjStatistics() {
		  queryPersonnelXjStatistics().then(res => {
			  console.log(res)
		  })
	  }
  }
}
</script>

<style lang='scss' scoped>

.personnelXjStatistics {
  position: relative;
    height: 100%;
    width: 100%;
    padding: 5px;
    .filteroption{
      position: relative;
      height: 40px;
      width: 100%;
      .select_name{
        position: relative;
        float: left;
        // font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
        font-size: 14px;
        font-weight: 500;
        color: black;
        margin-left: 10px;
        margin-top: 5px;
      }
      .select_option {
        position: relative;
        width: 100px;
        float: left;
        margin-left: 5px;
        .el-select {
          position: relative;
          width: 100%;
        }
        .el-date-editor{
          position:relative;
          width: 100%;
        }
      }
      .btn{
          position: relative;
          float: left;
      }
    }
    .statistics{
      position: relative;
      width: 100%;
      height: 700px;
      background-size: 100% 100%;
    }
}
.filteroption1{
	  position: relative;
	  height: 40px;
	  width: 100%;
	  .select_name{
	    position: relative;
	    float: left;
	    // font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
	    font-size: 14px;
	    font-weight: 500;
	    color: black;
	    margin-left: 10px;
	    margin-top: 5px;
	  }
	  .select_option {
	    position: relative;
	    width: 100px;
	    float: left;
	    margin-left: 5px;
	    .el-select {
	      position: relative;
	      width: 100%;
	    }
	    .el-date-editor{
	      position:relative;
	      width: 100%;
	    }
	  }
	  .btn{
	      position: relative;
	      float: left;
	  }
}
.personnelXjStatisticTableName {
	position: relative;
	text-align: center;
	margin-bottom: 15px;
	font-size: 14px;
}
</style>
