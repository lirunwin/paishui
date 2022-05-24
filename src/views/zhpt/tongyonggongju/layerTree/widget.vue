<template>
    <div class="tree_box">
      <el-tree
        ref="tree"
        :data="layersData"
        show-checkbox
        :default-checked-keys="defaultCheckedKeys"
        :default-expand-all="true"
        node-key="id"
        @check="setLayerVisible"
      />
    </div>
</template>

<script>

import { Vector } from "ol/layer"
import { appconfig } from 'staticPub/config'
import { TF_Layer } from '@/views/zhpt/common/mapUtil/layer'

export default {
    props: {
        data: null,
    },
    data () {
        return {
            layersData: [],
            defaultCheckedKeys: [],

        }
    },
    methods: {
        initTree () {
            let layerIds = this.$store.state.gis.ids, ids = [], id = 0
            let layers = appconfig.gisResource['iserver_resource'].layerService.layers
            let showlayers = layers.filter(layer => layer.type === 'smlayer')
            this.layersData = showlayers.map(parentlayer => {
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
            if (!this.$store.state.gis.hasLoadIds) {
                // 第一次加载
                this.$store.state.gis.ids = ids
                this.$store.state.gis.hasLoadIds = true
            }
            let checkedIDs = this.$store.state.gis.ids.filter(obj => {
                if (ids.length > this.$store.state.gis.ids.length) {
                    return !obj.isParent
                }
                return true
            })
            this.defaultCheckedKeys = checkedIDs.map(obj => obj.id)
        },
        setLayerVisible (row, check) {
            let visible = check.checkedKeys.includes(row.id)
            // 保存/删除当前 id
            let ids = this.$store.state.gis.ids
            if (!visible) {
                let index = ids.findIndex(obj => obj.id === row.id)
                ids.splice(index, 1)
            } else {
                ids.push({ id: row.id, name: row.label })
            }
            // 确认父子图层
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
                        let visible = ids.find(obj => obj.name === l.title)
                        l.visible = !!visible
                    }
                })
            }

            if (!findLayer) return
            // 删掉原有图层，添加新图层
            new TF_Layer().createLayers([findLayer]).then(layers => {
                let layerInMap = this.data.mapView.getLayers().getArray().find(layer => layer.get('name') === findLayer.name)
                this.data.mapView.addLayer(layers[0])
                setTimeout(() => {
                    this.data.mapView.removeLayer(layerInMap)
                }, 1000)
            })
            
        }
    },
    mounted () {
        this.initTree()
    }
    
}
</script>

<style>

</style>