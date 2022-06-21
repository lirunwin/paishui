import Feature from 'ol/Feature';
import { Polygon, LineString, Point, Circle } from 'ol/geom';
import iQuery from './query';
import { appconfig } from 'staticPub/config'
import { GeoJSON } from 'ol/format';
import { comSymbol } from '@/utils/comSymbol';
import { getFieldByLayerName, getUniqueValueByFiled } from '@/api/sysmap/drain'
import { Style, Fill, Stroke } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import { TileSuperMapRest, SuperMap, LayerInfoService } from '@supermap/iclient-ol'
import { TF_Layer } from './layer';

export class mapUtil {

    static commonStyle = {
        point: {
            size: 4,
            fill: '#fff',
            outerColor: '#409EFF',
            outerWidth: 2
        },
        stroke: {
            width: 5,
            color: '#409EFF',
            dash: [0, 0]
        },
        fill: {
            color: 'rgba(0, 0, 0, 0.3)',
        }
    }

    static commonLightStyle = {
        point: {
            size: 5,
            fill: '#fff',
            outerColor: '#0ff',
            outerWidth: 2
        },
        stroke: {
            width: 6,
            color: 'rgba(0, 255, 255, 0.5)',
            dash: [0, 0]
        },
        fill: {
            color: 'rgba(0, 0, 0, 0.3)',
        }
    }

    map = null

    constructor(map) {
        this.map = map
    }
    addLayers(layers) {
        if (!(layers instanceof Array)) this.map.addLayer(layers)
        layers.forEach(layer => {
            this.map.addLayer(layer)
        })
    }
    removeLayers(layers) {
        if (!(layers instanceof Array)) this.map.removeLayer(layers)
        layers.forEach(layer => {
            this.map.removeLayer(layer)
        })
    }
    // 获取要素范围中心
    getCenter(feature) {
        let center = []
        if (feature instanceof Feature) {
            let [xmin, ymin, xmax, ymax] = feature.getGeometry().getExtent()
            center = [(xmin + xmax) / 2, (ymin + ymax) / 2]
        }
        return center
    }
    static getCenter(feature) {
        let center = []
        if (feature instanceof Feature) {
            let [xmin, ymin, xmax, ymax] = feature.getGeometry().getExtent()
            center = [(xmin + xmax) / 2, (ymin + ymax) / 2]
        }
        return center
    }

    // 设置图层在最上层
    setTop(layer) {
        let layers = this.map.getLayers(), zindexs = []
        layers.forEach(layer => {
            let index = layer.getZIndex()
            if (isNaN(index)) zindexs.push(0)
            else zindexs.push(index)
        })
        layer.setZIndex(Math.max.apply(null, zindexs) + 1)
    }

    // 获取当前地图 extent
    getCurrentViewExtent() {
        let mapDom = this.map.getTargetElement()
        let top = 0, left = 0, right = mapDom.clientWidth + left, bottom = mapDom.clientHeight + top
        let topLeftPoint = this.map.getCoordinateFromPixel([left, top])
        let bottomRightPoint = this.map.getCoordinateFromPixel([right, bottom])
        let [xmin, ymax] = topLeftPoint
        let [xmax, ymin] = bottomRightPoint
        // let coors = [[ [xmin, ymax], [xmax, ymax], [xmax, ymin], [xmin, ymin], [xmin, ymax], ]]
        // let feature = new Feature({ geometry: new Polygon(coors) })
        return [xmin, ymin, xmax, ymax]

        function getOffsetTop(el) {
            return el.offsetParent ? el.offsetTop + getOffsetTop(el.offsetParent) : el.offsetTop
        }
        function getOffsetLeft(el) {
            return el.offsetParent ? el.offsetLeft + getOffsetLeft(el.offsetParent) : el.offsetLeft
        }
    }

    // 多个要素点获取中心点
    getCenterFromFeatures(features) {
        if (!Array.isArray(features)) {
            features = [features]
        }
        let pointsArr = features.map(fea => this.getCenter(fea))
        let xmin, xmax, ymin, ymax
        pointsArr.forEach(point => {
            let [x, y] = point
            xmin = xmin ? Math.min.call(null, x, xmin) : x
            xmax = xmax ? Math.max.call(null, x, xmax) : x
            ymin = ymin ? Math.min.call(null, y, ymin) : y
            ymax = ymax ? Math.max.call(null, y, ymax) : y
        })
        return [(xmin + xmax) / 2, (ymin + ymax) / 2]

        // 把多维坐标转化为一维
        function format(arr) {
        }
    }

    static getCenterFromFeatures (features) {
        let pointsArr = features.map(fea => this.getCenter(fea))
        let xmin, xmax, ymin, ymax
        pointsArr.forEach(point => {
            let [x, y] = point
            xmin = xmin ? Math.min.call(null, x, xmin) : x
            xmax = xmax ? Math.max.call(null, x, xmax) : x
            ymin = ymin ? Math.min.call(null, y, ymin) : y
            ymax = ymax ? Math.max.call(null, y, ymax) : y
        })
        return [(xmin + xmax) / 2, (ymin + ymax) / 2]
    }

    // 当前范围内空间查询
    queryForExtent(extent, layer) {
        let [xmin, ymin, xmax, ymax] = extent
        let coors = [[[xmin, ymax], [xmax, ymax], [xmax, ymin], [xmin, ymin], [xmin, ymax],]]
        let feature = new Feature({ geometry: new Polygon(coors) })
        let dataSetInfo = [{ name: "TF_PSPS_PIPE_B", label: "排水管" }]
        new iQuery({ dataSetInfo }).spaceQuery(feature).then(resArr => {
            let resFeaturesObj = resArr.filter((res: any) => res && res.result.featureCount !== 0)
            let features = []
            if (resFeaturesObj.length !== 0) {
                resFeaturesObj.forEach((obj: any) => {
                    let feas = new GeoJSON().readFeatures(obj.result.features)
                    features = [...features, ...feas]
                })
                let colorBox = ["#f00", "#ff0", "#008000", "#00f", "#000"]
                features = features.map((fea, index) => {
                    // 随机给一个颜色
                    let color = colorBox[index % 5], style
                    if (fea.getGeometry() instanceof LineString) {
                        style = comSymbol.getLineStyle(5, color)
                    } else if (fea.getGeometry() instanceof Point) {
                        style = comSymbol.getPointStyle(3, color)
                    }
                    fea.setStyle(style)
                    return fea
                })
                layer.getSource().clear()
                layer.getSource().addFeatures(features)
                let data = features.map(fea => fea.values_)
            }
        })
    }

    // 获取字段
    static getFields(layerName) {
        return new Promise(resolve => {
            getFieldByLayerName({ dataSetName: layerName }).then(res => {
                if (res.code === 1) {
                    let data = res.result
                    resolve(format(data))
                } else resolve(null)
            })
        })
        function format(data) {
            return data.filter(item => (item.smfieldcaption && item.smfieldcaption !== item.smfieldname)).map(item => {
                let name = item.smfieldcaption.trim()
                return { field: item.smfieldname, name }
            })
        }
    }

    // 获取字段唯一值
    static getUniqueValue(layerName, field) {
        return new Promise(resolve => {
            getUniqueValueByFiled({ dataSetName: layerName, fieldName: field }).then(res => {
                if (res && res.code === 1) {
                    resolve(res.result)
                } else resolve(null)
            })
        })
    }

    // 
    static getAllSubLayerNames(parentLayerName, type) {
        let layers = appconfig.gisResource['iserver_resource'].layerService.layers
        let showlayers = layers.filter(layer => layer.type === type)
        let filterLayer = showlayers.find(layer => layer.name = parentLayerName)
        return filterLayer
    }

    /**
      * 获取公共样式
      * @param light 是否高亮
      */
    static getCommonStyle(light = false) {
        let { point, stroke, fill } = light ? mapUtil.commonLightStyle : mapUtil.commonStyle
        return new Style({
            fill: new Fill({
                color: fill.color
            }),
            stroke: new Stroke({
                lineDash: stroke.dash,
                color: stroke.color,
                width: stroke.width
            }),
            image: new CircleStyle({
                radius: point.size,
                stroke: new Stroke({
                    color: point.outerColor,
                    width: point.outerWidth
                }),
                fill: new Fill({
                    color: point.fill
                })
            })
        })
    }

    // 设置中心点， 地图级别
    setZoomAndCenter(zoom, center) {
        let view = this.map.getView()
        view.setZoom(zoom)
        view.setCenter(center)
    }

    
    /**
      * 超图图层组子图层显隐, 只适合图层组, 会修改 config 公共配置
      * @param layersConfig 图层配置
      */
    setGroupLayerVisible(layersConfig?) {
        let layers =  layersConfig || appconfig.gisResource['iserver_resource'].layerService.layers
        let parentLayer = layers.find(layer => layer.type === 'smlayergroup')
        let ids = [], idsStr = ''
        let url = parentLayer.url
        parentLayer.sublayers.forEach(group => {
            group.sublayers.forEach(sub => {
                // if (parentName && group.name === parentName && layersVisble.some(layer => layer.name === sub.name)) {
                //     sub.visible = layersVisble.find(layer => layer.name === sub.name).visible
                // }
                if (sub.visible) { ids.push(sub.id) }
            })
        })
        let findLayer = this.map.getLayers().getArray().find(layer => layer.get('type') === 'smlayergroup')
        if (ids.length === 0) {
            idsStr = '[]'
            findLayer.setVisible(false)
        } else { 
            idsStr = `[0:${ids.join(",")}]`
            let source = new TileSuperMapRest({ url, layersID: idsStr, cacheEnabled: false, crossOrigin: 'anonymous', wrapX: true })
            findLayer.setSource(source)
            findLayer.setVisible(true)
        }
    }
    /**
      * 大屏超图图层组子图层显隐, 只适合图层组, 会修改 config 公共配置
      * @param layersConfig 图层配置
      */
     setBigScreenGroupLayerVisible(layersConfig?) {
        let layers =  layersConfig || appconfig.bigScreenMapService['layerService'].layers
        let parentLayer = layers.find(layer => layer.type === 'bigScreenPipeMap')
        let ids = [], idsStr = ''
        let url = parentLayer.url
        parentLayer.sublayers.forEach(group => {
            group.sublayers.forEach(sub => {
                if (sub.visible) { ids.push(sub.id) }
            })
        })
        let findLayer = this.map.getLayers().getArray().find(layer => layer.get('type') === 'bigScreenPipeMap')
        if (ids.length === 0) {
            idsStr = '[]'
            findLayer.setVisible(false)
        } else { 
            idsStr = `[0:${ids.join(",")}]`
            let source = new TileSuperMapRest({ url, layersID: idsStr, cacheEnabled: false, crossOrigin: 'anonymous', wrapX: true })
            findLayer.setSource(source)
            findLayer.setVisible(true)
        }
    }
    // 设置获取图层组显隐 source
    getChangeResource (layers,layerName, visible) {
        layers.forEach(group => {
            // if(group.type!=='smlayergroup') return
            group.sublayers.forEach(sub => {
                sub.sublayers.forEach(child=>{
                    if (child.name === layerName) { child.visible = visible }
                })
            })
        })
        return layers
    }
    deepClone(obj) {
        let clone
        if (obj instanceof Array) {
          clone = [...obj]
          clone.forEach((item, i) => {
            if (item instanceof Array || item instanceof Object) {
              clone[i] = this.deepClone(item)
            } else {
              clone[i] = item
            }
          })
        } else if (obj instanceof Object) {
          clone = { ...obj }
          for (let i in obj) {
            if (obj[i] instanceof Object || obj[i] instanceof Array) {
              clone[i] = this.deepClone(obj[i])
            } else {
              clone[i] = obj[i]
            }
          }
        }
        return clone
    }
    setSingleLayerVisible() {
        let layers =  appconfig.gisResource['iserver_resource'].layerService.layers
        let parentLayer = layers.find(layer => layer.type === 'smlayer')
        new TF_Layer().createLayers([parentLayer]).then(layers => {
            let layerInMap = this.map.getLayers().getArray().find(layer => layer.get('name') === parentLayer.name)
            this.map.removeLayer(layerInMap)
            this.map.addLayer(layers[0])
        })
    }
}