<template>
    <div class="drainageHouseholdMap" id="drainageHouseholdMap">
    </div>
</template>

<script>
import Map from 'ol/Map'
import View from 'ol/View'
import { appconfig } from 'staticPub/config'
import { TF_Layer } from '@/views/zhpt/common/mapUtil/layer'
export default {
    name:"drainageHouseholdMap",//
    data(){
        return{
            view:null,
        }
    },
    mounted(){
        this.initMap();
    },
    methods:{
        initMap(){
            let { initCenter, initZoom } = appconfig
            this.view = new Map({
                target: 'drainageHouseholdMap',
                view: new View({
                    center: initCenter,
                    zoom: initZoom,
                    maxZoom: 20,
                    minZoom: 9,
                    projection: 'EPSG:4326'
                })
            })
            this.addLayers();
        },
        addLayers(){
            let layerResource = appconfig.gisResource['iserver_resource'].layerService.layers
            layerResource.forEach((layerConfig) => {
                let { name, type, url, parentname, id, visible = true } = layerConfig
                let layer = new TF_Layer().createLayer({ url, type, visible, properties: { id, name, parentname } })
                this.view.addLayer(layer)
            })
        },
    }
}
</script>

<style lang="scss" scoped>
    .drainageHouseholdMap{
        height: 100%;
        width: 50%;
        // /deep/ .ol-zoom {
        // display: none !important;
        // }
        /deep/ .ol-attribution {
            display: none !important;
        }
    }
</style>