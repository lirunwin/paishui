<template>
<!-- 快捷查询 -->
  <div style="padding: 0 8px">
    <tf-legend class="legend_dept" label="选择图层" isopen="true" title="选择查询要素图层">
      <el-select v-model="layerName" placeholder="请选择">
        <el-option v-for="item in layersAtt" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
    </tf-legend>
    <tf-legend class="legend_dept" label="选择字段" isopen="true" title="选择查询图层对应的字段">
      <el-select v-model="attList" placeholder="请选择">
        <el-option v-for="(item, i) in attLists" :key="i" :label="item.label" :value="item.name"/>
      </el-select>
    </tf-legend>
    <tf-legend class="legend_dept" label="查询条件" isopen="true" title="设置查询内容信息进行搜索">
      <el-input v-if="selectType == 'text'" v-model="queText" :placeholder="textHolder" clearable/>
      <el-row v-if="selectType == 'radio'" style="margin-top: 8px">
        <el-radio v-model="radio" label="<">小于</el-radio>
        <el-radio v-model="radio" label=">">大于</el-radio>
        <el-radio v-model="radio" label="=">等于</el-radio>
      </el-row>
      <el-row v-if="selectType == 'radio'" style="margin-top: 8px">
        <el-input v-model="queRadioText" :placeholder="radioHolder" clearable />
      </el-row>
      <el-checkbox-group v-if="selectType == 'cheaked'" v-model="checkList">
        <el-checkbox v-for="item in checkListAtt" :key="item" :label="item"/>
      </el-checkbox-group>
      <el-date-picker v-if="selectType == 'date'" v-model="dateDistancs" type="daterange" style="width:100%"
        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" value-format="yyyy/M/d"/>
      <el-row style="margin-top: 8px">
        <el-button size="mini" type="primary" style="width:100%" @click="queryResult" :disabled="analysisDisable">
          <i v-if="analysisDisable" class="el-icon-loading"/>查询</el-button>
      </el-row>
    </tf-legend>
    <tf-legend class="legend_dept" label="查询结果" isopen="true" title="显示查询统计结果。">
      <el-table :data="finalData" stripe style="width: 100%">
        <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
        <template slot="empty">
          <img src="@/assets/icon/null.png" alt="">
          <p class="empty-p">暂无数据</p>
        </template>
        <el-table-column prop="name" label="图层" width="80px" align="center"/>
        <el-table-column prop="value" label="数量(个)" align="center"/>
        <el-table-column prop="length" label="长度(m)" align="center">
          <template slot-scope="props">{{ props.row.length ? props.row.length.toFixed(2) : '-' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="50px" align="center">
          <template slot-scope="scope">
            <el-link type="primary" @click="rowC(scope.row)">详情</el-link>
          </template>
        </el-table-column>
      </el-table>
    </tf-legend>
  </div>
</template>

<script>
import { attConfig } from '@/views/zhpt/tongyonggongju/queryResult3/attributeConfig'
import { appconfig } from 'staticPub/config'
import tfLegend from '@/views/zhpt/common/Legend'
export default {
  name: 'queryForSimple',
  components: { tfLegend },
  props: { param: Object },
  data() {
    return {
      elements: {},
      layerName: '',
      queText: '',
      queRadioText: '',
      checkList: [],
      radio: '',
      attList: '',
      checkListAtt: [],
      textHolder: '',
      radioHolder: '',
      dateDistancs: ['', ''],
      selectType: 'radio',
      layersAtt: [],
      attLists: [],
      panel: {
        pathId: 'queryResult3',
        widgetid: 'HalfPanel',
        label: '查询结果',
        param: {}
      },
      analysisDisable: false,

      finalData: []
    }
  },
  watch: {
    layerName() {

    },
    attList(e) {

    }  
  },
  mounted() {

  },
  methods: {
    queryResult() {
      var layerName = this.layerName
      var attList = this.attList
      if(!layerName) return this.$message.error('请选择图层')
      if(!attList) return this.$message.error('请选择字段')
      var queryText = ''
      switch(this.selectType) {
        case 'text': 
          // if(!this.queText) return this.$message.error('请输入查询值')
          queryText = attList + " like '%" + this.queText + "%'"          
          break
        case 'radio': 
          if(!this.queRadioText) return this.$message.error('请输入查询值')
          queryText = attList + this.radio + this.queRadioText
          break
        case 'cheaked': 
          if(this.checkList.length == 0) return this.$message.error('请选择查询值')
          var fixed = attList
          queryText = this.checkList.map((e) => fixed + "='" + e + "'").join(' OR ')
          break
        case 'date': 
          if(!this.dateDistancs || !this.dateDistancs[0]) return this.$message.error('请选择查询范围')
          var fixed = attList
          var query = this.dateDistancs
          queryText = fixed + " > DATE '" + query[0] + "' and " + fixed + " < DATE '" + query[1] + "'"
          break
      }
      this.analysisDisable = true
    }
  },
  destroyed() {
    // var mapView = this.mapView
    // if(mapView.TF_resultFeatures) mapView.TF_resultFeatures.destroy('queryForSinple')
  }
}
</script>
