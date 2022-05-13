<template>
  <div style="width:100%;height:100%;padding:0" v-loading="loading">
    <div ref="div1" style="width:100%;height:100%; position: relative; transition: 0.3s; left: 0; ">
      <div ref="echart" style="width:0;float:left;height:100%;transition: 0.3s;padding:15px;opacity:0;">
        <div ref="chart" style="width:100%;height:100%;padding:20px;border:1px solid rgb(232,232,232);background:rgb(248,248,248);border-radius:4px;"></div>
      </div>
      <div ref="echart2" style="width:100%;float:left;height:100%;transition: 0.3s;">
        <el-row style="margin-top: 8px;">
          <span class="title2" style="margin-left:8px;">审核类型</span>
          <el-select v-model="chooseType" style="display: inline-block; margin-left: 5px; width:200px;" size="small" placeholder="请选择审核意见" clearable>
            <el-option v-for="item in types" :key="item.id" :label="item.auditTypeName" :value="item.auditTypeCode" />
          </el-select>
          <el-button size="small" type="primary" @click="pageJump(chooseType, false)">历史查看</el-button>
        </el-row>
        <el-table class="mapTable" :data="mainTable" border @row-dblclick="pageJumpTr" style="width: 100%;margin-top: 8px;" height="calc(100% - 48px)" stripe>
          <template slot="empty">
            <img src="@/assets/icon/null.png" alt="">
            <p class="empty-p">暂无数据</p>
          </template>
          <el-table-column prop="auditTypeName" label="任务类型" />
          <el-table-column prop="number" label="任务数量" />
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="pageJump(scope.row.auditTypeCode, true)" type="text" size="small">审核</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div ref="div2" style="width:100%;height:100%; position: relative;
      transition: 0.3s; top: -100%; left: 110%; z-index: 3; padding:8px;">
      <el-page-header @back="backCheak" :content="typeTitle" style="overflow: hidden;"></el-page-header>
      <!-- <component style="width:100%:height:calc(100% - 62px)" :is="component[selectCheak]" :isCheak="isCheak" :data="data"></component> -->
    </div>
  </div>
</template>

<script>
import Echarts from 'echarts'
import request from '@/utils/request'
import elementResizeDetectorMaker from 'element-resize-detector'
// import component from "./loadAllCheak";
import { typeConfig } from "./typeConfig";

export default {
  name: 'wxMissionManagement',
  props: { data: Object, isXj: Boolean },
  data() {
    return {
      mainTable: [],
      chooseType: '',
      types: [],
      typeTitle: '123',
      selectCheak: '',
      isCheak: false,
      loading: false,
      component
    }
  },
  mounted() {
    this.init().then(() => {
      this.getAll()
    })
  },
  created() {},
  methods: {
    async init() {
      var chart = this.chart = Echarts.init(this.$refs.chart)
      elementResizeDetectorMaker().listenTo(this.$refs.echart, () => this.$nextTick(chart.resize))
      window.onresize = () => this.$nextTick(chart.resize)
      
      this.divs = [this.$refs.div1, this.$refs.div2]
    },
    getAll() {
      this.loading = true
      request({ url: '/gps/audit/getAuditInfoList', method: 'post' }).then(res => {
        if(res.code == 1) {
          var filterConfig = this.isXj ? ['00', '01', '02', '03', '04', '05', '07', '06'] : ['08', '10','11']
          res = res.result.filter(e => filterConfig.indexOf(e.auditTypeCode) > -1)
          var allLength = 0
          var typeIndex = this.typeIndex = {}
          this.types = res
          this.mainTable = res = res.filter(e =>{ 
            allLength += e.number
            typeIndex[e.auditTypeCode] = e
            return e.number
          })
          if(res.length) {
            this.$nextTick(_ => {
              this.chart.setOption({
                title: { text: '待审核数量', subtext: '共' + allLength + '条', left: 'center' },
                tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} 条 ({d}%)' },
                legend: { bottom: 10, left: 'center', data: res.map(e => e.auditTypeName) },       
                series: [{ 
                  name: '审核数量占比', type: 'pie', radius: [0, 120], center: ['50%', '50%'], label: { show: false, position: 'center' },
                  data: res.map(e => { return { value: e.number, name: e.auditTypeName } }),
                }]
              })
              this.chart.resize
            })
          }
          var t = [['350px', '15px', '1', 'calc(100% - 350px)'], ['0', '0', '0', '100%']][res.length ? 0 : 1]
          this.$refs.echart.style.width = t[0]
          this.$refs.echart.style.padding = t[1]
          this.$refs.echart.style.opacity = t[2]
          this.$refs.echart2.style.width = t[3]
        } else this.$message.error(res.message)
        this.loading = false
      })
    },
    backCheak() {
      this.selectCheak = undefined
      this.divs[0].style.left = '0'
      this.divs[0].style.opacity = '1'
      this.divs[1].style.left = '110%'
      this.divs[1].style.opacity = '0'
      this.getAll()
    },
    pageJumpTr(row){
      this.pageJump(row.auditTypeCode, true);
    },
    pageJump(code, isCheak) {
      this.typeTitle = this.typeIndex[code].auditTypeName + ((this.isCheak = isCheak) ? '' : '历史')

      var d = typeConfig[code]
      if(!this.isCheak && d == 'xjYear') d = 'xjYearQuery'
      if(!this.isCheak && d == 'xjMonth') d = 'xjMonthQuery'
      if(!this.isCheak && d=='wxPlanYear') d = 'wxPlanYearQuery'
      if(!this.isCheak && d=='wxYear') d = 'wxYearQueryhis'
      this.selectCheak = d
      this.divs[0].style.left = '-110%'
      this.divs[0].style.opacity = '0'
      this.divs[1].style.left = '0'
      this.divs[1].style.opacity = '1'
    }
  }
}
</script>
<style scoped>
.el-table >>> .el-table__header-wrapper table th{
  height: 60px;
  text-align: center;
}
.el-table >>> .el-table__body-wrapper table td{
  text-align: center;
}
</style>
