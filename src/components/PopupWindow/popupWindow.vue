<template>
  <!-- 地图弹窗 -->
  <div id="popup-window" class="popup-window">
    <div class="window-header">
      <span class="popup-title" v-cloak v-if="flg">{{idStr}}</span>
      <span class="close-btn el-icon-close" title="关闭" @click="closePopup"></span>
    </div>
    <div class="window-body">
      <ul>
        <li v-for="item in propertiesData" :key="item.label">
          <span v-if="item[0]">{{ item[0].label }}: <i v-text="item[0].value"></i></span>
          <span v-if="item[0] && item[0].type && hasDetail"><el-link style="color: #80C3FF" @click="showDetail">详细信息...</el-link></span>
          <span v-if="item[1] && item[1].type && hasDetail"><el-link style="color: #80C3FF" @click="showDetail">详细信息...</el-link></span>
          <span v-if="item[1] && !item[1].type">{{ item[1].label }}: <i v-text="item[1].value"></i></span>
        </li>
      </ul>
    </div>
    <!-- 管线属性内容 -->
    <!-- <div class="window-body" v-if="flg&&infoObject.geometry.type=='LineString'"> 
      <ul>
        <li>
          <span>类型：<i v-text="infoObject.properties.TYPE"></i></span>
          <span>材质：<i v-text="infoObject.properties.MATERIAL"></i></span>

        </li>
        <li>
          <span>管径：<i v-text="infoObject.properties.PSIZE"></i></span>
          <span>位置：<i v-text="infoObject.properties.POINTPOSITION"></i></span>
        </li>
        <li>
          <span>起止埋深：<i
               v-text="Number(infoObject.properties.S_DEEP).toFixed(2)+' / '+Number(infoObject.properties.E_DEEP).toFixed(2)"></i></span>
          <span>起止高程：<i
               v-text="Number(infoObject.properties.IN_ELEV).toFixed(3)+' / '+Number(infoObject.properties.OUT_ELEV).toFixed(3)"></i></span>
        </li>
        <li>
          <span>埋设方式：<i v-text="infoObject.properties.EMBED"></i></span>
          <span>更新日期：<i v-text="infoObject.properties.UPDATETIME"></i></span>
        </li>
        <li>
          <span style="width:50%">权属单位：<i v-text="infoObject.properties.BELONG"></i></span>
          <span v-show="hasDetail"><el-link style="color: #80C3FF" @click="showDetail">详细信息...</el-link></span>
        </li>
      </ul>
    </div> -->
    <!-- 管点属性内容 -->
    <!-- <div class="window-body" v-if="flg&&infoObject.geometry.type=='Point'">
      <ul>
        <li>
          <span>类型：<i v-text="infoObject.properties.TYPE"></i></span>
          <span>使用状态：<i v-text="infoObject.properties.STATUS"></i></span>
        </li>
        <li>
          <span>地面高程：<i v-text="infoObject.properties.HIGH"></i></span>
          <span>位置：<i v-text="infoObject.properties.POINTPOSITION"></i></span>
        </li>
        <li>
          <span>井深：<i v-text="infoObject.properties.WELLDEEP"></i></span>
          <span>符号角度：<i v-text="infoObject.properties.ROTATION"></i></span>
        </li>
        <li>
          <span>地址：<i v-text="infoObject.properties.ADDRESS"></i></span>
          <span>更新日期：<i v-text="infoObject.properties.UPDATE_TIME"></i></span>
        </li>
        <li>
          <span style="width:100%">权属单位：<i v-text="infoObject.properties.BELONG"></i></span>
        </li>
      </ul>
    </div> -->
    <el-dialog width='80%' title="详细信息" v-if="formData.length !== 0" :visible.sync="showDialog" :append-to-body="true">
        <div class="container i-scrollbar">
          <el-form v-if="formData.length !== 0" :inline="true" class="">
              <el-form-item style="width:23%" label-width='120px' v-for="(item, index) in formData" :key="index" :label="item.label">
                  <el-input v-model="item.value" disabled></el-input>
              </el-form-item>
          </el-form>
      </div>
    </el-dialog>
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
import { fieldDoc, pointFieldDoc } from '@/views/zhpt/common/doc'
import { fieldsConfig } from './popupconfig'
import { mapUtil } from '../../views/zhpt/common/mapUtil/common';

export default {
  props: ['map'],
  data() {
    return {
      flg: false,
      infoObject: {},
      afterClosePopup: null,
      popup: null,
      hasDetail: false,
      showDialog: false,
      formData: [],
      propertiesData: []
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
     * 打开详情
     * */
    showDetail () {
        let { geometry, properties, tableName } = this.infoObject
        //
        console.log('详情')
        mapUtil.getFields(tableName).then(fieldsDoc => {
          let data = []
          for (let key in properties) {
              let fieldObj = fieldsDoc.find(field => field.field === key)
              if (fieldObj) {
                  data.push({ label: fieldObj.name, value: properties[key] })
              }
          }
          this.formData = data
          this.showDialog = true
        })
        
    },
    /**
     * 打开弹窗 
     * */
    showPopup(position, infoObject, afterClosePopup, hasDetail= false) {
      this.hasDetail = hasDetail
      this.afterClosePopup && this.afterClosePopup()
      this.afterClosePopup = afterClosePopup

      let showData = []
      this.infoObject = infoObject
      let type = infoObject.geometry.type
      let layerFieldConfig = fieldsConfig[infoObject['layerName']][type]
      let properties = infoObject.properties
      this.idStr = `设备编号： ${properties[layerFieldConfig['key']]}`

      let fields = layerFieldConfig['fields']
      for(let i = 0; (i <= fields.length); i+=2) {
        let prev = fields[i]
        let next = fields[i + 1]
        let prevData = formatData(prev, properties)
        let nextData = formatData(next, properties)
        showData.push([prevData, nextData])
      }
      this.propertiesData = showData
      console.log('信息', this.propertiesData)
      this.flg = true
      this.popup.setPosition(position)
      // 转换数据
      function formatData (data) {
        if (data) {
          let value = ''
          let { name, label, type } = data
          if (!type) {
            if (Array.isArray(name)) {
              value = name.map(f => properties[f])
              value = value.join('/')
            } else {
              value = properties[name]
            }
          } else {
            return { label, type }
          }
          return { label, value }
        } else {
          return null
        }
      }
    },
    /**
     * 关闭弹窗 
     * */
    closePopup() {
      this.popup && this.popup.setPosition(undefined);
      this.afterClosePopup && this.afterClosePopup()
      this.afterClosePopup = null
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
.container {
  height: 600px;
  width: 100%;
}
.i-scrollbar {
  overflow-y: scroll;
  overflow-x: hidden;
  @include scrollBar;
}
</style>