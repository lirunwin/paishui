<template>
  <div style="padding: 0 8px;overflow-y:auto;">
    <tf-legend class="legend_dept" label="选取管线" isopen="true" title="点击按钮，然后到地图上点击选择需要分析的管线。">
      <el-row style="margin-top: 8px">
        <el-button size="mini" type="primary" style="width: 100%" @click="choosePipe" :disabled="chooseDisable">
          <i ref="chooseLoad"/>选取管线</el-button>
      </el-row>
      <el-col :span="24">
        <el-table :data="selectedPipe" stripe style="width: 100%" max-height="200px" row-class-name="selectRowC">
          <el-table-column prop="oid" label="管线编号" />
          <el-table-column prop="STARTSID" label="起点编号" />
          <el-table-column prop="ENDSID" label="终点编号" />
        </el-table>
      </el-col>
      <!-- <el-row style="padding-top: 8px; clear: both;">
        <el-checkbox v-model="isApplystop" style="margin-right: 4px;float:right;">使用障碍图层</el-checkbox>
      </el-row> -->
      <el-row style="padding-top: 8px;">
        <el-button size="mini" type="primary" style="width: 100%" @click="analysis" :disabled="analysisDisable">
          <i ref="analysisLoad" style="display:none;" class="el-icon-loading"/>开始分析</el-button>
      </el-row>
    </tf-legend>
    <div id="Legend" class="Legend">
      <div class="label" @click="openstate = !openstate">分析结果
        <el-tooltip class="item" effect="dark" content="分析的结果展示。将会自动在地图上高亮显示结果，点击查看更多可显示表格。" placement="right">
          <i ref="info" class="el-icon-info" />
        </el-tooltip><el-checkbox v-model="ractSelect" style="margin-left: 4px;">地图显示</el-checkbox>
      </div>
      <div v-show="openstate" class="content">
        <el-table :data="layerData" stripe style="width: 100%" height="250">
          <el-table-column prop="name" label="图层" ></el-table-column>
          <el-table-column prop="value" label="数量" ></el-table-column>          
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-link type="primary" @click="showLayer(scope.row)">详情</el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-row style="margin-top: 8px">
        <el-button size="mini" type="primary" style="width: 100%" @click="clearAll">清除所有</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import tfLegend from '@/views/zhpt/common/Legend'
import { appconfig } from 'staticPub/config'
import * as turf from '@turf/turf'
import { comSymbol } from '@/utils/comSymbol'
import iDraw from '@/views/zhpt/common/mapUtil/draw';
import iQuery from '@/views/zhpt/common/mapUtil/query';
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { GeoJSON } from 'ol/format'
import iNetAnalysis from '@/views/zhpt/common/mapUtil/netAnalysis'
import { fieldDoc } from '@/views/zhpt/common/doc'
import { Feature } from 'ol'
import { LineString } from 'ol/geom'

export default {
  name: 'ConnectivityAnalysis',
  components: { tfLegend },
  props: { data: Object },
  data() {
    return {
      chooseDisable: false, //查询按钮禁用
      analysisDisable: false, //分析按钮禁用
      anaPipe: '', //分析管线
      layerIndex: {},
      openstate: true,
      isApplystop: true,
      // 
      selectedPipe: [],
      drawer: null,
      vectorLayer: null,
      lightLayer: null,
      layerData: [],
      ractSelect: false,  //是否分析结果地图显示
      resFeatures: []
    }
  },
  computed: {
    sidePanelOn () {
      return this.$store.state.map.P_editableTabsValue
    }
  },
  watch: {
    sidePanelOn(newTab, oldTab) {
      if (newTab !== "connectivityAnalysis") this.removeAll()
      else this.init()
    },
    ractSelect (nv, ov) {
      
    }
  },
  mounted: function() {
    this.init()
  },
  methods: {
    removeAll () {
      this.resFeatures = []
      this.drawer && this.drawer.end()
      this.map.removeLayer(this.vectorLayer)
      this.map.removeLayer(this.lightLayer)
      this.$store.dispatch('map/handelClose', { box: "HalfPanel", pathId: "queryResultMore" })
    },
    init () {
      this.map = this.data.mapView
      this.vectorLayer = new VectorLayer({ source: new VectorSource(), style: comSymbol.getLineStyle(5, "#f00") })
      this.map.addLayer(this.vectorLayer)
      this.lightLayer = new VectorLayer({ source: new VectorSource(), style: comSymbol.getLineStyle(5, "#0ff") })
      this.map.addLayer(this.lightLayer)
    },
    choosePipe () {
      this.selectedPipe = []
      this.drawer && this.drawer.end()
      this.vectorLayer && this.vectorLayer.getSource().clear()
      this.drawer = new iDraw(this.map, "point", {
        endDrawCallBack: drawFea => {
          let fea = new GeoJSON().readFeature(turf.buffer(turf.point(drawFea.getGeometry().getCoordinates()), 0.5 / 1000, { units: 'kilometers' }))
          this.getAnalysisPipe(fea).then(resObj => {
            console.log("选择管线")
            if (resObj) {
              let featureJson = resObj.result.features.features[0]
              let feature = new GeoJSON().readFeature(featureJson)
              this.vectorLayer.getSource().addFeature(feature)
              let sid = feature.get("LNO"), startid = feature.get("S_POINT"), endid = feature.get("E_POINT")

              if (this.selectedPipe.length === 0) {
                this.selectedPipe.push({ oid: sid, STARTSID: startid, ENDSID: endid, feature })
              } else {
                if (this.selectedPipe[0].STARTSID === startid && this.selectedPipe[0].ENDSID === endid) return this.$message.error("同一条管线")
                this.selectedPipe.push({ oid: sid, STARTSID: startid, ENDSID: endid, feature })
                this.drawer.remove()
              }
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
        let dataSetInfo = [{ name: "TF_PSPS_PIPE_B", label: "排水管" }]
      let dataServer = appconfig.gisResource['iserver_resource'].dataServer
      return new Promise(resolve => {
        new iQuery({ ...dataServer, dataSetInfo }).spaceQuery(fea).then(resArr => {
          let featuresObj = resArr.find(res => res && res.result.featureCount !== 0)
          if (featuresObj) resolve(featuresObj)
          else resolve(null)
        })
      })
    },
    analysis () {
      let { netWorkAnalysisUrl } = appconfig.gisResource['iserver_resource'].dataServer
      if (this.selectedPipe.length !== 2) return this.$message.error('选择两条管线')
      let points = this.selectedPipe.map((pipe, i) => {
        let [startPoint, endPoint] = pipe.feature.getGeometry().getCoordinates(), 
            point = { x: startPoint[0], y: startPoint[1] }
        if (i) point = { x: endPoint[0], y: endPoint[1] }
        return point
      })
      new iNetAnalysis({ url: netWorkAnalysisUrl }).findPath(points[0], points[1]).then(res => {
        if (res) {
          if (res.result.pathList.length !== 0) {
            let pathList = res.result.pathList
            let pathFeatures = []
            pathList.forEach(item => {
              this.ractSelect && this.vectorLayer.getSource().addFeatures(new GeoJSON().readFeatures(item.edgeFeatures))
              pathFeatures = [ ...pathFeatures, ...item.edgeFeatures.features ]
            })
            this.layerData = [{ name: "排水管线", value: pathFeatures.length, pathFeatures }]
          }
        } else this.$message.error("分析失败, 管线间不连通")  
      })
    },
    showLayer (row) {
      let features = row.pathFeatures
      let colsData = []
      for (let field in fieldDoc) {
        colsData.push({ prop: field, label: fieldDoc[field] })
      }
      // 暂时展示15条属性
      colsData.length = 15
      let rowData = features.map(fea => {
        return { ...fea.properties, geometry: fea.geometry }
      })
      this.$store.dispatch('map/changeMethod', {
        pathId: 'queryResultMore', 
        widgetid: 'HalfPanel', 
        label: '详情', 
        param: { rootPage: this, data: rowData || [], colsData }
      })
    },
    gotoGeometry (geometry) {
      let source = this.lightLayer.getSource()
      source.clear()
      let feature = new Feature({ geometry: new LineString(geometry.coordinates) })
      source.addFeature(feature)
    },
    clearAll() {
      this.selectedPipe = []
      this.layerData = []
      this.lightLayer.getSource().clear()
      this.vectorLayer.getSource().clear()
      this.ractSelect = false
      this.resFeatures = []
    }
  },
  destroyed() {
    this.removeAll()
  }
}
</script>
