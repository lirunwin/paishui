<template>
  <div ref="mainMap" class="map-container" :style="mapSize"></div>
</template>

<script>
import { appconfig } from "staticPub/config";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { TF_Layer } from '@/views/zhpt/common/mapUtil/layer'
import { defaults as controls } from 'ol/control'

export default {
    name: "simpleMap",
    props: {
        mapWidth: {
            default: 100,
            type: Number
        },
        mapHeight: {
            default: 100,
            type: Number
        }
    },

    data () {
        return {
            map: null,
        }
    },
    methods: {
        initMap() {
            let { initCenter, initZoom } = appconfig
            let layerResource = appconfig.gisResource['iserver_resource'].layerService.layers
            let map = new Map({
                target: this.$refs.mainMap,
                controls: controls({
                    zoom: false
                }),
                view: new View({
                    center: initCenter,
                    zoom: initZoom,
                    maxZoom: 20,
                    minZoom: 5,
                    projection: 'EPSG:4326'
                })
            })
            this.map = map

            layerResource.forEach(layerConfig => {
                let { name, type, url, parentname, id, visible = true } = layerConfig
                let layer = new TF_Layer().createLayer({ url, type, visible, properties: { id, name, parentname } })
                this.map.addLayer(layer)
            })
            this.$emit('afterMapLoad')
        },
        // 加入缺陷数据
        addData () {
            
        },
    },

    created () {},

    mounted () {
        this.initMap()
    },

    destroyed () {},

    computed: {
        mapSize () {
            return { height: `${this.mapHeight}%`, width: `${this.mapWidth}%` }
        }
    }
}
</script>

<style lang='scss' scoped>
    .map-container {
        display: relative;
    }
</style>