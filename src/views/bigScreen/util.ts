
import { Map } from "ol";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import {Style,Icon,} from 'ol/style';
export default class util{

    view:Map=null
    vectorLayer:VectorLayer<any>=null
    feature:Feature<any>=null
    src:string=null

    constructor (view) {
        this.initVector(view)
    }
    initVector(view){
        if(!view) return
        this.view=view
        //创建矢量层
        this.vectorLayer = new VectorLayer({source: new VectorSource({wrapX: false,})});
        //将图层添加到地图中
        this.view.addLayer(this.vectorLayer);
    }
    //定位方法
    located(info,position){
        this.src=info.src
        this.showPointSymbol(info,position)
        this.view.getView().setCenter(position)
        return this.vectorLayer
    }
    showPointSymbol(info,position){
        this.vectorLayer.getSource().clear()
        //创建Feature，并添加进矢量容器中
        this.feature = new Feature({
            geometry: new Point(position),
            name:info.name,
            info
        });
        //创建标记的样式
        this.feature.setStyle(this.setFeatureStyle());
        this.vectorLayer.getSource().addFeature(this.feature);
    }
    /**
     * @description 为要素设置样式
     */
    setFeatureStyle() {
        return new Style({
            image: new Icon({
                anchor: [0.5, 0.7],
                scale:0.7,
                //图标的url
                src: this.src
            })
        });
    }
}