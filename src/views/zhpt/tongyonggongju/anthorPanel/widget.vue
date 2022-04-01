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
import {appconfig } from 'staticPub/config'

import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import * as control from "ol/control";
import { Logo, TileSuperMapRest } from "@supermap/iclient-ol";


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
    this.mapDiv = mapView.getTargetElement()
    this.mapDiv.style.width = 'calc(50% - 2px)'
    this.mapDiv.style.float = 'left'
    // 更新地图尺寸
    this.mapView.updateSize()

    this.loadOlMap(this.antP)
  },
  destroyed: function() {
    this.antP.setAttribute('class', '')
    this.antP.innerHTML = ''
    this.antP.nextElementSibling.style.display = 'none'
    this.antP.style.display = 'none'
    this.mapDiv.style.width = this.mapDiv.style.float = ''
    this.mapView.updateSize()
  },
  methods: {
    loadOlMap (mapContainer) {
      console.log("加载地图")
      let { url, name } = appconfig.gisResource['tian_online_vector'].config[0]
      let center = this.mapView.getView().getCenter();
      let zoom = this.mapView.getView().getZoom();
      const map = new Map({
        target: mapContainer,
        view: new View({ center, zoom, projection: "EPSG:4326" }),
      });
      const veclayer = new TileLayer({ name, source: new TileSuperMapRest({ url: url, crossOrigin: 'anonymous' }) });
      map.addLayer(veclayer);

      this.mapView.getView().on("change", evt => {
        if (this.followExtentC && this.followExtentZ) {
          map.setView(evt.target)
        } else {
          this.followExtentC && map.getView().setCenter(evt.target.getCenter())
          this.followExtentZ && map.getView().setZoom(evt.target.getZoom())
        }
        
      })
    },

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
