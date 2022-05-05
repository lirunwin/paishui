import Feature from 'ol/Feature';
import { Polygon, LineString, Point } from 'ol/geom';
import iQuery from './query';
import { appconfig } from 'staticPub/config'
import { GeoJSON } from 'ol/format';
import { comSymbol } from '@/utils/comSymbol';

export class mapUtil {

    private projection = 'EPSG:4326'

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
}