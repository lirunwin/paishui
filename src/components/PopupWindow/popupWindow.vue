<template>
  <!-- 地图弹窗 -->
  <div id="popup-window" class="popup-window">
    <div class="window-header">
      <span class="popup-title" v-cloak v-if="flg">{{infoObject.properties.TYPENAME+'('+infoObject.properties.SID+')'}}</span>
      <span class="close-btn el-icon-close" title="关闭" @click="closePopup"></span>
    </div>
    <!-- 管线属性内容 -->
    <div class="window-body" v-if="flg&&infoObject.geometry.type=='LineString'">
      <ul>
        <li>
          <span>类型：<i v-text="infoObject.properties.TYPENAME"></i></span>
          <span>材质：<i v-text="infoObject.properties.MATERIAL"></i></span>

        </li>
        <li>
          <span>管径：<i v-text="infoObject.properties.DIAMETER"></i></span>
          <span>所在道路：<i v-text="infoObject.properties.LANE_WAY"></i></span>
        </li>
        <li>
          <span>起止埋深：<i
               v-text="Number(infoObject.properties.START_DEPTH).toFixed(2)+' / '+Number(infoObject.properties.END_DEPTH).toFixed(2)"></i></span>
          <span>起止高程：<i
               v-text="Number(infoObject.properties.START_HEIGHT).toFixed(3)+' / '+Number(infoObject.properties.END_HEIGHT).toFixed(3)"></i></span>
        </li>
        <li>
          <span>埋设方式：<i v-text="infoObject.properties.BURYTYPE"></i></span>
          <span>修改日期：<i v-text="infoObject.properties.CHANGEDATE"></i></span>
        </li>
        <li>
          <span style="width:100%">权属单位：<i v-text="infoObject.properties.OWNERUNIT"></i></span>
        </li>
      </ul>
    </div>
    <!-- 管点属性内容 -->
    <div class="window-body" v-if="flg&&infoObject.geometry.type=='Point'">
      <ul>
        <li>
          <span>类型：<i v-text="infoObject.properties.TYPENAME"></i></span>
          <span>所属类型：<i v-text="infoObject.properties.SUBTYPE +' '+ infoObject.properties.ADJUNCT"></i></span>
        </li>
        <li>
          <span>地面高程：<i v-text="infoObject.properties.HEIGHT"></i></span>
          <span>所在道路：<i v-text="infoObject.properties.LANE_WAY"></i></span>
        </li>
        <li>
          <span>井深：<i v-text="infoObject.properties.WELLDEPTH"></i></span>
          <span>符号角度：<i v-text="infoObject.properties.PDIRECTION"></i></span>
        </li>
        <li>
          <span>埋深：<i v-text="infoObject.properties.DEPTH"></i></span>
          <span>修改日期：<i v-text="infoObject.properties.CHANGEDATE"></i></span>
        </li>
        <li>
          <span style="width:100%">权属单位：<i v-text="infoObject.properties.OWNERUNIT"></i></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Overlay, Feature } from 'ol';
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import Circle from "ol/style/Circle";
import GeoJSON from 'ol/format/GeoJSON';
export default {
  props: ['map'],
  data() {
    return {
      flg: false,
      infoObject: {},
      afterClosePopup: null,
      popup: null
    }
  },
  mounted() {
    // 地图弹窗
    this.popup = new Overlay({
      element: document.getElementById("popup-window"),
      //当前窗口可见
      autoPan: true,
      positioning: 'bottom-center',
      stopEvent: true,
      autoPanAnimation: { duration: 250 }
    });
    this.map.addOverlay(this.popup)
  },
  methods: {
    /**
     * 打开弹窗 
     * */
    showPopup(position, infoObject, afterClosePopup) {
      this.afterClosePopup = afterClosePopup
      this.infoObject = infoObject
      this.flg = true
      this.popup.setPosition(position)
    },
    /**
     * 关闭弹窗 
     * */
    closePopup() {
      this.popup && this.popup.setPosition(undefined);
      this.afterClosePopup && this.afterClosePopup()
    }
  }
}
</script>

<style lang="scss" scoped>
.popup-window {
  width: 380px;
  min-height: 155px;
  background-color: #fff;
  border: 1px solid #cccccc;
  z-index: 999;
  position: absolute;
  transform: translate(calc(-50% + 22.5px), calc(-100% - 26px));
  box-shadow: 0 2px 5px 0 #c1c1c1;
  box-sizing: border-box;
  &::before {
    content: '';
    display: block;
    width: 45px;
    height: 27px;
    background: url('./img/corner.png');
    position: absolute;
    bottom: -26px;
    left: 50%;
    transform: translate(-50%, 0);
  }
  .window-header {
    width: 100%;
    height: 35px;
    line-height: 35px;
    border-bottom: 1px dashed #d7d7d7;
    position: relative;
    font-size: 0;
    box-sizing: border-box;
    padding: 0 5px;
    .popup-title {
      font-weight: bold;
      color: #7c7070;
      font-size: 14px;
    }
    .close-btn {
      display: inline-block;
      position: absolute;
      right: 0;
      width: 35px;
      text-align: center;
      line-height: 35px;
      height: 100%;
      font-size: 14px;
      cursor: pointer;
      &:hover {
        background-color: #ebeef0;
        color: #f40;
      }
    }
  }
  .window-body {
    box-sizing: border-box;
    padding: 5px;
    ul {
      list-style: none;
      li {
        display: block;
        width: 100%;
        height: 28px;
        line-height: 28px;
        font-size: 0;
        > span {
          font-size: 12px;
          display: inline-block;
          width: 50%;
          height: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          i {
            font-style: normal;
            color: #0d89d1;
          }
        }
      }
    }
  }
}
</style>