<template>
	<div class="inspection-container">
		<table-component :tableColumns="columns" ref="table1" :tableData="source" @select="tableSelect" :pageInfo="pageInfo"  
			@selection-change="handleSelectionChange"
			@size-change="handleSizeChange"
			@row-dblclick="alterProblemReason"
			@current-change="handleCurrentChange" >
			<template slot="filter">
				<span>隐患等级：</span>
				<el-input v-model="typeName" placeholder="请输入隐患等级" style="width: 200px" size="small"></el-input>
				<el-button type="primary" size="small" @click="queryProblemReason">查询</el-button>
				<el-button type="primary" size="small" @click="addProblemReason">新增</el-button>
				<el-button type="primary" :disabled="disabledAlter" size="small" @click="alterProblemReason('update')">修改</el-button>
				<el-button type="primary" :disabled="disabledDelete" size="small" @click="deleteProblemReason">删除</el-button>
			</template>
		</table-component>
		<el-dialog v-dialogDrag :title="addTitle" :visible.sync="diaVisibleAdd" width="550px">
			<el-form :model="addForm" :rules="addRules" ref="addForm" label-width="120px" style="padding: 0px;">
				<el-form-item label="隐患等级：" prop="name" style="margin-top: 5px">
					<el-input v-model="addForm.name" size="small" placeholder="请输入隐患等级" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="备注：" style="margin-top: 20px">
					<el-input v-model="addForm.notes" type="textarea" size="small" placeholder="请输入备注信息" style="width: 350px;"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button size="small" v-show="showConfirmAddButton" @click="cancelAdd()">取 消</el-button>
				<el-button size="small" v-show="showConfirmAddButton" type="primary" @click="confirmAdd('addForm')">确 定</el-button>
				<el-button size="small" v-show="showConfirmAlterButton" @click="cancelAlter()">取 消</el-button>
				<el-button size="small" v-show="showConfirmAlterButton" type="primary" @click="confirmAlter('addForm')">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import TableComponent from '../components/TableComponent'
import { troubleLevelQuery, troubleLevelAdd, troubleLevelAlter,troubleLevelDelete } from '@/api/xjConfigManageApi'
const columns = [
	{
		type: 'selection',
		aligin: 'center',
		width: 55
	},
	{
		label: '序号',
		aligin: 'center',
    	width: 80,
		prop: 'index'
	},
	{
		label: '隐患等级',
		aligin: 'center',
		sortable: true,
		prop: 'name'
	},
	{
		label: '备注',
		sortable: true,
		aligin: 'center',
		prop: 'notes',
		width: ''
	}
]
export default {
	components: { TableComponent },
	data() {
		return {
			columns,
			source : [],	//存储表单数据
			pageInfo: { current: 1,  size: 10, tableTotal:1 },			//分页数据
			typeName: '', //绑定首页名称
			addTitle: '',
			updateRow:null,
			multipleSelection: [],
			disabledAlter: true, //控制修改按钮是否可点击
			disabledDelete: true, //控制删除按钮是否可点击
			diaVisibleAdd: false, //控制新增弹窗的显示
			addForm: { //新增弹窗的表单数据
				name: '', //隐患等级
				notes: '' //备注
			},
			addRules: {
				name: [
					{ required: true, message: '请输入隐患等级', trigger: 'blur' }
				]
			},
			showConfirmAddButton: false,
			showConfirmAlterButton: false
		}
	},
	mounted(){
		this.queryProblemReason()
	},
	methods: {
		//选中表格行时触发事件
		handleSelectionChange(val) {
			this.multipleSelection = val
		},
		//表格被选中时进行判断，控制button是否可点击
		tableSelect(e, s) {
			if(e.length < 1) {
				this.disabledAlter = true //不可点击
				this.disabledDelete = true //不可点击
			} else if(e.length === 1) {
				this.disabledAlter = false
				this.disabledDelete = false
			} else {
				this.disabledAlter =true
				this.disabledDelete = false
			}
		},
		//获取首页表单数据
		getData() {
			var that = this;
			that.source = []
			that.disabledAlter = true //编辑按钮不可点击
			that.disabledDelete = true //删除按钮不可点击

			//追加分页参数
			const query = that.pageInfo
			let data = {
				name: that.typeName
			}
      		Object.assign(query, data)


			troubleLevelQuery(query).then(res => {
				console.log(res);
				//分页数据
				var totalIndex = ((that.pageInfo.current - 1) * that.pageInfo.size);
				var _index = 0;
				that.pageInfo.tableTotal = res.result.total
				res.result.records.forEach(element => {
					_index++
					that.source.push({
						index:totalIndex+_index,
						id:element.id,
						name: element.name,
						notes: element.notes
					});
				});
			})
		},

		/**
		 * @description 分页每页条数
		 */
		handleSizeChange(pageSize) {
			this.pageInfo.size = pageSize
			this.getData()
		},
		/**
		 * @description 改变当前页
		 */
		handleCurrentChange(currentPage) {
			this.pageInfo.current = currentPage
			this.getData()
		},

		//通过接口获取表单数据
		queryProblemReason() {
			this.pageInfo.current=1
			this.getData()
		},
		//清空addForm里面的数据
		clearAddFormData() {
			for(let i in this.addForm) { //清空新增弹窗内的数据
				this.addForm[i] = ''
			}
			this.$refs.table1.$refs.tableRef.clearSelection()
			this.tableSelect(this.$refs.table1.$refs.tableRef.selection)
		},
		//新增隐患等级
		addProblemReason() {
			this.addTitle = '新增'
			this.diaVisibleAdd = true
			this.showConfirmAddButton = true
			this.showConfirmAlterButton = false
		},
		//取消新增
		cancelAdd() {
			this.diaVisibleAdd = false //关闭弹窗
			this.clearAddFormData()
		},
		//确认新增
		confirmAdd(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					let addInfo = {
						name:this.addForm.name, 
						notes: this.addForm.notes
					}
					troubleLevelAdd(addInfo).then(res => {
						this.clearAddFormData()
						this.getData()
						this.diaVisibleAdd = false //关闭弹窗
					})
					// this.source.push(addInfo)
					// this.diaVisibleAdd = false
					// this.clearAddFormData()
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		//修改表格数据
		alterProblemReason(type) {
			this.addTitle = '修改'
			let data = this.$refs.table1.$refs.tableRef.selection[0]
			if(type!='update'){
				data=type
			};
			this.updateRow=data;
			this.addForm.name = data.name
			this.addForm.notes = data.notes
			this.showConfirmAlterButton = true
			this.showConfirmAddButton = false
			this.diaVisibleAdd = true
		},
		//取消修改
		cancelAlter() {
			this.diaVisibleAdd = false
			this.clearAddFormData()
		},
		//确认修改
		confirmAlter(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					let info = this.updateRow
					let data = {
						id: info.id,
						name: this.addForm.name,
						notes: this.addForm.notes
					}

					troubleLevelAlter(data).then(res => {
						this.clearAddFormData()
						this.getData()
						this.diaVisibleAdd = false
					})
					
					// data.problemReason = this.addForm.problemReason
					// data.layerName = this.addForm.layerName
					// data.notes = this.addForm.notes
					// this.clearAddFormData()
					// this.diaVisibleAdd = false
				} else {
					console.log('error submit!!');
					return false;
				}
			});
			
		},
		//删除表格数据
		deleteProblemReason() {
			this.$confirm('确定删除选中的'+this.multipleSelection.length+'条隐患等级信息?','提示', {
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
		//确认删除数据行
		confirmDelete() {
			const that = this
			const ids = []
			for(let i = 0; i < this.multipleSelection.length; i++) {
				ids.push(this.multipleSelection[i].id)
			}
			let data = {
				ids: ids.toString()
			}
			troubleLevelDelete(data).then(res => {
				console.log(res)
				that.getData()
				that.$message({
					type: 'success',
					message: '删除成功'
				})
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

