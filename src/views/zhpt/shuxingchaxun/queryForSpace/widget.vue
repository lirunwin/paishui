<template>
  <div style="padding: 0 8px;overflow-y:auto;" class="i-scrollbar">
    <tf-legend class="legend_dept" label="设施统计" isopen="true" title="点击空间绘制按钮，在地图上绘制空间范围过滤查询。">
      <el-button-group>
        <el-tooltip content="点选" placement="top" effect="light">
          <el-button size="mini" @click="spaceQuery('point')" plain>
            <img src="./images/G.png" width="20px" height="20px" style="object-fit: contain" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="框选" placement="top" effect="light">
          <el-button size="mini" @click="spaceQuery('rect')" plain>
            <img src="./images/R.png" width="20px" height="20px" style="object-fit: contain" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="圆形选择" placement="top" effect="light">
          <el-button size="mini" @click="spaceQuery('circle')" plain>
            <img src="./images/C.png" width="20px" height="20px" style="object-fit: contain" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="多边形选择" placement="top" effect="light">
          <el-button size="mini" @click="spaceQuery('polygon')" plain>
            <img src="./images/P.png" width="20px" height="20px" style="object-fit: contain" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="清除" placement="top" effect="light">
          <el-button size="mini" @click="clearQuery" plain>
            <img src="./images/N.png" width="20px" height="20px" style="object-fit: contain" />
          </el-button>
        </el-tooltip>
        <!-- <div v-show="queryLoading" class="titleS" style="display: inline-block; font-size: 14px;"><i class="el-icon-loading"></i>查询中</div> -->
      </el-button-group>
      <el-table
        ref="featureTable"
        highlight-current-row
        :data="layerData"
        stripe
        max-height="180px"
        v-loading="queryLoading"
        style="margin-bottom: 8px;"
        row-class-name="selectRowC"
        @row-click="showDetail"
      >
        <template slot="empty">
          <img src="@/assets/icon/null.png" alt="">
          <p class="empty-p">暂无数据</p>
        </template>
        <el-table-column prop="layer" label="图层名称" width="100" />
        <el-table-column prop="num" label="数量" />
        <el-table-column prop="length" label="总长(m)">
          <template slot-scope="props">{{ props.row.length ? props.row.length.toFixed(2) : '-' }}</template>
        </el-table-column>
      </el-table>
    </tf-legend>
    <tf-legend
      class="legend_dept"
      label="设施信息"
      isopen="true"
      title="查询要素信息列表。"
      v-loading="featuresLoading"
    >
      <el-table
        ref="featuresTable"
        highlight-current-row
        :data="featureData"
        stripe
        max-height="280px"
        border
        style="width: 100%;margin-bottom: 8px;"
        row-class-name="selectRowC"
        @row-click="showMoreInfo"
      >
        <template slot="empty">
          <img src="@/assets/icon/null.png" alt="">
          <p class="empty-p">暂无数据</p>
        </template>
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          show-overflow-tooltip
        />
      </el-table>
    </tf-legend>
    <tf-legend
      class="legend_dept"
      label="设施详情"
      isopen="true"
      title="显示选中的要素详情信息。"
      v-loading="attLoading"
    >
      <el-table :data="attData" stripe max-height="400px">
        <template slot="empty">
          <img src="@/assets/icon/null.png" alt="">
          <p class="empty-p">暂无数据</p>
        </template>
        <el-table-column prop="att" label="属性" />
        <el-table-column prop="value" label="值" />
      </el-table>
    </tf-legend>
  </div>
</template>

<script>
import { attConfig } from '@/views/zhpt/tongyonggongju/queryResult3/attributeConfig'
import { attAllConfig } from '@/views/zhpt/shuxingchaxun/queryForSpace/attConfig'
import { appconfig } from 'staticPub/config'
import tfLegend from '@/views/zhpt/common/Legend'

import iDraw from '@/views/zhpt/common/mapUtil/draw'
import iQuery from '@/views/zhpt/common/mapUtil/query'
import * as turf from '@turf/turf'
import GeoJSON from 'ol/format/GeoJSON'
import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import { comSymbol } from '@/utils/comSymbol'
import { fieldDoc, pointFieldDoc } from '@/views/zhpt/common/doc'
import Feature from 'ol/Feature'
import { mapUtil } from '../../common/mapUtil/common'


export default {
  name: 'queryForSpace',
  components: { tfLegend },
  props: { data: Object },
  data() {
    return {
      // 要素统计
      layerData: [],
      queryLoading: false,

      // 要素信息
      featuresLoading: false,
      columns: [],
      featureData: [],

      //  要素详情
      infoId: undefined,
      attLoading: false,
      attData: [],

      // add
      drawer: null,
      queryService: null,
      queryLayer: null,
      fields: [],
      rowData: null
    }
  },
  computed: {
    sidePanelOn() {
      return this.$store.state.map.P_editableTabsValue
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    sidePanelOn(newTab, oldTab) {
      if (newTab !== "queryForSpace") this.removeAll()
      else this.init()
    }
  },
  methods: {
    init () {
      this.queryLayer = new VectorLayer({ source: new VectorSource(), style: mapUtil.getCommonStyle() })
      this.data.mapView.addLayer(this.queryLayer)
      this.lightLayer = new VectorLayer({ source: new VectorSource(), style: mapUtil.getCommonStyle(true) })
      this.data.mapView.addLayer(this.lightLayer)
    },
    // 显示详情
    showDetail (row) {
      let features = row.features.features
      let tableName = row.tableName
      this.featureData = features.map(fea => {
        return { ...fea.properties, geometry: fea.geometry, tableName }
      })
      mapUtil.getFields(tableName).then(res => {
        console.log('字段', res)
        let cols = res.filter(i => {
          return i.name.includes('唯一编号') 
          || i.name.includes('类型')
          || i.name.includes('类别')
          || i.name.includes('地址')
        })
        this.columns = cols.map(item => {
          return { label: item.name, prop: item.field,  }
        })
      })
    },
    // 空间查询
    spaceQuery(type) {
      let that = this
      this.drawer && this.drawer.end()
      this.queryLayer && this.queryLayer.getSource().clear()
      this.drawer = new iDraw(this.data.mapView, type, {
        endDrawCallBack: feature => {
          this.drawer.remove()
          query(feature, res => {
            this.addStatistic(res)
          })
        },
        showCloser: false
      })
      this.drawer.start()

      function query(feature, callback) {
        let dataSetInfo = mapUtil.getAllSubLayerNames('排水管线').map(layerInfo => {
          return { name: layerInfo.name, label: layerInfo.title }
        })
        let queryTask = new iQuery({ dataSetInfo })
        let geometry = null
        // 如果是点，缓冲距离
        if (type === 'point') {
          const dis = 1e-3
          feature = turf.buffer(turf.point(feature.getGeometry().getCoordinates()), dis, { units: 'kilometers' })
        }
        queryTask.spaceQuery(feature).then(resArr => {
          callback(resArr)
          let features = []
          resArr.forEach(item => {
            if (item && item.result.featureCount !== 0) {
              features.push(item.result.features)
            } else {
            }
          })
          features.forEach(feaJson => {
            let feas = new GeoJSON().readFeatures(feaJson)
            that.queryLayer.getSource().addFeatures(feas)
          })
        })
      }
    },
    // 统计
    addStatistic (dataArr) {
      let lengthField = 'SMLENGTH', layerData = []
      dataArr.forEach(item => {
        if (item && item.result.featureCount !== 0) {
          let layer = item.layerName;
          let tableName = item.tableName
          let num = item.result.featureCount;
          let sumLength = item.result.features.features.reduce((prev, next) => {
            return { properties: { "SMLENGTH": Number(prev.properties[lengthField] || 0) + Number(next.properties[lengthField] || 0) } }
          }, { properties: { "SMLENGTH": 0 } })

          let features = item.result.features
          layerData.push({ layer, tableName, num, length: sumLength.properties["SMLENGTH"], features })
        }
      })
      this.layerData = layerData
    },
    // 详情
    // addDetail (dataArr, doc) {
    //   this.columns = this.fields.map(field => {
    //     return { prop: field, label: doc[field] }
    //   })
    //   this.featureData = dataArr.map(data => {
    //     return { geometry: data.geometry, ...data.properties }
    //   })
    // },

    clearQuery() {  
      this.drawer && this.drawer.end()
      this.queryLayer && this.queryLayer.getSource().clear()
      this.drawer = null
      this.rowData = null
      this.attData = []
      this.featureData = []
      this.layerData = []
    },
    showMoreInfo(row, doc) {
      let geometry = new GeoJSON().readGeometry(row.geometry)
      let fea = new Feature({ geometry })
      this.lightLayer.getSource().clear()
      this.lightLayer.getSource().addFeature(fea)
      let center = mapUtil.getCenter(fea)
      let view = this.data.mapView.getView()
      view.setCenter(center)
      view.setZoom(20)
      // 
      mapUtil.getFields(row.tableName).then(res => {
        this.attData = res.map(item => {
          return { value: row[item.field], att: item.name }
        })
      })
    },
    removeAll () {
      this.drawer && this.drawer.end()
      this.queryLayer && this.queryLayer.getSource().clear()
      this.lightLayer && this.lightLayer.getSource().clear()
      this.drawer = this.queryLayer = null
      this.$store.dispatch('map/handelClose', {
        box:'HalfPanel',
        pathId: 'queryResultMore',
        widgetid: 'HalfPanel',
      });
    },
    gotoGeometry (geometry) {
      geometry = new GeoJSON().readGeometry(geometry)
      if (!this.lightLayer) {
        this.lightLayer = new VectorLayer({ source: new VectorSource(), style: comSymbol.getAllStyle(5, '#FFFFB6', 5, '#FFFFB6') })
        this.lightLayer.setZIndex(999)
        this.data.mapView.addLayer(this.lightLayer)
      }
      this.lightLayer.getSource().clear()
      this.lightFeature = new Feature({ geometry })
      this.lightLayer.getSource().addFeature(this.lightFeature)
    }
  },
  destroyed() {
    this.removeAll()
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  .i-scrollbar {
    @include scrollBar;
  }
</style>
