<template>
  <div style="padding: 0 8px;overflow-y:auto;">
    <tf-legend class="legend_dept" label="选取管线" isopen="true" title="点击按钮，然后到地图上点击选择需要分析的管线。">
      <el-row style="margin-top: 8px">
        <el-button size="mini" type="primary" style="width: 100%" @click="choosePipe" :disabled="chooseDisable">
          <i ref="chooseLoad"/>选取管线</el-button>
      </el-row>
      <!-- <el-col :span="24">
        <el-table :data="selectedPipe" stripe style="width: 100%" max-height="200px" row-class-name="selectRowC">
          <el-table-column prop="oid" label="管线编号" />
          <el-table-column prop="STARTSID" label="起点编号" />
          <el-table-column prop="ENDSID" label="终点编号" />
        </el-table>
      </el-col> -->
      <!-- <el-row style="padding-top: 8px; clear: both;">
        <el-checkbox v-model="isApplystop" style="margin-right: 4px;float:right;">使用障碍图层</el-checkbox>
      </el-row> -->
      <!-- <el-row style="padding-top: 8px;">
        <el-button size="mini" type="primary" style="width: 100%" @click="analysis" :disabled="analysisDisable">
          <i ref="analysisLoad" style="display:none;" class="el-icon-loading"/>开始分析</el-button>
      </el-row> -->
    </tf-legend>
    <div id="Legend" class="Legend">
      <div class="label" @click="openstate = !openstate">分析结果
        <el-tooltip class="item" effect="dark" content="分析的结果展示。将会自动在地图上高亮显示结果，点击查看更多可显示表格。" placement="right">
          <i ref="info" class="el-icon-info" />
        </el-tooltip><el-checkbox v-model="ractSelect" style="margin-left: 4px;">地图显示</el-checkbox>
      </div>
      <div v-show="openstate" class="content">
        <el-table :data="layerData" stripe style="width: 100%" height="250">
          <template slot="empty">
            <img src="@/assets/icon/null.png" alt="">
            <p class="empty-p">暂无数据</p>
          </template>
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
import { LineString, Point } from 'ol/geom'
import { Style } from 'ol/style'
import Icon from 'ol/style/Icon';
import arrowImg from '@/assets/images/arrow-right.png'
import { fromExtent as extentToPolygon } from 'ol/geom/Polygon';

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
  },
  watch: {
    // 监听面板是否被改变
    '$store.state.map.P_editableTabsValue': function (val, oldVal) {
      if (val !== 'waterFlowAnalysis') this.removeAll() 
      else this.init()
    },
    ractSelect (nv, ov) {
    }
  },
  mounted: function() {
    this.map = this.data.mapView
    this.init()
  },
  methods: {
    init () {
      this.vectorLayer = new VectorLayer({ source: new VectorSource(), style: comSymbol.getLineStyle(5, "#f00") })
      this.map.addLayer(this.vectorLayer)
      this.lightLayer = new VectorLayer({ source: new VectorSource(), style: comSymbol.getLineStyle(5, "#00ffff") })
      this.map.addLayer(this.lightLayer)
    },
    removeAll () {
      console.log('移除')
      this.resFeatures = []
      this.drawer && this.drawer.end()
      this.vectorLayer && this.vectorLayer.getSource().clear()
      this.lightLayer && this.lightLayer.getSource().clear()
      this.$store.dispatch('map/handelClose', {
        pathId: 'queryResultMore', 
        widgetid: 'HalfPanel',
        box: "HalfPanel"
      })
    },
    choosePipe () {
      this.drawer && this.drawer.end()
      this.vectorLayer && this.vectorLayer.getSource().clear()
      this.drawer = new iDraw(this.map, "point", {
        endDrawCallBack: drawFea => {
          let fea = new GeoJSON().readFeature(turf.buffer(turf.point(drawFea.getGeometry().getCoordinates()), 0.5 / 1000, { units: 'kilometers' }))
          this.getAnalysisPipe(fea).then(resObj => {
            this.drawer.clear()
            if (resObj) {
              let featureJson = resObj.result.features.features[0]
              let feature = new GeoJSON().readFeature(featureJson)
              this.vectorLayer.getSource().addFeature(feature)
              // 
              console.log("查询信息")
              let lineCoors = feature.getGeometry().getCoordinates()
              let centerPoint = new Feature({ geometry: new Point([(lineCoors[0][0] + lineCoors[1][0]) / 2, (lineCoors[0][1] + lineCoors[1][1]) / 2]) })
              let style = this.getIconStyle(feature)
              centerPoint.setStyle(style)
              this.vectorLayer.getSource().addFeature(centerPoint)
            } else return this.$message.error("无管线数据")
          })
        },
        showCloser: false
      })
      this.drawer.start()
      
    },
    getAnalysisPipe (fea) {
      let dataSetInfo = [{ name: "TF_PSPS_PIPE_B", label: "排水管" }]
      return new Promise(resolve => {
        new iQuery({ dataSetInfo }).spaceQuery(fea).then(resArr => {
          let featuresObj = resArr.find(res => res && res.result.featureCount !== 0)
          if (featuresObj) resolve(featuresObj)
          else resolve(null)
        })
      })
    },
    analysis () {
      if (this.selectedPipe.length !== 2) return this.$message.error('选择两条管线')
      let points = this.selectedPipe.map(pipe => {
        let startPoint = pipe.feature.getGeometry().getCoordinates()[0]
        return { x: startPoint[0], y: startPoint[1] }
      })
      new iNetAnalysis().findPath(points[0], points[1]).then(res => {
        if (res) {
          if (res.result.pathList.length !== 0) {
            let pathList = res.result.pathList
            let pathFeatures = []
            pathList.forEach(item => {
              this.ractSelect && this.vectorLayer.getSource().addFeatures(new GeoJSON().readFeatures(item.edgeFeatures))
              pathFeatures = [ ...pathFeatures, ...item.edgeFeatures.features ]
            })
            this.
            this.layerData = [{ name: "给水管线", value: pathFeatures.length, pathFeatures }]
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
      this.drawer && this.drawer.end()
    },
    getIconStyle (feature) {
      let coors = feature.getGeometry().getCoordinates()
      let [ startPoint, endPoint ] = coors
      let rotation = 0
      let imgRt = Math.PI / 2 // 图片资源箭头方向相对于竖直向上方向的旋转角度

      // 计算旋转弧度
      if (endPoint[0] === startPoint[0]) { // 竖直
        rotation = endPoint[1] > startPoint[1] ? -imgRt : Math.PI - imgRt
      } else if (endPoint[1] === startPoint[1]) { // 水平
        rotation = endPoint[1] > startPoint[1] ? Math.PI / 2 - imgRt : Math.PI * 3 / 2 - imgRt
      } else { // 其他角度
        rotation = Math.atan((endPoint[0] - startPoint[0]) / (endPoint[1] - startPoint[1])) - imgRt
      }
      
      return new Style({
        image: new Icon({
          src: arrowImg,
          scale: 0.4,
          size: [48, 48], // 对应图片大小
          rotation // 旋转弧度
        })
      }) 
    },
  },
  destroyed() {
    this.removeAll()
  }
}
</script>
