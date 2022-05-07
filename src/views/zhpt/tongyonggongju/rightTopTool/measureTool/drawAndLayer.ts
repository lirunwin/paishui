import { Draw } from "ol/interaction";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import Overlay from 'ol/Overlay';
import { Polygon, LineString,Point } from 'ol/geom';
import Feature from 'ol/Feature';
import { unByKey } from 'ol/Observable'
import { getLength, getArea } from 'ol/sphere';
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import Circle from "ol/style/Circle";
import {comSymbol} from "@/utils/comSymbol"
/**存在的操作*/
export const optionAction={
  /**距离测量*/
  distance:"distance",
  /**面积测量*/
  area:"area",
  /**角度测量*/
  angle:"angle",
  /**坐标展示*/
  coordinate:"coordinate",
  /**清除测量*/
  clearMeasure:"clearMeasure"
};
const drawAction={
  distance:"LineString",
  angle:"LineString",
  area:"Polygon",
  coordinate:"Point",
  clearMeasure:"clear"
}

/**
 * 存储测量工具的通用方法
*/
class DrawInMap{
  /**操作的地图*/
  map=null;
  /**当前的操作*/
  option="";
  /**图层唯一标识*/
  layerUniqueCode="measureToolLayer";
  /**图层*/
  layer=null;
  /**绘制唯一标识*/
  drawUniqueCode="measureToolDraw";
  /**绘制工具*/
  draw=null;
  /**数据源*/
  vectorSource=null;
  /**测量结果*/
  measureResult="0";
  /**地图显示数据的标签*/
  tipDiv=null;
  /**鼠标移动事件*/
  pointermoveEvent=null;
  /**鼠标点击事件*/
  pointClickEvent=null;
  /**图形监听事件*/
  geometryListener=null;
  /**绘制的图形要素*/
  sketchFeature=null;

  /**
   * 初始值
   */
  initValue(map){
    this.destory();
    this.map=map;
  }

    /**
   * 测量
   */
  measure(option) {
    this.option=option;
    this.checkLayerExist();
  }

  /**检测图层是否已存在于map中*/ 
  checkLayerExist(){
    this.tipDiv = document.createElement('div');
    this.tipDiv.innerHTML = (this.option==optionAction.coordinate?"点击地图":'单击确定起点');
    this.tipDiv.className = "tipDiv";
    this.tipDiv.style = "width:auto;height:auto;padding:4px;border:1px solid #fc5531;font-size:12px;background-color:#fff;position:relative;top:60%;left:60%;font-weight:600;"
    let overlay=this.createMapMark(this.tipDiv,'tipLay');
    this.pointermoveEvent = this.map.on("pointermove", evt => {
      overlay.setPosition(evt.coordinate);
    })
    this.createSource();
    this.createLayer();
    if(this.option==optionAction.coordinate){
      this.pointClickEvent=this.map.on("click",evt=>{
        this.creatMark(null, evt.coordinate[0].toFixed(3)+","+evt.coordinate[1].toFixed(3), 'coordinateInfo').setPosition(evt.coordinate);
        let feature = new Feature({
          geometry: new Point(evt.coordinate),
        });
        feature.setStyle(comSymbol.getPointStyle())
        this.vectorSource.addFeature(feature);
      })
    }else{
      this.creatDraw();
    }
  }

  /**
   * 创建数据源
   * */ 
  createSource(){
    // 矢量图层源
    this.vectorSource = new VectorSource({
      wrapX: false
    });
  }

  /**
   * 创建图层
   * */ 
  createLayer(){
    // 矢量图层
    this.layer = new VectorLayer({
      source: this.vectorSource,
      style: comSymbol.getAllStyle(),
      name: this.layerUniqueCode
    } as any);
    this.map.addLayer(this.layer);
  }

  /**
   * 创建绘制工具
   * */ 
  creatDraw(){
    this.draw = new Draw({
      source: this.vectorSource,
      name:this.drawUniqueCode,
      type:drawAction[this.option],
      maxPoints:(this.option==optionAction.angle?3:null),
      style:comSymbol.getDrawStyle(),
      // 绘制时点击处理事件
      condition: (evt) => {
        // 测距时添加点标注
        if (this.measureResult != "0" && !this.map.getOverlayById(this.measureResult) && this.option == optionAction.distance)
          this.creatMark(null, this.measureResult, this.measureResult).setPosition(evt.coordinate)
        return true
      }
    } as any);
    this.map.addInteraction(this.draw);
    
      /**
       * 绘制开始事件
       */
      this.draw.on("drawstart", e => {
        this.sketchFeature = e.feature
        let proj = this.map.getView().getProjection()
        //******距离测量开始时*****//
        if (this.option ==optionAction.distance) {
          this.creatMark(null, "起点", "start").setPosition(this.map.getCoordinateFromPixel(e.target.downPx_))
          this.tipDiv.innerHTML = "总长：0 m</br>单击确定地点，双击结束";
          this.geometryListener = this.sketchFeature.getGeometry().on('change', (evt) => {
            this.measureResult = this.distenceFormat(getLength(evt.target, { "projection": proj, "radius": 6378137 }))
            this.tipDiv.innerHTML = "总长：" + this.measureResult + "</br>单击确定地点，双击结束";
          })
        }
        //******面积测量开始时*****//
        else if (this.option ==optionAction.area) {
          this.tipDiv.innerHTML = "面积：0 m<sup>2</sup></br>继续单击确定地点";
          this.geometryListener = this.sketchFeature.getGeometry().on('change', (evt) => {
            if (evt.target.getCoordinates()[0].length < 4) this.tipDiv.innerHTML = "面积：0m<sup>2</sup></br>继续单击确定地点";
            else {
              this.measureResult = this.formatArea(getArea(evt.target, { "projection": proj, "radius": 6378137 }))
              this.tipDiv.innerHTML = "面积：" + this.measureResult + "</br>单击确定地点，双击结束";
            }
          })
        }
        //******角度测量开始时*****//
        else if (this.option ==optionAction.angle) {
          this.tipDiv.innerHTML = "继续单击确定顶点";
          this.geometryListener = this.sketchFeature.getGeometry().on('change', (evt) => {
            if (evt.target.getCoordinates().length < 3) this.tipDiv.innerHTML = "继续单击确定顶点";
            else {
              this.measureResult = this.formatAngle(evt.target)
              this.tipDiv.innerHTML = "角度：" + parseFloat(this.measureResult).toFixed(2) + "</br>继续单击结束";
            }
          })
        }
      });

      /**
       * 绘制开始事件
       */
      this.draw.on("drawend", e => {
        let closeBtn = document.createElement('span') as any;
        closeBtn.innerHTML = "×";
        closeBtn.title = "清除测量"
        closeBtn['style'] = "width: 18px;height:18px;line-height: 12px;text-align: center;border-radius: 5px;display: inline-block;padding: 0px;color: rgb(255, 68, 0);border: 2px solid rgb(255, 68, 0);background-color: rgb(255, 255, 255);font-weight: 600;position: absolute;top: -25px;right: -2px;cursor: pointer;";
        closeBtn.addEventListener('click', () => {
          this.destory()
        })
        //******距离测量结束时*****//
        if (this.option ==optionAction.distance) {
          this.creatMark(closeBtn, null, "close1").setPosition(e.feature.getGeometry().getLastCoordinate());
          this.creatMark(null, "总长：" + this.measureResult + "", "length").setPosition(e.feature.getGeometry().getLastCoordinate())
          this.map.removeOverlay(this.map.getOverlayById(this.measureResult))
        }
        //******面积测量结束时*****//
        else if (this.option ==optionAction.area) {
          this.creatMark(closeBtn, null, "close2").setPosition(e.feature.getGeometry().getInteriorPoint().getCoordinates());
          this.creatMark(null, "总面积：" + this.measureResult + "", "area").setPosition(e.feature.getGeometry().getInteriorPoint().getCoordinates())
        }
        //******角度测量结束时*****//
        else if (this.option ==optionAction.angle) {
          this.creatMark(closeBtn, null, "close3").setPosition(e.feature.getGeometry().getCoordinates()[1]);
          this.creatMark(null, "角度：" + parseFloat(this.measureResult).toFixed(2) + "", "angle").setPosition(e.feature.getGeometry().getCoordinates()[1])
        }
        // 停止测量
        this.stopMeasure();
      })
  }

  /**
   * 创建标记
   */
  creatMark(markDom, txt, idstr) {
    if (markDom == null) {
      markDom = document.createElement('div');
      markDom.innerHTML = txt
      markDom.style = "width:auto;height:auto;padding:4px;border:1px solid #fc5531;font-size:12px;background-color:#fff;position:relative;top:60%;left:60%;font-weight:600;"
    }
    let overlay=this.createMapMark(markDom,idstr);
    return overlay;
  }

    /**
   * 创建地图标记
   * */
  createMapMark(element,id){
    let overlay = new Overlay({
      element: element,
      autoPan: false,
      positioning: "bottom-center",
      id: id,
      stopEvent: false //停止事件传播到地图
    });
    this.map.addOverlay(overlay)
    return overlay;
  }

  /**
   * 清除地图显示
   */
  clearLayer(){
    //清除图层
    if(this.layer){
      this.layer.getSource().clear();
    }
    //清除标记
    if(this.map){
      this.map.getOverlays().clear();
    }
  }

  /**
   * 停止测量
   */
  stopMeasure() {
    this.tipDiv = null
    if(this.map){
      this.map.removeInteraction(this.draw); // 移除绘制组件
      this.map.removeOverlay(this.map.getOverlayById("tipLay")) // 移除动态提示框
    }   
    this.draw = null;
  }

  /**
   * 清除测量
   */
  clearMeasure() {
    this.clearLayer();
    //移除监听事件
    unByKey(this.pointermoveEvent) // 清除鼠标在地图的pointermove事件
    unByKey(this.geometryListener) // 清除绘制图像change事件
    unByKey(this.pointClickEvent)//清除点击事件
    this.pointermoveEvent = null;
    this.geometryListener = null;
    this.pointClickEvent=null;
    this.measureResult = "0"
  }

  /**
   * 销毁图层和绘图工具
   */
  destory(){
    this.clearMeasure();
    this.measureResult='0';
    if(this.map){
      this.map.removeLayer(this.layer);
      this.layer=null;
    }
  }

  /**
   * 格式化距离结果输出
   */
  distenceFormat(length) {
    let output;
    if (length > 100) {
      output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km'; //换算成km单位
    } else {
      output = (Math.round(length * 100) / 100) + ' ' + 'm'; //m为单位
    }
    return output;//返回线的长度
  }

    /**
     * 格式化面积输出
     */
    formatArea(area) {
      let output;
      if (area > 10000) {
        output = (Math.round(area / 1000000 * 100) / 100) + ' ' + 'km<sup>2</sup>'; //换算成km单位
      } else {
        output = (Math.round(area * 100) / 100) + ' ' + 'm<sup>2</sup>';//m为单位
      }
      return output; //返回多边形的面积
    }

    /**
     * 计算角度输出
     */
    formatAngle(line) {
      var coordinates = line.getCoordinates();
      // var angle = '0°';
      let tempAngle=0;
      if (coordinates.length == 3) {
        const disa = getLength(new Feature({
          geometry: new LineString([coordinates[0], coordinates[1]])
        }).getGeometry(), {
          radius: 6378137,
          projection: this.map.getView().getProjection()
        });

        const disb = getLength(new Feature({
          geometry: new LineString([coordinates[1], coordinates[2]])
        }).getGeometry(), {
          radius: 6378137,
          projection: this.map.getView().getProjection()
        });

        const disc = getLength(new Feature({
          geometry: new LineString([coordinates[0], coordinates[2]])
        }).getGeometry(), {
          radius: 6378137,
          projection: this.map.getView().getProjection()
        });
        var cos = (disa * disa + disb * disb - disc * disc) / (2 * disa * disb); // 计算cos值
        tempAngle = (Math.acos(cos) * 180) / Math.PI; // 角度值
      }
      if (isNaN(tempAngle)) return "0°"
      else return tempAngle + "°"; // 返回角度
    }
}

export const drawAndLayer=new DrawInMap();