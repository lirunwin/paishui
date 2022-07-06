<template>
  <el-form class="form" ref="form" v-bind="{ labelWidth: 'auto', size: 'small' }" :model="formData">
    <el-form-item label="设备类型" prop="indicateNames">
      <el-select
        v-model="formData.deviceType"
        placeholder="请选择设备类型"
        size="small"
        clearable
        @change="onDeviceTypeChange"
      >
        <el-option v-for="param of deviceTypes" :value="String(param.id)" :key="param.id" :label="param.name">
          <span>{{ param.name }}</span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="监测站点" prop="siteId">
      <el-row type="flex">
        <el-col>
          <el-select
            v-model="formData.siteId"
            placeholder="请选监测点"
            size="small"
            clearable
            filterable
            multiple
            :loading="fetchingPoints"
            @change="onSiteIdChange"
          >
            <el-option v-for="point of points" :value="String(point.id)" :key="point.id" :label="point.name">
              <span>{{ `${point.name}${point.code ? ' | ' + point.code : ''}` }}</span>
            </el-option>
          </el-select>
        </el-col>
        <div>
          <el-button
            :type="!enable ? 'primary' : 'warning'"
            size="small"
            style="margin-left: 1em"
            @click="enable = !enable"
            >图上选点</el-button
          >
        </div>
      </el-row>
    </el-form-item>
    <el-form-item label="监测指标" prop="indicateNames">
      <el-select
        v-model="formData.indexCode"
        placeholder="请选择监测指标"
        size="small"
        clearable
        multiple
        filterable
        :loading="fetchingParamName"
      >
        <el-option v-for="name of thresholdNames" :value="name" :key="name" :label="name">
          <span>{{ name }}</span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="采集时间" prop="date">
      <el-date-picker
        v-model="formData.date"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        range-separator="~"
        style="width: 100%"
        format="yyyy-MM-dd"
        size="small"
        arrow-control
        clearable
        value-format="yyyy-MM-dd"
      />
    </el-form-item>
    <el-form-item label="统计方式" prop="type">
      <el-radio-group v-model="formData.status">
        <el-radio label="0">实时监测</el-radio>
        <el-radio label="1">按每15分钟均值</el-radio>
        <el-radio label="2">按每小时均值</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="统计图剔除" class="besides">
      <div style="padding-left: 10px">
        <el-row
          type="flex"
          :gutter="20"
          v-for="(row, rowIndex) of formData.besides"
          :key="rowIndex"
          class="besides-row"
          justify="end"
        >
          <span>
            <el-button
              size="small"
              type="warning"
              :icon="`el-icon-${rowIndex === formData.besides.length - 1 ? 'plus' : 'minus'}`"
              style="padding: 2px"
              @click="() => onAdd(rowIndex)"
            />
          </span>
          <el-col v-for="(col, colIndex) of row" :key="colIndex" class="besides-col">
            <el-row type="flex" :gutter="10">
              <el-checkbox size="small" v-model="col.checked" />
              <el-col>
                <el-input size="small" v-model="col.from" />
              </el-col>
              ~
              <el-col>
                <el-input size="small" v-model="col.to" />
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </el-form-item>
    <el-button
      type="primary"
      size="small"
      :loading="loading"
      :disabled="(formData.siteId && !formData.siteId.length) || (formData.indexCode && !formData.indexCode.length)"
      icon="el-icon-search"
      @click="onQuery"
      style="width: 100%"
    >
      查询
    </el-button>
  </el-form>
</template>

<script lang="ts">
import moment from 'moment'
import { Vue, Component, Prop, Watch, PropSync } from 'vue-property-decorator'
import { configuredPointParamPage, IDeviceType, IPointConnectDevice, IReportDetailQuery, pointsPage } from '../../api'
interface IBesides {
  from: string
  to: string
  checked: boolean
}

interface IFormData {
  besides: [IBesides, IBesides][]
  date: string[] | Date[]
  siteId: string[]
  indexCode: string[]
  status: string
  deviceType: number | string
}

const format = 'YYYY-MM-DD HH:mm:ss'
const getDefaultBeside = (): [IBesides, IBesides] => {
  return [
    { from: '', to: '', checked: true },
    { from: '', to: '', checked: true }
  ]
}

const getDefaultFormData = (): Partial<IFormData> => {
  return {
    besides: [getDefaultBeside()],
    date: [moment().add(-7, 'day').startOf('day').toDate(), moment().startOf('day').toDate()],
    siteId: [],
    indexCode: [],
    status: '0'
  }
}

@Component({ name: 'QueryForm' })
export default class QueryForm extends Vue {
  @Prop({ type: Boolean, default: false }) loading!: boolean
  @Prop({ type: Object, default: () => ({}) }) defaultQuery!: IReportDetailQuery
  @Prop({ type: Array, default: () => [] }) deviceTypes!: IDeviceType[]
  @PropSync('enablePointSelect', { type: Boolean, default: false }) enable!: boolean

  params = []

  formData: Partial<IFormData> = getDefaultFormData()
  thresholdNames: string[] = []
  points: IPointConnectDevice[] = []
  fetchingParamName: boolean = false
  fetchingPoints: boolean = false
  pointParamTimer = null

  onQuery() {
    const { date, siteId, indexCode, status } = this.formData
    const [startTime, endTime] = date || []
    const query = {
      siteId: siteId.join(),
      indexCode: indexCode.join(),
      status,
      startTime: moment(startTime).startOf('day').format(format),
      endTime: moment(endTime).startOf('day').format(format),
      besides: this.formData.besides
        .flat()
        .filter(({ checked, from, to }) => checked !== false && !(!from && !to))
        .map(({ from, to }) => [from, to])
    }

    // console.log(JSON.stringify(query, null, 2))
    this.$emit('query', query)
  }

  async onDeviceTypeChange(deviceTypeId: number | string) {
    if (!deviceTypeId) return
    this.fetchingPoints = true
    try {
      this.formData.siteId = []
      this.formData.indexCode = []
      const {
        result: { records }
      } = await pointsPage({ deviceTypeId, current: 1, size: 9999999 })
      this.points = records
      this.$emit('change:point', { selected: [], points: [...this.points] })
    } catch (error) {
      console.log(error)
    }
    this.fetchingPoints = false
  }

  onSiteIdChange(ids: (string | number)[], fallback?: Function) {
    if (this.pointParamTimer) clearTimeout(this.pointParamTimer)
    this.$emit('change:point', { selected: ids, points: [...this.points] })

    this.formData.indexCode = []
    const deviceIds = this.points
      .filter((item) => ids.map((i) => String(i)).includes(String(item.id)))
      .map((point) => {
        const { id } = (point.bindDevice || {}).deviceVo || {}
        return id
      })
      .join()

    this.pointParamTimer = setTimeout(async () => {
      this.fetchingParamName = true
      try {
        const {
          result: { records }
        } = await configuredPointParamPage({ deviceIds, current: 1, size: 9999999 })
        const names = [...new Set(records.map((item) => item.name))]
        fallback && fallback(names)
        this.thresholdNames = names
      } catch (error) {
        console.log(error)
      }
      this.fetchingParamName = false
    }, 500)
  }

  onAdd(rowIndex) {
    if (rowIndex === this.formData.besides.length - 1) {
      this.formData = { ...this.formData, besides: [...this.formData.besides, getDefaultBeside()] }
    } else {
      this.formData = { ...this.formData, besides: this.formData.besides.filter((_, index) => index !== rowIndex) }
    }
  }

  addPoint(id: string) {
    this.formData.siteId = [...this.formData.siteId, id]
  }
  removePoint(id: string) {
    this.formData.siteId = this.formData.siteId.filter((item) => item !== id)
  }

  @Watch('defaultQuery')
  async onDefaultQuery(query) {
    const { deviceType, siteId, startTime, endTime, status, indexCode } = query
    if (siteId) {
      if (deviceType) await this.onDeviceTypeChange(deviceType)
      this.formData = {
        deviceType: String(deviceType) || '',
        date: [startTime || '', endTime || ''],
        status: String(status || '') || '0',
        besides: [getDefaultBeside()]
      }
      await this.onSiteIdChange([String(siteId)], (names: string[] = []) => {
        this.formData = {
          ...this.formData,
          indexCode: indexCode ? [indexCode] : [...names]
        }
        this.onQuery()
      })

      this.formData = {
        ...this.formData,
        siteId: siteId ? [String(siteId)] : []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  .besides {
    /deep/ .el-input__inner {
      padding: 0 5px;
    }
    &-row {
      flex-wrap: wrap;
    }
    &-col {
      flex: 1 1 calc((100% - 20px) / 2);
      min-width: 180px;
      max-width: calc(100% - 20px);
    }
  }
  >>> .el-form-item {
    margin-bottom: 15px;
  }
}
</style>
