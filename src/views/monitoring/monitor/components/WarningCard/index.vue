<template>
  <el-card class="warning-card" :body-style="{ fontSize: '14px', padding: '15px' }">
    <div slot="header" class="clearfix">
      <span>告警信息提示</span>
      <el-button style="float: right; padding: 3px 0" type="text">历史数据</el-button>
    </div>
    <div class="query">
      <div class="query-check-all">
        <el-checkbox :indeterminate="isIndeterminate" v-model="selectedAll" @change="onCheckAllChange">
          全部
        </el-checkbox>
      </div>
      <div class="query-queries">
        <div class="query-checkbox">
          <el-checkbox-group v-model="checkedTypes">
            <el-checkbox v-for="item in types" :label="item.name" :key="item.name">{{ item.label }}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="query-btn">
          <el-button type="primary" size="small" style="padding:0 10px; height: 1.6em; ">标记已读</el-button>
        </div>
      </div>
    </div>

    <WarningCardItem v-for="(param, index) of params" :key="param.id">
      <el-checkbox
        :key="param.id"
        :true-label="param.id"
        v-model="checked[index]"
        :checked="checkedValues.includes(param.id)"
        @change="onCheckboxChange"
      />
    </WarningCardItem>
  </el-card>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import WarningCardItem from './WarningCardItem.vue'
const typeOptions = [{ label: '报警', name: 'error' }, { label: '预警', name: 'warning' }]
const params = [
  {
    id: `1`,
    code: 'COD：20mg/L',
    name: '东风湖排水口1',
    time: '2021-02-01 12:01:02',
    type: 'error',
    value: '100-200'
  },
  {
    id: `2`,
    code: 'COD：31mg/L',
    name: '东风湖排水口1',
    time: '2021-02-02 13:01:02',
    type: 'warning',
    value: '100-200'
  },
  {
    id: `3`,
    code: 'COD：80mg/L',
    name: '东风湖排水口1',
    time: '2021-02-03 14:01:02',
    type: 'error',
    value: '100-200'
  },
  {
    id: `4`,
    code: 'COD：10mg/L',
    name: '东风湖排水口1',
    time: '2021-02-04 15:01:02',
    type: 'warning',
    value: '100-200'
  }
]

@Component({ name: 'WarningCard', components: { WarningCardItem } })
export default class WarningCard extends Vue {
  params = params
  selectedAll = false
  checkedTypes = []
  isIndeterminate = false
  types = typeOptions
  checkedValues = []
  checked = []

  onCheckAllChange(val) {
    console.log(val)
    this.checkedValues = val ? this.params.map((item) => item.id) : []
    this.checked = val ? this.params.map(() => true) : []
    this.isIndeterminate = false
  }

  onCheckboxChange(isChecked, e) {
    const value = e.target.value
    console.log(isChecked, value)
    if (isChecked) {
      this.checkedValues = [...this.checkedValues, value]
    } else {
      this.checkedValues = this.checkedValues.filter((i) => i !== value)
    }
    let checkedCount = this.checkedValues.length
    this.selectedAll = checkedCount === this.params.length
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.params.length
  }
}
</script>

<style lang="scss" scoped>
.warning-card {
  position: absolute;
  left: 30px;
  bottom: 70px;
  width: 366px;
  /deep/ .el-card__header {
    padding: 15px;
  }
  /deep/ .el-card__body {
    width: 366px;
  }
}

.query {
  display: flex;
  align-items: center;
  max-width: 100%;

  &-check-all {
    flex: 0 0 4.5em;
  }
  &-queries {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
  }
  &-btn {
    flex: 0 0 auto;
  }
  &-checkbox {
    flex: 1 1 auto;
    margin-right: 2em;
    > .el-checkbox-group {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
