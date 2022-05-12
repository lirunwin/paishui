<template>
  <div id="coverageRateStatistics" class="coverageRateStatistics">
    <div class="filteroption">
      <span class="select_name">部门</span>
      <div class="select_option dept_select">
        <el-select v-model="dept_select.value" size="mini" placeholder="请选择状态" style="width:100px">
          <el-option
            v-for="item in dept_select.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <span class="select_name">人员</span>
      <div class="select_option user_select">
        <el-select v-model="user_select.value" size="mini" placeholder="请选择状态" style="width:100px">
          <el-option
            v-for="item in user_select.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <span class="select_name">日期</span>
      <div class="select_option date_select" style="width:140px;">
        <el-date-picker
          v-model="date_select.value"
          size="mini"
          align="right"
          type="daterange"
          placeholder="选择日期"
        />
      </div>
      <el-button-group>
        <el-button class="search" type="primary" size="mini">查询</el-button>
        <el-button class="search" type="success" size="mini">图表</el-button>
        <el-button class="search" type="info" size="mini">导出</el-button>

      </el-button-group>
    </div>
    <div class="datatable">
      <el-table
        :data="terminalData"
        stripe
        style="width: 100%"
      >
        <el-table-column
          prop="region"
          label="片区"
          width="150"
          align="center"
        />
        <el-table-column
          prop="pipelength"
          label="管线长度"
          width="150"
          align="center"
        />
        <el-table-column
          prop="xjpath"
          label="巡检线"
          width="150"
          align="center"
        />
        <el-table-column
          prop="xjpathlength"
          label="巡检线长度"
          width="150"
          align="center"
        />
        <el-table-column
          prop="percent"
          label="占比"
          width="150"
          align="center"
        />
        <el-table-column
          prop="address"
          label="地址"
          width=""
          align="center"
        />
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CoverageRateStatistics',
  components: {
  },
  props: ['data'],
  data() {
    return {
      // 部门筛选信息
      dept_select: {
        options: [
          { value: 1, label: '巡检组' },
          { value: 2, label: '抢修组' },
          { value: 3, label: '维护组' }
        ],
        value: 1
      },
      // 人员筛选信息
      user_select: {
        options: [
          { value: '1', label: '曹鑫' },
          { value: '2', label: '韩雨辰' },
          { value: '3', label: '朱循义' },
          { value: '4', label: '魏先义' },
          { value: '5', label: '侯俊杰' }
        ],
        value: '1'
      },
      // 日期筛选信息
      date_select: {
        value: ''
      },
      terminalData: [
        {
          region: '金牛片区',
          pipelength: '12.32km',
          xjpath: '巡检线1',
          xjpathlength: '1345.3km',
          percent: '20%',
          address: '迎宾大道一段'
        },
        {
          region: '金牛片区',
          pipelength: '12.32km',
          xjpath: '巡检线1',
          xjpathlength: '1345.3km',
          percent: '20%',
          address: '迎宾大道一段'
        },
        {
          region: '金牛片区',
          pipelength: '12.32km',
          xjpath: '巡检线1',
          xjpathlength: '1345.3km',
          percent: '20%',
          address: '迎宾大道一段'
        },
        {
          region: '金牛片区',
          pipelength: '12.32km',
          xjpath: '巡检线1',
          xjpathlength: '1345.3km',
          percent: '20%',
          address: '迎宾大道一段'
        }
      ]
    }
  },
  watch: {}
}
</script>

<style lang='scss' scoped>

.coverageRateStatistics {
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
  }
  .datatable{
    width:100%;
    height:calc(100%-40px);
  }
}
</style>
