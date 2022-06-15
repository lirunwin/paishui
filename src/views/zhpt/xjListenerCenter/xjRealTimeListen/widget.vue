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
import peopleVue from "./people"
import carVue from "./car"
import planVue from "./plan"
import troubleVue from "./trouble"
import layerVue from "./layer"
import {getAllDepartments} from '@/api/base'
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import Feature from 'ol/Feature';
import {LineString,Point } from 'ol/geom';
import {Icon, Style} from 'ol/style';
import carDuty from "./images/caronwork.png";
import carNotDuty from "./images/noWorkState.png";
import peopleDuty from "./images/onWork.png";
import peopleNotDuty from "./images/noWork.png";
import troubleImg from "@/assets/images/traingle4.png";
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
        peopleLayer:null,
        troubleLayer:null,
        carLayer:null
      },
      pictureSymbol:{
        carDuty:{
          img:carDuty,
          size:32,
          width:32,
          symbol:null
        },
        carNotDuty:{
          img:carNotDuty,
          size:32,
          width:32,
          symbol:null
        },
        peopleDuty:{
          img:peopleDuty,
          size:32,
          width:32,
          symbol:null
        },
        peopleNotDuty:{
          img:peopleNotDuty,
          size:32,
          width:32,
          symbol:null
        },
        troubleImg:{
          img:troubleImg,
          size:32,
          width:32,
          symbol:null
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
        this.layerList[item]= new VectorLayer({ source: new VectorSource() });
        this.mapView.addLayer(this.layerList[item]);
      }
    },

    /**初始化图片*/
    initSymbol(){
      for(let item in  this.pictureSymbol){
          this.pictureSymbol[item].symbol=new Style({
          image: new Icon({
            // color: '#BADA55',
            crossOrigin: 'anonymous',
            // For Internet Explorer 11
            imgSize: [this.pictureSymbol[item].size, this.pictureSymbol[item].width],
            src: this.pictureSymbol[item].img,
          }),
        })

        // this.layerList[item]= new VectorLayer({ source: new VectorSource() });
        // this.mapView.addLayer(this.layerList[item]);
      }
      // this.pictureSymbol.forEach(item=>{
     
      // })
    },

    /**添加点数据*/
    addPoint(data){
      switch (data.type){
        case "people":
          debugger
          this.layerList.peopleLayer.getSource().clear();
          const feartures=[];
          data.data.forEach(item=>{
            let symbol=this.pictureSymbol.peopleDuty.symbol;
            if(item.state!=2){
              symbol=this.pictureSymbol.peopleNotDuty.symbol;
            }
            feartures.push(new Feature({
              geometry:new Point({coordinates:[item.x,item.y]}),
              name:item.userName
            }).setStyle(symbol))
          })
          this.layerList.peopleLayer.getSource().addFeatures(feartures)
        break;
      }
    },
  },
  destroyed(){
    tool.closePlay(this.$store);
    //清除车辆、人员、隐患图层
    for(let item in  this.layerList){
      this.layerList[item].clear();
      this.mapView.removeLayer(this.layerList[item]);
      this.layerList[item]=null;
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