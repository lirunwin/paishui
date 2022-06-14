<template>
  <el-form class="form" ref="form" v-bind="{ labelWidth: '6em', size: 'medium' }" :model="formData">
    <el-form-item label="设备类型" prop="indicateNames">
      <el-select
        v-model="formData.deviceType"
        placeholder="请选择设备类型"
        size="small"
        clearable
        @change="onDeviceTypeChange"
      >
        <el-option v-for="param of deviceTypes" :value="param.id" :key="param.id" :label="param.name" />
      </el-select>
    </el-form-item>
    <el-form-item label="监测站点" prop="siteId">
      <el-row type="flex">
        <el-col>
          <el-select v-model="formData.siteId" placeholder="请选监测点" size="small" clearable multiple>
            <el-option v-for="point of points" :value="point.id" :key="point.id" :label="point.name">
              {{ point.name }} | {{ point.code }}
            </el-option>
          </el-select>
        </el-col>
        <div>
          <el-button type="warning" size="small" style="margin-left:1em">图上选点</el-button>
        </div>
      </el-row>
    </el-form-item>
    <el-form-item label="监测指标" prop="indicateNames">
      <el-select v-model="formData.indexCode" placeholder="请选择监测指标" size="small" clearable multiple>
        <el-option v-for="param of params" :value="param.code" :key="param.id" :label="param.name">
          {{ param.name }} | {{ param.code }}
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
      <div style="padding-left:10px">
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
              style="padding:2px"
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
      :disabled="loading"
      icon="el-icon-search"
      @click="onQuery"
      style="width:100%"
    >
      查询
    </el-button>
  </el-form>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { IDeviceType, IPoint, IReportDetailQuery, pointsPage } from '../../api'
interface IBesides {
  from: string
  to: string
  checked: boolean
}

interface IFormData {
  besides: [IBesides, IBesides][]
  date: string[]
  siteId: number[] | string[]
  indexCode: string[]
  status: string
  deviceType: (number | string)[]
}

@Component({ name: 'QueryForm' })
export default class QueryForm extends Vue {
  @Prop({ type: Boolean, default: false }) loading!: boolean
  @Prop({ type: Object, default: () => ({}) }) defaultQuery!: IReportDetailQuery
  @Prop({ type: Array, default: () => [] }) points!: IPoint[]
  @Prop({ type: Array, default: () => [] }) deviceTypes!: IDeviceType[]

  getDefaultBeside(): [IBesides, IBesides] {
    return [{ from: '', to: '', checked: true }, { from: '', to: '', checked: true }]
  }

  params = []

  formData: Partial<IFormData> = {
    besides: [this.getDefaultBeside()],
    date: [],
    siteId: [],
    indexCode: [],
    status: '0'
  }

  onQuery() {
    const data = {
      ...this.formData,
      besides: this.formData.besides
        .flat()
        .filter(({ checked }) => {
          return checked !== false
        })
        .map(({ from, to }) => `${from || 0},${to}`)
    }
    this.$emit('query', data)
  }

  async onDeviceTypeChange(deviceTypeId: number | string, asd) {
    console.log(deviceTypeId, asd)
    try {
      const {
        result: { records }
      } = await pointsPage({ deviceTypeId, current: 1, size: 9999999 })
      this.points = records
    } catch (error) {
      console.log(error)
    }
  }

  onAdd(rowIndex) {
    if (rowIndex === this.formData.besides.length - 1) {
      this.formData = { ...this.formData, besides: [...this.formData.besides, this.getDefaultBeside()] }
    } else {
      this.formData = { ...this.formData, besides: this.formData.besides.filter((_, index) => index !== rowIndex) }
    }
  }

  @Watch('defaultQuery')
  onDefaultQuery(query) {
    const { beginTime, siteId, indexCode, endTime, status } = query
    this.formData = {
      ...this.defaultQuery,
      date: [beginTime || '', endTime || ''],
      siteId: siteId ? [String(siteId)] : [],
      indexCode: indexCode ? [String(indexCode)] : [],
      status: String(status || '') || '0',
      besides: [...this.formData.besides]
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
