<template>
  <div class="page-container">{{ test }}</div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

// import {
//   // getJournalList,
//   // getFiles,
//   // getCountLogType
// } from '@/api/base'

@Component({
  name: 'MonitoringStandards',
  components: {}
})
export default class MonitoringStandards extends Vue {
  test: string = 'MonitoringStandards'
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

<style scoped></style>
