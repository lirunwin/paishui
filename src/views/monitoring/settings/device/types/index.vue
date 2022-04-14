<template>
  <div class="page-container">
    <div class="actions">
      <div>
        <el-button type="primary" size="small">新增设备类型</el-button>
        <el-button type="primary" size="small">删除设备类型</el-button>
      </div>
      <div>
        <el-button type="primary" size="small">新增参数</el-button>
        <el-button type="primary" size="small">删除参数</el-button>
      </div>
    </div>
    <el-row :gutter="15">
      <el-col :span="12">
        <div class="table-container">
          <BaseTable
            :columns="settingDeviceTypeCols"
            :data="[
              { name: '测试', code: '1231', time: 'ss' },
              { name: '测试1', code: '1232', time: 'ss' },
              { name: '测试2', code: '1233', time: 'ss' }
            ]"
          /></div
      ></el-col>
      <el-col :span="12">
        <div class="table-container">
          <BaseTable
            :columns="settingDeviceTypeParamCols"
            :data="[
              { name: '测试', code: '1231', time: 'ss' },
              { name: '测试1', code: '1232', time: 'ss' },
              { name: '测试2', code: '1233', time: 'ss' }
            ]"
          /></div
      ></el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import BaseTable from '@/views/monitoring/components/BaseTable/index.vue'
import { settingDeviceTypeCols, settingDeviceTypeParamCols } from '@/views/monitoring/utils'

// import {
//   // getJournalList,
//   // getFiles,
//   // getCountLogType
// } from '@/api/base'

@Component({ name: 'DeviceTypes', components: { BaseTable } })
export default class DeviceTypes extends Vue {
  test: string = 'DeviceTypes'
  settingDeviceTypeCols = settingDeviceTypeCols
  settingDeviceTypeParamCols = settingDeviceTypeParamCols
  // /**
  //  * @description
  //  * 控制表格显示 summary: 表示日志统计表格， table: 表示该部门下的记录
  //  */
  // display: 'summary' | 'table' = 'summary'

  // /**
  //  * @description
  //  * 部门Id, 记录当前选择的部门
  //  */
  // deptId: string = ''

  // /**
  //  * @description
  //  * 查询条件
  //  */
  // query: Query = null

  // /**
  //  * @description
  //  * 分组后的日志统计
  //  */
  // groupedLogs: GroupedRecords[] = []

  // /**
  //  * @description
  //  * 日志类型
  //  */
  // logTypeNames: LogTypeNames = {}

  // onQueryChange(query: Query) {
  //   this.query = query
  // }

  // /**
  //  * @description
  //  * 获取日志同
  //  */
  // async fetchLogSummary() {
  //   const { startDate, endDate } = this.query || {}
  //   const { result = {} } =
  //     (await getCountLogType({
  //       startDate: '',
  //       endDate: ''
  //     })) || {}

  //   const [groupedLogs, logTypeNames] = groupLogs(result || [])
  //   this.groupedLogs = groupedLogs
  //   this.logTypeNames = logTypeNames
  // }

  // /**
  //  * @description
  //  * 当deptId为空的时候获取日志统计， 为空代表当前正显示日志统计
  //  */
  // @Watch('deptId', { immediate: true })
  // async onDeptIdChange(val: string) {
  //   if (!val) {
  //     this.fetchLogSummary()
  //     this.display = 'summary'
  //   } else {
  //     this.display = 'table'
  //   }
  // }
}
</script>

<style scoped>
.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  margin-bottom: 15px;
  background: #fff;
}

.table-container {
  padding: 15px;
  background-color: #fff;
}
</style>
