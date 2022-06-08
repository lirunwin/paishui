<template>
  <div>
    <el-form ref="form" :model="query" size="medium" label-width="5em" class="form" style="margin-bottom: 1em">
      <BaseTitle :bold="false">条件设置</BaseTitle>
      <el-form-item label="目标地址">
        <el-input v-model="query.keyword" disabled />
      </el-form-item>
      <el-form-item label="目标坐标">
        <el-input v-model="query.coordinate" disabled />
      </el-form-item>
      <el-form-item label="搜索目标">
        <el-select v-model="query.team" placeholder="请选择搜索目标">
          <el-option label="全部" value="" />
        </el-select>
      </el-form-item>
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-form-item label="缓冲距离">
            <el-row type="flex">
              <el-col><el-input v-model.number="query.distance" /></el-col><el-col style="padding: 0 20px">公里</el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col style="flex: 1 1 70px; margin-left: 1em">
          <el-button type="primary" size="medium">分析</el-button>
        </el-col>
      </el-row>
    </el-form>
    <BaseTitle :bold="false">推荐方案</BaseTitle>
    <RouteCard v-for="plan in plans" :key="plan.id" :plan="plan" />
    <BaseTitle :bold="false">备选方案</BaseTitle>
    <RouteCard v-for="plan in backupPlans" :key="plan.id" :plan="plan" backup />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import BaseTitle from '@/views/monitoring/components/BaseTitle/index.vue'
import BaseTable from '@/views/monitoring/components/BaseTable/index.vue'
import { settingMonitorCols } from '@/views/monitoring/utils'
import RouteCard from '@/views/monitoring/monitor/components/RouteCard/index.vue'

@Component({ name: 'Monitor', components: { BaseTitle, BaseTable, RouteCard } })
export default class Monitor extends Vue {
  query: {
    keyword?: string
    coordinate?: string
    team?: string
    distance?: number
    state?: string[]
  } = { state: [] }

  monitoring = false
  settingMonitorCols = settingMonitorCols

  selected = { standard: [], param: [] }

  monitorItems = [
    { id: '1', name: '正常', code: '1231', state: 'normal' },
    { id: '2', name: '优质', code: '1232', state: 'good' },
    { id: '3', name: '轻度', code: '1233', state: 'light' },
    { id: '4', name: '中度', code: '1233', state: 'medium' },
    { id: '5', name: '严重', code: '1233', state: 'heavy' },
    { id: '6', name: '无效', code: '1233', state: 'invalid' }
  ]

  plans = [
    {
      id: '1',
      type: 'person',
      name: '李明宇',
      dep: '管网管理部',
      tel: '18957452158',
      distance: '3',
      address: '四川省成都市青羊区光华大道256号'
    },
    {
      id: '2',
      type: 'car',
      name: '王强',
      plate: '川A256325',
      tel: '18145263256',
      distance: '5',
      address: '四川省成都市青羊区光华大道256号'
    }
  ]

  backupPlans = [
    {
      id: '1',
      type: 'person',
      name: '李明宇',
      dep: '管网管理部',
      tel: '18957452158',
      distance: '8',
      address: '四川省成都市青羊区光华大道256号'
    },
    {
      id: '2',
      type: 'car',
      name: '王强',
      plate: '川A256325',
      tel: '18145263256',
      distance: '10',
      address: '四川省成都市青羊区光华大道256号'
    }
  ]

  rowStyle({ row }) {
    return { color: '' }
  }
}
</script>

<style lang="scss" scoped>
.form {
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
