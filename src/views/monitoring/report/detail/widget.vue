<template>
  <tf-page :isActive="isActive">
    <el-row type="flex" :gutter="10" class="detail">
      <el-col :span="7">
        <div class="query">
          <div class="form">
            <tf-title>查看设置</tf-title>
            <QueryForm
              ref="form"
              @query="onQuery"
              :defaultQuery="defaultQuery"
              :deviceTypes="deviceTypes"
              @change:point="onPointChange"
              :loading="loading"
              :enablePointSelect.sync="enablePointSelect"
              :selected="selected"
            />
          </div>
          <div class="map-container">
            <tf-title>
              <span>监测站点地图</span>
              <template v-slot:append>
                <el-checkbox-group v-model="display">
                  <el-checkbox label="all">显示所有监测点</el-checkbox>
                  <el-checkbox label="selected">显示选中监测点</el-checkbox>
                </el-checkbox-group>
              </template>
            </tf-title>
            <div class="map">
              <Map
                :enable="enablePointSelect"
                :points="points"
                :display="{ all: display.includes('all'), selected: display.includes('selected') }"
                @change="onPointSelect"
              />
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="17">
        <div class="chart">
          <div class="title">
            <tf-title>
              <span style="margin-right: 40px">监测曲线</span>
              <template v-slot:append>
                <el-checkbox-group v-model="merge">
                  <el-checkbox label="point">按监测点融合展示</el-checkbox>
                  <el-checkbox label="param">按指标融合展示</el-checkbox>
                </el-checkbox-group>
              </template>
            </tf-title>
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
              v-for="(line, index) of lines"
              :options="line"
              :key="index"
              autoresize
              style="width: 100%; margin-top: 20px"
            />
          </div>
        </div>
      </el-col>
    </el-row>
  </tf-page>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import QueryForm from './QueryForm.vue'
import {
  deviceTypesPage,
  fetchReportDetail,
  fetchReportDetailThreshold,
  getPoint,
  IDeviceTypeParam,
  IPointConnectDevice,
  IReportDetail,
  IReportDetailQuery,
  IReportDetailThreshold,
  getDictKeys,
  IDictionary
} from '../../api'
import { monitorStandardLevelKey } from '@/utils/constant'
import Map from './Map.vue'
import { groupBy, keyBy } from 'lodash'
interface IDetail {
  info?: {
    id: string
    name: string
  }
  data?: {
    [x: string]: (IReportDetail & { siteId?: string })[]
  }
}

type IQuery = Partial<Record<'siteId' | 'indexCode' | 'status' | 'startTime' | 'endTime', string>>
interface IDefaultQuery {
  siteId?: string[]
  indexCode?: string
  startTime?: Date
  endTime?: Date
  status?: string
  deviceType?: string | number
}

const getDefaultMapData = ({ title }: { title: string; names?: string[] }, pointName?: string, paramName?: string) => {
  return {
    title: { text: title },
    tooltip: { trigger: 'axis' },
    calculable: true,
    xAxis: [{ type: 'category', boundaryGap: false }],
    yAxis: [{ type: 'value', min: ({ min }) => min }],
    dataZoom: [
      { type: 'inside', start: 0, end: 100 },
      { start: 0, end: 100 }
    ],
    legend: { show: true },
    toolbox: {
      show: true,
      feature: {
        // mark: { show: true },
        // dataView: { show: true, readOnly: false },
        // magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    }
  }
}

const dateKey = 'scadaTime'
const valueKey = 'itstrVal'

interface ISelectedPoint extends IPointConnectDevice {
  selected?: boolean
}

interface IKeyedDictonary {
  [x: string]: IDictionary
}

@Component({ name: 'ReportDetail', components: { QueryForm, Map } })
export default class ReportDetail extends Vue {
  @Prop({ type: Object, default: () => ({}) }) param!: IReportDetailQuery
  @Prop({ type: Boolean }) isActive!: boolean
  display: ('all' | 'selected')[] = ['all', 'selected']
  merge: ('point' | 'param')[] = ['point']
  besides: number[][] = []
  query: IQuery = {}
  points: ISelectedPoint[] = []
  loading = false
  detail: IDetail[] = []
  enablePointSelect: boolean = false
  $refs!: { form: QueryForm }

  deviceTypes: IDeviceTypeParam[] = []

  selected: string[] = []

  thresholds: {
    [x: string]: {
      [x: string]: (IReportDetailThreshold & { unit?: string })[]
    }
  } = {}
  levelsAndColors: { levels: IKeyedDictonary; colors: IKeyedDictonary } = { levels: {}, colors: {} }

  get markLine() {
    return Object.keys(this.thresholds).reduce((thresholds, pointName) => {
      thresholds[pointName] = Object.keys(this.thresholds[pointName]).reduce((acc, paramName) => {
        acc[paramName] = this.thresholds[pointName][paramName].map((item) => {
          console.log(item)
          const { levelName, level, isSpecial, specialVal, lower, lowerTolerance, upper, upperTolerance, unit } = item
          const { notes: color } = this.levelsAndColors.colors[String(level)] || {}
          const value = lower
          return {
            yAxis: String(isSpecial ? specialVal : value),
            lineStyle: { color },
            label: {
              color: '#fff',
              formatter: `${levelName}>${lower} ${unit}`,
              fontSize: 12,
              backgroundColor: color,
              padding: 5,
              distance: 1,
              position: 'insideEndTop',
              borderRadius: 2
            }
          }
        })
        return acc
      }, {})
      return thresholds
    }, {})
    // return defaultValuesForMonitorStandardLevel.map(({ notes: name, color, codeValue }) => {
    //   return {
    //     yAxis: '1000',
    //     lineStyle: { color },
    //     label: {
    //       color: '#fff',
    //       formatter: '严重>1000',
    //       fontSize: 12,
    //       backgroundColor: color,
    //       padding: 5,
    //       distance: 1,
    //       position: 'insideEndTop',
    //       borderRadius: 2
    //     }
    //   }
    // })
  }

  filter(data: (IReportDetail & { siteId?: string })[]): (IReportDetail & { siteId?: string })[] {
    let temp = [...data].filter((item) => !!item)
    this.besides.forEach((item) => {
      let [from, to] = item
      from = from ? Number(from) : -Infinity
      to = to ? Number(to) : Infinity
      if (!(!to && !from)) {
        temp = temp.filter((item) => {
          const value = Number(item[valueKey])
          // console.log(
          //   [Number(item[valueKey]), Number(item[valueKey])],
          //   [from, to],
          //   [Number(item[valueKey]) > Number(from), Number(item[valueKey]) <= Number(to)]
          // )
          return !(value > from && value <= to)
        })
      }
    })
    return temp
  }

  get lines() {
    const mapData = this.detail

    /** 按监测点融合展示, 按指标融合展示: 多监测点, 多指标 */
    if (this.merge.includes('point') && this.merge.includes('param')) {
      return [
        {
          ...getDefaultMapData({ title: '' }),
          dataset: mapData
            .map(({ info: { name }, data }) => {
              return Object.keys(data).map((key) => {
                return {
                  id: `${name}-${key}`,
                  dimensions: [dateKey, valueKey],
                  source: this.filter(
                    data[key].map((item) => {
                      if (!item) return item
                      const { [valueKey]: val, ...rest } = item
                      return { ...rest, [valueKey]: val }
                    })
                  )
                }
              })
            })
            .flat(),
          series: mapData
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
      ]
    } else if (this.merge.includes('point')) {
      // 按监测点融合展示: 多监测点, 1指标
      const grouped = mapData.reduce((acc, current) => {
        const {
          info: { name },
          data
        } = current
        const second = Object.keys(data).reduce((acc, key) => {
          const dataset = {
            name: `${name}-${key}`,
            source: this.filter(
              data[key].map((item) => {
                if (!item) return item
                const { [valueKey]: val, ...rest } = item
                return { ...rest, [valueKey]: val }
              })
            ),
            dimensions: [dateKey, valueKey]
          }
          return { ...acc, [key]: !acc[key] ? [dataset] : [...acc[key], dataset] }
        }, {})
        const temp = { ...acc }
        Object.keys(second).forEach((key) => {
          temp[key] = temp[key] ? [...temp[key], ...second[key]] : second[key]
        })
        return temp
      }, {})
      return Object.keys(grouped).map((key) => {
        return {
          ...getDefaultMapData({ title: key }),
          dataset: this.filter(grouped[key]),
          series: grouped[key].map(({ name }, index) => {
            return {
              name,
              type: 'line',
              symbol: 'none',
              smooth: true,
              datasetIndex: index
            }
          })
        }
      })
    } else if (this.merge.includes('param')) {
      // 按指标融合展示: 1监测点 多指标
      return mapData.map(({ info: { name }, data }) => {
        return {
          ...getDefaultMapData({ title: name }),
          dataset: Object.keys(data).map((key) => ({
            source: this.filter(
              data[key].map((item) => {
                if (!item) return item
                const { [valueKey]: val, ...rest } = item
                return { ...rest, [valueKey]: val }
              })
            ),
            dimensions: [dateKey, valueKey]
          })),
          series: Object.keys(data).map((key, index) => {
            return {
              name: key,
              type: 'line',
              symbol: 'none',
              smooth: true,
              datasetIndex: index
            }
          })
        }
      })
    }
    // 1监测点 1指标

    return mapData
      .map(({ info: { name: pointName }, data }) => {
        return Object.keys(data).map((paramName) => {
          return {
            ...getDefaultMapData({ title: `${pointName}-${paramName}` }, pointName, paramName),
            dataset: {
              source: this.filter(
                data[paramName].map((item) => {
                  if (!item) return item
                  const { [valueKey]: val, ...rest } = item
                  return { ...rest, [valueKey]: val }
                })
              ),
              dimensions: [dateKey, valueKey]
            },
            series: {
              name: paramName,
              type: 'line',
              symbol: 'none',
              smooth: true,
              markLine: this.markLine[pointName][paramName]
            }
          }
        })
      })
      .flat()
  }

  onPointSelect(point: ISelectedPoint) {
    const { selected, id } = point || {}
    const { addPoint, removePoint } = this.$refs.form
    this.points = [...this.points.filter((item) => String(item.id) !== String(id)), { ...point, selected: !selected }]
    selected ? removePoint(String(id)) : addPoint(String(id))
  }

  async doQuery() {
    this.loading = true
    try {
      const { result } = await fetchReportDetail(this.query)
      this.detail = Object.keys(result).map<IDetail>((key) => {
        const [id, name] = String(key).split('-')
        return {
          info: { id, name },
          data: result[key].reduce<IDetail['data']>((acc, current) => {
            if (!current) {
              return acc
            }
            const { itcdName, siteName: temp, ...rest } = current
            const [siteId, siteName] = String(temp).split('-')
            const dataKey = `${itcdName}`
            acc[dataKey] = [...(acc[dataKey] || []), { ...rest, itcdName, siteId, siteName }]
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

  async fetchReportDetailThreshold(ids: string) {
    const { result } = await fetchReportDetailThreshold(ids)
    if (result) {
      this.thresholds = Object.keys(result).reduce((acc, key) => {
        const [id, pointName] = key.split('-')
        acc[pointName] = groupBy(result[key], 'paraName')
        return acc
      }, {})
    }
  }

  pointChangeTime: number = null

  onPointChange({ selected = [], points = [] }: { selected: string[]; points: ISelectedPoint[] }) {
    if (this.pointChangeTime) clearTimeout(this.pointChangeTime)
    this.pointChangeTime = window.setTimeout(() => {
      this.points = points.map((item) => ({ ...item, selected: selected.includes(String(item.id)) }))
      selected.length && this.fetchReportDetailThreshold(selected.join())
    }, 600)
  }

  async getLevelsAndLevelColors() {
    const [levels, colors] = await Promise.all([
      getDictKeys(),
      getDictKeys(`${monitorStandardLevelKey.codeKey}_colors`)
    ])
    this.levelsAndColors = {
      levels: keyBy(levels as IDictionary[], 'codeValue'),
      colors: keyBy(colors as IDictionary[], 'codeValue')
    }
  }

  preparing() {
    this.getAllDeviceTypes()
    this.getLevelsAndLevelColors()
  }

  mounted() {
    this.preparing()
  }

  onQuery(query) {
    const { besides, ...rest } = query
    this.query = rest
    this.besides = [...besides]
    this.doQuery()
  }

  defaultQuery: IDefaultQuery = {}

  @Watch('param', { immediate: true })
  async onQueryPropsChange(param: Omit<IDefaultQuery, 'siteId'> & { siteId?: string }) {
    const { siteId, indexCode } = param
    if (siteId) {
      const { result } = (await getPoint(siteId)) || {}
      this.fetchReportDetailThreshold(siteId)
      const { type: deviceType } = (result.bindDevice || {}).deviceVo

      const startTime = this.$moment().add(-7, 'day').startOf('day')

      const endTime = this.$moment().startOf('day')

      this.defaultQuery = {
        deviceType,
        siteId: String(siteId || '').split(','),
        startTime: startTime.toDate(),
        endTime: endTime.toDate(),
        indexCode
      }
    }
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
    display: flex;
    flex-direction: column;
    .map-container {
      margin-top: 20px;
      white-space: nowrap;
      flex: 1 0 360px;
      display: flex;
      height: 360px;
      flex-direction: column;
      > .map {
        flex: 1 1 auto;
      }
    }
    .map-checkbox {
      flex: 1 1 auto;
      text-align: right;
      >>> .el-checkbox-group {
        margin-left: 10px;
        display: inline-flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        .el-checkbox {
          margin-right: 10px;
          flex: 1;
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
