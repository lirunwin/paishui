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
          <el-table ref="markTable" :data="list" stripe style="width: 100%;" max-height="calc(100vh - 431px)" row-class-name="selectRowC" @row-click="rowClick">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="名称" width="80">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.mark" placement="top-start">
                  <span>{{ scope.row.name }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="创建时间" width="">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.mark" placement="top-start">
                  <span>{{ scope.row.date }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row style="margin-top: 8px">
        <el-col :span="20">
          <el-pagination ref="pagination" small background layout="total, sizes, prev, next" :page-sizes="[5, 10, 50, 100]" :total="total"
          @current-change="listRefersh" @size-change="listRefersh" />
        </el-col>
        <el-col :span="4">
          <span ref='pageLength' style="font-size: 13px;" class="el-pagination__total">1/10 页</span>
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
    }
  },
  mounted() {
    this.mapView = this.$attrs.data.mapView
    console.log("初始化表格")
    this.listRefersh(1, 10)
  },
  methods: {
    addMark() {
      var view = this.mapView
      var markName = this.queName
      var mark = this.queMark
      if(!markName) return this.$message.error('请输入书签名称');
      if(!mark) return this.$message.error('请输入书签描述');
      var center = view.center

      // TODO
      addMark({}).then(res => {
        if (res.code === 1) {
          let mark = this.queMark
          this.$message.success('添加书签：' + markName + ' 成功');
          this.queName = this.queMark = ''
          this.listRefersh()
        }
      })
    },
    deleteMarks() {
      var selects = this.$refs.markTable.selection
      if(!selects.length) return this.$message.error('未选中任何书签');
      let markNames = selects.map(item =>{ return item.name});
      this.$confirm(
        '确定删除选中的 ' + selects.length + '条书签？', '提示',
        { distinguishCancelAndClose: true, confirmButtonText: '确定', cancelButtonText: '取消' }
      ).then(() => {
        // TODO
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
      var pages = this.$refs.pagination
      getMapMark().then(res => {
        if(res.code == 1) {
          res = res.result
          this.total = res.total
          var list = []
          for(let i=0,il=res.records,ii=il.length;i<ii;i++) {
            var ni = il[i]
            var extent = JSON.parse(ni.extent)
            list.push({ id: ni.id, name: ni.name, date: ni.createTime, center: extent.center, zoom: extent.zoom, mark: ni.notes })
          }
          this.list = list
          this.$refs.pageLength.innerHTML = pages.internalCurrentPage + '/' + Math.ceil(res.total / pages.internalPageSize)
        } else this.$message(res.message)
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
