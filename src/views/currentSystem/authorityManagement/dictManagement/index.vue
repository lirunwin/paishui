<template>
  <div class="app-container">
    <!-- 字典配置 -->
    <el-row type="flex" :gutter="10" class="row-height-width">
      <el-col :span="14" class="col-style">
        <div class="left-container border-style">
          <el-row type="flex" class="row-bg-line-height" justify="center">
            <el-col :span="8" class="col-margin-right">
              <div class="demo-input-suffix">
                <el-row>
                  <el-col :span="8">
                    <span>字典编码:</span>
                  </el-col>
                  <el-col :span="16">
                    <el-input v-model="dictCode" clearable placeholder="请输入内容" size="small" />
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col :span="8" class="col-margin-right">
              <div class="demo-input-suffix">
                <el-row>
                  <el-col :span="8">
                    <span>字典名称:</span>
                  </el-col>
                  <el-col :span="16">
                    <el-input v-model="dictName" clearable placeholder="请输入内容" size="small" />
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" size="small" style="width: 60px;" @click="queryDictTypeList()">查询</el-button>
              <el-button type="primary" size="small" style="width: 60px;" @click="handleAdded">新增</el-button>
            </el-col>
          </el-row>

          <!-- <div style="margin-top:20px">
          <table-item
            :table-data="list"
            :column="column"
            :pagination="true"
            :pagesize="pagination.size"
            :currentpage="pagination.current"
            :tableheight="500"
            :border="true"
            :multiple="true"
            :total="total"
            :fixed="false"
            :isdelete="true"
            @handleCurrentChange="handleCurrentChange"
            @handleSizeChange="handleSizeChange"
            @handleSelectionChange="handleSelectionChange"
          />
        </div> -->
          <div class="dictionary-table">
            <el-table
              ref="multipleTable"
              :data="tableData"
              border
              :header-cell-style="{ fontSize: '14px', fontWeight: '600', background: '#dfeffe', color: '#333333' }"
              height="100%"
              highlight-current-row
              style="width: 100%;font-size: 14px;border: 0px solid;"
              @row-click="rowClick"
            >
              <!-- <el-table-column type="selection" width="65" align="center"></el-table-column> -->
              <el-table-column label="序号" width="80" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="codeKey" label="字典编码" show-overflow-tooltip align="center" />
              <el-table-column prop="codeRemark" label="字典名称" show-overflow-tooltip align="center" />
              <!-- <el-table-column prop="createUser" label="创建人" show-overflow-tooltip align="center"></el-table-column>
              <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip align="center"></el-table-column>
              <el-table-column prop="notes" label="字典描述" show-overflow-tooltip align="center"></el-table-column> -->
              <el-table-column label="操作" align="center" width="140">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" style="color:#36af36" @click="editDicType(scope)">编辑</el-button>
                  <el-button type="text" size="mini" style="color:#FF0000" @click="deleteDicType(scope)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页器 -->
            <div class="pagination">
              <el-pagination
                :current-page="pagination.current"
                :page-sizes="[40, 80, 120, 160]"
                :page-size="pagination.size"
                background
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </div>
      </el-col>

      <el-col :span="10" class="col-style">
        <div class="righr-container border-style">
          <DicValue :dic-type="dicType" />
        </div>
      </el-col>
    </el-row>

    <!-- 弹出新增模块框 -->
    <el-dialog
      :title="dialogTitle"
      width="45%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <el-form
        ref="formData"
        :model="formData"
        :rules="rules"
        label-width="120px"
        label-position="right"
        class="demo-form-inline"
      >
        <el-row class="row-form-height">
          <el-col :span="12">
            <el-form-item label="字典编码：" prop="codeKey">
              <!-- oncodeKeyup="this.value=this.value.replace(/[^a-zA-Z]/g,'')" -->
              <el-input v-model="formData.codeKey" type="text" :readonly="readonly" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字典名称：" prop="codeRemark">
              <el-input v-model="formData.codeRemark" type="text" :readonly="readonly" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="row-form-height">
          <el-col :span="12">
            <el-form-item label="创建人：">
              <el-input v-model="formData.creater" type="text" :readonly="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间：">
              <el-input v-model="formData.createTime" type="text" :readonly="true" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-row class="row-form-height" style="height:60px">
          <el-col :span="24">
            <el-form-item label="字典描述描述：">
              <el-input type="textarea" :rows="2" v-model="formData.discription" :readonly="readonly"></el-input>
            </el-form-item>
          </el-col>
        </el-row> -->
      </el-form>
      <div class="btn-container">
        <el-button class="btn_float" @click="onCancel">取消</el-button>
        <el-button v-if="currentOp == 'add'" class="btn_float" type="primary" @click="formReset">重置</el-button>
        <el-button v-if="currentOp != 'view'" class="btn_float" type="primary" @click="submitForm">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import TableItem from '@/components/Table'
import DicValue from './widgets/dicValue'
import { getKeyPage, addDictionary, editDictionary, deleteDictionary } from '@/api/base'

export default {
  name: 'DictManagement',
  components: {
    //  TableItem,
    DicValue
  },
  data() {
    return {
      dicName: '',
      dicCode: '',
      dicType: {},
      dictName: '',
      dictCode: '',
      dialogTitle: '新增字典',
      dialogVisible: false,
      formData: {
        codeKey: '',
        ulevel: 1,
        creater: '',
        createTime: '',
        discription: ''
      },
      readonly: false,
      currentOp: '',
      pagination: { current: 1, size: 40, total: 0 }, // 分页参数信息
      tableData: [],
      multipleSelection: [],
      user: null,
      rules: {
        codeKey: [
          { required: true, message: '请输入字典编号', trigger: 'blur' }
          // { pattern: '^[a-zA-Z\$_][a-zA-Z0-9_$]*$', message: '字典编号不合法' }
        ],
        codeRemark: [{ required: true, message: '请输入字典名称', trigger: 'blur' }]
      }
    }
  },
  created() {},

  mounted() {
    if (this.$store.state.user) {
      this.user = this.$store.state.user
      this.formData.creater = this.user.hasOwnProperty('username') ? this.user.username : ''
    }
    this.queryDictTypeList()
  },

  methods: {
    /**
     * 查询字典类型
     * @ulevel=1
     */
    queryDictTypeList() {
      const param = Object.assign({ ulevel: 1 }, this.pagination)
      if (this.dictCode !== '') param['codeKey'] = this.dictCode
      if (this.dictName !== '') param['codeRemark'] = this.dictName
      getKeyPage(param).then((res) => {
        if (res.code === 1) {
          this.tableData = res.result.records
          this.pagination.total = res.result.total
        } else {
          this.$message({
            type: 'error',
            message: '查询失败！'
          })
        }
      })
    },

    onCancel() {
      this.dialogVisible = false
      const { resetFields } = this.$refs.formData
      if (resetFields) resetFields()
    },

    //  页码
    handleCurrentChange(currentPage) {
      this.pagination.current = currentPage
      this.queryDictTypeList()
    },

    // 条数
    handleSizeChange(pagesize) {
      this.pagination.size = pagesize
      this.queryDictTypeList()
    },

    // 选择
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    /**
     * 新增提交
     */
    submitForm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          if (this.dialogTitle === '新增字典') {
            addDictionary(this.formData).then((res) => {
              if (res.code === 1) {
                this.pagination.total += 1
                this.queryDictTypeList()
                this.dialogVisible = false
              } else {
                this.$message({
                  type: 'error',
                  message: '提交失败！'
                })
              }
            })
          }
          if (this.dialogTitle === '编辑字典') {
            editDictionary(this.formData).then((res) => {
              if (res.code === 1) {
                this.queryDictTypeList()
                this.dialogVisible = false
              } else {
                this.$message({
                  type: 'error',
                  message: '提交失败！'
                })
              }
            })
          }
          return true
        }
      })
    },

    /**
     * 编辑字典类型
     */
    editDicType(scope) {
      this.formData = scope.row
      this.formData.creater = this.user.hasOwnProperty('username') ? this.user.username : ''
      this.dialogTitle = '编辑字典'
      this.dialogVisible = true
    },

    /**
     * 删除字典
     */
    deleteDicType(scope) {
      // console.log(scope.row)
      const id = scope.row.id
      this.$confirm('此操作将永久删除该类字典, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteDictionary(id).then((res) => {
            if (res.code === 1) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.dicType = {}
            } else {
              this.$message({
                type: 'error',
                message: '删除失败'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
        .finally(() => {
          this.queryDictTypeList()
        })
    },

    handleAdded() {
      this.formData = {
        ...this.formData,
        codeKey: '',
        createTime: this.getTime(),
        creater: this.user.hasOwnProperty('username') ? this.user.username : '',
        discription: ''
      }

      this.dialogTitle = '新增字典'
      this.readonly = false
      this.dialogVisible = true
    },

    /**
     * 点击行事件
     */
    rowClick(row, column, event) {
      this.dicType = {
        codeKey: row.codeKey,
        codeRemark: row.codeRemark
      }
    },

    getTime() {
      var myDate = new Date()
      const yy = myDate.getFullYear()
      const mm = myDate.getMonth() + 1 < 10 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1
      const dd = myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate()
      const hh = myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours()
      const mi = myDate.getUTCMinutes() < 10 ? '0' + myDate.getUTCMinutes() : myDate.getUTCMinutes()
      const ss = myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds()
      return yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mi + ':' + ss
    },
    // 重置
    formReset() {
      this.formData = {
        ulevel: 1
      }
    },

    /**
     * @description 关闭数据弹窗
     */
    closeDialog() {
      this.formData = {
        ulevel: 1
      } // 清空数据
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  position: absolute;
  width: 100%;
  height: calc(100% - 40px);

  .row-height-width {
    width: 100%;
    height: 100%;
    margin-left: 0 !important;
    margin-right: 0 !important;
    .row-bg-line-height {
      height: 32px;
      line-height: 32px;
      margin: 10px;

      .col-margin-right {
        margin-right: 10px;
      }
    }

    .dictionary-table {
      width: 100%;
      height: calc(100% - 84px);
    }

    /deep/ .el-table {
      height: 100%;
      border: 0.5px solid #e2e2e2;
    }
    .col-style {
      padding: 0px !important;
    }
    .border-style {
      border: 1px solid #e2e2e2;
      height: 100%;
    }
    .left-container {
      margin-right: 10px;
    }
  }

  /deep/.el-table {
    tr {
      height: 38px !important;
    }
  }
}

/deep/ .el-dialog {
  min-width: 620px;
  .el-dialog__body {
    padding: 10px 20px !important;
  }
}

/deep/ .demo-form-inline {
  .row-form-height {
    height: 40px;
    line-height: 40px;
    margin: 18px 0;
  }
}

.btn-container {
  text-align: right;
}
</style>
