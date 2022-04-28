<template>
  <!-- 地图打印 -->
  <div class="panel-container i-scrollbar">
    <div class="op-box">
      <el-form label-width="auto">
        <div class="item-head" style="margin-top:0">基本信息</div>
        <el-form-item label="打印图层" style="margin:0">
          <el-select v-model="selectLayers" multiple value-key="layerUrl" size="small" placeholder="选择打印图层" @change="selectLayer"
                     style="width:100%">
            <el-option-group v-for="group in layersOptions" :key="group.label" :label="group.label">
              <el-option v-for="item in group.options" :key="item.layerUrl" :label="item.label" :value="item"></el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="布局模板">
          <el-select v-model="mapPrintPraram.template" size="small" placeholder="选择打印模板" style="width:100%">
            <el-option v-for="(item,index) in printTemplates" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="mapPrintPraram.title" size="small" placeholder="输入地图标题"></el-input>
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="mapPrintPraram.subTitle" size="small" placeholder="输入地图副标题"></el-input>
        </el-form-item>
        <el-form-item label="版权信息">
          <el-input v-model="mapPrintPraram.copyrightInfo" size="small" placeholder="输入版权信息"></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="mapPrintPraram.author" size="small" placeholder="输入作者名称"></el-input>
        </el-form-item>
        <div class="item-head">比例尺</div>
        <el-form-item label="文本">
          <el-input v-model="mapPrintPraram.scaleText" size="small" placeholder="输入比例尺文本"></el-input>
        </el-form-item>
        <el-form-item label="样式">
          <el-select v-model="mapPrintPraram.scaleStyle" size="small" placeholder="选择比例尺样式" style="width:100%">
            <el-option label="线状(line)" value="LINE"></el-option>
            <el-option label="条状(bar)" value="BAR"></el-option>
            <!-- <el-option label="bar_sub" value="BAR_SUB"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="段数">
          <!-- <el-input v-model="mapPrintPraram.intervals" size="small" placeholder="输入比例尺段数"></el-input> -->
          <el-input-number size="small" v-model="mapPrintPraram.intervals" placeholder="输入比例尺段数" controls-position="right" :step="1"
                           :min="3" :max="10" style="width:100%" @blur="intervalsChange">
          </el-input-number>
        </el-form-item>
        <el-form-item label="单位">
          <el-select v-model="mapPrintPraram.scaleUnit" size="small" placeholder="选择比例尺单位" style="width:100%">
            <el-option label="米" value="METER"></el-option>
            <!-- <el-option label="英里" value="FOOT"></el-option>
                    <el-option label="度" value="DEGREES"></el-option> -->
          </el-select>
        </el-form-item>
        <div class="item-head">导出选项</div>
        <el-form-item label="格式">
          <el-select v-model="mapPrintPraram.exportFormat" size="small" placeholder="选择导出格式" style="width:100%">
            <el-option label="PDF" value="PDF"></el-option>
            <el-option label="PNG" value="PNG"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分辨率">
          <!-- <el-input v-model="mapPrintPraram.exportDpi" size="small" placeholder="输入分辩率"></el-input> -->
          <el-input-number size="small" v-model="mapPrintPraram.exportDpi" placeholder="输入分辩率" controls-position="right" :step="10"
                           :min="96" :max="496" style="width:100%" @blur="dpiChange"></el-input-number>
        </el-form-item>
      </el-form>
    </div>
    <div class="op-box">
      <el-button type="primary" style="width:100%" size="small" @click="printMap" :loading="printStatus">
        <span v-if="printStatus==false">打印</span>
        <span v-else>正在打印中…</span>
      </el-button>
    </div>
  </div>
</template>

<script>

import { unByKey } from 'ol/Observable';
import { SuperMap, WebPrintingJobService } from '@supermap/iclient-ol'
import { appconfig } from 'staticPub/config'

export default {
  props: {
      data: Object
  },
  data() {
    return {
      txt: '',
      activeNames: ['1'],
      printStatus: false,
      printTemplates: [], // 模板
      layersOptions: [], // 图层
      webPrintingJobService: null,
      selectLayers: [], // 选择的图层
      mapPrintPraram: {
        template: 'default', // 模板
        title: '', //标题
        subTitle: '', // 副标题
        copyrightInfo: '', //版权
        author: '', // 作者
        scale: 0, // 小地图比例尺
        zoom: 0, // 地图缩放级别
        mapCenterPoint: '',//地图中心点
        scaleText: '比例尺', // 比例尺文本
        scaleStyle: 'BAR',// 比例尺样式
        intervals: 3, // 比例尺段数
        scaleUnit: 'METER',//单位
        exportFormat: 'PDF',//导出格式
        exportDpi: 96, //分辨率
        exportScale: 0, //导出比例尺
        legendItems: [], //图例
        layers: [],//图层
      },
      mapViewChangeEvent: null // 地图视图变化监听事件
    }
  },
  mounted() {
    // 初始化参数选项
    this.initMapPrintParam()
    // 地图监听中心点和比例尺
    this.initMapCenterAndScale()
    
  },
  // 组件销毁时
  destroyed() {
    unByKey(this.mapViewChangeEvent) // 销毁视图变化监听
  },
  methods: {
    // 初始化地图中心点比例尺
    initMapCenterAndScale () {
      let that = this
      let map = that.data.mapView;
      reset()
      this.mapViewChangeEvent = map.on('moveend', res => reset);

      function reset () {
        let center = map.getView().getCenter()
        that.mapPrintPraram.mapCenterPoint = center[0].toFixed(6) + '，' + center[1].toFixed(6)
        that.mapPrintPraram.zoom = map.getView().getZoom()
        // 分辨率
        const resolution = map.getView().getResolution()
        // 计算比例尺
        that.mapPrintPraram.exportScale = (3779.5 * resolution).toFixed(6)
        that.mapPrintPraram.scale = (3779.5 * resolution * 2).toFixed(6)
      }
    },
    handleChange(val) {
      console.log(val);
    },
    /**
     * 图层选项分组
     */
    layerGroup(groupName, layers) {
      if (layers.length > 0) {
        let layerGroupItem = { label: groupName, options: [] }
        layers.forEach(layer => {
          if (layer.hasOwnProperty('legendUrl')) {
            layerGroupItem.options.push({ label: layer.name, layerUrl: layer.url, legendUrl: layer.legendUrl })
          } else {
            layerGroupItem.options.push({ label: layer.name, layerUrl: layer.url })
          }
        });
        this.layersOptions.push(layerGroupItem)
      }
    },
    /**
     * 初始化地图打印参数
     */
    initMapPrintParam() {
      const iServerBaseUrl = appconfig.gisResource.printer.url
      this.webPrintingJobService = new WebPrintingJobService(iServerBaseUrl, { withCredentials: false })
      // 获取打印模板信息
      this.webPrintingJobService.getLayoutTemplates(e => {
        e.result.forEach(item => {
          if (item.templateName != 'A4_landscape_v2' && item.templateName != 'A3_mapcornermarks')
            this.printTemplates.push(item.templateName)
        })
      })
      // 初始化图层选项
      let layers = appconfig.gisResource['iserver_resource'].layers
      let baseLayers = layers.filter(layer => layer.parentname === "底图")
      let pipelineLayers = layers.filter(layer => layer.parentname === "管线")
      this.layerGroup('基础底图', baseLayers)
      this.layerGroup('管线图层', pipelineLayers)
    },
    /**
     * 选择打印图层
     */
    selectLayer(valueArray) {
      this.mapPrintPraram.layers = []
      this.mapPrintPraram.legendItems = []
      valueArray.forEach(item => {
        this.mapPrintPraram.layers.push({ "layerType": "TILE", "name": item.label, "url": item.layerUrl })
        if (item.hasOwnProperty('legendUrl')) {
          this.mapPrintPraram.legendItems.push({ "name": item.label, "picAsUrl": item.legendUrl })
        }

      });
    },
    /**
     * 打印地图
     */
    printMap() {
      this.printStatus = true // 执行状态
      console.log("参数：", this.mapPrintPraram.mapCenterPoint)
      let params = new SuperMap.WebPrintingJobParameters({
        "layoutOptions": {
          "templateName": this.mapPrintPraram.template,
          "title": this.mapPrintPraram.title,
          "subTitle": this.mapPrintPraram.subTitle,
          "author": this.mapPrintPraram.author,
          "copyright": this.mapPrintPraram.copyrightInfo,
          "northArrowOptions": {
            "picAsUrl": "file://NorthArrow.svg"
          },
          "scaleBarOptions": {
            "scaleText": this.mapPrintPraram.scaleText,
            type: this.mapPrintPraram.scaleStyle,
            intervals: this.mapPrintPraram.intervals,
            unit: this.mapPrintPraram.scaleUnit,
          },
          "legendOptions": {
            "title": "图例",
            "customItems": this.mapPrintPraram.legendItems
          },
          "littleMapOptions": {
            "center": {
              "x": this.mapPrintPraram.mapCenterPoint.split('，')[0],
              "y": this.mapPrintPraram.mapCenterPoint.split('，')[1]
            },
            // "scale": this.mapPrintPraram.scale,
            "layers": this.mapPrintPraram.layers
          }
        },
        "exportOptions": {
          "format": this.mapPrintPraram.exportFormat,
          "dpi": this.mapPrintPraram.exportDpi,
        },
        "content": {
          "type": "WEBMAP",
          "value": {
            "maxScale": "1:144447.927",
            "level": this.mapPrintPraram.zoom,
            "center": {
              "x": this.mapPrintPraram.mapCenterPoint.split('，')[0],
              "y": this.mapPrintPraram.mapCenterPoint.split('，')[1]
            },
            "layers": this.mapPrintPraram.layers,
            "description": "",
            "projection": "EPSG:4490",
            "minScale": "1:591658710.909",
            "title": "china_point",
            "version": "2.0.0"
          }
        }

      })
      console.log("校验参数", params)
      //校验参数
      this.filterEmptyData(params)

      this.webPrintingJobService.createWebPrintingJob(params, e => {
        if (e.result && e.result[0] && e.result[0].path) {
          this.webPrintingJobService.getPrintingJob(e.result[0].resourceConfigID, res => {
            if (res.result && res.result.status === 'FINISHED') {
              let link = document.createElement('a');
              link.href = res.result.result.downloadUrl;
              link.download = 'supermap-webprinting-report.pdf';
              link.click();
              // 释放内存
              window.URL.revokeObjectURL(link.href);
              this.printStatus = false // 执行状态
            } else {
              this.$message.error('打印失败！');
              this.printStatus = false // 执行状态
            }
          });
        } else {
          this.$message.error('打印失败！！');
          this.printStatus = false // 执行状态
        }

      });
    },
    /**
     * 校验打印参数
     */
    filterEmptyData(params) {
      for (let key in params) {
        if (params[key] === undefined) {
          delete params[key];
        } else if (typeof params[key] === 'object') {
          this.filterEmptyData(params[key]);
          if (JSON.stringify(params[key]) === '{}') {
            delete params[key];
          }
        }
      }
    },
    /**
     * 比例尺段数
     */
    intervalsChange() {
      if (!this.mapPrintPraram.intervals) {
        this.mapPrintPraram.intervals = 3
      }
    },
    /**
     * dpi分辨率
     */
    dpiChange(val, oldVal) {
      if (!this.mapPrintPraram.exportDpi) {
        this.mapPrintPraram.exportDpi = 96
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './css.scss';
@import "~@/styles/mixin.scss";
.i-scrollbar {
    overflow: auto;
  @include scrollBar;
}
</style>