<template>
  <el-tabs v-loading="widgetLoading" v-model="activeName" ref="tabs" style="height:100%;">
    <el-tab-pane class="i-scrollbar" label="图层设置" name="themShow" style="height:100%;">
      <div style="width: 100%; height: 100%; padding: 5px">
        <tf-legend class="legend_dept" label="专题地图图层名称" isopen="true" title="请输入专题图图层名称">
          <el-input v-model="themLayerName" placeholder="请输入专题图图层名称" clearable maxlength="20" show-word-limit/>
        </tf-legend>
        <tf-legend class="legend_dept" label="图层选择" isopen="true" title="选择将要进行查询的图层">
          <el-select v-model="layerId" placeholder="请选择图层">
            <el-option-group v-for='group in layerGroups' :key="group.label" :label="group.label">
               <el-option v-for="item in group.layers" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-option-group>
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
                <el-button size="mini" type="primary" plain @click="addText('or ', 3)" style="width:56px">或</el-button>
                <el-button size="mini" type="primary" plain @click="addText('% ', 2)" style="width:56px">占位</el-button>
              </div>
              <div>
                <el-button size="mini" type="primary" plain @click="addText('<> ', 3)" style="width:56px">≠</el-button>
                <el-button size="mini" type="primary" plain @click="addText('and ', 4)" style="width:56px">与</el-button>
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
          <el-input v-model="queText" ref="textBox" type="textarea" :rows="4" placeholder="请输入查询过滤条件，如:OBJECTID > 0"/>
          <label style="color: #409eff;display: flex;margin: 6px 0;font-size:14px;">{{queTextName}}</label>
          <el-row style="margin-top: 8px">
            <el-col :span="5" style="float:right;">
              <el-button size="mini" type="primary" @click="clearText">清空</el-button>
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
            <i v-if="analysisDisable" class="el-icon-loading"/>添加并显示</el-button>
        </el-row>
      </div>
    </el-tab-pane>
    <el-tab-pane label="图层列表" name="listShow" style="height:calc(100% - 40px);">
      <div style="width: 100%; height: 100%; padding: 5px">
        <tf-legend class="legend_dept" label="专题地图图层" isopen="true" title="当前为你创建的专题图。">
          <el-table @select='addLayer' @select-all="addLayers" ref="multipleTable" :data="themLayerData" tooltip-effect="dark" max-height="400px" style="width: 100%" >
          <template slot="empty">
            <img src="@/assets/icon/null.png" alt="">
            <p class="empty-p">暂无数据</p>
          </template>
            <el-table-column type="selection" width="30"> </el-table-column>
            <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
            <el-table-column prop="mapName" label="名称" width="150" align="center"> </el-table-column>
            <el-table-column prop="size" label="操作"  align="center">
              <template slot-scope="scope">
                <el-link type="primary" @click="jump(scope.row)">跳转</el-link>
              </template>
            </el-table-column>
          </el-table>
          <el-row style="margin-top: 8px">
            <el-col :span="20">
              <el-pagination ref="pagination" small background layout="total, sizes, prev, next" 
              :page-size.sync='pageSize' :current-page.sync='currentPage' :page-sizes="[10, 20, 30, 50, 100, 1000]" :total="total"
              @current-change="updateThemLayerTable" @size-change="updateThemLayerTable" />
            </el-col>
          </el-row>
          <el-button size="mini" type="primary" style="margin-top:5px;width:100%" @click="deleteSelectFeas">删除选中专题图</el-button>
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
import { mapUtil } from '../../common/mapUtil/common'


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
      

      
      layerFix: [],      
      queText: '',
      queTextName:'',
      space: 'all',
      spaceSetting: [],
      spaceSettings: { },
      
      analysisDisable: false,

      // 
      themLayerName: '',
      themLayerData: [],
      layerId: '', // 图层名
      analysisAtt: [], // 字段名
      drawer: null, // 绘制器
      limitFeature: null, // 绘制图形

      pageSize: 30,
      currentPage: 1,
      total: 0,
      layerBox: new Map(),
      layerGroups: []
    }
  },
  computed: { 
    sidePanelOn() { return this.$store.state.map.P_editableTabsValue },
  },
  watch: {
    sidePanelOn(newTab, oldTab) {
      console.log('图层变化')
      if (newTab !== "themMap") {
        this.drawer && this.drawer.end()
        this.drawer = null
        // 删除专题图
        this.removeLayer()
      } else {

      }
    },
    layerId(e) {
      if(!e) return
      mapUtil.getFields(e).then(res => {
        if (res) {
          this.analysisAtt = res.map(field => {
            return { label: field.name, value: field.field }
          })
        } else this.$message.error("获取字段失败")
      })
    },
    activeName(e) {
         
    },
    space(value) {
      this.drawer && this.drawer.end()
      this.drawer = null
      if (value === 'draw') {
        this.drawer = new iDraw(this.mapView, "polygon", {
          endDrawCallBack: featrue => {
            this.limitFeature = featrue
            this.drawer.remove()
          },
          showCloser: false
        })
        this.drawer.start()
      } else {
        this.limitFeature = null
      }
    },

  },
  mounted() {
    this.$refs.tabs.$el.children[0].style.background = '#fff'
    this.init().then(() => this.widgetLoading = false)
    this.updateThemLayerTable()
  },
  methods: {
    clearText () {
      this.queText = '';
      this.queTextName = '';
    },
    // 移除图层
    removeLayer (layername) {
      if (!layername) {
        this.layerBox.forEach((value, key) => {
          this.mapView.removeLayer(value.themLayer)
          this.layerBox.delete(key)
        })
      } else {
        let layer = this.layerBox.get(layername)
        this.mapView.removeLayer(layer)
      }
    },
    init() {
      let [name, type] = appconfig.initLayers.split("&&")
      let layer = mapUtil.getAllSubLayerNames(name, type)
      // 设置图层
      this.layerGroups = layer.sublayers.map(layer => {
        let layers = layer.sublayers.map(sub => {
          return { label: sub.title, value: sub.name.split('@')[0] }
        })
        return { label: layer.title, value: layer.name, layers }
      })

      var mapView = this.mapView = this.data.mapView
      // 先跳出，后面的方法用 ol 重写
      return Promise.resolve()
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
      isField && this.getUniqueValue(text)
    },
    getUniqueValue (filed) {
      console.log('获取唯一值')
      mapUtil.getUniqueValue(this.layerId, filed.trim()).then(res => {
        if(res) {
          this.layerFix = res
        } else this.$message.error('获取唯一值失败')
      })
    },
    languageChange(text, length, isField){
      if(isField){
        const field = this.analysisAtt.find(item => item.value === text.replace(' ',''));
        const fname = field ? field.label : text;
        this.queTextName = this.queTextName +  fname;
      } else {
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
      if (this.space === "draw" && !this.limitFeature) return this.$message.error('请先绘制范围')

      this.analysisDisable = true
      this.getThemLayer(this.limitFeature, this.layerId, this.queText).then(res => {
        if (res) {
          let { themLayer, center } = res
          this.layerBox.set(this.themLayerName, res)
          this.mapView.addLayer(themLayer)
          this.mapView.getView().setCenter(center)
          this.mapView.getView().setZoom(15)
        }
      })
      this.uploadThemLayer(this.limitFeature, this.queText)
    },

    // 添加
    addLayer (row) {
      if (row.length !== 0) {
        let promises = row.map(item => {
          let { layerName, filterSql } = item
          let limitFeature = null
          if (item.rangeScope) {
            limitFeature = new GeoJSON().readFeature(turf.polygon(JSON.parse(row.rangeValue)))
          }
          if (this.layerBox.has(layerName)) {
            return null
          } else {
            return this.getThemLayer(limitFeature, layerName, filterSql)
          }
        })
        Promise.all(promises).then(results => {
          results.forEach(res=> {
            if (res) {
              let { themLayer, center, layerName } = res
              this.layerBox.set(layerName, res)
              this.mapView.addLayer(themLayer)
            }
          })
        })
      } else {
        this.removeLayer()
      }

    },

    addLayers (row) {

    },

    getThemLayer (limitFeature, layerName, sqlFilterStr) {
      let themLayer = createThemLayer()
      this.data.that.loading = true
      this.data.that.loadText = "专题图显示中..."

      let dataSetInfo = [{ name: layerName }]
      let queryTask = new iQuery({ dataSetInfo })
      return new Promise(resolve => {
        queryTask.sqlQuery(sqlFilterStr).then(resArr => {
          this.data.that.loading = false
          if (!resArr) return this.$message.error("服务器请求失败!")

          let featruesData = resArr.filter(item => {
            return item.result.featureCount !== 0
          })
          if (featruesData.length !== 0) {
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
              //
              themLayer.getSource().addFeatures(themFeatures)
              let center = new mapUtil().getCenterFromFeatures(themFeatures)
              resolve({ themLayer, center, layerName })
            })
          } else {
            this.$message.success("无符合条件数据, 请检查查询语句是否正确")
            resolve(null)
          }
        })
      })


      function createThemLayer () {
        return new VectorLayer({
          source: new VectorSource(),
          style: comSymbol.getAllStyle(3, "#f40", 3, "red")
        })
      }
    },

    // 上传专题图
    uploadThemLayer (limitFeature, sqlFilterStr) {
      let range = limitFeature ? limitFeature.getGeometry().getCoordinates() : appconfig.initCenter
      let params = {
        rangeValue: limitFeature ? JSON.stringify(range) : "",
        rangeScope: limitFeature ? 1 : 0,
        filterSql: sqlFilterStr,
        mapName: this.themLayerName,
        layerName: this.layerId,
        userId: this.$store.state.user.userId
      }
      addThemLayer(params).then(res => {
        this.analysisDisable = false
        if (res.code === 1) {
          this.updateThemLayerTable()
          this.$message.success('添加专题图：' + this.themLayerName + ' 成功!')
        } else {
          this.$message.success('保存专题图：' + this.themLayerName + ' 失败!')
        }
      })
    },

    updateThemLayerTable () {
      let  params = { size: this.pageSize, current: this.currentPage }
      getThemLayer(params).then(res => {
        if (res.code === 1) {
          this.total = res.result.total
          this.themLayerData = res.result.records
        }
      })
    },

    deleteThemLayer (row) {
      this.$confirm('确定删除"' + row.mapName + '"图层信息', '提示',
        { distinguishCancelAndClose: true, confirmButtonText: '确定', cancelButtonText: '取消' }).then(_ => {
          this.drawer && this.drawer.end()
          deleteThemLayer(row.id).then(res => {
            if (res.code == 1) {
              this.$message.success(`已删除 ${row.mapName} 专题图`)
              this.updateThemLayerTable()
            }
          })
      })
    },

    deleteSelectFeas() {
      var selects = this.$refs.multipleTable.selection
      if(selects.length !== 1) return this.$message('请选择一个专题图')
      var view = this.mapView
      this.$confirm('确定删除选中的 ' + selects.length + '个图层信息', '提示',
        { distinguishCancelAndClose: true, confirmButtonText: '确定', cancelButtonText: '取消' }).then(_ => {
        deleteThemLayer(selects[0].id).then(res => {
            console.log('删除')
            if (res.code == 1) {
              this.$message.success(`已删除 ${selects[0].mapName} 专题图`)
              this.updateThemLayerTable()
            }
          })

      })
    },
    // 跳转
    jump(row) {
      let { layerName, filterSql } = row
      //
      if (this.layerBox.has(layerName)) {
        let { themLayer, center } = this.layerBox.get(layerName)
        this.mapView.getView().setCenter(center)
        this.mapView.getView().setZoom(15)
      } else this.$message.warning('请先添加该图层')
    }
  },
  destroyed() {
    this.drawer && this.drawer.end()
    this.drawer = null
    this.removeLayer()
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