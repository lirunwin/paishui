<template>
  <div class="testResultDiagram i-scrollbar">
    <!-- 检测成果专题图 -->
    <p class="title">显示设置</p>
    <el-form ref="form" :model="form" label-width="auto" :rules="rules">
      <el-form-item label="工程名称:" prop="name">
        <el-select v-model="form.project" placeholder="默认显示最新工程">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="检测报告:">
        <el-select v-model="form.report" placeholder="请选择检测报告">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="检测日期:">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.startDate" style="width: 100%"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2"> ~</el-col>
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.endDate" style="width: 100%"></el-date-picker>
        </el-col>
      </el-form-item>
    </el-form>
    <div class="see-btn">
      <el-button type="primary" @click="showLayer">查看</el-button>
    </div>

    <p class="title">专题图列表</p>
    <div v-for="(item, index) in defectLegend" :key="index" class="thematicMap-list">
      <div>
        <div class="thematicMap-title">
          <i style="cursor:pointer;"  @click="changeArrow(index)" :class="{'el-icon-caret-bottom': showThemBox[index], 'el-icon-caret-right': !showThemBox[index]  }"></i>
          <el-checkbox @change="setThemLayerVisible(item.open)" v-model="item.open" :label="item.title"></el-checkbox>
        </div>
        <transition>
          <div v-if="item.type === 'gradient' && showThemBox[index]" class="transition-box">
            <div class="line-color"></div>
            <div class="text-mix-max">
              <span>{{ item.start }}</span>
              <span>{{ item.end }}</span>
            </div>
          </div>
          <div v-else-if="showThemBox[index]" class="transition-box">
            <ul>
              <li v-for="(level, i) in item.level" :key="i"
                :class="comStyle(item.type, level.color)">
                {{ level.label + level.num + level.unit }}
              </li>
            </ul>
          </div>
        </transition>
      </div>

    </div>
    <!-- <button type="primary" @click="openDefect">打开管道缺陷管理模块</button> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      ShowThematicMap1: true,
      ShowThematicMap2: true,
      ShowThematicMap3: true,
      ShowThematicMap4: true,
      thematicMap1: false,
      thematicMap2: false,
      thematicMap3: false,
      thematicMap4: false,
      checkList: [],
      form: {
        project: '',
        report: '',
        startDate: '',
        endDate: ''
      },
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { max: 100, message: '内容不能超过100个字符串', trigger: 'blur' }
        ]
      },
      
      // 缺陷数据
      defectLegend: [
        {
          title: "管网缺陷密度图",
          open: false,
          type: "gradient",
          start: "多",
          end: "少"
        },
        { 
          title: "管网缺陷分布专题图",
          open: true,
          type: "circle",
          level: [
            { color: "green", label: "1级", num: 111, unit: "个" },
            { color: "red", label: "2级", num: 111, unit: "个" },
            { color: "pink", label: "3级", num: 111, unit: "个" }
          ]
        },
        { 
          title: "检查井缺陷分布专题图",
          open: false,
          type: "square",
          level: [
            { color: "green", label: "井盖缺失", num: 111, unit: "个" },
            { color: "red", label: "井盖破损", num: 111, unit: "个" },
            { color: "pink", label: "井盖移位", num: 111, unit: "个" }
          ]
        },
        { 
          title: "管网健康评估专题图",
          open: false,
          type: "line",
          level: [
            { color: "pink", label: "1级", num: 111, unit: "个" },
            { color: "red", label: "2级", num: 111, unit: "个" },
            { color: "green", label: "3级", num: 111, unit: "个" }
          ]
        }
      ],

      showThemBox: [true, true, true, true],


    }
  },
  beforeCreate(){

  },
  watch: {
    
  },
  methods: {
    showLayer () {
      if (!this.form.project) return this.$message.warning("请先填写工程名称")
      console.log(this.form)
    },
    setThemLayerVisible (visible) {
      console.log("专题图显隐", visible)
    },
    changeArrow (index) {
      console.log('点击箭头')
      this.$set(this.showThemBox, index, !this.showThemBox[index])
    },
    comStyle (type, color) {
      let className = ""
      switch(type) {
        case "circle": className = "type-circle";
          break
        case "square": className = "type-square";
          break
        case "line": className = "type-line";
          break
      }
      return `${className} item-${color}`
    },
    // 管道缺陷管理的信息
    openDefect() {
      let info = {
        icon: 'iconfont ',
        id: 'pipelineDefect',
        label: '管道缺陷管理',
        meta: {
          title: '管道缺陷管理'
        },
        name: 'PipelineDefect',
        noShowingChildren: true,
        parentPathid: '/pipelineDefect',
        path: '',
        type: 'gis',
        widgetid: 'HalfPanel'
      }
      // 这是map里的跳转方法
      this.$store.dispatch('map/changeMethod', info)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.i-scrollbar {
  overflow: auto;
  @include scrollBar;
}

.testResultDiagram {
  padding: 0 12px !important;
  overflow-y: scroll;
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
  .see-btn {
    display: flex;
    flex-direction: row-reverse;
  }
  ul,
  li {
    padding: 0;
    margin: 0;
    list-style: none;
    font-size: 14px;
    font-family: Arial, Helvetica, sans-serif;
  }
}
.title {
  padding-left: 16px;
}
.title::before {
  position: relative;
  left: -10px;
  top: 2px;
  content: '';
  width: 5px;
  height: 18px;
  display: inline-block;
  background-color: #2d74e7;
}
.thematicMap-list {
  padding-left: 25%;
  display: flex;
  flex-direction: column;
  .transition-box {
    padding: 6px 0 6px 44px;
    box-sizing: border-box;
  }
}
.line-color {
  width: 140px;
  height: 10px;
  border: 1px solid #666;
  background: linear-gradient(to right, #3ce10f, #ff0602); /* 标准的语法 */
}
.text-mix-max {
  width: 140px;
  display: flex;
  padding: 8px 0;
  box-sizing: border-box;
  justify-content: space-between;
}
.type-circle {
  margin: 10px 0 10px 20px !important;
  &::before {
    position: relative;
    left: -20px;
    top: -2px;
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
  }
}
.type-square {
    margin: 10px 0 10px 20px !important;
    &::before {
    position: relative;
    left: -20px;
    top: -2px;
    content: '';
    width: 10px;
    height: 10px;
    display: inline-block;
  }
}
.type-line {
  margin: 10px 0 10px 18px !important;
  &::before {
    position: relative;
    top: -2px;
    left: -20px;
    content: '';
    width: 40px;
    height: 8px;
    display: inline-block;
  }
}
.item-green {
  &::before {
    background-color: #f405ff;
  }
}
.item-pink{
  &::before {
    background-color: #0c9923;
  }
}
.item-red {
  &::before {
    background-color: #ff0000;
  }
}
</style>