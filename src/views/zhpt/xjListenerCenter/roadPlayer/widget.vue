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
    }
  },
  mounted: function() {
    this.getSetInit();
  },
  watch:{
    time(index) {
      if(this.times.length - 1 > index) {
        var dt = this.times[index + 1]
        var center = this.Point.geometry = { type: 'point', x: dt.x, y: dt.y, spatialReference: this.mapView.spatialReference }
        this.dtime = dt.t
        this.playLine.geometry = { type: 'polyline', paths: this.road.slice(0, index + 2), spatialReference: this.mapView.spatialReference }
        if(!this.pause) {
          this.mapView.goTo(this.Point.geometry, {
            duration: 80,
            easing: "linear"
          })
          this.mapView.zoom = 6
          // this.mapView.center = center
          // this.mapView.zoom = 6
        }
      }
    }
  },
  methods: {
    startSearch(){
      var param = this.param
      this.mapView = param.view
      this.times = param.times
      var view = this.mapView
      var Graphic = view.TF_graphic
      this.Line = new Graphic({
        geometry: { type: 'polyline', paths: [[0,0]], spatialReference: view.spatialReference },
        symbol: { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: this.pathColor, width:this.lineWidth } }
      })
      this.Point = new Graphic({
        geometry: { type: 'point', x: 0, y: 0, spatialReference: view.spatialReference },
        symbol: {
          path: 'M296.565983 216.613614a225.868923 216.613614 0 1 0 451.737847 0 225.868923 216.613614 0 1 0-451.737847 0Z M659.689169 433.227228h-13.292199a233.4504 233.4504 0 0 1-273.622379 0H359.580853c-57.402608 0-97.771509 44.208869-79.359352 96.393059l138.337331 427.910349a93.93154 93.93154 0 0 0 91.076179 66.460995A93.93154 93.93154 0 0 0 600.612729 957.530636l138.337331-427.910349C757.460678 477.436098 716.993316 433.227228 659.689169 433.227228z',
          color: [255, 255, 255], outline: {color:this.pointColor, width: 2},
          size:  this.pointSize, yoffset: '15px', xoffset: '0px', type: 'simple-marker'
        }
      })
      this.playLine = new Graphic({
        geometry: { type: 'polyline', paths: [], spatialReference: view.spatialReference },
        symbol: { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: {color: this.moveColor, width:this.lineWidth} }
      })
      // this.Line = new Graphic({
      //   geometry: { type: 'polyline', paths: [[0,0]], spatialReference: view.spatialReference },
      //   symbol: { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: [45, 116, 231, 1], width: "3px" } }
      // })
      // this.Point = new Graphic({
      //   geometry: { type: 'point', x: 0, y: 0, spatialReference: view.spatialReference },
      //   symbol: {
      //     path: 'M296.565983 216.613614a225.868923 216.613614 0 1 0 451.737847 0 225.868923 216.613614 0 1 0-451.737847 0Z M659.689169 433.227228h-13.292199a233.4504 233.4504 0 0 1-273.622379 0H359.580853c-57.402608 0-97.771509 44.208869-79.359352 96.393059l138.337331 427.910349a93.93154 93.93154 0 0 0 91.076179 66.460995A93.93154 93.93154 0 0 0 600.612729 957.530636l138.337331-427.910349C757.460678 477.436098 716.993316 433.227228 659.689169 433.227228z',
      //     color: '2D74E7', outline: { color: '2D74E7', width: '1px' },
      //     size: '30px', yoffset: '15px', xoffset: '0px', type: 'simple-marker'
      //   }
      // })
      // this.playLine = new Graphic({
      //   geometry: { type: 'polyline', paths: [], spatialReference: view.spatialReference },
      //   symbol: { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: [255, 0, 0, 1], width: "2px" } }
      // })
      this.road = this.times.map((e) => [e.x, e.y])
      view.graphics.addMany([this.Line, this.playLine, this.Point])
      this.mapView.TF_roadPlayer = {
        reload: (table) => {
          this.times = table
          this.init()
        },
        close:()=>{
          this.close();
        }    
      }
      this.init()
      this.loadSymbol()
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
      var tables = this.times
      this.max = tables.length - 1
      this.time = 0
      this.dtime = this.times[0].t
      this.pause = true
      
      var paths = []
      var last = [-1, -1]
      for(var i=0,ii=tables.length;i<ii;i++) {
        var dtime = tables[i]
        if(last[0] != dtime.x && last[1] != dtime.y) paths.push([dtime.x, dtime.y])
        last = paths[paths.length - 1]
      }
      this.road = this.times.map((e) => [e.x, e.y])
      this.Line.geometry = { type: 'polyline', paths: paths, spatialReference: this.mapView.spatialReference }
      this.mapView.extent = this.Line.geometry.extent
      this.mapView.zoom -= 1
    },
    loadSymbol() {
      request({ url: '/base/paramconfig/page', method: 'get' }).then((res) => {
        if(res.code == 1) {
          res = res.result.records[0]
          this.Line.symbol = { type: 'simple-line', color: res.plineColor, cap: 'square', width: res.routeLine + 'px'  }
          this.Point.symbol = {
              path: 'M296.565983 216.613614a225.868923 216.613614 0 1 0 451.737847 0 225.868923 216.613614 0 1 0-451.737847 0Z M659.689169 433.227228h-13.292199a233.4504 233.4504 0 0 1-273.622379 0H359.580853c-57.402608 0-97.771509 44.208869-79.359352 96.393059l138.337331 427.910349a93.93154 93.93154 0 0 0 91.076179 66.460995A93.93154 93.93154 0 0 0 600.612729 957.530636l138.337331-427.910349C757.460678 477.436098 716.993316 433.227228 659.689169 433.227228z',
              color: res.pointColor, outline: { color: res.pointColor, width: '1px' },
              size: res.routePt + 'px', yoffset: res.routePt / 2 + 'px', xoffset: '0px', type: 'simple-marker'
            }
          this.playLine.symbol = { type: 'simple-line', color: res.lineColor, cap: 'square', width: res.routeLine + 'px'  }
        } else this.$message.error('配置加载失败')        
      })
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
      this.mapView.graphics.removeMany([this.Line, this.playLine, this.Point])
      for (let i = 0, il = this.$store.state.map.floatPanels, ii = il.length; i < ii; i++) {
        if (il[i].com == 'roadPlayer') {
          il.splice(i, 1)
          return
        }
      }
    }
  }
}
</script>