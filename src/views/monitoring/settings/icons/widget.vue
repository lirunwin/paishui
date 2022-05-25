<template>
  <div class="page-container">
    <div class="actions">
      <el-row type="flex" justify="space-between" align="middle">
        <div>
          关键字:
          <el-input v-model="keyword" placeholder="请输入关键字" size="small" style="width: 200px" />
          <el-button type="primary" size="small" style="margin-left: 10px" icon="el-icon-search">搜索</el-button>
        </div>
        <div>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="onAdd">添加</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="onDel">删除</el-button>
        </div>
      </el-row>
    </div>
    <BaseTable
      :columns="settingIconCols"
      :data="archives"
      @row-dblclick="onDblClick"
      @selection-change="onSelectionChange"
    />
    <IconForm :visible.sync="visible" :title="`${current.id ? '修改' : '新增'}采集设备`" :data="current" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import BaseTable from '@/views/monitoring/components/BaseTable/index.vue'
import { settingIconCols } from '@/views/monitoring/utils'
import IconForm from './IconForm.vue'

// import {
//   // getJournalList,
//   // getFiles,
//   // getCountLogType
// } from '@/api/base'

@Component({ name: 'MonitoringIcons', components: { BaseTable, IconForm } })
export default class MonitoringIcons extends Vue {
  settingIconCols = settingIconCols

  visible = false

  keyword = ''

  current: { id?: string; [x: string]: string } = {}
  selected = []

  archives = [
    { id: '1', name: '测试', code: '1231', time: ['00:00', '23:59'] },
    { id: '2', name: '测试1', code: '1232', time: ['00:00', '23:59'] },
    { id: '3', name: '测试2', code: '1233', time: ['00:00', '23:59'] }
  ]

  onQuery(query) {
    console.log(query)
  }

  onAdd() {
    this.visible = true
    this.current = {}
  }

  async onDel() {
    const ids = this.selected.map((item) => item.id)
    console.log(ids)
    await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', { type: 'error' })
    this.$message({ type: 'success', message: '删除成功!' })

    // this.$message({ type: 'info', message: '已取消删除' })
  }

  onDblClick(row) {
    this.current = { ...row }
    this.visible = true
  }

  onSelectionChange(selections) {
    this.selected = [...selections]
  }
}
</script>

<style scoped>
.actions {
  padding: 22px 15px 22px;
  margin-bottom: 15px;
  background: #fff;
}

.table-container {
  padding: 15px;
  background-color: #fff;
}
</style>
