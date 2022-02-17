<template>
  <!-- 通讯录 -->
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="施工人员" name="0" />
      <el-tab-pane label="施工班组" name="1" />
      <el-tab-pane label="施工单位" name="2" />
    </el-tabs>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      highlight-current-row
      style="width: 100%"
      @current-change="handleSelectionChange"
    >
      <el-table-column label="选择" width="55">
        <template slot-scope="scope">
          <!-- <el-checkbox v-model="scope.row.checked" /> -->
          <el-radio v-model="checked" :label="scope.row.id" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="负责人" width="120" />
      <el-table-column prop="phon" label="电话" show-overflow-tooltip />
    </el-table>
    <el-pagination
      :current-page="pagination.current"
      :page-sizes="[10, 30, 50, 100, 200]"
      :page-size="pagination.size"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getBuilderList, getBuildTeamList } from '@/api/work'
import { getCompanyInfoList } from '@/api/base'

export default {
  name: 'MailList',
  components: {},
  data() {
    return {
      activeName: '0',
      tableData: [],
      checked: null, // 如果使用单选框,定义一个model值
      currentSelectItem: {}, // 当前选中的值
      pagination: { current: 1, size: 10 }, // 分页参数信息
      total: 0
    }
  },
  created() {
    this.getList(this.pagination)
  },
  methods: {
    // 数据请求
    getList(data) {
      this.checked = null
      if (this.activeName === '0') {
        this.getBuilderList(data)
      } else if (this.activeName === '1') {
        this.getBuildTeamList(data)
      } else if (this.activeName === '2') {
        this.getCompanyInfoList(data)
      }
    },

    // 获取施工人员
    getBuilderList() {
      getBuilderList(this.pagination).then(res => {
        res.result.records.forEach(item => {
          item.name = item.rymc
          item.phon = item.rydh
        })
        this.tableData = res.result.records
        this.total = res.result.total
      })
    },

    // 获取施工班组
    getBuildTeamList() {
      getBuildTeamList(this.pagination).then(res => {
        this.list = res.result.records
        res.result.records.forEach(item => {
          item.name = item.fzry
          item.phon = item.fzdh
        })
        this.tableData = res.result.records
        this.total = res.result.total
      })
    },

    // 获取施工单位
    getCompanyInfoList() {
      getCompanyInfoList(this.pagination).then(res => {
        res.result.records.forEach(item => {
          item.name = item.fzry
          item.phon = item.fzdh
        })
        this.tableData = res.result.records
        this.total = res.result.total
      })
    },

    handleClick(tab, event) {
      // console.log(tab, event)
      this.pagination = {
        size: 10,
        current: 1
      }
      this.getList(this.pagination)
    },

    handleSelectionChange(row) {
      // console.log(row)
      // 如果使用单选框,这里可以把当前选中的这一项先保存起来
      this.currentSelectItem = row
    },
    handleSizeChange(value) {
      // console.log('111111', value)
      this.pagination.size = value
      this.getList(this.pagination)
    },
    handleCurrentChange(value) {
      // console.log('2333', value)
      this.pagination.current = value
      this.getList(this.pagination)
    },
    getSelectData() {
      // console.log('2222', this.currentSelectItem)
      this.$emit('remind', this.currentSelectItem, this.activeName)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
