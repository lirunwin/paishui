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
    </div>
</template>

<script>
import request from '@/utils/request'
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import Feature from 'ol/Feature';
import {LineString,Point } from 'ol/geom';
import { comSymbol } from '@/utils/comSymbol';
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
      this.init()
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
      if(this.pathLayer){
        this.pathLayer.getSource().clear();
      }
      if(this.highPathLayer){
        this.highPathLayer.getSource().clear();
      }
      this.mapView.removeLayer(this.pathLayer);
      this.mapView.removeLayer(this.highPathLayer);
      this.pathLayer=null;
      this.highPathLayer=null;
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