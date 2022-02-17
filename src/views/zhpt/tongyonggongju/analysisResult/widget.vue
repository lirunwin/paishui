<template>
  <div v-way="wayFun('mainDiv')" style="width: 100%; height: 100%">    
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="item of tabs" :key="item.index" :label="item.label" :name="item.index"></el-tab-pane>
    </el-tabs>    
    <el-table class="mapTable" style="width:100%;" height="calc(100% - 47px)" tooltip-effect="dark" stripe :data="data" ref="table" row-class-name="selectRowC">
      <el-table-column v-for="item of column" :key="item.value" :prop="item.value" :label="item.name">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import TableItem from '@/components/Table'
export default {
  name: 'AnalysisResult',
  components: { TableItem },
  directives: {
    way(el, bind) {
      if (typeof bind.value === 'function') bind.value(el)
    }
  },
  props: { param: Object },
  data() {
    return {
      activeName: '',
      tabs: [],
      column: [],
      data: [],
      elements: {}
    }
  },
  watch: { activeName(e) { if(e != '') this.getData() } },
  mounted: function() {
    var map = this.$store.state.map
    if(map.analysisResult) {
      map.analysisResult.table = this
    } else {
      map.analysisResult = { table: this }
    }
    this.elements['mainDiv'].parentElement.style.height = '100%'
    this.elements['mainDiv'].parentElement.parentElement.style.height = 'calc(100% - 56px)'
    this.elements['mainDiv'].parentElement.parentElement.parentElement.style.height = '100%'
    // this.elements['table'].style.height = '100%'
    // this.elements['table'].children[0].style.height = 'calc(100% - 36px)'
    
    var tables = []    
    for(let i=0,il=this.param.tables,ii=il.length;i<ii;i++) {
      tables.push({ label:il[i].name, index: i.toString(), columns: il[i].columns, rows: il[i].rows, })
    }
    this.tabs = tables
    this.$nextTick(() => this.activeName = '0')
  },
  methods: {
    getData() {
      var dataTable = this.tabs[this.activeName]
      this.column = dataTable.columns
      this.data = dataTable.rows
    },
    clear() {
      this.activeName = ''
      this.tabs = []
    },
    wayFun: function(flag) {
      return (el) => {
        this.elements[flag] = el
      }
    }
  },
  destroyed() {    
    delete this.$store.state.map.analysisResult.table
  }
}
</script>

<style lang="scss" scoped>
</style>
