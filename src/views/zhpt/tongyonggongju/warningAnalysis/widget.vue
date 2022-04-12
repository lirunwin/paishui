<template>
  <!-- 预警分析 -->
  <div class="panel-container i-scrollbar">
    <div class="op-box">
      <div class="item-head" style="margin-top:0">预警图层</div>
      <el-form label-width="70px">
        <el-form-item label="选取图层" style="margin:0">
          <el-select v-model="selectLayer" value-key="value" placeholder="请选择图层" style="width:100%" size="small"
                     @change="selectLayerChange">
            <el-option v-for="item in datasetOptions" :key="item.value" :label="item.label" :value="item"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="op-box">
      <div class="item-head" style="margin-top:0">预警设置</div>
      <el-form label-width="70px">
        <el-form-item label="竣工日期" style="margin:0">
          <el-row>
            <el-col :span="6" style="padding-right:5px">
              <el-select v-model="queryForm.completionDate.calc" placeholder="" size="small">
                <el-option v-for="(item,index) in calcOptions" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col :span="18">
              <el-date-picker v-model="queryForm.completionDate.FINISHDATE" type="date" placeholder="选择日期" size="small"
                              value-format="yyyy-MM-dd" style="width:100%">
              </el-date-picker>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="修改日期" style="margin:0">
          <el-row>
            <el-col :span="6" style="padding-right:5px">
              <el-select v-model="queryForm.changeDate.calc" placeholder="" size="small">
                <el-option v-for="(item,index) in calcOptions" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col :span="18">
              <el-date-picker v-model="queryForm.changeDate.CHANGEDATE" type="date" placeholder="选择日期" size="small"
                              value-format="yyyy-MM-dd" style="width:100%">
              </el-date-picker>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="报废日期" style="margin:0">
          <el-row>
            <el-col :span="6" style="padding-right:5px">
              <el-select v-model="queryForm.expiredDate.calc" placeholder="" size="small">
                <el-option v-for="(item,index) in calcOptions" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col :span="18">
              <el-date-picker v-model="queryForm.expiredDate.SCRAPDATE" type="date" placeholder="选择日期" size="small"
                              value-format="yyyy-MM-dd" style="width:100%">
              </el-date-picker>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="维护次数" style="margin:0">
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
        </el-form-item>
        <!-- 动态添加的条件 -->
        <div v-for="(item,i) in filterArr" :key="i">
          <el-row style="height:40px;line-height: 40px;">
            <el-col :span="7" style="padding-right:5px">
              <el-select v-model="filterArr[i].field" placeholder="字段名" size="small" @change="fieldChange(i,filterArr[i].field)">
                <el-option v-for="(item,index) in fieldKeys" :key="index" :label="item.pipelineVal" :value="item.pipelineKey"></el-option>
              </el-select>
            </el-col>
            <el-col :span="7" style="padding-right:5px">
              <el-select v-model="filterArr[i].operator" placeholder="" size="small">
                <el-option v-for="(item,index) in calcOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                <el-option label="like" value="like"></el-option>
                <el-option label="= (字符)" value="=="></el-option>
              </el-select>
            </el-col>
            <el-col :span="9">
              <el-select v-model="filterArr[i].val" placeholder="字段值" size="small">
                <el-option v-for="(item,index) in filterArr[i].OnlyVals" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </el-col>
            <el-col :span="1" style="padding-left:5px">
              <span class="el-icon-circle-close item-close" style="vertical-align:middle;" title="移除条件" @click="deleteParamItem(i)"></span>
            </el-col>
          </el-row>
        </div>

      </el-form>
      <el-button type="primary" size="small" style="width:100%;margin-top:10px" @click="addNewParam">新增条件</el-button>
    </div>
    <div class="op-box">
      <div class="item-head">预警范围</div>
      <el-radio v-model="radio" label="1">全图分析</el-radio>
      <el-radio v-model="radio" label="2">绘制区域分析</el-radio>
    </div>
    <div class="op-box">
      <el-button type="primary" size="small" style="width:100%" @click="execute" :loading="loading">预警分析</el-button>
    </div>
    <!-- 表格 -->
    <div class="table-chart">
      <div class="item-head">预警结果</div>
      <div class="table-container">
        <el-table :data="totalResultTable" v-loading="loading" stripe max-height="200"
                  :header-cell-style="{fontSize: '14px', fontWeight:'600',background:'#eaf1fd',color:'#909399'}" style="width: 100%">
          <el-table-column prop="name" label="图层" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="num" label="数量" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="viewDetails">查看</el-button>
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
      <el-button type="danger" size="small" style="width:100%" @click="clearReasult">清除结果</el-button>
    </div>
  </div>
</template>

<script>
import { mapConfig } from '@/views/zhpt/map.config'
import Draw from 'ol/interaction/Draw'
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Style, Circle, Icon, Fill, RegularShape, Stroke, Text } from 'ol/style';
import { SuperMap, FeatureService } from '@supermap/iclient-ol';
import { GeoJSON, WFS } from 'ol/format';
export default {
  props: ["data"],
  data() {
    return {
      loading: false,
      radio: '1',
      selectLayer: '',
      totalResultTable: [],
      draw: null,
      vectorLayer: null,
      datasetOptions: [],
      filterArr: [],
      fieldKeys: [],
      features: [],
      queryForm: {
        completionDate: {},
        changeDate: {},
        expiredDate: {},
        maintainNum: { REPAIRNUM: 0 }
      },
      calcOptions: [
        { label: '=', value: '=' },
        { label: '>', value: '>' },
        { label: '<', value: '<' },
      ],
      queryExtent: null
    }
  },
  watch: {
    radio(val, oldVal) {
      /**开启关闭绘制预警范围 */
      if (val == '2') {
        this.drawExtent()
      } else {
        this.queryExtent = null
        if (this.draw) this.data.that.map.removeInteraction(this.draw)
      }
      this.vectorLayer.getSource().clear()
    },
    // 监听面板是否被改变
    '$store.state.map.P_editableTabsValue': function (val, oldVal) {
      if (val == 'warningAnalysis') {
        this.vectorLayer.setVisible(true)
      }
      else {
        this.vectorLayer.setVisible(false)
        if (this.draw) this.data.that.map.removeInteraction(this.draw)
      }
    }
  },
  mounted() {
    this.initData()
  },
  destroyed() {
    this.data.that.map.removeLayer(this.vectorLayer)
    if (this.draw) this.data.that.map.removeInteraction(this.draw)
  },
  methods: {
    initData() {
      // 初始化显示图层
      this.vectorLayer = new VectorLayer({
        source: new VectorSource(),
        style: new Style({
          stroke: new Stroke({
            width: 5,
            color: '#1c78c2'
          }),
          image: new Circle({
            radius: 7,
            stroke: new Stroke({
              width: 3,
              color: '#ffce44'
            }),
            fill: new Fill({
              color: '#FFF'
            })
          })
        })
      })
      this.data.that.map.addLayer(this.vectorLayer)

      this.datasetOptions = []
      // 数据集获取
      mapConfig.iServerUrl.pipelineDataServer.dataSetInfo.forEach(item => {
        this.datasetOptions.push({ label: item.label, value: item.name, type: item.type })
      });
    },
    /**
     * 绘制范围
     */
    drawExtent() {
      this.draw = new Draw({
        source: this.vectorLayer.getSource(),
        type: 'Polygon',
        style: new Style({
          stroke: new Stroke({
            lineDash: [10, 10],
            color: '#fc5531',
            width: 3
          }),
          fill: new Fill({
            color: 'rgba(252, 85, 49,0.2)'
          })
        })
      })
      this.data.that.map.addInteraction(this.draw)
      //结束绘制
      this.draw.on("drawend", evt => {
        this.data.that.map.removeInteraction(this.draw)
        evt.feature.setStyle(new Style({
          stroke: new Stroke({
            color: '#fc5531',
            width: 3
          }),
          fill: new Fill({
            color: 'rgba(252, 85, 49,0.2)'
          })
        }))
        this.queryExtent = evt.feature.getGeometry()
      })
    },
    /**选择分析图层 */
    selectLayerChange() {
      if (this.selectLayer.type == 'line') this.fieldKeys = this.$store.state.common.PipeLineFields
      else this.fieldKeys = this.$store.state.common.PipePointFields
      console.log('999', this.fieldKeys)
    },
    /**新增条件 */
    addNewParam() {
      this.filterArr.push({})
    },
    deleteParamItem(index) {
      this.filterArr.splice(index, 1)
    },
    /**
     * 获取字段唯一值
     * @param {String} field 字段名称
     */
    async getOnlyValue(field) {
      //指定SQL查询处理
      var url = mapConfig.iServerUrl.pipelineDataServer.url
      //指定SQL查询服务参数
      let sqlParam = new SuperMap.GetFeaturesBySQLParameters({
        toIndex: -1,
        maxFeatures: 10000000,
        datasetNames: [mapConfig.iServerUrl.pipelineDataServer.dataSource + ':' + this.selectLayer.value],
        queryParameter: {
          attributeFilter: "",
          fields: [field],
          groupBy: field
        }
      });
      return new Promise((resolve) => {
        //向服务器发送请求，并对返回的结果进行处理
        new FeatureService(url).getFeaturesBySQL(sqlParam, serviceResult => {
          if (serviceResult.type == "processFailed") {
            this.$message.error(`获取唯一值失败，${serviceResult.error.errorMsg}!`);
            return
          }
          //获取返回的features数据
          let features = serviceResult.result.features.features
          // 拿到唯一值
          // console.log("唯一值：", features)
          let fieldOnlyValue = features.map(item => {
            return item.properties[field]
          })
          resolve(fieldOnlyValue);
        })
      });
    },
    /** 获取对应的唯一值*/
    async fieldChange(index, field) {
      await this.getOnlyValue(field).then(res => {
        this.filterArr[index]["OnlyVals"] = res
        this.$forceUpdate();
        // console.log('输出this.filterArr：', this.filterArr)
      })
    },
    /**
     * iserver几何查询
     */
    geoQuery() {
      let geoQueryParam = new SuperMap.GetFeaturesByGeometryParameters({
        toIndex: -1,
        maxFeatures: 10000000,
        geometry: this.queryExtent,
        attributeFilter: this.checkQueryParams(),
        datasetNames: [mapConfig.iServerUrl.pipelineDataServer.dataSource + ':' + this.selectLayer.value],
        spatialQueryMode: "INTERSECT" // 相交空间查询模式
      })
      const url = mapConfig.iServerUrl.pipelineDataServer.url
      new FeatureService(url).getFeaturesByGeometry(geoQueryParam, serviceResult => {
        // console.log('输出几何查询结果：', serviceResult)
        if (serviceResult.type == "processFailed") {
          this.$message.error(`获取结果失败，${serviceResult.error.errorMsg}!`);
          this.loading = false // 关闭执行状态
          return
        }
        let features = serviceResult.result.features.features
        if (features && features.length >= 0) {
          this.vectorLayer.getSource().addFeatures(new GeoJSON().readFeatures(serviceResult.result.features))
          this.features = features.map(item => {
            item.properties['geometry'] = item.geometry;
            return item.properties
          })
          this.totalResultTable = [{
            name: this.selectLayer.label,
            num: this.features.length + '个',
            data: this.features,
            fields: this.getFields(this.selectLayer.type)
          }]
          this.loading = false
        }
      })
    },
    /**
     * iserver属性查询
     */
    attributeQuery() {
      let sqlQueryParam = new SuperMap.GetFeaturesBySQLParameters({
        toIndex: -1,
        maxFeatures: 10000000,
        datasetNames: [mapConfig.iServerUrl.pipelineDataServer.dataSource + ':' + this.selectLayer.value],
        queryParameter: { attributeFilter: this.checkQueryParams() }
      })
      const url = mapConfig.iServerUrl.pipelineDataServer.url
      new FeatureService(url).getFeaturesBySQL(sqlQueryParam, serviceResult => {
        // console.log('输出属性查询结果：', serviceResult)
        if (serviceResult.type == "processFailed") {
          this.$message.error(`获取结果失败，${serviceResult.error.errorMsg}!`);
          this.loading = false // 关闭执行状态
          return
        }
        let features = serviceResult.result.features.features
        if (features && features.length >= 0) {
          this.vectorLayer.getSource().addFeatures(new GeoJSON().readFeatures(serviceResult.result.features))
          this.features = features.map(item => {
            item.properties['geometry'] = item.geometry;
            return item.properties
          })
          this.totalResultTable = [{
            name: this.selectLayer.label,
            num: this.features.length + '个',
            data: this.features,
            fields: this.getFields(this.selectLayer.type)
          }]
          this.loading = false
        }
      })
    },
    checkQueryParams() {
      let sqlStr = ''
      // 拼接固定字段
      for (const key in this.queryForm) {
        if (Object.keys(this.queryForm[key]).length == 2) {
          let operator, field, val = null
          // if (this.queryForm[key][Object.keys(this.queryForm[key])[0]]
          //   && this.queryForm[key][Object.keys(this.queryForm[key])[1]])

          for (const k in this.queryForm[key]) {
            if (k == 'calc') operator = this.queryForm[key][k]
            else { val = this.queryForm[key][k]; field = k }
          }
          if (field && operator && val) {
            if (field == 'REPAIRNUM') sqlStr += field + " " + operator + " " + val + " AND "
            else sqlStr += field + " " + operator + " '" + val + "' AND "
          }
        }
      }
      // 拼接动态字段
      this.filterArr.forEach(item => {
        if (item.field && item.operator && item.val) {
          if (item.operator == 'like') {
            sqlStr += item.field + " " + item.operator + " '%" + item.val + "%' AND "
          } else if (item.operator == '==') {
            sqlStr += item.field + " = '" + item.val + "' AND "
          } else {
            sqlStr += item.field + " " + item.operator + " " + item.val + " AND "
          }
        }
      });
      sqlStr = sqlStr.substr(0, sqlStr.length - 5) // 去掉最后一个AND
      // console.log('查询条件：', sqlStr)
      return sqlStr
    },
    /**执行分析 */
    execute() {
      this.loading = true
      if (!this.selectLayer.value) {
        this.$message.error('未选择图层数据集！')
        this.loading = false
        return
      }
      // this.vectorLayer.getSource().clear()
      if (this.radio == '1') {
        this.vectorLayer.getSource().clear()
        this.attributeQuery() // 全图预警分析
      } else {
        // 指定范围预警分析
        if (this.queryExtent) this.geoQuery()
        else {
          this.loading = false
          this.$message.error('请先绘制分析范围！');
        }
      }
      console.log('输出///：', mapConfig.iServerUrl.pipelineDataServer.dataSource, this.selectLayer)
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
    /**清除结果 */
    clearReasult() {
      this.vectorLayer.getSource().clear()
      Object.assign(this.$data, this.$options.data());
      this.initData()
      this.loading = false
    },
    /**查看详情 */
    viewDetails() {
      if (this.totalResultTable.length == 0) return
      let panel = {
        path: 'warningReasult',
        name: 'warningReasult',
        pathId: 'warningReasult',
        widgetid: 'HalfPanel',
        type: 'gis',
        component: () => import('@/views/zhpt/tongyonggongju/warningAnalysis/warningReasult/widget'),
        label: '相交管线',
        meta: { title: '相交管线' },
        param: { dataType: this.selectLayer.type, features: this.features }
      }
      this.$store.dispatch('map/delHalfPanels', 'warningReasult');
      this.$store.dispatch('map/changeMethod', panel);
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