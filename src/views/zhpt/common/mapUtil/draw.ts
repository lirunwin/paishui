import { Draw } from "ol/interaction";
import { createBox } from "ol/interaction/Draw";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import { comSymbol } from "@/utils/comSymbol";
import Overlay from 'ol/Overlay';


export default class iDraw {
    map = null // 地图

    drawer = null // 绘制器 

    type = "" // 绘制类型
    
    vectorSource = null // 绘制图层源

    vectorLayer = null // 绘制图层

    startDrawCallBack = null // 开始绘制时回调

    conditionCallBack = null // 

    endDrawCallback = null // 结束绘制时回调

    showCloser = true // 是否显示关闭

    overlay = null // 绘制图形关闭

    maxLength = 1e3 // 最多绘制点数

    drawStyle=null //绘制样式

    drawType = {
        line: "LineString", // 线
        polygon: "Polygon", // 面
        point: "Point", // 点
        rect: "Circle", // 框
        circle: "Circle" // 圆
    } // 绘制类型

    constructor (map, type, { startDrawCallBack = null, conditionCallBack = null, endDrawCallBack = null, showCloser = true, maxLength = 1e3 ,drawStyle=null}) {
        if (!map) throw new Error("绘制器没有地图对象")
        if (!type) throw new Error(`无绘制类型`)
        this.map = map
        this.type = type
        this.startDrawCallBack = startDrawCallBack
        this.endDrawCallback = endDrawCallBack
        this.conditionCallBack = conditionCallBack
        this.showCloser = showCloser
        this.maxLength = maxLength
        this.drawStyle = drawStyle
        this.init()
    }

    private init () {
        this.vectorSource = new VectorSource({ wrapX: false })
        this.vectorLayer = new VectorLayer({
            source: this.vectorSource,
            style:  ! this.drawStyle 
                    ? comSymbol.getAllStyle(7, "#f40", 2, "#409EFF")
                    : comSymbol.getAllStyle(this.drawStyle.pointSize, this.drawStyle.pointColor, this.drawStyle.lineWidth, this.drawStyle.lineColor)
        })
        this.map.addLayer(this.vectorLayer);
        this.vectorLayer.setZIndex(99)
    }

    start () {
        // 初始化绘制
        let geometryFunction = this.type === "rect" ? { geometryFunction: createBox() } : {}

        this.drawer = new Draw({
            source: this.vectorSource,
            type: this.drawType[this.type],
            maxPoints: this.maxLength,
            style: !this.drawStyle ? comSymbol.getDrawStyle(5, "#f40", 2, "#409EFF") :
                    comSymbol.getDrawStyle(this.drawStyle.pointSize, this.drawStyle.pointColor, this.drawStyle.lineWidth, this.drawStyle.lineColor,this.drawStyle.fillColor,this.drawStyle.lineDash),
            condition: evt => {
                this.conditionCallBack && this.conditionCallBack(evt)
                return true
            },
            ...geometryFunction
        } as any);
        
        // 监听绘制
        this.drawer.on("drawstart", evt => {
            this.startDrawCallBack && this.startDrawCallBack()
        })

        this.drawer.on("drawend", evt => {
            let lastPoint = evt.feature.getGeometry().getLastCoordinate()
            this.showCloser && this.addCloser(lastPoint, evt.feature)
            this.endDrawCallback && this.endDrawCallback(evt.feature)
        })

        // 添加绘制
        this.map.addInteraction(this.drawer);
    }
    // 结束绘制
    end () {
        this.clear()
        this.remove()
        this.map = null        
    }
    // 移除事件
    remove () {
        this.map && this.map.removeInteraction(this.drawer)
        this.drawer = null
    }
    // 绘制图形
    clear () {
        this.vectorSource && this.vectorSource.clear()
        this.map && this.map.removeLayer(this.vectorLayer)
        this.overlay && this.overlay.setPosition(null)
        this.vectorSource = this.vectorLayer = this.overlay = null
    }
    //
    clearFea () {
        this.vectorSource && this.vectorSource.clear()
    }
    // crosshair, auto
    setCursor (cursorStyle = "auto") {
        this.map.getTargetElement().style.cursor = cursorStyle
    }

    // 创建一个关闭按钮
    addCloser(position, feature) {
        let element = document.createElement('div') as any;
        element.style = 'cursor: pointer; width: 20px;height: 17px;background: #fff;text-align: center;border: 1px solid;line-height: 12px;font-size: 15px;'
        element.innerHTML = `<div title='关闭'>x</div>`
        let overlay = new Overlay({
            element: element,
            autoPan: false,
            positioning: "bottom-center",
            id: "drawFeatureCloser" + Math.floor(Math.random() * 1e6),
            stopEvent: false
        });
        this.overlay = overlay
        this.map.addOverlay(overlay)
        overlay.setPosition(position)

        element.addEventListener("click", evt => {
            this.vectorSource.removeFeature(feature)
            overlay.setPosition(null)
            evt.stopPropagation()
        })
    }

}