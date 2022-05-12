<template>
  <div style="width: 100%; height: 100%; padding:8px;">       
    <el-row>
      <span class="title2">管网片区：</span>
      <el-select size="small" @change="getList" style="display: inline-block; width:200px;" multiple collapse-tags v-model="area_select.value" clearable placeholder="请选择">
        <el-option v-for="item in area_select.options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-radio-group v-model="timeType"  style="padding-left:40px;padding-right:40px" size="small">
        <el-radio label="1">按日</el-radio>
        <el-radio label="2">按月</el-radio>
        <el-radio label="3">按年</el-radio>
      </el-radio-group>
      <!-- <div style="width:1px;height:100%;display:inline-block;margin: 0 20px;background:#C0C4CC; height: 28px; vertical-align: middle;"></div> -->
      <span class="title2">时间：</span>
      <el-date-picker v-model="startTime"  @change="getList" size="small" :type="dateType" placeholder="请选择开始时间" :picker-options="startOptions" :value-format="dateFormData"/>
      <span v-show='this.endShow'> ~</span>
      <el-date-picker v-show='this.endShow' @change="getList" size="small" v-model="endTime"  :type="dateType" placeholder="请选择结束时间" :picker-options="endOptions" :value-format="dateFormData"/> 
      <!-- <div style="display: inline-block; margin-left: 5px; width:300px;">
        <el-date-picker v-if="timeType == '1'" v-model="dateRange" type="daterange" size="small"
          style="width: 100%;" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" align="right" value-format="yyyy-MM-dd"/>
        <el-date-picker v-if="timeType == '2'" v-model="monthRage" type="monthrange" size="small"
          style="width: 100%;" range-separator="至" start-placeholder="开始月份"
          end-placeholder="结束月份" placeholder="选择月份" align="right" value-format="yyyy-MM"/>
        <el-date-picker v-if="timeType == '3'" v-model="year" type="year" size="small"
          style="width: 100%;" placeholder="选择年份" align="right" value-format="yyyy"/>
      </div> -->
      <el-button size="small" type="primary" @click="getList">查询</el-button>
      <!-- <el-button size="small" type="primary" v-print="'#pdfDom'" >导出</el-button> -->
      <export-btn table-id="repairTypeTable" :file="title"></export-btn>
    </el-row>
    <div style="width:100%;height:100%;" v-loading="loading" id="pdfDom">
      <div style="width:100%;height:100%;float:left;transition: 0.3s;" ref="leftDiv">
			  <h3 style=" height: 16px; line-height: 16px; font-size: 16px; text-align: center; margin-bottom: 15px;">{{title}}</h3>
        <el-table id="repairTypeTable" height="calc(100% - 20px)" class="mapTable" :data="tableData" border stripe :cell-style="{height: '30px', fontSize: '14px', color: '#333333'}" :header-cell-style="{height:'50px', fontSize: '14px', color: '#333333'}" style="width: 100%; height: 100%;" max-height="700px">
          <template slot="empty">
            <img src="@/assets/icon/null.png" alt="">
            <p class="empty-p">暂无数据</p>
          </template>
          <el-table-column type="index" width="50" align='center'   label="序号" />
          <el-table-column prop="typeName" :show-overflow-tooltip='true' label="维修类型" align="center">
          </el-table-column>
          <el-table-column prop="typeNum" :show-overflow-tooltip='true' label="数量" align="center">
          </el-table-column>
          <el-table-column prop="unit"  :show-overflow-tooltip='true' label="单位" align="center">
          </el-table-column>
        </el-table>
      </div>
      <div v-show="this.tableData.length>0" style="width:0;height:100%;float:left;transition: 0.3s;" ref="echartDiv" >
        <div style="width:100%;height:100%;" ref="pieCharts" ></div>
      </div>
    </div>
  </div>
</template>
<script>
import request from '@/utils/request'
import { esriConfig, appconfig } from 'staticPub/config'
import tfLegend from '@/views/zhpt/common/Legend'
import Echarts from 'echarts'
import { repairTypeStatistic } from '../api/reportFormApis.js'
import elementResizeDetectorMaker from 'element-resize-detector'
import ExportBtn from '../components/ExportBtn'
// import barImage from './image/bar.png'
// import pieImage from './image/pie.png'
// barImage 
export default {
  name: 'wxWeiXiuLeiXingFenXi',
  components: { tfLegend, ExportBtn },
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
      showPie:true,
      // 区域筛选信息
      area_select: {
        options: [],
        value: []
      },
      // 日期筛选信息
      timeType: '1',
      dateRange: [],
      monthRage: [],
      year: '',
      tableData: [],
      currentPage: 1,
      Echarts,
      title: '维修类型汇总信息表',
      loading: false,
      dateType:'date',
      dateFormData:'yyyy-MM-dd',
      startTime:'',
      endTime:'',
      endShow:true,
      startOptions:{
        disabledDate:time=> {
          if(this.endTime){
            if(this.timeType==1){
              //按天统计
              return time.getTime()+1000*60*60*24 >new Date(this.endTime);
            }else if(this.timeType==2){
              //按月统计
              let end=new Date(this.endTime);
              return time.getTime() >new Date(end.getFullYear()+"-"+(end.getMonth())+"-01")
            }else{
              //按年统计
          
            }
          }
        },
      },
      endOptions:{
        disabledDate:time=> {
          if(this.startTime){
            if(this.timeType==1){
              //按天统计
              return  new Date(this.startTime)>time.getTime();
            }else if(this.timeType==2){
              //按月统计
              let start=new Date(this.startTime);
              return  new Date(start.getFullYear()+"-"+(start.getMonth()+2)+"-01")>time.getTime();
            }else{
              //按年统计
            
            }
          }
        },
      }
    }
  },
  watch:{      
    timeType(){
      if(this.timeType==1){
        this.endShow=true;
				this.dateType='date';
				this.dateFormData='yyyy-MM-dd';
				let currentData=new Date();			
				this.$nextTick(e=>{
					this.endTime=currentData.getFullYear()+"-"+((currentData.getMonth()+1)<10?('0'+(currentData.getMonth()+1)):(currentData.getMonth()+1))+"-"+(currentData.getDate()<10?('0'+currentData.getDate()):currentData.getDate());
					let next=new Date(new Date(currentData.getFullYear()+"-"+(currentData.getMonth()+1)+"-"+currentData.getDate())-24*60*60*1000);
					this.startTime=currentData.getFullYear()+"-"+((currentData.getMonth()+1)<10?('0'+(currentData.getMonth()+1)):(currentData.getMonth()+1))+"-"+'01';
				})
      }else if(this.timeType==2){
				this.endShow=true;
				let currentData=new Date();
				this.dateType='month';
				this.dateFormData='yyyy-MM';
				this.$nextTick(e=>{
					this.endTime=currentData.getFullYear()+"-"+((currentData.getMonth()+1)<10?('0'+(currentData.getMonth()+1)):(currentData.getMonth()+1));
					this.startTime=currentData.getFullYear()+"-"+(currentData.getMonth()<10?('0'+currentData.getMonth()):currentData.getMonth());
				})
      }else{
				this.endShow=false;
				let currentData =new Date();
				this.dateType='year';
				this.dateFormData='yyyy';
				this.$nextTick(e=>{
					this.startTime=currentData.getFullYear()+"";
					this.endTime=(currentData.getFullYear()+1)+"";
				})
      }
      this.$nextTick(e=>{
        this.getList();
      })
    }
  },
  methods: {
    // 获取左侧列表数据
    getList() {
      const data = {
        regionCodeList: this.area_select.value.join(','),
        deptId:this.$store.state.user.departmentId
      };
			switch (this.timeType) {
				case '1':
          if(!this.startTime||!this.endTime) return this.$message.error('请选择统计时间')
					data.startDate = this.startTime + ' 00:00:00'
					data.endDate = this.endTime + ' 23:59:59'
					break
				case '2':
          if(!this.startTime||!this.endTime) return this.$message.error('请选择统计月份')
          data.startDate = this.startTime + '-01 00:00:00';
          let endMonth=parseInt(this.endTime.split('-')[1])+1;
          let endYear=this.endTime.split('-')[0];
          endMonth=endMonth<10?('0'+endMonth):endMonth
					data.endDate = endYear+'-'+endMonth+ '-01 00:00:00'
					break
				case '3':
          if(!this.startTime) return this.$message.error('请选择统计年份')
					data.startDate = this.startTime + '-01-01 00:00:00'
					data.endDate = ~~ this.startTime + 1 + '-01-01 00:00:00'					
					break
			}
      this.loading = true
      repairTypeStatistic(data).then(res => {
        if(res.code == 1) {
          res = res.result
          this.$refs.leftDiv.style.width = res.length > 0 ? '500px' : '100%'
          this.$refs.echartDiv.style.width = res.length > 0 ? 'calc(100% - 500px)' : '0'
          this.drawPieChart(this.tableData = res)
          // 处理数据成echarts需要的结构
          let data = [this.startTime, this.endTime]
          data = data.map( e => e.split('-'))
          this.title = '维修类型汇总信息表(' + {
            '1':() => data.map(e => e[0] + '年' + e[1] + '月' + e[2] + '日'),
            '2':() => data.map(e => e[0] + '年' + e[1] + '月'),
            '3':() =>[data[0][0] + '年'],
          }[this.timeType]().join('~') + ')'
        } else this.$message.error(res.message)        
        this.loading = false
      })
    },
    drawPieChart(echartData) {
      let dataTime = [this.startTime, this.endTime]
      dataTime = dataTime.map( e => e.split('-'))
      let title={
          text:"维修类型汇总分布图("+ {
            '1':() => dataTime.map(e => e[0] + '年' + e[1] + '月' + e[2] + '日'),
            '2':() => dataTime.map(e => e[0] + '年' + e[1] + '月'),
            '3':() =>[dataTime[0][0] + '年'],
          }[this.timeType]().join('~') + ')',
          left: 'center',
          top:'40px'
        };
      let color= [ '#37a2da', '#32c5e9', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#fb7293', '#e7bcf3', '#8378ea' ];
      let legend={
          type: 'plain',
          orient: 'vertical',
          left: '10%',
          align: 'left',
          bottom:'10%',
          textStyle: {
            color: '#8C8C8C'
          },
          height: '100%'
        }
      //饼状图需要的数据
      let tempData1=this.tableData.map(e => { return { value: e.typeNum, name: e.typeName } });
      let pieDataTemp = 
          {
            name: '维修类型占比分析',
            type: 'pie',
            radius: [0, 120],
            center: ['50%', '50%'],
            data: tempData1
          }
        ;
        let pieData=JSON.parse(JSON.stringify(pieDataTemp));
      let initOption={
        color: [ '#37a2da', '#32c5e9', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#fb7293', '#e7bcf3', '#8378ea' ],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        grid:{
          top:'25%',
          left:'15%',
          right:'15%',
          bottom:'25%'
        },
        toolbox: {
          show: true,
          right: '15',
          itemSize: 20,
          feature:{
                  mark: { show: true },
              
                    magicType: { show: true, type: [] },
                    //自定义柱状图
                    myTool1: {
                        show: true,
                        title: '柱状图',
                        icon:`image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAgMAAADXB5lNAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
                              AAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAADFBMVEX///9J0NFJ0NH///++
                              4BXvAAAAAnRSTlMAmf9A5tgAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJ
                              TUUH5gIIExMeNj1IaAAAAElJREFUOMtjYKAx0Fq1agGpAgxMdBZgWrVqFakCC4DcARYAuqmBRIEV
                              DFyjAlQWAAcyOH1AUzJhAdKBaCgycABnGyTQgEWAHgAAseuQL1kXcPMAAAAldEVYdGRhdGU6Y3Jl
                              YXRlADIwMjItMDItMDhUMTE6MTk6MzArMDg6MDATUtU5AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIy
                              LTAyLTA4VDExOjE5OjMwKzA4OjAwYg9thQAAACB0RVh0c29mdHdhcmUAaHR0cHM6Ly9pbWFnZW1h
                              Z2ljay5vcme8zx2dAAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAF3RFWHRU
                              aHVtYjo6SW1hZ2U6OkhlaWdodAA2NLzgqYQAAAAWdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANjRE
                              T2kJAAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1U
                              aW1lADE2NDQyOTAzNzB/1b5uAAAAEnRFWHRUaHVtYjo6U2l6ZQAzMDA0QkKb68CaAAAARnRFWHRU
                              aHVtYjo6VVJJAGZpbGU6Ly8vYXBwL3RtcC9pbWFnZWxjL2ltZ3ZpZXcyXzlfMTY0NDI4MzEwMzg4
                              MTE0ODVfNTdfWzBd9cdLCAAAAABJRU5ErkJggg==`,
                        onclick: e=> {
                                //柱状图需要的数据
                          // let barSerise=this.tableData.map(e => { return {
                          //     name: e.typeName,
                          //     type: 'bar',
                          //     barWidth:"10%",
                          //     data: [e.typeNum],
                          //     label: {
                          //       show: true,
                          //       position: 'top'
                          //     }}});
                          // let barDataTemp={
                          //   xAxis: {
                          //     type: 'category',
                          //     name: '类型',
                          //   },
                          //   yAxis: {
                          //     type: 'value',
                          //     name: '次数',
                          //     margin: 20
                          //   },
                          //   series:barSerise
                          // }
                          let dataTime = [this.startTime, this.endTime]
                          dataTime = dataTime.map( e => e.split('-'))
                          let title={
                            text:"维修类型汇总分布图("+ {
                              '1':() => dataTime.map(e => e[0] + '年' + e[1] + '月' + e[2] + '日'),
                              '2':() => dataTime.map(e => e[0] + '年' + e[1] + '月'),
                              '3':() =>[dataTime[0][0] + '年'],
                            }[this.timeType]().join('~') + ')',
                            left: 'center',
                            top:'40px'
                          };
                          this.showPie=false;
                          initOption.tooltip.formatter=' <br/>{a} : {c}'
                          let barSerise={
                              name: '维修类型占比分析',
                              type: 'bar',
                              barWidth:"20%",
                              data:this.tableData.map(e=>{return e.typeNum}),
                              label: {
                                show: true,
                                position: 'top'
                              }
                          }
                          let barDataTemp={
                            xAxis: {
                              type: 'category',
                              name: '类型',
                              data:this.tableData.map(e=>{return e.typeName})
                            },
                            yAxis: {
                              type: 'value',
                              name: '次数',
                              margin: 20
                            },
                            series:barSerise
                          }
                          delete initOption.legend;
                          let temp=JSON.parse(JSON.stringify(barDataTemp))
                          if(this.tableData.length>4){
                            initOption.dataZoom=[{type: 'inside' }];
                          }
                          initOption.title=title;
                          initOption.series=temp.series;
                          initOption.xAxis = temp.xAxis;
                          initOption.tooltip.formatter='{a} <br/>{b} : {c}'
                          initOption.yAxis = temp.yAxis;
                          this.pieCharts.setOption(initOption, true);
                        }
                    },
                    //自定义饼图
                    myTool2: {
                        show: true,
                        title: '饼图',
                        icon:`image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
                              AAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAABVlBMVEX///9J0NFJ0NFJ0NFJ
                              0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ
                              0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ
                              0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ
                              0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ
                              0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ
                              0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NFJ0NH////6OsyHAAAAcHRSTlMA
                              tPflyKF5QgqzWwntgBLyBtc8ASFEXnD7dyu78cOsBwxu0r4OfOy9VeOwEK94NN87RvNN+T71EfB/
                              zOuJUyz6v/a6eyP+p9XmGoSQudr971hfRSB6tfRzKVTLbOQNV/yxNcBQCK4/AiKKgT2p2JFcHi+L
                              PwAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfmAggTFSM4D6P/AAAB
                              5ElEQVRYw+XWV1fCMBiA4YpaFJHpQFGrMkURRAHFCQKCC/ceuBXX9/+vBEFJadMm6Tne+F3nfc5p
                              mg6O+w/TpGtuaeX1bewAfI+u3dChCSiPsdOkDQAw8xZtAIDVRlbZu7p7eg0yADj67Kp1P+8cqKwd
                              lAMAhgTFenhk9GclBgCXWyH3eOsLcQD4sFvpH0PXYQEIyO/D+IR4GR6AoFw/GQJiwBGW9lMRIAfA
                              KtmG6RmgASQXEY0BHWCOi/quWaAEYA7tLQmgBubRA7kA9AAs1vulZRYgUAdWgAVI/r6hosAEgP4H
                              SDECq7U+nWEEsjVgDhiBRA1YYwVy1T4PrECyChhUgHUndqrAhgqgOptagS2tgFErsK0VwPZQwO//
                              DgIkgWFGECDHAuwiQIIF2EOALAuwjwAHDP0A+m20MQCH6G20HNEDx6KDEKAHTkTAKXV/Jj6KgpEW
                              OG84zJ2UvXe4ATBF6ACP5HniqfqLSwkgWGmAK5lHOnxN3gc4uQkS96G4LGAvEvaxG8x7yeIj6mf0
                              HG7ctwS97o7Dz/2Dal945JTmKehQ7s+eOZWxKZ0Hx4ug1pe3kjfjeteSel4ZU8krU2dSj2R5ZQR/
                              seG311pKk+fVK3ldfUvkyn/fs+/Oj888Zf3H8wWcsrSNg8YpygAAACV0RVh0ZGF0ZTpjcmVhdGUA
                              MjAyMi0wMi0wOFQxMToyMTozNSswODowMMtf3GsAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMDIt
                              MDhUMTE6MjE6MzUrMDg6MDC6AmTXAAAAIHRFWHRzb2Z0d2FyZQBodHRwczovL2ltYWdlbWFnaWNr
                              Lm9yZ7zPHZ0AAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAXdEVYdFRodW1i
                              OjpJbWFnZTo6SGVpZ2h0ADY0vOCphAAAABZ0RVh0VGh1bWI6OkltYWdlOjpXaWR0aAA2NERPaQkA
                              AAAZdEVYdFRodW1iOjpNaW1ldHlwZQBpbWFnZS9wbmc/slZOAAAAF3RFWHRUaHVtYjo6TVRpbWUA
                              MTY0NDI5MDQ5NZRzceoAAAASdEVYdFRodW1iOjpTaXplADM3NzhCQr0G3VcAAABFdEVYdFRodW1i
                              OjpVUkkAZmlsZTovLy9hcHAvdG1wL2ltYWdlbGMvaW1ndmlldzJfOV8xNjQ0MjgxMTgwNzI0MDg2
                              OF85X1swXejrGcEAAAAASUVORK5CYII=`,
                        onclick: e=> {
                            this.showPie=true
                            let tempData1=this.tableData.map(e => { return { value: e.typeNum, name: e.typeName } });
                            let pieDataTemp = 
                                {
                                  name: '维修类型占比分析',
                                  type: 'pie',
                                  radius: [0, 120],
                                  center: ['50%', '50%'],
                                  data: tempData1
                                } ;
                            let dataTime = [this.startTime, this.endTime]
                            dataTime = dataTime.map( e => e.split('-'))
                            let title={
                              text:"维修类型汇总分布图("+ {
                                '1':() => dataTime.map(e => e[0] + '年' + e[1] + '月' + e[2] + '日'),
                                '2':() => dataTime.map(e => e[0] + '年' + e[1] + '月'),
                                '3':() =>[dataTime[0][0] + '年'],
                              }[this.timeType]().join('~') + ')',
                              left: 'center',
                              top:'40px'
                            };    
                            initOption.title=title;   
                            delete initOption.xAxis;
                            delete initOption.yAxis;
                            delete initOption.dataZoom;
                            initOption.tooltip.formatter='{a} <br/>{b} : {c} ({d}%)'
                            initOption.legend=legend;
                            initOption.series=[pieDataTemp];
                            this.pieCharts.setOption(initOption, true);
                        }
                    },
                    saveAsImage:{show:true},
          }
        },
        title:title,
        legend:legend ,
        series: pieData
      }  
      if(!this.showPie){
        initOption.tooltip.formatter=' <br/>{a} : {c}'
        let barSerise={
            name: '维修类型占比分析',
            type: 'bar',
            barWidth:"20%",
            data:this.tableData.map(e=>{return e.typeNum}),
            label: {
              show: true,
              position: 'top'
            }
        }
        let barDataTemp={
          xAxis: {
            type: 'category',
            name: '类型',
            data:this.tableData.map(e=>{return e.typeName})
          },
          yAxis: {
            type: 'value',
            name: '次数',
            margin: 20
          },
          series:barSerise
        }
        delete initOption.legend;
        let temp=JSON.parse(JSON.stringify(barDataTemp))
        if(this.tableData.length>4){
          initOption.dataZoom=[{type: 'inside' }];
        }
        initOption.series=temp.series;
        initOption.xAxis = temp.xAxis;
        initOption.tooltip.formatter='{a} <br/>{b} : {c}'
        initOption.yAxis = temp.yAxis;
      }
      this.pieCharts.setOption(initOption, true)
    }
  },
  mounted() {
    $.ajax({
      url: appconfig.gisResource.business_map.config[0].url + "/17/query?where=1%3D1&outFields=*&returnGeometry=false&f=pjson",
      type: 'GET',
      success: (data) => {
        data = JSON.parse(data)
        this.area_select.options = data.features.map((e) => {
          return {
            label: e.attributes.NAME,
            value: e.attributes.CODE,
          }
        })
      },
      error: (error) => { console.log(error) }
    })
    var myChart1 = this.pieCharts = this.Echarts.init(this.$refs.pieCharts)
    window.onresize = () => this.$nextTick(myChart1.resize)
    elementResizeDetectorMaker().listenTo(this.$refs.echartDiv, () => this.$nextTick(myChart1.resize))
		var date = new Date()
		var year = date.getFullYear()
		var month = date.getMonth() + 1
		var lastmonth = month - 3
		var day = date.getDate()
		if(month < 10) month = '0' + month
    if(day < 10) day = '0' + day;
    this.startTime=year + '-' + month + '-' + '01';
    this.endTime=year + '-' + month + '-' + day;
    this.year = year + '';
    this.$nextTick(e=>{
      this.getList();
    })
  }
}
</script>

<style lang='scss' scoped>
.el-table >>> .el-table__header-wrapper table th{
  height: 60px;
  text-align: center;
}
.el-table >>> .el-table__body-wrapper table td{
  text-align: center;
}
</style>
