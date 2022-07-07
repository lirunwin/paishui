<template>
  <div id="troubleTypeAnalysis" class="troubleTypeAnalysis">
    <div class="filteroption">
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
      <div>
        <el-button type="primary" style="margin-left: 5px;" size="small" @click="getTroubleTypeAnalysisData()"
          >查询</el-button
        >
        <el-button type="primary" justify="end" style="margin-left: 10px;" size="small" @click="handleDown()"
          >导出</el-button
        >
      </div>
    </div>
    <div id="pdfDom" class="pdfDom">
      <div class="box-hander">
        <div class="box-icon" />
        <div class="box-title">{{ chartTitle }}</div>
      </div>
      <div class="chartPie" id="chartPie"></div>
      <div class="box-hander">
        <div class="box-icon" />
        <div class="box-title">{{ tableTitle }}</div>
      </div>
      <div class="statistics">
        <el-table
          border
          ref="table1"
          style="width: 100%;"
          :summary-method="getTotal"
          show-summary
          :data="reportData"
          :header-cell-style="{ height: '36px', fontSize: '14px', color: '#333333', 'text-align': 'center' }"
          :cell-style="{ height: '30px', fontSize: '14px', color: '#333333' }"
        >
          <template slot="empty">
            <img src="@/assets/icon/null.png" alt="" />
          </template>
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="troubleType" label="隐患原因" align="left" />
          <el-table-column prop="troubleNum" label="数量(个)" width="240" align="center" />
          <el-table-column prop="rate" label="占比(%)" width="240" align="center" />
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { esriConfig, appconfig } from 'staticPub/config'
import { loadModules } from 'esri-loader'
import echarts from 'echarts'
import { reportTroubleCause } from '@/api/xjHiddenDangerManageApi'
import html2pdf from '@/utils/html2pdf'
import { noDataHtmlTemplate } from '@/utils/constant'
Vue.use(html2pdf)

Vue.prototype.$echarts = echarts
export default {
  name: 'TroubleTypeAnalysis',
  props: ['data'],
  data() {
    return {
      layerId: 17, //片区图层id
      pointPlaces: [], //码表 => 片区
      chartTitle: '', //图表标题
      tableTitle: '', //列表标题
      //查询条件
      querySearch: {
        pointPlace: '', //片区
        startTime: '',
        endtime: ''
        // reportTime: undefined    //起止时间
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
      reportData: [], //Table列表
      postSearch: {
        regionCodeList: '', //片区
        startDate: '', //开始时间
        endDate: '' //结束时间
      },

      myChart: undefined //图表信息
    }
  },
  watch: {},
  mounted() {
    this.chartTitle = '隐患原因分析'
    this.tableTitle = '隐患原因分析'

    this.getPartArea() //获取片区
    this.getInitData() //初始化起止时间
    this.getTroubleTypeAnalysisData() //查询
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

    /*--------------------- API相关 ---------------*/
    /**
     * @description 获取隐患原因报表
     */
    getData() {
      var that = this
      //设置
      that.postSearch.regionCodeList = that.querySearch.pointPlace.join(',')
      that.dateDiff()
      ;[that.postSearch.startDate, that.postSearch.endDate] = [
        this.querySearch.startTime + ' 00:00:00',
        this.querySearch.endTime + ' 23:59:59'
      ]
      if (that.strIsNull(this.querySearch.startTime) || that.strIsNull(this.querySearch.endTime)) {
        that.$message.error('请输入时间区间!')
        return
      }
      // console.log("查询条件："+JSON.stringify(that.postSearch))
      that.postSearch.deptId = that.$store.state.user.departmentId
      that.reportData = []
      reportTroubleCause(that.postSearch).then((res) => {
        if (res.code !== 1) {
          that.$message.error('获取隐患原因报表出错!')
          return
        }
        //数据总数
        that.reportData = res.result
        // console.log("数据结果："+JSON.stringify(that.reportData))
        let troubleChartPie = []
        that.reportData.forEach((element) => {
          // sum_troubleNum += element.troubleNum
          troubleChartPie.push({
            value: element.troubleNum,
            name: element.troubleType
          })
        })

        if (that.arrayIsNull(that.reportData)) {
          var html = noDataHtmlTemplate
          var chartDom = document.getElementById('chartPie')
          chartDom.innerHTML = html
          chartDom.removeAttribute('_echarts_instance_')
          //document.getElementById('chartPie').innerHTML = html
        } else {
          //饼图
          that.drawchartPie(troubleChartPie)
        }
      })
    },

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
      var nextMonth = currentMonth
      var nextDay = date.getDate()
      var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, nextDay)
      // var oneDay=1000*60*60*24
      var endDate = new Date(nextMonthFirstDay)
      //赋值
      this.querySearch.startTime = binDate.getFullYear() + '-' + this.getMonthOrDay(binDate.getMonth() + 1) + '-01'
      this.querySearch.endTime =
        endDate.getFullYear() + '-' + this.getMonthOrDay(endDate.getMonth() + 1) + '-' + endDate.getDate()
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
        '隐患原因分析-' +
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
      this.tableTitle =
        '隐患原因分析-' +
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
     * @description 判断字符串是否为空
     */
    strIsNull(strVal) {
      strVal = strVal || ''
      return typeof strVal == 'undefined' || strVal == null || strVal == ''
    },

    /**
     * @description 判断数组是否为空
     */
    arrayIsNull(aryList) {
      return typeof aryList == 'undefined' || aryList == null || aryList.length == 0
    },

    /**
     * @description 绘制Echart图表
     */
    drawchartPie(troubleChartPie) {
      var that = this
      //  document.getElementById('chartPie').innerHTML = "";
      // 基于准备好的dom，初始化echarts实例
      that.myChart = echarts.init(document.getElementById('chartPie'))
      //myChart.clear();
      // 绘制图表
      const option = {
        //  title: {
        //         text: this.chartTitle,
        //         left: 'center',
        //         // textStyle: {
        //         //   color: 'rgb(46, 199, 201)'
        //         // }
        //     },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: '5%',
          left: '5%'
        },
        series: [
          {
            name: '隐患原因',
            type: 'pie', //设置图表类型为饼状图
            radius: '55%', //饼状图半径
            center: ['50%', '60%'],
            data: troubleChartPie //饼状图数据
            // color: ['skyblue'],
            // emphasis: {
            //     itemStyle: {
            //         shadowBlur: 10,
            //         shadowOffsetX: 0,
            //         shadowColor: 'rgba(0, 0, 0, 0.5)'
            //     }
            // }
          }
        ]
      }
      that.myChart.setOption(option, true)

      //自定义缩放
      window.addEventListener('resize', () => {
        if (that.myChart) {
          that.myChart.resize()
        }
      })
    },

    /**
     * 按钮 - 查询
     */
    getTroubleTypeAnalysisData() {
      this.getData()
    },

    /**
     * @description 按钮 => 导出
     */
    handleDown() {
      this.getPdf(this.chartTitle)
    },

    /**
     * @description 合计
     */
    getTotal(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map((item) => Number(item[column.property]))
        if (index === 3) {
          sums[index] = '100.00'
        } else {
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] += ''
          } else {
            sums[index] = ''
          }
        }
      })

      return sums
    }
  }
}
</script>

<style lang="scss" scoped>
.troubleTypeAnalysis {
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
      margin: 0px 6px 0px 10px;
    }

    .title:first-child {
      margin: 0px 4px 0px 0px;
    }
  }
  .pdfDom {
    flex: 1;
    height: calc(100% - 50px);
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
  }
  .statistics {
    width: 100%;
    // display: flex;
    //  align-items:center;
    text-align: center;
    max-height: calc(100% - 300px - 40px);
    background-size: 100% 100%;
  }
  .chartPie {
    width: 100%;
    height: 300px;
  }

  .el-table {
    // position: absolute;
    margin-top: 10px;
    margin-bottom: 10px;
    border-color: rgba(222, 226, 230, 0.5);
    height: 100%;
  }

  // /deep/.el-table {
  //   margin-top: 10px;
  //   border-color: rgba(222, 226, 230, 0.5);
  //   width:100%;
  //   margin: 0 auto;
  // }
}
</style>
