<template>
  <div style="height:100%" calss='xjRealTimeListen'>
    <el-tabs style="height:100%" v-model="activeName">
      <template v-for="item in partData">
        <el-tab-pane style="height:100%" :key="item.value" :label="item.title" :name="item.value">
          <component :layerList='layerList' @addPoint="addPoint" :departInfo='departInfo' :mapView='mapView' :is='item.component'></component>
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script>
import tool from './tool'
import peopleVue from "./people"
import carVue from "./car"
import planVue from "./plan"
import troubleVue from "./trouble"
import layerVue from "./layer"
import {getAllDepartments} from '@/api/base'
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import Text from 'ol/style/Text';
import Feature from 'ol/Feature';
import {LineString,Point } from 'ol/geom';
import {Icon, Style} from 'ol/style';
import carDuty from "./images/caronwork.png";
import carNotDuty from "./images/noWorkState.png";
import peopleDuty from "./images/onWork.png";
import peopleNotDuty from "./images/noWork.png";
import notTroubleImg from "@/assets/images/traingle4.png";
import troubleImg from "@/assets/images/traingle1.png";
export default {
  components:{peopleVue,carVue,planVue,troubleVue,layerVue},
  props: ['data'],
  data(){
    return{
      mapView:null,
      activeName:'people',
      partData:[
        {
          title:'人员',
          value:'people',
          component:"peopleVue",
        },
        {
          title:'车辆',
          value:'car',
          component:"carVue",
        },
        {
          title:'计划',
          value:'plan',
          component:"planVue",
        },
        {
          title:'隐患',
          value:'trouble',
          component:"troubleVue",
        },
        {
          title:'图层',
          value:'layer',
          component:"layerVue",
        }
      ],
      layerList:{
        peopleLayer:{
          layer:null,
          title:'人员',
          show:true
        },
        troubleLayer:{
          layer:null,
          title:'隐患',
          show:true
        },
        carLayer:{
          layer:null,
          title:'车辆',
          show:true
        }
      },
      pictureSymbol:{
        carDuty:{
          img:carDuty,
          height:64,
          width:64,
          symbol:null,
          scale:0.5
        },
        carNotDuty:{
          img:carNotDuty,
          height:64,
          width:64,
          symbol:null,
          scale:0.5
        },
        peopleDuty:{
          img:peopleDuty,
          height:48,
          width:48,
          symbol:null,
          scale:0.7
        },
        peopleNotDuty:{
          img:peopleNotDuty,
          height:48,
          width:48,
          symbol:null,
          scale:0.7
        },
        troubleImg:{
          img:troubleImg,
          height:48,
          width:48,
          symbol:null,
          scale:0.5
        },
        notTroubleImg:{
          img:notTroubleImg,
          height:48,
          width:48,
          symbol:null,
          scale:0.5
        }
      },
      departInfo:{
        departmentList:[],
        currentDepart:''
      }
    }
  },
  created(){
    this.departInfo.currentDepart=parseInt(this.$store.state.user.departmentId);
    this.mapView=this.data.mapView;
    this.getDepartment();
    this.initLayer();
    this.initSymbol();
  },
  methods:{

    /**获取部门数据，并传送给子组件*/
    getDepartment(){
      getAllDepartments().then((res) => {
        this.departInfo.departmentList = res.result || []
      })
    },

    /**创建图层，并传送给子组件*/
    initLayer(){
      for(let item in  this.layerList){
        this.layerList[item].layer= new VectorLayer({ source: new VectorSource() });
        this.mapView.addLayer(this.layerList[item].layer);
        this.layerList[item].layer.setVisible(this.layerList[item].show)
      }
    },

    /**初始化图片*/
    initSymbol(){
      for(let item in  this.pictureSymbol){
          this.pictureSymbol[item].symbol=new Style({
          image: new Icon({
            crossOrigin: 'anonymous',
            scale:this.pictureSymbol[item].scale,
            size:[this.pictureSymbol[item].width, this.pictureSymbol[item].height],
            imgSize: [this.pictureSymbol[item].width, this.pictureSymbol[item].height],
            src: this.pictureSymbol[item].img,
          }),
        })
      }
    },

    /**添加点数据*/
    addPoint(data){
      switch (data.type){
        case "people":
          this.addPointToLayer(
            {
              layer:this.layerList.peopleLayer.layer,data:data.data,
              signSymbol:this.pictureSymbol.peopleDuty.symbol,
              noSignSymbol:this.pictureSymbol.peopleNotDuty.symbol
            })
        break;
        case "trouble":
            this.addPointToLayer(
            {
              layer:this.layerList.troubleLayer.layer,data:data.data,
              signSymbol:this.pictureSymbol.troubleImg.symbol,
              noSignSymbol:this.pictureSymbol.notTroubleImg.symbol
            })
        break;
        case "car":
            this.addPointToLayer(
            {
              layer:this.layerList.carLayer.layer,data:data.data,
              signSymbol:this.pictureSymbol.carDuty.symbol,
              noSignSymbol:this.pictureSymbol.carNotDuty.symbol
            })
        break;
      }
    },

    /**将点加入对应的图层*/
    addPointToLayer(layerData){
      const{layer,data,signSymbol,noSignSymbol}=layerData
      layer.getSource().clear();
      const feartures=[];
      data.forEach(item=>{
        let symbol=signSymbol.clone();
        if(item.state!='sign'){
          symbol=noSignSymbol.clone();
        }
        const tempFea=new Feature({
          geometry:new Point([item.x,item.y]),
          labelPoint: new Point([item.x,item.y]),
          name:item.name
        });
        symbol.setText(new Text({
          text: item.name,
          font : 'bold 14px Arial,Helvetica,sans-serif',
          offsetY:25,
        }))
        tempFea.setStyle(symbol)
        feartures.push(tempFea);
      })
      layer.getSource().addFeatures(feartures)
    },

    /**控制图层*/
    controlLayer(){

    }
  },

  destroyed(){
    tool.closePlay(this.$store);
    //清除车辆、人员、隐患图层
    for(let item in  this.layerList){
      this.layerList[item].layer.getSource().clear();
      this.mapView.removeLayer(this.layerList[item].layer);
      this.layerList[item].layer=null;
    }
  }
}
</script>


<style lang="scss" scoped>
/deep/ .el-tabs__content{
  position: relative;
  height: calc(100% - 50px) !important;
}
</style>