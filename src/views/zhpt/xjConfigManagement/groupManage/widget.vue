<template>
	<div class="group-manage-container">
		<el-row :gutter="20" style="height: 100%">
			<el-col :span="10" style="height: 100%">
				<el-button type="primary" size="small" @click="handleAppend()">新增分组</el-button>
				<el-button type="primary" size="small" :disabled="disabledAlter" @click="handleAlter()">修改分组</el-button>
				<el-button type="primary" size="small" :disabled="disabledDelete" @click="handleRemoveGroup()">删除分组</el-button>
				<el-tree :data="groupData" show-checkbox node-key="id" ref="groupTree" empty-text="暂无分组" :props="defaultProps" :default-expand-all="true"
						@check-change="handleCheckChangeLeft" style="height: calc(100% - 80px); margin-top: 20px;overflow: auto;"></el-tree>
			</el-col>
			<el-col :span="2" style="height: 100%" class="center">
				<div class="btn-group">
					<el-button type="primary"  size="small" icon="el-icon-d-arrow-left" :disabled="disabledAddMembers" title='部门分组添加人员'  @click="appendMembersToGroup()"></el-button>
					<el-button type="primary"  size="small" icon="el-icon-d-arrow-right" :disabled="disabledRemoveMembers" title='部门分组移除人员'  @click="removeMembersOfGroup()"></el-button>
				</div>
			</el-col>
			<el-col :span="8" style="height: 100%;"  :offset="4">
				<el-tree default-expand-all :data="personData" show-checkbox node-key="id" ref="membersTree" :props="defaultProps" 
					@check-change="handleCheckChangeRight" style="height: calc(100% - 80px); margin-top: 20px;overflow: auto;"></el-tree>
			</el-col>
		</el-row>
		<el-dialog v-dialogDrag :title="addTitle" :visible.sync="diaVisibleAdd" width="400px">
			<el-form :model="addForm" :rules="addRules" ref="addForm" label-width="100px">
				<el-form-item label="分组名称：" prop="groupName">
					<el-input v-model="addForm.groupName" size="small" style="width: 200px" placeholder="请输入分组名称"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button size="small" v-show="showConfirmAddButton" @click="cancelAppend('addForm')">取 消</el-button>
				<el-button size="small" v-show="showConfirmAddButton" type="primary" @click="confirmAppend('addForm')">确 定</el-button>
				<el-button size="small" v-show="showConfirmAlterButton" @click="cancelAlter('addForm')">取 消</el-button>
				<el-button size="small" v-show="showConfirmAlterButton" type="primary" @click="confirmAlter('addForm')">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { groupManageAdd, groupManageAlter, groupManageDelete, groupMembersAdd, groupMembersRemove, groupQuery, membersQuery } from '@/api/xjConfigManageApi'
export default {
	data() {
		var checkGroupName = (rule, value, callback) => {
			if(!value) {
				return callback(new Error('分组名称不能为空'))
			} else {
				for(let i in this.groupData) {
					if(value === this.groupData[i].label) {
						callback(new Error('分组已存在'))
					}
				}
				callback()
			}
		}
		return {
			diaVisibleAdd: false, //控制添加弹窗的显示
			showConfirmAddButton: false, //控制确认增加按钮的显示
			showConfirmAlterButton: false, //控制确认修改按钮的显示
			addTitle: '', //增加/修改弹窗的标题
			addForm: { //增加model
				groupName: ''
			},
			addRules: { //增加时的验证规则
				groupName: [
					{ required: true, validator: checkGroupName, trigger: 'blur' }
				]
			},
			disabledAlter: true, //修改按钮是否可点击
			disabledDelete: true, //删除按钮是否可点击
			disabledAddMembers: true, //添加组员按钮是否可点击
			disabledRemoveMembers: true, //移除组员按钮是否可点击
			groupData: [], //存储分组信息
			defaultProps: {
				children: 'children',
				label: 'label'
			},
			groupChildren: [], //分组内成员信息暂存
			personData: [] //存储成员信息
		}
	},
	computed:{},
	watch: {
	},
	mounted() {
		// this.getGroups() //获取分组信息
		// this.getMembers() //获取成员信息
		this.fresh();
	},

	methods: {
		fresh(){
			this.disabledAddMembers=true, //添加组员按钮是否可点击
			this.disabledRemoveMembers=true, //移除组员按钮是否可点击
			this.getGroups() //获取分组信息
			this.getMembers() //获取成员信息
		},
		//去除数组内重复元素
		oSort(arr){
			for(var i = 0;i < arr.length;i++){
				for(var j = i + 1;j < arr.length ; j++){
					if( arr[i].groupId == arr[j].groupId){
						// delete arr[j];
						arr.splice(j,1)
						j--;
					}
				}
			}
			return arr
		},
		//获取分组数据和成员数据
		getGroups() {
			groupQuery().then(res => {
				this.groupData = []
				let data = this.oSort(res.result.groupUserVoList)
				for(let item of data) {
					let info = {
						label: item.groupName,
						id: item.groupId,
						children: []
					}
					this.groupData.push(info)
				}
			})
		},
		//获取成员信息
		getMembers() {
			membersQuery().then(res => {
				this.personData = []
				let children = []
				let info = {}
				for(let item of res.result.groupUserDeptVoList) {
					let child = {
						id: !item ? '' : item.userId,
						label: !item ? '' : item.userName
					}
					children.push(child)
					info = {
						label: !item ? '' : item.deptName,
						id: !item ? '' : item.deptId,
						children: children
					}
				}
				this.personData.push(info)
				this.groupChildren = []
				for(let item of res.result.groupUserVoList) {
					for(let item_ of this.groupData) { //获取分组
						if(item.groupId == item_.id) {
							if(item.id != null) {
								this.groupChildren.push({ id: item.userId, label: item.userIdName, groupId: item.groupId })
							}
						}
					}
				}
				for(let item of this.groupChildren) {
					for(let item_ of this.groupData) {
						if(item.groupId == item_.id) {
							item_.children.push(item)
						}
					}
				}
			})
		},
		//获取选中元素的父节点
		getSimpleCheckedNodes(store) {
			const checkedNodes = [];
			const traverse = function(node) {
				const childNodes = node.root ? node.root.childNodes : node.childNodes;
				childNodes.forEach(child => {
					if (child.checked) {
						checkedNodes.push(child.data);
					}
					if (child.indeterminate) {
						traverse(child);
					}
				});
			};
			traverse(store)
			return checkedNodes;
		},
		//左边节点选中变化时触发
		handleCheckChangeLeft() {
			let itemList=this.$refs.groupTree.getCheckedNodes(false);//左边选中的节点，只获取子节点
			let rightNode = this.$refs.membersTree.getCheckedNodes(false) //右边选中的节点，只获取子节点

			if(itemList.length>0){
				this.disabledRemoveMembers=false;
				let length=0
				itemList.forEach(item=>{
					if(item.children){
						length++;
					}
				})
				if(length==1){
					this.disabledAlter=false;
				}else{
					this.disabledAlter=true;
				}
				if(length>0){
					this.disabledDelete=false
				}else{
					this.disabledDelete=true
				}
			}else{
				this.disabledRemoveMembers=true;
			} 
			let itemHasChild=itemList.filter(item=>{return item.children});
			if(itemHasChild.length==1&&rightNode.length>0){
				this.disabledAddMembers=false;
			}else{
				this.disabledAddMembers=true;
			}
		},
		//右边节点选中变化时触发
		handleCheckChangeRight() {
			let rightNode = this.$refs.membersTree.getCheckedNodes(false) //右边选中的节点，只获取子节点
			let itemList=this.$refs.groupTree.getCheckedNodes(false);//左边选中的节点，只获取子节点
			let itemHasChild=itemList.filter(item=>{return item.children});
			if(itemHasChild.length==1&&rightNode.length>0){
				this.disabledAddMembers=false;
			}else{
				this.disabledAddMembers=true;
			}
		},
		//将组员添加至组
		appendMembersToGroup() {
			let leftNode = this.$refs.groupTree.getCheckedNodes() //左边选中的节点
			let rightNode = this.$refs.membersTree.getCheckedNodes(true) //右边选中的节点，只获取子节点
			let ids = [] //用来存储id
			rightNode.forEach(item => { //将节点的id值存入ids
				ids.push(item.id)
			})
			try {
				let child = leftNode[0].children
				for(let i = 0; i < ids.length; i++) {
					this.$refs.membersTree.remove(rightNode[i]) //右边的tree移除子节点
					child.push(rightNode[i]) //左边选中的节点添加子节点
				}
			} catch(err) {
				return
			}
			let deptId = this.personData[0].id
			let deptName = this.personData[0].label
			let child = []
			let parents = []
			for(let item of this.personData[0].children) {
				child.push({ deptId: deptId, deptName: deptName, userId: item.id, userName: item.label })
			}
			for(let item of this.groupData) {
				if(item.children.length != 0) {
					for(let item_ of item.children) {
						parents.push({ groupId: item.id.toString(), groupName: item.label, userId: item_.id.toString() })
					}
				}
			}
			let data = {
				groupUserDeptVoList: [],
				groupUserVoList: parents
			}
			groupMembersAdd(data).then(res => {
				this.$refs.membersTree.setCheckedKeys([]) //清除部门成员树选中状态
				this.$refs.groupTree.setCheckedKeys([]) //清除分组树选中状态
			}).catch(err => {
				console.log(err);
			})
		},
		//将组员移除组别
		removeMembersOfGroup() {
			let leftNodes = this.$refs.groupTree.getCheckedNodes(true) //左边选中的子节点
			let ids = []
			leftNodes.forEach(item => {
				ids.push(item.id)
			})
			try {
				for(let i = 0; i < ids.length; i++) {
					this.$refs.groupTree.remove(leftNodes[i])
				}
			} catch(err) {
				return
			}
			let parents = []
			for(let item of this.groupData) {
				if(item.children.length != 0) {
					for(let item_ of item.children) {
						parents.push({ groupId: item.id.toString(), groupName: item.label, userId: item_.id.toString() })
					}
				}
			}
			let data = {
				groupUserDeptVoList: [],
				groupUserVoList: parents
			}
			groupMembersAdd(data).then(res => {
				this.fresh();
			}).catch(err => {
				console.log(err);
			})
		},
		//新增分组
		handleAppend() {
			this.diaVisibleAdd = true
			this.addTitle = '增加分组'
			this.showConfirmAddButton = true
			this.showConfirmAlterButton = false
		},
		//取消增加分组
		cancelAppend(formName) {
			this.diaVisibleAdd = false
			this.$refs[formName].resetFields();
			this.addForm.groupName = ''
		},
		//确认增加分组
		confirmAppend(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.diaVisibleAdd = false
					let deptId = this.personData[0].id
					let data = {
						name: this.addForm.groupName,
						deptId: deptId
					}
					groupManageAdd(data).then(res => {
						this.groupData = []
						this.getGroups()
						this.getMembers()
					})
					this.addForm.groupName = ''
					this.$refs[formName].resetFields();
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		//修改分组
		handleAlter() {
			var groupName = ''
			this.diaVisibleAdd = true
			this.addTitle = '修改分组'
			this.showConfirmAlterButton = true
			this.showConfirmAddButton = false
			let checkedNo = this.$refs.groupTree.getCheckedKeys().toString()
			let checked = this.$refs.groupTree.data
			for(let item of checked) {
				if(item.id == checkedNo) {
					groupName = item.label
				}
			}
			this.addForm.groupName = groupName
		},
		//取消修改
		cancelAlter(formName) {
			this.diaVisibleAdd = false
			this.$refs[formName].resetFields();
			this.addForm.groupName = ''
		},
		//确认修改
		confirmAlter(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					const ids = this.$refs.groupTree.getCheckedKeys()
					let data = {
						id: ids[0],
						name: this.addForm.groupName
					}
					groupManageAlter(data).then(res => {
						this.groupData = []
						this.getGroups()
						this.getMembers()
					})
					this.diaVisibleAdd = false
					this.$refs[formName].resetFields();
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		//删除分组
		handleRemoveGroup() {
			this.$confirm('此操作将永久删除数据项, 是否继续?', '提示', {
				confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
			}).then(() => {
				this.confirmDeleteGroup()
			}).catch(() => {
				this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
			})
		},
		//确认删除
		confirmDeleteGroup() {
			const ids = this.$refs.groupTree.getCheckedKeys()
			let data = {
				idList: ids.toString()
			}
			groupManageDelete(data).then(res => {
				this.groupData = []
				this.getGroups()
				this.getMembers()
				this.$message({
					type: 'success',
					message: '删除成功'
				})
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.group-manage-container {
	padding: 10px;
	height: 100%;
	.title {
		height: 20px;
		font-size: 16px;
		line-height: 20px;
		margin: 10px 0;
		font-weight: 600;
	}
	/deep/ .el-divider {
		height: 100%;
	}
	.center {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		.btn-group {
			height: 120px;
			display: flex;
			flex-direction: column;
			justify-content: space-evenly;
			/deep/ .el-button {
				margin-left: 0;
			}
		}
		&::after {
			content: "";
			width: 1px;
			height: 100%;
			position: absolute;
			background: #eaeaea;
			top: 0;
			left: 0;
		}
		&::before {
			content: "";
			width: 1px;
			height: 100%;
			position: absolute;
			background: #eaeaea;
			top: 0;
			right: 0;
		}
	}
}
</style>

