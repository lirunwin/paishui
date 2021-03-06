<template>
  <div ref="mainMap" class="map-container" :style="mapSize" v-loading='maploading'>
    <transition name="el-zoom-in-top">
      <div v-show="showMapLengend" class="map-legend">
        <div class="map-legend-title">
          <span>图例</span>
          <span ref="legendCloser" style="float: right; cursor: pointer" title="收缩" @click="legendChange">▼</span>
        </div>
        <div
          v-show="showLegendBox"
          class="map-legend-item"
          v-for="(item, index) in legendData"
          :key="index"
        >
          <div style="flex: 0.3; text-align: center">
            <div :class="'map-legend-' + item.type" :style="'background-color:' + item.color"></div>
          </div>
          <div style="flex: 0.7; text-align: center">
            <div class="map-legend-label">{{ item.label }}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { appconfig } from 'staticPub/config'
import 'ol/ol.css'
import { Map as olMap } from 'ol'
import View from 'ol/View'
import { TF_Layer } from '@/views/zhpt/common/mapUtil/layer'

import { defaults as controls } from 'ol/control'
import { defaults as interactions } from 'ol/interaction'
import { mapUtil } from '@/views/zhpt/common/mapUtil/common'
import iDraw from '@/views/zhpt/common/mapUtil/draw'
import { projUtil } from '@/views/zhpt/common/mapUtil/proj'

import { Feature } from 'ol'
import { LineString, Point, Polygon } from 'ol/geom'
import * as turf from '@turf/turf'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { comSymbol } from '@/utils/comSymbol'
import { Style } from 'ol/style'
import Icon from 'ol/style/Icon'
import defectImg1 from '@/assets/images/traingle1.png'
import defectImg2 from '@/assets/images/traingle2.png'
import defectImg3 from '@/assets/images/traingle3.png'
import defectImg4 from '@/assets/images/traingle4.png'
import defectImg0 from '@/assets/images/traingle0.png'
import { unByKey } from 'ol/Observable'
import { LegendConfig } from '@/views/zhpt/common/legendConfig'

export default {
  name: 'simpleMap',
  props: {
    mapWidth: {
      default: 100,
      type: Number
    },
    mapHeight: {
      default: 100,
      type: Number
    }
  },

  data() {
    return {
      map: null,
      projUtil: null, // 坐标系工具
      currentDataProjName: 'proj44', // 当前坐标系
      vectorLayer: null,
      moveEvent: null,
      showMapLengend: false,
      showLegendBox: true,
      legendData: [],
      drawer: null,
      maploading: false,
      colors: [
        { color: '#f00', label: '立即处理' },
        { color: '#ff0', label: '处理计划' },
        { color: '#ff3', label: '制定修复计划' },
        { color: '#FFCD43', label: '修复计划' },
        { color: '#008000', label: '尽快处理' },
        { color: '#00f', label: '尽快修复' },
        { color: '#0DBAFF', label: '暂不处理' },
        { color: '#0DBAFF', label: '暂不修复' }
      ]
    }
  },
  methods: {
    changeLoading (status) {
      this.maploading = status
    },
    initMap() {
      let { initCenter, initZoom } = appconfig
      let layersSource = appconfig.gisResource['iserver_resource'].layerService.layers
      let map = new olMap({
        target: this.$refs.mainMap,
        controls: controls({
          zoom: false,
          attribution: false
        }),
        interactions: interactions({
          doubleClickZoom: false
        }),
        view: new View({
          center: initCenter,
          zoom: 13,
          maxZoom: 20,
          minZoom: 5,
          projection: 'EPSG:4326'
        })
      })
      this.map = map

      new TF_Layer().createLayers(layersSource).then(layers => {
        layers.forEach(layer => {
          layer && this.map.addLayer(layer)
        })
        this.vectorLayer = new VectorLayer({ source: new VectorSource() })
        this.map.addLayer(this.vectorLayer)
        this.$emit('afterMapLoad')
      })

      this.moveEvent = this.map.on('moveend', (args) => {
        let [xmin, ymin, xmax, ymax] = new mapUtil(this.map).getCurrentViewExtent()
        let coors = [
          [
            [xmin, ymax],
            [xmax, ymax],
            [xmax, ymin],
            [xmin, ymin],
            [xmin, ymax]
          ]
        ]
        this.$emit('mapMoveEvent', new Feature({ geometry: new Polygon(coors) }))
      })
    },
    showLegend(legendName, visible) {
        if (!legendName) return
        this.legendData = LegendConfig[legendName]
        this.showMapLengend = visible
    },
    legendChange() {
        this.showLegendBox = !this.showLegendBox
        let dom =  this.$refs.legendCloser
        dom.innerHTML = this.showLegendBox ? '▼' : '▲'
    },
    // 加入缺陷数据
    getFeatures(data, type) {
      let features = []
      data.forEach((item) => {
        let coors = item.geometry.geometry.coordinates
        if (type === 1) {
          let feature = new Feature({ geometry: new Point(coors) })
          let imgs = [
            { level: ['一级', '1'], img: defectImg1, index: 0 },
            { level: ['二级', '2'], img: defectImg2, index: 1 },
            { level: ['三级', '3'], img: defectImg3, index: 2 },
            { level: ['四级', '4'], img: defectImg4, index: 3 },
            // { level: '/', img: defectImg0, index: 4 }
          ]
          let findimg = null

          if (item.defectLevel) {
            findimg = imgs.find((colorObj) => colorObj.level.includes(item['defectLevel']))
          }
          // 缺少 defectLevel 字段
          if (findimg) {
            feature.setStyle(new Style({ image: new Icon({ size: [48, 48], src: findimg.img, scale: 0.3 }) }))
            for (let i in item) {
              i !== 'geometry' && feature.set(i, item[i])
            }
            features.push(feature)
          }
        } else {
          let feature = new Feature({ geometry: new LineString(coors) })
          // 健康等级颜色
          let colors = [
            { level: 'Ⅰ', color: 'green', index: 0 },
            { level: 'Ⅱ', color: 'blue', index: 1 },
            { level: 'Ⅲ', color: 'pink', index: 2 },
            { level: 'Ⅳ', color: 'red', index: 3 }
          ]
          if (item['funcClass']) {
            let findColor = colors.find((colorObj) => item['funcClass'].includes(colorObj.level))
            if (findColor) {
              feature.setStyle(comSymbol.getLineStyle(5, findColor.color))
              for (let i in item) {
                i !== 'geometry' && feature.set(i, item[i])
              }
              features.push(feature)
            }
          }

          // if (item['structClass']) {
          //   let findColor = colors.find((colorObj) => item['structClass'].includes(colorObj.level))
          //   if (findColor) {
          //     feature.setStyle(comSymbol.getLineStyle(5, findColor.color))
          //     for (let i in item) {
          //       i !== 'geometry' && feature.set(i, item[i])
          //     }
          //     features.push(feature)
          //   }
          // }
          
        }
      })
      return features
    },
    draw({ type = 'polygon', callback }) {
      this.drawer && this.drawer.end()
      this.drawer = new iDraw(this.map, type, {
        showCloser: false,
        endDrawCallBack: feature => {
          this.drawer.remove()
          callback && callback(feature)
        }
      })
      this.drawer.start()
    },
    clearDraw () {
      this.drawer && this.drawer.end()
    },
    getDataInMap(data, extent) {
      console.log('查询数据')
      let that = this
      // 无范围 默认全图
      if (!extent) {
        let [xmin, ymin, xmax, ymax] = new mapUtil(this.map).getCurrentViewExtent()
        let coors = [
          [
            [xmin, ymax],
            [xmax, ymax],
            [xmax, ymin],
            [xmin, ymin],
            [xmin, ymax]
          ]
        ]
        extent = new Feature({ geometry: new Polygon(coors) })
      }
      let filterExtent = turf.polygon(extent.getGeometry().getCoordinates())

      let resData = new Map()
      data = filter(data, 2)
      // 地图加入整改图层
      let colors = this.colors
      let features = []
      data.forEach((pipeData) => {
        let geometry = new LineString(pipeData.geometry.geometry.coordinates)
        if (pipeData.pipeDefects.length !== 0) {
          let defects = pipeData.pipeDefects.filter(defect => defect.checkSuggest)
          let colorObjs = colors.filter(item => defects.some(defect => item.label.includes(defect.checkSuggest)))
          if (colorObjs.length !== 0) {
            let colorObj = colorObjs[0]
            let feature = new Feature({ geometry })
            feature.setStyle(comSymbol.getLineStyle(5, colorObj.color))
            features.push(feature)
          }
        }
      })
      this.vectorLayer.getSource().addFeatures(features)
      // 数据整理
      data.forEach((pipeData) => {
        let len = pipeData.pipeLength
        let defectData = pipeData.pipeDefects
        defectData.forEach(defect => {
          if (defect.checkSuggest) {
            if (!resData.has(defect.checkSuggest)) {
            resData.set(defect.checkSuggest, { num: 1, len })
          } else {
            let data = resData.get(defect.checkSuggest)
            data.num += 1
            data.len += len
          }
          }
        })
      })
      let obj = {}
      resData.forEach((value, key) => {
        obj[key] = value
      })
      return obj

      function filter(features, type) {
        let feas = []
        feas = features.map((feaObj) => {
          let fea = {}
          if (type === 1) {
            let coors = JSON.parse(feaObj.geometry)
            if (!coors) {
              return null
            }
            fea.geometry = turf.point(that.projUtil.transform([coors.x, coors.y], that.currentDataProjName, 'proj84'))
            for (let key in feaObj) {
              if (key !== 'geometry') {
                fea[key] = feaObj[key]
              }
            }
          } else {
            let { startPointXLocation, startPointYLocation, endPointXLocation, endPointYLocation } = feaObj
            if (!(startPointXLocation && startPointYLocation && endPointXLocation && endPointYLocation)) {
              return null
            }
            let startPoint = [Number(startPointXLocation), Number(startPointYLocation)]
            let endPoint = [Number(endPointXLocation), Number(endPointYLocation)]
            startPoint = that.projUtil.transform(startPoint, that.currentDataProjName, 'proj84')
            endPoint = that.projUtil.transform(endPoint, that.currentDataProjName, 'proj84')
            fea.geometry = turf.lineString([startPoint, endPoint])
            for (let key in feaObj) {
              if (key !== 'geometry') {
                fea[key] = feaObj[key]
              }
            }
          }
          return fea
        })
        return feas.filter((fea) => fea && turf.booleanContains(filterExtent, fea.geometry))
      }
    },
    //
    getDefectDataInMap(data, extent, type = '') {
      let that = this
      // 无范围 默认全图
      if (!extent) {
        let [xmin, ymin, xmax, ymax] = new mapUtil(this.map).getCurrentViewExtent()
        let coors = [
          [
            [xmin, ymax],
            [xmax, ymax],
            [xmax, ymin],
            [xmin, ymin],
            [xmin, ymax]
          ]
        ]
        extent = new Feature({ geometry: new Polygon(coors) })
      }
      let filterExtent = turf.polygon(extent.getGeometry().getCoordinates())
      let dFeas = data.map((pipeData) => pipeData.pipeDefects).flat()
      let pFeas = data
      // 范围过滤
      let defectData = filter(dFeas, 1)
      let pipeData = filter(pFeas, 2)
      // 添加要素
      this.vectorLayer.getSource().clear()

      let feas = []
      if (type === 1) {
        feas = [...this.getFeatures(defectData, 1)]
      } else if (type ===  2) {
        feas = [...this.getFeatures(pipeData, 2)]
      } else {
        feas = [...this.getFeatures(defectData, 1), ...this.getFeatures(pipeData, 2)]
      }
      this.vectorLayer.getSource().addFeatures(feas)

      return { pipeData, defectData }

      function filter(features, type) {
        let feas = []
        feas = features.map((feaObj) => {
          let fea = {}
          if (type === 1) {
            let coors = JSON.parse(feaObj.geometry)
            if (!coors) {
              return null
            }
            fea.geometry = turf.point(that.projUtil.transform([coors.x, coors.y], that.currentDataProjName, 'proj84'))
            for (let key in feaObj) {
              if (key !== 'geometry') {
                fea[key] = feaObj[key]
              }
            }
          } else {
            let { startPointXLocation, startPointYLocation, endPointXLocation, endPointYLocation } = feaObj
            if (!(startPointXLocation && startPointYLocation && endPointXLocation && endPointYLocation)) {
              return null
            }
            let startPoint = [Number(startPointXLocation), Number(startPointYLocation)]
            let endPoint = [Number(endPointXLocation), Number(endPointYLocation)]
            startPoint = that.projUtil.transform(startPoint, that.currentDataProjName, 'proj84')
            endPoint = that.projUtil.transform(endPoint, that.currentDataProjName, 'proj84')
            fea.geometry = turf.lineString([startPoint, endPoint])
            for (let key in feaObj) {
              if (key !== 'geometry') {
                fea[key] = feaObj[key]
              }
            }
          }
          return fea
        })
        return feas.filter(fea => fea && turf.booleanContains(filterExtent, fea.geometry))
      }
    }
  },

  created() {},

  mounted() {
    this.projUtil = new projUtil()
    this.projUtil.resgis(this.currentDataProjName)
    this.initMap()
  },

  destroyed() {
    this.moveEvent && unByKey(this.moveEvent)
  },

  computed: {
    mapSize() {
      return { height: `${this.mapHeight}%`, width: `${this.mapWidth}%` }
    }
  }
}
</script>

<style lang='scss' scoped>
.map-container {
  display: relative;
}
.map-legend {
  z-index: 99;
  background: #fffc;
  position: absolute;
  bottom: 40px;
  left: 30px;
  min-height: 30px;
  width: 200px;
  border: 1px solid rgb(13, 186, 255);
}

.map-legend-title {
  color: #fff;
  font-weight: 600;
  padding: 3px 10px;
  height: 30px;
  font-size: 15px;
  line-height: 25px;
  background-color: rgb(13, 186, 255);
}
.map-legend-item {
  display: flex;
  height: 20px;
  line-height: 20px;
  font-size: 13px;
  margin: 15px 10px;
}
.map-legend-label {
  margin-left: 5px;
}
.map-legend-rect {
  display: inline-block;
  width: 30px;
  height: 100%;
}
.map-legend-circle {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.map-legend-line {
  display: inline-block;
  width: 50px;
  height: 8px;
}
.map-legend-traingle1 {
  transform: scale(0.4);
  background-size: 100% 100%;
  background-image: url('../../assets/images/traingle1.png');
  background-repeat: no-repeat;
  width: 36px;
  height: 36px;
}
.map-legend-traingle2 {
  transform: scale(0.4);
  background-size: 100% 100%;
  background-image: url('../../assets/images/traingle2.png');
  background-repeat: no-repeat;
  width: 36px;
  height: 36px;
}
.map-legend-traingle3 {
  transform: scale(0.4);
  background-size: 100% 100%;
  background-image: url('../../assets/images/traingle3.png');
  background-repeat: no-repeat;
  width: 36px;
  height: 36px;
}
.map-legend-traingle4 {
  transform: scale(0.4);
  background-size: 100% 100%;
  background-image: url('../../assets/images/traingle4.png');
  background-repeat: no-repeat;
  width: 36px;
  height: 36px;
}
.map-legend-traingle0 {
  transform: scale(0.4);
  background-size: 100% 100%;
  background-image: url('../../assets/images/traingle0.png');
  background-repeat: no-repeat;
  width: 36px;
  height: 36px;
}
</style>