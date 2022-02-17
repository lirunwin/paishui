<template>
  <div style="padding: 0 8px">
    <el-row style="margin-bottom: 8px">
      <el-cascader-panel
        :options="layersAtt"
        :props="{ multiple: true }"
      />
    </el-row>
    <el-row style="margin-bottom: 8px">
      <el-button
        size="mini"
        icon="el-icon-plus"
        @click="show3 = !show3"
      >筛选条件（可选</el-button>
    </el-row>
    <el-row style="margin-bottom: 8px">
      <el-collapse-transition>
        <div v-show="show3">
          <div
            style="
              height: calc(100vh - 475px);
              width: 100%;
              background: #fff;
              overflow: hidden auto;
              padding: 8px;
            "
          >
            <div class="spanTitle"><span>图层名称</span></div>
            <el-select v-model="layerName" placeholder="请选择">
              <el-option
                v-for="item in layersAtt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <div class="spanTitle"><span>图层字段</span></div>
            <ul class="attAndConAnalysisUl" style="height: 100px">
              <li
                v-for="(item, id) in analysisAtt"
                :key="id"
                @click="addText(item.value + ' ', item.value.length + 1)"
              >
                {{ item.label }}
              </li>
            </ul>
            <div class="spanTitle"><span>添加条件</span></div>
            <div style="width: 100%">
              <div style="width: 115px; float: left">
                <el-button-group style="margin-bottom: 3px">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="addText('= ', 2)"
                  >等于</el-button>
                  <el-button
                    size="mini"
                    type="primary"
                    @click="addText('like \'%%\'', 7)"
                  >模糊</el-button>
                </el-button-group>
                <el-button-group style="margin-bottom: 3px">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="addText('> ', 2)"
                  >大于</el-button>
                  <el-button
                    size="mini"
                    type="primary"
                    @click="addText('< ', 2)"
                  >小于</el-button>
                </el-button-group>
                <el-button-group style="margin-bottom: 3px">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="addText('<> ', 3)"
                  >不等</el-button>
                  <el-button
                    size="mini"
                    type="primary"
                    @click="addText('and ', 4)"
                  >而且</el-button>
                </el-button-group>
                <el-button-group>
                  <el-button
                    size="mini"
                    type="primary"
                    @click="addText('or ', 3)"
                  >或者</el-button>
                  <el-button
                    size="mini"
                    type="primary"
                    @click="addText('% ', 2)"
                  >占位</el-button>
                </el-button-group>
              </div>
              <div style="width: calc(100% - 115px); float: right">
                <el-button
                  size="mini"
                  type="primary"
                  style="margin-bottom: 3px"
                >获取唯一值</el-button>
                <ul class="attAndConAnalysisUl" style="height: 90px">
                  <li
                    v-for="(item, id) in layerFix"
                    :key="id"
                    @click="addText('\'' + item + '\' ', item.length + 3)"
                  >
                    {{ item }}
                  </li>
                </ul>
              </div>
            </div>
            <div class="spanTitle"><span>查询语句</span></div>
            <el-input
              v-model="queText"
              v-way="wayFun('textBox')"
              type="textarea"
              autosize
              placeholder="请输入内容 如:OBJECTID > 0"
            />
          </div>
        </div>
      </el-collapse-transition>
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
  name: 'AttAndConAnalysis',
  components: {},
  directives: {
    way(el, bind) {
      if (typeof bind.value === 'function') bind.value(el.children[0])
    }
  },
  props: { param: Object },
  data() {
    return {
      show3: false,
      titleName: '',
      layerName: '',
      queText: '',
      elements: {},
      lastRange: [0, 0],
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
      analysisAtt: [
        { value: 'objectId', label: 'OBJECTID' },
        { value: 'dataSource', label: '数据来源' },
        { value: 'wirteDate', label: '操作时间' },
        { value: 'safeLavel', label: '安全评级' },
        { value: 'radio', label: '管径' },
        { value: 'type', label: '材质' },
        { value: 'state', label: '状态' }
      ],
      layerFix: ['pe', '钢', '球磨铸铁', 'PVE', '铸铁', '钢筋混凝土', '砖'],
      panel: {
        pathId: 'analysisResult',
        widgetid: 'HalfPanel',
        label: '统计分析'
      }
    }
  },
  computed: {
    type() {
      return this.param.type
    }
  },
  watch: {
    type: function() {
      this.titleName = this.param.type
    }
  },
  mounted: function() {
    this.titleName = this.param.type
  },
  methods: {
    addText: function(text, length) {
      var myField = this.elements['textBox']
      var startL = myField.selectionStart
      this.queText =
        this.queText.substring(0, startL) +
        text +
        this.queText.substring(myField.selectionEnd, myField.value.length)
      myField.blur()
      setTimeout(() => {
        myField.selectionStart = myField.selectionEnd = startL + length
        myField.focus()
      })
    },
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
.attAndConAnalysisUl {
  list-style-type: none;
  padding: 2px;
  margin: 0px;
  font-size: 14px;
  border: 1px solid #ccc;
  overflow: hidden auto;
}
.attAndConAnalysisUl li {
  margin: 2px 0;
  cursor: pointer;
}
.attAndConAnalysisUl li:hover {
  background: rgb(30, 144, 255);
  color: #fff;
}
</style>
