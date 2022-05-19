<template>
  <div ref="mainMap" class="map-container" :style="mapSize"></div>
</template>

<script>
import { appconfig } from "staticPub/config";
import "ol/ol.css";
import { Map as olMap } from "ol";
import View from "ol/View";
import { TF_Layer } from '@/views/zhpt/common/mapUtil/layer'

import { defaults as controls } from 'ol/control'
import { defaults as interactions } from 'ol/interaction'
import { mapUtil } from '@/views/zhpt/common/mapUtil/common'
import iDraw from '@/views/zhpt/common/mapUtil/draw';
import { projUtil } from '@/views/zhpt/common/mapUtil/proj';

import { Feature } from 'ol'
import { LineString, Point, Polygon } from 'ol/geom'
import * as turf from '@turf/turf'
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { comSymbol } from '@/utils/comSymbol';
import { Style } from 'ol/style'
import Icon from 'ol/style/Icon'
import defectImg1 from '@/assets/images/traingle1.png'
import defectImg2 from '@/assets/images/traingle2.png'
import defectImg3 from '@/assets/images/traingle3.png'
import defectImg4 from '@/assets/images/traingle4.png'
import defectImg0 from '@/assets/images/traingle0.png'
import { unByKey } from 'ol/Observable';

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
            projUtil: null, // 坐标系工具
            currentDataProjName: 'proj43', // 当前坐标系
            vectorLayer: null,
            moveEvent: null
        }
    },
    methods: {
        initMap() {
            let { initCenter, initZoom } = appconfig
            let layerResource = appconfig.gisResource['iserver_resource'].layerService.layers
            let map = new olMap({
                target: this.$refs.mainMap,
                controls: controls({
                    zoom: false,
                    attribution: false
                }),
                interactions: interactions({
                    doubleClickZoom: false
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
            this.vectorLayer = new VectorLayer({ source: new VectorSource() })
            this.map.addLayer(this.vectorLayer)

            let moveEvent = this.map.on('moveend', args => {
                let [xmin, ymin, xmax, ymax] = new mapUtil(this.map).getCurrentViewExtent()
                let coors = [[[xmin, ymax], [xmax, ymax], [xmax, ymin], [xmin, ymin], [xmin, ymax],]]
                this.$emit('mapMoveEvent', new Feature({ geometry: new Polygon(coors) }))
            })
        },
        // 加入缺陷数据
        getFeatures (data, type) {
            let features = []
            data.forEach(item => {
                let coors = item.geometry.geometry.coordinates
                if (type === 1) {
                    let feature = new Feature({ geometry: new Point(coors)})
                    let imgs = [
                        { level: '一级', img: defectImg1, index: 0 },
                        { level: '二级', img: defectImg2, index: 1 },
                        { level: '三级', img: defectImg3, index: 2 },
                        { level: '四级', img: defectImg4, index: 3 },
                        { level: '/', img: defectImg0, index: 4 },
                    ]
                    let findimg = null

                    if (item.defectLevel) {
                        findimg = imgs.find((colorObj) => item['defectLevel'].includes(colorObj.level))
                    }
                    // 缺少 defectLevel 字段
                    if (findimg) {
                        feature.setStyle(new Style({ image: new Icon({ size: [48, 48], src: findimg.img, scale: 0.3 }) }))
                        for (let i in item) {
                            i !== 'geometry' && feature.set(i, item[i])
                        }
                        features.push(feature)
                    }
                } else {
                    let feature = new Feature({ geometry: new LineString(coors) })
                    // 健康等级颜色
                    let colors = [
                        { level: 'Ⅰ', color: 'green', index: 0 },
                        { level: 'Ⅱ', color: 'blue', index: 1 },
                        { level: 'Ⅲ', color: 'pink', index: 2 },
                        { level: 'Ⅳ', color: 'red', index: 3 }
                    ]
                    let findColor = null
                    if (item['funcClass']) {
                        findColor = colors.find((colorObj) => item['funcClass'].includes(colorObj.level))
                    }

                    if (findColor) {
                        feature.setStyle(comSymbol.getLineStyle(5, findColor.color))
                        for (let i in item) {
                            i !== 'geometry' && feature.set(i, item[i])
                        }
                        features.push(feature)
                    }
                }
            })
            return features
        },
        draw ({ type = 'polygon', callback }) {
            let drawer = new iDraw(this.map, type, {
                endDrawCallBack: feature => {
                    drawer.remove()
                    callback && callback(feature)
                }
            })
            drawer.start()
        },
        getDataInMap (data, extent) {
            let that = this
            // 无范围 默认全图
            if (!extent) {
                let [xmin, ymin, xmax, ymax] = new mapUtil(this.map).getCurrentViewExtent()
                let coors = [[[xmin, ymax], [xmax, ymax], [xmax, ymin], [xmin, ymin], [xmin, ymax],]]
                extent = new Feature({ geometry: new Polygon(coors) })
            }
            let filterExtent = turf.polygon(extent.getGeometry().getCoordinates())

            let resData = new Map()
            data.forEach(pipeData => {
                let len = pipeData.pipeLength
                let defectData = pipeData.pipeDefects
                defectData.forEach(defect => {
                    if (!resData.has(defect.checkSuggest)) {
                        resData.set(defect.checkSuggest, { num: 1, len })
                    } else {
                        let data = resData.get(defect.checkSuggest)
                        data.num += 1
                        data.len += len
                    }
                })
            })
            console.log(1111)
            let obj = {}
            resData.forEach((value, key) => {
                obj[key] = value
            })
            return obj
        },
        // 
        getDataInMap_old (data, extent) {
            let that = this
            // 无范围 默认全图
            if (!extent) {
                let [xmin, ymin, xmax, ymax] = new mapUtil(this.map).getCurrentViewExtent()
                let coors = [[[xmin, ymax], [xmax, ymax], [xmax, ymin], [xmin, ymin], [xmin, ymax],]]
                extent = new Feature({ geometry: new Polygon(coors) })
            }
            let filterExtent = turf.polygon(extent.getGeometry().getCoordinates())
            let dFeas = data.map(pipeData => pipeData.pipeDefects).flat()
            let pFeas = data
            // 范围过滤
            let defectData = filter(dFeas, 1)
            let pipeData = filter(pFeas, 2)
            // 添加要素
            this.vectorLayer.getSource().clear()
            this.vectorLayer.getSource().addFeatures([...this.getFeatures(pipeData, 2), ...this.getFeatures(defectData, 1)])
            
            return { pipeData, defectData }

            function filter(features, type) {
                let feas = []
                feas = features.map(feaObj => {
                    let fea = {}
                    if (type === 1) {
                        let coors = JSON.parse(feaObj.geometry)
                        if (!coors) {
                            return null
                        }
                        fea.geometry = turf.point(that.projUtil.transform([coors.x, coors.y], that.currentDataProjName, 'proj84'))
                        for (let key in feaObj) {
                            if (key !== 'geometry') {
                                fea[key] = feaObj[key]
                            }
                        }
                    } else {
                        let { startPointXLocation, startPointYLocation, endPointXLocation, endPointYLocation } = feaObj
                        if (!(startPointXLocation && startPointYLocation && endPointXLocation && endPointYLocation)) {
                            return null
                        }
                        let startPoint = [Number(startPointXLocation), Number(startPointYLocation)]
                        let endPoint = [Number(endPointXLocation), Number(endPointYLocation)]
                        startPoint = that.projUtil.transform(startPoint, that.currentDataProjName, 'proj84')
                        endPoint = that.projUtil.transform(endPoint, that.currentDataProjName, 'proj84')
                        fea.geometry = turf.lineString([startPoint, endPoint])
                        for (let key in feaObj) {
                            if (key !== 'geometry') {
                                fea[key] = feaObj[key]
                            }
                        }
                    }
                    return fea
                })
                return feas.filter(fea => fea && turf.booleanContains(filterExtent, fea.geometry))
            }
        }
    },

    created () {},

    mounted () {
        this.projUtil = new projUtil()
        this.projUtil.resgis(this.currentDataProjName)
        this.initMap()
    },

    destroyed () {
        this.moveEvent && unByKey(this.moveEvent)
    },

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