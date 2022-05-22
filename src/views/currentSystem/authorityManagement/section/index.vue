<template>
  <div
    class="app-container"
    style="position: absolute;height:calc(100% - 40px);width:100%;overflow-y: auto;overflow-x: hidden;"
  >
    <!-- 部门管理 -->
    <el-row type="flex" style="margin-bottom: 20px">
      <el-col :span="10">
        <el-button type="primary" size="small" @click="handleClick('add')">新增</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="deptmentTree"
      style="width: 100%;margin-bottom: 20px;"
      :height="'calc(100% - 72px)'"
      row-key="id"
      border
      default-expand-all
      @row-dblclick="handleDbclick"
      @select="handleSelectionChange"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <template slot="empty">
        <img src="@/assets/icon/null.png" alt="" />
        <p class="empty-p">暂无数据</p>
      </template>
      <!-- <el-table-column type="selection" align='center' width="55"  /> -->
      <!-- <el-table-column type="index" width="50" label="序号" /> -->
      <el-table-column prop="name" header-align="center" sortable label="部门名称" show-overflow-tooltip />
      <el-table-column prop="shortName" align="center" sortable label="简称" show-overflow-tooltip />
      <el-table-column prop="code" align="center" sortable label="部门编码" show-overflow-tooltip />
      <el-table-column label="操作" align="center" width="100">
        <template v-slot="scope">
          <el-button type="text" size="small" @click="handelDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialog" v-dialogDrag :title="title" width="600px">
      <el-form
        ref="departmentForm"
        :model="department"
        label-width="160px"
        label-position="right"
        :rules="departmentRules"
      >
        <el-form-item label="上级单位：" style="margin: 20px 0">
          <el-cascader
            popper-class="cascader"
            v-model="department.parentId"
            :options="deptmentTree"
            :props="{ expandTrigger: 'hover', label: 'name', value: 'id', checkStrictly: true }"
            size="small"
            style="width:100%"
            filterable
            clearable
          />
          <!-- <el-select v-model="department.parentId" clearable size="small" placeholder="请选择上级部门">
            <el-option v-for="item in departmentList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select> -->
        </el-form-item>
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

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { addSection, deleteSection, editSection, departmentBatchImport, getAllDepartments } from '@/api/base'
import TableItem from '@/components/Table/index.vue'
import { ElForm } from 'element-ui/types/form'
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
  {
    label: '操作',
    slotScoped: 'action',
    emitWay: 'delete',
    operation: '删除',
    acts: [{ emitWay: 'delete', operation: '删除', color: 'red' }]
  }
]
@Component({
  name: 'Section',
  components: { TableItem }
})
export default class Section extends Vue {
  dialog = false
  department = {
    shortName: undefined,
    name: undefined,
    code: undefined,
    id: undefined,
    parentId: undefined
  }
  currType = 1
  unitTreeSelect = []
  editData = null // 将要被编辑的对象
  departmentRules = {
    name: [{ required: true, message: '请输入单位/部门全称' }],
    code: [{ required: true, message: '请输入单位/部门编码' }]
  }
  departmentList = [] //所有部门
  column = column
  list = []
  pagination = {
    size: 30,
    current: 1
  }
  total = 0
  selections = []
  get title() {
    return this.currType === 1 ? '新增单位' : '修改单位'
  }
  @Watch('dialog')
  dialogChange(val) {
    if (val === false) {
      Object.keys(this.department).forEach((item) => {
        this.department[item] = undefined
      })
      // this.editData = {}
      // this.unitTreeSelect = []
    } else if (val) {
      this.$nextTick(() => {
        ;(this.$refs.departmentForm as ElForm).clearValidate()
      })
    }
  }
  mounted() {
    this.getAllUnit()
  }
  // 点击事件
  handleClick(type) {
    if (type === 'add') {
      this.currType = 1
      this.dialog = true
      // this.getAllUnit()
    } else if (type === 'edit') {
      this.currType = 2
      this.editData = this.unitTreeSelect[0]
      const { shortName, name, code, parentId } = this.editData
      this.department = { shortName, name, code, id: undefined, parentId }
      this.dialog = true
      // this.getAllUnit();
    } else if (type === 'cancel') {
      ;(this.$refs.departmentForm as ElForm).clearValidate()
      this.dialog = false
    } else if (type === 'confirm') {
      ;(this.$refs.departmentForm as ElForm).validate((valid) => {
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
      this.$confirm(
        '删除选中的' + this.unitTreeSelect.length + '个单位,删除这些单位将同时删除其下属单位，请确定?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.deleteUnit()
      })
    }
  }

  get deptInfo() {
    const { parentId } = this.department
    return {
      ...this.department,
      parentId: Array.isArray(parentId) ? parentId.pop() : parentId
    }
  }
  // 新增部门/单位
  addNewUnit() {
    addSection(this.deptInfo).then((res) => {
      if (res.code === 1) {
        this.dialog = false
        this.$message({ type: 'success', message: '添加成功!' })
        this.getAllUnit()
      }
    })
  }
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
    } else data = this.unitTreeSelect.map((item) => item.id).join(',')
    deleteSection({ ids: data }).then((res) => {
      if (res.code !== -1) {
        this.$message({ type: 'success', message: '删除成功!' })
        this.getAllUnit()
      }
    })
  }
  // 编辑部门/单位
  editUnit() {
    editSection(this.deptInfo).then((res) => {
      if (res.code === 1) {
        this.dialog = false
        this.$message({ type: 'success', message: '修改成功!' })
        this.getAllUnit()
      }
    })
  }

  // 获取所有单位
  getAllUnit() {
    this.unitTreeSelect = []
    getAllDepartments().then((res) => {
      console.log(res)
      this.departmentList = res.result || []
    })
  }

  get deptmentTree() {
    const getChildren = (parent) => {
      const { id: parentId } = parent
      const children = this.departmentList.filter((item) => item.parentId === parentId)
      if (!!children.length) parent.children = children.map(getChildren)
      return parent
    }
    return this.departmentList.filter((item) => !item.parentId).map(getChildren)
  }

  handleSelectionChange(selections) {
    this.unitTreeSelect = selections
  }
  // 点击删除
  handelDelete(data) {
    this.$confirm('删除本单位，将同时删除其下属单位，请确定是否继续删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteSection({ ids: data.id.toString() }).then((res) => {
          if (res.code !== -1) {
            this.$message({ type: 'success', message: '删除成功!' })
            this.getAllUnit()
          }
        })
      })
      .catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
  }

  //双击查看
  handleDbclick(data) {
    const that = this
    that.unitTreeSelect = []
    that.unitTreeSelect.push(data)
    // console.log('双击查看'+JSON.stringify(data))
    that.handleClick('edit')
  }
}
</script>

<style lang="scss">
.cascader {
  /deep/ .el-cascader-panel {
    .el-radio {
      width: 100%;
      height: 100%;
      z-index: 10;
      position: absolute;
      top: 10px;
      right: 10px;
    }
    .el-radio__input {
      visibility: hidden;
    }
    .el-cascader-node__postfix {
      top: 10px;
    }
  }
}
</style>
