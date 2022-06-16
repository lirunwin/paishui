<template>
  <div class="main-page">
    <el-form class="form" ref="form" label-position="left" inline>
      <el-form-item label="关键字:">
        <el-input
          v-model="searchText"
          placeholder="支持搜索数据名称、实体表、数据别名、数据类型"
          size="small"
          :minlength="550"
        />
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-box">
      <el-table :data="tableData" height="500" stripe v-bind="defaultStyle">
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
            <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
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
    <el-dialog :visible.sync="showDetail" append-to-body width="40%" title="编辑">
      <div class="detailCard">
        <div class="common-title">基本信息</div>
        <el-form v-model="detailForm" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="数据名称">
                <el-row>
                  <el-input value="PS_WS_POINT" style="width: 100%" disabled />
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实体表">
                <el-input value="SMDTV" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="数据类型">
                <el-input value="point" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数据量">
                <el-input value="3659" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
                <el-form-item label="数据源">
              <el-input value="192.168.2.242/orcl." disabled />
            </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="数据别名">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注">
                <el-input />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="common-title">元数据信息</div>
        <el-table
          :header-cell-style="{background: '#eaf1fd', color: 'rgb(50,59,65)'}"
          :data="detailTabelData"
          height="300px"
        >
          <el-table-column label="序号" type="index" align="center"></el-table-column>
          <el-table-column label="字段名称" prop="name" align="center"></el-table-column>
          <el-table-column label="字段别名" prop="alias" align="center">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.alias" />
            </template>
          </el-table-column>
          <el-table-column label="显示顺序" prop="sort" align="center">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.sort" />
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="mark" align="center">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.mark" />
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" style="text-align:right;margin:15px 10px 0 0;">
          <el-button size="small" @click="editInfo" type="primary">确定</el-button>
          <el-button size="small" @click="showDetail=false" type="primary">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        { name: '1', table: '1', num: '1', source: '1', type: '1', alias: '1' },
        { name: '1', table: '1', num: '1', source: '1', type: '1', alias: '1' },
        { name: '1', table: '1', num: '1', source: '1', type: '1', alias: '1' },
        { name: '1', table: '1', num: '1', source: '1', type: '1', alias: '1' }
      ],
      columns: [
        { label: '数据名称', prop: 'name' },
        { label: '实体表', prop: 'table' },
        { label: '数据量', prop: 'num' },
        { label: '数据源', prop: 'source' },
        { label: '数据类型', prop: 'type' },
        { label: '数据别名', prop: 'alias' }
      ],
      currentPage: 1,
      pageSize: 30,
      total: 0,
      searchText: '',

      showDetail: false,
      detailForm: {},
      detailTabelData: [
        { name: 'ID', alias: 'ID', sort: '', mark: '' },
        { name: 'CITY', alias: 'CITY', sort: '', mark: '' },
        { name: 'TYPE', alias: 'TYPE', sort: '', mark: '' },
        { name: 'POSX', alias: 'POSX', sort: '', mark: '' },
        { name: 'POSY', alias: 'POSY', sort: '', mark: '' }
      ],
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
      }
    }
  },
  methods: {
    updateTable() {},
    edit(row) {
      this.showDetail = true
    },
    editInfo() {
      this.showDetail = false
    }
  },
  computed: {
    headerStyle() {
      return { background: 'rgb(244, 234, 251)', height: '50px' }
    }
  }
}
</script>

<style lang="scss" scoped>
.main-page {
  margin: 20px;
}
/deep/ .el-table__header-wrapper {
  background: rgb(224, 234, 251);
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
/deep/.el-dialog .el-dialog__header {
  background-color: rgb(45, 116, 231);
  font-size: 16px;
  .el-dialog__title {
    color: white;
  }
  .el-dialog__headerbtn {
    > i {
        color: white!important;
    }
  }
}
</style>