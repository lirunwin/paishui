import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector';
import { Vector as VectorSource, XYZ } from 'ol/source';
import { TileSuperMapRest } from '@supermap/iclient-ol'
import { appconfig } from 'staticPub/config';

export class TF_Layer {

    projection = ''

    constructor (projection = 'EPSG:4326') {
        this.projection = projection
    }

    createLayer ({ properties = {}, type, visible = true, url}) {
        let layer = null
        switch (type) {
            case "smlayer" : layer = this.SM_Layer(url)
                break
            case "tdtlayer": layer = this.TDT_Layer(url)
                break
            case "vector": layer = this.VT_Layer()
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
    SM_Layer (url = "") {
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
    TDT_Layer (url = "") {
        if (!url) return null
        return new TileLayer({ source: new XYZ({ url: url + appconfig.tianMapKey }) })
    }
    // 矢量图层
    VT_Layer () {
       return  new VectorLayer({ source: new VectorSource() })
    }

} 