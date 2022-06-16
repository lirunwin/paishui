<template>
  <div class="main-page">
    <el-form
      class="form"
      label-width="80px"
      ref="form"
      label-position="left"
      inline
    >
      <el-form-item label="关键字:" style="margin-right:25px;">
        <el-input
          v-model="searchText"
          placeholder="支持搜索备份文件名称"
          size="small"
          :minlength="450"
          clearable
        />
      </el-form-item>
      <el-form-item label="备份类型:" style="margin-right:25px;">
        <el-checkbox-group v-model="backupType">
          <el-checkbox label="完全备份"></el-checkbox>
          <el-checkbox label="增量备份"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="操作方式:" style="margin-right:25px;">
        <el-checkbox-group v-model="backupMethod">
          <el-checkbox label="自动备份"></el-checkbox>
          <el-checkbox label="人工备份"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="时间:" style="margin-right:25px;">
        <el-date-picker size="small" v-model="startDate" type="date" placeholder="开始日期"></el-date-picker>至
        <el-date-picker size="small" v-model="endDate" type="date" placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item style="margin-right:15px;">
        <el-button size="small" type="primary" @click="updateTable">查询</el-button>
      </el-form-item>
      <el-form-item style="margin-right:15px;">
        <el-button size="small" type="primary" @click="backup">备份</el-button>
      </el-form-item>
    </el-form>

    <div class="table-box">
      <el-table :data="tableData" height="500" stripe v-bind="defaultStyle" :show-overflow-tooltip="true">
        <template slot="empty">
          <img src="@/assets/icon/null.png" alt />
          <p style="margin-top: -7px">暂无数据</p>
        </template>
        <el-table-column width="60" align="center" type="index" label="序号"></el-table-column>
        <el-table-column
          v-for="item of columns"
          :key="item.value"
          :prop="item.prop"
          :label="item.label"
          align="center"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="download(scope.row)" type="text" size="small">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top: 20px">
      <el-pagination
        ref="pagination"
        small
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :page-sizes="[10, 20, 30, 50, 100, 1000]"
        :total="total"
        @current-change="updateTable"
        @size-change="updateTable"
      />
    </div>
    <el-dialog :visible.sync="showBackConfig" append-to-body width="50%" title="备份">
        <div class="common-title">备份策略</div>
        <div slot="footer" style="text-align:right;margin:15px 10px 0 0;">
            <el-button size="small" @click="toBackup" type="primary">确定</el-button>
            <el-button size="small" @click="showBackConfig=false" type="primary">取消</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        { type: '完全备份', method: '自动备份', name: '1', size: '365M', dataRnage: '2022-06-05 06:03:05 到 2022-06-05 06:04:05', date: '2022-06-05 06:03:05', person: '管理员' },
        { type: '1', method: '1', name: '1', size: '1', dataRnage: '1', date: '1', person: '1' },
        { type: '1', method: '1', name: '1', size: '1', dataRnage: '1', date: '1', person: '1' },
        { type: '1', method: '1', name: '1', size: '1', dataRnage: '1', date: '1', person: '1' }
      ],
      columns: [
        { label: '备份类型', prop: 'type' },
        { label: '操作方式', prop: 'method' },
        { label: '备份文件名称', prop: 'name' },
        { label: '文件大小', prop: 'size' },
        { label: '备份数据时间范围', prop: 'dataRnage' },
        { label: '操作时间', prop: 'date' },
        { label: '操作人', prop: 'person' }
      ],
      currentPage: 1,
      pageSize: 30,
      total: 0,
      searchText: '',
      startDate: '',
      endDate: '',
      backupType: [],
      backupMethod: [],
      defaultStyle: {
        'tool-tip-effect': 'light',
        'show-overflow-tooltip': true,
        size: 'medium',
        stripe: true,
        'header-cell-style': {
          background: '#Eaf1Fd',
          color: 'rgb(50,59,65)',
          height: '46px'
        },
        'cell-style': {
          height: '40px'
        }
      },
      showBackConfig: false
    }
  },
  watch: {
      backupType (nv, ov) {
          console.log(nv, ov)
      }
  },
  methods: {
    // 更新表格  
    updateTable() {},
    // 下载
    download() {},
    // 备份
    backup() {
        this.showBackConfig = true
    },
    toBackup () {
        this.showBackConfig = false
    }
  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>
.main-page {
  margin: 20px;
}
/deep/ .el-checkbox {
    margin-right: 5px!important;
}
/deep/ .common-title {
    position: relative;
    font-weight: bold;
    margin-left: 20px;
    font-size: 15px;
    margin-bottom: 20px;
    height: 30px;
    line-height: 30px;
    &::after {
        position: absolute;
        top: 5px;
        left: -10px;
        content: '';
        width: 4px;
        height: 65%;
        background-color: #2d74e7;
    }
}
</style>