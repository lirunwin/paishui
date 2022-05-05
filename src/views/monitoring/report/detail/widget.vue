<template>
  <div class="page-container">
    <el-row type="flex" :gutter="10" class="detail">
      <el-col :span="7">
        <div class="query">
          <div class="form">
            <base-title>查看设置</base-title>
            <query-form @query="onQuery" />
          </div>
          <div class="map">
            <base-title>
              <el-row type="flex" justify="space-between" align="middle">
                <span>监测站点地图</span>
                <el-checkbox-group v-model="display">
                  <el-checkbox label="all">显示所有监测点</el-checkbox>
                  <el-checkbox label="selected">显示选中监测点</el-checkbox>
                </el-checkbox-group>
              </el-row>
            </base-title>
          </div>
        </div>
      </el-col>
      <el-col :span="17">
        <div class="chart">
          <div class="title">
            <base-title>
              <el-row type="flex" align="middle">
                <span style="margin-right:40px;">监测曲线</span>
                <el-checkbox-group v-model="merge">
                  <el-checkbox label="point">按监测点融合展示</el-checkbox>
                  <el-checkbox label="param">按指标融合展示</el-checkbox>
                </el-checkbox-group>
              </el-row>
            </base-title>
          </div>
          <div style="padding: 10px 0">
            <!-- <el-row type="flex" justify="space-between">
              <span>某楼盘销售情况</span>
              <span>
                <el-button type="text" icon="el-icon-s-grid" />
                <el-button type="text" icon="el-icon-pie-chart" />
                <el-button type="text" icon="el-icon-data-analysis" />
                <el-button type="text" icon="el-icon-download" />
              </span>
            </el-row> -->
            <v-chart
              :options="lines"
              autoresize
              theme="ovilia-green"
              :loading-options="{
                text: 'Loading…',
                color: '#4ea397',
                maskColor: 'rgba(255, 255, 255, 0.4)'
              }"
              style="width:100%"
            />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import QueryForm from './QueryForm.vue'
import BaseTitle from '../../components/BaseTitle/index.vue'

@Component({ name: 'ReportDetail', components: { QueryForm, BaseTitle } })
export default class ReportDetail extends Vue {
  display = []
  merge = []
  onQuery(query) {
    console.log(query)
  }

  lines = {
    title: {
      text: '化学需氧量（单位：mg/L）'
      // subtext: '纯属虚构'
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(50,50,50,0.7)'
    },
    legend: {
      data: ['意向', '预购', '成交']
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    calculable: true,
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      }
    ],
    yAxis: [{ type: 'value' }],
    series: [
      {
        name: '成交',
        type: 'line',
        smooth: true,
        itemStyle: { normal: { areaStyle: { type: 'default' } } },
        data: [10, 12, 21, 54, 260, 830, 710]
      },
      {
        name: '预购',
        type: 'line',
        smooth: true,
        itemStyle: { normal: { areaStyle: { type: 'default' } } },
        data: [30, 182, 434, 791, 390, 30, 10]
      },
      {
        name: '意向',
        type: 'line',
        smooth: true,
        itemStyle: { normal: { areaStyle: { type: 'default' } } },
        data: [1320, 1132, 601, 234, 120, 90, 20],
        markLine: {
          symbol: 'none',
          silent: true,
          lineStyle: {
            type: 'dashed',
            color: '#ccc',
            width: 1
          },
          data: [
            {
              yAxis: '1000',
              lineStyle: { color: '#F65252' },
              label: {
                color: '#fff',
                formatter: '严重>1000',
                fontSize: 12,
                backgroundColor: '#F65252',
                padding: 5,
                distance: 1,
                position: 'insideEndTop',
                borderRadius: 2
              }
            },
            {
              yAxis: '800',
              lineStyle: { color: '#f25fff' },
              label: {
                color: '#fff',
                formatter: '中度>800',
                fontSize: 12,
                backgroundColor: '#f25fff',
                padding: 5,
                distance: 1,
                position: 'insideEndTop',
                borderRadius: 2
              }
            },
            {
              yAxis: '400',
              lineStyle: { color: '#E6A23C' },
              label: {
                color: '#fff',
                formatter: '轻度>400',
                fontSize: 12,
                backgroundColor: '#E6A23C',
                padding: 5,
                distance: 1,
                position: 'insideEndTop',
                borderRadius: 2
              }
            },
            {
              yAxis: '200',
              lineStyle: { color: '#67C23A' },
              label: {
                color: '#fff',
                formatter: '优质>200',
                fontSize: 12,
                backgroundColor: '#67C23A',
                padding: 5,
                distance: 1,
                position: 'insideEndTop',
                borderRadius: 2
              }
            }
          ]
        }
      }
    ]
  }
}
</script>

<style lang="scss" scoped>
.detail {
  position: relative;
  height: 100%;
  > div {
    position: relative;
    height: 100%;
  }
  .query,
  .chart {
    background-color: #fff;
    height: 100%;
    padding: 20px;
    overflow: hidden auto;
    @include base-scroll-bar();
  }
  .query {
    .map {
      margin-top: 20px;
      white-space: nowrap;
    }
  }
  .chart {
    padding-top: 0;
    .title {
      padding: 20px 0;
      position: sticky;
      top: 0;
      background-color: #fff;
      z-index: 999;
    }
  }
}
</style>
