<template>
  <div class="result-table">
    <!-- 数据表格 -->
    <div class="table-box">
      <el-table :data="tableData" stripe :header-cell-style="{fontSize: '14px', fontWeight:'600',background:'#eaf1fd',color:'#909399'}"
                style="width: 100%" height="100%" @row-click="rowClick">
        <el-table-column v-for="(item,index) in fieldKeys" :key="index" :prop="item.pipelineKey" :label="item.pipelineVal" align="center"
                         show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
    <!-- 表格分页 -->
    <div class="table-pagination">
      <el-pagination :current-page="pagination.current" :page-sizes="[20, 50, 100, 200]" :page-size="pagination.size"
                     layout="total, sizes, prev, pager, next" :total="pagination.total" @size-change="sizeChange"
                     @current-change="currentChange">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import 'ol/ol.css';
import { fromLonLat } from 'ol/proj';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import * as olExtent from 'ol/extent';
import { GeoJSON, WFS } from 'ol/format';
import Feature from 'ol/Feature';
import { Point, LineString, Polygon } from 'ol/geom';
import { Style, Circle, Icon, Fill, RegularShape, Stroke, Text } from 'ol/style';
import { getCenter } from 'ol/extent';
export default {
  props: ['data'],
  data() {
    return {
      allFeatures: [], // 所有数据
      tableData: [],
      fieldKeys: [],
      vecLayer: null,// 查询显示图层 
      pageNum: 0,//总页数
      totalPageData: [],
      pagination: {
        current: 1,
        total: 0,
        size: 20
      }
    }
  },
  watch: {
    '$store.state.map.halfPanels': function () {
      this.loadData()
    }
  },
  mounted() {
    this.loadData()
  },
  destroyed() {
    this.data.that.map.removeLayer(this.vecLayer)
  },
  methods: {
    /**
     * 加载数据
     */
    loadData() {
      for (let index in this.$store.state.map.halfPanels) {
        let item = this.$store.state.map.halfPanels[index]
        // if (item.com === 'queryResult') {
        //   // console.log('站点：', item)
        //   this.fieldKeys = item.param.fieldKeys
        //   let features = item.param.features
        //   this.allFeatures = features.map(item => {
        //     item.properties['geometry'] = item.geometry
        //     return item.properties
        //   })
        //   this.pagination = { current: 1, size: 20, total: this.allFeatures.length }
        //   // 表格加载
        //   this.calcPageData()
        //   break
        // }
        if (item.com === this.$store.state.map.halfP_editableTabsValue) {
          // console.log('站点：', item)
          this.fieldKeys = item.param.fieldKeys
          let features = item.param.features
          this.allFeatures = features.map(item => {
            item.properties['geometry'] = item.geometry
            return item.properties
          })
          this.pagination = { current: 1, size: 20, total: this.allFeatures.length }
          // 表格加载
          this.calcPageData()
          break
        }
      }
    },
    /**
     * 行点击事件
     */
    rowClick(row) {
      let popupPosition = [] // 弹窗位置
      let geometry = new GeoJSON().readGeometry(row.geometry)
      // 弹窗的信息
      let infoObject = {
        properties: row,
        dataType: { label: '' },
        geometry: row.geometry
      }

      let feature = new Feature({ geometry: geometry })
      if (geometry.getType() == 'LineString')
        popupPosition = getCenter(geometry.getExtent())
      else
        popupPosition = geometry.getCoordinates()
      infoObject.dataType.label = row.TYPENAME
      // 弹窗显示
      this.data.that.popupWindowShow(popupPosition, infoObject)
      setTimeout(() => {
        this.data.that.map.getView().fit(feature.getGeometry().getExtent(), { duration: 600 })
      }, 200);
    },
    /**
     * 计算页数
     */
    calcPageData() {
      // 计算页数(根据后台数据的条数和每页显示数量算出一共几页,得0时设为1)
      if (this.allFeatures.length >= 1) {
        this.pageNum = Math.ceil(this.allFeatures.length / this.pagination.size) || 1;
        console.log('总页数:', this.pageNum);
      }
      // 数据分组
      for (let i = 0; i < this.pageNum; i++) {
        // 每一页都是一个数组 形如 [['第一页的数据'],['第二页的数据'],['第三页数据']]
        // 根据每页显示数量 将后台的数据分割到 每一页,假设pageSize为5， 则第一页是1-5条，即slice(0,5)，第二页是6-10条，即slice(5,10)...
        this.totalPageData[i] = this.allFeatures.slice(this.pagination.size * i, this.pagination.size * (i + 1));
      }
      // 获取到数据后显示第一页内容,数组下标是从0开始的，这里一定要减去1，不然会丢失一组数据
      this.tableData = this.totalPageData[this.pagination.current - 1];
      console.log(this.tableData);
    },
    /**
     * 改变当前页
     */
    currentChange(current) {
      this.pagination.current = current;
      // 这里仍然不要忘记减去1
      this.tableData = this.totalPageData[current - 1];
    },
    /**
     * 改变每页数量
     */
    sizeChange(size) {
      this.pagination.size = size;
      // 重新计算页数并分组
      this.calcPageData()
    }
  }
}
</script>

<style lang="scss" scoped>
.result-table {
  width: 100%;
  height: 100%;
  position: relative;
  .table-box {
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 42px;
    >>> .el-table td,
    >>> .el-table th {
      padding: 6px 0 !important;
    }
  }
  .table-pagination {
    height: 32px;
    width: 100%;
    position: absolute;
    bottom: 5px;
  }
}
</style>