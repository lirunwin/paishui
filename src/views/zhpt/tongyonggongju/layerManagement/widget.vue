<template>
  <div style="padding: 0 8px;overflow:auto;">
    <tf-legend class="legend_dept" label="基础图层" isopen="true">
      <el-tree ref="tree" :data="layerTable" node-key="label" :default-expand-all="true"
        :props="{ children: 'children', label: 'label' }" show-checkbox @check="subLayerChange" >
        <el-row slot-scope="{ node, data }" class="custom-tree-node" style="width: 100%" >
          <el-tooltip placement="right" effect="light">
            <div slot="content" style="width: 130px">
              <div><span class="el-tree-node__label">透明度：{{ data.opacity }}</span></div>
              <el-slider v-model="data.opacity" input-size="mini" 
                @input="data.layer.opacity = 1.0 - data.opacity / 100" :disabled="!data.visible" />
            </div>
            <span class="el-tree-node__label">{{ node.label }}</span>
          </el-tooltip>
        </el-row>
      </el-tree>
    </tf-legend>
    <tf-legend class="legend_dept" label="底图图层" isopen="true">
      <el-row>
        <el-col :span="8">
          <el-switch v-model="showLabel" style="display: block" active-color="#2d74e7" inactive-color="#ecf2ff"
                active-text="" inactive-text="标注图" @change="labelChange" :disabled="!showVectorBase && !showImageBase" />
        </el-col>
        <el-col :span="6" style="transform: translateX(-5px);" >
          <span class="el-tree-node__label" style="white-space: nowrap;">透明度：{{ baseMapsNum[0] }}</span>
        </el-col>
        <el-col :span="10" >
          <el-slider v-model="baseMapsNum[0]" @input="inputBaseLayer(0)" :disabled="!showLabel" />
        </el-col>
      </el-row>
      <el-row style="margin-top: 5px" >
        <el-col :span="8" >
          <el-switch v-model="showVectorBase" style="display: block" active-color="#2d74e7" inactive-color="#ecf2ff" 
          active-text="" inactive-text="矢量图" @change="labelMapChange" />
        </el-col>
        <el-col :span="6" style="transform: translateX(-5px);" >
          <span class="el-tree-node__label" style="white-space: nowrap;">透明度：{{ baseMapsNum[1] }}</span>
        </el-col>
        <el-col :span="10"><el-slider v-model="baseMapsNum[1]" @input="inputBaseLayer(1)" :disabled="!showVectorBase"/></el-col>
      </el-row>
      <el-row style="margin-top: 5px">
        <el-col :span="8">
          <el-switch v-model="showImageBase" style="display: block" active-color="#2d74e7" inactive-color="#ecf2ff" active-text=""
          inactive-text="影像图" @change="resMapChange" />
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
export default {
  name: 'LayerManagement',
  components: { tfLegend },
  props: {},
  data() {
    return {
      showLabel: false,
      showVectorBase: true,
      showImageBase: true,
      baseMapsNum: [0, 0, 0],
      layerTable: [],
    }
  },
  watch: {
    sidePanelOn(newTab, oldTab) {
      // if(e == 'layerManagement' && !this.mapView.isLayersInfoNeedReload) this.$nextTick(this.loadTree)      
      if(newTab == oldTab) return
      if(newTab == 'layerManagement') {
        this.$nextTick(this.loadTree)  
      }
    },
    showLabel(e) {
      var basemaps = this.baseMaps
      basemaps[1].visible = e && this.showVectorBase
      basemaps[3].visible = e && this.showImageBase
    },
    showVectorBase(e) {
      this.baseMaps[0].visible = e
    },
    showImageBase(e) {
      this.baseMaps[2].visible = e
    },
  },
  computed: {
    sidePanelOn() {
      return this.$store.state.map.P_editableTabsValue;
    },
  },
  mounted: function() {
    var mapView = this.mapView = this.$attrs.data.mapView
    this.baseMaps = mapView.map.basemap.baseLayers.items
    this.pipeLayer = this.baseMaps[4]
    this.$nextTick(this.loadTree)
  },
  methods: {
    loadTree() {
      var tree = []
      for(let i=0,il=this.pipeLayer.sublayers.items,ii=il.length;i<ii;i++){    
        var layer = il[i]
        tree.push({
          id:layer.id, label: layer.title, visible: layer.visible ? 1 : 0,
          opacity: 100 - layer.opacity * 100, layer: layer
        })
        if(!layer.sublayers) continue
        var lastNode = tree[tree.length - 1]        
        var nodeChildren = lastNode.children = []
        var visible = 0
        for(var j=0,jl=layer.sublayers.items,jj=jl.length;j<jj;j++){
          layer = jl[j]
          if(layer.visible) visible += 1
          nodeChildren.push({
            id:layer.id, label: layer.title, visible: layer.visible ? 1 : 0,
            opacity: 100 - layer.opacity * 100, layer: layer, parent: lastNode
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
      var basemaps = this.baseMaps
      this.showLabel = basemaps[1].visible || basemaps[3].visible
      this.showImageBase = !(this.showVectorBase = basemaps[0].visible)
      this.mapView.isLayersInfoNeedReload = true
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
        var ldv = dv != 0
        for(var i=0,il=node.children,ii=il.length;i<ii;i++) {
          var di = il[i]
          di.layer.visible = ldv
          di.visible = dv
        }
      } else if(node.parent) {
        var p = node.parent
        for(var i=0,il=p.children,ii=il.length,count = 0;i<ii;i++) {
          if(il[i].visible == 1) count += 1
        }
        if(node.parent.visible == 0 && dv == 1) {
          p.layer.visible = true
          p.visible = count == il.length ? 1 : 0.5
        } else if(node.parent.visible == 1 && dv == 0) {
          p.visible = p.children.length == 1 ? 0 : 0.5
          p.layer.visible = p.children.length != 1
        } else if(node.parent.visible == 0.5 && dv == 0) {
          p.visible = count == 0 ? 0 : 0.5
          p.layer.visible = count != 0
        } else if(node.parent.visible == 0.5 && dv == 1) {
          p.visible = count == il.length ? 1 : 0.5
        }
      }
    },
    labelMapChange(n) {
      var basemaps = this.baseMaps
      if(n) {
        this.showImageBase = false
        if (this.showLabel) basemaps[3].visible = !(basemaps[1].visible = n)
      } else this.showLabel = false
    },
    resMapChange(n) {
      var basemaps = this.baseMaps
      if(n) {
        this.showVectorBase = false
        if (this.showLabel) basemaps[1].visible = !(basemaps[3].visible = n)
      } else this.showLabel = false
    },
    inputBaseLayer: function(w) {
      if (w === 0) this.baseMaps[1].opacity = this.baseMaps[3].opacity = 1.0 - this.baseMapsNum[w] / 100
      else this.baseMaps[w > 1 ? w : w - 1].opacity = 1.0 - this.baseMapsNum[w] / 100
    },
    labelChange: function(e) { this.baseMaps[this.showImageBase ? 3 : 1].visible = e }
  }
}
</script>