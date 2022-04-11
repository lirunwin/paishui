<template>
  <div
    class="app-container"
    style="height:calc(100% - 40px);width:100%;position: absolute;overflow-y: auto;overflow-x: hidden;"
  >
    <!-- 角色权限管理 -->
    <div class="handerRole">
      <div class="data_box">
        <input-item
          can-clear
          type="text"
          placeholder="请输入角色名称"
          title="角色名称："
          nominate="name"
          custom-style="display: inline-block;width: 320px;"
          :value="name"
          :max-length="50"
          :disabled="false"
          :required="false"
          @changeValue="onInputT"
        />
      </div>
      <div class="btn_box">
        <el-button type="primary" size="small" @click="queryRole">查询角色</el-button>
        <el-button type="primary" size="small" @click="handleAdded">新增角色</el-button>
        <el-button :disabled="multipleSelection.length === 0" type="primary" size="small" @click="handleDelete"
          >删除角色</el-button
        >
        <el-button :disabled="disabledEdit" type="primary" size="small" @click="saveEdit">保存修改</el-button>
      </div>
    </div>
    <main style="width: 100%;height: calc(100% - 77px);position: relative;">
      <aside>
        <div class="table_width" style="height:100%">
          <table-item
            :table-data="list"
            :column="column"
            :for-id="true"
            :pagination="true"
            :pagesize="pagination.size"
            :currentpage="pagination.current"
            :tableheight="'100%'"
            :border="true"
            :multiple="true"
            :total="total"
            :fixed="false"
            :isdelete="true"
            :stripe="true"
            :is-select="false"
            @handleCurrentChange="handleCurrentChange"
            @handleSizeChange="handleSizeChange"
            @handleSelectionChange="handleSelectionChange"
            @handleEdit="handleEdit"
            @handleDelete="handleDelete"
          />
        </div>
      </aside>
      <aside>
        <el-form
          ref="form"
          :rules="rules"
          :style="'height:100%'"
          :model="detailed"
          label-width="120px"
          :disabled="disabledEdit"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="detailed.roleName" style="width: 100%" placeholder="请输入角色名称" type="text" />
          </el-form-item>
          <el-form-item label="备注" prop="roleDesc" style="margin: 20px 0">
            <el-input v-model="detailed.roleDesc" style="width: 100%" placeholder="备注说明" type="textarea" />
          </el-form-item>
          <el-form-item class="treeFormItem" required style="height:calc(100% - 160px)" label="系统功能">
            <div class="sys-list">
              <el-tree
                ref="outTree"
                :data="treeData"
                show-checkbox
                node-key="id"
                :props="defaultProps"
                :expand-on-click-node="false"
                :render-content="renderContent"
                @node-expand="changeCss"
              />
            </div>
          </el-form-item>
        </el-form>
      </aside>
    </main>

    <el-dialog
      v-if="dialogVisible"
      v-dialogDrag
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="500px"
      top="10px"
    >
      <el-form :model="ruleForm" ref="formDiv" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input type="text" size="small" v-model="ruleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="roleDesc">
          <el-input type="textarea" small="size" v-model="ruleForm.roleDesc"></el-input>
        </el-form-item>
        <Tree
          ref="Tree"
          title="系统功能"
          nominate="treeValue"
          custom-style="width: 100%;margin-top:20px;"
          treeBoxCustomStyle="max-height:500px;width:calc(100% - 120px);border: 1px solid #E4E7ED;"
          titleBoxCustomStyle="width: 120px;padding-right: 15px;"
          :node-key="'id'"
          :default-expand-all="false"
          :required="true"
          :value="treeData"
          :default-props="defaultProps"
          :default-checked-keys="defaultCheckedKeys"
          @getChangValueTree="getChangValueTree"
        />
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import InputItem from '@/components/FormItem/Input/index.vue'
import Textarea from '@/components/FormItem/Textarea/index.vue'
import Tree from '@/components/Tree/index.vue'
import TableItem from '@/components/Table/index.vue'
import { verification } from '@/utils/index'
import { getRoleList, addRole, editRole, deleteRole, getSystemList, getRoutes, bindMenus } from '@/api/base'
import { ElTree } from 'element-ui/types/tree'
@Component({
  name: 'RolePermission',
  components: { InputItem, TableItem, Textarea, Tree }
})
export default class RolePermission extends Vue {
  listLoading = false
  dialogTitle = '新增角色'
  name = ''
  dialogVisible = false
  disabledEdit = true
  total = 0
  list = []
  column = [
    {
      label: '角色名称',
      prop: 'roleName',
      sortable: true
    },
    {
      label: '备注',
      prop: 'roleDesc',
      sortable: true
    }
  ]
  defaultProps = {
    children: 'childrens',
    label: 'label'
  }
  multipleSelection = []
  detailed = {
    roleName: '', // 角色名称
    roleDesc: '', // 备注
    id: ''
  }
  treeValue = []
  defaultCheckedKeys = []
  deleteId = ''
  pagination = { current: 1, size: 30 } // 分页参数信息
  options = []
  sysId = '1'
  topActive = false
  treeData = []
  lastDetail = {
    roleName: undefined,
    roleDesc: undefined
  }
  //添加需要填写的信息
  ruleForm = {
    roleName: '', //角色名称
    roleDesc: '' //备注
  }
  //添加填写时的验证
  rules = {
    roleName: [
      { required: true, message: '请输入角色名称', trigger: 'blur' },
      { min: 1, max: 10, message: '最多输入10个字', trigger: 'blur' }
    ],
    roleDesc: [
      { required: true, message: '请输入备注', trigger: 'blur' },
      { min: 1, max: 500, message: '最多输入500个字', trigger: 'blur' }
    ]
  }
  @Watch('multipleSelection')
  multipleSelectionChange(value) {
    // console.log('++++++', value)
    this.disabledEdit = this.multipleSelection.length !== 1
    if (this.multipleSelection.length === 1) {
      this.detailed.roleName = this.multipleSelection[0].roleName
      this.detailed.roleDesc = this.multipleSelection[0].roleDesc
      this.detailed.id = this.multipleSelection[0].id
      this.lastDetail.roleName = this.multipleSelection[0].roleName
      this.lastDetail.roleDesc = this.multipleSelection[0].roleDesc
      const existMenus = this.multipleSelection[0].treeValue.split(',')
      this.$refs.outTree['setCheckedKeys']([])
      existMenus.forEach((item) => {
        const node = (this.$refs.outTree as ElTree<any, any>).getNode(item)
        if (node !== null && node.isLeaf) {
          ;(this.$refs.outTree as ElTree<any, any>).setChecked(node, true, false)
        }
      })
    } else if (this.multipleSelection.length !== 1) {
      this.detailed.roleName = ''
      this.detailed.roleDesc = ''
      this.detailed.id = ''
      ;(this.$refs.outTree as ElTree<any, any>).setCheckedKeys([])
    }
  }
  @Watch('dialogVisible')
  dialogVisibleChange(val) {
    if (!val) {
      Object.keys(this.detailed).forEach((key) => {
        this.detailed[key] = ''
      })
      this.ruleForm.roleDesc = ''
      this.ruleForm.roleName = ''
    }
  }
  created() {
    this.fetchData(this.pagination)
    this.getSystemList()
    this.getMenuList()
  }
  // 获取菜单用于赋予角色对应的菜单权限
  getMenuList() {
    function setNull2Arr(arr) {
      for (const item of arr) {
        if (item.childrens === null) item.childrens = []
        setNull2Arr(item.childrens)
      }
      return arr
    }
    getRoutes().then((res) => {
      this.treeData = setNull2Arr(res.result)
    })
  }
  // 自定义树形
  renderContent(h, { node, data, store }) {
    let className = ''
    if (node.childNodes.length === 0 && node.level > 2) {
      className = 'custom-node'
    }
    return h('span', { class: className }, node.label)
  }
  changeCss() {
    this.$nextTick(() => {
      const levelName = document.querySelectorAll('.custom-node')
      for (const i in levelName) {
        if (levelName[i].parentNode) {
          ;(levelName[i].parentNode as HTMLElement).style.float = 'left'
        }
      }
    })
  }
  // 获取角色列表
  fetchData(data) {
    this.listLoading = true
    getRoleList(data).then((res) => {
      this.list = res.result.records
      this.list.forEach((item, index) => {
        item.order = index
      })
      this.total = res.result.total
      this.$refs.form['resetFields']()
      this.listLoading = false
    })
  }
  // 获取系统
  getSystemList() {
    getSystemList().then((res) => {
      const data = []
      res.result.forEach((e) => {
        data.push({
          name: e.sysname,
          id: e.sysid
        })
      })
      this.options = data
    })
  }

  /**
   * 输入框组件数据绑定方法事件
   * @param {*} key
   * @param {*} event
   */
  onInput(key, event) {
    this.detailed[key] = event
  }
  onInputT(key, event) {
    this[key] = event
  }
  onTextarea(key, event) {
    this.detailed[key] = event
  }
  getChangValueTree(key, event) {
    console.log(key, event)
    this[key] = event
  }
  /**
   * 下拉选择组件数据绑定方法事件
   */
  changeSelectValue(key, event) {
    this[key] = event
  }
  //  页码
  handleCurrentChange(currentPage) {
    this.pagination.current = currentPage
    this.fetchData(this.pagination)
  }
  // 条数
  handleSizeChange(size = 1) {
    this.pagination = {
      ...this.pagination,
      size,
      current: 1
    }
    this.fetchData(this.pagination)
  }
  // 选择
  handleSelectionChange(value) {
    this.multipleSelection = value
    this.$refs.form['resetFields']()
    console.log('1111', value)
  }
  // 修改
  handleEdit() {
    this.dialogTitle = '修改角色'
    this.dialogVisible = true
    console.log('编辑', this.multipleSelection)
    const value = this.multipleSelection[0]
    this.detailed.roleName = value.roleName
    this.detailed.roleDesc = value.roleDesc
    this.defaultCheckedKeys = value.treeValue.split(',')
    this.detailed.id = value.id
    this.sysId = value.sysId
  }
  // 保存修改
  saveEdit() {
    this.dialogTitle = '编辑角色'
    const selected = (this.$refs.outTree as ElTree<any, any>).getCheckedNodes().map((item) => item.id)
    const halfSelected = (this.$refs.outTree as ElTree<any, any>).getHalfCheckedKeys().map((item) => item)
    this.treeValue = [...selected, ...halfSelected]
    this.submitRole('update')
  }
  // 删除
  handleDelete() {
    console.log('删除', this.multipleSelection)
    if (this.multipleSelection.length > 0) {
      const ids = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        ids.push(this.multipleSelection[i].id)
      }
      this.deleteId = ids.toString()
      this.$confirm('确定删除选中的' + ids.length + '名角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.confirmDelete()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    } else {
      this.$message.error('请选择要删除的数据')
    }
  }
  confirmDelete() {
    deleteRole({ ids: this.deleteId })
      .then((res) => {
        if (res.code !== -1) {
          this.$message.success('删除成功')
          this.fetchData(this.pagination)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  // 查询
  queryRole() {
    this.pagination.current = 1
    const data = Object.assign({}, this.pagination, { roleName: this.name })
    this.fetchData(data)
  }

  queryRoleAll() {
    this.fetchData(this.pagination)
  }
  handleAdded() {
    this.dialogTitle = '新增角色'
    this.dialogVisible = true
    this.detailed = {
      roleName: '', // 角色名称
      roleDesc: '', // 备注
      id: ''
    }
    this.defaultCheckedKeys = []
    this.sysId = '1'
    this.treeValue = []
    console.log('新增')
  }
  // 提交
  submitRole(type) {
    let refDom = this.$refs['formDiv']
    if (type == 'update') {
      refDom = this.$refs['form']
    } else {
      this.detailed.roleName = this.ruleForm.roleName
      this.detailed.roleDesc = this.ruleForm.roleDesc
    }
    refDom['validate']((valid) => {
      if (valid) {
        const verificationResult = verification([
          { condition: !this.detailed.roleName, errmsg: '请输入角色名称' },
          { condition: !this.detailed.roleDesc, errmsg: '请输入备注说明' },
          { condition: this.treeValue.length === 0, errmsg: '请选择权限' },
          { condition: !this.sysId, errmsg: '请选择系统名称' }
        ])
        if (!verificationResult.success) {
          this.$message.error(verificationResult.errmsg[0])
          return false
        }
        console.log('data', { ...this.detailed, treeValue: this.treeValue })
        if (this.dialogTitle === '新增角色') {
          this.newAddRole()
        } else {
          this.editRole()
        }
      } else {
        return false
      }
    })
  }
  // 新增
  newAddRole() {
    addRole(this.splicingData()).then((res) => {
      if (res.code !== -1) {
        this.$message.success('新增成功')
        this.dialogVisible = false
        this.$refs.formDiv['resetFields']()
        this.fetchData(this.pagination)
      }
    })
  }
  // 修改
  editRole() {
    const data = Object.assign(this.splicingData(), { id: this.detailed.id })
    bindMenus(data).then((res) => {
      if (res.code !== -1) {
        if (res.result.code === -1) {
          this.$message.error(res.result.message)
        } else {
          this.$message.success('修改成功')
          this.dialogVisible = false
          this.fetchData(this.pagination)
        }
      }
    })
  }

  // 拼接数据
  splicingData() {
    const param = {
      roleName: this.lastDetail.roleName === this.detailed.roleName ? null : this.detailed.roleName,
      roleDesc: this.lastDetail.roleDesc === this.detailed.roleDesc ? null : this.detailed.roleDesc,
      menuIds: this.treeValue.join(',')
    }
    return param
  }
}
</script>
<style lang="scss" scoped>
.handerRole {
  line-height: 57px;
  margin: 0px 0px 20px;
  .data_box {
    display: inline-block;
  }
  .btn_box {
    display: inline-block;
  }
}
.doalog-content {
  width: 100%;
}
/deep/.treeFormItem {
  div.el-form-item__content {
    height: 100% !important;
  }
}
main {
  display: flex;
  aside {
    width: 45%;
    &:nth-of-type(2) {
      flex: 1;
      .sys-list {
        height: 100%;
        width: 100%;
        border: 1px solid #e4e7ed;
        overflow-x: hidden;
        /deep/ .el-tree-node__content {
          &:hover {
            background: #ffffff;
          }
        }
        // &::-webkit-scrollbar {
        //   width: 4px;
        //   background: white;
        // }
        // &::-webkit-scrollbar-corner, /* 滚动条角落 */
        //   &::-webkit-scrollbar-thumb,
        //   &::-webkit-scrollbar-track {
        //   border-radius: 4px;
        // }
        // &::-webkit-scrollbar-corner,
        // &::-webkit-scrollbar-track {
        //   /* 滚动条轨道 */
        //   background-color: rgba(180, 160, 120, 0.1);
        //   box-shadow: inset 0 0 1px rgba(180, 160, 120, 0.5);
        // }
        // &::-webkit-scrollbar-thumb {
        //   /* 滚动条手柄 */
        //   background-color: #cccccc;
        // }
      }
    }
  }
}
</style>
