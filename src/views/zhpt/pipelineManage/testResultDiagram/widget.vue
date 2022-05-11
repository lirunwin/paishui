<template>
  <div class="testResultDiagram i-scrollbar" :data="'这个是data'">
    <!-- 检测成果专题图 -->
    <p class="title">显示设置</p>
    <el-form ref="form" :model="form" label-width="auto" :rules="rules">
      <el-form-item label="工程名称:" prop="name">
        <el-select @change='projectChange' v-model="form.project" placeholder="工程名称">
          <el-option
            v-for="(item, index) in projectOpt"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="检测报告:">
        <el-select :disabled="!form.project" v-model="form.report" placeholder="请选择检测报告">
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
              <li @click="openBox(item.layerName, i)" v-for="(level, i) in item.level" :key="i" :class="comStyle(item.type, level.color)">
                {{ level.label + ' / ' + level.num + level.unit }}
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
import { Point, LineString, Polygon } from 'ol/geom'
import Heatmap from 'ol/layer/Heatmap'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { comSymbol } from '@/utils/comSymbol'
import iDraw from '@/views/zhpt/common/mapUtil/draw'
import iQuery from '@/views/zhpt/common/mapUtil/query'
import { appconfig } from 'staticPub/config'
import GeoJSON from 'ol/format/GeoJSON'
import { getDefectDataById, getDefectData, getProject, getReportByProjecetId, getDefectDataByFilter } from '@/api/sysmap/drain'
import { projUtil } from '@/views/zhpt/common/mapUtil/proj'

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

      // 报告数据
      reportOpt: [
      ],
      // 工程数据
      projectOpt: [
      ],
      defectLegend: [
        // {
        //   title: '管网缺陷密度图',
        //   layerName: 'heatLayer',
        //   open: false,
        //   type: 'gradient',
        //   start: '少',
        //   end: '多'
        // },
        {
          title: '管网缺陷分布专题图',
          layerName: 'pipeDefectLayer',
          open: true,
          type: 'circle',
          level: [
            { color: 'green', label: 'Ⅰ级', num: 0, unit: '个' },
            { color: 'blue', label: 'Ⅱ级', num: 0, unit: '个' },
            { color: 'pink', label: 'Ⅲ级', num: 0, unit: '个' },
            { color: 'red', label: 'Ⅳ级', num: 0, unit: '个' }
          ]
        },
        // {
        //   title: '检查井缺陷分布专题图',
        //   layerName: 'manholeDefectLayer',
        //   open: false,
        //   type: 'square',
        //   level: [
        //     { color: 'green', label: '井盖缺失', num: 111, unit: '个' },
        //     { color: 'red', label: '井盖破损', num: 111, unit: '个' },
        //     { color: 'pink', label: '井盖移位', num: 111, unit: '个' }
        //   ]
        // },
        {
          title: '管网健康评估专题图',
          layerName: 'pipeHealthLayer',
          open: true,
          type: 'line',
          level: [
            { color: 'green', label: 'Ⅰ级', num: 0, unit: '条' },
            { color: 'blue', label: 'Ⅱ级', num: 0, unit: '条' },
            { color: 'pink', label: 'Ⅲ级', num: 0, unit: '条' },
            { color: 'red', label: 'Ⅳ级', num: 0, unit: '条' }
          ]
        }
      ],
      showThemBox: [true, true, true, true],

      mapView: null,
      heatLayer: null,
      pipeDefectLayer: null,
      manholeDefectLayer: null,
      pipeHealthLayer: null,
      currentDataProjName: "proj43",
      projUtil: null
    }
  },
  mounted() {
    this.init()
  },
  destroyed() {
    this.clearAll()
  },
  watch: {
    '$store.state.gis.activeSideItem': function (n, o) {
      if (n !== '检测成果专题图') {
        this.clearAll()
      } else {
        this.init()
      }
    }
  },
  methods: {
    init () {
      this.projUtil = new projUtil()
      this.projUtil.resgis(this.currentDataProjName)

      this.mapView = this.data.mapView
      this.heatLayer = new Heatmap({
        source: new VectorSource(),
        gradient: ['#3ce10f', '#ff0602'],
        radius: 16,
        visble: false
      })
      this.pipeDefectLayer = new VectorLayer({ source: new VectorSource(), visible: true })
      this.manholeDefectLayer = new VectorLayer({ source: new VectorSource(), visible: false })
      this.pipeHealthLayer = new VectorLayer({ source: new VectorSource(), visible: true })
      this.lightLayer = new VectorLayer({ source: new VectorSource(), style: comSymbol.getAllStyle(6, 'rgba(0, 255, 255, 0.6)', 9, 'rgba(0, 255, 255, 0.6)'), visible: true  })
      this.addLayers([this.heatLayer, this.pipeDefectLayer, this.manholeDefectLayer, this.pipeHealthLayer, this.lightLayer])

      this.setProjectData()
    },
    clearAll () {
      this.heatLayer && this.mapView.removeLayer(this.heatLayer)
      this.pipeDefectLayer && this.mapView.removeLayer(this.pipeDefectLayer)
      this.manholeDefectLayer && this.mapView.removeLayer(this.manholeDefectLayer)
      this.pipeHealthLayer && this.mapView.removeLayer(this.pipeHealthLayer)
      this.lightLayer && this.mapView.removeLayer(this.lightLayer)
    },
    setProjectData () {
      getProject({ current: 1, size: 1e5 }).then(res => {
        if (res.code === 1) {
          // label, value
          this.projectOpt = res.result.records.map(record => {
            return { label: record.prjName, value: record.prjNo }
          })
        } else this.$message.error('获取工程项目失败!')
      })
    },
    projectChange () {
      let prjNo = this.form.project
      getReportByProjecetId({ prjNo }).then(res => {
        if (res.code === 1) {
          this.form.report = ''
          let data = res.result
          this.reportOpt = data.map(d => {
            return { label: d.wordInfoName, value: d.id }
          })
        } else this.$message.error('获取报告失败!')
      })
    },
    openBox (layerName, level) {
      console.log('缺陷信息', type, level)
      let type = layerName === 'pipeHealthLayer' ? 1 : 0
      let filter = [
        { key: 'defectLevel', value: ['一级','二级','三级','四级'] },
        { key: 'funcClass', value: ['Ⅰ','Ⅱ','Ⅲ','Ⅳ'] }
      ][type]

      let features = this[layerName].getSource().getFeatures()
      let filterFeas = features.filter(fea => fea.get(filter.key).includes(filter.value[level]))
      let lightFeas = filterFeas.map(fea => new Feature({ geometry: fea.getGeometry().clone() }))
      this.lightLayer.getSource().clear()
      this.lightLayer.getSource().addFeatures(lightFeas)
      this.openDefect()
    },
    addLayers(layers) {
      layers.forEach((layer) => this.mapView.addLayer(layer))
    },
    initMap(data) {
      // 管网缺陷
      let pipeData = [], defectData = []
      data.forEach(rpt => {
        let pipeStates = rpt.pipeStates
        pipeData = [...pipeData, ...pipeStates]
        defectData = [...defectData, ...pipeStates.map(pipe => pipe.pipeDefects).flat()]
      })
      let dFeas = this.getFeatures(defectData, 2)
      let pFeas = this.getFeatures(pipeData, 1)
      
      this.lightLayer.getSource().clear()
      this.pipeHealthLayer.getSource().addFeatures(pFeas)
      this.pipeDefectLayer.getSource().addFeatures(dFeas)
    },

    /**
     * 构造要素
     * @param type 类型1: 线，2：点
     * @param hasStyle 是否设置样式
     * */
    getFeatures(featureArr, type, hasStyle = true) {
      let style = null,
        features = []
      if (type === 1) {
        let num = [0, 0, 0, 0] // 四个级别缺陷数量
        featureArr.forEach((feaObj) => {
          let { startPointXLocation, startPointYLocation, endPointXLocation, endPointYLocation } = feaObj
          if (startPointXLocation && startPointYLocation && endPointXLocation && endPointYLocation) {
            let startPoint = [Number(startPointXLocation), Number(startPointYLocation)]
            let endPoint = [Number(endPointXLocation), Number(endPointYLocation)]
            startPoint = this.projUtil.transform(startPoint, this.currentDataProjName, 'proj84')
            endPoint = this.projUtil.transform(endPoint, this.currentDataProjName, 'proj84')

            let coors = [startPoint, endPoint]
            let feature = new Feature({ geometry: new LineString(coors) })
            // 健康等级颜色
            let colors = [
              { level: 'Ⅰ', color: 'green', index: 0 },
              { level: 'Ⅱ', color: 'blue', index: 1 },
              { level: 'Ⅲ', color: 'pink', index: 2 },
              { level: 'Ⅳ', color: 'red', index: 3 }
            ]
            let findColor = colors.find((colorObj) => feaObj['funcClass'].includes(colorObj.level))

            if (findColor) {
              num[findColor.index] += 1
              hasStyle && feature.setStyle(comSymbol.getLineStyle(5, findColor.color))
              for (let i in  feaObj) {
                i !== "geometry" && feature.set(i, feaObj[i])
              }
              features.push(feature)
            }
          }
        })
        // 把数量填充到图例
        this.defectLegend[1].level.forEach((l, index) => {
          l.num = num[index]
        })
      } else {
        let num = [0, 0, 0, 0] // 四个级别缺陷数量
        featureArr.forEach((feaObj, index) => {
          if (feaObj.geometry) {
            let coors = JSON.parse(feaObj.geometry)
            let point = this.projUtil.transform([coors.x, coors.y], this.currentDataProjName, 'proj84')
            let feature = new Feature({ geometry: new Point(point) })
            let colors = [
              { level: '一级', color: 'green', index: 0 },
              { level: '二级', color: 'blue', index: 1 },
              { level: '三级', color: 'pink', index: 2 },
              { level: '四级', color: 'red', index: 3 }
            ]
            let findColor = colors.find(colorObj => feaObj['defectLevel'].includes(colorObj.level))
            
            // let imgBox = [defectImgLB, defectImgB, defectImgY, defectImgR], img = imgBox[3]
            // if (feaObj.defectLevel) {
            //   let index = ["一级", '二级', '三级', '四级']
            //   img = imgBox[index.indexOf(feaObj.defectLevel)]
            // }
            if (findColor) {
              num[findColor.index] += 1
              hasStyle && feature.setStyle(comSymbol.getAllStyle(5, findColor.color, 0, 'rgba(0,0,0,0)'))
              for (let i in  feaObj) {
                i !== "geometry" && feature.set(i, feaObj[i])
              }
              features.push(feature)
            }
            

            // let fea = feature.clone()
            // fea.setStyle(new Style({ text: new Text({ text: `${index}`, offsetY: -20 }) }))
            // features.push(fea)
          }
        })
        // 把数量填充到图例
        this.defectLegend[0].level.forEach((l, index) => {
          l.num = num[index]
        })
      }
      return features
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
      let params = {
        prjNo: this.form.project,
        ids: this.form.report,
        jcStartDate: this.form.startDate ? this.form.startDate.toLocaleDateString().replace(/\//g, '-') : '',
        jcEndDate: this.form.endDate ? this.form.endDate.toLocaleDateString().replace(/\//g,   '-') : ''
      }
      getDefectDataByFilter(params).then(res => {
        if (res.code === 1) {
          let data = res.result
          if (data.length !== 0) {
            this.initMap(data)
          } else this.$message.info('无管线缺陷数据')
        } else this.$message.error('请求缺陷数据出错')

      })
      
      this.defectLegend.forEach((item) => {
        this[item.layerName].setVisible(item.open)
      })
    },

    setThemLayerVisible(index, visible) {
      let legendParams = this.defectLegend[index], layer
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
      this.lightLayer.getSource().clear()
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
  cursor: pointer;
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
  cursor: pointer;
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
  cursor: pointer;
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
.item-blue {
  &::before {
    background-color: blue;
    border: 1px solid blue;
  }
}
.item-green {
  &::before {
    background-color: #0c9923;
    border: 1px solid #0c9923;
  }
}
.item-pink {
  &::before {
    background-color: #f405ff;
    border: 1px solid #f405ff;
  }
}
.item-red {
  &::before {
    background-color: #ff0000;
    border: 1px solid #ff0000;
  }
}
</style>