<template>
    <div id="player" ref="player" style="position:absolute;width:800px;height:40px;
    background:#fff; bottom: 80px;left:calc(50% - 400px);display:flex; align-items: center;padding:15px;
    border-radius: 5px; box-shadow: 0px 6px 23px #afafaf;">
      <el-col :span="1">
        <el-button type="primary" :icon="pause ? 'el-icon-video-play' : 'el-icon-video-pause'" size="mini" circle @click="play"></el-button>
      </el-col>
      <el-col :span="5" style=" font-size: 15px; font-weight: bold; color: #555;">{{ dtime }}</el-col>
      <el-col :span="16"><el-slider v-model="time" :format-tooltip="format" :min="min" :max="max" @change="tunch"></el-slider></el-col>
      <el-col :span="1" :offset="1">
        <el-button type="danger" icon="el-icon-close" size="mini" circle @click="close"></el-button>
      </el-col>
      <div style="display: none;">
        <div ref='popupWindow' class='popupWindow'>
          <template v-if='currentData'>
            <div class='close' @click="closePopue"><i title="关闭" class="el-icon-close"></i></div>
            <div class='dataTitle'>
              <span>{{currentData.gpsTime||""}}</span>
            </div>
            <template v-for='(item,key) in showData'>
              <div class='dataItem' :key="'showData_'+key">
                <span class='title'>{{item.title}}</span>
                <span class='value'>{{currentData[item.value]+(item.unit||'')}}</span>
              </div>
            </template>
            <div class='dataItem'>
              <span class='title'>有效性：</span>
              <div class='value' :title='currentData.isValidName' style="display: inline-block;">
                <el-switch
                  :value="currentData.isValidName=='有效'?true:false"
                  active-color="#4587E7"
                  inactive-color="#FF0000"
                  :active-value="true"
                  :inactive-value="false">
                </el-switch>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
</template>

<script>
import request from '@/utils/request'
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import Feature from 'ol/Feature';
import {LineString,Point } from 'ol/geom';
import { comSymbol } from '@/utils/comSymbol';
import {fromLonLat} from 'ol/proj';
import {unByKey} from 'ol/Observable';
import Overlay from 'ol/Overlay';
export default {
  name: 'roadPlayer',
  components: { },
  props: { param: Object },
  data() {
    return {
      time: 0,
      min: 0,
      max: 100,
      dtime: '',
      pause: true,
      pathColor:"",
      moveColor:"",
      pointColor:"",
      pointSize:"",
      lineWidth:"",
      pathLayer:'',
      highPathLayer:'',
      pointLayer:null,
      currentData:null,
      currentOverlay:null,
      pointStyle:{
        size:4, 
        color:'#FF8C00', 
        outSize:2, 
        outColor:'#FF8C00'
      },
      pointLayerEvent:null,
      showData:[
        {
          title:"巡检人：",
          value:"userName",
          unit:""
        },
        {
          title:"轨迹段：",
          value:"timeSplit",
          unit:""
        },
        {
          title:"定位方式：",
          value:"pos",
          unit:""
        },
        {
          title:"精度：",
          value:"gpsPrecision",
          unit:""
        },
        {
          title:"与上一点距离：",
          value:"distance",
          unit:"米"
        },
        {
          title:"时速：",
          value:"gpsSpeed"
        },
        // {
        //   title:"有效性：",
        //   value:"isValidName"
        // }
      ]
    }
  },
  mounted: function() {
    this.getSetInit();
  },
  watch:{
    time(index) {
      if(this.times.length > index) {
        var dt = this.times[index]
        this.dtime = dt.t
        this.highPathLayer.getSource().clear();
        this.highPathLayer.getSource().addFeature(new Feature({
            geometry: new LineString(this.road.slice(0, index + 1))
          }))
      }
    }
  },
  methods: {
    startSearch(){
      this.mapView = this.param.view
      this.times = this.param.times
      if(!this.pathLayer){
        this.pathLayer = new VectorLayer({ source: new VectorSource(), style: comSymbol.getLineStyle(this.lineWidth,this.pathColor) });
        this.mapView.addLayer(this.pathLayer);
      }
      if(!this.highPathLayer){
        this.highPathLayer=new VectorLayer({ source: new VectorSource(), style: comSymbol.getLineStyle(this.lineWidth,this.moveColor) });
        this.mapView.addLayer(this.highPathLayer); 
      }
      if(!this.pointLayer){
        this.pointLayer=new VectorLayer({ source: new VectorSource(), style: comSymbol.getPointStyle(this.pointStyle.size,this.pointStyle.color,this.pointStyle.outSize,this.pointStyle.outColor) });
        this.mapView.addLayer(this.pointLayer); 
        this.pointLayerEvent=this.mapView.on('click',evt=>{
          this.pointLayer.getFeatures(evt.pixel).then(res=>{
            if(res&&res.length>0&&res[0].values_&&res[0].values_.currentData){
              const temp=res[0].values_.currentData
              temp.pos=([,'卫星', '前次',, '缓存', 'Wifi', '基站',, '离线', '最后位置'][temp.network] || '未知类型')+ '定位';
              temp.isValidName=(temp.isValid=='1'?"有效":"无效");
              temp.isValidClass=(temp.isValid=='1'?"valid":"notvalid");
              temp.timeSplit=temp.timeSplit||"";
              this.currentData=res[0].values_.currentData||null;
              this.$nextTick(ev=>{
                this.currentOverlay.setElement(this.$refs.popupWindow)
                this.currentOverlay.setPosition(evt.coordinate)
              })
            }
          })
        })
      }
      //轨迹数据
      this.road = this.times.map((e) => [e.x, e.y])
      const pathFea=new Feature({
          geometry: new LineString(this.road)
      })
      this.pathLayer.getSource().clear();
      this.pathLayer.getSource().addFeature(pathFea);
      this.mapView.getView().fit(this.pathLayer.getSource().getExtent(),{
        size:this.mapView.getSize(),
        maxZoom:19,
        duration:1000
      });
      this.init();
      const tempPoint=[];
      this.times.forEach(item=>{
        const tempFea=new Feature({
            geometry:new Point([item.x,item.y]),
            labelPoint: new Point([item.x,item.y]),
            name:item.t,
            x:item.x,
            y:item.y,
            currentData:item.data
          });
        tempPoint.push(tempFea);
      });
      this.pointLayer.getSource().clear();
      this.pointLayer.getSource().addFeatures(tempPoint);
    },
    /**
     * 获取巡检颜色配置
    */
    getSetInit(){
      let url="/base/paramconfig/page";
      request({ url: url, method: 'get' }).then(res => {
        if(res.code == 1) {
          let data=res.result.records[0];
          if(data.lineColor){
            this.pathColor=data.lineColor;
          }else{
            this.pathColor=[45, 116, 231, 1];
          }
          if(data.plineColor){
            this.moveColor=data.plineColor;
          }else{
            this.moveColor==[45, 116, 231, 1];
          }
          if(data.pointColor){
            this.pointColor=data.pointColor;
          }else{
            this.pointColor=[51, 133, 255]
          }
          if(data.routePt){
            this.pointSize=data.routePt;
          }else{
            this.pointSize="8"
          }
          if(data.routeLine){
            this.lineWidth=data.routeLine
          }else{
            this.lineWidth="3"
          }
        };
        this.startSearch();
      })
    },
    init() {
      var tables = this.times;
      this.max = tables.length - 1;
      this.time = 0;
      this.dtime = this.times[0].t;
      this.pause = true;
      this.initOverlay();
    },
    closePopue(){
      this.currentOverlay.setPosition(undefined);
      return false
    },
    initOverlay(){
      const element =this.$refs.popupWindow;
      this.currentOverlay= new Overlay({
        stopEvent:(e)=>{
          this.currentData=null;
        }
      });
      this.mapView.addOverlay(this.currentOverlay);
    },
    play() {
      if(this.pause){
        this.pause = false
        var setNext = () => {
          if(!this.pause && this.time < this.times.length - 1) {
            this.time += 1
            if(this.time < this.times.length - 1)
              setTimeout(setNext, 100)
            else this.pause = true
          } else {
            this.pause = true
          }
        }
        setNext()
      } else {
        this.pause = true
      }
    },
    tunch() {
      this.pause = true
    },
    format(e) {
      return this.times ? this.times[e].t : e
    },
    close() {
      if(this.pointLayerEvent){
        unByKey(this.pointLayerEvent);
      }
      if(this.pathLayer){
        this.pathLayer.getSource().clear();
      }
      if(this.highPathLayer){
        this.highPathLayer.getSource().clear();
      }
      if(this.pointLayer){
        this.pointLayer.getSource().clear();
      }
      if(this.currentOverlay){
        this.mapView.removeOverlay(this.currentOverlay);
      }
      this.mapView.removeLayer(this.pathLayer);
      this.mapView.removeLayer(this.highPathLayer);
      this.mapView.removeLayer(this.pointLayer);
      this.pathLayer=null;
      this.highPathLayer=null;
      this.pointLayer=null;
      this.currentOverlay=null;
      for (let i = 0, il = this.$store.state.map.floatPanels, ii = il.length; i < ii; i++) {
        if (il[i].com == 'roadPlayer') {
          il.splice(i, 1)
          return
        }
      }
    }
  },
  destroyed(){
    this.close();
  }
}
</script>
<style lang='scss' scoped>
.t{
  display: none;
}
.popupWindow{
    position: relative;
    float: left;
    background: white;
    padding: 20px 10px 10px 10px;
    border-radius: 10px;
    .close{
      position: absolute;
      top: 3px;
      right: 5px;
      i{
        cursor: pointer;
      }
    }
    .dataTitle{
      font-size: 16px;
      font-weight: 700;
    }
    .dataItem{
      font-size: 14px;
      padding: 10px 0px 0px 0px;
      color: #383535;
    }
}
</style>