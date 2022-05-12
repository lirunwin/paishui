import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector';
import { Vector as VectorSource, XYZ } from 'ol/source';
import { TileSuperMapRest } from '@supermap/iclient-ol'
import { WMTS } from 'ol/source'
import * as olExtent from 'ol/extent'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import * as olProj from 'ol/proj'

import { appconfig } from 'staticPub/config';

export class TF_Layer {

    projection = 'EPSG:4326'

    constructor(projection = 'EPSG:4326') {
        this.projection = projection
    }

    createLayer({ properties = {}, type, visible = true, url }) {
        let layer = null
        switch (type) {
            case "smlayer": layer = this.SM_Layer(url)
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
        }
        layer.setVisible(visible)
        return layer
    }
    // 超图切片图层
    SM_Layer(url = "") {
        if (!url) return null
        return new TileLayer({
            source: new TileSuperMapRest({
                url,
                crossOrigin: 'anonymous', // 是否请求跨域操作
                wrapX: true
            }),
            properties: {
                projection: this.projection
            }
        })
    }
    // 天地图
    TDT_Layer(url = "") {
        if (!url) return null
        return new TileLayer({
            source: new XYZ({
                crossOrigin: 'anonymous',
                url: url + appconfig.tianMapKey,
                wrapX: true
            }),
        })
    }
    // 矢量图层
    VT_Layer() {
        return new VectorLayer({ source: new VectorSource() })
    }
    // 天地图 WMTS 图层
    WMTS_Layer(url) {
        let projection = olProj.get(this.projection)
        let extent = projection.getExtent()
        let width = olExtent.getWidth(extent)
        let resolutions = [], matrixIds = []
        for (let z = 1; z < 19; z++) {
            resolutions[z] = width / (256 * Math.pow(2, z))
            matrixIds[z] = z
        }
        return new TileLayer({
            source: new WMTS({
                url: url + appconfig.tianMapKey,
                layer: 'vec',
                matrixSet: 'c',
                format: 'tiles',
                style: 'default',
                wrapX: true,
                projection: projection,
                tileGrid: new WMTSTileGrid({
                    origin: olExtent.getTopLeft(extent),
                    resolutions,
                    matrixIds
                })
            })
        })
    }
} 