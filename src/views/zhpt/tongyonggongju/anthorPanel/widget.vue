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
        <!-- <el-row slot-scope="{ node, data }" class="custom-tree-node" style="width: 100%">
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
        </el-row> -->
      </el-tree>
    </tf-legend>
    <tf-legend
      class="legend_dept"
      label="副视图底图图层"
      isopen="true"
      title="控制副视图中的底图图层显示，如需控制主视图请直接使用主视图的图层控制。"
    >
      <el-row style="margin-top: 5px">
        <el-col :span="10" style="padding-top:9px;">
          <el-switch
            v-model="showVectorBase"
            style="display: block"
            active-color="#2d74e7"
            inactive-color="#ecf2ff"
            active-text
            inactive-text="矢量底图"
            @change="baseMapChange(true)"
          />
        </el-col>
        <el-col :span="6" style="transform: translateX(-5px);padding-top:9px;">
          <span class="el-tree-node__label" style="white-space: nowrap;">透明度：{{ baseMapsNum[0] }}</span>
        </el-col>
        <el-col :span="8">
          <el-slider
            v-model="baseMapsNum[0]"
            @input="inputBaseLayer(0)"
            :disabled="!showVectorBase"
          />
        </el-col>
      </el-row>
      <el-row style="margin-top: 5px">
        <el-col :span="10" style="padding-top:9px;">
          <el-switch
            v-model="showImageBase"
            style="display: block"
            active-color="#2d74e7"
            inactive-color="#ecf2ff"
            active-text
            inactive-text="影像底图"
            @change="baseMapChange(false)"
          />
        </el-col>
        <el-col :span="6" style="transform: translateX(-5px);padding-top:9px;">
          <span class="el-tree-node__label" style="white-space: nowrap;">透明度：{{ baseMapsNum[1] }}</span>
        </el-col>
        <el-col :span="8">
          <el-slider
            v-model="baseMapsNum[1]"
            @input="inputBaseLayer(1)"
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
import { defaults as controls } from 'ol/control'

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
      baseMapsNum: [0, 0],
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

    var mapView = this.mapView = this.data.mapView
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
        view: new View({ center, zoom, projection: 'EPSG:4326' }),
        controls: controls({
          zoom: false,
          attribution: false
        }),
      })
      this.currMap = map
      this.addLayers(layerResource)

      this.setTreeData(layerResource)

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

    addLayers(layersSource) {
      new TF_Layer().createLayers(layersSource).then(layers => {
        layers.forEach(layer => {
          layer && this.currMap.addLayer(layer)
        })
      })
    },

    setTreeData(layers) {
      let showlayers = layers.filter(layer => layer.type === 'smlayer')
      let id = 0, ids = []
      let layersData = showlayers.map(parentlayer => {
        let parentId = id++
        let parentName = parentlayer.name
        ids.push({ id: parentId, name: parentName, isParent: true })
        let sublayers = parentlayer.sublayers.map(sublayer => {
          let layerId = id++
          ids.push({ id: layerId, name: sublayer.title, isParent: false })
          return { id: layerId, label: sublayer.title, parentName }
        })
        return { id: parentId, label: parentlayer.name, children: sublayers }
      })
      this.layerTable = layersData
      this.defaultCheckedKeys = ids.map(obj => obj.id)
    },

    subLayerChange (row, check) {
      let visible = check.checkedKeys.includes(row.id)
      let isParent, parentLayerName = ''

      if ('children' in row) {
        isParent = true
        parentLayerName = row.label
      } else {
        isParent = false
        parentLayerName = row.parentName
      }
      // 筛选选择的图层
      let layers = appconfig.gisResource['iserver_resource'].layerService.layers
      let showlayers = layers.filter(layer => layer.type === 'smlayer')
      let filterLayer = showlayers.find(layer => layer.name = parentLayerName)
      // 设置子图层显隐
      let findLayer = null
      if (filterLayer) {
        let tempSublayers = filterLayer.sublayers.map(layer => {
          return { ...layer }
        })
        findLayer = { ...filterLayer, sublayers: [ ...tempSublayers ] }
        findLayer.sublayers.forEach(l => {
          if (isParent) {
            l.visible = visible
          } else {
            let visible = check.checkedNodes.find(obj => obj.label === l.title)
            l.visible = !!visible
          }
        })
      }
      // 删掉原有图层，添加新图层
      new TF_Layer().createLayers([findLayer]).then(layers => {
        let layerInMap = this.currMap.getLayers().getArray().find(layer => layer.get('name') === findLayer.name)
        this.currMap.addLayer(layers[0])
        setTimeout(() => {
          this.currMap.removeLayer(layerInMap)
        }, 1000)
      })
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
          if (name.includes("矢量")) layer.setVisible(this.showVectorBase)
          else if (name.includes("影像")) layer.setVisible(!this.showVectorBase)
        }
      })
    },
    labelChange: function(e) {
      this.anthorBaseMaps[this.showImageBase ? 3 : 1].visible = e
    },
    inputBaseLayer: function(w) {
      let layerBox = ['矢量', '影像']
      let opacity = this.baseMapsNum[w];
      let layers = this.currMap.getLayers().getArray()
      layers.filter(layer => layer.get('name').includes(layerBox[w])).forEach(layer => {
        layer.setOpacity(1 - opacity / 100)
      })
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
