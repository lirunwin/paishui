<template>
  <el-tabs v-loading="widgetLoading" v-model="activeName" ref="tabs" style="height:100%;">
    <el-tab-pane class="i-scrollbar" label="图层设置" name="themShow" style="height:100%;">
      <div style="width: 100%; height: 100%; padding: 5px">
        <tf-legend class="legend_dept" label="专题地图图层名称" isopen="true" title="请输入专题图图层名称">
          <el-input v-model="themLayerName" placeholder="请输入专题图图层名称" clearable maxlength="20" show-word-limit/>
        </tf-legend>
        <tf-legend class="legend_dept" label="图层选择" isopen="true" title="选择将要进行查询的图层">
          <el-select v-model="layerId" placeholder="请选择图层">
            <el-option v-for="item in layers" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </tf-legend>        
        <tf-legend class="legend_dept" label="图层字段" isopen="true" title="请选择图层查询字段。">
          <ul class="sqlQueryUl" style="height: 150px" v-loading="attLoading">
            <li v-for="(item, id) in analysisAtt" :key="id" @click="addText(item.value + ' ', item.value.length + 3, true)">{{ item.label }}</li>
            <span style="color: #C0C4CC;letter-spacing: 1px;margin-left: 5px;"
             v-if="!analysisAtt.length">{{layerId ? '图层无字段' : '请选择图层查询字段'}}</span>
          </ul>
        </tf-legend>
        <tf-legend class="legend_dept" label="构造查询语句" isopen="true" title="查询条件的计算逻辑，及图层属性字段对应的唯一值。">
          <div style="width: 100%">
            <div style="width: 100%; float: left">
              <div style="margin-bottom: 3px">
                <el-button size="mini" type="primary" plain @click="addText('= ', 2)" style="width:56px">＝</el-button>
                <el-button size="mini" type="primary" plain @click="addText('like \'%%\'', 7)" style="width:56px">模糊</el-button>
                <el-button size="mini" type="primary" plain @click="addText('> ', 2)" style="width:56px">＞</el-button>
                <el-button size="mini" type="primary" plain @click="addText('< ', 2)" style="width:56px">＜</el-button>
              </div>
              <div style="margin-bottom: 3px">
                <el-button size="mini" type="primary" plain @click="addText('<> ', 3)" style="width:56px">≠</el-button>
                <el-button size="mini" type="primary" plain @click="addText('and ', 4)" style="width:56px">与</el-button>
                <el-button size="mini" type="primary" plain @click="addText('or ', 3)" style="width:56px">或</el-button>
                <el-button size="mini" type="primary" plain @click="addText('% ', 2)" style="width:56px">占位</el-button>
              </div>
            </div>
            <div v-if="false" style="width: calc(100% - 130px); float: right">
              <ul class="sqlQueryUl" style="height: 120px" v-loading="fixLoading">
                <li v-for="(item, id) in layerFix" :key="id" @click="addText('\'' + item + '\' ', item.length + 3)">{{ item }}</li>
                <span style="color: #C0C4CC;letter-spacing: 1px;margin-left: 5px;"
                  v-if="!layerFix.length">请选择字段</span>
              </ul>
            </div>
          </div>
        </tf-legend>
        <tf-legend class="legend_dept" label="组合查询条件" isopen="true" style="clear: both" title="选择字段、属性及构造语句组合成查询过滤的条件，通过构建的条件过滤数据。">
          <el-input v-model="queText" ref="textBox" type="textarea" :rows="4" placeholder="请输入查询过滤条件，如:OBJECTID > 0"/>
          <label style="color: #409eff;display: flex;margin: 6px 0;font-size:14px;">{{queTextName}}</label>
          <el-row style="margin-top: 8px">
            <el-col :span="5" style="float:right;">
              <el-button size="mini" type="primary" @click="queText = ''">清空</el-button>
            </el-col>
          </el-row>
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
        <el-row style="margin-top: 8px">
          <el-button size="mini" type="primary" style="width:100%" @click="showThemLayer" :disabled="analysisDisable">
            <i v-if="analysisDisable" class="el-icon-loading"/>添加显示</el-button>
        </el-row>
      </div>
    </el-tab-pane>
    <el-tab-pane label="图层列表" name="listShow" style="height:calc(100% - 40px);">
      <div style="width: 100%; height: 100%; padding: 5px">
        <tf-legend class="legend_dept" label="专题地图图层" isopen="true" title="当前为你创建的专题图。">
          <el-table ref="multipleTable" :data="themLayerData" tooltip-effect="dark" max-height="400px"
            style="width: 100%" @select="selectChange" @select-all="selectChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="图层" /> 
            <el-table-column prop="size" label="操作" >
              <template slot-scope="scope">
                <el-link type="primary" @click="jump(scope.row, scope.$index)">跳转</el-link>
                <el-link type="primary" @click="deleteFeas(scope.row, scope.$index)">删除</el-link>
              </template>
            </el-table-column>
          </el-table>
          <el-button size="mini" type="primary" style="width:100%" @click="deleteSelectFeas">删除选中专题图</el-button>
        </tf-legend>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import tfLegend from '@/views/zhpt/common/Legend'
import { esriConfig, appconfig } from 'staticPub/config'
import request from '@/utils/request'
import { reject, resolve } from 'q'
import app from '../../../../store/modules/app'
import { SuperMap, FieldService, FeatureService, FieldParameters } from '@supermap/iclient-ol';

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


export default {
  name: 'ThemMap',
  components: { tfLegend },
  props: { data: Object },
  data() {
    return {
      widgetLoading: true,
      attLoading: false,
      fixLoading: false,
      activeName: 'themShow',
      
      layers: [],
      
      layerFix: [],      
      queText: '',
      queTextName:'',
      space: 'all',
      spaceSetting: [],
      spaceSettings: { },
      themLayerData: [
        { name: "测试专题图" }
      ],
      analysisDisable: false,

      // 
      themLayerName: '专题图名称',
      layerId: '', // 图层名
      analysisAtt: [], // 字段名
      drawer: null, // 绘制器
      themLayer: null, // 专题图层
      limitFeature: null // 绘制图形
    }
  },
  computed: { 
    sidePanelOn() { return this.$store.state.map.P_editableTabsValue },
  },
  watch: {
    sidePanelOn(newTab, oldTab) {
      
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
    activeName(e) {
         
    },
    space(value) {
      this.drawer && this.drawer.end()
      this.themLayer && this.mapView.removeLayer(this.themLayer)
      this.drawer = this.themLayer = null
      if (value === 'draw') {
        this.drawer = new iDraw(this.mapView, "polygon", {
          endDrawCallBack: featrue => {
            this.limitFeature = featrue
            this.drawer.remove()
          }
        })
        this.drawer.start()
      } else {
        this.limitFeature = null
      }
    },
    queText(newValue, oldValue){
      if (newValue.length < oldValue.length || newValue=="") {
        this.queTextName = ''
      } 
      // else {
      //   let etrStr = newValue.replace(oldValue, "")
      //   this.queTextName = this.queTextName + etrStr
      // }
    }
  },
  mounted() {
    this.$refs.tabs.$el.children[0].style.background = '#fff'
    this.init().then(() => this.widgetLoading = false)
  },
  methods: {
    init() {
      let { layers, dataServer } = appconfig.gisResource["iserver_resource"]
      let netLayers = layers.filter(layer => layer.parentname === "管线")

      // 设置图层
      this.layers = netLayers.map(layer => {
        return { label: layer.name, value: layer.name }
      })

      var mapView = this.mapView = this.data.mapView
      // 先跳出，后面的方法用 ol 重写
      return Promise.resolve()
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

    // ------------------------------
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
    drawRect() {
      var view = this.mapView
      var sp = view.spatialReference
      var draw = view.TF_draw
      if(draw.activeAction) draw.reset()
      view.TF_drawPolygon(() => { view.container.style.cursor = 'crosshair'}, () => {}, 
      (evt) => {
        var v = evt.vertices
        if (v.length > 1)
          this.printRect.geometry = {
            type: 'polygon', rings: v, spatialReference: sp
          } 
      }, () => {
        draw.reset()
        view.container.style.cursor = ''
      })
    },

    addText(text, length, isField) {
      var myField = this.$refs.textBox.$el.children[0]
      var startL = myField.selectionStart
      this.languageChange(text, length, isField);
      this.queText = this.queText.substring(0, startL) + text + this.queText.substring(myField.selectionEnd, myField.value.length)
      myField.blur()
      setTimeout(() => {
        myField.selectionStart = myField.selectionEnd = startL + length
        myField.focus()
      })
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

    showThemLayer () {
      if (!this.themLayerName) return this.$message.error('请输入专题图名称')
      if (!this.queText) return this.$message.error('请选择专题图过滤条件')

      this.addThemLayer(this.limitFeature, this.queText)
      
      this.uploadThemLayer(this.limitFeature, this.queText)
    },

    addThemLayer (limitFeature, sqlFilterStr) {
      this.themLayer && this.mapView.removeLayer(this.themLayer)
      this.themLayer = null

      this.data.that.loading = true
      this.data.that.loadText = "专题图显示中..."

      let queryTask = new iQuery(appconfig.gisResource['iserver_resource'].dataServer)
      queryTask.sqlQuery(sqlFilterStr).then(resArr => {
        this.data.that.loading = false
        if (!resArr) return this.$message.error("服务器请求失败!")

        let featruesData = resArr.filter(item => {
          return item.result.featureCount !== 0
        })
        if (featruesData.length !== 0) {
          this.themLayer = createThemLayer()
          this.mapView.addLayer(this.themLayer)

          featruesData.forEach(featrueObj => {
            let features = featrueObj.result.features.features
            let themFeatures = features.map(feature => new GeoJSON().readFeature(feature))
            // 范围限制
            if (limitFeature) {
              themFeatures = themFeatures.filter(feature => {
                let limitGeometry = turf.polygon(limitFeature.getGeometry().getCoordinates())
                let geomtry = feature.getGeometry(), inGeometry
                if (geomtry instanceof Point) {
                  inGeometry = turf.point(geomtry.getCoordinates())
                } else if (geomtry instanceof LineString) {
                  inGeometry = turf.lineString(geomtry.getCoordinates())
                } else return false
                return turf.booleanContains(limitGeometry, inGeometry)
              })
            }
            this.themLayer.getSource().addFeatures(themFeatures)
          })
        } else return this.$message.error("无符合过滤条件数据")
      })

      function createThemLayer () {
        return new VectorLayer({
          source: new VectorSource(),
          style: comSymbol.getAllStyle(3, "#f40", 2, "#7BDCFE")
        })
      }
    },

    // TODO 上传专题图
    uploadThemLayer (limitFeature, sqlFilterStr) {
      let params = {
        extent: limitFeature ? limitFeature.getGeometry().getExtent() : this.mapView.extent,
        filter: sqlFilterStr,
        name: this.themLayerName,
      }
      addThemLayer(params).then(res => {
        this.updateThemLayerTable()
        this.$message.success('添加专题图：' + this.themLayerName + ' 成功!')
      })
    },

    // TODO 更新专题图表格
    updateThemLayerTable () {
      let  params = {}
      getThemLayer(params).then(res => {

      })
    },

    // TODO 删除专题图
    deleteThemLayer () {
      let params = {}
      if(row.id && row.id > -1) {
        this.$confirm('确定删除"' + row.name + '"图层信息', '提示',
        { distinguishCancelAndClose: true, confirmButtonText: '确定', cancelButtonText: '取消' }).then(_ => {
          deleteThemLayer(params).then(res => {
            if (res.code == 1) {
              
            }
          })
        })
      }
    },


    uploadThemMap(options, callback) {
      var extent = options.extent
      if(extent.length > 3500) {
        var needLong = Math.ceil(extent.length / 4000)
        extent = JSON.parse(options.extent)[0]
        var finalExtent = []
        for(var i=0,ii=extent.length;i<ii;i+=needLong) {
          var dextent = [0,0], length = 0
          for(var j=0;j<needLong;j++) {
            if(extent[i]) {
              var de = extent[i]
              dextent[0] += de[0]
              dextent[1] += de[1]
              length += 1
            }
          }
          if(dextent[0] != 0) {
            finalExtent.push([dextent[0] / length, dextent[1] / length])
          }
        }
        extent = JSON.stringify([finalExtent])
      }
      request({ 
        url: 'gis/themelayer/save', 
        method: 'post',
        data: {
          name: options.name,
          extent: extent,
          comCondition: options.comCondition,
          layerName: options.layerName,
        } }).then(res => {
          this.analysisDisable = false
          if(res.code == 1) {
            this.$message.success('添加标识：' + options.name + ' 成功')
            callback(res)  
          }
      })
    }, 
    selectChange(select, row) {
      if(row) {
        row.layer.visible  = row.select = !row.select
      } else {
        select = select.length != 0
        for(let j=0,jl=this.themLayerData,jj=jl.length;j<jj;j++) {
          var ij = jl[j]
          ij.layer.visible = ij.select = select
        }
      }
    },
    deleteFeas(row, index) {
      if(row.id && row.id > -1) {
        this.$confirm('确定删除"' + row.name + '"图层信息', '提示',
        { distinguishCancelAndClose: true, confirmButtonText: '确定', cancelButtonText: '取消' }).then(_ => {
          request({ 
            url: 'gis/themelayer/deleteByIds?ids=' + row.id, 
            method: 'delete',
            }).then(res => {
            if(res.code == 1) {
              this.mapView.map.remove(row.layer)
              this.themLayerData.splice(index, 1)
            }
          })
        })
      }
    },
    deleteSelectFeas() {
      var selects = this.$refs.multipleTable.selection
      if(selects.length == 0) return this.$message('请选中至少一个专题图')
      var view = this.mapView
      const names = selects.map(item=> item.name).toString();;
      this.$confirm('确定删除选中的 ' + selects.length + '个图层信息', '提示',
        { distinguishCancelAndClose: true, confirmButtonText: '确定', cancelButtonText: '取消' }).then(_ => {
        request({ url: 'gis/themelayer/deleteByIds?ids=' + selects.map(e => e.id), method: 'delete', }).then(res => {
          if(res.code == 1) {
            for(var i=0,il=this.themLayerData,ii=il.length;i<ii;i++) {
              var di = il[i]
              if(di.select) {
                view.map.remove(di.layer)
                il.splice(i--, 1)
                ii -= 1
              }
            }
            this.$message.success('删除成功！')
          } else this.$message.success('删除失败：' + res.message)
        })
      })
    },
    jump(row) {
      if(row.layer.fullExtent) this.mapView.extent = row.layer.fullExtent
      this.$nextTick(() => this.mapView.zoom = this.mapView.zoom - 1)
    }
  },
  destroyed() {
    this.drawer && this.drawer.end()
    this.drawer = null
    this.themLayer && this.mapView.removeLayer(this.themLayer)
    this.themLayer = null
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
  .i-scrollbar {
    overflow: auto;
    @include scrollBar;
  }
</style>