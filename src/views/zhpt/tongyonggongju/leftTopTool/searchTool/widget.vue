<template>
  <div class='searchTool'>
    <el-input :placeholder="'请输入'+ title" v-model="searchInput" class="searchInput input-with-select" clearable>
      <el-select v-model="select" class='selectInput' @change="selectChange" slot="prepend" placeholder="请选择">
        <template v-for="(item,index) in selectList">
          <el-option :label="item.label" :value="item.value" :key="'searchTool_'+index"></el-option>
        </template>
      </el-select>
      <span v-if='!isloading' class="buttonDiv" slot="append"  @click="searchInfo">
        <svg-icon icon-class='search' className='search-icon'></svg-icon>
      </span>
      <el-button class='buttonDiv' v-else style="color:#fff;" slot="append" icon='el-icon-loading'></el-button>
    </el-input>
    <div id="searchBox" v-if="resData.length !== 0" :v-loading='true' class="res-box i-scrollbar" v-scrollMore='getMore'>
      <div v-for="(item, index) in resData" :key="index" class="more res-box-item" @click="setlocation(item.geometry, item.name)">
        <div class="box-address" :title="item.title" v-html='item.mark'></div>
        <div>
          <span class="res-box-item-span" style="float:left;" :title="item.name">编号：{{ item.name }}</span>
          <span class="res-box-item-span" style="float:right;">设备类型：{{ item.type }}</span>
        </div>
      </div>
      <div v-show="showBottom" style="text-align:center;color:#ddd;margin-top:5px;height:20px;font-size:14px;">到底啦</div>
    </div>
  </div>
</template>

<script>
// 搜索工具
import iQuery from '@/views/zhpt/common/mapUtil/query';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Style, Icon, Fill, Stroke, Text } from 'ol/style';
import { mapUtil } from '@/views/zhpt/common/mapUtil/common';
import { comSymbol } from '@/utils/comSymbol';
import GeoJSON from 'ol/format/GeoJSON';
import markImg from './img/locate.png'
import { appconfig } from 'staticPub/config';

export default {
  name: 'searchTool',
  // components: { tfLegend },
  props: { 
    map:{
      type:Object,
      default:null,
    }
  },
  data() {
    return {
      selectList:[
        {
          label:"地名",
          value:"1",
        },{
          label:"坐标",
          value:"2",
        }
      ],
      // 查询结果
      resData: [],
      select:'1',
      searchInput:'',
      title:"地名",
      isloading: false,
      // 储存的位置信息
      showBottom: true,
      maxLength: 1000,
      searchData: [],
      currDataIndex: 10,
      vectorLayer: null,
    }
  },
  watch: {
    searchInput (n, o) {
      if (n === '') {
        this.resData = []
        this.searchData = []
        this.currDataIndex = 10
        this.showBottom = false
        this.clear()
      }
    }
  },
  computed: {
  },
  mounted() {

  },
  destroyed () {
    this.vectorLayer && this.map.removeLayer(this.vectorLayer)
    this.vectorLayer = null
  },
  methods: {
    getMore () {
      if (this.currDataIndex < this.maxLength - 1) {
        this.resData.push(this.searchData[this.currDataIndex])
        this.currDataIndex++
      } else {
        this.showBottom = true
      }
    },
    /**
     * 下拉框改变的时候
    */
    selectChange(){
      let selectData=this.selectList.find(item=>{return item.value==this.select});
      this.title= selectData.label === '坐标' ? '坐标如:101,26': selectData.label
    },

    /**
     * 查询信息
    */
    searchInfo(){
      if (!this.searchInput) return this.$message.warning(`请先输入${this.select === "1" ? '地名' : '坐标'}`)
      if (!this.vectorLayer) {
        this.vectorLayer =  new VectorLayer({ source: new VectorSource(), style: comSymbol.getLineStyle(6, 'rgb(64, 158, 255)') })
        this.map.addLayer(this.vectorLayer)
      }
      console.log('查询的类型', this.select)
      if (this.select === '1') {
        this.searchAdress()
      } else {
        this.searchCoor()
      }
    },
    /**
     * 查询地址
    */
    searchAdress () {
      console.log('搜索')
      this.isloading = true
      let queryText = `ADDRESS like '%${this.searchInput}%'`
      let dataSetInfo = []
      let [name, type] = appconfig.initLayers.split("&&")
      let layer = mapUtil.getAllSubLayerNames(name, type)
      layer.sublayers.forEach(group => {
        group.sublayers.forEach(sub => {
          dataSetInfo.push({ name: sub.name.split('@')[0], label: sub.title })
        })
      })
      new iQuery({ dataSetInfo }).sqlQuery(queryText, this.maxLength).then(res => {
        this.isloading = false
        let resData = res.filter(item => item.type === "processCompleted" && item.result.featureCount !== 0)
        if (resData.length !== 0) {
          let data = []
          resData.forEach(result => {
            let feas = result.result.features.features
            data = [...data, ...feas]
          })
          this.resData = data.map(item => {
            this.lightInfo = this.searchInput
            let add = item.properties['ADDRESS']
            let geometry = item.geometry
            let mark = add.replace(this.searchInput, '<span class="light-text">地址:  ' + this.searchInput +'</span>')
            return { 
              name: item.properties['LNO'] || item.properties['SID'],
              type: item.properties['TYPE'], 
              mark, geometry, title: add }
          })
          this.searchData = [...this.resData]
          this.resData.length = this.currDataIndex
        } else this.$message.success('查询无数据')
      })
    },
    /**
     * 查询坐标
    */
    searchCoor () {
      let coors = this.searchInput.split(',')
      if (isNaN(coors[0] || isNaN(coors[1]))) {
        this.$message.warning('请输入正确的坐标格式，如：101.72,26.57')
      } else if (coors[0] > 180 || coors[1] > 90){
        this.$message.warning('请输入正确的坐标格式, 经度不超过180, 纬度不超过90')
      } else {
        let feature = new Feature({ geometry: new Point([Number(coors[0]), Number(coors[1])]) })
        feature.setStyle(new Style({ image: new Icon({ src: markImg, size:[200, 200], scale: 0.2 }) }))
        let textFea = new Feature({ geometry: new Point(coors) })
        textFea.setStyle(new Style({ text: new Text({ text: this.searchInput, offsetY: 40 })}))
        this.location(coors, [feature, textFea])
      }
    },
    setlocation (geometry, text) {
      let feature = new Feature({ geometry: new GeoJSON().readGeometry(geometry) })
      let center = new mapUtil().getCenterFromFeatures(feature)
      let textFea = new Feature({ geometry: new GeoJSON().readGeometry(geometry) })
      textFea.setStyle(new Style({ text: new Text({ text: text, offsetY: 40 })}))
      this.location(center, [feature, textFea])
    },
    /**
     * 定位
    */
    location (center, features) {
      this.vectorLayer.getSource().clear()
      this.vectorLayer.getSource().addFeatures(features)
      this.map.getView().setCenter(center)
      this.map.getView().setZoom(19)
    },
    /**
     * 清除定位坐标
    */
    clear () {
      this.vectorLayer && this.vectorLayer.getSource().clear()
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/basemapicon.scss";
  @import "~@/styles/mixin.scss";
  .box-address {
    height: 40px;
    font-size: 18px;
    font-weight: bold;
    line-height: 40px;
    letter-spacing: 3px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  /deep/ .light-text {
    color: rgb(45, 116, 231);
  }
  .searchTool{
  height: 40px;
  position: relative;
  float: left;
  width: 350px;
  /deep/ .selectInput{
    width: 90px;
  }
  /deep/ .el-input-group__prepend{
    background:white !important; 
  }
  /deep/ .el-input-group__append{
    background: #2D74E7 !important;
  }
  /deep/ .el-icon-search{
    color: white !important;
  }
  .res-box {
    box-sizing: border-box;
    width: 100%;
    max-height: 300px;
    background-color: rgb(246, 246, 246);
    padding: 10px;
    flex-direction: column;
    align-content: center;
    color:#000;
  }
  .i-scrollbar {
    overflow-y: scroll;
    overflow-x: hidden;
    // @include scrollBar;
  }
  .res-box-item {
    cursor: pointer;
    font-size: 15px;
    border-radius: 3px;
    background-color: #fff;
    height: 80px;
    line-height: 20px;
    box-sizing: border-box;
    padding: 10px 5px;
    margin: 5px 0;
    // &:hover {
    //   background-color: rgb(64, 158, 255);
    //   color: #fff;
    // }
  }
  .res-box-item-span {
    font-size: 13px;
    color:#bbb;
    max-width: 50%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  #searchBox .res-box-item:hover div {
    color: #fff;
  }
  #searchBox .res-box-item:hover{
    background: rgb(45, 116, 231);
    color: #fff;
  }
  #searchBox .res-box-item:hover div .res-box-item-span{
    color: #fff;
  }
  /deep/ #searchBox .res-box-item:hover div .light-text{
    color: #fff;
  }
}
</style>