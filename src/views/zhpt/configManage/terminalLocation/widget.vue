<template>
	<div class="terminal-location-container">
		<div slot="filter">
			<span>名称：</span>
			<el-input placeholder="请输入名称" style="width: 200px" size="small" v-model="search.deviceName"></el-input>
			<el-button type="primary" size="small" @click="queryTerminalLocation">查询</el-button>
			<el-button type="primary" size="small" @click="addTerminalLocation">新增</el-button>
			<el-button type="primary" :disabled="disabledAlter" size="small" @click="alterTerminalLocation('update')">修改</el-button>
			<el-button type="primary" :disabled="disabledDelete" size="small" @click="deleteTerminalLocation">删除</el-button>
		</div>
			<el-table
			class="mapTable"
			:data="source"
			border
			style="width: 100%;margin-top: 8px;"
			height="calc(100% - 88px)"
			stripe
			highlight-current-row
			@row-dblclick="alterTerminalLocation"
			@select="tableSelect"
			@select-all="tableSelect"
			>

			<el-table-column type="selection" width="55" />
			<el-table-column type="index" width="50" label="序号" />
			<el-table-column :formatter="formatter" prop="deviceName" sortable label="标识名称" />
			<el-table-column :formatter="formatter" prop="deviceCode" sortable label="标识编码" />
			<el-table-column :formatter="formatter" prop="state" sortable label="使用状态" />
			<el-table-column :formatter="formatter" prop="notes" sortable label="备注信息" />
			</el-table>
			<el-row style="margin-top: 8px;width:350px;">
			<el-col :span="20">
				<el-pagination
				small
				background
				layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10,20,30,50,100,1000]"
				:current-page="search.current" 
				:page-size="search.size"
				:total="search.total"
				@size-change="changeSize"
				@current-change="changeCurrent"
				@prev-click="changeCurrent"
				@next-click="changeCurrent"
				/>
			</el-col>
			</el-row>

		<el-dialog v-dialogDrag :title="addTitle" :visible.sync="diaVisibleAdd" width="550px">
			<el-form :model="addForm" :rules="addRules" ref="addForm" label-width="120px" style="padding: 0px;">
				<el-form-item label="标识名称：" prop="deviceName" style="margin-top: 5px">
					<el-input v-model="addForm.deviceName" size="small" placeholder="请输入标识名称" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="终端编号：" prop="deviceCode" style="margin-top: 15px">
					<el-input v-model="addForm.deviceCode" size="small" placeholder="请输入终端编号" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="备注：" style="margin-top: 20px">
					<el-input v-model="addForm.notes" type="textarea" size="small" placeholder="请输入备注信息" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="使用状态：" style="margin-top: 20px">
			  		<el-select v-model="addForm.state"  size="small" placeholder="请选择状态" style="width: 350px;" >
						<el-option key="0" value="0" label="未占用"></el-option>
						<el-option key="1" value="1" label="占用"></el-option>
					</el-select>
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
import { terminalLocationQuery, terminalLocationAdd, terminalLocationAlter, terminalLocationDelete } from '@/api/xjConfigManageApi'
const columns = [
	{
		type: 'selection',
		aligin: 'center',
		width: 55
	},
	{
		label: '序号',
		type: 'index',
		aligin: 'center',
    	width: 80
	},
	{
		label: '标识名称',
		aligin: 'center',
		sortable: true,
		prop: 'deviceName',
	},
	{
		label: '标识编码',
		aligin: 'center',
		sortable: true,
		prop: 'deviceCode',
	},
		{
		label: '使用状态',
		aligin: 'center',
		sortable: true,
		prop: 'state',
	},
	{
		label: '备注',
		aligin: 'center',
		sortable: true,
		prop: 'notes',
	}
]
const source = []
export default {
	components: { TableComponent },
	data() {
		return {
			columns,
			source,
			addTitle: '',
			multipleSelection: [],
			search:{
				size:30,
				current:1,
				total:0,
				deviceName:""
			},
			disabledAlter: true, //控制修改按钮是否可点击
			disabledDelete: true, //控制删除按钮是否可点击
			diaVisibleAdd: false, //控制新增弹窗的显示
			addForm: { //新增弹窗的表单数据
				deviceName: '', //标识名称
				deviceCode: '', //终端编号
				notes: '', //备注
				state:"",
				id:""
			},
			addRules: {
				deviceName: [
					{ required: true, message: '请输入标识名称', trigger: 'blur' }
				],
				deviceCode: [
					{ required: true, message: '请输入标识编码', trigger: 'blur' }
				]
			},
			showConfirmAddButton: false,
			showConfirmAlterButton: false
		}
	},
	mounted:function(){
		this.queryTerminalLocation();
	},
	watch:{
			"search.size":function(){
				this.queryTerminalLocation();
		},
			"search.current":function(){
				this.queryTerminalLocation();
		}
	},
	methods: {
		/**
     * 渲染数据处理
    */
    formatter(row, column){
        let typeValue=typeof row[column.property];
        if(typeValue=="undefined"){
            return "-"
        }else if(typeValue=="object"||typeValue=="string"){
            if(!row[column.property]){
                return "-"
            }else{
                return row[column.property]
            }
        }else{
            return row[column.property]
        }
    }, 
		 //翻页改变
        changeCurrent(data) {
            this.search.current = data;
        },
        //页数
        changeSize(data) {
            this.search.size = data;
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
			this.multipleSelection = e;
		},
		//通过接口获取表单数据
		queryTerminalLocation() {
			terminalLocationQuery(this.search).then(res => {
				this.source=res.result.records;
				this.search.total=res.result.total;
			})
		},
		//新增定位终端
		addTerminalLocation() {
			this.addTitle = '新增'
			this.diaVisibleAdd = true
			this.showConfirmAddButton = true
			this.showConfirmAlterButton = false
			console.log(typeof(this.addRules));
		},
		//取消新增
		cancelAdd() {
			this.diaVisibleAdd = false //关闭弹窗
		},
		//确认新增
		confirmAdd(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					let data=JSON.parse(JSON.stringify(this.addForm));
					delete data.id;
					terminalLocationAdd(data).then(res => {
						this.$message({
							type: 'success',
							message: '新增成功'
						})
						this.queryTerminalLocation();
					})
					this.diaVisibleAdd = false
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		//修改表格数据
		alterTerminalLocation(type) {
			this.addTitle = '修改'
			let data = this.multipleSelection[0]
			if(type!='update'){
				data=type
			}
			this.addForm.deviceName = data.deviceName;
			this.addForm.deviceCode = data.deviceCode;
			this.addForm.notes = data.notes;
			this.addForm.state = (data.state=="未占用"?"0":"1");
			this.addForm.id=data.id;
			this.showConfirmAlterButton = true;
			this.showConfirmAddButton = false;
			this.diaVisibleAdd = true;
		},
		//取消修改
		cancelAlter() {
			this.diaVisibleAdd = false
		},
		//确认修改
		confirmAlter(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					terminalLocationAlter(this.addForm).then(res => {
						this.$message({
							type: 'success',
							message: '修改成功'
						})
						this.addForm.deviceName ="";
						this.addForm.deviceCode ="";
						this.addForm.notes ="";
						this.addForm.state ="";
						this.addForm.id="";
						this.queryTerminalLocation();
					})
					this.diaVisibleAdd = false
				} else {
					console.log('error submit!!');
					return false;
				}
			});
			
		},
		//删除表格数据
		deleteTerminalLocation() {
			this.$confirm('确定删除选中的'+this.multipleSelection.length+'条定位终端信息?','提示', {
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
			let ids = [];
			const that = this;
			for(let i = 0; i < this.multipleSelection.length; i++) {
				ids.push(this.multipleSelection[i].id);
			};
			let data={
				ids:ids.join(',')
			};
			terminalLocationDelete(data).then(res => {
				that.$message({
					type: 'success',
					message: '删除成功'
				})
				this.queryTerminalLocation();
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.terminal-location-container {
	padding: 10px;
}
</style>
