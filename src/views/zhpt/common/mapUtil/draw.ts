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

    startDrawCallBack = null

    endDrawCallback = null

    showCloser = true

    overlay = null

    drawType = {
        line: "LineString", // 线
        polygon: "Polygon", // 面
        point: "Point", // 点
        rect: "Circle", // 框
        circle: "Circle" // 圆
    }

    constructor (map, type, { startDrawCallBack = null, endDrawCallBack = null, showCloser = true }) {
        this.map = map
        this.type = type
        this.startDrawCallBack = startDrawCallBack
        this.endDrawCallback = endDrawCallBack
        this.showCloser = showCloser
        this.init()
    }

    private init () {
        this.vectorSource = new VectorSource({ wrapX: false })
        this.vectorLayer = new VectorLayer({ 
            source: this.vectorSource,
            style: comSymbol.getAllStyle(7, "#f40", 5, "#7BDCFE")
        })
        this.map.addLayer(this.vectorLayer);
    }

    start () {
        // 初始化绘制
        let geometryFunction = {}
        if (this.type === "rect") geometryFunction = { geometryFunction: createBox() }

        this.drawer = new Draw({
            source: this.vectorSource,
            type: this.drawType[this.type],
            maxPoints: null,
            style: comSymbol.getDrawStyle(7, "#f40", 5, "#7BDCFE"),
            condition: evt => {
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
        this.map.removeInteraction(this.drawer)
        this.drawer = null
    }
    // 清除绘制图形
    clear () {
        this.vectorSource.clear()
        this.map.removeLayer(this.vectorLayer)
        this.overlay && this.overlay.setPosition(null)
        this.vectorSource = this.vectorLayer = this.overlay = null
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