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
      >
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
        max-height="180px"
        border
        style="width: 100%;margin-bottom: 8px;"
        row-class-name="selectRowC"
        @row-click="getFeature"
      >
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
      <el-link
        style=" position: absolute; top: -25px; right: 25px;"
        type="primary"
        @click="showMoreInfo"
        :disabled="!rowData && attData.length <= 0"
      >更多</el-link>
      <el-table :data="attData" stripe max-height="270px">
        <el-table-column prop="fix" label="字段" />
        <el-table-column prop="att" label="属性" />
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
import { fieldDoc } from '@/views/zhpt/common/doc'


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
      fields: ['LNO', 'S_POINT', 'E_POINT', 'MATERIAL'],
      rowData: null
    }
  },
  computed: {
    sidePanelOn() {
      return this.$store.state.map.P_editableTabsValue
    }
  },
  mounted() {},
  watch: {
    sidePanelOn(newTab, oldTab) {
      if (newTab !== "queryForSpace") this.removeAll()
    }
  },
  methods: {
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
            this.addDetail(res)
          })
        },
        showCloser: false
      })
      this.drawer.start()

      function query(feature, callback) {
        let queryTask = new iQuery()
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
            !that.queryLayer && that.initLayer()
            that.queryLayer.getSource().addFeatures(feas)
          })
        })
      }
    },
    // 初始化图层
    initLayer() {
      this.queryLayer = new VectorLayer({
        source: new VectorSource(),
        style: comSymbol.getAllStyle(3, '#f40', 5, '#C0DB8D')
      })
      this.data.mapView.addLayer(this.queryLayer)
    },
    // 统计
    addStatistic (dataArr) {
      console.log('总长')
      let lengthField = 'SMLENGTH', layerData = []
      dataArr.forEach(item => {
        if (item && item.result.featureCount !== 0) {
          let layer = item.layerName;
          let num = item.result.featureCount;
          let sumLength = item.result.features.features.reduce((prev, next) => {
            return { properties: { "SMLENGTH": Number(prev.properties[lengthField] || 0) + Number(next.properties[lengthField] || 0) } }
          }, { properties: { "SMLENGTH": 0 } })

          let features = item.result.features
          layerData.push({ layer, num, length: sumLength.properties["SMLENGTH"], features })
        }
      })
      this.layerData = layerData
    },
    // 详情
    addDetail (dataArr) {
      console.log("详情", dataArr)
      let detailData = [];
      this.columns = this.fields.map(field => {
        return { prop: field, label: fieldDoc[field] }
      })
      dataArr.forEach(item => {
        if (item && item.result.featureCount !== 0) {
          let features = item.result.features.features
          features.forEach(fea => detailData.push(fea.properties))
        }
      })
      this.featureData = detailData
    },
    // 字段
    addField (row) {
      let attData = []
      this.rowData = row
      for (let key in row) {
        attData.push({ fix: key, att: fieldDoc[key] || key})
      }
      this.attData = attData
    },
    getFeature (row) {
      console.log(row)
      this.addField(row)
    },

    clearQuery() {  
      this.drawer && this.drawer.end()
      this.queryLayer && this.queryLayer.getSource().clear()
      this.drawer = null
      this.rowData = null
      this.attData = []
      this.featureData = []
      this.layerData = []
    },
    removeEvent() {
      if (this.eventMove) this.eventMove.remove()
      if (this.eventClick) this.eventClick.remove()
    },
    loadLayerName() {
      var url = appconfig.gisResource.layer_name.config[0].url
      $.ajax({
        url: url,
        type: 'POST',
        data: {
          usertoken: appconfig.usertoken,
          layerids: JSON.stringify(this.getLayers),
          f: 'pjson'
        },
        dataType: 'json',
        success: (data) => {
          if (data.code == 10000) {
            var layersData = []
            var layerIndex = {}
            for (var i = 0, il = data.result.rows, ii = il.length; i < ii; i++) {
              var layer = il[i]
              layersData.push(layer)
              layerIndex[layer.layerid] = layer
            }
            this.layerIndex = layerIndex
            this.layerList = layersData
          }
        }
      })
    },
    showMoreInfo() {
      let colsData = []
      for (let key in this.rowData) {
        if (fieldDoc[key]) {
          colsData.push({ prop: key, label: fieldDoc[key]})
        }
      }
      // 测试先显示20条
      colsData.length = 20
      this.$store.dispatch('map/changeMethod', {
        pathId: 'queryResultMore',
        widgetid: 'HalfPanel',
        label: '更多信息',
        param: { data: [this.rowData], colsData }
      })
    },
    removeAll () {
      this.drawer && this.drawer.end()
      this.queryLayer && this.queryLayer.getSource().clear()
      this.drawer = this.queryLayer = null
      this.$store.dispatch('map/handelClose', {
        box:'HalfPanel',
        pathId: 'queryResultMore',
        widgetid: 'HalfPanel',
      });
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
