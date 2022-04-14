<template>
  <div style="padding: 12px 8px; height: 100%; overflow: auto" class="i-scrollbar">
    <el-row style="margin-bottom: 8px">
      <div style="width: 100%; height: 220px; border: 1px solid #ddd; padding: 6px">
        <div style="float: left; width: 50%; height: 100%; overflow: hidden auto; border: 1px solid #ddd; border-radius: 3px;">
          <el-checkbox-group v-model="layerSelectList">
            <div v-for="(item, index) in layerList" :key="index" style="margin: 4px 3px; border-bottom: 1px solid #ddd">
              <el-checkbox :label="item">{{item.name}}</el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
        <div style="float: left; width: 50%; height: 100%; overflow: hidden auto; border: 1px solid #ddd;">
          <el-checkbox-group v-model="attSelectList">
            <div v-for="(item, indexs) in attList" :key="indexs" style="margin: 4px 3px; border-bottom: 1px solid #ddd">
              <el-checkbox :label="item">{{item.name}}</el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
      </div>
    </el-row>          
    <tf-legend class="legend_dept" label="筛选条件" isopen="true" title="设置统计图层过滤条件，根据设置的过滤条件进行筛选分析统计。">      
      <div style="width: 100%; border: 1px solid #ccc; overflow: hidden auto; padding: 8px;">
        <tf-legend class="legend_dept" label="图层名称" isopen="true" title="选择将要进行查询的图层。">
          <el-select v-model="layerId" placeholder="请选择">
          <el-option v-for="item in layersAtt" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </tf-legend>
        <tf-legend class="legend_dept" label="图层字段" isopen="true" title="选择将要查询的字段。">
          <ul class="sqlQueryUl" style="height: 150px" v-loading="attLoading">
            <li v-for="(item, id) in analysisAtt" :key="id" @click="addText(item.value + ' ', item.value.length + 1, true)" >{{ item.label }}</li>
            <span style="color: #C0C4CC;letter-spacing: 1px;margin-left: 5px;"
             v-if="!analysisAtt.length">{{layerId ? '图层无字段' : '请选择图层查询字段'}}</span>
          </ul>
        </tf-legend>
        <tf-legend class="legend_dept" label="构造查询语句" isopen="true" title="查询条件的计算逻辑，及图层属性字段对应的唯一值。">
          <div style="width: 100%">
            <div style="width: 130px; float: left">
              <div style="margin-bottom: 3px">
                <el-button size="mini" type="primary" plain @click="addText('= ', 2)" style="width:56px">＝</el-button>
                <el-button size="mini" type="primary" plain @click="addText('like \'%%\'', 7)" style="width:56px">模糊</el-button>
              </div>
              <div style="margin-bottom: 3px">
                <el-button size="mini" type="primary" plain @click="addText('> ', 2)" style="width:56px">＞</el-button>
                <el-button size="mini" type="primary" plain @click="addText('< ', 2)" style="width:56px">＜</el-button>
              </div>
              <div style="margin-bottom: 3px">
                <el-button size="mini" type="primary" plain @click="addText('<> ', 3)" style="width:56px">≠</el-button>
                <el-button size="mini" type="primary" plain @click="addText('and ', 4)" style="width:56px">与</el-button>
              </div>
              <div>
                <el-button size="mini" type="primary" plain @click="addText('or ', 3)" style="width:56px">或</el-button>
                <el-button size="mini" type="primary" plain @click="addText('% ', 2)" style="width:56px">占位</el-button>
              </div>
            </div>
            <div style="width: calc(100% - 130px); float: right">
              <ul class="sqlQueryUl" style="height: 120px" v-loading="fixLoading">
                <li v-for="(item, id) in layerFix" :key="id" @click="addText('\'' + item + '\' ', item.length + 3)">{{ item }}</li>
                <span style="color: #C0C4CC;letter-spacing: 1px;margin-left: 5px;"
                      v-if="!layerFix.length">请选择字段</span>
              </ul>
            </div>
          </div>
        </tf-legend>
        <tf-legend class="legend_dept" label="组合查询条件" isopen="true" style="clear: both" title="选择字段、属性及构造语句组合成查询过滤的条件，通过构建的条件过滤数据。">    
          <el-input v-model="queText" v-way="wayFun('textBox')" type="textarea" :rows="4" placeholder="请输入查询过滤条件，如:OBJECTID>0"/>
          <label style="color: #409eff;display: flex;margin: 6px 0;font-size:14px;">{{queTextName}}</label>
        </tf-legend>      
        <tf-legend class="legend_dept" label="空间过滤条件" isopen="true" style="clear: both" title="通过选择下面的条件，设置空间过滤条件进行查询。">
          <el-row style="margin-bottom: 8px">
            <el-col :span="6"><el-radio v-model="space" label="all" style="margin-right: 0;">全图</el-radio></el-col>
            <el-col :span="8"><el-radio v-model="space" label="draw" style="margin-right: 0;">绘制范围</el-radio></el-col>
            <!-- <el-col :span="5"><el-radio v-model="space" label="TF_JSJS_REGION_B" style="margin-right: 0;">片区</el-radio></el-col>
            <el-col :span="5"><el-radio v-model="space" label="TF_JSQT_DISTRICT_B">行政区</el-radio></el-col> -->
          </el-row>
          <el-select 
            v-if="['TF_JSQT_DISTRICT_B', 'TF_JSJS_REGION_B'].indexOf(space) > -1" 
            v-model="spaceSetting"
            multiple
            @visible-change="visibleChangeHandler"
            @remove-tag="removeTagHandler"
            placeholder="请选择">
            <el-option v-for="(item, index) in spaceSettings[space]" :key="index" :value="index" :label="item.name"></el-option>
          </el-select>
        </tf-legend>
      </div>
    </tf-legend>
    <el-row style="margin-top: 8px">
      <el-button style="width:100%;" size="mini" type="primary" @click="analysis_new" :disabled="analysisDisable">
          <i v-if="analysisDisable" class="el-icon-loading"/>统计</el-button>
    </el-row>
  </div>
</template>

<script>
import { esriConfig, appconfig } from 'staticPub/config'
import tfLegend from '@/views/zhpt/common/Legend'

import iDraw from '@/views/zhpt/common/mapUtil/draw'
import iQuery from '@/views/zhpt/common/mapUtil/query'
import GeoJSON from 'ol/format/GeoJSON';
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import { comSymbol } from "@/utils/comSymbol";
import { Polygon, LineString, Point } from 'ol/geom';
import * as turf from '@turf/turf';
import { fieldDoc } from '@/views/zhpt/common/doc'
import { getThemLayer, addThemLayer, deleteThemLayer } from '@/api/mainMap/themMap'
import { SuperMap, FieldService, FeatureService, FieldParameters } from '@supermap/iclient-ol';

export default {
  name: 'lengthStat',
  components: { tfLegend },
  directives: {
    way(el, bind) {
      if (typeof bind.value === 'function') bind.value(el.children[0])
    }
  },
  props: { data: Object },
  data() {
    return {
      panel: { pathId: 'analysisResult', widgetid: 'HalfPanel', label: '统计分析', param: {} },
      show3: false,

      queText: '',
      elements: {},
      layerFix: [],
      layersAtt: [],
      titleName: '',
      layerId: '',
      lastRange: [0, 0],
      analysisAtt: [],
      attSelectList: [],
      layerListIndex: {},
      analysisDisable: false,
      layerSelectList: [],
      space: 'all',
      spaceSetting: '',
      spaceSettings: {},
      attLoading: false,
      fixLoading: false,
      queTextName:'',

      // add
      attList: [
        { name: "管线材质", field: "MATERIAL" },
        { name: "管径", field: "DIAMETER" },
        { name: "行政区", field: "DISTRICT" },
        { name: "权属单位", field: "OWNERUNIT" },
        { name: "埋设方式", field: "BURYTYPE" },
        { name: "所在道路", field: "LANE_WAY" }
      ],
      limitFeature: null,
      layerList: [ { name: "管线" }],
    }
  },
  computed: { 

  },
  mounted() {
    this.initLayer()
  },
  watch: {
    queText(newValue,oldValue){
      if (this.queText.length == 0 ) this.queTextName = '';
    },
    type: function() {
      this.titleName = this.param.type
    },
    layerSelectList(e) {
    },
    layerId(e) {
      if(!e) return 
      let dataServer = appconfig.gisResource['iserver_resource'].dataServer
      this.getServerFields(dataServer, this.layerId).then(fields => {
        if (fields) {
          this.analysisAtt = fields.map(field => {
            return { label: fieldDoc[field] || field, value: field }
          })
        } else this.$message.error("获取字段失败")
      })
    },
    // spaceSetting(e) {
    //   if(e === '') return this.printRect.geometry = { type: 'polygon', rings: [[[0,0]]], spatialReference: this.mapView.spatialReference } 
    //   var rings = this.spaceSettings[this.space][e].rings
    //   if(rings) {
    //     this.printRect.geometry = { type: 'polygon', rings: rings, spatialReference: this.mapView.spatialReference } 
    //     this.mapView.extent = this.printRect.geometry.extent
    //   }
    // },
    space(value) {
      if (value === 'draw') {
        this.drawer = new iDraw(this.mapView, "polygon", {
          showCloser: false,
          endDrawCallBack: featrue => {
            this.limitFeature = featrue
            this.drawer.remove()
          }
        })
        this.drawer.start()
      }
    },
    sidePanelOn(newTab, oldTab) {
      
    }
  },
  methods: {
    // 初始化地图
    initLayer () {
      let { layers, dataServer } = appconfig.gisResource["iserver_resource"]
      let netLayers = layers.filter(layer => layer.parentname === "管线")

      // 设置图层
      this.layersAtt = netLayers.map(layer => {
        return { value: layer.name, label: layer.name }
      })

      var mapView = this.mapView = this.data.mapView
    },
    // 获取服务字段
    getServerFields ({ dataServiceUrl, dataSource }, dataSet) {
      return new Promise(resolve => {
        // 设置数据集，数据源
        var param = new SuperMap.FieldParameters({
          datasource: dataSource,
          dataset: dataSet
        });
        // 创建字段查询实例
        new FieldService(dataServiceUrl).getFields(param, serviceResult => {
          if (serviceResult.type === "processFailed") resolve(null) 
          else resolve(serviceResult.result.fieldNames)
        });
      })
    },

    analysis_new () {
      console.log("管线查询")
      if (!this.layerId) return this.$message.error('请选择查询图层名称')
      if (this.layerSelectList.length === 0) this.$message.error('请选择管网统计的类型')

      let dataServer = appconfig.gisResource['iserver_resource'].dataServer
      let dataSetInfo = dataServer.dataSetInfo.filter(info => info.name === this.layerId)
      
      let queryTask = new iQuery({...dataServer, dataSetInfo })
      queryTask.sqlQuery(this.queText).then(resArr => {
        if (!resArr) return this.$message.error("服务器请求失败!")

        let featruesData = resArr.filter(item => {
          return item && item.result.featureCount !== 0
        })
        
        // 绘制图层
        if (featruesData.length !== 0) {

          featruesData.forEach(featrueObj => {
            let features = featrueObj.result.features.features
            let queryFeatures = features.map(feature => new GeoJSON().readFeature(feature))

            let layerName = featrueObj.layerName
            // 范围限制
            if (this.limitFeature) {
              queryFeatures = queryFeatures.filter(feature => {
                let limitGeometry = turf.polygon(this.limitFeature.getGeometry().getCoordinates())
                let geomtry = feature.getGeometry(), inGeometry
                if (geomtry instanceof Point) {
                  inGeometry = turf.point(geomtry.getCoordinates())
                } else if (geomtry instanceof LineString) {
                  inGeometry = turf.lineString(geomtry.getCoordinates())
                } else return false
                return turf.booleanContains(limitGeometry, inGeometry)
              })
            }
            //
            this.addResData(queryFeatures)
          })
        } else return this.$message.error("无符合过滤条件数据")
      })
    },

    // TODO 多种类型 选择过滤
    addResData (features) {
      const lengthField = 'SMLENGTH'
      console.log(this.attSelectList, this.layerSelectList)
      let sumLength = features.map(fea => (fea.values_[lengthField] || 0)).reduce((p, n) => Number(p) + Number(n), 0)
      // 表格信息
      let tableData = [], columns = [], tableRows = [];
      columns = this.attSelectList.map(att => {
        return { name: att.name, value: att.field }
      })
      tableRows = features.map(fea => {
        let length = Number(fea.values_[lengthField])
        fea.values_[lengthField] = length.toFixed(3)
        return fea.values_
      })
      // 添加合计数据
      let total = { "SMLENGTH": sumLength.toFixed(3) }
      columns.forEach((item, index) => {
        total[item.value] = index === 0 ? "合计" : "-"
      })
      tableData = this.layerSelectList.map(layer => {
        return { name: layer.name, columns: [...columns, { name: '长度/m', value: lengthField }], rows: [total, ...tableRows] }
      })

      // echart
      let chartData = this.layerSelectList.map(layer => { 
        let dataX = [], dataY = [];
        let dataBox = new Map() // 以选择的属性的值为 x 轴
        features.forEach(fea => {
          let values = this.attSelectList.map(att => {
            return fea.values_[att.field]
          })
          let length = Number(fea.values_[lengthField])
          let key = values.toString()
          if (dataBox.has(key)) {
            dataBox.set(key, dataBox.get(key) + length)
          } else {
            dataBox.set(key, length)
          }
        })

        dataBox.forEach((value, key) => {
          dataX.push(key)
          dataY.push(value.toFixed(3))
        })
        return {
          name: layer.name,
          option: {
            title: { text: '长度统计', 
            subtext: this.attSelectList.map(e => e.name).join('、'), left: 'center' },
            tooltip: { trigger: 'axis' }, color: 'rgb(19, 66, 151)',
            xAxis: { type: 'category', data: dataX }, yAxis: { name: '长度(m)', type: 'value' },
            dataZoom: [{ minSpan:1, type: 'slider' }],
            toolbox: { feature: { saveAsImage: {} } },
            series: [{ data: dataY, type: 'bar', label: { show: true, position: 'top' }}]
          }
        }
      })

      this.$store.dispatch('map/changeMethod', {
        pathId: 'analysisBox',
        widgetid: 'FloatPanel',
        label: '分析结果统计',
        param: { that: this, title: '统计结果图', tabs: chartData }
      })
      this.$store.dispatch('map/changeMethod', {
        pathId: 'analysisResult',
        widgetid: 'HalfPanel',
        label: '统计结果表',
        param: { that: this, title: '长度统计', tables: tableData }
      })
    },


    wayFun(flag) { return (el) => this.elements[flag] = el },
    addText(text, length, isField) {
      this.languageChange(text, length, isField);
      var myField = this.elements['textBox']
      var startL = myField.selectionStart
      this.queText = this.queText.substring(0, startL) + text + this.queText.substring(myField.selectionEnd, myField.value.length)
      myField.blur()
      setTimeout(() => {
        myField.selectionStart = myField.selectionEnd = startL + length
        myField.focus()
      })
      // 获取该字段所有 值
      // if(isField) this.getAtt(text.replace(/(\s*$)/g,""))
    },
    /**
     * select下拉框出现或者隐藏时触发  
     *    add for tengmingxue 2022-1-21
     * @param {boolean} evt true表示出现，false表示隐藏
     * 
    */
    visibleChangeHandler(evt){
      if(evt) return;
      let rings = [];
      let sp = this.spaceSetting;
      sp.forEach(item => {
        let ring = this.spaceSettings[this.space][item].rings;
        rings.push(...ring);
      });
      if(rings.length > 0) {
        this.printRect.geometry = { type: 'polygon', rings: rings, spatialReference: this.mapView.spatialReference } 
        this.mapView.extent = this.printRect.geometry.extent
      }
      else{
        this.printRect.geometry = { type: 'polygon', rings: [[[0, 0]]], spatialReference: this.mapView.spatialReference } 
      }
    },
    /**
     * select下拉框移出时触发
     *    add for tengmingxue 2022-1-21
     * @param {object}} tag 移出的值
     * 
    */
    removeTagHandler(tag){
      let rings = [];
      let sp = this.spaceSetting;
      sp.forEach(item => {
        let ring = this.spaceSettings[this.space][item].rings;
        rings.push(...ring);
      });
      if(rings.length > 0) {
        this.printRect.geometry = { type: 'polygon', rings: rings, spatialReference: this.mapView.spatialReference } 
        this.mapView.extent = this.printRect.geometry.extent
      }
      else{
        this.printRect.geometry = { type: 'polygon', rings: [[[0, 0]]], spatialReference: this.mapView.spatialReference } 
      }
    },
    languageChange(text, length, isField){
      if(isField){
        const field = this.analysisAtt.find(item => item.value === text.replace(' ',''));
        const fname = field ? field.label : text;
        this.queTextName = this.queTextName +  fname;
      }
      else{
        if(text.indexOf('=') != -1) text = '等于';
        if(text.indexOf('like') != -1) text = '中存在';
        if(text.indexOf('>') != -1) text = '大于';
        if(text.indexOf('<') != -1) text = '小于';
        if(text.indexOf('<>') != -1) text = '不等于';
        if(text.indexOf('and') != -1) text = '并且';
        if(text.indexOf('or') != -1) text = '或者';
        if(text.indexOf('%') != -1) text = '占位';
        this.queTextName = this.queTextName +  text;
      }
    },
    getPolygon() {
      for(let polygon in this.layerIndex) {
        $.ajax({
          url: appconfig.gisResource.business_map.config[0].url + "/" + this.layerIndex[polygon] + "/query?where=1=1&f=pjson",
          type: 'GET',
          success: (data) => {
            data = JSON.parse(data)
            var name = data.displayFieldName
            data = data.features
            var pols = []
            for(var i=0,ii=data.length;i<ii;i++) {
              pols.push({ name: data[i].attributes[name] || "", rings: data[i].geometry.rings })
            }
            this.spaceSettings[polygon] = pols
          },
          error: (error) => this.$message.error(error)
        })
      }
    },
    getAtt(field) {
      let seed = new Date().getTime()
      this.attLoadSeed = seed
      this.fixLoading = true
      this.layerFix = []
      $.ajax({
        url: appconfig.gisResource.fieldUniqueValue.config[0].url,
        type: 'POST',
        data: {
          usertoken: this.usertoken,
          layerid: this.layerId,
          field_name: field,
          f: 'pjson'
        },
        success: (data) => {
          if(this.attLoadSeed != seed) return
          this.fixLoading = false
          this.attLoadSeed = undefined
          data = JSON.parse(data)
          if(data.code != 10000) return this.$message.error('图层字段获取失败')
          this.layerFix = data.result.rows
          if(data.result.rows.length == 0) this.$message.error('字段无唯一值')
        },
        error: (error) => this.$message.error(error)
      })
    },
    analysis() {
      var statField = 'PIPELENGTH'
      if(this.layerSelectList.length == 0) return this.$message.error('请选择统计图层')
      if(['TF_JSQT_DISTRICT_B', 'TF_JSJS_REGION_B'].indexOf(this.space) > -1 && this.spaceSetting.length < 1){
        return this.$message.error('请选择' + (this.space === 'TF_JSQT_DISTRICT_B' ? '行政区':'片区'))
      }
      // if(this.attSelectList.length == 0) return this.$message.error('请选择统计字段')
      this.analysisDisable = true
      $.ajax({
        url: appconfig.gisResource.statistic.config[0].url,
        type: 'POST',
        data:  {
          usertoken: this.usertoken,
          layerids: JSON.stringify(this.layerSelectList.map((e) => e.id)),
          group_fields: JSON.stringify(this.attSelectList.map((e) => e.value)),
          statistic_field: statField,
          statistic_type: 2,
          where: this.queText,
          geometry: this.space == 'all' ? '' : JSON.stringify(this.printRect.geometry.toJSON()),
          f: "pjson"
        },
        dataType: "json",
        success: (data) => {
          this.analysisDisable = false
          if(data.code == 10000) {
            data = data.result.rows
            var tabs = []
            var tables = []
            var isOneValue = []
            for(let i=0,ii=data.length;i<ii;i++) {
              var rows = data[i].rows
              let dataTable = { x: [], y: []}
              var tableColumns = []
              var tableRows = []
              var OneValue = rows.length == 1
              var sit = 0, firstC
              for(let j=0,jj=rows.length;j<jj;j++) {
                var dataX = [], dataY = 0
                var row = rows[j]
                var tableRow = {}
                for(var fie in row) {
                  var t = (row[fie] || '').toString()
                  if(t !== '') OneValue = false
                  if(fie == statField) {
                    dataY = t
                    tableRow['length'] = t.replace(/(\s*$)/g,"") || '（空值）'
                  }
                  else {
                    if(!firstC) firstC = fie
                    dataX.push(t.replace(/(\s*$)/g,""))
                    tableRow[fie] = t.replace(/(\s*$)/g,"") || '（空值）'
                  }
                  if(j == 0) tableColumns.push(fie == statField ? {value: 'length', name: '长度（m）'} : {value: fie, name: this.attListIndex[fie]})                  
                }
                tableRows.push(tableRow)
                dataX = dataX.join(',')
                dataTable.x.push(dataX)
                dataTable.y.push(dataY)
                sit += parseFloat(dataY)
              }
              var oneRow = { 'length': sit.toFixed(2) }
              if(!firstC) oneRow['length'] = '合计：' + oneRow['length'] 
              else oneRow[firstC] = '合计'
              tableRows.splice(0, 0, oneRow)
              if(OneValue) {
                isOneValue.push(data[i].layername)
                continue
              }
              tabs.push({ id: data[i].layerid, name: data[i].layername, data: dataTable, option: {
                title: { text: '管网长度统计', subtext: this.attSelectList.map((e) => e.name).join('、'), left: 'center' },
                tooltip: { trigger: 'axis' }, color: 'rgb(19, 66, 151)',
                xAxis: { type: 'category', data: dataTable.x }, yAxis: { name: '长度(m)', type: 'value' },
                dataZoom: [{ minSpan:1, type: 'slider' }],
                toolbox: { feature: { saveAsImage: {} } },
                series: [{ data: dataTable.y, type: 'bar', label: { show: true, position: 'top' }}]
              }}) 
              tables.push({ id: data[i].layerid, name: data[i].layername, columns: tableColumns, rows: tableRows})
            }
            if(isOneValue.length > 0) {
              this.$message.error(isOneValue.join('、') + ' 无查询结果')
              if(isOneValue.length == data.length) return
            }
            var showResult = this.$store.state.map.analysisResult
            var [showBoxs, showTables] = showResult ? [showResult.box, showResult.table] : []
            if(showBoxs) {
              showBoxs.clear()
              this.$nextTick(() => {
                var firstI = showBoxs.tabs.length
                for(let i=0,ii=tabs.length;i<ii;i++) {
                  showBoxs.tabs.push({ label:tabs[i].name, index: (firstI++).toString(), option: tabs[i].option })
                }
                showBoxs.activeName = (firstI - tabs.length).toString()
              })
            } else {              
              this.$store.dispatch('map/changeMethod', {
                pathId: 'analysisBox',
                widgetid: 'FloatPanel',
                label: '分析结果统计',
                param: { that: this, title: '统计结果图', tabs: tabs }
              })
            }
            if(showTables) {
              showTables.clear()
              this.$nextTick(() => {
                var firstI = showTables.tabs.length
                for(let i=0,ii=tables.length;i<ii;i++) {                
                  showTables.tabs.push({ label:tables[i].name, index: (firstI++).toString(), columns: tables[i].columns, rows: tables[i].rows, })
                }
                showTables.activeName = (firstI - tables.length).toString()
              })
            } else {
              this.$store.dispatch('map/changeMethod', {
                pathId: 'analysisResult',
                widgetid: 'HalfPanel',
                label: '统计结果表',
                param: { that: this, title: '长度统计', tables: tables }
              })
            }
          } else {
            var e = data.error
            this.$message.error(
              e.indexOf('Invalid SQL syntax') > -1 ? 
              '查询语句错误' :
              '无查询结果'
            )
            console.log(e)
          }
        },
        error: (error) => { console.log(error) }
      })
    }
  },
  destroyed() {
    this.drawer && this.drawer.end()
    //销毁所有浮动框
    this.$store.dispatch('map/handelClose', {
      box:'FloatPanel',
      pathId: 'analysisBox',
      widgetid: 'FloatPanel',
    });
    //销毁底部窗口
     this.$store.dispatch('map/handelClose', {
      box:'HalfPanel',
      pathId: 'analysisResult',
      widgetid: 'HalfPanel',
    });
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.i-scrollbar {
  @include scrollBar;
}
.attAndConAnalysisUl {
  list-style-type: none;
  padding: 2px;
  margin: 0px;
  font-size: 14px;
  border: 1px solid #ccc;
  overflow: hidden auto;
}
.attAndConAnalysisUl li {
  margin: 2px 0;
  cursor: pointer;
}
.attAndConAnalysisUl li:hover {
  background: rgb(30, 144, 255);
  color: #fff;
}
</style>
