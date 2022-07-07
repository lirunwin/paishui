<template>
  <!-- 查询统计---综合查询 -->
  <div style="padding: 0 8px;overflow-y:auto;" class="i-scrollbar">
    <tf-legend class="legend_dept" label="图层名称" isopen="true" title="选择将要进行查询的图层。">
      <el-select v-model="layerId" placeholder="请选择">
        <el-option-group v-for="group in layerGroups" :key="group.label" :label="group.label">
          <el-option v-for="item in group.layers" :key="item.label" :label="item.label" :value="item.value"></el-option>
        </el-option-group>
      </el-select>
    </tf-legend>
    <tf-legend class="legend_dept" label="图层字段" isopen="true" title="选择将要查询的字段。">
      <ul class="sqlQueryUl" style="height: 150px" v-loading="attLoading">
        <li v-for="(item, id) in analysisAtt" :key="id" @click="addText(item.value + ' ', item.value.length + 1, true)">
          {{ item.label }}
        </li>
        <span style="color: #C0C4CC;letter-spacing: 1px;margin-left: 5px;" v-if="!analysisAtt.length">{{
          layerId ? '图层无字段' : '请选择图层查询字段'
        }}</span>
      </ul>
    </tf-legend>
    <tf-legend
      class="legend_dept"
      label="构造查询语句"
      isopen="true"
      title="查询条件的计算逻辑，及图层属性字段对应的唯一值。"
    >
      <div style="width: 100%">
        <div style="width: 130px; float: left">
          <div style="margin-bottom: 3px">
            <el-button size="mini" type="primary" plain @click="addText('=', 2)" style="width:56px">＝</el-button>
            <el-button size="mini" type="primary" plain @click="addText('like \'%%\'', 7)" style="width:56px"
              >模糊</el-button
            >
          </div>
          <div style="margin-bottom: 3px">
            <el-button size="mini" type="primary" plain @click="addText('<>', 3)" style="width:56px">≠</el-button>
            <el-button size="mini" type="primary" plain @click="addText('and ', 4)" style="width:56px">与</el-button>
          </div>
          <div style="margin-bottom: 3px">
            <el-button size="mini" type="primary" plain @click="addText('>', 2)" style="width:56px">＞</el-button>
            <el-button size="mini" type="primary" plain @click="addText('<', 2)" style="width:56px">＜</el-button>
          </div>
          <div>
            <el-button size="mini" type="primary" plain @click="addText('or ', 3)" style="width:56px">或</el-button>
            <el-button size="mini" type="primary" plain @click="addText('% ', 2)" style="width:56px">占位</el-button>
          </div>
        </div>
        <div style="width: calc(100% - 130px); float: right">
          <ul class="sqlQueryUl" style="height: 120px" v-loading="fixLoading">
            <li v-for="(item, id) in layerFix" :key="id" @click="addText('\'' + item + '\' ', item.length + 3)">
              {{ item }}
            </li>
            <span style="color: #C0C4CC;letter-spacing: 1px;margin-left: 5px;" v-if="!layerFix.length">请选择字段</span>
          </ul>
        </div>
      </div>
    </tf-legend>
    <tf-legend
      class="legend_dept"
      label="组合查询条件"
      isopen="true"
      style="clear: both"
      title="选择字段、属性及构造语句组合成查询过滤的语句，通过构建的条件过滤数据。"
    >
      <el-input
        v-model="queText"
        ref="textBox"
        type="textarea"
        :rows="3"
        placeholder="请输入查询过滤条件，如:OBJECTID > 0"
      />
      <label style="color: #409eff;display: flex;margin: 6px 0;font-size:14px;">{{ queTextName }}</label>
      <tf-legend
        class="legend_dept"
        label="空间过滤条件"
        isopen="true"
        title="点击按钮，在地图上绘制范围，以绘制范围为空间过滤进行查询。"
      >
        <el-row style="margin-bottom: 8px">
          <el-button size="mini" type="primary" @click="drawRect">绘制范围</el-button>
          <el-button size="mini" type="primary" @click="clearRect">清除范围</el-button>
        </el-row>
      </tf-legend>
      <el-button
        size="mini"
        type="primary"
        style="width:100%;display:block;"
        @click="queryResult"
        :disabled="analysisDisable"
      >
        <i v-if="analysisDisable" class="el-icon-loading" />查询</el-button
      >
      <el-button
        size="mini"
        type="primary"
        style="width:100%;display:block;margin-left: 0;margin-top:8px;"
        @click="clearAll"
        >清空</el-button
      >
    </tf-legend>
    <tf-legend class="legend_dept" label="查询结果" isopen="true" title="显示查询统计结果。">
      <el-table @row-click="rowC" :data="finalData" stripe style="width: 100%">
        <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
        <template slot="empty">
          <img src="@/assets/icon/null.png" alt="" />
        </template>
        <el-table-column prop="name" label="图层" width="80px" align="center" />
        <el-table-column prop="value" label="数量(个)" align="center" />
        <el-table-column prop="length" label="长度(m)" align="center">
          <template slot-scope="props">{{ props.row.length ? props.row.length.toFixed(2) : '-' }}</template>
        </el-table-column>
      </el-table>
    </tf-legend>
  </div>
</template>

<script>
import { appconfig } from 'staticPub/config'
import tfLegend from '@/views/zhpt/common/Legend'

import iDraw from '@/views/zhpt/common/mapUtil/draw'
import iQuery from '@/views/zhpt/common/mapUtil/query'
import GeoJSON from 'ol/format/GeoJSON'
import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import { comSymbol } from '@/utils/comSymbol'
import { Polygon, LineString, Point } from 'ol/geom'
import * as turf from '@turf/turf'
import { fieldDoc } from '@/views/zhpt/common/doc'
import { getThemLayer, addThemLayer, deleteThemLayer } from '@/api/mainMap/themMap'
import { SuperMap, FieldService, FeatureService, FieldParameters } from '@supermap/iclient-ol'
import { mapUtil } from '@/views/zhpt/common/mapUtil/common'
import { Feature } from 'ol'

export default {
  name: 'queryForSQL',
  components: { tfLegend },
  props: { data: Object },
  data() {
    return {
      attLoading: false,
      fixLoading: false,
      layerId: '',
      queText: '',
      queTextName: '',
      layersAtt: [],
      analysisAtt: [],
      layerFix: [],
      panel: {
        pathId: 'queryResult3',
        widgetid: 'HalfPanel',
        label: '查询结果',
        param: {}
      },
      finalData: [],
      Extent: null,
      analysisDisable: false,
      queryLayer: null,

      // add
      limitFeature: null, // 绘制图形
      drawer: null,
      layerGroups: []
    }
  },
  computed: {
    sidePanelOn() {
      return this.$store.state.map.P_editableTabsValue
    }
  },
  watch: {
    layerId(e) {
      if (!e) return
      mapUtil.getFields(e).then((res) => {
        if (res) {
          this.analysisAtt = res.map((field) => {
            return { label: field.name, value: field.field }
          })
        } else this.$message.error('获取字段失败')
      })
    },
    sidePanelOn(newTab, oldTab) {
      if (newTab !== 'queryForSQL') this.clearAll()
    },
    queText(newValue, oldValue) {
      if (newValue.length < oldValue.length || newValue == '') this.queTextName = ''
    }
  },
  mounted: function() {
    let [name, type] = appconfig.initLayers.split('&&')
    let layer = mapUtil.getAllSubLayerNames(name, type)
    // 设置图层
    this.layerGroups = layer.sublayers.map((layer) => {
      let layers = layer.sublayers.map((sub) => {
        return { label: sub.title, value: sub.name.split('@')[0] }
      })
      return { label: layer.title, value: layer.name, layers }
    })

    this.mapView = this.data.mapView
  },
  methods: {
    addText: function(text, length, isField) {
      this.languageChange(text, length, isField)
      var myField = this.$refs.textBox.$refs.textarea
      var startL = myField.selectionStart
      this.queText =
        this.queText.substring(0, startL) + text + this.queText.substring(myField.selectionEnd, myField.value.length)
      myField.blur()
      setTimeout(() => {
        myField.selectionStart = myField.selectionEnd = startL + length
        myField.focus()
      })
      isField && this.getUniqueValue(text)
    },
    getUniqueValue(filed) {
      mapUtil.getUniqueValue(this.layerId, filed).then((res) => {
        if (res) {
          this.layerFix = res
        } else this.$message.error('获取唯一值失败')
      })
    },
    languageChange(text, length, isField) {
      if (isField) {
        const field = this.analysisAtt.find((item) => item.value === text.replace(' ', ''))
        const fname = field ? field.label : text
        this.queTextName = this.queTextName + fname
      } else {
        if (text.indexOf('=') != -1) text = '等于'
        if (text.indexOf('like') != -1) text = '中存在'
        if (text.indexOf('>') != -1) text = '大于'
        if (text.indexOf('<') != -1) text = '小于'
        if (text.indexOf('<>') != -1) text = '不等于'
        if (text.indexOf('and') != -1) text = '并且'
        if (text.indexOf('or') != -1) text = '或者'
        if (text.indexOf('%') != -1) text = '占位'
        this.queTextName = this.queTextName + text
      }
    },
    // 绘制
    drawRect: function() {
      this.drawer = new iDraw(this.mapView, 'polygon', {
        showCloser: false,
        endDrawCallBack: (featrue) => {
          this.limitFeature = featrue
          this.drawer.remove()
        }
      })
      this.drawer.start()
    },

    clearRect: function() {
      this.drawer && this.drawer.end()
    },
    clearAll() {
      this.layerId = ''
      this.analysisAtt = []
      this.layerFix = []
      this.queText = ''
      this.queryLayer && this.mapView.removeLayer(this.queryLayer)
      this.queryLayer = null
      this.drawer && this.drawer.end()
      this.$store.dispatch('map/handelClose', {
        box: 'HalfPanel',
        pathId: 'queryResultMore',
        widgetid: 'HalfPanel'
      })
    },

    /**
     * 点击查询事件
     */
    queryResult() {
      if (!this.layerId) return this.$message.error('请选择查询图层名称')
      if (!this.queText) return this.$message.error('请选择查询图层过滤条件')

      this.queryLayer && this.mapView.removeLayer(this.queryLayer)
      this.queryLayer = null
      this.finalData = []
      let dataService = appconfig.gisResource['iserver_resource'].dataService
      let dataSetInfo = dataService.dataSetInfo.filter((info) => info.name === this.layerId)

      let queryTask = new iQuery({ dataSetInfo })
      queryTask.sqlQuery(this.queText).then((resArr) => {
        if (!resArr) return this.$message.error('服务器请求失败!')

        let featruesData = resArr.filter((item) => {
          return item.result.featureCount !== 0
        })
        //  添加表格数据

        // 绘制图层
        if (featruesData.length !== 0) {
          this.queryLayer = this.queryLayer || createThemLayer()
          this.mapView.addLayer(this.queryLayer)

          featruesData.forEach((featrueObj) => {
            let features = featrueObj.result.features.features
            let themFeatures = features.map((feature) => new GeoJSON().readFeature(feature))

            let layerName = featrueObj.layerName
            let tableName = featrueObj.tableName
            // 范围限制
            if (this.limitFeature) {
              themFeatures = themFeatures.filter((feature) => {
                let limitGeometry = turf.polygon(this.limitFeature.getGeometry().getCoordinates())
                let geomtry = feature.getGeometry(),
                  inGeometry
                if (geomtry instanceof Point) {
                  inGeometry = turf.point(geomtry.getCoordinates())
                } else if (geomtry instanceof LineString) {
                  inGeometry = turf.lineString(geomtry.getCoordinates())
                } else return false
                return turf.booleanContains(limitGeometry, inGeometry)
              })
            }
            //
            this.queryLayer.getSource().addFeatures(themFeatures)
            this.addResData(layerName, tableName, themFeatures)
          })
        } else return this.$message.error('无符合过滤条件数据')
      })

      function createThemLayer() {
        return new VectorLayer({
          source: new VectorSource(),
          style: mapUtil.getCommonStyle()
        })
      }
    },
    addResData(layerName, tableName, features) {
      const lengthField = 'SMLENGTH'
      let sumLength = features.reduce(
        (prev, next) => {
          return {
            values_: { SMLENGTH: Number(prev.values_[lengthField] || 0) + Number(next.values_[lengthField] || 0) }
          }
        },
        { values_: { SMLENGTH: 0 } }
      )
      this.finalData.push({
        name: layerName,
        tableName,
        value: features.length,
        length: sumLength.values_['SMLENGTH'],
        features
      })
    },

    rowC: function(row) {
      console.log('详情', row)
      let colsData = [],
        rowData = []
      mapUtil.getFields(row.tableName).then((fieldArr) => {
        rowData = row.features.map((fea) => fea.values_ || {})
        colsData = fieldArr.map((item) => {
          return { prop: item.field, label: item.name }
        })
        this.$store.dispatch('map/changeMethod', {
          pathId: 'queryResultMore',
          widgetid: 'HalfPanel',
          label: '更多信息',
          param: { rootPage: this, data: rowData, colsData }
        })
      })
    },
    gotoGeometry(geometry) {
      if (!this.lightLayer) {
        this.lightLayer = new VectorLayer({ source: new VectorSource(), style: mapUtil.getCommonStyle(true) })
        this.lightLayer.setZIndex(999)
        this.data.mapView.addLayer(this.lightLayer)
      }
      this.lightLayer.getSource().clear()
      this.lightFeature = new Feature({ geometry })
      this.lightLayer.getSource().addFeature(this.lightFeature)
      let view = this.mapView.getView()
      let center = mapUtil.getCenter(this.lightFeature)
      new mapUtil(this.mapView).setZoomAndCenter(20, center)
    }
  },
  destroyed() {
    this.clearAll()
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
.i-scrollbar {
  @include scrollBar;
}
</style>
