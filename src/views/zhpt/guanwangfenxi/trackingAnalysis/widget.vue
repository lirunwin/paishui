<template>
  <!-- 追踪分析 -->
  <div class="panel-container i-scrollbar">
    <div class="op-box">
      <el-button type="primary" size="small" style="width:100%" @click="selectPipe">选择分析管线</el-button>
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
        <div v-cloak style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{selectPipelineInfo.id}}</div>
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
        <el-table ref="resultTable" :data="queryResult" stripe :row-key="getRowKeys" :expand-row-keys="[0]" v-loading="doLoading" :header-cell-style="{fontSize: '14px', fontWeight:'600',background:'#eaf1fd',color:'#909399'}" style="width: 100%">
          <template slot="empty">
            <img src="@/assets/icon/null.png" alt="">
            <p class="empty-p">暂无数据</p>
          </template>
          <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
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
import { appconfig } from 'staticPub/config'
import { SuperMap, FeatureService } from '@supermap/iclient-ol';
import { GeoJSON } from 'ol/format';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Style, Circle, Icon, Fill, RegularShape, Stroke, Text } from 'ol/style';
import { unByKey } from 'ol/Observable';
import { trackingAnalysis } from '@/api/mainMap/analysis'
import iDraw from '@/views/zhpt/common/mapUtil/draw';
import iQuery from '@/views/zhpt/common/mapUtil/query';
import * as turf from '@turf/turf'
import { comSymbol } from '@/utils/comSymbol'

export default {
  props: ['data'],
  data() {
    return {
      doLoading: false,
      selectFlag: false,
      selectPipeline: null,

      distence: 50,
      vectorLayer: null,
      queryResult: [],
      // 
      map: null,
      drawer: null,
      selectFeature: null,
      selectPipelineInfo: {
        name: '',
        position: '',
        type: ''
      },
    }
  },
  computed: {
  },
  watch: {
    // 监听面板是否被改变
    '$store.state.map.P_editableTabsValue': function (val, oldVal) {
      if (val !== 'trackingAnalysis') this.removeAll()
      else this.init()
    }
  },
  destroyed() {
    this.removeAll()
  },
  mounted() {
    this.map = this.data.mapView
    this.rootPage = this.data.that
    this.init()
  },
  methods: {
    init () {
      this.vectorLayer = new VectorLayer({ source: new VectorSource(), style: comSymbol.getLineStyle(5, "#0ff") })
      this.map.addLayer(this.vectorLayer)
    },
    removeAll () {
      this.drawer && this.drawer.end()
      this.map.removeLayer(this.vectorLayer)
      this.drawer = this.vectorLayer = null
      this.clearResult()
    },
    openPopup (position, featureJson) {
      this.rootPage.$refs.popupWindow.showPopup(position, featureJson, this.afterClosePopup)
    },
    afterClosePopup () {
      this.vectorLayer && this.vectorLayer.getSource().clear()
    },
    selectPipe() {
      this.drawer && this.drawer.end()
      this.vectorLayer && this.vectorLayer.getSource().clear()
      this.drawer = new iDraw(this.map, "point", {
        endDrawCallBack: drawFea => {
          let fea = new GeoJSON().readFeature(turf.buffer(turf.point(drawFea.getGeometry().getCoordinates()), 0.3 / 1000, { units: 'kilometers' }))
          this.getAnalysisPipe(fea).then(resObj => {
            if (resObj) {
              let featureJson = resObj.result.features.features[0]
              let feature = new GeoJSON().readFeature(featureJson)
              this.vectorLayer.getSource().addFeature(feature)
              this.selectPipelineInfo.name = `管道类别：${feature.get("TYPE")}`
              this.selectPipelineInfo.id = `管道编号：${feature.get("LNO")}`
              //
              this.openPopup(drawFea.getGeometry().getCoordinates(), featureJson)
              //
              feature.set("attachName", resObj.attachName)
              feature.set("tableName", resObj.tableName)
              this.selectFeature = feature.clone()
              console.log("选择管段", featureJson)
              this.drawer.end()
            } else {
              this.drawer.clear()
              return this.$message.error("无管线数据")
            }
          })
        },
        showCloser: false
      })
      this.drawer.start()
    },
    getAnalysisPipe (fea) {
      let dataSetInfo = [{ name: "TF_PSPS_PIPE_B", label: "排水管", attachName: "TF_PSPS_POINT_B" }]

      return new Promise(resolve => {
        new iQuery({ dataSetInfo }).spaceQuery(fea).then(resArr => {
          let featuresObj = resArr.find(res => res && res.result.featureCount !== 0)
          if (featuresObj) resolve(featuresObj)
          else resolve(null)
        })
      })
    },
    // 确定table的row唯一的key值
    getRowKeys(row) {
      return row.id
    },
    /**
     * 开始分析
     */
    async doQuery() {
      if (!this.selectFeature) return this.$message.error("还未选择管线，不能进行分析！")
      if (!this.selectFeature.get("LNO")) return this.$message.error("数据缺少唯一标识，不能进行分析！")
      this.doLoading = true // 开始查询
      this.selectFlag = false
      let data = {
        pipeLength: this.distence,
        tableName: this.selectFeature.get("tableName"),
        pipePointNo: this.selectFeature.get("LNO")
      }
      let resultTable = []
      let result = await trackingAnalysis(data) // 接口返回结果
      console.log("追踪分析结果", result)
      this.doLoading = false
      return
      for (const key in result.result) {
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
          + this.selectFeature.get("TYPENAME")],
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
          + this.selectFeature.get("attachName")],
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
      let sFeature = this.selectFeature
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
      this.rootPage.$refs.popupWindow.closePopup()
      this.vectorLayer && this.vectorLayer.getSource().clear()
      Object.assign(this.$data.selectPipelineInfo, this.$options.data().selectPipelineInfo) // 清空选择管线信息
      this.distence = 50
      this.queryResult = []
      this.selectFeature = null
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