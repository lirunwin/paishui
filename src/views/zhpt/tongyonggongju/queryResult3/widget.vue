<template>
  <div ref="mainDiv" style="width: 100%; height: 100%;" v-loading="loading">
    <div style="height:calc(100% - 45px)">
      <el-table id="features" class="mapTable" style="width:100%;" :height="height" tooltip-effect="dark" stripe
      :data="featureData" ref="table" row-class-name="selectRowC" @row-click="getGeo">
        <el-table-column v-for="item of column" width="120" show-overflow-tooltip :key="item.value" :prop="item.value" :label="item.name">
        </el-table-column>
      </el-table>
    </div>
    <div style="width:100%;margin-top:8px;">
      <div style="float:left;width:80%">
        <el-pagination ref="pagination" small background layout="total, sizes, prev, pager, next" :page-sizes="[5, 10, 50, 100]" :total="total"
          @current-change="loadData" @size-change="loadData"/>
      </div>
      <div style="float:right;">
			  <export-btn table-id="features"></export-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { attConfig } from './attributeConfig'
import { esriConfig, appconfig } from 'staticPub/config'
import TableItem from '@/components/Table/index.vue'
import ExportBtn from '@/views/zhpt/wxreportforms/components/ExportBtn.vue'
export default {
  name: 'queryResult3',
  components: { TableItem, ExportBtn },
  props: { param: Object },
  data() {
    return {
      featureData: [],
      column: [],
      total: 0,
      loading: true,
      height: '100%',
      queryLayer:null,
    }
  },
  mounted() {
    var mapView = this.mapView = this.$attrs.data.mapView
    var mainDiv = this.$refs.mainDiv.parentElement
    mainDiv.style.height = '100%'
    mainDiv.parentElement.style.height = 'calc(100% - 56px)'
    mainDiv.parentElement.parentElement.style.height = '100%'
    this.oids = this.param.oids
    this.layer = this.param.layer
    var sp = mapView.spatialReference
    this.queryFeature = new mapView.TF_graphic({ geometry: { type: 'point', x: 0, y: 0, spatialReference: sp }})
    mapView.graphics.add(this.queryFeature)
    this.total = this.oids.length
    this.loadColumn().then(this.loadData)

    var showId = this.param.showId
    mapView.TF_resultFeatures = {
      load: (oids, layerId, templeteId) => {
        this.loading = true
        showId = templeteId
        this.$nextTick(() => {
          this.oids = oids
          this.total = oids.length
          this.layer = layerId
          this.loadColumn().then(this.loadData)
        })
      },
      destroy: (templeteId) => {
        if(showId != templeteId) return
        delete mapView.TF_resultFeatures
        for(var i=0,il=this.$store.state.map.halfPanels,ii=il.length;i<ii;i++) {
          if(il[i].com == 'queryResult3') return il.splice(i, 1)
        }        
      }
    }
  },
  methods: {
    loadColumn() {
      return new Promise((res) => {      
        var layer = this.layer
        var dontSeeAtt = attConfig.hide
        $.ajax({
          url: appconfig.gisResource.business_map.config[0].url + "/" + layer + "?f=pjson",
          type: 'GET',
          async: false,
          success: (data) => {
            data = JSON.parse(data)
            var cons = []
            for(var i=0,il=data.fields,ii=il.length;i<ii;i++) {   
              var di = il[i]
              var key = di.name
              if(dontSeeAtt.indexOf(key) > -1) continue
              cons.push({value: key, name: di.alias})
            }
            this.column = cons
            this.type = data.geometryType.substring(12).toLowerCase()
            res()
          },
          error: (error) => { console.log(error) }
        })
      })
    },
    loadData() {
      this.loading = true
      var pages = this.$refs.pagination
      var oids = this.oids
      var layer = this.layer
      var size = pages.internalPageSize
      var current = pages.internalCurrentPage
      var first = (current - 1) * size
      oids = oids.slice(first , first + size)
      var config = attConfig
      var dontSeeAtt = config.hide
      var changeAttFun = config.change
      $.ajax({
        url: appconfig.gisResource.business_map.config[0].url + "/" + layer + "/query",
        type: 'POST',
        data: {
          objectIds: oids.join(','),
          outFields: '*',
          f: 'pjson'
        },  
        success: (data) => {
          data = JSON.parse(data)
          var feaD = []
          for(var i=0,il=data.features,ii=il.length;i<ii;i++) {
            var di = il[i]
            var geo = di.geometry
            var att = di.attributes
            for(var j=0,jl=Object.keys(att),jj=jl.length;j<jj;j++) {
              var key = jl[j]
              if(dontSeeAtt.indexOf(key) > -1) {
                delete att[key]
                continue
              }
              if(changeAttFun.hasOwnProperty(key)) {
                att[key] = changeAttFun[key](key, att[key])
              } else if(att[key] === null) att[key] = '-'
            }
            att._Geometry = geo
            feaD.push(att)
          }
          this.showAllHighlight(data)
          this.featureData = feaD
          data = undefined
          this.height = '100px'
          this.$nextTick(() => {
            this.height = '100%'
            this.loading = false
          })
        },
        error: (error) => { console.log(error) }
      })
    },

    /**
    * 点击高亮显示
    */
    getGeo(row) {			
      var view = this.$attrs.data.mapView;
      var geometry = row._Geometry
      geometry.type = this.type
      geometry.spatialReference = view.spatialReference
      var gra = this.queryFeature
      gra.geometry = geometry
      gra.symbol = geometry.type == 'point' ? 
      { type: 'simple-marker', color: [200, 200, 200], size: 12, outline: { color: [0, 255, 255], width: 2 }}
      : { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: [0, 255, 255, 1], width: "7px" } }
      var extent = gra.geometry.extent
      if(extent) view.goTo(extent)
      else view.center = {x: gra.geometry.x, y: gra.geometry.y, spatialReference: view.spatialReference}  
    },
    /**
    * 查询到的所有图形高亮显示
    */
    showAllHighlight(data){
      let mapView =this.$attrs.data.mapView;
      let sp = mapView.spatialReference
      this.queryLayer = new mapView.TF_graphicsLayer();
      mapView.map.add(this.queryLayer);
      if(data && data.hasOwnProperty('features')){
        let pipes = [];
        let geometryType = data.geometryType;  //esriGeometryPoint、esriGeometryLine、esriGeometryPolygon
        let features = [];
        data.features.forEach(feature => {
          //默认为点
          let graphic = new mapView.TF_graphic({ 
              geometry:  { type: 'point', x: feature.geometry.x, y: feature.geometry.y, spatialReference: sp },
              symbol: { type: 'simple-marker', color: [0, 255, 255], size: 12, outline: { color: [0, 255, 255], width: 0 }}
          });
          //如果为面
          if(geometryType == "esriGeometryPolygon" ){
            graphic = new mapView.TF_graphic({
              geometry: { type: 'polyline', paths: feature.geometry.rings, spatialReference: sp},
              symbol: { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: [45, 116, 231, 1], width: "4px" } }
            })
          }
          //如果为线
          if(geometryType == "esriGeometryPolyline" ){
            graphic = new mapView.TF_graphic({
              geometry: { type: 'polyline', paths: feature.geometry.paths, spatialReference: sp},
              symbol: { type: 'simple-fill', color: [5, 116, 231, 1], outline: { color: [45, 116, 231, 1], width: '4px' } }
            })
          }
          features.push(graphic);
        });
        this.queryLayer.addMany(features);
      }
    },
  },
  
  /**
  * 销毁事件
  */
  destroyed() {
    var view = this.mapView
    //清除查询生成图形
    view.map.remove(this.queryLayer);
    view.graphics.remove(this.queryFeature);
    delete view.TF_resultFeatures
  }
}
</script>
<style scoped>
.el-table >>> .el-table__header-wrapper table th{
  height: 30px;
  text-align: center;
}
.el-table.mapTable >>> .el-table__body-wrapper table td{
  text-align: center;
}
</style>
