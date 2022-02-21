<template>
  <div class="app-container">
    <!-- 部门管理 -->
    <el-row type="flex" style="margin-bottom: 20px">
      <el-col :span="10">
        <el-button type="primary" size="small" @click="handleClick('add')">新增</el-button>
        <el-button type="primary" size="small" :disabled="unitTreeSelect.length !== 1" @click="handleClick('edit')">修改</el-button>
        <el-button type="primary" size="small" :disabled="unitTreeSelect < 1" @click="handleClick('delete')">删除</el-button>
        <!-- <el-button type="primary" size="small" @click="handleClick('import')">批量导入</el-button> -->
        <!-- <el-upload action="fakeaction" style="margin: 0 10px; display: inline-block" :http-request="batchImport" :show-file-list="false" accept=".xls, .xlsx">
          <el-button size="small" type="primary">批量导入</el-button>
        </el-upload> -->
      </el-col>
    </el-row>
    <table-item :table-data="list" :column="column" pagination :pagesize="pagination.size" :currentpage="pagination.current" :tableheight="680" border multiple :total="total" :isdelete="true" :isSelect="false" stripe @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" 
      @handleSelectionChange="handleSelectionChange" 
      @delete="handelDelete"
      @rowDblclick="handleDbclick" />
    <el-dialog :visible.sync="dialog" :title="title" width="600px">
      <el-form ref="departmentForm" :model="department" label-width="160px" label-position="right" :rules="departmentRules">
        <el-form-item label="单位/部门简称：" style="margin: 20px 0">
          <el-input v-model="department.shortName" size="small" placeholder="请输入单位/部门简称" />
        </el-form-item>
        <el-form-item label="单位/部门全称：" style="margin: 20px 0" prop="name">
          <el-input v-model="department.name" size="small" placeholder="请输入单位/部门全称" />
        </el-form-item>
        <el-form-item label="单位/部门编码：" prop="code">
          <el-input v-model="department.code" size="small" placeholder="请输入单位/部门编码信息" />
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button @click="handleClick('cancel')">取消</el-button>
        <el-button type="primary" @click="handleClick('confirm')">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { addSection, deleteSection, editSection, departmentBatchImport, getCompany } from '@/api/base'
import TableItem from '@/components/Table'
const column = [
  {
    prop: 'order',
    label: '序号',
    width: 90
  },
  {
    prop: 'name',
    label: '部门名称'
  },
  {
    prop: 'shortName',
    label: '简称'
  },
  {
    prop: 'code',
    label: '部门编码'
  },
  // {
  //   prop: 'statusName',
  //   label: '启/禁用'
  // },
  {
    label: '操作',
    slotScoped: 'action',
    emitWay: 'delete',
    operation: '删除',
    acts: [{ emitWay: 'delete', operation: '删除', color: 'red' }] }
]
export default {
  name: 'Section',
  components: {TableItem},
  data() {
    return {
      dialog: false,
      department: {
        shortName: undefined,
        name: undefined,
        code: undefined
      },
      currType: 1,
      unitTreeSelect: [],
      editData: {}, // 将要被编辑的对象
      departmentRules: {
        name: [{ required: true, message: '请输入单位/部门全称' }],
        code: [{ required: true, message: '请输入单位/部门编码' }]
      },
      column,
      list: [],
      pagination: {
        size: 20,
        current: 1,
      },
      total: 0,
      selections: []
    }
  },
  computed: {
    title() {
      return this.currType === 1 ? '新增' : '编辑'
    }
  },
  watch: {
    dialog(val) {
      if (val === false) {
        Object.keys(this.department).forEach(item => {
          this.department[item] = undefined
        })
        // this.editData = {}
        // this.unitTreeSelect = []
      } else if (val) {
        this.$nextTick(() => {
          this.$refs.departmentForm.clearValidate()
        })
      }
    }
  },
  mounted() {
    this.getUnit()
  },
  methods: {
    // 点击事件
    handleClick(type) {
      if (type === 'add') {
        this.currType = 1
        this.dialog = true
      } else if (type === 'edit') {
        this.currType = 2
        this.editData = this.unitTreeSelect[0];
        const { shortName, name, code } = this.editData
        this.department = { shortName, name, code }
        this.dialog = true
      } else if (type === 'cancel') {
        this.$refs.departmentForm.clearValidate()
        this.dialog = false
      } else if (type === 'confirm') {
        this.$refs.departmentForm.validate(valid => {
          if (valid) {
            if (this.currType === 1) {
              this.addNewUnit()
            } else {
              this.department.id = this.unitTreeSelect[0].id
              this.editUnit()
            }
          } else {
            return false
          }
        })
      } else if (type === 'delete') {
        this.$confirm('确定删除该数据？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteUnit()
        })
      }
    },
    // 新增部门/单位
    addNewUnit() {
      addSection(this.department).then(res => {
        this.dialog = false
        this.getUnit()
      })
    },
    // // 批量导入
    // batchImport(params) {
    //   console.log(params.file.type.indexOf('application/vnd'))
    //   if (params.file.type.indexOf('application/vnd') === -1) {
    //     this.$message({
    //       message: '只能上传excel文件类型!',
    //       type: 'error'
    //     })
    //     return
    //   }
    //   const form = new FormData()
    //   form.append('file', params.file)
    //   departmentBatchImport(form).then(res => {
    //     this.$message({
    //       message: res.result,
    //       type: 'success'
    //     })
    //     this.getUnit()
    //   })
    // },
    // 删除部门/单位
    deleteUnit() {
      let data = ''
      if (this.unitTreeSelect.length === 0) {
        data = this.editData.id
      } else data = this.unitTreeSelect.map(item => item.id).join(',')
      deleteSection({ ids: data }).then(res => {
        if (res.code !== -1) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getUnit()
        }
      })
    },
    // 编辑部门/单位
    editUnit() {
      editSection(this.department).then(res => {
        this.dialog = false
        this.getUnit()
      })
    },
    // 获取单位
    getUnit() {
      this.unitTreeSelect = []
      getCompany(this.pagination).then(res => {
        res.result.records.forEach((item, index) => {
          item.order = index + 1;
        })
        this.list = res.result.records;
        this.total = res.result.total
      })
    },
    // 页码变化
    handleCurrentChange(page) {
      this.pagination.current = page;
      this.getUnit();
    },
    // 条数变化
    handleSizeChange(size) {
      this.pagination.size = size;
      this.getUnit();
    },
    // 获取选择项
    handleSelectionChange(selections) {
      this.unitTreeSelect = selections;
    },
    // 点击删除
    handelDelete(data) {
      this.$confirm('确认删除该条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSection({ ids: data.id.toString() }).then(res => {
          if (res.code !== -1) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getUnit()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },

    //双击查看
    handleDbclick(data) {
      const that = this 
      that.unitTreeSelect = [];
      that.unitTreeSelect.push(data)
      // console.log('双击查看'+JSON.stringify(data))
      that.handleClick('edit')
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-checkbox .is-disabled {
  display: none;
}
</style>
