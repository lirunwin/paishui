<template>
  <div id="troubleTrendAnalysis" class="troubleTrendAnalysis">
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
          <el-option v-for="item of pointPlaces" :key="item.CODE" :value="item.CODE" :label="item.NAME" />
        </el-select>
      </div>
      <span class="title">隐患原因：</span>
      <div>
        <el-select
          v-model="querySearch.toubleType"
          size="small"
          style="width: 200px;"
          multiple
          collapse-tags
          clearable
          @focus="getDangerReason"
        >
          <el-option v-for="item of reasons" :key="item.id" :value="item.id" :label="item.name" />
        </el-select>
      </div>
      <div style="margin:0px 6px 0px 10px">
        <el-radio-group v-model="dateTypeChoose">
          <el-radio :label="1">按月查看</el-radio>
          <el-radio :label="2">按年查看</el-radio>
        </el-radio-group>
      </div>
      <span class="title">时间：</span>
      <el-date-picker
        v-model="querySearch.startTime"
        size="small"
        :type="timeType"
        placeholder="请选择开始时间"
        :picker-options="startOptions"
        :value-format="timeFormData"
      />
      ~
      <el-date-picker
        v-model="querySearch.endTime"
        size="small"
        :type="timeType"
        placeholder="请选择结束时间"
        :picker-options="endOptions"
        :value-format="timeFormData"
      />
      <!-- <span>月份</span> -->
      <!-- <div v-show="dateTypeChoose == 1"> -->

      <!-- <div class="date_select"> -->
      <!-- <el-date-picker
            v-model="querySearch.reportTime"
            size="small"
            align="right"
            type="monthrange"
            placeholder="选择月份"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
          /> -->
      <!-- </div> -->
      <!-- </div> -->
      <!-- <div v-show="dateTypeChoose == 2">
        <div class="date_select">
          <el-date-picker
            v-model="querySearch.startTime"
            size="small"
            align="right"
            type="year"
            style="width:120px"
            clearable
            placeholder="请选择开始年"
          />
          至
          <el-date-picker
            v-model="querySearch.endTime"
            size="small"
            align="right"
            type="year"
            style="width:120px"
            clearable
            placeholder="请选择结束年"
          />
        </div>
      </div> -->
      <el-button size="small" style="margin-left: 5px;" type="primary" @click="getTroubleTrendAnalysisData()"
        >查询</el-button
      >
      <el-button size="small" style="margin-left: 10px;" type="primary" @click="handleDown()">导出</el-button>
    </div>
    <div id="pdfDom" class="pdfDom">
      <div class="box-hander">
        <div class="box-icon" />
        <div class="box-title">{{ chartTitle }}</div>
      </div>
      <div id="troubleTrendAnalysisChart" class="troubleTrendAnalysisChart" />
      <div class="box-hander">
        <div class="box-icon" />
        <div class="box-title">{{ tableTitle }}</div>
      </div>
      <div class="statistics">
        <el-table
          ref="table1"
          border
          style="width: 100%;"
          :summary-method="getTotal"
          show-summary
          :data="reportData"
          :header-cell-style="{ height: '36px', fontSize: '14px', color: '#333333', 'text-align': 'center' }"
          :cell-style="{ height: '30px', fontSize: '14px', color: '#333333' }"
          :span-method="objectSpanMethod"
        >
          <template slot="empty">
            <img src="@/assets/icon/null.png" alt="" />
          </template>
          <el-table-column prop="index" label="序号" width="80" align="center" />
          <el-table-column prop="troubleTypeName" label="隐患类型" align="left" />
          <el-table-column prop="typeName" label="" width="80" align="left" />
          <el-table-column
            v-for="item in tableColumns"
            :key="item.prop"
            :align="item.align"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
          />
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
import { reportTroubleTrendAnalysis, getHiddenDangerReason } from '@/api/xjHiddenDangerManageApi'
import html2pdf from '@/utils/html2pdf'
import { noDataHtmlTemplate } from '@/utils/constant'
Vue.use(html2pdf)

export default {
  name: 'TroubleTrendAnalysis',
  components: {},
  props: ['data'],
  data() {
    return {
      layerId: 17, // 片区图层id
      pointPlaces: [], // 码表 => 片区
      reasons: [], // 码表 => 隐患原因
      timeType: 'month',
      timeFormData: 'yyyy-MM',
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
      chartTitle: '', // 图表标题
      tableTitle: '', // 列表标题

      // 查询条件
      querySearch: {
        pointPlace: '', // 片区
        toubleType: '', // 隐患原因
        // reportTime: undefined, // 起止时间
        // startTime: undefined, // 开始年
        // endTime: undefined, // 结束年
        startTime: '',
        endTime: ''
      },
      dateTypeChoose: 1, // 日期类型:1=>按月，2=按年

      reportData: [], // Table列表
      tableColumns: [], // Table => Column
      // 提交请求
      postSearch: {
        regionCodeList: '', // 片区
        toubleType: '', // 隐患原因
        startDate: '', // 开始时间
        endDate: '', // 结束时间
        dateType: 1 // 时间类型,0年,1月
      },

      // 日期筛选信息
      date_select: {
        value: ''
      },

      queryData: {}, // 将要进行查询的对象

      myChart: undefined // 图表
    }
  },
  watch: {
    dateTypeChoose(newVal, oldVal) {
      var that = this
      if (newVal == '1') {
        //月份
        that.postSearch.dateType = '1'
        this.timeType = 'month'
        this.timeFormData = 'yyyy-MM'
      } else {
        //年份
        this.timeType = 'year'
        this.timeFormData = 'yyyy'
        that.postSearch.dateType = '0'
      }
      that.getInitData() // 切换时，计算初始化时间
      that.getTroubleTrendAnalysisData() // 切换时,初始化表格、Echart图表
      // this.drawChartLine();
    }
  },
  mounted() {
    this.getPartArea() // 获取片区
    this.getDangerReason() // 获取隐患原因
    this.getInitData() // 初始化起止时间
    this.getTroubleTrendAnalysisData() // 获取隐患趋势列表
  },
  destroyed() {
    console.log('实例销毁完成')
  },
  methods: {
    /* --------------------- 地图相关 ---------------*/
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
            for (const item of data) {
              this.pointPlaces.push(item.attributes)
            }
          },
          error: (error) => this.$message.error(error)
        })
      })
    },

    /* ---------------------- 界面相关 -------------------- */
    /**
     * @description 合并单元格
     */
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        // 列号为0时，合并两行一列
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
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

    /* --------------------- API相关 ---------------*/
    /**
     * @description 获取隐患趋势列表
     */
    getData() {
      var that = this
      // 设置
      that.postSearch.regionCodeList = that.querySearch.pointPlace.join(',')
      that.postSearch.toubleType = that.querySearch.toubleType.join(',')
      that.postSearch.deptId = that.$store.state.user.departmentId
      that.dateDiff()
      // console.log('查询条件：' + JSON.stringify(that.postSearch))
      if (that.strIsNull(this.querySearch.startTime) || that.strIsNull(this.querySearch.endTime)) {
        that.$message.error('请输入时间区间!')
        return
      }

      // chart 数据源
      var chartSoures = []
      var xAxis = ['时间']
      var series = []

      // Table 表格 的 Column 列
      that.tableColumns = []
      var monthAry = that.getDiffYearMonth(that.postSearch.startDate, that.postSearch.endDate)
      monthAry.forEach((element) => {
        that.tableColumns.push({
          align: 'center',
          width: '120',
          label: element + '',
          prop: 'column_' + element
        })
        xAxis.push(element)
      })

      chartSoures.push(xAxis)

      that.reportData = []

      reportTroubleTrendAnalysis(that.postSearch).then((res) => {
        if (res.code !== 1) {
          that.$message.error('获取隐患趋势报表出错!')
          return
        }
        // console.log("相差月份："+ that.monDiff())

        var groupTrouble = that.arrayGroupTrouble(res.result)
        // console.log("分组后的字符："+ JSON.stringify(groupTrouble))
        var rowindex = 0
        // for(var i=0;i<groupTrouble.length;i++){
        // // groupTrouble.forEach((itemTrouble,rowindex) => {
        //   var _index = i + 1;

        //   var itemTrouble = groupTrouble[i]

        //   that.reportData.push({
        //     index: _index,
        //     typeName: '数量(个)',
        //     troubleTypeName: itemTrouble.troubleTypeName
        //   })

        //   that.reportData.push({
        //     index: _index,
        //     typeName: '占比(%)',
        //     troubleTypeName: itemTrouble.troubleTypeName
        //   })
        //   rowindex+=2

        //   for(var j=0;j<monthAry.length;j++){
        //     var menth = monthAry[j]+""
        //       that.reportData[rowindex-2][menth] = menth
        //       that.reportData[rowindex-1][menth] = menth
        //       console.log("循环"+ i+"  "+menth)
        //   }
        // }

        groupTrouble.forEach((itemTrouble, itemIndex) => {
          var _index = itemIndex + 1
          var itemAry = itemTrouble.data

          series = []
          series.push(itemTrouble.troubleTypeName)

          that.reportData.push({
            index: _index,
            typeName: '数量(个)',
            troubleTypeName: itemTrouble.troubleTypeName
          })

          that.reportData.push({
            index: _index,
            typeName: '占比(%)',
            troubleTypeName: itemTrouble.troubleTypeName
          })
          rowindex += 2

          monthAry.forEach((menth) => {
            var monthData = itemAry.filter(function(item, index, array) {
              var dataStr = ''
              if (that.dateTypeChoose == '2') {
                dataStr = item.analysisDate
              } else {
                var dataAry = item.analysisDate.replace('/', '-').split('-')
                dataStr = dataAry[0] + '-' + (parseInt(dataAry[1]) > 10 ? '0' + dataAry[1] : dataAry[1])
              }
              return dataStr == menth
            })
            var column_month = 'column_' + menth
            if (monthData.length == 0) {
              that.reportData[rowindex - 2].analysisDate = menth
              that.reportData[rowindex - 2][column_month] = ''

              that.reportData[rowindex - 1].analysisDate = menth
              that.reportData[rowindex - 1][column_month] = ''
            } else {
              monthData.forEach((rowData, index) => {
                that.reportData[rowindex - 2].analysisDate = menth
                that.reportData[rowindex - 2][column_month] = rowData.num

                that.reportData[rowindex - 1].analysisDate = menth
                that.reportData[rowindex - 1][column_month] = rowData.rate
              })
            }

            var chartVal = 0
            if (!that.strIsNull(that.reportData[rowindex - 2][column_month])) {
              chartVal = that.reportData[rowindex - 2][column_month]
            }
            series.push(chartVal)
          })

          chartSoures.push(series)
        })

        // console.log("列表数据："+JSON.stringify(that.reportData))
        // console.log("图表数据："+JSON.stringify(chartSoures))

        if (that.strIsNull(that.reportData)) {
          const html = noDataHtmlTemplate
          const chartDom = document.getElementById('troubleTrendAnalysisChart')
          chartDom.innerHTML = html
          chartDom.removeAttribute('_echarts_instance_')
        } else {
          that.drawChartLine(chartSoures)
        }
      })
    },

    /**
     * @description 码表 => 获取隐患原因
     */
    getDangerReason() {
      getHiddenDangerReason().then((res) => {
        this.reasons = res.result.records
      })
    },

    /**
     * @description 按钮 => 查询
     */
    getTroubleTrendAnalysisData() {
      this.getData()
    },

    /**
     * @description 按钮 => 导出
     */
    handleDown() {
      this.getPdf(this.chartTitle)
    },

    /**
     * @description 获取/设置初始时间
     */
    getInitData() {
      var that = this
      var date = new Date()
      if (this.dateTypeChoose == '2') {
        var currentYear = parseInt(date.getFullYear())
        // console.log("值："+currentYear-5)
        // 开始时间
        var binDate = new Date(currentYear - 4, 0, 1)
        // 结束时间
        var endDate = new Date(currentYear, 11, 31)

        that.querySearch.startTime = binDate
        that.querySearch.endTime = endDate
      } else {
        // 开始时间
        var binDate = new Date(date.getFullYear(), 0, 1)
        // 结束时间
        var currentMonth = date.getMonth()
        var nextMonth = ++currentMonth
        var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
        var oneDay = 1000 * 60 * 60 * 24
        var endDate = new Date(nextMonthFirstDay - oneDay)
        // 赋值
        var binDateStr = binDate.getFullYear() + '-' + this.getMonthOrDay(binDate.getMonth() + 1)
        var endDateStr = endDate.getFullYear() + '-' + this.getMonthOrDay(endDate.getMonth() + 1)
        ;[this.querySearch.startTime, this.querySearch.endTime] = [binDateStr, endDateStr]
        // that.querySearch.reportTime = [binDate, endDate]
      }
    },

    /**
     * @description 计算开始、结束时间
     */
    dateDiff() {
      if (this.dateTypeChoose == '1') {
        if (!this.querySearch.startTime || !this.querySearch.endTime) {
          this.postSearch.startDate = ''
          this.postSearch.endDate = ''
          return
        }
        if (this.querySearch.startTime && this.querySearch.endTime) {
          if (this.querySearch.startTime || this.querySearch.endTime) {
            var bintime = new Date(this.querySearch.startTime)
            var bindate = this.querySearch.startTime + '-' + this.getMonthOrDay(bintime.getDate())
            this.postSearch.startDate = bindate + ' 00:00:00'
            // 处理时间
            var endTime = new Date(this.querySearch.endTime)
            var enddate = this.querySearch.endTime + '-' + this.getMonthOrDay(endTime.getDate())
            this.postSearch.endDate = enddate + ' 23:59:59'
            this.postSearch.endDate = this.getNextTime(this.postSearch.endDate)
            this.postSearch.endDate = this.getNextTime(enddate + ' 23:59:59')
            endTime = new Date(this.postSearch.endDate)
            // 图表标题
            this.chartTitle =
              '隐患月趋势分析-' +
              bintime.getFullYear() +
              '年' +
              (bintime.getMonth() + 1) +
              '月~' +
              endTime.getFullYear() +
              '年' +
              (endTime.getMonth() + 1) +
              '月'
            this.tableTitle =
              '隐患月趋势分析-' +
              bintime.getFullYear() +
              '年' +
              (bintime.getMonth() + 1) +
              '月' +
              bintime.getDate() +
              '日~' +
              endTime.getFullYear() +
              '年' +
              (endTime.getMonth() + 1) +
              '月' +
              endTime.getDate() +
              '日'
          }
        }
      } else {
        if (this.strIsNull(this.querySearch.startTime) || this.strIsNull(this.querySearch.endTime)) {
          this.postSearch.startDate = ''
          this.postSearch.endDate = ''
        } else {
          var bintime = new Date(this.querySearch.startTime)
          var endTime = new Date(this.querySearch.endTime)

          this.postSearch.startDate = bintime.getFullYear() + '-01-01 00:00:00'
          this.postSearch.endDate = endTime.getFullYear() + '-12-31 23:59:59'
          this.chartTitle = '隐患年趋势分析-' + bintime.getFullYear() + '年~' + endTime.getFullYear() + '年'
          this.tableTitle = '隐患年趋势分析-' + bintime.getFullYear() + '年~' + endTime.getFullYear() + '年'
        }
      }
    },

    /**
     * @description 计算相差月份
     */
    monDiff() {
      var diffMonth = 0

      if (!this.querySearch.startTime && !this.querySearch.endTime) {
        return diffMonth
      }
      if (this.querySearch.startTime) {
        var startTime = this.querySearch.startTime
        var endTime = this.querySearch.endTime
        var date2Mon = 0
        var startDate = startTime.getDate() + startTime.getHours() / 24 + startTime.getMinutes() / 24 / 60
        var endDate = endTime.getDate() + endTime.getHours() / 24 + endTime.getMinutes() / 24 / 60
        if (endDate >= startDate) {
          date2Mon = 0
        } else {
          date2Mon = -1
        }

        diffMonth =
          (endTime.getYear() - startTime.getYear()) * 12 + endTime.getMonth() - startTime.getMonth() + date2Mon + 1
      } else {
        diffMonth = 0
      }
      return diffMonth
    },

    /**
     * @description 获取时间区间的月份
     */
    getDiffYearMonth(start, end) {
      var that = this
      var result = []
      var starts = start.split('-')
      var ends = end.split('-')
      var staYear = parseInt(starts[0])
      var endYear = parseInt(ends[0])

      if (that.dateTypeChoose == 1) {
        var staMon = parseInt(starts[1])
        var endMon = parseInt(ends[1])
        while (staYear <= endYear) {
          if (staYear === endYear) {
            while (staMon <= endMon) {
              var str = staYear + '-' + (staMon >= 10 ? staMon : '0' + staMon)
              result.push(str)
              staMon++
            }
            staYear++
          } else {
            var str = staYear + '-' + (staMon >= 10 ? staMon : '0' + staMon)
            result.push(str)
            staMon++
            if (staMon > 12) {
              staMon = 1
              staYear++
            }
          }
        }
      } else {
        while (staYear <= endYear) {
          var str = staYear
          result.push(str)
          staYear++
        }
      }
      // console.log(result)
      return result
    },

    /**
     * @description 组合当前分组用户信息
     */
    arrayGroupTrouble(aryList) {
      const map = {}

      for (let i = 0; i < aryList.length; i++) {
        const ai = aryList[i]
        if (!map[ai.troubleTypeName]) {
          map[ai.troubleTypeName] = [ai]
        } else {
          map[ai.troubleTypeName].push(ai)
        }
      }
      const res = []
      Object.keys(map).forEach((key) => {
        res.push({
          troubleTypeName: key,
          data: map[key]
        })
      })
      return res
    },

    /**
     * @description 判断数组是否为空
     */
    arrayIsNull(aryList) {
      return typeof aryList === 'undefined' || aryList == null || aryList.length == 0
    },

    /**
     * @description 判断字符串是否为空
     */
    strIsNull(strVal) {
      strVal = strVal || ''
      return typeof strVal === 'undefined' || strVal == null || strVal == ''
    },

    /**
     * @description 绘制图表
     */
    drawChartLine(sourceAry) {
      var that = this

      var seriesAry = []
      if (sourceAry.length > 1) {
        for (var i = 0; i < sourceAry.length - 1; i++) {
          seriesAry.push({ type: 'line', smooth: true, seriesLayoutBy: 'row' })
        }
      }
      // 基于准备好的dom，初始化echarts实例
      that.myChart = echarts.init(document.getElementById('troubleTrendAnalysisChart'))
      // 绘制图表
      const option = {
        legend: {
          bottom: 0
        },
        //     title: {
        //         text: chartTitle,
        //         left: 'center',
        //   textStyle: {
        //     // color: 'rgb(46, 199, 201)'
        //     color: 'black'
        //   }
        // },
        tooltip: {
          trigger: 'axis',
          showContent: true
        },
        dataset: {
          source: sourceAry
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          gridIndex: 0,
          name: '隐患类型个数（个）',
          axisLine: {
            lineStyle: {
              type: 'solid',
              color: 'rgb(46, 199, 201)', // 左边线的颜色
              width: '1' // 坐标线的宽度
            }
          }
        },
        grid: { top: '20%' },
        series: seriesAry
      }
      that.myChart.setOption(option, true)
      // 自定义缩放
      window.addEventListener('resize', () => {
        if (that.myChart) {
          that.myChart.resize()
        }
      })
    },

    /**
     * @description 合计
     */
    getTotal(param) {
      const { columns, data } = param
      const sums = []

      console.log('参数：' + JSON.stringify(columns) + '  ' + JSON.stringify(data))

      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map((item) => Number(item[column.property]))
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr, currentIndex) => {
            if (currentIndex % 2 == 0) {
              console.log('参数：' + curr, '索引：' + currentIndex)
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            } else {
              return prev
            }
          }, 0)
          sums[index] += ''
        } else {
          sums[index] = ''
        }
      })

      return sums
    },
    // 获取下个月的全日期
    getNextTime(time) {
      const nextMonthString = time.split('-')[0] + '-' + (parseInt(time.split('-')[1]) + 1) + '-01'
      const date = new Date(new Date(nextMonthString) - 8.64e7)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      return year + '-' + month + '-' + day + ' 23:59:59'
    }
  }
}
</script>

<style lang="scss" scoped>
.troubleTrendAnalysis {
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
  .troubleTrendAnalysisChart {
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
}
</style>
