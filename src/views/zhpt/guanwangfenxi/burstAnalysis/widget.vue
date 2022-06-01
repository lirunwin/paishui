<template>
  <!-- 爆管分析 -->
  <div class="panel-container i-scrollbar">
    <div class="op-box">
      <el-button type="primary" size="small" style="width:100%" @click="selectPipe">选择爆管管线</el-button>
    </div>

    <!-- 分析结果 -->
    <div class="result-box">
      <div class="item-head">爆管管线
        <el-tooltip class="item" effect="dark" content="选择一根管线进行分析" placement="top">
          <span class="el-icon-info"></span>
        </el-tooltip>
      </div>
      <div class="result-description">
        <div class="result-title" v-cloak>{{burstInfo.description}}</div>
        <!-- <div v-cloak style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{burstInfo.addr}}</div> -->
        <div v-cloak>{{burstInfo.lonlat}}</div>
      </div>
    </div>
    <div class="op-box">
      <el-button type="primary" size="small" style="width:100%" @click="executeBurst" :loading="doLoading">开始分析</el-button>
    </div>
    <div class="result-total">
      <div class="panel-item">
        <div>必关阀门</div>
        <div><span>{{burstInfo.valveArray.length}}</span>个</div>
      </div>
      <div class="panel-item">
        <div>受影响管线</div>
        <div><span>{{burstInfo.pipeLength}}</span>m</div>
      </div>
      <div class="panel-item">
        <div>受影响设施</div>
        <div><span>{{burstInfo.facilities.length}}</span>个</div>
      </div>
    </div>
    <!-- 图表部分 -->
    <div class="table-chart">
      <div class="item-head">受影响阀门(<span>{{burstInfo.valveArray.length}}</span>个)
        <el-button type="primary" size="mini" style="margin-left:10px" @click="reExecuteBurst">二次分析</el-button>
        <el-tooltip class="item" effect="dark" content="可设置失效阀门,进行二次分析" placement="top">
          <span class="el-icon-info"></span>
        </el-tooltip>
      </div>
      <div class="table-container">
        <el-table ref="valvesTable" :data="burstInfo.valveArray" stripe max-height="200" @row-click="tableRowLook"
                  :header-cell-style="{fontSize: '14px', fontWeight:'600',background:'#eaf1fd',color:'#909399'}" style="width: 100%">
          <el-table-column type="selection" align="center" width="50"></el-table-column>
          <el-table-column prop="SID" label="编号" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ADJUNCT" label="附属物" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="SPEC" label="规格" align="center" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="tableRowLook(scope)">查看</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
    </div>
    <div class="table-chart">
      <div class="item-head">所有结果
        <el-button type="text" size="middle" style="margin-left:10px" @click="viewDetails">查看详情</el-button>
      </div>
      <div class="table-container">
        <el-table :data="totalResultTable" stripe max-height="200"
                  :header-cell-style="{fontSize: '14px', fontWeight:'600',background:'#eaf1fd',color:'#909399'}" style="width: 100%">
          <el-table-column label="序号" align="center">
            <template slot-scope="scope"><span>{{scope.$index+1}}</span></template>
          </el-table-column>
          <el-table-column prop="name" label="名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="num" label="数量" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <download-excel style="display: inline-block;" :data="scope.row.data" :fields="scope.row.fields" type="xls"
                              :name="scope.row.name">
                <el-button type="text">导出</el-button>
              </download-excel>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="op-box">
      <el-button type="danger" size="small" style="width:100%" @click="clearBurstResult">清除结果</el-button>
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
import { Style, Circle, Icon, Fill, Stroke, Text } from 'ol/style';
import * as turf from '@turf/turf'
import { getCenter } from 'ol/extent';
import { comSymbol } from '@/utils/comSymbol';
import burstImg from '@/assets/images/burst.png';
import iDraw from '@/views/zhpt/common/mapUtil/draw';
import iQuery from '@/views/zhpt/common/mapUtil/query';

export default {
  props: ['data'],
  data() {
    return {
      selectFlag: false,
      doLoading: false,
      selectPipeConfig: '',

      burstSegmentID: [], // 爆管的弧段id
      burstPoint: null, //爆管点
      burstSegment: null, // 爆管弧段
      valveIDs: [], // 阀门数据
      tempValveIDs: [], // 二次分析临时存储阀门id
      burstInfo: {
        description: '',
        addr: '',
        lonlat: '',
        valveArray: [],
        pipeArray: [],
        pipeLength: 0,
        facilities: []
      },
      totalResultTable: [],

      //
      map: null,
      vectorLayer: null,
      drawer: null,
      selectedPipe: null
    }
  },
  watch: {
    // 监听面板是否被改变
    '$store.state.map.P_editableTabsValue': function (val, oldVal) {
      if (val !== 'burstAnalysis') this.clearAll()
      else this.init()
    }
  },
  mounted() {
    // 创建显示图层
    this.map = this.data.mapView
    this.init()
  },
  destroyed() {
    this.clearAll()
  },
  methods: {
    init () {
      this.vectorLayer = new VectorLayer({ source: new VectorSource(), style: comSymbol.getAllStyle(5, "F00", 5, '#0ff', 'rgba(255,255,255, 0.5)')})
      this.map.addLayer(this.vectorLayer)
    },

    clearAll () {
      this.map.removeLayer(this.vectorLayer)
      this.drawer && this.drawer.end()
      this.drawer = this.vectorLayer = null
      // 销毁结果面板
      this.$store.dispatch('map/handelClose', {
        box:'HalfPanel',
        pathId: 'queryResultMore',
        widgetid: 'HalfPanel',
      });
    },
    /**
     * 选择管线
     */
    selectPipe() {
      this.drawer && this.drawer.end()
      this.vectorLayer && this.vectorLayer.getSource().clear()
      this.drawer = new iDraw(this.map, "point", {
        endDrawCallBack: drawFea => {
          let coordinates = drawFea.getGeometry().getCoordinates()
          let fea = new GeoJSON().readFeature(turf.buffer(turf.point(coordinates), 0.3 / 1000, { units: 'kilometers' }))
          this.getAnalysisPipe(fea).then(resObj => {
            if (resObj) {
              let featureJson = resObj.result.features.features[0]
              let feature = new GeoJSON().readFeature(featureJson)
              let burstPoint = new Feature({ geometry: new Point(coordinates)})
              burstPoint.setStyle(new Style({ image: new Icon({ src: burstImg, scale: 0.8, size: [34, 34] }) }))
              this.vectorLayer.getSource().addFeature(feature)
              this.vectorLayer.getSource().addFeature(burstPoint)

              feature.set("attachName", resObj.attachName)
              feature.set("tableName", resObj.tableName)

              // 
              this.burstInfo.description = `${feature.get('TYPE')}: ${feature.get("S_POINT")} / ${feature.get('E_POINT')}发生爆管`
              this.burstInfo.lonlat = `坐标: ${coordinates[0].toFixed(3)} , ${coordinates[1].toFixed(3)}`

              this.selectedPipe = feature.values_
              
              this.burstAnalysis(feature.values_)
              this.drawer.end()
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
    /**
     * 查询获取管线
     */
    getAnalysisPipe (fea) {
      let dataSetInfo = [{ name: "TF_PSPS_PIPE_B", label: "排水管", attachName: "TF_PSPS_POINT_B" }]
      return new Promise(resolve => {
        new iQuery({ dataSetInfo }).spaceQuery(fea).then(resArr => {
          let featuresObj = resArr.find(res => res && res.result.featureCount !== 0)
          if (featuresObj) resolve(featuresObj)
          else resolve(null)
        })
      })
    },
    /**
     * 爆管分析
     */
    burstAnalysis (data) {
      console.log('')
    },
    /**
     * 分析
     */
    executeBurst() {
      this.doLoading = true // 执行状态
      this.selectFlag = false // 关闭选择
      /**先查询阀门的ID */
      let queryParam = new SuperMap.FilterParameter({
        name: this.selectPipeConfig.netWorkNodeLayer, // 网络数据集图层名称
        attributeFilter: "ADJUNCT LIKE '%阀%'"
      })
      let queryBySQLParams = new SuperMap.QueryBySQLParameters({
        queryParams: [queryParam],
      })
      let queryBySQLService = new SuperMap.QueryBySQLService(this.selectPipeConfig.mapUrl, {
        eventListeners: {
          "processCompleted": this.queryValveCompleted,
          "processFailed": this.processFailed
        }
      })
      queryBySQLService.processAsync(queryBySQLParams);
    },
    /**
     * 查询阀门结果
     */
    queryValveCompleted(res) {
      console.log('啦啦啦啦bug', this.burstSegmentID)
      if (this.burstSegmentID.length == 0) {
        this.$message.error('请选择爆管点！')
        this.doLoading = false // 关闭执行状态
        return;
      }
      // console.log("阀门查询结果", res)
      let valves = res.result.recordsets[0].features.features
      let valveIDs = []
      valves.forEach(item => {
        valveIDs.push(item.properties.SmID)
      });
      this.valveIDs = valveIDs // 保存阀门数据
      this.tempValveIDs = valveIDs // 保存临时阀门数据（用于二次分析）
      this.BurstPipelineAnalyst(valveIDs)
    },
    /**
     * 再次分析
     */
    reExecuteBurst() {
      this.doLoading = true // 执行状态
      let currentSelect = this.$refs.valvesTable.selection;
      let IDs = currentSelect.map(item => { return item.SmID })
      let differenceIDs = this.tempValveIDs.concat(IDs).filter(v => this.valveIDs.includes(v) && !IDs.includes(v)) // 排查失效阀门
      this.tempValveIDs = differenceIDs
      // 再次执行分析
      this.BurstPipelineAnalyst(differenceIDs)
    },
    /**
     * 获取网络分析配置
     */
    getNetWorkConfig(selectInfo) {
    },
    /**
     * 展示爆管点信息
     */
    writeBurstInfo(burstPipeID, coordinate) {
      this.burstInfo.description = this.selectPipeConfig.name + burstPipeID + '发生爆管'
      this.burstInfo.addr = '位置：'
      this.burstInfo.lonlat = '坐标：' + parseFloat(coordinate[0]).toFixed(3) + '，' + parseFloat(coordinate[1]).toFixed(3)
    },
    /**
     * 显示爆管弧段和爆管点
     */
    showBurstPoint() {
      this.vectorLayer.getSource().clear() // 清空显示
      let burstPoint = new Feature({
        geometry: this.burstPoint,
      })
      burstPoint.setStyle(new Style({
        image: new Icon({
          src: burstImg
        })
      }))
      this.data.that.popupWindowClose() // 清除地图视图点击选择的要素,关闭弹窗
      // 显示爆管点和弧段
      this.vectorLayer.getSource().addFeatures(new GeoJSON().readFeatures(this.burstSegment).concat(burstPoint))
      this.doLoading = false // 关闭执行状态
    },
    /**
     * 服务错误提示
     */
    processFailed(res) {
      this.$message.error(`分析失败，${res.error.errorMsg}`);
      this.doLoading = false // 关闭执行状态
    },
    /**
     * 爆管分析
     */
    BurstPipelineAnalyst(valvesArray) {
      var parameter = new SuperMap.BurstPipelineAnalystParameters({
        sourceNodeIDs: valvesArray, //设施点ID数组
        edgeID: this.burstSegmentID,  //爆管弧段ID，既查询弧段内容
        nodeID: null,   //爆管结点ID （注：edgeID 与 nodeID 不能同时使用）
        isUncertainDirectionValid: true //指定不确定流向是否有效
      });

      var burstPipelineAnalystService = new SuperMap.BurstPipelineAnalystService(this.selectPipeConfig.netWorkServiceurl, {
        eventListeners: {
          "processCompleted": this.BurstPipelineAnalyst_processCompleted,
          "processFailed": this.processFailed
        }
      });
      burstPipelineAnalystService.processAsync(parameter);
    },
    /**
     * 爆管分析成功
     */
    BurstPipelineAnalyst_processCompleted(res) {
      // console.log('分析成功', res)
      //上下游中受爆管位置影响的弧段ID
      let edgeID = res.result.edges
      //爆管分析中受爆管位置影响的上下游的关键设施点ID（最关键）
      let criticalNodes = res.result.criticalNodes
      //爆管分析中受爆管位置影响的常规设施点ID
      let normalNodes = res.result.normalNodes

      // this.queryBySQL(criticalNodes.concat(normalNodes), edgeID)
      this.queryBySQL(criticalNodes, edgeID)
    },
    /**
     * 通过受影响的弧段和关键设施点ID查询到对应的对象
     */
    queryBySQL(criticalNodes, edgeID) {
      let queryParam = new SuperMap.FilterParameter({
        name: this.selectPipeConfig.netWorkNodeLayer, // 网络数据集结点图层名称
        attributeFilter: "SmNodeID in (" + criticalNodes + ")"
      })
      let str = "("
      for (var i = 0; i < edgeID.length; i++) {
        if (i != edgeID.length - 1) str += edgeID[i] + ","
        else str += edgeID[i] + ")"
      }
      let queryParam2 = new SuperMap.FilterParameter({
        name: this.selectPipeConfig.netWorkLayerName, // 网络数据集图层名称
        attributeFilter: "SMID in " + str
      })
      let queryBySQLParams = new SuperMap.QueryBySQLParameters({
        queryParams: [queryParam, queryParam2],
      })

      let queryBySQLService = new SuperMap.QueryBySQLService(this.selectPipeConfig.mapUrl, {
        eventListeners: {
          "processCompleted": this.processCompleted,
          "processFailed": this.processFailed
        }
      })
      queryBySQLService.processAsync(queryBySQLParams);
    },
    /** 
     * 分析的最终结果
    */
    processCompleted(res) {
      this.showBurstPoint() // 重新显示爆管弧段和爆管点
      console.log('分析最终结果', res)
      let recordsets = res.result.recordsets
      this.burstInfo.valveArray = []
      this.burstInfo.pipeArray = []
      this.totalResultTable = []

      recordsets.forEach(item => {
        let features = item.features.features
        let pipeLength = new Number()
        if (features.length > 0)
          if (features[0].geometry.type == 'Point') {
            features.forEach(pointFeature => {
              pointFeature.properties['geometry'] = pointFeature.geometry
              this.burstInfo.valveArray.push(pointFeature.properties)
              // 显示设施
              this.vectorLayer.getSource().addFeature(new Feature({
                geometry: new GeoJSON().readGeometry(pointFeature.geometry)
              }))
            });
            this.totalResultTable.push({
              name: '受影响阀门',
              num: this.burstInfo.valveArray.length + '个',
              data: this.burstInfo.valveArray,
              fields: this.getFields('point')
            })
          } else {
            features.forEach(LineFeature => {
              LineFeature.properties['geometry'] = LineFeature.geometry
              this.burstInfo.pipeArray.push(LineFeature.properties)
              pipeLength += parseFloat(LineFeature.properties.SmLength)
              let edgeGeometry = new GeoJSON().readGeometry(LineFeature.geometry)
              // 显示管道
              this.vectorLayer.getSource().addFeature(new Feature({
                geometry: edgeGeometry
              }))
            });
            this.burstInfo.pipeLength = pipeLength.toFixed(1)
            this.totalResultTable.push({
              name: '受影响管线',
              num: this.burstInfo.pipeArray.length + '个' + '/' + this.burstInfo.pipeLength + 'm',
              data: this.burstInfo.pipeArray,
              fields: this.getFields('line')
            })
            // 查询受影响设施
            this.queryPoint(features)
          }
      });
    },
    /**
     * 查询受影响的设施
     * 说明：这里用管段的起止点编号进行SQL查询
     * 设施点的编号与管段的起止点编号相同
     */
    queryPoint(pipeFeatures) {
      let str = "("
      for (var i = 0; i < pipeFeatures.length; i++) {
        let item = pipeFeatures[i].properties;
        if (i != pipeFeatures.length - 1) str += "'" + item.START_SID + "','" + item.END_SID + "',"
        else str += "'" + item.START_SID + "','" + item.END_SID + "')"
      }
      let sqlQueryParam = new SuperMap.GetFeaturesBySQLParameters({
        toIndex: -1,
        maxFeatures: 10000000,
        datasetNames: [this.selectPipeConfig.facilitiesDatasetName],
        queryParameter: { attributeFilter: "SID in " + str }
      })
      let url = mapConfig.iServerUrl.pipelineDataServer.url
      //向服务器发送请求，并对返回的结果进行处理
      new FeatureService(url).getFeaturesBySQL(sqlQueryParam, serviceResult => {
        if (serviceResult.type == "processFailed") {
          this.$message.error(`查询受影响设施失败，${serviceResult.error.errorMsg}!`);
          this.doLoading = false // 关闭执行状态
          return
        }
        let features = serviceResult.result.features.features
        if (features.length == 0) return
        else {
          features.forEach(pointFeature => {
            pointFeature.properties['geometry'] = pointFeature.geometry
            this.burstInfo.facilities.push(pointFeature.properties)
          });
          this.totalResultTable.push({
            name: '受影响设施',
            num: this.burstInfo.facilities.length + '个',
            data: this.burstInfo.facilities,
            fields: this.getFields('point')
          })
        }
        this.doLoading = false // 关闭执行状态
      })
    },
    /**
     * 获取字段，Excel导出时使用
     */
    getFields(type) {
      let fields = {}
      if (type == 'line')
        this.$store.state.common.PipeLineFields.forEach(item => {
          fields[item.pipelineVal] = item.pipelineKey
        });
      else {
        this.$store.state.common.PipePointFields.forEach(item => {
          fields[item.pipelineVal] = item.pipelineKey
        });
      }
      return fields
    },
    /**
     * 点击查看
     */
    tableRowLook(row) {
      let popupPosition = [] // 弹窗位置
      let geometry = new GeoJSON().readGeometry(row.geometry)
      // 弹窗的信息
      let infoObject = {
        properties: row,
        dataType: { label: '' },
        geometry: row.geometry
      }

      let feature = new Feature({
        geometry: geometry,
      })
      if (geometry.getType() == 'LineString') {
        popupPosition = getCenter(geometry.getExtent())
        infoObject.dataType.label = this.selectPipeConfig.name
      } else {
        popupPosition = geometry.getCoordinates()
        infoObject.dataType.label = this.selectPipeConfig.pointName
      }
      // 弹窗显示
      this.data.that.popupWindowShow(popupPosition, infoObject)
      setTimeout(() => {
        this.data.that.map.getView().fit(feature.getGeometry().getExtent(), { duration: 600 })
      }, 200);
    },
    /**
     * 清除爆管分析
     */
    clearBurstResult() {
      this.selectFlag = false
      this.pipeName = ''
      this.vectorLayer.getSource().clear()
      this.burstInfo = {
        description: '',
        addr: '',
        lonlat: '',
        valveArray: [],
        pipeArray: [],
        pipeLength: 0,
        facilities: []
      }
      this.burstSegmentID = []
      this.selectPipeConfig = {}
      this.totalResultTable = []
      //
      this.drawer.end()
    },
    /** 查询结果查看详情 */
    viewDetails() {
      
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
