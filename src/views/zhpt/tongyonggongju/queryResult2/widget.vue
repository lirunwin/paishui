<template>
  <div ref="mainDiv" style="width: 100%; height: 100%;">    
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="item of tabs" :key="item.index" :label="item.label" :name="item.index"></el-tab-pane>
    </el-tabs>
    <el-table class="mapTable" style="width:100%;" height="calc(100% - 85px)" tooltip-effect="dark" stripe :data="featureData" ref="table" row-class-name="selectRowC" @row-click="getGeo">
      <el-table-column v-for="item of column" :min-width="80" show-overflow-tooltip :key="item.value" :prop="item.value" :label="item.name">
      </el-table-column>
    </el-table>
    <div style="width:100%;margin-top:8px;">
      <div style="float:left;width:80%">
        <el-pagination ref="pagination" small background layout="total, sizes, prev, pager, next" :page-sizes="[5, 10, 50, 100]" :total="total"
          @current-change="currentChange" @size-change="sizeChange"/>
      </div>
      <div style="float:right;">
        <el-button type="primary" size="mini">导出表格</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import TableItem from '@/components/Table'
export default {
  name: 'AnalysisResult',
  components: { TableItem },
  props: {
    param: Object
  },
  data() {
    return {
      activeName: '',
      tabs: [],
      column: [],
      featureData: [],
      total: 0,
    }
  },
  mounted: function() {
    var mapView = this.mapView = this.$attrs.data.mapView
    mapView.TF_result = {
      add:(data) => {
        this.dataTable.push(data)
        var index = this.tabs.length.toString()
        this.tabs.push({ label:data.tableName, index: index })
        this.activeName = index
      }
    }
    var mainDiv = this.$refs.mainDiv.parentElement
    mainDiv.style.height = '100%'
    mainDiv.parentElement.style.height = 'calc(100% - 56px)'
    mainDiv.parentElement.parentElement.style.height = '100%'
  
    this.dataTable = this.param.dataTable
    var tabs = []    
    for(let i=0,il=this.dataTable,ii=il.length;i<ii;i++) {
      tabs.push({ label:il[i].tableName, index: i.toString() })
    }
    this.tabs = tabs    

    var sp = this.mapView.spatialReference
    this.queryFeature = new this.mapView.TF_graphic({ geometry: { type: 'polygon', spatialReference: sp } , symbol: { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: [45, 116, 231, 1], width: "3px" } } })
    this.mapView.graphics.add(this.queryFeature)

    this.$nextTick(() => this.activeName = '0')
    this.watchs = []
  },
  watch: {
    activeName() {
      this.getData()
    }
  },
  methods: {
    getData() {
      var datas = this.dataTable[this.activeName]
      this.total = datas.tableData.length
      if(this.$refs.table.tabName != datas.tableName) {
        this.column = datas.tableC
        // var column = this.column
        // for(let i in column) {
        //   column[i].width = column[i].name.length > 4 ? 150 : 80
        // }
        this.$refs.table.tabName = datas.tableName
      }
      this.featureData = []
      var pages = this.$refs.pagination
      var conut = pages.internalPageSize
      var page = pages.internalCurrentPage
      var forCount = Math.min(conut * page, this.total) % conut
      if(forCount == 0) forCount = conut
      if(this.total == 0) forCount = 0
      var showData = []
      for(let i=(page - 1) * conut,j=0;j<forCount;j++) {
        showData.push(datas.tableData[i++])
      }
      this.$nextTick(() => {        
        this.featureData = showData
      })
    },
    currentChange() {
      this.getData()
    },
    sizeChange() {
      this.$refs.pagination.internalCurrentPage = 1
      this.getData()
    },
    getGeo(e) {
      var type =  this.dataTable[this.activeName].geoType
      var view = this.mapView
      view.graphics.removeMany(this.watchs)
      var sp = view.spatialReference
      if(type == 'user') {
        var watchs = []
        var extent = { xmin: Infinity, ymin: Infinity, xmax: -Infinity, ymax: -Infinity, spatialReference: sp}
        for(var i=0,il=e.watchs,ii=il.length;i<ii;i++) {
          var x = il[i].x
          var y = il[i].y
          if(x < extent.xmin) extent.xmin = x
          if(y < extent.ymin) extent.ymin = y
          if(x > extent.xmax) extent.xmax = x
          if(y > extent.ymax) extent.ymax = y
          watchs.push(new view.TF_graphic({            
            geometry: { type: 'point', x: x, y: y, spatialReference: sp } , 
            symbol: {
              path: 'M911.609756 399.609756c0 220.659512-399.609756 624.390244-399.609756 624.390244S112.390244 620.269268 112.390244 399.609756a399.609756 399.609756 0 0 1 799.219512 0z M407.352195 208.421463h39.836098V274.731707h-39.836098zM464.920976 208.421463h39.836097V274.731707h-39.836097zM522.364878 208.421463h39.836098V274.731707h-39.836098zM579.933659 208.421463h39.836097V274.731707h-39.836097z M680.460488 141.986341H346.536585a32.093659 32.093659 0 0 0-32.093658 32.093659V534.478049a32.093659 32.093659 0 0 0 32.093658 32.093658h333.923903a32.093659 32.093659 0 0 0 32.093658-32.093658V174.08a32.093659 32.093659 0 0 0-32.093658-32.093659zM513.498537 526.73561a81.92 81.92 0 0 1-81.92-81.92c0-45.205854 81.92-117.010732 81.92-117.010732s81.92 71.804878 81.92 117.010732a81.92 81.92 0 0 1-81.92 81.92z m145.982439-238.76683H367.516098v-92.909268h291.964878z',
              color: '2D74E7', outline: { color: '2D74E7', width: '1px' },
              size: '30px', yoffset: '15px', xoffset: '0px', type: 'simple-marker'
            }
          }))
        }
        this.watchs = watchs
        view.graphics.addMany(watchs)
        if(il.length > 1){
          view.extent = extent
        }
        else {
          view.center = watchs[0].geometry          
        }
      } else {
        var geometry = e._Geometry
        geometry.type = type
        geometry.spatialReference = view.spatialReference
        var gra = this.queryFeature
        gra.geometry = geometry
        gra.symbol = geometry.type == 'point' ? 
        { type: 'simple-marker', color: [200, 200, 200], size: 12, outline: { color: [0, 255, 255], width: 2 }}
        : { type: 'simple-fill', color: [0, 0, 0, 0.3], outline: { color: [0, 255, 255, 1], width: "7px" } }
        var extent = gra.geometry.extent
        if(extent) view.goTo(extent)
        else view.center = {x: gra.geometry.x, y: gra.geometry.y, spatialReference: view.spatialReference}  
      }
    }
  },
  destroyed: function() {
    var view = this.mapView
    view.graphics.remove(this.queryFeature)
    delete view.TF_result
    view.graphics.removeMany(this.watchs)
  }
}
</script>
