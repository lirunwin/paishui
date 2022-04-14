<template>
  <div class="testResultDiagram">
    <!-- 检测成果专题图 -->
    <p class="title">显示设置</p>
    <el-form ref="form" :model="form" label-width="auto" :rules="rules">
      <el-form-item label="工程名称:" prop="name">
        <el-select v-model="form.test1" placeholder="默认显示最新工程">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="检测报告:">
        <el-select v-model="form.test2" placeholder="请选择检测报告">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="检测日期:">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2"> ~</el-col>
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.date2" style="width: 100%"></el-date-picker>
        </el-col>
      </el-form-item>
    </el-form>
    <div class="see-btn">
      <el-button type="primary">查看</el-button>
    </div>
    <p class="title">专题图列表</p>
    <div class="thematicMap-list">
      <div>
        <div class="thematicMap-title">
          <i
            :class="{
              'el-icon-caret-bottom': ShowThematicMap1,
              'el-icon-caret-right': !ShowThematicMap1
            }"
            @click="ShowThematicMap1 = !ShowThematicMap1"
          ></i>
          <el-checkbox v-model="thematicMap1" label="管网缺陷密度图"></el-checkbox>
        </div>
        <transition name="el-zoom-in-top">
          <div v-show="ShowThematicMap1" class="transition-box">
            <div class="line-color"></div>
            <div class="text-mix-max">
              <span>少</span>
              <span>多</span>
            </div>
          </div>
        </transition>
      </div>
      <div>
        <div class="thematicMap-title">
          <i
            :class="{
              'el-icon-caret-bottom': ShowThematicMap2,
              'el-icon-caret-right': !ShowThematicMap2
            }"
            @click="ShowThematicMap2 = !ShowThematicMap2"
          ></i>
          <el-checkbox v-model="thematicMap2" label="管网缺陷分布专题图"></el-checkbox>
        </div>
        <transition name="el-zoom-in-top">
          <div v-show="ShowThematicMap2" class="transition-box">
            <ul>
              <li class="see-data">1级 ({{ '111个' }})</li>
              <li class="see-data">2级 ({{ '111个' }})</li>
              <li class="see-data">3级 ({{ '111个' }})</li>
            </ul>
          </div>
        </transition>
      </div>
      <div>
        <div class="thematicMap-title">
          <i
            :class="{
              'el-icon-caret-bottom': ShowThematicMap3,
              'el-icon-caret-right': !ShowThematicMap3
            }"
            @click="ShowThematicMap3 = !ShowThematicMap3"
          ></i>
          <el-checkbox v-model="thematicMap3" label="检查井缺陷分布专题图"></el-checkbox>
        </div>
        <transition name="el-zoom-in-top">
          <div v-show="ShowThematicMap3" class="transition-box">
            <ul>
              <li class="see-data">井盖缺失 ({{ '111个' }})</li>
              <li class="see-data">井盖破损 ({{ '111个' }})</li>
              <li class="see-data">井盖移位 ({{ '111个' }})</li>
            </ul>
          </div>
        </transition>
      </div>
      <div>
        <div class="thematicMap-title">
          <i
            :class="{
              'el-icon-caret-bottom': ShowThematicMap4,
              'el-icon-caret-right': !ShowThematicMap4
            }"
            @click="ShowThematicMap4 = !ShowThematicMap4"
          ></i>
          <el-checkbox v-model="thematicMap4" label="管网健康评估专题图"></el-checkbox>
        </div>
        <transition name="el-zoom-in-top">
          <div v-show="ShowThematicMap4" class="transition-box">
            <ul>
              <li class="see-data-line">1级 ({{ '111个' }})</li>
              <li class="see-data-line">2级 ({{ '111个' }})</li>
              <li class="see-data-line">3级 ({{ '111个' }})</li>
            </ul>
          </div>
        </transition>
      </div>
    </div>
    <button type="primary" @click="openDefect">打开管道缺陷管理模块</button>
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
        test1: '',
        test2: '',
        time1: '',
        time2: ''
      },
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { max: 100, message: '内容不能超过100个字符串', trigger: 'blur' }
        ]
      }
    }
  },
  beforeCreate(){

  },
  methods: {
    openDefect() {
      // 管道缺陷管理的信息
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
  padding-left: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
.see-data {
  margin: 10px 0 10px 20px !important;
}
.see-data::before {
  position: relative;
  left: -20px;
  top: -2px;
  content: '';
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  background-color: #e11111;
}
.see-data-line {
  margin: 10px 0 10px 18px !important;
}
ul > .see-data-line::before {
  position: relative;
  top: -2px;
  left: -20px;
  content: '';
  width: 40px;
  height: 8px;
  display: inline-block;
  background-color: #f405ff;
}
ul > .see-data-line:nth-child(2):before {
  background-color: #0c9923;
}
ul > .see-data-line:nth-child(3):before {
  background-color: #ff0000;
}
</style>