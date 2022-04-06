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
                let layers = mapView.getLayers()
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
            console.log(check)
            let layer = row.layer
            layer.values_.visible = !layer.values_.visible
            if (row.label.includes("底图")) {
                
            }
            this.data.mapView.render()
        }
    },
    mounted () {
        this.initTree()
    }
    
}
</script>

<style>

</style>