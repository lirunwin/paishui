<template>
  <div class="reportTable" style="width:100%;height:100%;overflow-y: auto;">
    <div
      style="width:100%;height:100%;text-align: center; padding-top: 10%;"
      slot="empty"
      v-show="!(tableList.data.length > 0)"
    >
      <img src="@/assets/icon/null.png" alt="" />
    </div>
    <template v-if="tableList.data.length > 0">
      <table :id="tableList.tableId" class="tableReport" border="1" cellspacing="0">
        <tr style="width: 100%; ">
          <th colspan="12">{{ tableList.title }}</th>
        </tr>
        <tr style="width: 100%; ">
          <th rowspan="2">序号</th>
          <th rowspan="2">分组名称</th>
          <th rowspan="2">员工姓名</th>
          <th rowspan="2">巡检任务数（个）</th>
          <th rowspan="2">巡检里程（m）</th>
          <th rowspan="2">上报隐患（个）</th>
          <th rowspan="2">上报工地（个）</th>
          <th colspan="2">任务执行情况（个/m）</th>
          <th colspan="2">完成比例（%）</th>
        </tr>
        <tr>
          <th>任务类型</th>
          <!-- <th>总任务情况</th> -->
          <th>执行情况</th>
          <th>点</th>
          <th>线</th>
        </tr>
        <template v-for="(item, index) in tableList.data">
          <template v-if="item.workCompletionVoList && item.workCompletionVoList.length > 0">
            <tr>
              <td :rowspan="item.workCompletionVoList.length">{{ index + 1 }}</td>
              <td :rowspan="item.workCompletionVoList.length">{{ item.groupName | setEmpty }}</td>
              <td :rowspan="item.workCompletionVoList.length">{{ item.userName | setEmpty }}</td>
              <td :rowspan="item.workCompletionVoList.length">{{ item.planNum | setEmpty }}</td>
              <td :rowspan="item.workCompletionVoList.length">{{ item.vaildSpeed | setEmpty }}</td>
              <td :rowspan="item.workCompletionVoList.length">{{ item.findTroubleNum | setEmpty }}</td>
              <td :rowspan="item.workCompletionVoList.length">{{ item.buildingsitefinded | setEmpty }}</td>
              <td>{{ item.workCompletionVoList[0].typeName | setEmpty }}</td>
              <td class="tdLeft">{{ item.workCompletionVoList[0].node | setEmpty }}</td>
              <!-- <td>{{item.workCompletionVoList[0].executiveCondition}}</td> -->
              <td>{{ item.workCompletionVoList[0].pointRate | setEmpty }}</td>
              <td>{{ item.workCompletionVoList[0].lenRate | setEmpty }}</td>
            </tr>
            <template v-for="(item2, index2) in item.workCompletionVoList">
              <template v-if="index2 != 0">
                <tr>
                  <td>{{ item2.typeName | setEmpty }}</td>
                  <td class="tdLeft">{{ item2.node | setEmpty }}</td>
                  <!-- <td>{{item2.executiveCondition}}</td> -->
                  <td>{{ item2.pointRate | setEmpty }}</td>
                  <td>{{ item2.lenRate | setEmpty }}</td>
                </tr>
              </template>
            </template>
          </template>
          <template v-else>
            <tr>
              <td>{{ index + 1 }}</td>
              <td>{{ item.groupName | setEmpty }}</td>
              <td>{{ item.userName | setEmpty }}</td>
              <td>{{ item.planNum | setEmpty }}</td>
              <td>{{ item.vaildSpeed | setEmpty }}</td>
              <td>{{ item.findTroubleNum | setEmpty }}</td>
              <td>{{ item.buildingsitefinded | setEmpty }}</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
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
  props: { dataList: Object },
  computed: {
    watchDataList() {
      return this.dataList
    }
  },
  data() {
    return {
      tableList: {
        title: '2021.6.11日报',
        data: []
      }
    }
  },
  mounted: function() {
    this.tableList = this.dataList
  },
  watch: {
    watchDataList: function() {
      this.tableList = this.dataList
    }
  },
  created() {},
  destroyed() {},
  filters: {
    setEmpty(value) {
      let typeValue = typeof value
      if (typeValue == 'undefined') {
        return '-'
      } else if (typeValue == 'object' || typeValue == 'string') {
        if (!value) {
          return '-'
        } else {
          return value
        }
      } else {
        return value
      }
    }
  },
  methods: {}
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
tr:nth-child(2n + 1) {
  background-color: #f7f7f7;
}
td.tdLeft {
  text-align: left !important;
}
</style>
