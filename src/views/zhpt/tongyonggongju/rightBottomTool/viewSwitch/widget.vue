<template>
  <!-- 底图切换 -->
  <div class="viewSwitch">
    <el-popover v-model="visible" placement="left" width="auto" trigger="hover">
      <el-radio-group v-model="currentValue" @change="mapChange(currentValue)">
        <el-radio-button label="1">电子地图</el-radio-button>
        <el-radio-button label="2">影像图</el-radio-button>
        <!-- <el-radio-button label="2、3D联动"></el-radio-button> -->
      </el-radio-group>
      <div class="btn iconfont icondiqiu" slot="reference"></div>
    </el-popover>
  </div>
</template>

<script>
import { esriConfig, appconfig } from "staticPub/config";
export default {
  data() {
    return {
      currentValue:"1",
      visible: false
    }
  },
  props: {
    map:null
  },
  methods: {
    /**
     * 根据选择切换图层
     * 
    */
    mapChange(type) {
      let layers = this.map.getLayers().getArray() //所有的地图图层
      console.log("切换地图", layers)
      let tdtLayerInfo = appconfig.gisResource['iserver_resource'].layers[0];//天地图信息
      let yxtLayerInfo = appconfig.gisResource['iserver_resource'].layers[1];//影像图信息
      let tdtLayer = layers.find(item=>{return item.values_.name === tdtLayerInfo.name});//天地图图层
      let yxtLayer = layers.find(item=>{return item.values_.name === yxtLayerInfo.name});//影像图图层
      let tdtAction = true;
      let yxtAction = false;
      if (type=='1') {//切换电子地图
        tdtAction=true;
        yxtAction=false;
      } else {//切换影像图
        tdtAction=false;
        yxtAction=true;
      }
      this.layerControl(tdtLayer,tdtAction);
      this.layerControl(yxtLayer,yxtAction);
    },

  /**
   * 控制图层的显示与隐藏
   * @param layer 图层
   * @param action true显示，false隐藏
   * */ 
    layerControl(layer, action){
      if(layer){
        layer.setVisible(action);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.viewSwitch {
  margin-bottom:5px ;
  position: relative;
  float: left;
  height: 32px;
  width: 32px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  background-color: rgb(255, 255, 255);
  border-radius: 2px;
  padding: 0 !important;
  cursor: pointer;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  .btn {
    width: 100%;
    height: 100%;
    line-height: 32px;
    text-align: center;
    background-color: #fff;
    border-radius: 2px;
    font-size: 20px;
    color: #444444;
    cursor: pointer;
    &:hover {
      color: #006eb8;
    }
  }
}
.el-radio-button {
  width: 80px;
  height: 80px;
  cursor: pointer;
  margin: 3px;
  &:first-child {
    background: url('../../../../../assets/images/tdt.png') no-repeat;
    background-size: 100% 100%;
  }
  &:nth-child(2) {
    background: url('../../../../../assets/images/yxt.png') no-repeat;
    background-size: 100% 100%;
  }
  // &:last-child {
  //   background: url('../../../../public/images/kxc/23D.png') no-repeat;
  //   background-size: 100% 100%;
  // }
  >>> .el-radio-button__orig-radio {
    width: 100%;
    height: 100%;
  }
  >>> .el-radio-button__inner {
    width: 100%;
    height: 20px;
    line-height: 20px;
    border-radius: 0;
    padding: 0;
    border: none;
    position: absolute;
    bottom: 0;
    background-color: rgba(92, 92, 92, 0.76);
    -webkit-box-shadow: none;
    box-shadow: none;
    color: rgb(255, 255, 255);
  }
  &:hover {
    border: 2px solid #3385ff;
  }
}

/deep/.is-active .el-radio-button__inner {
  background-color: rgb(51, 133, 255) !important;
  color: rgb(255, 255, 255) !important;
}
</style>