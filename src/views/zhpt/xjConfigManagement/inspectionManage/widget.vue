<template>
  <div class="inspection-container">
    <div class="filter">
      <span>名称：</span>
      <el-input v-model="typeName" placeholder="请输入名称" style="width: 200px" size="small"></el-input>
      <el-button type="primary" size="small" @click="queryXjType">查询</el-button>
      <el-button type="primary" size="small" @click="addXjType">新增</el-button>
      <el-button type="primary" :disabled="disabledAlter" size="small" @click="alterXjType('update')">修改</el-button>
      <el-button type="primary" :disabled="disabledDelete" size="small" @click="deleteXjType">删除</el-button>
    </div>
    <div class="mainTable" style="margin-top: 8px; padding: 5px; height: calc(100% - 80px)">
      <el-table @row-dblclick='alterXjType' :data="tableData" ref="table1" border stripe style="width: 100%;" height="100%" @select="tableSelect" @select-all="tableSelect">
        <el-table-column type="selection" width="55px" align="center"></el-table-column>
        <el-table-column type="index" label="序号" width="80px" sortable align="center"></el-table-column>
        <el-table-column prop="name" :formatter="formatter" label="类型名称" sortable align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="layerName" :formatter="formatter" label="图层名称" sortable align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="note" :formatter="formatter" label="备注" align="center" sortable show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <el-pagination small background :current-page="search.current" :page-size="search.size" layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10,20,30,50,100,1000]" :total="search.total" @size-change="changeSize" @current-change="changeCurrent" @prev-click="changeCurrent" @next-click="changeCurrent" />
    <!-- <el-pagination small layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 25, 50, 100]" 
				:current-page="search.current" 
				:page-size="search.size"
				@size-change="changeSize"
				@current-change="changeCurrent"
				@prev-click="changeCurrent"
				@next-click="changeCurrent"	:total="search.tableTotal"></el-pagination> -->
    <el-dialog v-dialogDrag :title="addTitle" :visible.sync="diaVisibleAdd" width="550px">
      <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="120px">
        <el-form-item label="类型名称：" prop="typeName" style="margin-top: 5px">
          <el-input v-model="addForm.typeName" size="small" placeholder="请输入类型名称" style="width: 350px;"></el-input>
        </el-form-item>
        <el-form-item label="图层名称：" prop="layerName" style="margin-top: 15px">
          <el-select v-model="addForm.layerNameEn" size="small" placeholder="请选择图层" style="width: 350px;" @change="layerSelectChange">
            <el-option v-for="item in layerNames" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注：" style="margin-top: 20px">
          <el-input v-model="addForm.notes" type="textarea" size="small" placeholder="请输入备注信息" style="width: 350px;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" v-show="showConfirmAddButton" @click="clearFormData">取 消</el-button>
        <el-button size="small" v-show="showConfirmAddButton" type="primary" @click="confirmAdd('addForm')">确 定</el-button>
        <el-button size="small" v-show="showConfirmAlterButton" @click="clearFormData">取 消</el-button>
        <el-button size="small" v-show="showConfirmAlterButton" type="primary" @click="confirmAlter('addForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { xjTypeQuery, xjTypeAdd, xjTypeAlter, xjTypeDelete } from '@/api/xjConfigManageApi'
import { geteSessionStorage } from '@/utils/auth'
//目前配置
const equipmentLayerId = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

export default {
  components: {},
  data() {
    return {
      addTitle: '',
      typeName: '', //绑定首页名称
      tableTotal: 0, //首页表格数据总条数
      tableData: [], //存储表单数据
      pageInfo: { current: 1, size: 30 }, //分页信息
      updateRow: null,
      multipleSelection: [], //用来存储被选中行的id
      disabledAlter: true, //控制修改按钮是否可点击
      disabledDelete: true, //控制删除按钮是否可点击
      diaVisibleAdd: false, //控制新增弹窗的显示
      appconfig: this.$store.getters.appconfig,//地图服务配置
      search: {
        size: 30,
        current: 1,
        total: 0,
        deviceName: ""
      },
      layerNames: [
        { value: 999, label: '巡检点' },
        { value: 1000, label: '巡检线' }
      ],//图层名称
      addForm: { //新增弹窗的表单数据
        typeName: '', //类型名称
        layerName: '',//图层中文名称
        layerNameEn: '',//图层英文名称
        notes: '' //备注
      },
      addRules: {
        typeName: [
          { required: true, message: '请输入类型名称', trigger: 'blur' }
        ],
        layerName: [
          { required: true, message: '请选择图层名称', trigger: 'change' }
        ]
      },
      showConfirmAddButton: false,
      showConfirmAlterButton: false
    }
  },
  watch: {
    "search.size": function () {
      this.getData();
    },
    "search.current": function () {
      this.getData();
    }
  },
  mounted() {
    this.queryXjType()
    debugger;
    //获取图层信息
    $.ajax({
      url: this.appconfig.gisResource.business_map.config[0].url + "/layers.json",
      type: 'GET',
      success: (result) => {
        if (!result.length) return this.$message.error('图层获取失败')
        const data = result[0].subLayers.layers;

        this.layerNames = [{ value: 'inspectionPoint', label: '巡检点' }, { value: 'inspectionLine', label: '巡检线' }, { value: 'hiddenDangerPoint', label: '隐患点' }]
        for (let i = 0, ii = data.length; i < ii; i++) {
          var layergroup = data[i].subLayers.layers;
          for (let j = 0, jj = layergroup.length; j < jj; j++) {
            const layer = layergroup[j]
            this.layerNames.push({ value: layer.name, label: layer.caption })
          }

        }
      },
      error: (error) => this.$message.error(error)
    })
  },
  methods: {
    /**
     * 该方法用于监听图层选择器
     */
    layerSelectChange(val) {
      const layer = this.layerNames.find(item => { return item.value === val });
      if (layer) {
        this.addForm.layerName = layer.label;
      }
    },
    /**
     * 渲染数据处理
    */
    formatter(row, column) {
      let typeValue = typeof row[column.property];
      if (typeValue == "undefined") {
        return "-"
      } else if (typeValue == "object" || typeValue == "string") {
        if (!row[column.property]) {
          return "-"
        } else {
          return row[column.property]
        }
      } else {
        return row[column.property]
      }
    },
    //表格被选中时进行判断，控制button是否可点击
    tableSelect(e, s) {
      if (e.length < 1) {
        this.disabledAlter = true //不可点击
        this.disabledDelete = true //不可点击
      } else if (e.length === 1) {
        this.disabledAlter = false
        this.disabledDelete = false
      } else {
        this.disabledAlter = true
        this.disabledDelete = false
      }
      console.log(e);
      this.multipleSelection = e;
    },
    //获取首页表单数据
    getData() {
      this.source = []
      this.disabledAlter = true //编辑按钮不可点击
      this.disabledDelete = true //删除按钮不可点击
      this.search.name = this.typeName;
      xjTypeQuery(this.search).then(res => {
        this.tableData = res.result.records
        this.search.total = res.result.total;
      })
    },
    //点击首页查询按钮后触发事件
    queryXjType() {
      this.getData()
    },
    //清空添加/修改弹窗内的信息
    clearFormData() {
      this.addForm.typeName = ''
      this.addForm.layerName = ''
      this.addForm.notes = ''
      this.diaVisibleAdd = false
    },
    //新增巡检类型
    addXjType() {
      this.addTitle = '新增'
      this.diaVisibleAdd = true
      this.showConfirmAddButton = true
      this.showConfirmAlterButton = false
    },
    //确认新增
    confirmAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let addInfo = {
            createUser: Number(geteSessionStorage('userId')), //创建人信息
            name: this.addForm.typeName, //类型名称
            layerName: this.addForm.layerName, //图层中文名称
            layerNameEn: this.addForm.layerNameEn,//图层英文名称
            note: this.addForm.notes //备注信息
          }
          xjTypeAdd(addInfo).then(res => {
            this.clearFormData()
            this.getData()
            this.diaVisibleAdd = false //关闭弹窗
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //点击修改按钮触发事件
    alterXjType(type) {
      this.addTitle = '修改'
      let data = this.$refs.table1.selection[0]
      if (type != 'update') {
        data = type;
      }
      this.updateRow = data;
      this.addForm.typeName = data.name
      this.addForm.layerName = data.layerName
      this.addForm.notes = data.note
      this.showConfirmAlterButton = true
      this.showConfirmAddButton = false
      this.diaVisibleAdd = true
    },
    //翻页改变
    changeCurrent(data) {
      this.search.current = data;
    },
    //页数
    changeSize(data) {
      this.search.size = data;
    },
    //确认修改
    confirmAlter(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = this.updateRow
          info.typeName = this.addForm.typeName
          info.layerName = this.addForm.layerName
          info.notes = this.addForm.notes
          let data = {
            id: info.id,
            name: this.addForm.typeName,
            layerName: this.addForm.layerName,
            note: this.addForm.notes
          }
          xjTypeAlter(data).then(res => {
            this.getData()
            this.clearFormData()
            this.diaVisibleAdd = false
          }).catch(err => {
            console.log(err);
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //删除表格数据
    deleteXjType() {
      this.$confirm('确定删除选中的' + this.multipleSelection.length + '条巡检类型信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.confirmDelete()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      })
    },
    //确认删除
    confirmDelete() {
      const that = this
      let ids = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        ids.push(this.multipleSelection[i].id)
      }
      const data = {
        idList: ids.toString()
      }
      xjTypeDelete(data).then(res => {
        this.getData()
        that.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(err => {
        console.log(err);
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.inspection-container {
  padding: 10px;
}
</style>

