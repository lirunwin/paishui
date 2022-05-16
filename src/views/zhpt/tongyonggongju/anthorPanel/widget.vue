<template>
  <div style="padding: 0 8px;overflow:auto;">
    <tf-legend class="legend_dept" label="模式选择" isopen="true" title="选择双屏协动模式。">
      <el-checkbox v-model="followExtentC">中心同步</el-checkbox>
      <el-checkbox v-model="followExtentZ">缩放同步</el-checkbox>
    </tf-legend>
    <tf-legend
      class="legend_dept"
      label="副视图基础图层"
      isopen="true"
      title="控制副视图中的基础图层显示，如需控制主视图请直接使用主视图的图层控制。"
    >
      <el-tree
        ref="tree"
        :data="layerTable"
        node-key="id"
        :default-expand-all="true"
        show-checkbox
        @check="subLayerChange"
        :default-checked-keys="defaultCheckedKeys"
      >
        <el-row slot-scope="{ node, data }" class="custom-tree-node" style="width: 100%">
          <el-tooltip placement="right" effect="light">
            <div slot="content" style="width: 130px">
              <div>
                <span class="el-tree-node__label">透明度：{{ data.visibleNum }}</span>
              </div>
              <el-slider
                v-if="data.id !==0 && data.id !== 1"
                v-model="data.visibleNum"
                input-size="mini"
                @input="opacityChange(data)"
                :disabled="!data.layer.values_.visible"
              />
            </div>
            <span class="el-tree-node__label">{{ node.label }}</span>
          </el-tooltip>
        </el-row>
      </el-tree>
    </tf-legend>
    <tf-legend
      class="legend_dept"
      label="副视图底图图层"
      isopen="true"
      title="控制副视图中的底图图层显示，如需控制主视图请直接使用主视图的图层控制。"
    >
      <!-- <el-row>
        <el-col :span="8">
          <el-switch
            v-model="showLabel"
            style="display: block"
            active-color="#2d74e7"
            inactive-color="#ecf2ff"
            active-text
            inactive-text="标注图"
            @change="labelChange"
          />
        </el-col>
        <el-col :span="6" style="transform: translateX(-5px);">
          <span class="el-tree-node__label" style="white-space: nowrap;">透明度：{{ baseMapsNum[0] }}</span>
        </el-col>
        <el-col :span="10">
          <el-slider v-model="baseMapsNum[0]" @input="inputBaseLayer(0)" :disabled="!showLabel" />
        </el-col>
      </el-row> -->
      <el-row style="margin-top: 5px">
        <el-col :span="8" style="padding-top:9px;">
          <el-switch
            v-model="showVectorBase"
            style="display: block"
            active-color="#2d74e7"
            inactive-color="#ecf2ff"
            active-text
            inactive-text="矢量图"
            @change="baseMapChange(true)"
          />
        </el-col>
        <el-col :span="6" style="transform: translateX(-5px);padding-top:9px;">
          <span class="el-tree-node__label" style="white-space: nowrap;">透明度：{{ baseMapsNum[1] }}</span>
        </el-col>
        <el-col :span="10">
          <el-slider
            v-model="baseMapsNum[1]"
            @input="inputBaseLayer(1)"
            :disabled="!showVectorBase"
          />
        </el-col>
      </el-row>
      <el-row style="margin-top: 5px">
        <el-col :span="8" style="padding-top:9px;">
          <el-switch
            v-model="showImageBase"
            style="display: block"
            active-color="#2d74e7"
            inactive-color="#ecf2ff"
            active-text
            inactive-text="影像图"
            @change="baseMapChange(false)"
          />
        </el-col>
        <el-col :span="6" style="transform: translateX(-5px);padding-top:9px;">
          <span class="el-tree-node__label" style="white-space: nowrap;">透明度：{{ baseMapsNum[2] }}</span>
        </el-col>
        <el-col :span="10">
          <el-slider
            v-model="baseMapsNum[2]"
            @input="inputBaseLayer(2)"
            :disabled="!showImageBase"
          />
        </el-col>
      </el-row>
    </tf-legend>
  </div>
</template>

<script>
import tfLegend from '@/views/zhpt/common/Legend'
import { appconfig } from 'staticPub/config'

import 'ol/ol.css'
import { default as Olmap } from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import * as control from 'ol/control'
import { Logo, TileSuperMapRest } from '@supermap/iclient-ol'
import { TF_Layer } from '@/views/zhpt/common/mapUtil/layer'

export default {
  name: 'AnthorPanel',
  components: { tfLegend },
  props: { data: Object },
  data() {
    return {
      mapDiv: undefined,
      antP: undefined,
      mapView: undefined,
      showImageBase: false,
      showVectorBase: true,
      showLabel: true,
      baseMaps: undefined,
      baseMapsNum: [0, 0, 0],
      followExtentC: true,
      followExtentZ: true,
      layerTable: [],
      pipeLayer: undefined,
      
      currMap: null,
      defaultCheckedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
    }
  },
  mounted: function() {
    this.antP = this.data.that.$refs.antP
    this.antP.nextElementSibling.style.display = 'block'
    this.antP.style.display = 'block'

    var mapView = (this.mapView = this.data.mapView)
    this.mapDiv = mapView.getTargetElement()
    this.mapDiv.style.width = 'calc(50% - 2px)'
    this.mapDiv.style.float = 'left'

    this.mapView.updateSize() // 更新地图尺寸
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
    loadOlMap(mapContainer) {
      let layerResource = appconfig.gisResource['iserver_resource'].layerService.layers
      let center = this.mapView.getView().getCenter()
      let zoom = this.mapView.getView().getZoom()
      let map = new Olmap({
        target: mapContainer,
        view: new View({ center, zoom, projection: 'EPSG:4326' })
      })
      this.currMap = map
      this.addLayers(layerResource)

      this.setTreeData()

      this.mapView.getView().on('change', (evt) => {
        let currView = map.getView()
        let center = evt.target.getCenter(),
          zoom = evt.target.getZoom()
        this.setCenterAndZoom(currView, { center: this.followExtentC && center, zoom: this.followExtentZ && zoom })
      })
    },
    setCenterAndZoom(view, { center = null, zoom = 0 }) {
      center && view.setCenter(center)
      zoom && view.setZoom(zoom)
      // if (duration) {
      //   view.animate({ duration }, center ? { center }: null, zoom ? { zoom }: null)
      // } else {
      //   center && view.setCenter(center)
      //   zoom && view.setZoom(zoom)
      // }
    },

  addLayers(layers) {
    layers.forEach(layerConfig => {
      let { name, type, url, parentname, id, visible = true } = layerConfig
      let layer = new TF_Layer().createLayer({ url, type, visible, properties: { id, name, parentname } })
      this.currMap.addLayer(layer)
    })
  },

    setTreeData() {
      let layers = this.currMap.getLayers().array_
      let [a, b, ...last] = layers
      let layerGroup = new Map()
      last.forEach(layer => {
        let { name, parentname, id, visible } = layer.values_
        if (layerGroup.get(parentname)) {
          if (!layerGroup.get(parentname).includes(name)) {
            layerGroup.get(parentname).push({ name, id, visible, layer })
          }
        } else {
          layerGroup.set(parentname, [{ name, id, visible, layer }])
        }
      })

      let parentid = 0, layersData = [], defaultCheckedKeys = []
      layerGroup.forEach((sublayers, parentname) => {
        layersData.push({
          id: parentid++,
          label: parentname,
          children: sublayers.map(sublayer => {
            let { id, name, layer } = sublayer
            let opacity, visibleNum;
            if (sublayer.visible) {
              defaultCheckedKeys.push(id)
              visibleNum = 0
            } else {
              visibleNum = 0
            }
            return { label: name, id, layer, opacity, visibleNum }
          })
        })
      })
      this.layerTable = layersData
      this.defaultCheckedKeys = defaultCheckedKeys
    },

    subLayerChange (node) {
      if (node.children) {
        node.children.forEach(child => {
          child.layer.values_.visible = !child.layer.values_.visible;
        })
      } else {
        node.layer.values_.visible = !node.layer.values_.visible;
      }
      this.currMap.render()
    },
    opacityChange (data) {
      data.layer.values_.opacity = 1 - data.visibleNum / 100
      this.currMap.render()
    },
    // 底图变化
    baseMapChange: function(showVector) {
      if (showVector) {
        this.showImageBase = !this.showImageBase
      } else {
        this.showVectorBase = !this.showVectorBase
      }
      
      let layers = this.currMap.getLayers().getArray()
      layers.forEach(layer => {
        let { parentname, name, } = layer.values_
        if (parentname === "底图") {
          if (name === "矢量底图") layer.setVisible(this.showVectorBase)
          else if (name === "影像底图") layer.setVisible(!this.showVectorBase)
        }
      })
    },
    labelChange: function(e) {
      this.anthorBaseMaps[this.showImageBase ? 3 : 1].visible = e
    },
    inputBaseLayer: function(w) {
      const layerBox = ["标注底图", "矢量底图", "影像底图"]
      let opacity = this.baseMapsNum[w];
      let layers = this.currMap.getLayers().array_
      let thisLayer = layers.find(layer => layer.values_.name === layerBox[w])
      thisLayer.setOpacity(1 - opacity / 100)
    }
  },
  watch: {
    // layerTable: {
    //   handler (newValue, oldValue) {
    //     // this.currMap && this.currMap.render()
    //   },
    //   deep: true
    // }
  }
}
</script>
