<template>
  <div class="regionZoomIn ol-unselectable ol-control">
    <!-- <button class="iconfont iconfdsj" title="放大" @click="mapZoom(false)"></button> -->
    <!-- <button class="iconfont iconsxsj" title="缩小" @click="mapZoom(true)"></button> -->
      <svg-icon icon-class='zoomin' className='background-icon' @click="mapZoom(true)"></svg-icon>
  </div>
</template>

<script>
/**框选缩小*/ 
import DragZoom from 'ol/interaction/DragZoom'
import { always as conditionAlways } from 'ol/events/condition'
export default {
  name:"regionZoomIn",
  props: {
    map:null
  },
  data() {
    return {
      dragzoom: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      document.addEventListener('keyup', (e) => {
        if (e.keyCode == 27 && this.map.rightBottomToolDragzoom) {
          this.mapMove()  //事件名
        }
      })
    })
  },
  methods: {
    /**
     * 创建缩小控件
     */
    mapZoom(out) {
      this.$notify({
        title: '操作提示',
        message: '开启地图缩放，按ESC建退出',
        type: 'success',
        position: 'bottom-right'
      });
      $("#mapView").css({ cursor: "crosshair" })
      if (this.map.rightBottomToolDragzoom) {
        this.map.removeInteraction(this.map.rightBottomToolDragzoom);
        this.map.rightBottomToolDragzoom=null;
      }
      // 创建拉框控件
      this.map.rightBottomToolDragzoom = new DragZoom({
        condition: conditionAlways,
        out: out
      })
      this.map.addInteraction(this.map.rightBottomToolDragzoom)
      this.map.rightBottomToolDragzoom.setActive(true)
    },
    /**
     * 默认控制
     */
    mapMove() {
      $("#mapView").css({ cursor: "default" })
      if (this.map.rightBottomToolDragzoom) {
        this.map.removeInteraction(this.map.rightBottomToolDragzoom)
        this.map.rightBottomToolDragzoom = null;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/basemapicon.scss";
.regionZoomIn {
  margin-bottom:5px ;
  position: relative;
  float: left;
  height: 32px;
  width: 32px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  background-color: rgb(255, 255, 255);
  border-radius: 2px;
  padding: 0 !important;
  button {
    background-color: #fff !important;
    color: #444444;
    font-weight: 600;
    outline: none;
    cursor: pointer;
    width: 32px;
    height: 32px;
    margin: 0 !important;
    &:first-child {
      border-bottom: 1px solid #d4d4d4;
    }
    &:nth-child(2) {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
    &:hover {
      color: #006eb8;
    }
  }
}
</style>