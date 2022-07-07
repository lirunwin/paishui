<template>
  <!-- 预警分析 -->
  <div class="panel-container i-scrollbar">
    <div class="op-box">
      <div class="item-head" style="margin-top:0">预警图层</div>
      <el-form label-width="70px">
        <el-form-item label="图层名称" style="margin:0">
          <el-select v-model="selectLayer" value-key="value" placeholder="请选择图层" style="width:100%" size="small">
            <el-option-group v-for="group in layerGroups" :key="group.label" :label="group.label">
              <el-option
                v-for="item in group.layers"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="op-box">
      <div class="item-head" style="margin-top:0">预警设置</div>
      <el-form label-width="33%" label-position="left">
        <el-form-item label="服务年限" style="margin:0">
          <el-row>
            <el-col :span="9" style="padding-right:5px">
              <el-select size="small" v-model="queryForm.completionDate.calc">
                <el-option
                  v-for="(item, index) in calcOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="13">
              <el-input size="small" type="number" v-model="queryForm.completionDate.MDATE"></el-input>
            </el-col>
            <el-col :span="2">&nbsp;&nbsp;&nbsp;月</el-col>
          </el-row>
        </el-form-item>
        <el-row>
          <!-- 动态添加的条件 -->
          <div v-for="(item, i) in filterArr" :key="i">
            <el-row style="height:40px;line-height: 40px;">
              <el-col :span="8" style="padding-right:5px">
                <el-select
                  size="small"
                  v-model="filterArr[i].field"
                  placeholder="字段名"
                  @change="fieldChange(i, filterArr[i].field)"
                >
                  <el-option
                    v-for="(item, index) in fieldKeys"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="6" style="padding-right:5px">
                <el-select size="small" v-model="filterArr[i].operator" placeholder="">
                  <el-option
                    v-for="(item, index) in calcOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                  <el-option label="like" value="like"></el-option>
                  <el-option label="= (字符)" value="=="></el-option>
                </el-select>
              </el-col>
              <el-col :span="9">
                <el-select size="small" v-model="filterArr[i].val" placeholder="字段值">
                  <el-option
                    v-for="(item, index) in filterArr[i].OnlyVals"
                    :key="index"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="1" style="padding-left:5px">
                <span
                  class="el-icon-circle-close item-close"
                  style="vertical-align:middle;"
                  title="移除条件"
                  @click="deleteParamItem(i)"
                ></span>
              </el-col>
            </el-row>
          </div>
        </el-row>
        <!-- <el-form-item label="埋设日期" style="margin:0">
          <el-row>
            <el-col :span="6" style="padding-right:5px">
              <el-select v-model="queryForm.completionDate.calc" placeholder="" size="small">
                <el-option v-for="(item,index) in calcOptions" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col :span="18">
              <el-date-picker v-model="queryForm.completionDate.MDATE" type="date" placeholder="选择日期" size="small"
                              value-format="yyyy-MM-dd" style="width:100%">
              </el-date-picker>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="更新日期" style="margin:0">
          <el-row>
            <el-col :span="6" style="padding-right:5px">
              <el-select v-model="queryForm.changeDate.calc" placeholder="" size="small">
                <el-option v-for="(item,index) in calcOptions" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col :span="18">
              <el-date-picker v-model="queryForm.changeDate.UPDATETIME" type="date" placeholder="选择日期" size="small"
                              value-format="yyyy-MM-dd" style="width:100%">
              </el-date-picker>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="探测日期" style="margin:0">
          <el-row>
            <el-col :span="6" style="padding-right:5px">
              <el-select v-model="queryForm.expiredDate.calc" placeholder="" size="small">
                <el-option v-for="(item,index) in calcOptions" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col :span="18">
              <el-date-picker v-model="queryForm.expiredDate.SDATE" type="date" placeholder="选择日期" size="small"
                              value-format="yyyy-MM-dd" style="width:100%">
              </el-date-picker>
            </el-col>
          </el-row>
        </el-form-item> -->
        <!-- <el-form-item label="维护次数" style="margin:0">
          <el-row>
            <el-col :span="6" style="padding-right:5px">
              <el-select v-model="queryForm.maintainNum.calc" placeholder="" size="small">
                <el-option v-for="(item,index) in calcOptions" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col :span="18">
              <el-input-number size="small" v-model="queryForm.maintainNum.REPAIRNUM" controls-position="right" :min="0" style="width:100%">
              </el-input-number>
            </el-col>
          </el-row>
        </el-form-item> -->
      </el-form>
      <el-button type="primary" size="small" style="width:100%;margin-top:10px" @click="addNewParam"
        >新增条件</el-button
      >
    </div>

    <!-- <tf-legend class="legend_dept" style="margin-left:4px;"  label="筛选条件" isopen="false" title="选择将要查询的字段。">
            <ul class="sqlQueryUl" style="height: 150px; margin-bottom: 5px" v-loading="attLoading">
              <li v-for="(item, id) in analysisAtt" :key="id" @click="addText(item.value + ' ', item.value.length + 1, true)" >{{ item.label }}</li>
              <span style="color: #C0C4CC;letter-spacing: 1px;margin-left: 5px;" v-if="!analysisAtt.length">{{selectLayer ? '图层无字段' : '请选择图层查询字段'}}</span>
            </ul>
            <div style="width: 100%; margin-bottom:10px;">
              <div style="width: 130px; float: left">
                <div style="margin-bottom: 3px">
                  <el-button size="mini" type="primary" plain @click="addText('=', 2)" style="width:56px">＝</el-button>
                  <el-button size="mini" type="primary" plain @click="addText('like \'%%\'', 7)" style="width:56px">模糊</el-button>
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
              <div style="width: calc(100% - 130px); float: right;margin-bottom:10px;">
                <ul class="sqlQueryUl" style="height: 120px" v-loading="fixLoading">
                  <li v-for="(item, id) in layerFix" :key="id" @click="addText('\'' + item + '\' ', item.length + 3)">{{ item }}</li>
                  <span style="color: #C0C4CC;letter-spacing: 1px;margin-left: 5px;" v-if="!layerFix.length">请选择字段</span>
                </ul>
              </div>
              <div style="clear:both; color:#499CD6; font-size:12px;">{{ queText }}</div>
            </div>
          </tf-legend> -->
    <div class="op-box">
      <div class="item-head">预警范围</div>
      <el-radio v-model="warningExtent" label="1">全图分析</el-radio>
      <el-radio v-model="warningExtent" label="2">绘制区域分析</el-radio>
    </div>
    <div class="op-box">
      <el-button type="primary" size="small" style="width:100%" @click="execute" :loading="loading">预警分析</el-button>
    </div>
    <!-- 表格 -->
    <div class="table-chart">
      <div class="item-head">预警结果</div>
      <div class="table-container">
        <el-table
          :data="totalResultTable"
          v-loading="loading"
          stripe
          max-height="200"
          :header-cell-style="{ fontSize: '14px', fontWeight: '600', background: '#eaf1fd', color: '#909399' }"
          style="width: 100%"
        >
          <template slot="empty">
            <img src="@/assets/icon/null.png" alt="" />
          </template>
          <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
          <el-table-column prop="name" label="图层" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="num" label="数量" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="viewDetails(scope.row)">查看</el-button>
              <download-excel
                style="display: inline-block;"
                :data="scope.row.data"
                :fields="scope.row.fields"
                type="xls"
                :name="scope.row.name"
              >
                <el-button type="text">导出</el-button>
              </download-excel>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="op-box">
      <el-button type="danger" size="small" style="width:100%" @click="clearReasult">清除结果</el-button>
    </div>
  </div>
</template>

<script>
import { appconfig } from 'staticPub/config'
import Draw from 'ol/interaction/Draw'
import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import { Style, Circle, Icon, Fill, RegularShape, Stroke, Text } from 'ol/style'
import { SuperMap, FeatureService } from '@supermap/iclient-ol'
import { GeoJSON } from 'ol/format'
import { comSymbol } from '@/utils/comSymbol'
import iDraw from '@/views/zhpt/common/mapUtil/draw'
import iQuery from '../../common/mapUtil/query'
import { Point, LineString } from 'ol/geom'
import * as turf from '@turf/turf'
import Feature from 'ol/Feature'
import { mapUtil } from '@/views/zhpt/common/mapUtil/common'
import tfLegend from '@/views/zhpt/common/Legend'

export default {
  props: ['data'],
  components: { tfLegend },
  data() {
    return {
      loading: false,
      selectLayer: '',

      draw: null,

      layerGroups: [],

      features: [],
      queryForm: {
        completionDate: {
          calc: '>',
          MDATE: '24'
        },
        changeDate: {},
        expiredDate: {},
        maintainNum: { REPAIRNUM: 0 }
      },
      inputMonth: 24,
      calcOptions: [{ label: '=', value: '=' }, { label: '>', value: '>' }, { label: '<', value: '<' }],
      queryExtent: null,
      //
      totalResultTable: [],
      mapView: null,
      vectorLayer: null,
      warningExtent: '1',
      drawer: null,
      limitFeature: null,
      vectorLayer: null,
      lightLayer: null,
      //
      attLoading: false,
      analysisAtt: [],
      fixLoading: false,
      layerFix: [],

      filterArr: [],
      fieldKeys: []
    }
  },
  watch: {
    warningExtent(val, oldVal) {
      if (val === '2') {
        this.drawer =
          this.drawer ||
          new iDraw(this.mapView, 'polygon', {
            endDrawCallBack: this.drawFunc,
            showCloser: false
          })
        this.drawer.start()
      } else {
        this.drawer && this.drawer.end()
        this.drawer = null
      }
    },
    // 监听面板是否被改变
    '$store.state.map.P_editableTabsValue': function(val, oldVal) {
      if (val !== 'warningAnalysis') this.removeAll()
      else this.init()
    },
    selectLayer(n, o) {
      this.fieldKeys = []
      this.filterArr = []
      // MDATE 埋设日期是固定字段
      mapUtil.getFields(n).then((fieldArr) => {
        // .filter(field => field.field !== 'MDATE')
        this.fieldKeys = fieldArr.map((obj) => {
          return { value: obj.field, label: obj.name }
        })
      })
    }
  },
  computed: {
    queText() {
      return '111'
    }
  },
  mounted() {
    this.init()
  },
  destroyed() {
    this.removeAll()
  },
  methods: {
    addText() {},
    removeAll() {
      this.drawer && this.drawer.end()
      this.mapView.removeLayer(this.vectorLayer)
      this.mapView.removeLayer(this.lightLayer)
      this.closeHalfPanel()
      this.drawer = this.vectorLayer = this.lightLayer = null
    },
    init() {
      // 初始化显示图层
      this.mapView = this.data.mapView
      this.vectorLayer = new VectorLayer({ source: new VectorSource(), style: mapUtil.getCommonStyle() })
      this.lightLayer = new VectorLayer({ source: new VectorSource(), style: mapUtil.getCommonStyle(true) })
      this.mapView.addLayer(this.vectorLayer)
      this.mapView.addLayer(this.lightLayer)

      //
      let [name, type] = appconfig.initLayers.split('&&')
      let layer = mapUtil.getAllSubLayerNames(name, type)
      // 设置图层
      this.layerGroups = layer.sublayers.map((layer) => {
        let layers = layer.sublayers.map((sub) => {
          return { label: sub.title, value: sub.name.split('@')[0] }
        })
        return { label: layer.title, value: layer.name, layers }
      })
    },
    // 绘制完成
    drawFunc(feature) {
      this.limitFeature = feature
      this.drawer.remove()
    },

    /**新增条件 */
    addNewParam() {
      this.filterArr.push({})
    },
    deleteParamItem(index) {
      this.filterArr.splice(index, 1)
    },

    /** 获取对应的唯一值*/
    async fieldChange(index, field) {
      mapUtil.getUniqueValue(this.selectLayer, field).then((res) => {
        res = res.filter((res) => res)
        this.$set(this.filterArr[index], 'OnlyVals', res)
      })
    },

    // 获取过滤条件
    checkQueryParams() {
      let sqlStr = ''
      // 拼接固定字段
      for (const key in this.queryForm) {
        let queryType = this.queryForm[key]
        if (Object.keys(queryType).length == 2) {
          let operator,
            field,
            val = null
          for (const k in queryType) {
            let queryParmas = queryType[k]
            if (k == 'calc') operator = queryParmas
            else {
              val = queryParmas
              field = k
            }
          }
          if (field && operator && val) {
            if (field == 'REPAIRNUM') {
              sqlStr += field + ' ' + operator + ' ' + val + ' AND '
            } else if (field === 'MDATE') {
              // 这里把服务年限转化成 埋设日期的比较
              let dateArr = new Date().toLocaleDateString().split('/')
              let month = val % 12,
                year = (val - (val % 12)) / 12
              dateArr[0] -= year
              dateArr[1] -= month
              // val = new Date([...dateArr]).toLocaleDateString().replace(/\//g, '-') + " 00:00:00"
              val = new Date([...dateArr]).toLocaleDateString()
              sqlStr += field + ' ' + operator + ' ' + val + ' AND '
            } else sqlStr += field + ' ' + operator + " '" + val + "' AND "
          }
        }
      }
      // 拼接动态字段
      this.filterArr.forEach((item) => {
        if (item.field && item.operator && item.val) {
          if (item.operator == 'like') {
            sqlStr += item.field + ' ' + item.operator + " '%" + item.val + "%' AND "
          } else if (item.operator == '==') {
            sqlStr += item.field + " = '" + item.val + "' AND "
          } else {
            sqlStr += item.field + ' ' + item.operator + ' ' + item.val + ' AND '
          }
        }
      })
      sqlStr = sqlStr.substr(0, sqlStr.length - 5) // 去掉最后一个AND
      // console.log('查询条件：', sqlStr)
      return sqlStr
    },
    // 分析
    execute() {
      console.log(1111)
      if (this.warningExtent === '2' && !this.limitFeature) return this.$message.error('请先绘制查询范围')
      if (!this.selectLayer) return this.$message.error('请选择查询图层')

      let findLayer,
        dataSetInfo = []
      this.layerGroups.forEach((layer) => {
        let find = layer.layers.find((sub) => sub.value === this.selectLayer)
        if (find) {
          findLayer = find
        }
      })
      this.loading = true
      dataSetInfo = [{ name: findLayer.value, label: findLayer.label }]
      let sqlStr = this.checkQueryParams()
      new iQuery({ dataSetInfo }).sqlQuery(sqlStr).then((resArr) => {
        this.loading = false
        let featuresObj = resArr.find((item) => item && item.result.featureCount !== 0)
        if (featuresObj) {
          let tableName = featuresObj.tableName
          let featuresJson = featuresObj.result.features
          let features = new GeoJSON().readFeatures(featuresJson)
          if (this.limitFeature) {
            features = features.filter((feature) => {
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
          let center = mapUtil.getCenterFromFeatures(features)
          new mapUtil(this.mapView).setZoomAndCenter(17, center)

          this.vectorLayer.getSource().addFeatures(features)
          //
          let fields = {}
          let data = features.map((fea) => fea.values_)
          mapUtil.getFields(tableName).then((fieldArr) => {
            fieldArr.forEach((fieldObj) => {
              fields[fieldObj.name] = fieldObj.field
              this.totalResultTable = [
                { name: featuresObj.layerName, num: features.length, features, fields, data, tableName }
              ]
            })
          })
        }
      })
    },
    /**清除结果 */
    clearReasult() {
      this.vectorLayer.getSource().clear()
      this.lightLayer.getSource().clear()
      this.selectLayer = ''
      this.queryForm = {
        completionDate: {
          calc: '>',
          MDATE: '24'
        },
        changeDate: {},
        expiredDate: {},
        maintainNum: { REPAIRNUM: 0 }
      }
      this.totalResultTable = []
      this.drawer && this.drawer.clear()
      this.warningExtent = '1'
      this.closeHalfPanel()
    },
    /**查看详情 */
    viewDetails(row) {
      let { data, tableName } = row
      if (data.length === 0) return
      mapUtil.getFields(tableName).then((res) => {
        let colsData = res.map((obj) => {
          return { prop: obj.field, label: obj.name }
        })
        this.closeHalfPanel()
        this.$store.dispatch('map/changeMethod', {
          pathId: 'queryResultMore',
          widgetid: 'HalfPanel',
          label: '详细信息',
          param: { data, colsData, rootPage: this }
        })
      })
    },
    gotoGeometry(geometry) {
      if (!this.lightLayer) {
        this.lightLayer = new VectorLayer({
          source: new VectorSource(),
          style: comSymbol.getAllStyle(3, '#f40', 5, '#FFFFB6')
        })
        this.lightLayer.setZIndex(999)
        this.mapView.addLayer(this.lightLayer)
      }
      this.lightLayer.getSource().clear()
      this.lightFeature = new Feature({ geometry })
      this.lightLayer.getSource().addFeature(this.lightFeature)

      let extent = geometry.getExtent()
      let center = [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2]
      this.mapView.getView().setCenter(center)
      this.mapView.getView().setZoom(20)
    },
    closeHalfPanel() {
      this.$store.dispatch('map/handelClose', {
        box: 'HalfPanel',
        pathId: 'queryResultMore',
        widgetid: 'HalfPanel'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './css.scss';
@import '~@/styles/mixin.scss';
.i-scrollbar {
  overflow: auto;
  @include scrollBar;
}
</style>
