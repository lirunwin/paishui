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

export default {
    props: {
        data: null,
    },
    data () {
        return {
            layersData: [],
            defaultCheckedKeys: []
        }
    },
    methods: {
        initTree () {
            if (this.data) {
                let { that, mapView } = this.data
                // 过滤掉 Vector
                let layers = mapView.getLayers().array_.filter(layer => {
                    return !(layer instanceof Vector)
                })
                let layerGroup = new Map()
                layers.forEach(layer => {
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
                        id:  parentid++,
                        label: parentname,
                        children: sublayers.map(sublayer => {
                            let { id, name, layer } = sublayer
                            sublayer.visible && defaultCheckedKeys.push(id)
                            return { label: name, id, layer }
                        })
                    })
                })
                this.layersData = layersData
                this.defaultCheckedKeys = defaultCheckedKeys
            } else {
                console.log("获取图层出错")
            }
        },
        setLayerVisible (row, check) {
            let layer = row.layer
            layer.values_.visible = !layer.values_.visible
            if (layer.values_.visible) this.setTop(layer)
            this.data.mapView.render()
        },
        setTop(layer) {
            let layers = this.data.mapView.getLayers(), zindexs = []
            layers.forEach(layer => {
                let index = layer.getZIndex()
                if (isNaN(index)) zindexs.push(0)
                else zindexs.push(index)
            })
            layer.setZIndex(Math.max.apply(null, zindexs) + 1)
        }
    },
    mounted () {
        this.initTree()
    }
    
}
</script>

<style>

</style>