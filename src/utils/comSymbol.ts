import {
  Style,
  Circle,
  Icon,
  Fill,
  RegularShape,
  Stroke,
  Text
} from 'ol/style'

/**
 * 设置通用的图形符号
 * */ 
class ComSymbol{
  /**点要素的默认样式*/
  private point={
    color:'#fc5531',
    outColor:"#fc5531",
    size:2,
  }
  /**线要素的默认样式*/
  private line={
    color:'#fc5531',
    width:3
  }
  /**面要素的默认样式*/
  private  polygon={
    fillColor:'rgba(252, 86, 49, 0.1)'
  };

  /**
  * 获取点样式
  * @param size 点大小
  * @param color 点颜色
  * @param outSize 外边框大小
  * @param outColor 外边框颜色
   */
  getPointStyle(size,color,outSize,outColor){
    let style= new Style({
      image: new Circle({
        radius: size|| this.point.size,
        fill: new Fill({
          color: color||this.point.color
        }),
        stroke: new Stroke({
          color:outColor||this.line.color,
          width:outSize|| this.line.width
        })
      })
    })
    return style;
  }

  /**
  * 获取线样式
  * @param size 线的宽度大小
  * @param color 线颜色
   */
  getLineStyle(width,color){
    let style= new Style({
      stroke: new Stroke({
        color: color||this.line.color,
        width: width||this.line.width
      })
    })
    return style;
  }

  /**
  * 获取面样式
  * @param lineWidth 面的边界线宽度(默认宽度3)
  * @param lineColor 面的边界颜色(默认红色)
  * @param fillColor 面里面的颜色(默认红色透明度0.1)
   */
  getPolygonStyle(lineWidth,lineColor,fillColor){
    let style= new Style({
      fill: new Fill({
        color:fillColor||this.polygon.fillColor
      }),      
      stroke: new Stroke({
        color: lineColor||this.line.color,
        width: lineWidth||this.line.width
      })
    })
    return style;
  }

  /**
  * 获取全套的样式(点、线、面)
  * @param pointSize 点的大小
  * @param pointColor 点的颜色
  * @param lineWidth 面的边界线宽度(默认宽度3)
  * @param lineColor 面的边界颜色(默认红色)
  * @param fillColor 面里面的颜色(默认红色透明度0.1)
   */
  getAllStyle(pointSize,pointColor,lineWidth,lineColor,fillColor){
    return this.setAllStyle(pointSize,pointColor,lineWidth,lineColor,fillColor,null)
  }

  /**
  * 获取绘制时的样式
  * @param pointSize 点的大小
  * @param pointColor 点的颜色
  * @param lineWidth 面的边界线宽度(默认宽度3)
  * @param lineColor 面的边界颜色(默认红色)
  * @param fillColor 面里面的颜色(默认红色透明度0.1)
  * @param lineDash 线打断比例(默认打断[10,10])
   */
  getDrawStyle(pointSize,pointColor,lineWidth,lineColor,fillColor,lineDash){
    return this.setAllStyle(pointSize,pointColor,lineWidth,lineColor,fillColor,lineDash||[10,10])
  }

  /**
  *设置全套的的样式
  * @param pointSize 点的大小
  * @param pointColor 点的颜色
  * @param lineWidth 面的边界线宽度(默认宽度3)
  * @param lineColor 面的边界颜色(默认红色)
  * @param fillColor 面里面的颜色(默认红色透明度0.1)
  * @param lineDash 线打断比例(默认不打断[0,0])
   */
  private setAllStyle(pointSize,pointColor,lineWidth,lineColor,fillColor,lineDash){
    let style= new Style({
      fill: new Fill({
        color: fillColor||this.polygon.fillColor
      }),
      stroke: new Stroke({
        lineDash: lineDash||[0,0],
        color: lineColor||this.line.color,
        width: lineWidth||this.line.width
      }),
      image: new Circle({
        radius: pointSize||0,
        fill: new Fill({
          color: pointColor||this.point.color
        })
      })
    })
    return style;
  }
}

export const comSymbol:dStore.map.symbol=new ComSymbol();