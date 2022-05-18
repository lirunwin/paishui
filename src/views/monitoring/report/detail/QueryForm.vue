<template>
  <el-form class="form" ref="form" v-bind="{ labelWidth: '6em', size: 'medium' }" :model="formData">
    <el-form-item label="监测站点" prop="no">
      <el-row type="flex">
        <el-col>
          <el-input v-model="formData.sites" placeholder="请输入监测站点" size="small" clearable />
        </el-col>
        <div><el-button type="warning" size="small" style="margin-left:1em">图上选点</el-button></div>
      </el-row>
    </el-form-item>
    <el-form-item label="指标参数" prop="param">
      <el-input v-model="formData.param" placeholder="请输入指标参数" size="small" clearable />
    </el-form-item>
    <el-form-item label="采集时间" prop="date">
      <el-date-picker
        v-model="formData.date"
        placeholder="请选择采集时间"
        size="small"
        clearable
        value-format="yyyy-MM-dd"
      />
    </el-form-item>
    <el-form-item label="统计方式" prop="type">
      <el-radio-group v-model="formData.type">
        <el-radio :label="3">实时监测</el-radio>
        <el-radio :label="6">按每15分钟均值</el-radio>
        <el-radio :label="9">按每小时均值</el-radio>
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
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
interface IBesides {
  from: string
  to: string
  checked: boolean
}
@Component({ name: 'QueryForm', components: {} })
export default class QueryForm extends Vue {
  @Prop({ type: Boolean, default: false }) loading!: boolean

  @Prop({ type: Array, default: () => [] }) selected!: { id?: string }[]

  getDefaultBeside(): [IBesides, IBesides] {
    return [{ from: '', to: '', checked: true }, { from: '', to: '', checked: true }]
  }

  formData: {
    besides: [IBesides, IBesides][]
    [key: string]: any
  } = {
    besides: [this.getDefaultBeside()]
  }

  get ids() {
    return this.selected.map((item) => item.id)
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

  onAdd(rowIndex) {
    if (rowIndex === this.formData.besides.length - 1) {
      this.formData = { ...this.formData, besides: [...this.formData.besides, this.getDefaultBeside()] }
    } else {
      this.formData = { ...this.formData, besides: this.formData.besides.filter((_, index) => index !== rowIndex) }
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
}
</style>
