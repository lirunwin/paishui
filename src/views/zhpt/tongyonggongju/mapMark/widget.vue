<template>
  <div style="padding: 0 8px">
    <tf-legend class="legend_dept" label="添加书签" isopen="true" title="将当前地图显示区域保存为一个地图书签。">
      <el-input v-model="queName" placeholder="请输入书签名称" class="input-with-select">
        <template slot="prepend"><span style="color: red;">*</span>名称</template>
      </el-input>
      <el-input v-model="queMark" placeholder="请输入书签描述" class="input-with-select" style="margin-top: 8px">
        <template slot="prepend"><span style="color: red;">*</span>描述</template>
      </el-input>
      <el-button style="width: 100%; margin-top: 6px" size="mini" type="primary" @click="addMark()">添加书签</el-button>
    </tf-legend>
    <tf-legend class="legend_dept" label="我的书签" isopen="true" title="查看所有已保存的地图书签。">      
      <el-row>
        <el-col :span="24">
          <el-table @row-click='jump'
          ref="markTable" :default-sort="{ prop: 'date', order: 'descending' }" :data="list" stripe style="width: 100%;" min-height='400px' max-height="800px" row-class-name="selectRowC">
            <!-- <el-table-column type="selection" width="55" /> -->
            <template slot="empty">
              <img src="@/assets/icon/null.png" alt="">
              <p class="empty-p">暂无数据</p>
            </template>
            <el-table-column type="selection" width="30"> </el-table-column>
            <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
            <el-table-column prop="markName" label="名称" width="100" align="center" sortable='true'>
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.markName" placement="top-start">
                  <span>{{ scope.row.markName }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="书签描述" align="center">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.remark" placement="top-start">
                  <span>{{ scope.row.remark }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="center" label="操作" width="100" align="center">
              <template slot-scope="scope">
                <el-link type="primary" @click="jump(scope.row)">跳转</el-link>
                <el-link type="primary" @click="deleteMark(scope.row)">删除</el-link>
              </template>
            </el-table-column> -->
          </el-table>
        </el-col>
      </el-row>
      <el-row style="margin-top: 8px">
        <el-col :span="20">
          <el-pagination ref="pagination" small background layout="total, sizes, prev, next" 
          :page-size.sync='pageSize' :current-page.sync='currentPage' :page-sizes="[10, 20, 30, 50, 100, 1000]" :total="total"
          @current-change="listRefersh" @size-change="listRefersh" />
        </el-col>
      </el-row>
      <el-row style="margin-top: 8px" >
        <el-button size="mini" style="width: 100%;" type="primary" @click="deleteMarks">删除选定书签</el-button>
      </el-row>
    </tf-legend>
  </div>
</template>

<script>
import { esriConfig } from 'staticPub/config'
import tfLegend from '@/views/zhpt/common/Legend'
import { getMapMark, addMapMark, deleteMapMark } from '@/api/mainMap/mapMark'

export default {
  name: 'MapMark',
  components: { tfLegend },
  props: { param: Object },
  data() {
    return {
      queName: '',
      queMark: '',
      list: [],
      total: 0,
      
      currentPage: 1,
      pageSize: 30
    }
  },
  mounted() {
    this.mapView = this.$attrs.data.mapView
    this.listRefersh()
  },
  methods: {
    jump (row) {
      console.log("跳转")
      let view = this.mapView.getView()
      view.setCenter(row.center.split(","))
      view.setZoom(row.zoom)
    },
    addMark() {
      let view = this.mapView.getView()
      let markName = this.queName
      let remark = this.queMark
      if(!markName) return this.$message.error('请输入书签名称');
      if(!remark) return this.$message.error('请输入书签描述');

      let param = {
        markName,
        imgLink: '',
        remark,
        zoom: view.getZoom(),
        center: view.getCenter().toString(),
        userId: this.$store.state.user.userId
      }
      addMapMark(param).then(res => {
        if (res.code === 1) {
          let mark = this.queMark
          this.$message.success('添加书签：' + markName + ' 成功');
          this.queName = this.queMark = ''
          this.listRefersh()
        }
      })
    },
    deleteMark (row) {
      this.$confirm(
        `是否删除 ${row.markName} 书签？`, '提示',
        { distinguishCancelAndClose: true, confirmButtonText: '确定', cancelButtonText: '取消' }
      ).then(() => {
        deleteMapMark(row.id).then(res => {
          if(res.code == 1) {
            this.$message(`${row.markName}已删除`);
            this.$refs.pagination.internalCurrentPage = 1
            this.listRefersh()
          } else this.$message(res.message)
        })
      })
    },
    deleteMarks() {
      return
      var selects = this.$refs.markTable.selection
      if(!selects.length) return this.$message.error('未选中任何书签');
      let markNames = selects.map(item =>{ return item.name});
      this.$confirm(
        '确定删除选中的 ' + selects.length + '条书签？', '提示',
        { distinguishCancelAndClose: true, confirmButtonText: '确定', cancelButtonText: '取消' }
      ).then(() => {
        deleteMapMark({}).then(res => {
          if(res.code == 1) {
            this.$message("已删除");
            this.$refs.pagination.internalCurrentPage = 1
            this.listRefersh()
          } else this.$message(res.message)
        })
      })
    },
    listRefersh() {
      console.log('更新列表')
      var pages = this.$refs.pagination
      let param = { size: this.pageSize, current: this.currentPage }
      getMapMark(param).then(res => {
        if(res.code == 1) {
          res = res.result
          this.total = res.total
          let list = res.records.map(item => {
            return { id: item.id, markName: item.markName, center: item.center, zoom: item.zoom, remark: item.remark }
          })
          this.list = list
        } else {
          res.message && this.$message(res.message)
        }
      })
    },
    rowClick(row) {
      this.mapView.center = {x: row.center[0], y: row.center[1], spatialReference: this.mapView.spatialReference}
      this.mapView.zoom = row.zoom
      this.$message("当前书签：" + row.name);
    }
  }
}
</script>
