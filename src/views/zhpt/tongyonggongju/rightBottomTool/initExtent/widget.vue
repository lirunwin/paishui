<template>
  <div class='initExtent iconfont icon-fang' title="默认范围" @click="initExtent" ref='initExtent'>
  </div>
</template>

<script>
// 右下角工具栏的默认范围
import { appconfig } from 'staticPub/config' // 查找静态文件下的config 地图配置
export default {
  name: 'initExtent',
  props: {
    map:null
  },
  data() {
    return {
    }
  },
  mounted() {

  },
  methods: {

    /**
     * 初始至配置中的默认范围
     */
    initExtent(){
      // 重置中心点位置为初始化位置
      this.map.getView().setZoom(appconfig.initZoom)
      this.map.getView().animate({
        center: [appconfig.initCenter.x,appconfig.initCenter.y],
        duration: 600
      });
    },

  }
}
</script>
<style lang='scss' scoped>
.initExtent.icon-fang:before {
    font-size: 20px;
    position: relative;
    left: 5.5px;
    top: 3.5px;
}
.initExtent {
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

  &:hover {
      color: #006eb8;
    }
}
</style>