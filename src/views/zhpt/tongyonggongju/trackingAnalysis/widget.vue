<template>
  <!-- 追踪分析 -->
  <div class="panel-container i-scrollbar">
    <div class="op-box">
      <el-button type="primary" size="small" style="width:100%" @click="selectPipe" :loading="loading">选择分析管线</el-button>
    </div>
    <!-- 分析结果 -->
    <div class="result-box">
      <div class="item-head">分析管线
        <el-tooltip class="item" effect="dark" content="选择一段管线，追踪该管线的起点方向和止点方向相连的管线" placement="top">
          <span class="el-icon-info" style="float: unset; font-weight: normal;"></span>
        </el-tooltip>
      </div>
      <div class="result-description">
        <div class="result-title" v-cloak>{{selectPipelineInfo.name}}</div>
        <div v-cloak style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{selectPipelineInfo.position}}</div>
      </div>
    </div>
    <div class="op-box">
      <div class="item-head" style="margin-top:0">追踪距离
        <el-tooltip class="item" effect="dark" content="设置追踪的距离" placement="top">
          <span class="el-icon-info" style="float: unset; font-weight: normal;"></span>
        </el-tooltip>
      </div>
      <el-form label-width="auto">
        <el-form-item label="追踪距离(米)" style="margin:0">
          <el-input-number size="small" v-model="distence" controls-position="right" :step="10" :min="10" style="width:100%">
          </el-input-number>
        </el-form-item>
      </el-form>
    </div>
    <div class="op-box">
      <el-button type="primary" size="small" style="width:100%" @click="doQuery()" :loading="doLoading">追踪分析</el-button>
    </div>
    <!-- 表格 -->
    <div class="table-chart">
      <div class="item-head">追踪结果</div>
      <div class="table-container">
        <el-table ref="resultTable" :data="queryResult" stripe :row-key="getRowKeys" :expand-row-keys="[0]" v-loading="doLoading"
                  :header-cell-style="{fontSize: '14px', fontWeight:'600',background:'#eaf1fd',color:'#909399'}" style="width: 100%">
          <el-table-column align="center" type="expand" width="1">
            <template slot-scope="props">
              <transition name="el-zoom-in-top">
                <div :id="'t-chart'+props.$index" class="chart-box"></div>
              </transition>
            </template>
          </el-table-column>
          <el-table-column label="结果" align="center">
            <template slot-scope="scope"><span>结果{{scope.$index+1}}</span></template>
          </el-table-column>
          <el-table-column label="管段数量" align="center">
            <template slot-scope="scope"><span>{{scope.row.features.features.length}}个</span></template>
          </el-table-column>
          <el-table-column label="管点数量" align="center">
            <template slot-scope="scope"><span>{{scope.row.facilities.features.features.length}}个</span></template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click.stop="expendRow(scope.row)">查看</el-button>
              <!-- <download-excel style="display: inline-block;" :data="scope.row.data" :fields="scope.row.fields" type="xls"
                              :name="scope.row.name">
                <el-button type="text">导出</el-button>
              </download-excel> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="op-box" style="padding-bottom:40px">
      <el-button type="danger" size="small" style="width:100%" @click="clearResult()">清除结果</el-button>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { mapConfig } from '@/views/zhpt/map.config'
import { SuperMap, FeatureService } from '@supermap/iclient-ol';
import { GeoJSON } from 'ol/format';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Style, Circle, Icon, Fill, RegularShape, Stroke, Text } from 'ol/style';
import { unByKey } from 'ol/Observable';

import { trackingAnalysis } from '@/api/mainMap/analysis'
import { async } from 'q';
export default {
  props: ['data'],
  data() {
    return {
      doLoading: false,
      selectFlag: false,
      selectPipeline: null,
      selectInfo: null,
      selectPipelineInfo: {
        name: '',
        position: ''
      },
      distence: 50,
      vectorLayer: null,
      queryResult: []
    }
  },
  computed: {
    // 获取点击查询状态
    loading() {
      if (this.selectFlag)
        if (this.data.that.queryByClick.querying)
          return this.data.that.queryByClick.querying
        else return false
      else return false
    },
    // 获取点击查询结果
    resultInfo() {
      return this.data.that.queryByClick.resultInfo
    }
  },
  watch: {
    // 监听面板是否被改变
    '$store.state.map.P_editableTabsValue': function (val, oldVal) {
      if (val == 'trackingAnalysis') {
        this.vectorLayer.setVisible(true)
      }
      else {
        this.data.that.popupWindowClose() // 清除地图视图点击选择的要素,关闭弹窗
        this.vectorLayer.setVisible(false)
        this.selectFlag = false
      }
    },
    loading(val, oldVal) {
      if (this.selectFlag && !val) {
        // 点击查询结束
        // console.log('zz分析点击查询结束', this.resultInfo)
        if (!this.resultInfo) {
          this.$message.error('未选中管线！')
        }
        else {
          this.selectInfo = JSON.parse(JSON.stringify(this.resultInfo))
          this.loadSelectPipe(this.selectInfo)
        }
      }
    }
  },
  destroyed() {
    this.data.that.popupWindowClose() // 清除地图视图点击选择的要素,关闭弹窗
    this.data.that.map.removeLayer(this.vectorLayer)
  },
  mounted() {
    this.vectorLayer = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        stroke: new Stroke({
          width: 5,
          color: '#ed1941'
        }),
        image: new Circle({
          radius: 6,
          stroke: new Stroke({
            width: 2,
            color: '#ed1941'
          }),
          fill: new Fill({
            color: '#FFF'
          })
        })
      })
    })
    this.data.that.map.addLayer(this.vectorLayer)
  },
  methods: {
    loadSelectPipe(selectPipeline) {
      this.selectPipelineInfo = {
        name: '选择管线：' + selectPipeline.feature.dataType.label + '-' + selectPipeline.feature.properties.SID,
        position: "坐标：" + parseFloat(selectPipeline.coordinate[0]).toFixed(3) + ',' + parseFloat(selectPipeline.coordinate[1]).toFixed(3)
      }
      this.vectorLayer.getSource().clear()
      this.showReswultInMap(null) // 显示选中管线
    },
    /**
     * 选择管线
     * 这里选择管线直接调用的主页面地图气泡查询
     */
    selectPipe() {
      this.clearResult()
      this.selectFlag = true // 开启选择
      this.data.that.map.getView().animate({ zoom: 20 });
    },
    // 确定table的row唯一的key值
    getRowKeys(row) {
      return row.id
    },
    /**
     * 开始分析
     */
    async doQuery() {
      if (!this.selectInfo) {
        this.$message.error("还未选择管线，不能进行分析！")
        return
      }
      this.doLoading = true // 开始查询
      this.selectFlag = false
      let data = {
        pipeLength: this.distence,
        dataSetName: this.selectInfo.feature.dataType.name,
        pipePointNo: this.selectInfo.feature.properties.SMID
      }
      let resultTable = []
      let result = null
      await trackingAnalysis(data).then(res => {
        result = res.result;
      })// 接口返回结果
      for (const key in result) {
        await this.queryPipes(result[key].pathValue).then(async res => {
          await this.queryPoint(res.features.features).then(res2 => {
            res['facilities'] = res2
            res['id'] = resultTable.length
          })
          resultTable.push(res)
        })
      }
      this.queryResult = resultTable
      // 查询完成默认第一个图表渲染
      this.$nextTick(() => {
        this.expendRowData(resultTable[0])
        // 显示相连管线，相连管点
        this.showReswultInMap(resultTable[0])
      })
      console.log('输出：查询完成')
      this.vectorLayer.getSource().clear()
      this.doLoading = false
      this.data.that.popupWindowClose() // 清除地图视图点击选择的要素,关闭弹窗
    },
    /**
     * 查询连接的管线参数
     */
    queryPipesParams(edges) {
      let str = "("
      for (var i = 0; i < edges.length; i++) {
        if (i != edges.length - 1) str += edges[i].smid + ","
        else str += edges[i].smid + ")"
      }
      let sqlQueryParam = new SuperMap.GetFeaturesBySQLParameters({
        toIndex: -1,
        maxFeatures: 10000000,
        datasetNames: [mapConfig.iServerUrl.pipelineDataServer.dataSource + ':'
          + this.selectInfo.feature.dataType.name],
        queryParameter: { attributeFilter: "SMID in " + str }
      })
      return sqlQueryParam
    },
    /**
     * 查询连接的管线要素
     */
    queryPipes(edges) {
      let sqlQueryParam = this.queryPipesParams(edges)
      let url = mapConfig.iServerUrl.pipelineDataServer.url
      return new Promise((resolve) => {
        //向服务器发送请求，并对返回的结果进行处理
        new FeatureService(url).getFeaturesBySQL(sqlQueryParam, serviceResult => {
          if (serviceResult.type != "processCompleted") {
            Message.error(layer.name + "查询失败！")
            this.loading = false
          }
          resolve(serviceResult.result);
        })
      });
    },
    /**
     * 查询设施点
     * 说明：这里用管段的起止点编号进行SQL查询
     * 设施点的编号与管段的起止点编号相同
     */
    queryPoint(pipeFeatures) {
      let str = "("
      for (var i = 0; i < pipeFeatures.length; i++) {
        let item = pipeFeatures[i].properties;
        if (i != pipeFeatures.length - 1) str += "'" + item.START_SID + "','" + item.END_SID + "',"
        else str += "'" + item.START_SID + "','" + item.END_SID + "')"
      }
      let sqlQueryParam = new SuperMap.GetFeaturesBySQLParameters({
        toIndex: -1,
        maxFeatures: 10000000,
        datasetNames: [mapConfig.iServerUrl.pipelineDataServer.dataSource + ':'
          + this.selectInfo.feature.dataType.attachName],
        queryParameter: { attributeFilter: "SID in " + str }
      })
      let url = mapConfig.iServerUrl.pipelineDataServer.url

      return new Promise((resolve) => {
        //向服务器发送请求，并对返回的结果进行处理
        new FeatureService(url).getFeaturesBySQL(sqlQueryParam, serviceResult => {
          if (serviceResult.type != "processCompleted") {
            Message.error(layer.name + "查询失败！")
          }
          resolve(serviceResult.result);
        })
      });
    },
    /**
     * 展开表格行数据事件
     */
    expendRow(row) {
      this.queryResult.forEach(item => {
        if (row.id != item.id) {
          this.$refs.resultTable.toggleRowExpansion(item, false)
        }
      });
      this.$refs.resultTable.toggleRowExpansion(row)
      // 图表渲染
      this.$nextTick(() => {
        this.expendRowData(row)
        this.vectorLayer.getSource().clear()
        // 显示相连管线，相连管点
        this.showReswultInMap(row)
      })
    },
    /**
   * 展开显示行数据显示
   */
    expendRowData(row) {
      let features = row.facilities.features.features; // 设施要素
      let facilityTypeObj = {}
      features.forEach(feature => {
        let subtype = feature.properties.SUBTYPE.replace(/\s*/g, "")
        let adjunct = feature.properties.ADJUNCT.replace(/\s*/g, "")

        if (subtype) {
          if (facilityTypeObj.hasOwnProperty(subtype))
            facilityTypeObj[subtype].push(feature)
          else
            facilityTypeObj[subtype] = [feature]
        } else {
          if (adjunct) {
            if (facilityTypeObj.hasOwnProperty(adjunct))
              facilityTypeObj[adjunct].push(feature)
            else
              facilityTypeObj[adjunct] = [feature]
          } else {
            if (facilityTypeObj.hasOwnProperty('其他'))
              facilityTypeObj["其他"].push(feature)
            else
              facilityTypeObj["其他"] = [feature]
          }
        }
      });
      let yAxisData = []
      let seriesData = []
      for (const key in facilityTypeObj) {
        yAxisData.push(key)
        seriesData.push(facilityTypeObj[key].length)
      }
      let chart = echarts.init(document.getElementById("t-chart" + row.id))
      console.log(yAxisData, seriesData)
      chart.setOption(this.setChartOption(yAxisData, seriesData))
    },
    /**
     * 配置图表参数
     */
    setChartOption(yAxisData, seriesData) {
      return {
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '14%'
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          minInterval: 1,
          data: yAxisData
        },
        series: [
          {
            name: '数量',
            type: 'bar',
            data: seriesData,
            barWidth: 20,
            itemStyle: {
              normal: {
                color: "#49a9ee"
              }
            }
          }
        ]
      };
    },
    /**
     * 展示追踪结果在地图上
     */
    showReswultInMap(result) {
      if (result) {
        this.vectorLayer.getSource().addFeatures(new GeoJSON().readFeatures(result.features))
        this.vectorLayer.getSource().addFeatures(new GeoJSON().readFeatures(result.facilities.features))
        // 定位到地图
        setTimeout(() => {
          this.data.that.map.getView().fit(this.vectorLayer.getSource().getExtent(), { duration: 600 })
        }, 200);
      }
      let sFeature = new GeoJSON().readFeature(this.selectInfo.feature)
      sFeature.setStyle(new Style({
        stroke: new Stroke({
          width: 5,
          color: '#00ffff'
        })
      }))
      this.vectorLayer.getSource().addFeature(sFeature)
    },
    /**清除结果 */
    clearResult() {
      this.data.that.popupWindowClose() // 清除地图视图点击选择的要素,关闭弹窗
      this.vectorLayer.getSource().clear()
      Object.assign(this.$data.selectPipelineInfo, this.$options.data().selectPipelineInfo) // 清空选择管线信息
      this.distence = 50
      this.queryResult = []
      this.selectFlag = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

@import './css.scss';
.i-scrollbar {
  overflow: auto;
  @include scrollBar;
}
</style>