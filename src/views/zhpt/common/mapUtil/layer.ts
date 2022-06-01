import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector';
import { Vector as VectorSource, XYZ } from 'ol/source';
import { WMTS } from 'ol/source'
import * as olExtent from 'ol/extent'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import * as olProj from 'ol/proj'
import { TileSuperMapRest, SuperMap, LayerInfoService } from '@supermap/iclient-ol'

import { appconfig } from 'staticPub/config';

export class TF_Layer {

    projection = 'EPSG:4326'

    hasKey = false

    constructor(hasKey = false) {
        this.hasKey = hasKey
    }

    createLayer({ properties = {}, type, visible = true, url }) {
        let layer = null
        // 加入 key
        switch (type) {
            case "smlayer": layer = this.SM_Layer_old(url)
                break
            case "tdtlayer": layer = this.TDT_Layer(url)
                break
            case "vector": layer = this.VT_Layer()
                break
            case "wmtslayer": layer = this.WMTS_Layer(url)
                break
            default:
                break
        }
        // 加入属性
        if (layer) {
            for (let i in properties) {
                layer.set(i, properties[i])
            }
            layer.setVisible(visible)
        }
        return layer
    }
    // 创建多个图层
    // 超图图层异步加载
    createLayers(layerSources) {
        let promises = layerSources.map(layersource => {
            let { name, parentname, id, type, visible, sublayers, url } = layersource
            let properties = { id, name, parentname }
            let layer = null
            switch (type) {
                case "smlayer": layer = this.SM_Layer(url, sublayers, visible, properties)
                    break
                case "tdtlayer": layer = this.TDT_Layer(url)
                    break
                case "vector": layer = this.VT_Layer()
                    break
                case "wmtslayer": layer = this.WMTS_Layer(url)
                    break
                default:
                    break
            }
            // 加入属性
            if (["tdtlayer", "vector", "wmtslayer"].includes(type)) {
                for (let i in properties) {
                    layer.set(i, properties[i])
                }
                layer.setVisible(visible)
            }
            return layer
        })
        return Promise.all(promises)
    }
    // 超图切片图层
    // 设置临时图层
    SM_Layer(url = "", sublayers, visible = true, properties = {}) {
        if (!url) return null
        let layerinfo = new LayerInfoService(url)
        return new Promise(resolve => {
            layerinfo.getLayersInfo(res => {
                if (res.type !== "processFailed") {
                    let resSublayers = res.result.subLayers.layers
                    const newLayers = resSublayers.map(item => {
                        let findlayerObj = sublayers.find(sublayer => `${sublayer.name}@tofly` === item.name)
                        return new SuperMap.LayerStatus({ "layerName": item.name, "isVisible": !!findlayerObj && findlayerObj.visible });
                    })
                    // 更新后的图层信息
                    const statusparam = new SuperMap.SetLayerStatusParameters({ layerStatusList: newLayers });
                    layerinfo.setLayerStatus(statusparam, newRes => {
                        let layersID = newRes.result.newResourceID
                        let source = new TileSuperMapRest({ url, layersID, cacheEnabled: false, crossOrigin: 'anonymous', wrapX: true })
                        let layer = new TileLayer({ source, properties: { projection: this.projection } })
                        for (let i in properties) {
                            layer.set(i, properties[i])
                        }
                        layer.setVisible(visible)
                        resolve(layer)
                    })
                } else resolve(null)
            })
        })
        // appconfig.gisResource['iserver_resource'].layerService.layers
    }
    SM_Layer_old(url = '') {
        if (!url) return null
        let source = new TileSuperMapRest({ url, cacheEnabled: false, crossOrigin: 'anonymous', wrapX: true })
        return new TileLayer({ source, properties: { projection: this.projection } })
    }


    // 天地图 瓦片
    TDT_Layer(url = "") {
        if (!url) return null
        if (!this.hasKey) { url += appconfig.tianMapKey };
        return new TileLayer({
            source: new XYZ({
                crossOrigin: 'anonymous',
                url: url,
                wrapX: true
            }),
        })
    }
    // 矢量图层
    VT_Layer() {
        return new VectorLayer({ source: new VectorSource() })
    }
    // 天地图 WMTS 
    WMTS_Layer(url) {
        let projection = olProj.get(this.projection)
        let extent = projection.getExtent()
        let width = olExtent.getWidth(extent)

        let resolutions = [], matrixIds = []
        for (let z = 1; z < 19; z++) {
            resolutions[z] = width / (256 * Math.pow(2, z))
            matrixIds[z] = z
        }
        let tileGrid = new WMTSTileGrid({
            origin: olExtent.getTopLeft(extent),
            resolutions,
            matrixIds
        })

        // 匹配坐标系、图层类型
        let type = url.match(new RegExp(/\/(.{3})_(c|w)\//))
        if (!this.hasKey) { url += appconfig.tianMapKey };
        return new TileLayer({
            source: new WMTS({
                crossOrigin: "anonymous",
                url: url,
                layer: type[1],
                matrixSet: type[2],
                format: 'tiles',
                style: 'default',
                wrapX: true,
                projection: projection,
                tileGrid
            })
        })
    }
} 