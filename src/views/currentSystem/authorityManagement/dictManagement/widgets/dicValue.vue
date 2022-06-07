<template>
  <div class="dic-container">
    <el-row type="flex" class="row-bg-line-height" justify="center">
      <el-col :span="24">
        <!-- <el-button type="primary" size="small" @click="queryDictTypeList()">查询</el-button> -->
        <el-button type="primary" size="small" @click="handleAdded" style="width: 60px;">新增</el-button>
      </el-col>
    </el-row>

    <div class="dictionary-table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        :header-cell-style="{ fontSize: '14px', fontWeight: '600', background: '#dfeffe', color: '#333333' }"
        height="100%"
        style="width: 100%;font-size: 14px;border: 0px solid;"
      >
        <!-- <el-table-column type="selection" width="65" align="center"></el-table-column> -->
        <template slot="empty">
          <img src="@/assets/icon/null.png" alt="" />
          <p class="empty-p">暂无数据</p>
        </template>
        <el-table-column prop="sort" label="排序" width="80" align="center" />

        <el-table-column prop="notes" label="字典名称" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="codeValue" label="字典编码" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="序号" width="80" align="center" type="index" />
        <el-table-column label="操作" align="center" width="140">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="editDicValue(scope)" style="color:#36af36">编辑</el-button>
            <el-button type="text" size="mini" @click="deleteDicValue(scope)" style="color:#FF0000">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <!-- <div class="pagination" style="box-sizing: border-box;float:right;padding-right:10px">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pagination.current"
              :page-sizes="[20, 40, 80, 100]"
              :page-size="pagination.size"
              background
              layout="total, sizes, prev, pager, next, jumper"
              :total="pagination.total"
            ></el-pagination>
          </div> -->
    </div>

    <!-- 弹出新增模块框 -->

    <el-dialog
      :title="dialogTitle"
      width="40%"
      :visible.sync="dialogVisible"
      @close="closeDialog"
      @open="clear"
      :close-on-click-modal="false"
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
            <el-form-item label="字典类型编码：">
              <el-input v-model="formData.codeKey" placeholder="" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字典类型名称：">
              <el-input v-model="formData.codeRemark" placeholder="" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="row-form-height">
          <el-col :span="12">
            <el-form-item label="字典值编码：" prop="codeValue">
              <el-input type="text" v-model="formData.codeValue" :readonly="readonly"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="字典值名称：" prop="notes">
              <el-input type="text" v-model="formData.notes" :readonly="readonly"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="row-form-height">
          <el-col :span="12">
            <el-form-item label="字典值序号：">
              <!-- <el-input type="number" v-model="formData.sort" :readonly="readonly"></el-input> -->
              <el-input-number
                v-model="formData.sort"
                :min="1"
                :step="1"
                :readonly="readonly"
                @blur="inputNumber"
                controls-position="right"
                style="width:100%"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-row class="row-form-height" style="height:60px">
                <el-col :span="24">
                  <el-form-item label="描述：">
                    <el-input type="textarea" :rows="2" v-model="formData.discription" :readonly="readonly"></el-input>
                  </el-form-item>
                </el-col>
              </el-row> -->
      </el-form>
      <div class="btn-container">
        <el-button class="btn_float" @click="onCancel">取消</el-button>
        <!-- <el-button class="btn_float" v-if="currentOp=='add'" type="primary" @click="formReset">重置</el-button> -->
        <el-button class="btn_float" v-if="currentOp != 'view'" type="primary" @click="submitForm">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDicValueByKeys, addDictionary, editDictionary, deleteDictionary } from '@/api/base'

export default {
  name: 'dicValue',
  props: {
    dicType: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dicName: '',
      dicCode: '',
      dialogTitle: '新增字典值',
      currentOp: 'add',
      dialogVisible: false,
      formData: {
        codeKey: '',
        codeRemark: '',
        ulevel: 2,
        codeValue: '0',
        notes: '',
        sort: 1
      },
      pagination: { current: 1, size: 10 }, // 分页参数信息
      tableData: [],
      readonly: false,
      rules: {
        codeValue: [
          { required: true, message: '请输入字典值编码', trigger: 'blur' },
          { pattern: /^[\w-]+$/, message: '字典值不合法', trigger: 'blur' }
        ],
        notes: [{ required: true, message: '请输入字典值名称', trigger: 'blur' }]
      }
    }
  },
  watch: {
    /**
     * 监测字典类型改变
     */
    dicType(newValue, oldValue) {
      this.formData.codeKey = newValue.codeKey
      this.formData.codeRemark = newValue.codeRemark
      if (newValue && newValue.codeKey) {
        this.getValueListByKeys(newValue.codeKey)
      } else {
        this.tableData = []
      }
    }
  },
  computed: {},
  mounted() {
    this.$nextTick(() => {})
  },
  mounted() {},
  methods: {
    inputNumber() {
      if (!this.formData.sort) {
        this.formData.sort = 1
      }
    },
    /**
     * 根据字典codeKey值查询value
     */
    getValueListByKeys(dictName) {
      let param = null
      if (dictName != '') {
        param = {
          // codeKeys: dictName
          keys: dictName
        }
      }
      getDicValueByKeys(param).then((res) => {
        if (res.code == 1) {
          if (res.result.hasOwnProperty(this.dicType.codeKey)) {
            this.tableData = res.result[this.dicType.codeKey]
          } else {
            this.tableData = []
          }
        } else {
          this.$message.error('查询失败！')
        }
      })
    },

    onCancel() {
      this.dialogVisible = false
      const { resetFields } = this.$refs.formData
      if (typeof resetFields === 'function') resetFields()
    },

    clear() {
      const { clearValidate } = this.$refs.formData
      if (typeof clearValidate === 'function') clearValidate()
    },

    /**
     * 提交数据
     */
    submitForm() {
      if (!this.formData.codeKey) {
        return null
      }
      this.$refs.formData.validate((valid) => {
        if (valid) {
          if (this.dialogTitle == '新增字典值') {
            addDictionary(this.formData).then((res) => {
              if (res.code == 1) {
                this.getValueListByKeys(this.dicType.codeKey)
                this.dialogVisible = false
              } else {
                this.$message({
                  type: 'error',
                  message: '提交失败！'
                })
              }
            })
          }

          if (this.dialogTitle == '编辑字典值') {
            editDictionary(this.formData).then((res) => {
              if (res.code == 1) {
                this.getValueListByKeys(this.dicType.codeKey)
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
    editDicValue(scope) {
      this.formData = { ...scope.row }
      this.dialogTitle = '编辑字典值'
      this.dialogVisible = true
    },

    /**
     * 删除字典
     */
    deleteDicValue(scope) {
      let id = scope.row.id
      this.$confirm('此操作将永久删除该类字典, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteDictionary(id).then((res) => {
            if (res.code == 1) {
              this.getValueListByKeys(this.dicType.codeKey)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
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
    },
    //  页码
    handleCurrentChange(currentPage) {
      this.pagination.current = currentPage
    },

    // 条数
    handleSizeChange(size = 1) {
      this.pagination = {
        ...this.pagination,
        size,
        current: 1
      }
    },

    handleAdded() {
      this.formData = {
        codeKey: this.dicType.codeKey,
        codeRemark: this.dicType.codeRemark,
        creater: 'admin',
        ulevel: 2,
        codeValue: '',
        notes: '',
        sort: null,
        discription: ''
      }
      this.dialogVisible = true
    },
    _editor(param) {
      console.log(param)
    },

    //重置
    formReset() {
      this.formData = {}
    },

    /**
     * @description 关闭数据弹窗
     */
    closeDialog() {
      this.formData = {} //清空数据
    }
  }
}
</script>
<style lang="scss" scoped>
.dic-container {
  height: 100%;
  width: 100%;
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
    height: calc(100% - 50px);
  }
  /deep/ .el-table {
    height: 100%;
    // border: 0.5px solid #e2e2e2;
  }
}

/deep/ .el-dialog__body {
  padding: 10px 20px !important;
}

/deep/ .demo-form-inline {
  .row-form-height {
    height: 40px;
    line-height: 40px;
    margin: 10px 0;
  }
}

.btn-container {
  text-align: right;
}
</style>
