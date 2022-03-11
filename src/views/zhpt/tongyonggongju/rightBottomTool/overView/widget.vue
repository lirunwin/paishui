<template>
  <div class='overView' ref='overView'>
  </div>
</template>

<script>
// 右下角工具栏的鹰眼管理
import { OverviewMap } from 'ol/control';
import { appconfig } from 'staticPub/config' // 查找静态文件下的config 地图配置
import { TileSuperMapRest } from "@supermap/iclient-ol";
import TileLayer from "ol/layer/Tile";
export default {
  name: 'overView',
  components: {  },
  props: {
    map:null
  },
  data() {
    return {
    }
  },
  mounted() {
    this.initOverView();
  },
  methods: {
    /**
     * 创建鹰眼
    */
    initOverView(){
      let viewTileLayers = [
        new TileLayer({
          source: new TileSuperMapRest({
            url: appconfig.gisResource['tian_online_vector'].config[0].url,
            crossOrigin: 'anonymous'
          })
        })
      ]
      let temp= new OverviewMap({
        target: this.$refs['overView'],
        layers: viewTileLayers,
        collapseLabel: '',
        label: '',
        collapsed: true,
        tipLabel: '鹰眼'
      })
      this.map.controls.push(temp);
      this.$nextTick(e=>{
        // 更改鹰眼按钮图标
        this.$refs.overView.getElementsByTagName("button")[0].classList.add("iconfont","iconyy")
        // $('.ol-overviewmap button').addClass('iconfont iconyy');
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.overView {
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
  >>> .ol-overviewmap {
    background-color: #fff !important;
    left: unset !important;
    right: 40px !important;
    bottom: 0.1px !important;
    border-radius: 2px;
    button {
      cursor: pointer;
      &:hover {
        color: #006eb8;
      }
    }
  }
  >>> .ol-overviewmap .ol-overviewmap-map {
    height: 200px;
    width: 300px;
  }
  >>> .ol-overviewmap button {
    // display: none;
    background-color: #fff;
    color: #444444;
    border-radius: 2px;
    outline: none;
  }
  >>> .ol-overviewmap button {
    left: unset !important;
    bottom: 4px;
    right: -36px;
    position: absolute;
  }
}
</style>