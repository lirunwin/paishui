<template>
    <div class="widget-bigScreenBaseMap">
        <div class="mapView" :id="mapTarget"></div>
    </div>
</template>

<script>
import Map from 'ol/Map'
import View from 'ol/View'
import { appconfig } from 'staticPub/config'
import { TF_Layer } from '@/views/zhpt/common/mapUtil/layer'
export default {
    name:'bigScreenBaseMap',//大屏背景地图
    data(){
        return{
            view:null,
            mapTarget:'bigScreenBaseMap',
        }
    },
    mounted(){
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
            let layersSource = appconfig.gisResource['iserver_resource'].layerService.layers
            new TF_Layer().createLayers(layersSource).then(layers => {
                layers.forEach(layer => {
                    layer && this.view.addLayer(layer)
                })
            })
        },
    }
}
</script>

<style lang='scss' scoped>
.widget-bigScreenBaseMap{
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    position: absolute;
    top: 0;
    left: 0;
    // background: #000;
    filter: invert(100%) hue-rotate(180deg);//实现天地图从白色变成暗黑模式的地图服务
    -webkit-filter: invert(100%) hue-rotate(180deg);
    .mapView{
        height: 100%;
        width: 100%;
        /**地图控件隐藏 */
        /deep/ .ol-zoom {
            display: none !important;
        }
        /deep/ .ol-attribution {
            display: none !important;
        }
    }
}
</style>