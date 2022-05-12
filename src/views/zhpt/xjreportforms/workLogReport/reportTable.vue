<template>
	<div class="reportTable"   style='width:100%;height:100%;overflow-y: auto;' >
		<div style='width:100%;height:100%;text-align: center; padding-top: 10%;' slot="empty" v-show="!(tableList.data.length>0)">
			<img src="@/assets/icon/null.png" alt="">
			<p class="empty-p">暂无数据</p>
		</div> 
		<template v-if="tableList.data.length>0">
			<table :id='tableList.tableId' class="tableReport" border="1" cellspacing="0">
				<tr style="width: 100%; ">
					<th colspan="9">{{tableList.title}}</th>
				</tr>
				<tr style="width: 100%; ">
					<th>工作时间</th>
					<th>员工姓名</th>
					<th>巡检任务数（个）</th>
					<th>巡检里程（m）</th>
					<th>发现工地数（个）</th>
					<th>发现隐患数（个）</th>
					<!-- <th>巡检任务数（个）</th> -->
					<th>巡检执行情况</th>
					<th>维修情况</th>
				</tr>
				<template v-for="(item) in tableList.data" >
					<tr>
						<td >{{item.workHours |setEmpty}}</td>
						<td >{{item.userName |setEmpty}}</td>
						<td >{{item.planNum |setEmpty}}</td>
						<td >{{item.vaildSpeed |setEmpty}}</td>
						<td >{{item.buildingsitefinded |setEmpty}}</td>
						<td >{{item.findTroubleNum |setEmpty}}</td>
						<!-- <td>{{item.planNum |setEmpty}}</td> -->
						<td class='tdLeft'>{{item.inspectNode |setEmpty}}</td>
						<td class='tdLeft'>{{item.maintainNode |setEmpty}}</td>
					</tr>
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
			data:[{
				userName:"张三",
				time:"6.11",
				length:"10",
				hiddenCount:"7",
				length2:"11",
				siteCount:"12",
				xjList:[{
					type:"类型1",
					notes:"说明1",
					times:"6.11日当天"
				}]
				}
			]
		}
		}
	},
	mounted: function() {
		this.tableList=this.dataList;
	},
  watch:{
		"watchDataList":function(){
			this.tableList=this.dataList;
		},	
	},
	filters:{
		setEmpty(value){
			let typeValue=typeof value;
			if(typeValue=="undefined"){
					return "-"
			}else if(typeValue=="object"||typeValue=="string"){
					if(!value){
							return "-"
					}else{
							return value
					}
			}else{
					return value
			}
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
		text-align: center;
}
td {
	height: 30px;
	color: #333333;
	font-size: 14px;
	text-indent: 20px;
	text-align: center;
}
tr:nth-child(2n+1) {
	background-color: #F7F7F7;
}
td.tdLeft{
	text-align: left !important;
}
</style>
