<template>
  
</template>

<script>
import Overlay from 'ol/Overlay';
import { unByKey } from 'ol/Observable';
import { Logo, TileSuperMapRest, SuperMap, FeatureService } from '@supermap/iclient-ol';
import * as turf from '@turf/turf';
import GeoJSON from 'ol/format/GeoJSON';
import { appconfig } from "staticPub/config";

import { Vector as VectorSource } from 'ol/source';
import { Image as ImageLayer, Vector as VectorLayer, Tile as TileLayer } from 'ol/layer';
import { Polygon, Point, LineString, MultiLineString, Geometry } from 'ol/geom';
import { Style, Stroke, Fill, Circle } from 'ol/style';
import Feature from 'ol/Feature';

export default {
    props: {
        map: null,
        rootPage: null
    },
    data () {
        return {
            pointermoveEvent: null,
            searchEvent: null,
            tipOverlay: null,
            popupWindow: null,
            lightLayer: null
        }
    },
    methods: {
        attrSearchEvent () {
            this.tipDiv = document.createElement('div');
            this.tipDiv.innerHTML = "点击查询设施";
            this.tipDiv.className = "tipDiv";
            this.tipDiv.style = "width:auto;height:auto;padding:4px;border:1px solid #fc5531;font-size:12px;background-color:#fff;position:relative;top:60%;left:60%;font-weight:600;"
            let overlay = this.createMapTip(this.tipDiv, 'tipLay');
            this.tipOverlay = overlay
            this.pointermoveEvent = this.map.on("pointermove", evt => {
                overlay.setPosition(evt.coordinate);
            })

            this.searchEvent = this.map.on("click", evt => {
                this.spaceQuery(evt.coordinate)
            })
        },
        createMapTip(element, id){
            let overlay = new Overlay({
                element: element,
                autoPan: false,
                positioning: "bottom-center",
                id: id,
                stopEvent: false //停止事件传播到地图
            });
            this.map.addOverlay(overlay)
            return overlay;
        },
        /**
         * 空间查询
         */
        async spaceQuery (position) {
            const bufferDis = 3e-3
            let queryFeature = turf.buffer(turf.point(position), bufferDis, { units: 'kilometers' })
            let dataServerConfig = appconfig.gisResource.iserver_resource.dataServer
            let queryData = await this.smGetFeatureService(queryFeature, dataServerConfig) 
            let showData = []
            for (let data of queryData) {
                let features = data.result.features.features
                if (features.length !== 0) {
                    showData.push(features)
                }
            }
            
            if(showData.length !== 0) {
                let feature = showData[0][0]
                this.openPopup(position, feature)
                this.lightGeometry(feature)
                // 重置事件
                this.tipOverlay.setPosition(null)
                unByKey(this.pointermoveEvent)
                unByKey(this.searchEvent)
            }
            // queryData.result.features.features
        },
        /**
         * 超图数据服务
         */
        async smGetFeatureService (queryFeature, { dataServiceUrl, dataSets, dataSource, dataSetInfo }) {
            let result = []
            return Promise.all(dataSetInfo.map(info => {
                return new Promise(resolve => {
                    let params = new SuperMap.GetFeaturesByGeometryParameters({
                        toIndex: -1,
                        maxFeatures: 10,
                        datasetNames: [dataSource + ':' + info.name],
                        geometry: new GeoJSON().readFeature(queryFeature).getGeometry(),
                        spatialQueryMode: "INTERSECT" // 相交空间查询模式
                    })
                    new FeatureService(dataServiceUrl).getFeaturesByGeometry(params, result => {
                        if (result.type == "processFailed") resolve(null);
                        else resolve(result);
                    })
                })
            }))
        },
        /**
         * 打开弹框
         */
        openPopup (position, feature) {
            this.rootPage.$refs.popupWindow.showPopup(position, feature, this.afterClosePopup)
        },
        /**
         * 关闭弹框后
         */
        afterClosePopup () {
            this.map.removeLayer(this.lightLayer)
            this.attrSearchEvent()
        },
        /**
         * 高亮点击的设施
         */
        lightGeometry (feature) {
            let vectorLayer = new VectorLayer({
                source: new VectorSource(),
                style: new Style({
                    fill: new Fill({
                        color: "#fff"
                    }),
                    stroke: new Stroke({
                        color: "#7BDCFE",
                        width: 5
                    }),
                    image: new Circle({
                        radius: 7,
                        stroke: new Stroke({
                        width: 2,
                        color: "#f40"
                    }),
                    fill: new Fill({
                        color: '#00ffff'
                    })
                    })
                })
            })
            let ifeature = new Feature({
                geometry: new GeoJSON().readGeometry(feature.geometry)
            })
            if (ifeature) {
                vectorLayer.getSource().addFeature(ifeature)
                this.lightLayer = vectorLayer
                this.map.addLayer(vectorLayer)
            }
        },
        formatFeature (feature) {
            let { type, coordinates } = feature.geometry, geo;
            if (!(type && coordinates)) return null
            switch(type) {
                case "Point": geo = new Point(coordinates)
                    break
                case "LineString": geo = new LineString(coordinates)
                    break
                case "Polygon": geo = new Polygon(coordinates)
                    break
                default: return null
            }
            return new Feature({ geometry: geo })
        },
        closeAll () {
            this.tipOverlay && this.tipOverlay.setPosition(null)
            this.pointermoveEvent && unByKey(this.pointermoveEvent)
            this.searchEvent && unByKey(this.searchEvent)
            this.rootPage.$refs.popupWindow.popup.setPosition(null)
        }
    },
    mounted () {
        if (this.$parent.$data.activeTools.includes("attrSearch")) {
            this.attrSearchEvent()
        } else {
            this.closeAll()
        }
    },
    destroyed () {
        this.closeAll()
    }

}
</script>

<style>

</style>