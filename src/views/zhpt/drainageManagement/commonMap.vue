<template>
    <div class="mapView" :id="mapTarget"></div>
</template>

<script>
import Map from 'ol/Map'
import View from 'ol/View'
import { appconfig } from 'staticPub/config'
import { TF_Layer } from '@/views/zhpt/common/mapUtil/layer'
export default {
    name:'commonMap',
    props:{
        mapname:{}
    },
    data(){
        return{
            view:null,
            mapTarget:null,
        }
    },
    mounted(){
        this.mapTarget=this.mapname
        this.$nextTick(()=>{
            this.initMap()
        })
    },
    methods:{
        initMap(){
            let { initCenter, initZoom } = appconfig
            this.view = new Map({
                target: this.mapTarget,
                view: new View({
                    center: initCenter,
                    zoom: initZoom,
                    maxZoom: 20,
                    minZoom: 9,
                    projection: 'EPSG:4326'
                })
            })
            this.$parent.view=this.view
            this.addLayers();
        },
        addLayers(){
            let layerResource = appconfig.gisResource['iserver_resource'].layerService.layers
            new TF_Layer().createLayers(layerResource).then(layers => {
                layers.forEach(layer => {
                    layer && this.view.addLayer(layer)
                })
            })
        },
    }
}
</script>

<style lang='scss' scoped>
    .mapView{
        height: 100%;
        width: 100%;
        // float: left;
        /deep/ .ol-zoom {
        display: none !important;
        }
        /deep/ .ol-attribution {
            display: none !important;
        }
    }
</style>