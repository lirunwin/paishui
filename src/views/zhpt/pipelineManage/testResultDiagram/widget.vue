<template>
  <div class="testResultDiagram i-scrollbar" :data="'这个是data'">
    <!-- 检测成果专题图 -->
    <p class="title">显示设置</p>
    <el-form ref="form" :model="form" label-width="auto" :rules="rules">
      <el-form-item label="工程名称:" prop="name">
        <el-select v-model="form.project" placeholder="默认显示最新工程">
          <el-option
            v-for="(item, index) in projectOpt"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="检测报告:">
        <el-select v-model="form.report" placeholder="请选择检测报告">
          <el-option
            v-for="(item, index) in reportOpt"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="检测日期:">
        <el-col :span="11">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="form.startDate"
            style="width: 100%"
          ></el-date-picker>
        </el-col>
        <el-col style="text-align: center" :span="2">~</el-col>
        <el-col :span="11">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="form.endDate"
            style="width: 100%"
          ></el-date-picker>
        </el-col>
      </el-form-item>
    </el-form>
    <div class="see-btn">
      <el-button type="primary" @click="showLayer">查看</el-button>
    </div>
    <p class="title">专题图列表</p>
    <div v-for="(item, index) in defectLegend" :key="index" class="thematicMap-list">
      <div>
        <div class="thematicMap-title">
          <i
            style="cursor: pointer"
            @click="changeArrow(index)"
            :class="{ 'el-icon-caret-bottom': showThemBox[index], 'el-icon-caret-right': !showThemBox[index] }"
          ></i>
          <el-checkbox
            @change="setThemLayerVisible(index, item.open)"
            v-model="item.open"
            :label="item.title"
          ></el-checkbox>
        </div>
        <transition>
          <div v-if="item.type === 'gradient' && showThemBox[index]" class="transition-box">
            <div class="line-color"></div>
            <div class="text-mix-max">
              <span>{{ item.start }}</span>
              <span>{{ item.end }}</span>
            </div>
          </div>
          <div v-else-if="showThemBox[index]" class="transition-box">
            <ul>
              <li v-for="(level, i) in item.level" :key="i" :class="comStyle(item.type, level.color)">
                {{ level.label + level.num + level.unit }}
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </div>

    <!-- <button type="primary" @click="openDefect">打开管道缺陷管理模块</button> -->
  </div>
</template>

<script>
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import Polygon from 'ol/geom/Polygon'
import Heatmap from 'ol/layer/Heatmap'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { comSymbol } from '@/utils/comSymbol'
import iDraw from '@/views/zhpt/common/mapUtil/draw'
import iQuery from '@/views/zhpt/common/mapUtil/query'
import { appconfig } from 'staticPub/config'
import GeoJSON from 'ol/format/GeoJSON'

export default {
  props: { data: Object },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { max: 100, message: '内容不能超过100个字符串', trigger: 'blur' }
        ]
      },
      form: {
        project: '',
        report: '',
        startDate: '',
        endDate: ''
      },

      // 缺陷数据
      reportOpt: [
        { label: '区域一', value: 'area1' },
        { label: '区域二', value: 'area2' }
      ],
      projectOpt: [
        { label: '区域一', value: 'area1' },
        { label: '区域二', value: 'area2' }
      ],
      defectLegend: [
        {
          title: '管网缺陷密度图',
          layerName: 'heatLayer',
          open: true,
          type: 'gradient',
          start: '少',
          end: '多'
        },
        {
          title: '管网缺陷分布专题图',
          layerName: 'pipeDefectLayer',
          open: false,
          type: 'circle',
          level: [
            { color: 'green', label: '1级', num: 111, unit: '个' },
            { color: 'red', label: '2级', num: 111, unit: '个' },
            { color: 'pink', label: '3级', num: 111, unit: '个' }
          ]
        },
        {
          title: '检查井缺陷分布专题图',
          layerName: 'manholeDefectLayer',
          open: false,
          type: 'square',
          level: [
            { color: 'green', label: '井盖缺失', num: 111, unit: '个' },
            { color: 'red', label: '井盖破损', num: 111, unit: '个' },
            { color: 'pink', label: '井盖移位', num: 111, unit: '个' }
          ]
        },
        {
          title: '管网健康评估专题图',
          layerName: 'pipeHealthLayer',
          open: false,
          type: 'line',
          level: [
            { color: 'pink', label: '1级', num: 111, unit: '个' },
            { color: 'red', label: '2级', num: 111, unit: '个' },
            { color: 'green', label: '3级', num: 111, unit: '个' }
          ]
        }
      ],
      showThemBox: [true, true, true, true],

      mapView: null,
      heatLayer: null,
      pipeDefectLayer: null,
      manholeDefectLayer: null,
      pipeHealthLayer: null
    }
  },
  mounted() {
    this.mapView = this.data.mapView
    this.heatLayer = new Heatmap({
      source: new VectorSource(),
      gradient: ['#3ce10f', '#ff0602'],
      radius: 16,
      visble: false
    })
    this.pipeDefectLayer = new VectorLayer({ source: new VectorSource(), visible: false })
    this.manholeDefectLayer = new VectorLayer({ source: new VectorSource(), visible: false })
    this.pipeHealthLayer = new VectorLayer({ source: new VectorSource(), visible: false })
    this.addLayers([this.heatLayer, this.pipeDefectLayer, this.manholeDefectLayer, this.pipeHealthLayer])
  },
  destroyed() {
    this.heatLayer && this.mapView.removeLayer(this.heatLayer)
    this.pipeDefectLayer && this.mapView.removeLayer(this.pipeDefectLayer)
    this.manholeDefectLayer && this.mapView.removeLayer(this.manholeDefectLayer)
    this.pipeHealthLayer && this.mapView.removeLayer(this.pipeHealthLayer)
  },
  watch: {},
  methods: {
    addLayers(layers) {
      layers.forEach((layer) => this.mapView.addLayer(layer))
    },
    initMap() {
      let center = [113.1547, 29.3682]
      let colorBox = ['#ff0000', '#0c9923', '#f405ff']

      let points = this.randomPoint(center, 0.025, 50)
      let features = points.map((item) => new Feature({ geometry: new Point(item) }))
      this.heatLayer.getSource().addFeatures(features)

      // 管网
      features.forEach((fea, index) => {
        let color = colorBox[index % 3]
        let feature = fea.clone()
        feature.setStyle(comSymbol.getPointStyle(5, color, 2, color))
        this.pipeDefectLayer.getSource().addFeature(feature)
      })

      // 检查井
      let points2 = this.randomPoint(center, 0.01, 50)
      let features2 = points2.map((item) => new Feature({ geometry: new Point(item) }))
      features2.forEach((fea, index) => {
        let color = colorBox[index % 3]
        fea.setStyle(comSymbol.getPointStyle(5, 'rgba(255,255,255,0)', 2, color))
        this.manholeDefectLayer.getSource().addFeature(fea)
      })

      // 管网
      this.initPipeHealthLayer()
    },
    initPipeHealthLayer() {
      let colorBox = ['#ff0000', '#0c9923', '#f405ff']
      // 查询的图形坐标
      let polygonCoors = [
        [
          [113.11214127919722, 29.3790030636461],
          [113.13265481374312, 29.3790030636461],
          [113.13265481374312, 29.392564312425396],
          [113.11214127919722, 29.392564312425396],
          [113.11214127919722, 29.3790030636461]
        ]
      ]
      let polygon = new Feature({ geometry: new Polygon(polygonCoors) })
      let dataSetInfo = [{ name: "TF_PSPS_PIPE_B", label: "排水管" }]
      let queryTask = new iQuery({ ...appconfig.gisResource['iserver_resource'].dataServer, dataSetInfo })
      queryTask.spaceQuery(polygon).then((resArr) => {
        let pipeFeaturesObj = resArr.find((res) => res.result.featureCount !== 0)
        let pipeFeatures = new GeoJSON().readFeatures(pipeFeaturesObj.result.features)
        let features = pipeFeatures.map((fea, index) => {
          let color = colorBox[index % 3]
          fea.setStyle(comSymbol.getLineStyle(5, color))
          return fea
        })
        this.pipeHealthLayer.getSource().addFeatures(features)
      })
    },

    randomPoint(center, range, num) {
      return new Array(num).fill(center).map(([centerX, centerY]) => {
        let x = Math.random() * range
        let y = Math.random() * range
        return [centerX + x, centerY + y]
      })
    },

    showLayer() {
      if (!this.form.project) return this.$message.warning('请先填写工程名称')
      this.initMap()
      this.defectLegend.forEach((item) => {
        this[item.layerName].setVisible(item.open)
      })
    },

    setThemLayerVisible(index, visible) {
      let legendParams = this.defectLegend[index],
        layer
      switch (legendParams.layerName) {
        case 'pipeDefectLayer':
          layer = this.pipeDefectLayer
          break
        case 'manholeDefectLayer':
          layer = this.manholeDefectLayer
          break
        case 'pipeHealthLayer':
          layer = this.pipeHealthLayer
          break
        case 'heatLayer':
          layer = this.heatLayer
          break
        default:
          return
      }
      layer.setVisible(visible)
      visible && this.openDefect()
    },
    changeArrow(index) {
      console.log('点击箭头')
      this.$set(this.showThemBox, index, !this.showThemBox[index])
    },
    comStyle(type, color) {
      let className = ''
      switch (type) {
        case 'circle':
          className = 'type-circle'
          break
        case 'square':
          className = 'type-square'
          break
        case 'line':
          className = 'type-line'
          break
      }
      return `item-${color} ${className}`
    },
    // 管道缺陷管理的信息
    openDefect() {
      let info = {
        icon: 'iconfont',
        id: 'pipelineDefect',
        label: '管道缺陷管理',
        meta: {
          title: '管道缺陷管理'
        },
        name: 'PipelineDefect',
        noShowingChildren: true,
        parentPathid: '/pipelineDefect',
        path: '',
        type: 'gis',
        widgetid: 'HalfPanel',
        data: '这是传递的参数'
      }
      // 这是map里的跳转方法
      this.$store.dispatch('map/changeMethod', info)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
.i-scrollbar {
  overflow: auto;
  @include scrollBar;
}

.testResultDiagram {
  padding: 0 12px !important;
  overflow-y: scroll;
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
  .see-btn {
    display: flex;
    flex-direction: row-reverse;
  }
  ul,
  li {
    padding: 0;
    margin: 0;
    list-style: none;
    font-size: 14px;
    font-family: Arial, Helvetica, sans-serif;
  }
}
.title {
  padding-left: 16px;
}
.title::before {
  position: relative;
  left: -10px;
  top: 2px;
  content: '';
  width: 5px;
  height: 18px;
  display: inline-block;
  background-color: #2d74e7;
}
.thematicMap-list {
  padding-left: 25%;
  display: flex;
  flex-direction: column;
  .transition-box {
    padding: 6px 0 6px 44px;
    box-sizing: border-box;
  }
}
.line-color {
  width: 140px;
  height: 10px;
  border: 1px solid #666;
  background: linear-gradient(to right, #3ce10f, #ff0602); /* 标准的语法 */
}
.text-mix-max {
  width: 140px;
  display: flex;
  padding: 8px 0;
  box-sizing: border-box;
  justify-content: space-between;
}
.type-circle {
  margin: 10px 0 10px 20px !important;
  &::before {
    position: relative;
    left: -20px;
    top: -2px;
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
  }
}
.type-square {
  margin: 10px 0 10px 20px !important;
  &::before {
    position: relative;
    left: -20px;
    top: -2px;
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: transparent !important;
    display: inline-block;
  }
}
.type-line {
  margin: 10px 0 10px 18px !important;
  &::before {
    position: relative;
    top: -2px;
    left: -20px;
    content: '';
    width: 40px;
    height: 8px;
    display: inline-block;
  }
}
.item-green {
  &::before {
    background-color: #f405ff;
    border: 1px solid #f405ff;
  }
}
.item-pink {
  &::before {
    background-color: #0c9923;
    border: 1px solid #0c9923;
  }
}
.item-red {
  &::before {
    background-color: #ff0000;
    border: 1px solid #ff0000;
  }
}
</style>