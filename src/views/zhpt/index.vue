<template>
  <div
    id="viewDiv"
    v-loading="loading"
    :element-loading-text="loadText"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
  >
    <tf-dialog
      :show.sync="panels.tfDialog.Show"
      :hide.sync="panels.tfDialog.Hide"
      :set-size.sync="panels.tfDialog.setSize"
    />
    <el-container style="height: 100%; width: 100%">
      <el-container
        :style="{
          height: 'calc(100% - ' + footer_height + ')',
          width: '100%',
        }"
      >
        <el-main>
          <!-- <float-panels :data='FloatPanels' @handelClose='handelClose'></float-panels> -->
          <div
            id="antherPanel"
            ref="antP"
            style="
              width: 100%;
              display: none;
              width: calc(50% - 2px);
              height: 100%;
              float: left;
            "
          >
            <!-- <div class="qufen" style="left:calc(50% - 175px)"><span>副视图</span><span>主视图</span></div> -->
          </div>
          <div
            style="
              display: none;
              width: 4px;
              height: 100%;
              background: #ccc;
              z-index: 2;
              float: left;
              position: relative;
            "
          />
          <div id="mapView" class="mapView">
            <div
              id="any"
              ref="any"
              style="position: absolute; left: calc(50% - 250px); top: calc(50% - 150px);display:none;width:600px;border"
            >
              <div
                id="any_title"
                class="label"
                style="
                  width: 100%;
                  height: 40px;
                  background: rgb(45, 116, 231);
                  border-radius: 5px 5px 0px 0px;
                "
              >
                <div
                  class="label"
                  style="
                    float: left;
                    color: #fff;
                    font-size: 18px;
                    padding-left: 20px;
                    padding-top: 10px;
                  "
                >
                  分析结果
                </div>
                <span
                  class="label"
                  style="
                    float: right;
                    cursor: pointer;
                    color: #fff;
                    margin-right: 10px;
                    margin-top: 10px;
                  "
                  @click="closeAny"
                  ><i class="el-icon-close"
                /></span>
              </div>
              <div
                id="any_contant"
                style="
                  width: 100%;
                  height: 400px;
                  background: #fff;
                  border: 1px solid rgb(218, 218, 218);
                  border-radius: 0px 0px 5px 5px;
                "
              />
            </div>

            <!-- 左下角工具栏 -->
            <leftBottomTool
              :toolList="leftBottomTool.children"
              :map="view"
              v-if="
                leftBottomTool &&
                leftBottomTool.children &&
                leftBottomTool.children.length > 0
              "
            ></leftBottomTool>
            <!-- 右上角工具栏 -->
            <rightTopTool
              :toolList="rightTopTool.children"
              :map="view"
              v-if="
                rightTopTool &&
                rightTopTool.children &&
                rightTopTool.children.length > 0
              "
            ></rightTopTool>
            

            <!-- 视图工具 -->
            <!-- <WidgetGroup :map-view="view" :that="this" /> -->
            <!-- 测量工具 -->
            <!-- <MeasureTool :map-view="view" /> -->
            <!-- 查询 -->
            <!-- <QueryTool :map-view="view" :that="this" /> -->
            <!-- 鹰眼 -->
            <!-- <OverviewMap :map-view="view" /> -->
            <!-- 弹出框 -->
            <popupWindow v-if="view" ref="popupWindow" :map="view"></popupWindow>
          </div>
          <!-- 左上角工具栏 -->
          <leftTopTool
            :toolList="leftTopTool.children"
            :map="view"
            v-if="
              leftTopTool &&
              leftTopTool.children &&
              leftTopTool.children.length > 0
            "
          ></leftTopTool>
          <!-- 左下角工具栏 -->
          <leftBottomTool
            :toolList="leftBottomTool.children"
            :map="view"
            v-if="
              leftBottomTool &&
              leftBottomTool.children &&
              leftBottomTool.children.length > 0
            "
          ></leftBottomTool>
          <!-- 右上角工具栏 -->
          <rightTopTool
            :toolList="rightTopTool.children"
            :map="view"
            :rootPage='this'
            v-if="
              rightTopTool &&
              rightTopTool.children &&
              rightTopTool.children.length > 0
            "
          ></rightTopTool>
          <!-- 右下角工具栏 -->
          <rightBottomTool
            :toolList="rightBottomTool.children"
            :map="view"
            v-if="
              rightBottomTool &&
              rightBottomTool.children &&
              rightBottomTool.children.length > 0
            "
          ></rightBottomTool>
          <div v-show="labelShow" id="mapLabel">
            <span id="mapView_title">地图图例</span>
            <span
              id="mapView_close"
              ref="legend_close"
              title="收缩"
              @click="legendClick"
              >▼</span
            >
            <div id="mapView_legend" ref="legend" style="height: 350px" />
          </div>
          <!-- 鼠标位置 -->
          <!-- <MouseLocation :map-view="view" /> -->
          <!-- 快捷查询 -->
          <!-- <SimpleQueryTool :map-view="view" /> -->
          <float-panels :panels="FloatPanels" :data="panels" />
          <div id="map-index-floatPanels" ref="floatPanels" />
          <!-- width: side_width, -->
          <el-aside
            :style="{
              width: '480px',
              height: '570px',
              position: 'fixed',
              right: '85px',
              top: '120px',
              borderRadius: '5px',
            }"
          >
            <side-panels
              :panels="Panels"
              :data="panels"
              :side-width.sync="side_width"
              :panel-visible.sync="sidepanel_visible"
              @handelClose="handelClose"
            />
          </el-aside>
        </el-main>
      </el-container>
      <el-footer
        :style="{ height: footer_height, width: '100%', padding: '0px' }"
      >
        <half-panels
          :panels="HalfPanels"
          :data="panels"
          :footer-height.sync="footer_height"
          :default-height.sync="halfpanel_defaultHeight"
          :panel-visible.sync="halfpanel_visible"
          :fullpanel-visible.sync="fullpanel_visible"
          :style="{ display: fullpanel_visible ? 'none' : 'block' }"
          @handelClose="handelClose()"
        />
        <full-panels
          :panels="FullPanels"
          :data="panels"
          :footer-height.sync="footer_height"
          :panel-visible.sync="fullpanel_visible"
          :halfpanel-visible.sync="halfpanel_visible"
          :style="{ display: !fullpanel_visible ? 'none' : 'block' }"
          @handelClose="handelClose()"
        />
      </el-footer>
    </el-container>
  </div>
</template>
<script lang='ts'>
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import * as control from "ol/control";
import { Logo, TileSuperMapRest } from "@supermap/iclient-ol";
import axios from "axios";
import Comps from "@/layout/components/loadComps";
import {
  HalfPanels,
  FullPanels,
  FloatPanels,
  SidePanels,
} from "@/layout/components/index";
import { esriConfig, appconfig } from "staticPub/config";
import { loadModules } from "esri-loader";
import { loadCss } from "@/utils/loadResources";
import request from "@/utils/request";
import tfDialog from "./common/Dialog.vue";
import OverviewMap from "./tongyonggongju/overviewMap/widget.vue";
import Scalebar from "./tongyonggongju/scaleBar/widget.vue";
import MouseLocation from "./tongyonggongju/mouseLocation/widget.vue";
import WidgetGroup from "./tongyonggongju/widgetGroup/widget.vue";
import MeasureTool from "./tongyonggongju/measureTool/widget.vue";
import QueryTool from "./tongyonggongju/queryTool/widget.vue";
import SimpleQueryTool from "./tongyonggongju/simpleQueryTool/widget.vue";
import leftBottomTool from "./tongyonggongju/leftBottomTool/widget.vue";
import leftTopTool from "./tongyonggongju/leftTopTool/widget.vue";
import rightBottomTool from "./tongyonggongju/rightBottomTool/widget.vue";
import rightTopTool from "./tongyonggongju/rightTopTool/widget.vue";
import { extend } from "ol/array";
import popupWindow from "@/components/PopupWindow/popupWindow.vue"

// 投影
import {
  Projection,
  addProjection,
  get as getProjection,
  fromLonLat,
  transform,
} from "ol/proj";
import { register as olRegisterProj } from "ol/proj/proj4";
import proj4 from "proj4";

@Component({
  components: {
    HalfPanels,
    FullPanels,
    FloatPanels,
    SidePanels,
    tfDialog,
    Scalebar,
    OverviewMap,
    MouseLocation,
    WidgetGroup,
    MeasureTool,
    QueryTool,
    SimpleQueryTool,
    leftBottomTool,
    leftTopTool,
    rightBottomTool,
    rightTopTool,
    popupWindow
  },
})
export default class BaseMap extends Vue {
  // 空间参考
  projection = null;

  /**左上角工具栏列表*/
  leftTopTool = null;
  /**左下角工具栏列表*/
  leftBottomTool = null;
  /**右上角工具栏列表*/
  rightTopTool = null; //
  /**右下角工具栏列表*/
  rightBottomTool = null;
  @Prop(Object) params: object;
  view = null;
  Comps;
  show = true;
  themSrc = "";
  labelShow = false;
  side_width = "0%";
  footer_height = "0%";
  sidepanel_visible = false;
  floatpanel_visible = false;
  halfpanel_visible = false;
  fullpanel_visible = false;
  halfpanel_defaultHeight = "400px";
  legendHide = true;
  loading = true;
  loadText = "";
  panels = {
    mapView: this.view,
    that: this,
    // 当前激活的模块
    activeModel: null,
    tfDialog: { Show: null, Hide: null, setSize: null },
  };

  get Panels() {
    return this.$store.state.map.panels;
  }
  get FullPanels() {
    return this.$store.state.map.fullPanels;
  }
  get HalfPanels() {
    return this.$store.state.map.halfPanels;
  }
  get FloatPanels() {
    return this.$store.state.map.floatPanels;
  }
  get jumpText() {
    return this.$store.state.jumpText;
  }
  @Watch("FullPanels")
  FullPanelsChange() {
    this.show = true;
  }
  @Watch("loading")
  loadingChange(value) {
    if (value == false) {
      var str = this.$store.state.jumpText;
      if (!str) return;
      str = str.split(",");
      this.$store.dispatch("map/changeMethod", {
        pathId: str[0],
        widgetid: str[1],
        label: str[2],
      });
    }
  }
  @Watch("jumpText")
  jumpTextChange(n, o) {
    if (!n) return;
    n = n.split(",");
    this.$store.dispatch("map/changeMethod", {
      pathId: n[0],
      widgetid: n[1],
      label: n[2],
    });
  }
  created() {
    console.log("=====", this.Comps);
  }
  mounted() {
    loadCss(esriConfig.baseCssUrl); // 本地css资源
    // this.registerEPSG4490(); // 注册 4490 坐标系
    this.initConfig(); // 加载配置 ==> 加载地图
  }
  handelClose() {
    this.show = false;
  }
  async initMap() {
    let { initCenter, initZoom } = appconfig;

    let layerResource = appconfig.gisResource["iserver_resource"].layers;
    // layerInfo.url = "https://iserver.supermap.io/iserver/services/map-world/rest/maps/World";
    let map = new Map({
      target: "mapView",
      view: new View({
        center: initCenter,
        zoom: initZoom,
        projection: "EPSG:4326",
      }),
    });
    this.panels.mapView = this.view = map;

    let layer = this.addLayers(layerResource)

    this.loading = false;
    this.$nextTick(this.controlToolDisplay);
  }

  addLayers (layers) {
    layers.forEach(layerConfig => {
      let { name, url, parentname, id, visible = true } = layerConfig
      let layer = new TileLayer({
        name, parentname, id, visible,
        source: new TileSuperMapRest({
          url,
          crossOrigin: "anonymous", // 是否请求跨域操作
          wrapX: true,
        }),
        properties: {
          projection: "EPSG:4326",
        }
      } as any);
      this.view.addLayer(layer)
    })
  }

  legendClick() {
    this.legendHide = !this.legendHide;
    var whichP = [
      ["收缩", 350, "▼"],
      ["展开", 0, "▲"],
    ][this.legendHide ? 0 : 1];
    //@ts-ignore
    this.$refs.legend_close.title = whichP[0];
    //@ts-ignore
    this.$refs.legend.style.height = whichP[1] + "px";
    //@ts-ignore
    this.$refs.legend_close.innerHTML = whichP[2];
  }
  closeAny() {
    //@ts-ignore
    this.$refs.any.style.display = "none";
  }
  initConfig() {
    var index = appconfig.gisResource;
    var nextDo = () => {
      this.loadText = "地图加载中";
      this.$nextTick(this.initMap);
    };
    console.log("是否获取后台配置服务:" + appconfig.isloadServer);
    if (appconfig.isloadServer) {
      this.loadText = "服务加载中";
      request({ url: "/base/sourcedic/getTreeService", method: "get" }).then(
        (res1) => {
          if (res1.code == 1) {
            const res = res1.result;
            //通过访问天地图地址判断是否可以连接外网,先获取编码isOnlineAddress下的外网地址
            let onlineIndex = res.findIndex((item) => {
              return item.code == "isOnlineAddress";
            });
            if (onlineIndex != -1) {
              let isOnline = true;
              let onLineAddress = res[onlineIndex].child[0].cval;
              console.log("判断地址" + onLineAddress);
              axios
                .get(onLineAddress)
                .then(
                  (res) => {
                    if (res.status == 200) {
                      //正常返回
                      isOnline = true;
                    } else {
                      isOnline = false;
                    }
                  },
                  (error) => {
                    //异常返回
                    isOnline = false;
                  }
                )
                .catch((e) => {
                  isOnline = false; //异常返回
                })
                .finally(() => {
                  for (var i = 0, ii = res.length; i < ii; i++) {
                    var dr = res[i];
                    if (index.hasOwnProperty(dr.code)) {
                      //天地图相关的编码
                      let replaceItems = [
                        "tian_online_vector",
                        "tian_online_raster",
                        "tian_online_vector_label",
                        "tian_online_raster_label",
                      ];
                      //离线状况下替换天地图地址
                      if (!isOnline) {
                        if (
                          replaceItems.findIndex((valItem) => {
                            return valItem == dr.code;
                          }) != -1
                        ) {
                          let index2 = res.findIndex((item) => {
                            return item.code == dr.code + "_dl";
                          });
                          if (index2 != -1) {
                            let dataItem = res[index2];
                            var odr = index[dr.code];
                            odr.type = dataItem.type;
                            odr.groupname = dataItem.name;
                            if (dataItem.child) {
                              odr.config = dataItem.child.map((e) => {
                                return { name: e.name, url: e.cval };
                              });
                            }
                          }
                          continue;
                        }
                      }
                      var odr = index[dr.code];
                      odr.type = dr.type;
                      odr.groupname = dr.name;
                      if (dr.child) {
                        odr.config = dr.child.map((e) => {
                          return { name: e.name, url: e.cval };
                        });
                      }
                    }
                  }
                  nextDo();
                });
            }
          } else this.$message("服务加载失败 启用默认服务配置");
        }
      );
    } else nextDo();
  }

  /**
   * 根据权限控制地图四个角的工具栏的展示
   */
  controlToolDisplay() {
    //本功能必须在权限管理-系统管理-模块管理的系统新增中分配leftTopTool,leftBottomTool,rightTopTool,rightBottomTool四个类型
    //这四个类型分别对应地图工具栏的左上角,左下角,右上角,右下角
    //这四个工具栏不在左边的功能列表中展示（改设置在src\layout\components\Sidebar\index.vue中）
    if (
      this.$store.state &&
      this.$store.state.routeSetting &&
      this.$store.state.routeSetting.routes
    ) {
      const allModel = this.$store.state.routeSetting.routes; //获取所有功能
      /**工具栏识别的字符集合*/
      const toolBoxList = [
        "leftTopTool",
        "leftBottomTool",
        "rightBottomTool",
        "rightTopTool",
      ];
      const toolcomponentList = {
        leftTopTool,
        leftBottomTool,
        rightTopTool,
        rightBottomTool,
      };
      //根据模块管理将组件注入
      allModel.forEach((item) => {
        let index = toolBoxList.findIndex((val) => {
          return val == item.type;
        });
        if (index != -1) {
          this[item.type] = item || [];
          let temp = this.getComponents(item.type);
          temp.forEach((item2) => {
            toolcomponentList[item.type]["components"][item2.name] =
              item2.component;
          });
        }
      });
    }
  }

  /**
   * 获取指定层级下面的组件
   * @param typeString 指定层级的名称
   * */
  getComponents(typeString) {
    let temp = this.$store.state.routeSetting.addRoutes.find((val) => {
      return val.name && val.name == typeString;
    });
    return temp.children || [];
  }
}
</script>
<style lang="scss" scoped>
#viewDiv {
  position: absolute;
  margin: 0px auto;
  width: calc(100% - 0px);
  height: 100%;
  .el-main {
    padding: 0px;
    // position: absolute;
  }
  .mapView {
    position: relative;
    height: 100%;
    width: 100%;
    /deep/ .ol-zoom {
      display: none !important;
    }
    /deep/ .ol-attribution {
      display: none !important;
    }
  }
}
.close {
  position: absolute;
  right: 0;
  cursor: pointer;
}
#mapLabel {
  background: #fffc;
  position: absolute;
  bottom: 30px;
  left: 10px;
  padding: 5px;
  #mapView_legend {
    display: flex;
    width: 360px;
    flex-direction: column;
    flex-wrap: wrap;
    margin-top: 4px;
    overflow: hidden hidden;
    transition: 0.4s;
    >>> div {
      padding: 2px;
      img {
        width: 18px;
        height: 18px;
      }
      span {
        padding-left: 3px;
        font-size: 12px;
      }
    }
  }
  #mapView_title {
    font-size: 15px;
    font-weight: bold;
    letter-spacing: 1px;
    border-left: 3px solid #2d74e7;
    padding-left: 4px;
  }
  #mapView_close {
    float: right;
    color: #2d74e7;
    font-weight: bold;
    cursor: pointer;
    user-select: none;
  }
}
.qufen {
  position: absolute;
  top: 0px;
  background: chartreuse;
  padding: 5px;
}
#antherPanel::after {
  content: "副视图  主视图";
  border-radius: 0px 0px 5px 5px;
  border: 1px solid #2d74e7;
  background: #ecf2ffcc;
  position: absolute;
  top: -1px;
  z-index: 1;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  text-align: center;
  padding: 10px 0px;
  display: block;
  letter-spacing: 1px;
}
#map-index-floatPanels {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}
#map-index-floatPanels >>> .floatBox {
  pointer-events: all;
  white-space: nowrap;
  position: absolute;
  background: #fff;
  transform: translate(-50%, calc(-100% - 37px));
  border-radius: 7px;
  padding: 8px 8px 2px 8px;
  box-shadow: 0px 6px 23px #afafaf;
  .widgets-scadaLayer-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 6px;
    span {
      line-height: 20px;
      letter-spacing: 1px;
    }
  }
  .widgets-scadaLayer-box {
    max-height: 69px;
    overflow: hidden;
    transition: 0.6s;
    padding-top: 8px;
    border-top: 1px solid #e0e0e0;
    div {
      line-height: 20px;
      font-size: 14px;
      display: flex;
      cursor: pointer;
      &:hover {
        background: #000;
        color: #eee;
        .scadaLayer-float-name {
          color: #eee;
        }
        .scadaLayer-float-value {
          color: #eee;
        }
      }
      .scadaLayer-float-name {
        color: #373737;
        flex: 1;
        &::after {
          content: "：";
        }
      }
      .scadaLayer-float-value {
        color: #2d74e7;
        font-weight: bold;
        margin-left: 8px;
        animation: mymove 0.8s;
        border-radius: 3px;
      }
      // .scadaLayer-float-unit {
      // }
      .scadaLayer-float-arrow2::after {
        content: "↑";
        color: #f56c6c;
        animation: mymove 0.8s;
      }
      .scadaLayer-float-arrow0::after {
        content: "↓";
        color: #67c23a;
        animation: mymove 0.8s;
      }
      .scadaLayer-float-arrow1::after {
        content: "-";
        color: #909399;
        animation: mymove 0.8s;
      }
    }
  }
  &::after {
    content: "";
    width: 0;
    height: 0;
    border-top: 9px solid #fff;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    position: absolute;
    left: calc(50% - 9px);
    bottom: -9px;
  }
  &:hover {
    z-index: 1;
    .widgets-scadaLayer-box {
      max-height: 500px;
    }
  }
  @keyframes mymove {
    from {
      background: rgb(158, 54, 153);
      color: #fff;
    }
    to {
      background: #fff0;
      color: #2d74e7;
    }
  }
}
</style>
