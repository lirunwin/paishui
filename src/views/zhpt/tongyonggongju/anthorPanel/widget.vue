<template>
  <div style="padding: 0 8px;overflow:auto;">
    <tf-legend class="legend_dept" label="模式选择" isopen="true" title="选择双屏协动模式。">
      <el-checkbox v-model="followExtentC">中心同步</el-checkbox>
      <el-checkbox v-model="followExtentZ">缩放同步</el-checkbox>
    </tf-legend>
    <tf-legend class="legend_dept" label="副视图基础图层" isopen="true" title="控制副视图中的基础图层显示，如需控制主视图请直接使用主视图的图层控制。">
      <el-tree ref="tree" :data="layerTable" node-key="label" :default-expand-all="true"
        :props="defaultProps" show-checkbox @check="subLayerChange" >
        <el-row slot-scope="{ node, data }" class="custom-tree-node" style="width: 100%" >
          <el-tooltip placement="right" effect="light">
            <div slot="content" style="width: 130px">
              <div><span class="el-tree-node__label">透明度：{{ data.visibleNum }}</span></div>
              <el-slider v-model="data.visibleNum" input-size="mini" @input="data.layer.opacity = 1.0 - data.opacity / 100" :disabled="!data.visible" />
            </div>
            <span class="el-tree-node__label">{{ node.label }}</span>
          </el-tooltip>
        </el-row>
      </el-tree>
    </tf-legend>
    <tf-legend class="legend_dept" label="副视图底图图层" isopen="true" title="控制副视图中的底图图层显示，如需控制主视图请直接使用主视图的图层控制。">
      <el-row>
        <el-col :span="8">
          <el-switch v-model="showLabel" style="display: block" active-color="#2d74e7" inactive-color="#ecf2ff"
                active-text="" inactive-text="标注图" @change="labelChange" />
        </el-col>
        <el-col :span="6" style="transform: translateX(-5px);" >
          <span class="el-tree-node__label" style="white-space: nowrap;">透明度：{{ baseMapsNum[0] }}</span>
        </el-col>
        <el-col :span="10" >
          <el-slider v-model="baseMapsNum[0]" @input="inputBaseLayer(0)" :disabled="!showLabel"/>
        </el-col>
      </el-row>
      <el-row style="margin-top: 5px" >
        <el-col :span="8" >
          <el-switch v-model="showVectorBase" style="display: block" active-color="#2d74e7" inactive-color="#ecf2ff" 
          active-text="" inactive-text="矢量图" @change="baseMapChange(true)" />
        </el-col>
        <el-col :span="6" style="transform: translateX(-5px);" >
          <span class="el-tree-node__label" style="white-space: nowrap;">透明度：{{ baseMapsNum[1] }}</span>
        </el-col>
        <el-col :span="10"><el-slider v-model="baseMapsNum[1]" @input="inputBaseLayer(1)" :disabled="!showVectorBase"/></el-col>
      </el-row>
      <el-row style="margin-top: 5px">
        <el-col :span="8">
          <el-switch v-model="showImageBase" style="display: block" active-color="#2d74e7" inactive-color="#ecf2ff" active-text=""
          inactive-text="影像图" @change="baseMapChange(false)" />
        </el-col>
        <el-col :span="6" style="transform: translateX(-5px);">
          <span class="el-tree-node__label" style="white-space: nowrap;">透明度：{{ baseMapsNum[2] }}</span>
        </el-col>
        <el-col :span="10"><el-slider v-model="baseMapsNum[2]" @input="inputBaseLayer(2)" :disabled="!showImageBase"/></el-col>
      </el-row>
    </tf-legend>
  </div>
</template>

<script>
import tfLegend from '@/views/zhpt/common/Legend'
import { esriConfig, appconfig } from 'staticPub/config'
import { loadModules } from 'esri-loader'
export default {
  name: 'AnthorPanel',
  components: { tfLegend },  
  props: { data: Object },
  data() {
    return {
      mapDiv: undefined,
      antP: undefined,
      mapView: undefined,
      mapView2: undefined,
      showImageBase: false,
      showVectorBase: true,
      showLabel: true,
      baseMaps: undefined,
      baseMapsNum: [0, 0, 0],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      followExtentC: true,
      followExtentZ: true,
      layerTable: [],      
      pipeLayer: undefined
    }
  },
  mounted: function() {
    this.antP = this.data.that.$refs.antP
    this.antP.nextElementSibling.style.display = 'block'
    this.antP.style.display = 'block'
    var mapView = this.mapView = this.data.mapView
    this.mapDiv = mapView.container
    this.mapDiv.style.width = 'calc(50% - 2px)'
    this.mapDiv.style.float = 'left'
    mapView.TF_mouseLocation.$refs.mouse.style.left = 'calc(50% + 5px)'

    var that = this
    loadModules(
      ['esri/Map', 'esri/views/MapView', 'esri/layers/WebTileLayer', 'esri/layers/TileLayer', 'esri/layers/MapImageLayer', 'esri/layers/support/LOD'], 
      { url: esriConfig.baseUrl })
      .then((
        [Map, MapView, WebTileLayer, TileLayer, MapImageLayer, Lod]) => {
      var config = esriConfig
      var aconfig = appconfig

      var layerType = { 'webTiled': WebTileLayer, 'dynamic': MapImageLayer, 'tiled': TileLayer }
      var layersConfig
      var key = aconfig.isonline ? appconfig.tianMapKey : ''
      var tileInfo = aconfig.isonline ? (visible) => {
        return {
          visible: visible !== false,
          subDomains: '01234567'.split('').map(e => 't' + e),
          tileInfo: {
            rows: 256, cols: 256, origin: { x: -180, y: 90 }, spatialReference: { wkid: 4490 },
            lods: Array.from({length:20}, (e, i) => i).map((e, i) => { 
              return {level: i + 2, levelValue: i + 2, resolution: 0.3515625 / Math.pow(2, i), scale: 147748796.52937502 / Math.pow(2, i)}
            })
          }, spatialReference: 4490, fullExtent: { xmin: -180, ymin: -90, xmax: 180, ymax: 90, spatialReference: 4490 }
        }
      } : (visible) => { return { visible: visible } }
      layersConfig = aconfig.isonline ? [
        [ aconfig.gisResource.tian_online_vector.config[0].url, aconfig.gisResource.tian_online_vector.type ], 
        [ aconfig.gisResource.tian_online_vector_label.config[0].url, aconfig.gisResource.tian_online_vector_label.type ], 
        [ aconfig.gisResource.tian_online_raster.config[0].url, aconfig.gisResource.tian_online_raster.type ], 
        [ aconfig.gisResource.tian_online_raster_label.config[0].url, aconfig.gisResource.tian_online_raster_label.type ], 
        [ aconfig.gisResource.business_map.config[0].url, aconfig.gisResource.business_map.type ]
      ] : [
        [ aconfig.gisResource.tian_offline_vector.config[0].url, aconfig.gisResource.tian_offline_vector.type ], 
        [ aconfig.gisResource.tian_offline_vector_label.config[0].url, aconfig.gisResource.tian_offline_vector_label.type ], 
        [ aconfig.gisResource.tian_offline_raster.config[0].url, aconfig.gisResource.tian_offline_raster.type ], 
        [ aconfig.gisResource.tian_offline_raster_label.config[0].url, aconfig.gisResource.tian_offline_raster_label.type ], 
        [ aconfig.gisResource.business_map.config[0].url, aconfig.gisResource.business_map.type ]
      ]
      that.anthorBaseMaps = [
        new layerType[layersConfig[0][1]](layersConfig[0][0] + key, tileInfo(true)),
        new layerType[layersConfig[1][1]](layersConfig[1][0] + key, tileInfo(true)),
        new layerType[layersConfig[2][1]](layersConfig[2][0] + key, tileInfo(false)),
        new layerType[layersConfig[3][1]](layersConfig[3][0] + key, tileInfo(false)),
        new layerType[layersConfig[4][1]]({ url: layersConfig[4][0] }),
      ]
      var anthorMapView = that.anthorMapView = new MapView({
        container: that.antP,
        map: new Map({ basemap: { baseLayers: that.anthorBaseMaps }}),
        extent: that.mapView.extent
      })

      that.antP.children[0].style.height = '100%'
      anthorMapView.ui.components = []
      that.anthorBaseMaps[4].load().then(_ => {
        that.loadTree()
        anthorMapView.constraints.lods = [125000, 64000, 32000, 16000, 8000, 4000, 2000, 1000, 500, 100].map((s, i) => { return new Lod({ level: i, scale: s }) })
        that.extentChange = that.mapView.watch('extent', (extent) => {        
          if (that.followExtentC) anthorMapView.center = extent.center      
          if (that.followExtentZ) anthorMapView.zoom = mapView.zoom      
        })
      })
    })
  },
  destroyed: function() {
    this.extentChange.remove()
    this.antP.setAttribute('class', '')
    this.antP.innerHTML = ''
    this.antP.nextElementSibling.style.display = 'none'
    this.antP.style.display = 'none'
    this.mapDiv.style.width = this.mapDiv.style.float = ''
    this.mapView.TF_mouseLocation.$refs.mouse.style.left = '5px'
  },
  methods: {
    loadTree() {
      var tree = []
      var basemaps = this.anthorBaseMaps
      var mainBaseMap = this.mapView.map.basemap.baseLayers.items[4].sublayers.items
      for(let i=0,il=basemaps[4].sublayers.items,ii=il.length;i<ii;i++){    
        var layer = il[i]
        var mainLayer = mainBaseMap[i]
        layer.opacity = mainLayer.opacity
        layer.visible = mainLayer.visible
        tree.push({
          id:layer.id, label: layer.title, visible: layer.visible ? 1 : 0,
          opacity: 100 - layer.opacity * 100, layer: layer
        })
        if(!layer.sublayers) continue
        var nodeChildren = tree[tree.length - 1]
        nodeChildren.children = []
        nodeChildren = nodeChildren.children
        var visible = 0
        for(var j=0,jl=layer.sublayers.items,jj=jl.length;j<jj;j++){
          layer = jl[j]
          if(layer.visible) visible += 1
          mainLayer = mainBaseMap[i].sublayers.items[j]
          layer.opacity = mainLayer.opacity
          layer.visible = mainLayer.visible
          nodeChildren.push({
            id:layer.id, label: layer.title, visible: layer.visible ? 1 : 0,
            opacity: 100 - layer.opacity * 100, layer: layer
          })
        }
        if(visible == jj) visible = 1
        if(visible != 0 && visible != jj) visible = 0.5
        tree[tree.length - 1].visible = visible
      }
      tree = tree.reverse()
      for(let i=0,ii=tree.length;i<ii;i++){
        if(tree[i].children) {
          tree[i].children = tree[i].children.reverse()
        }
      }
      this.layerTable = tree
      var treeDiv = this.$refs.tree
      this.$nextTick(() => {
        for (let i = 0, il = tree, ii = il.length; i < ii; i++) {
          var di = il[i]
          treeDiv.setChecked(di.label, di.visible)
          if(!di.children) continue
          for (let j = 0, jl = di.children, jj = jl.length; j < jj; j++) 
            treeDiv.setChecked(jl[j].label, jl[j].visible)        
        }
      })
      this.showLabel = basemaps[1].visible || basemaps[3].visible
      this.showImageBase = !(this.showVectorBase = basemaps[0].visible)
    },
    subLayerChange: function(node) {       
      var dv
      switch(node.visible) {
        case 0:
          node.layer.visible = true
          dv = node.visible = 1
          break
        case 0.5: 
          node.layer.visible = true
          dv = node.visible = 1
          break
        case 1: 
          node.layer.visible = false
          dv = node.visible = 0
          break
      }
      if(node.children) {
        var ldv = dv ? true : false
        for(var i=0,il=node.children,ii=il.length;i<ii;i++) {
          var di = il[i]
          di.layer.visible = ldv
          di.visible = dv
        }
      }
      // node.layer.visible = node.visible = !node.visible
    },
    baseMapChange: function(e) {
      if (e) this.showImageBase = !this.showVectorBase
      else this.showVectorBase = !this.showImageBase
      var basemaps = this.anthorBaseMaps
      basemaps[0].visible = !(basemaps[2].visible = this.showImageBase)      
      if (this.showLabel) {
        basemaps[1].visible = !(basemaps[3].visible = this.showImageBase)
      }
    },
    labelChange: function(e) { this.anthorBaseMaps[this.showImageBase ? 3 : 1].visible = e }, 
    inputBaseLayer: function(w) {
      if(!this.anthorBaseMaps) return
      if (w === 0) this.anthorBaseMaps[1].opacity = this.anthorBaseMaps[3].opacity = 1.0 - this.baseMapsNum[w] / 100
      else this.anthorBaseMaps[w > 1 ? w : w - 1].opacity = 1.0 - this.baseMapsNum[w] / 100
    }
  }
}
</script>
