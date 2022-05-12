<template>
  <div id="equipmentSearchStatistic" class="equipmentSearchStatistic">
    <div class="filteroption">
      <span class="select_name">现场负责人</span>
      <div class="select_option user_select">
        <el-select v-model="user_select.value" size="mini" style="width:100px">
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
          type="date"
          placeholder="选择日期"
        />
      </div>
      <span class="select_name">台账类型</span>
      <div class="select_option type_select" style="width:140px;">
        <el-select v-model="type_select.value" size="mini" style="width:100px" @change="equipmentTypeChange">
          <el-option
            v-for="item in type_select.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <el-button-group style="margin-left:10px;">
        <el-button type="primary" size="mini" class="btn search">查询</el-button>
        <el-button type="success" size="mini" class="btn export">导出</el-button>
      </el-button-group>
    </div>
    <div class="statistics" />
  </div>
</template>
<script>
import tfLegend from '@/views/zhpt/common/Legend'
export default {
  name: 'EquipmentSearchStatistic',
  components: {
    tfLegend
  },
  props: ['data'],
  data() {
    return {
      // 部门筛选信息
      type_select: {
        options: [
          { value: 'yanghu', label: '养护台账' },
          { value: 'weixiu', label: '维修台账' },
          { value: 'loudian', label: '漏点台账' },
          { value: 'chongxi', label: '冲洗台账' },
          { value: 'gwpw', label: '管网排污台账' }
        ],
        value: 'yanghu'
      },
      // 人员筛选信息
      user_select: {
        options: [
          { value: '0', label: '全部' },
          { value: '1', label: '韩雨辰' },
          { value: '2', label: '朱循义' },
          { value: '3', label: '魏先义' },
          { value: '4', label: '侯俊杰' }
        ],
        value: '1'
      },
      // 日期筛选信息
      date_select: {
        value: ''
      }
    }
  },
  watch: {},
  methods: {
    equipmentTypeChange(item) {
      console.log(item)
    }
  }
}
</script>

<style lang='scss' scoped>

.equipmentSearchStatistic {
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
    height: 100%;
    background-image: url('./images/statistic.png');
    background-size: 100% 100%;
  }
}
</style>
