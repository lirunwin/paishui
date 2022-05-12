<template>
	<div class="reportTable" style='width:100%;height:100%;overflow-y: auto;' >
		<div style='width:100%;height:100%;text-align: center; padding-top: 10%;' slot="empty" v-show="!(tableList.data.length>0)">
		<img src="@/assets/icon/null.png" alt="">
		<p class="empty-p">暂无数据</p>
		</div>  
		<template v-if="tableList.data.length>0">
		<table :id='tableList.tableId' class="tableReport" border="1" cellspacing="0">
			<tr style="width: 100%; ">
				<th colspan="4">{{tableList.title}}</th>
			</tr>
				<template v-for="(item,index) in tableList.data" >
					<tr>
						<td width="15%">员工姓名</td>
						<td class="staffName" width="15%" align="left">{{item.userName}}</td>
						<td width="15%">巡查月份</td>
						<td class="date" width="20%" colspan="1" align="left">{{item.inspectionDateMonth}}</td>
					</tr>
					<tr>
						<td width="15%">巡检任务数（个）</td>
						<td class="mileage" width="15%" align="left">{{item.planNum}}</td>
						<td width="20%">上报隐患（个）</td>
						<td class="averageSpeed" width="20%" align="left">{{item.findTroubleNum}}</td>
					</tr>
					<tr>
						<td width="15%">巡检里程（m）</td>
						<td class="mileage" width="15%" align="left">{{item.vaildSpeed}}</td>
						<td width="20%">上报工地（个）</td>
						<td class="averageSpeed" width="20%" align="left">{{item.buildingsitefinded}}</td>
					</tr>
					<tr>
						<th colspan="4">工作完成情况</th>
					</tr>
					<tr>
						<td align="center">任务类型</td>
						<td colspan="3" style="text-align:center;" align="center">任务执行情况</td>
					</tr>	
					<template v-if="item.workCompletionVoList&&item.workCompletionVoList.length>0">
						<template v-for="item2 of item.workCompletionVoList">
							<tr>
								<td class="reportTrouble" align="center">{{item2.typeName}}</td>
								<td colspan="3" class="troubleCheck" align="center">{{item2.node}}</td>
							</tr>
						</template>
					</template>
					<template v-else>
						<tr>
							<td colspan="4" class="troubleCheck" align="center">暂无巡检信息</td>
						</tr>
					</template>		
					<template v-if="index<(tableList.data.length-1)">
						<tr style="width: 100%;">
							<th colspan="4"></th>
						</tr>
					</template>
				</template>
			</table>
		</template>
	</div>
</template>


<script>
export default {
	name: 'reportTable',
	props: {dataList:Object },
	computed: { watchDataList() { return this.dataList } },
    data() {
        return {
			tableList:{
				title:"2021.6.11日报",
				data:[]
			}
		}
    },
    mounted: function() {
		this.tableList=this.dataList;
	},
    watch:{
		"watchDataList":function(){
			this.tableList=this.dataList;
		}
	},
    created() {},
    destroyed(){},
    methods: { }
}
</script>
<style scoped>
.tableReport {
	position: relative;
	margin-top: 10px;
	margin-bottom: 10px;
	border-color: rgba(222, 226, 230, 0.5);
}
th {
    font-size: 14px;
    font-weight: 600;
    color: #333333;
    width: 1680px;
    height: 50px;
}
td {
	height: 30px;
	color: #333333;
	font-size: 14px;
	text-indent: 20px;
}
tr:nth-child(2n+1) {
	background-color: #F7F7F7;
}
</style>
