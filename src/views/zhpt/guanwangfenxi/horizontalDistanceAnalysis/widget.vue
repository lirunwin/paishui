<template>
  <!-- <div>净距分析</div> -->
  <div class="panel-container i-scrollbar">
    <div class="op-box">
      <div class="item-head" style="margin-top:0">分析类型</div>
        <el-radio v-model="drawType" label="point">缓冲</el-radio>
        <el-radio v-model="drawType" label="circle">圆域</el-radio>
        <el-radio v-model="drawType" label="polygon">多边形</el-radio>
      </div>
    <div class="op-box" v-show="drawType === 'point'">
      <el-button type="primary" size="small" style="width:100%" @click="select">选择分析管线</el-button>
    </div>
    <div class="op-box" v-show="drawType === 'point'">
      <el-form>
        <el-form-item label="缓冲距离/m" style="margin:0">
          <el-input-number size="small" v-model="bufferDistance" controls-position="right" :step="5" :min="10">
          </el-input-number>
        </el-form-item>
        <el-form-item label="管线编号" style="margin-top:10px">
          <el-input size="small" v-model="selectPipeID" style="width:100%" disabled>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    

    <!-- 分析结果 -->
    <div class="op-box">
      <el-button type="primary" size="small" style="width:100%" :loading="false" @click="analysis">开始分析</el-button>
    </div>
    <div class="op-box">
      <div class="item-head">分析结果</div>
      <div class="result-total">
          <el-table :data="layerData" v-loading="queryStatus"
                    :header-cell-style="{fontSize: '14px', fontWeight:'600',background:'#eaf1fd',color:'#909399'}" style="width: 100%">
            <el-table-column prop="layer" align="center" label="类型"></el-table-column>
            <el-table-column prop="number" align="center" label="数量(个)"></el-table-column>
          </el-table>
      </div>
    </div>
    <div class="op-box">
      <div class="item-head">详细信息</div>
      <div class="result-total">
          <el-table max-height='500' empty-text="无分析结果/数据不符合分析条件" @row-click='showPosition' :data="detailData" :header-cell-style="{fontSize: '14px', fontWeight:'600',background:'#eaf1fd',color:'#909399'}" style="width: 100%">
            <el-table-column prop="pipeid" align="center" label="分析管线编号"></el-table-column>
            <el-table-column prop="diameter" align="center" label="管径/mm"></el-table-column>
            <el-table-column prop="secpipeid" align="center" label="比较管线编号"></el-table-column>
            <el-table-column prop="sdis" align="center" label="净距标准/m"></el-table-column>
            <el-table-column prop="dis" align="center" label="净距/m"></el-table-column>
          </el-table>
      </div>
    </div>

    <div class="op-box">
      <el-button type="danger" size="small" style="width:100%" @click="clearResult()">清除结果</el-button>
    </div>
  </div>
</template>

<script>

import { appconfig } from 'staticPub/config'
import { SuperMap, FeatureService } from '@supermap/iclient-ol';
import { MultiPolygon, Point } from 'ol/geom';
import { GeoJSON } from 'ol/format';
import Feature from 'ol/Feature';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Style, Circle, Icon, Fill, RegularShape, Stroke, Text } from 'ol/style';
import * as turf from '@turf/turf'
import { comSymbol } from '@/utils/comSymbol'
import iDraw from '@/views/zhpt/common/mapUtil/draw';
import iQuery from '@/views/zhpt/common/mapUtil/query';
import DisAnalysisTool from '@/views/zhpt/common/mapUtil/disAnalysis';
import { DisStandard } from '@/views/zhpt/common/standard'

export default {
  props: ["data"],
  data() {
    return {
      bgc: "#02baaf",
      selectFlag: false,
      selectPipeLines: [], // 选择的管线，只有两个
      vectorLayer: null,
      resultDes: '合规',
      result: '',
      standard: '',
      //
      bufferDistance: 10,
      queryStatus: false,
      selectPipeID: '',
      drawType: 'point',
      drawer: null,
      queryFeature: null,
      detailData: [],
      layerData: []
    }
  },
  computed: {
  },
  watch: {
    drawType (nv, ov) {
      this.drawer && this.drawer.end()
      this.vectorLayer && this.vectorLayer.getSource().clear()
      if (this.drawType && this.drawType !== 'point') {
        this.drawer = new iDraw(this.map, this.drawType, {
          endDrawCallBack: fea => {
            this.drawer.remove()
            this.queryFeature = fea
          },
          showCloser: false
        })
        this.drawer.start()
      }
    }
  },
  mounted() {
    this.map = this.data.mapView
    this.vectorLayer = new VectorLayer({
      source: new VectorSource(),
      style: comSymbol.getAllStyle(2, "f00", 5, '#00FFFF', 'rgba(255,255,255,0.3)')
    })
    this.map.addLayer(this.vectorLayer)
    this.lightLayer = new VectorLayer({
      source: new VectorSource(),
      style: comSymbol.getLineStyle(5, "#f00")
    })
    this.map.addLayer(this.lightLayer)
  },
  destroyed() {
    this.vectorLayer && this.map.removeLayer(this.vectorLayer)
    this.drawer && this.drawer.end()
    this.lightLayer && this.map.removeLayer(this.lightLayer)
  },
  methods: {
    select () {
      this.drawer && this.drawer.end()
      this.drawer = new iDraw(this.map, this.drawType, {
        endDrawCallBack: fea => {
            fea = new GeoJSON().readFeature(turf.buffer(turf.point(fea.getGeometry().getCoordinates()), 0.5 / 1000, { units: "kilometers" }))
            this.getAnalysisPipe(fea).then(featuresArr => {
              if (featuresArr.length !== 0) {
                this.drawer.remove()
                featuresArr.forEach(features => {
                  this.vectorLayer.getSource().addFeatures(new GeoJSON().readFeatures(features.result.features))
                })
                
                let feature = featuresArr[0].result.features.features[0]
                this.selectPipeID = feature.properties["SID"]
                let feaJson = turf.buffer(turf.lineString(new GeoJSON().readFeature(feature).getGeometry().getCoordinates()), this.bufferDistance / 1000, { units: 'kilometers' })
                this.queryFeature = new GeoJSON().readFeature(feaJson)
                this.queryFeature.setStyle(comSymbol.getDrawStyle(2, "f00", 3, '#66B1FF', 'rgba(255,255,255,0.3)',[15, 15]))
                this.vectorLayer.getSource().addFeature(this.queryFeature)
              } else this.$message.warning('该点无管线，请重新选择')
            })
        },
        showCloser: false
      })
      this.drawer.start()
    },
    getAnalysisPipe (fea) {
      let dataSetInfo = [{ name: "给水管线" }, { name: "广电线缆" }]
      let dataServer = appconfig.gisResource['iserver_resource'].dataServer
      return new Promise(resolve => {
        new iQuery({ ...dataServer, dataSetInfo }).spaceQuery(fea).then(resArr => {
          let featuresArr = resArr.filter(res => res && res.result.featureCount !== 0)
          resolve(featuresArr)
        })
      })
    },
    analysis () {
      if (!this.queryFeature) return this.$message.error("请先选择管线或者绘制查询范围")
      this.getAnalysisPipe(this.queryFeature).then(featuresArr => {
        let data = [], features
        if (featuresArr.length !== 0) {
          featuresArr.forEach(obj => {
            let resFeatures = [...obj.result.features.features]
            let layerName = obj.layerName
            data.push({ layerName, resFeatures })
            //
            this.vectorLayer.getSource().addFeatures(new GeoJSON().readFeatures(obj.result.features))
            
          })
        } else this.$message.warning("无查询管线")
        // 
        this.layerData = data.map(item => {
          return { layer: item.layerName, number: item.resFeatures.length }
        })

        this.disAnalysis(data)
      })
    },
    // 水平净距分析
    disAnalysis (data) {
      const diamaterFiled = 'DIAMETER'
      const typeField = "BURYTYPE"
      let disAnalysis = new DisAnalysisTool()
      let dataBox = []

      let featuresArr = []
      data.forEach(item => {
        let layerName = item.layerName
        item.resFeatures.forEach(fea => featuresArr.push({ layerName, feature: fea }))
      })

      // 两两比较
      for(let len = featuresArr.length, i = 0; i < len; i++) {
        let layerName = featuresArr[i].layerName
        
        let standard = DisStandard.find(item => item.subtype === layerName)
        if (!(standard && standard.vStandardDis)) return this.$message.error(`缺少${layerName}水平净距标准`)
        let { hStandardDis } = standard

        let comparePipe = new GeoJSON().readFeature(featuresArr[i].feature)
        if (!comparePipe.get(typeField) || comparePipe.get(typeField) !== '管埋') continue

        for (let j = i + 1; j < len; j++) {
          let pipe = new GeoJSON().readFeature(featuresArr[j].feature)
          let diameter1 = comparePipe.get(diamaterFiled)
          let diameter2 = pipe.get(diamaterFiled)
          if (!(diameter1 && diameter2)) return this.$message.error("管线属性数据不完整，无法执行分析")
          if (!pipe.get(typeField) || pipe.get(typeField) !== '管埋') continue
          // 非连接管段
          if (!isConnect(comparePipe, pipe)) {
            let res = disAnalysis.closetHzDis(comparePipe.getGeometry(), pipe.getGeometry(), diameter1, diameter2)
            if (res.hasDis) {
              dataBox.push({ comparePipe, pipe, standard: res.dis < hStandardDis, dis: res.dis, sdis: hStandardDis })
            }
          }
        }
      }

      this.detailData = dataBox.map(item => {
        return { 
          features: [item.comparePipe, item.pipe],
          dis: item.dis, 
          sdis: item.sdis, 
          diameter: item.comparePipe.get(diamaterFiled), 
          pipeid: item.comparePipe.get("SID"), 
          secpipeid: item.pipe.get("SID") 
        }
      })

      // 判断是否是前后连接的管段
      function isConnect(feature1, feature2) {
        let sid1 = feature1.get("START_SID"),
            eid1 = feature1.get("END_SID")
        let sid2 = feature2.get("START_SID"),
            eid2 = feature2.get("END_SID")
        return sid1 === eid2 || eid1 === sid2 || sid1 === sid2 || eid1 === eid2
      }
      
    },
    showPosition (row) {
      console.log('水平净距分析距离')
      let features = row.features
      this.lightLayer.getSource().clear()
      features.forEach(fea => {
        let feature = fea.clone()
        this.lightLayer.getSource().addFeature(feature)
      })
    },

    clearResult () {
      this.layerData = []
      this.detailData = []
      this.queryFeature = null
      this.drawer && this.drawer.end()
      this.vectorLayer && this.vectorLayer.getSource().clear()
      this.lightLayer.getSource().clear()
      this.drawType = ""
    }

  }
}
</script>

<style lang="scss" scoped>
@import './css.scss';
@import "~@/styles/mixin.scss";
.i-scrollbar {
  overflow: auto;
  @include scrollBar;
}
</style>