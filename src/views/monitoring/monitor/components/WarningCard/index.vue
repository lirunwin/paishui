<template>
  <el-card class="warning-card" :body-style="{ fontSize: '14px', padding: '15px' }">
    <div slot="header" class="clearfix">
      <span>告警信息提示</span>
      <el-button style="float: right; padding: 3px 0" type="text">历史数据</el-button>
    </div>
    <div class="query">
      <div class="query-check-all">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="onCheckAllChange">
          全部
        </el-checkbox>
      </div>
      <div class="query-queries">
        <div class="query-checkbox">
          <el-checkbox-group v-model="checkedTypes" @change="onCheckboxChange">
            <el-checkbox v-for="item in types" :label="item.name" :key="item.name">{{ item.label }}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="query-btn">
          <el-button type="primary" size="small" style="padding:0 10px; height: 1.6em; ">标记已读</el-button>
        </div>
      </div>
    </div>

    <WarningCardItem />
    <WarningCardItem />
    <WarningCardItem />
    <WarningCardItem />
  </el-card>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import WarningCardItem from './WarningCardItem.vue'
const typeOptions = [{ label: '报警', name: 'error' }, { label: '预警', name: 'warning' }]

@Component({ name: 'WarningCard', components: { WarningCardItem } })
export default class WarningCard extends Vue {
  isIndeterminate = false
  checkAll = false
  checkedTypes = ['error', 'warning']
  types = typeOptions

  onCheckAllChange(val) {
    this.checkedTypes = val ? typeOptions.map((item) => item.name) : []
    this.isIndeterminate = false
  }
  onCheckboxChange(value) {
    let checkedCount = value.length
    this.checkAll = checkedCount === this.types.length
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.types.length
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
