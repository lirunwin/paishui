<template>
  <div style="padding: 0 8px; height:100%; overflow: auto">
    <el-tabs v-model="activeName" v-way="wayFun('tabs')" style="height:100%">
      <el-tab-pane label="属性标注" name="attQuerry" style="height:100%">        
        <div ref="legend" id="Legend" class="Legend">
          <div class="label" @click="openstate = !openstate">要素选择
            <el-tooltip class="item" effect="dark" content="在地图上点击选取要素。下方将会列出所选要素的相关信息。" placement="right">
              <i class="el-icon-info" ref="info"></i>
            </el-tooltip><el-checkbox style="margin-left: 4px;" v-model="ractSelect" @change="isDrawRect">框选</el-checkbox>
            <div ref="isQuery" style="display: none;"><i class="el-icon-loading" />查询中</div>
          </div>
          <div v-show="openstate" class="content">
            <el-table highlight-current-row :data="featureData" stripe height="200px" style="width: 100%;margin-bottom: 8px" row-class-name="selectRowC" @row-click="showFea">
              <el-table-column prop="layer" label="图层" />
              <el-table-column prop="name" label="编码" />
            </el-table>
          </div>
        </div>
        <tf-legend class="legend_dept" label="要素详细" isopen="true" title="显示标注要素字段及属性。" style="height:calc(100% - 243px)">
          <el-table :data="attData" stripe height="calc(100% - 8px)" style="width: 100%;margin-bottom: 8px">
            <el-table-column prop="fix" label="字段" />
            <el-table-column prop="att" label="属性" />
          </el-table>
        </tf-legend>
      </el-tab-pane>
      <el-tab-pane label="设置" name="setting" style="height:100%">
        <tf-legend class="legend_dept" label="图层名称" isopen="true" title="指定查询的图层。">
          <el-select v-model="layerName" size="small" placeholder="请选择">
            <el-option v-for="(item, index) in layersAtt" :key="index" :value="item.label"/>
          </el-select>
        </tf-legend>
        <tf-legend class="legend_dept" label="可见属性" isopen="true" title="指定所要查询的属性字段。">
          <el-table ref="attTable" :data="attDatas" stripe height="400px" style="width: 100%" @select="selectChange" @select-all="selectChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="属性" /></el-table>
        </tf-legend>
        <el-button size="mini" type="primary" style="width:100%" @click="saveLayer">保存</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { esriConfig, appconfig } from 'staticPub/config'
import tfLegend from '@/views/zhpt/common/Legend'
import request from '@/utils/request'
export default {
  name: 'QueryResult',
  components: { tfLegend },
  directives: {
    way(el, bind) {
      if (typeof bind.value === 'function') bind.value(el)
    }
  },
  props: { param: Object },
  data() {
    return {
      ami: 8,
      inr: {},
      attData: [],
      attDatas: [],
      elements: {},
      openstate: true,
      layerName: '',
      layersAtt: [],
      activeName: 'attQuerry',
      ractSelect: false,
      featureData: []
    }
  },
  computed: { sidePanelOn() { return this.$store.state.map.P_editableTabsValue } },
  mounted: function() {},
  watch:{
    layerName() {
      var id = this.layersAttIndex[this.layerName]
      if(!id) return
      this.attDatas = []
      $.ajax({
        url: this.businessMap + "/" + id + "/?f=pjson",
        type: 'GET',
        success: (data) => {
          data = JSON.parse(data).fields
          if(!data) return this.$message.error('图层信息获取失败')
          var fields = []
          var tableDiv = this.$refs.attTable
          var Nfields = this.NField[this.layernameIndex[id].value]
          if(!Nfields) Nfields = []
          var selectIs = []
          for(let i=0,ii=data.length;i<ii;i++){
            var layer = data[i]
            var select = true
            if(Nfields.indexOf(layer.alias) > -1) {
              select = false
            } else {
              selectIs.push(i)
            }
            fields.push({ name: layer.alias, att: layer.name, select: select})      
          }   
          this.attDatas = fields
          this.$nextTick(() => {
            selectIs.map((i) => tableDiv.toggleRowSelection(fields[i]))
          })          
        },
        error: (error) => this.$message.error(error)
      })
    },
    sidePanelOn(newTab, oldTab) {
      if(newTab == oldTab) return
      if(newTab == 'queryResult') {
        this.$nextTick(() => {
          if(this.ractSelect) this.isDrawRect()
          else this.onClick()
          this.gra.visible = true
          this.showGeo.visible = true
        })  
      } 
      if(oldTab == 'queryResult') {
        var mapView = this.mapView
        var draw = mapView.TF_draw
        if (draw.activeAction) draw.reset()
        if (this.click) {
          this.click.remove()
          this.click = undefined
        }
        this.gra.visible = false
        this.showGeo.visible = false
      }
    }
  },
  methods: {
    wayFun: function(flag) {
      return (el) => {
        this.elements[flag] = el
      }
    },
    isDrawRect: function() {
      if (this.click) {
        this.click.remove()
        this.click = undefined
      }
      var draw = this.mapView.TF_draw
      if (draw.activeAction) draw.reset()
      this[this.ractSelect ? 'onDrawRect' : 'onClick']()
    },
    onClick: function() {
      var mapview = this.mapView
      mapview.container.style.cursor = 'pointer'
      if (this.click) {
        this.click.remove()
        this.click = undefined
      }
      this.click = mapview.on('click', (evt) => {
        var xy = mapview.toMap({ x: evt.x, y: evt.y })
        var [x, y] = [xy.x, xy.y]
        var r = mapview.resolution * 7; var da = Math.PI / 20
        var ret = []
        var PI2 = Math.PI * 2; var sin = Math.sin; var cos = Math.cos
        for (let i = 0; i < PI2; i += da) {
          ret.push([x + r * cos(i), y + r * sin(i)])
        }
        this.gra.geometry = { type: 'polygon', rings: [ret], spatialReference: mapview.spatialReference }
        this.$refs.isQuery.style.display = 'inline-block'
        this.query()
      })
    },
    onDrawRect: function() {
      var view = this.mapView
      var sp = view.spatialReference
      this.action = view.TF_drawRect(() => { view.container.style.cursor = 'crosshair' },
        (evt) => {
          if (evt.vertices.length < 2) {
            this.gra.geometry = { type: 'polygon', spatialReference: sp }
          }
        }, (evt) => {
          var v = evt.vertices
          if (v.length > 1) {
            this.gra.geometry = { type: 'polygon', rings: [[v[0], [v[1][0], v[0][1]], v[1], [v[0][0], v[1][1]]]], spatialReference: sp }
          }
        }, () => {
          this.query()
          this.$nextTick(this.onDrawRect())
        })
    },
    query() {
      var geometry = this.gra.geometry
      if(!geometry) return
      var view = this.mapView
      var mapExtent = view.extent.toJSON()
      $.ajax({
        url: this.businessMap + '/identify',
        type: 'POST',
        data: {
          geometry: JSON.stringify(geometry.toJSON()),
          geometryType: 'esriGeometryPolygon',
          layers: 'all:' + this.getLayers().join(','),
          tolerance: '6',
          mapExtent: mapExtent.xmin + ',' + mapExtent.ymin + ',' + mapExtent.xmax + ',' + mapExtent.ymax,
          imageDisplay: (view.width / 96).toFixed(2) + ',' + (view.height / 96).toFixed(2) + ',' + '96',
          f: 'pjson'
        },  
        success: (data) => {
          data = JSON.parse(data).results
          this.$refs.isQuery.style.display = 'none'
          if(data.length < 1) {
            this.$message('无查询结果')
            return
          }
          this.$message('查询结果：' + data.length + ' 项')
          var featureData = []
          for(let i=0,ii=data.length;i<ii;i++) {
            var di = data[i]
            var inFea = { layer: di.layerName, name: di.value, att: di.attributes }
            featureData.push(inFea)
            switch(di.geometryType) {
              case 'esriGeometryPoint':
                inFea.geo =  { type: 'point', x: di.geometry.x, y: di.geometry.y} 
                break
              case 'esriGeometryPolyline':
                inFea.geo =  { type: 'polyline', paths: di.geometry.paths} 
                break
              case 'esriGeometryPolygon':
                inFea.geo =  { type: 'polygon', rings: di.geometry.rings} 
                break
            }
          }
          this.featureData = featureData
        },
        error: (error) => this.$message.error(error)
      })
    },
    getLayers() {
      var business = this.businessMap
      for (let i=0,il=this.mapView.map.basemap.baseLayers.items,ii=il.length,sublayerids = [];i<ii; i++) {
        if(il[i].url && il[i].url == business) {
          for(let j=0,jl=il[i].allSublayers.items,jj=jl.length;j<jj;j++){
            var layer = jl[j]
            if(!layer.sublayers && layer.title != '图幅框') sublayerids.push(layer.id)
          }
          return sublayerids.sort((a, b) => a - b)
        }
      }
    },
    showFea(row) {
      var view = this.mapView
      this.gra.geometry = { type: 'polygon', rings: [[[0,0]]], spatialReference: view.spatialReference }
      var geometry = JSON.parse(JSON.stringify(row.geo))
      geometry.spatialReference = view.spatialReference
      this.showGeo.geometry = geometry
      switch(row.geo.type) {
        case 'point':
          view.center = {x: geometry.x, y: geometry.y, spatialReference: view.spatialReference}  
          view.zoom = 6
          this.showGeo.symbol = { type: 'simple-marker', color: [255, 255, 255], size: 8, outline: { color: [51, 133, 255], width: 2 }}
          break
        case 'polyline':
        case 'polygon':
          view.goTo(this.showGeo.geometry.extent)
          this.showGeo.symbol = { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: [45, 116, 231, 1], width: '3px' }}
          break
      }
      var atts = row.att
      var datatable = []
      var dontSeeField = this.NField[this.layernameIndex[this.layersAttIndex[row.layer]].value]
      if(dontSeeField) {
        for(var field in atts) {          
          if(dontSeeField.indexOf(field) < 0) {
            var att = atts[field]
            if(att == 'Null') att = ''
            datatable.push({ fix: field, att: att || '' })
          }
        }
      } else {
        for(var field in atts) {
          var att = atts[field]
          if(att == 'Null') att = ''
          datatable.push({ fix: field, att: att || '' })
        }
      }
      this.attData = datatable      
    },
    listRefersh() {
      request({
        url: 'gis/customDisplay/viewDynamicLog', method: 'GET'
      }).then(res => {
        if(res.code == 1) {
          var ids = {}
          res = res.result.records
          for(let i=0,il=res,ii=il.length;i<ii;i++) {
            ids[il[i].layerEn] = il[i].nonFields.split(',')
          }
          this.NField = ids
        }
      })
    },
    saveLayer() {
      var ln = this.layerName
      var layerName = this.layernameIndex[this.layersAttIndex[ln]].value
      var dontSeeField = []
      for(let i=0,il=this.attDatas,ii=il.length;i<ii;i++) {
        if(!il[i].select) dontSeeField.push(il[i].name)
      }
      request({
        url: 'gis/customDisplay/insertDynamicLogo', method: 'post',
        data: {
          layerEn: layerName,
          nonFields: dontSeeField.join(','),
        }
      }).then(res => {
        if(res.code == 1) {          
          this.$message.success('保存：' + ln + ' 显示字段成功')
          this.listRefersh()
        }
      })
    },
    selectChange(select, row) {
      if(row) {
        row.select = !row.select
      } else {
        select = select.length != 0
        for(let j=0,jl=this.attDatas,jj=jl.length;j<jj;j++) {
          jl[j].select = select
        }
      }
    }
  },
  destroyed: function() {
  }
}
</script>
