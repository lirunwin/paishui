<template>
  <div class="page-container">
    <el-row type="flex" :gutter="10" class="detail">
      <el-col :span="7">
        <div class="query">
          <div class="form">
            <base-title>查看设置</base-title>
            <QueryForm
              @query="onQuery"
              :defaultQuery="{
                ...param,
                data: [
                  $moment()
                    .add(-7, 'day')
                    .startOf('day')
                    .toDate(),
                  $moment()
                    .endOf('day')
                    .toDate()
                ]
              }"
              :deviceTypes="deviceTypes"
              :points="points"
            />
          </div>
          <div class="map">
            <base-title>
              <el-row type="flex" justify="space-between" align="middle">
                <span>监测站点地图</span>
                <div class="map-checkbox">
                  <el-checkbox-group v-model="display">
                    <el-checkbox label="all">显示所有监测点</el-checkbox>
                    <el-checkbox label="selected">显示选中监测点</el-checkbox>
                  </el-checkbox-group>
                </div>
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
                <span style="margin-right: 40px">监测曲线</span>
                <div cla>
                  <el-checkbox-group v-model="merge">
                    <el-checkbox label="point">按监测点融合展示</el-checkbox>
                    <el-checkbox label="param">按指标融合展示</el-checkbox>
                  </el-checkbox-group>
                </div>
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
            <v-chart :options="lines" autoresize style="width: 100%" />
          </div>
          <pre>
            {{ JSON.stringify(detail, null, 2) }}
          </pre>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import QueryForm from './QueryForm.vue'
import BaseTitle from '../../components/BaseTitle/index.vue'
import {
  deviceTypesPage,
  fetchReportDetail,
  IDeviceTypeParam,
  IPoint,
  IReportDetail,
  IReportDetailQuery
} from '../../api'
import { defaultValuesForMonitorStandardLevel } from '@/utils/constant'

interface IDetail {
  info?: {
    id: string
    name: string
  }
  data?: {
    [x: string]: (IReportDetail & { siteId: string })[]
  }
}

const getDefaultMapData = ({ title, names }: { title: string; names?: string[] }) => {
  return {
    title: { text: title },
    tooltip: { trigger: 'axis' },
    calculable: true,
    yAxis: [{ type: 'value' }],
    xAxis: [{ type: 'category', boundaryGap: false }],
    dataZoom: [{ type: 'inside', start: 0, end: 100 }, { start: 0, end: 100 }],
    // legend: { data: names },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    }
  }
}

@Component({ name: 'ReportDetail', components: { QueryForm, BaseTitle } })
export default class ReportDetail extends Vue {
  @Prop({ type: Object, default: () => ({}) }) param!: IReportDetailQuery
  @Prop({ type: Boolean }) isActive!: boolean
  display: ('all' | 'selected')[] = ['all', 'selected']
  merge: ('point' | 'param')[] = ['point', 'param']

  get markLine() {
    return defaultValuesForMonitorStandardLevel.map(({ notes: name, color, codeValue }) => {
      return {
        yAxis: '1000',
        lineStyle: { color },
        label: {
          color: '#fff',
          formatter: '严重>1000',
          fontSize: 12,
          backgroundColor: color,
          padding: 5,
          distance: 1,
          position: 'insideEndTop',
          borderRadius: 2
        }
      }
    })
  }

  get lines() {
    /** 按监测点融合展示, 按指标融合展示: 多监测点, 多指标 */
    if (this.merge.includes('point') && this.merge.includes('param')) {
      return {
        ...getDefaultMapData({ title: '' }),
        dataset: this.detail
          .map(({ info: { name }, data }) => {
            return Object.keys(data).map((key) => {
              return {
                id: `${name}-${key}`,
                dimensions: ['scadaTime', 'itstrVal'],
                source: data[key]
              }
            })
          })
          .flat(),
        series: this.detail
          .map(({ info: { name }, data }) => {
            return Object.keys(data).map((key) => {
              return {
                name: `${name}-${key}`,
                type: 'line',
                symbol: 'none',
                smooth: true
              }
            })
          })
          .flat()
          .map((item, index) => {
            return { datasetIndex: index, ...item }
          })
      }
    } else if (this.merge.includes('point')) {
      // 按监测点融合展示: 多监测点, 1指标

      return {
        ...getDefaultMapData({ title: '' }),
        dataset: this.detail
      }
    } else if (this.merge.includes('param')) {
      // 按指标融合展示: 1监测点 多指标
      return {
        ...getDefaultMapData({ title: '' })
      }
    }
    return {
      // 1监测点 1指标
      ...getDefaultMapData({ title: '', names: [] }),
      series: [
        {
          name: '成交',
          type: 'line',
          smooth: true,
          itemStyle: { normal: { areaStyle: { type: 'default' } } },
          data: [10, 12, 21, 54, 260, 830, 710],
          markLine: {}
        },
        {
          name: '预购',
          type: 'line',
          smooth: true,
          itemStyle: { normal: { areaStyle: { type: 'default' } } },
          data: [30, 182, 434, 791, 390, 30, 10],
          markLine: {}
        },
        {
          name: '意向',
          type: 'line',
          smooth: true,
          itemStyle: { normal: { areaStyle: { type: 'default' } } },
          data: [1320, 1132, 601, 234, 120, 90, 20],
          markLine: {}
        }
      ]
    }
  }
  query = {}
  points: IPoint[] = []
  loading = false
  detail: IDetail[] = []

  deviceTypes: IDeviceTypeParam[] = []

  async doQuery() {
    this.loading = true
    try {
      const { result } = await fetchReportDetail(this.query)
      this.detail = Object.keys(result).map<IDetail>((key) => {
        const [id, name] = String(key).split('-')
        return {
          info: { id, name },
          data: result[key].reduce<IDetail['data']>((acc, current) => {
            const { deviceCode, itcdName, siteName: temp, ...rest } = current
            const [siteId, siteName] = String(temp).split('-')
            const dataKey = `${itcdName}`
            acc[dataKey] = [...(acc[dataKey] || []), { ...rest, deviceCode, itcdName, siteId, siteName }]
            return acc
          }, {})
        }
      })
      console.log(this.detail)
    } catch (error) {
      console.log(error)
    }
    this.loading = false
  }

  async getAllDeviceTypes() {
    try {
      const {
        result: { records }
      } = await deviceTypesPage({ current: 1, size: 9999999 })
      this.deviceTypes = records
    } catch (error) {
      console.log(error)
    }
  }

  preparing() {
    this.getAllDeviceTypes()
  }

  mounted() {
    this.preparing()
  }

  @Watch('isActive')
  refetchData(active: boolean) {
    if (active) {
      this.preparing()
    }
  }

  @Watch('param', { immediate: true })
  onQuery(param) {
    if (param.siteId) {
      this.query = { ...param }
      this.doQuery()
    }
  }

  @Watch('lines', { immediate: true })
  log(lines) {
    console.log(this.detail, lines)
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
    width: 100%;
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
    .map-checkbox {
      flex: 1 1 auto;
      text-align: right;
      >>> .el-checkbox-group {
        margin-left: 10px;
        display: inline-flex;
        flex-wrap: wrap;
        margin-top: -10px;
        margin-bottom: -10px;
        .el-checkbox {
          margin-right: 10px;
        }
      }
    }
  }
  .chart {
    padding-top: 0;
    .title {
      padding: 20px 0 1px;
      position: sticky;
      top: 0;
      background-color: #fff;
      z-index: 999;
    }
  }
}
</style>
