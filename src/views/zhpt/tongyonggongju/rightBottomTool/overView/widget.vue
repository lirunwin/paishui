<template>
  <div class='overView' ref='overView'>
  </div>
</template>

<script>
// 右下角工具栏的鹰眼管理
import { OverviewMap } from 'ol/control';
import { appconfig } from 'staticPub/config' // 查找静态文件下的config 地图配置
import { TF_Layer } from '@/views/zhpt/common/mapUtil/layer'

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
      let vectorLayer = appconfig.gisResource['iserver_resource'].layerService.layers.find(item => item.name === '矢量底图')
      let viewTileLayer = new TF_Layer().createLayer(vectorLayer)
      let temp= new OverviewMap({
        target: this.$refs['overView'],
        layers: [viewTileLayer],
        collapseLabel: '',
        label: '',
        collapsed: true,
        tipLabel: '鹰眼'
      })
      this.map.controls.push(temp);
      this.$nextTick(e=>{
        // 更改鹰眼按钮图标
        // this.$refs.overView.getElementsByTagName("button")[0].classList.add("iconfont")
        $('.ol-overviewmap button').addClass('button-icon');
      })
    }
  }
}
</script>
<style lang='scss' scoped>
@import "~@/styles/basemapicon.scss";
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
    bottom: 6px;
    right: -33px;
    position: absolute;
  }
  >>> .button-icon {
    width: 16px;
    height: 16px;
    background-size: cover;
    position: relative;
    background-image: url('../../../../../assets/images/overview.png');
  }
}
</style>