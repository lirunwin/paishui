<template>
  <div style="padding: 0 8px">
    <el-row style="margin-bottom: 8px">
      <el-cascader-panel
        :options="layersAtt"
        :props="{ multiple: true }"
      />
    </el-row>
    <el-row style="margin-bottom: 8px">
      <el-select v-model="layerName" placeholder="请选择">
        <el-option
          v-for="item in selectFunc"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-row>
    <el-row style="margin-bottom: 8px">
      <el-col
        :span="4"
        :offset="18"
      ><el-button
        size="mini"
        type="primary"
        icon="el-icon-pie-chart"
        @click="analysis"
      >分析</el-button></el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'ExtentAnalysis',
  components: {},
  directives: {
    way(el, bind) {
      if (typeof bind.value === 'function') bind.value(el)
    }
  },
  props: {
    param: Object
  },
  data() {
    return {
      elements: {},
      layerName: '',
      layersAtt: [
        {
          value: 'pipe',
          label: '管线管网',
          children: [
            { value: 'xingzhengqu', label: '行政区' },
            { value: 'caizhi', label: '材质' },
            { value: 'guanjin', label: '管径' }
          ]
        },
        {
          value: 'pot',
          label: '管线节点',
          children: [
            { value: 'xingzhengqu', label: '行政区' },
            { value: 'caizhi', label: '材质' },
            { value: 'IOcount', label: '节口数' }
          ]
        },
        {
          value: 'equipment',
          label: '设备',
          children: [
            { value: 'xingzhengqu', label: '行政区' },
            { value: 'caizhi', label: '材质' },
            { value: 'type', label: '类型' }
          ]
        }
      ],
      selectFunc: [
        {
          value: 'all',
          label: '全网'
        },
        {
          value: 'lo',
          label: '行政区划'
        },
        {
          value: 'little',
          label: '管辖区域'
        }
      ],
      panel: {
        pathId: 'analysisResult',
        widgetid: 'HalfPanel',
        label: '统计分析'
      }
    }
  },
  computed: {},
  watch: {},
  mounted: function() {},
  methods: {
    wayFun: function(flag) {
      return (el) => {
        this.elements[flag] = el
      }
    },
    analysis: function() {
      this.$store.dispatch('map/changeMethod', this.panel)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
