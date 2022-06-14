<template>
    <div class="tree_box" style="max-height: 800px">
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
import { mapUtil } from '../../common/mapUtil/common'

export default {
    props: {
        data: null,
    },
    data () {
        return {
            layersData: [],
            defaultCheckedKeys: [],
            treeTitle: '', // 显示的图例, 
            type: '' // 加载图例类型
        }
    },
    created () {
        console.log('图层树设置')
        let [layerName, type] = appconfig.initLayers.split('&&')
        this.treeTitle = layerName
        this.type = type
    },
    methods: {
        initTree () {
            let layers = appconfig.gisResource['iserver_resource'].layerService.layers
            let showlayers = layers.filter(layer => layer.name === this.treeTitle)
            let ids = [], id = 0
            this.layersData = showlayers.map(parentlayer => {
                let parentName = parentlayer.name
                let sublayers = parentlayer.sublayers.map(sublayer => {
                    id++
                    if (sublayer.visible) { ids.push(id) }
                    return { id, label: sublayer.title, name: sublayer.name, parentName }
                })
                id++
                return { id, label: parentlayer.title, name: parentName, children: sublayers }
            })
            this.defaultCheckedKeys = ids
        },
        setLayerVisible (row, check) {
            if (this.type === 'group') {
                this.setLayerGroupVisible(row, check)
            } else {
                this.setSingleVisible(row, check)
            }
        },
        // 图层组
        initTree2 () {
            let layers = appconfig.gisResource['iserver_resource'].layerService.layers
            let layer = layers.find(layer => layer.name === this.treeTitle)
            let ids = [], id = 0
            this.layersData = layer.sublayers.map(layer => {
                let sublayers = layer.sublayers.map(sub => {
                    id++
                    if (sub.visible) { ids.push(id) }
                    return { id, label: sub.title, name: sub.name, parentName: layer.name }
                })
                id++
                return { id, label: layer.title, name: layer.name, children: sublayers }
            })
            this.defaultCheckedKeys = ids
        },
        setSingleVisible (row, check) {
            let visible = check.checkedKeys.includes(row.id)
            let isParent = !row.parentName, parentName, layerName
            if (isParent) { 
                parentName = row.name 
            } else { 
                parentName = row.parentName
                layerName = row.name
            }
            let parentLayer = appconfig.gisResource['iserver_resource'].layerService.layers.find(layer => layer.name === this.treeTitle)
            parentLayer.sublayers.forEach(sublayer => {
                if (isParent) {
                    sublayer.visible = visible
                } else {
                    if(layerName === sublayer.name) { sublayer.visible = visible }
                }
            })
            new mapUtil(this.data.mapView).setSingleLayerVisible()
        },
        // 图层显隐设置
        setLayerGroupVisible (row, check) {
            let visible = check.checkedKeys.includes(row.id)
            let isParent = !row.parentName, parentName, layerName, layersVisible
            if (isParent) { 
                parentName = row.name 
            } else { 
                parentName = row.parentName
                layerName = row.name
            }
            
            // 修改配置项
            let layers = appconfig.gisResource['iserver_resource'].layerService.layers.find(layer => layer.name === this.treeTitle)
            layers.sublayers.forEach(layerGroup => {
                let groupName = layerGroup.name
                let sublayers = layerGroup.sublayers
                sublayers.forEach(layer => {
                    if (isParent) {
                        if (groupName === parentName) { layer.visible = visible }
                    } else {
                        if (groupName === parentName && layerName === layer.name) { layer.visible = visible }
                    }
                })
            })
            new mapUtil(this.data.mapView).setGroupLayerVisible()
        }
    },
    mounted () {
        // TODO 图层服务发布尽量一致
        if (this.type !== 'group') {
            this.initTree()
        } else {
            this.initTree2()
        }
    }
    
}
</script>

<style>

</style>