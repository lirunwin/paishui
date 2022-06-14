<template>
    <div class="mapView" :id="mapTarget"></div>
</template>

<script>
import Map from 'ol/Map'
import View from 'ol/View'
import { appconfig } from 'staticPub/config'
import { TF_Layer } from '@/views/zhpt/common/mapUtil/layer'
export default {
    name:"mapView",//地图
    data(){
        return{
            mapTarget:'bigScreenBaseMap',
        }
    },
    mounted(){
        this.$nextTick(()=>{
            this.initMap()
        })
    },
    methods:{
        //初始化地图对象
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
            this.addLayers();
        },
        //图层添加
        addLayers(){
            let layersSource = appconfig.gisResource['iserver_resource'].layerService.layers
            console.log("图层源",layersSource)
            new TF_Layer().createLayers(layersSource).then(layers => {
                // console.log(layers)
                layers.forEach(layer => {
                    layer && this.view.addLayer(layer)
                })
                // console.log(this.view.getLayers())
                this.$parent.view=this.view
            })
        },
    }
}
</script>

<style lang="scss" scoped>
    .mapView{
        height: 100%;
        width: 100%;
        /deep/ .ol-layer{
            filter: invert(100%) hue-rotate(180deg);//实现天地图从白色变成暗黑模式的地图服务
            -webkit-filter: invert(100%) hue-rotate(180deg);
        }
        /**地图控件隐藏 */
        /deep/ .ol-zoom {
            display: none !important;
        }
        /deep/ .ol-attribution {
            display: none !important;
        }
    }
</style>