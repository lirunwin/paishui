<template>
  <div class='searchTool'>
    <el-input :placeholder="'请输入'+title" v-model="searchInput" class="searchInput input-with-select">
      <el-select v-model="select" class='selectInput' @change="selectChange" slot="prepend" placeholder="请选择">
        <template v-for="(item,index) in selectList">
          <el-option :label="item.label" :value="item.value" :key="'searchTool_'+index"></el-option>
        </template>
      </el-select>
      <el-button class='buttonDiv' slot="append" @click="searchInfo" icon="el-icon-search"></el-button>
    </el-input>
    <div v-show="resData.length !== 0" class="res-box i-scrollbar">
      <div v-for="(item, index) in resData" :key="index" class="res-box-item">
        <span style="">{{ item.name }}</span>
        <span style="font-size:12px;float:right;color:#bbb">{{ item.mark}}</span>
      </div>
    </div>
  </div>
</template>

<script>
// 搜索工具

export default {
  name: 'searchTool',
  // components: { tfLegend },
  props: { 
    map:{
      type:Object,
      default:null,
    }
  },
  data() {
    return {
      selectList:[
        {
        label:"地名",
        value:"1",
        },{
          label:"坐标",
          value:"2",
        },{
          label:"排水户",
          value:"3",
        },{
          label:"排水口",
          value:"4",
        }
      ],
      // 查询结果
      resData: [

      ],
      select:'1',
      searchInput:'',
      title:"地名",
    }
  },
  mounted() {

  },
  methods: {

    /**
     * 下拉框改变的时候
    */
    selectChange(){
      let selectData=this.selectList.find(item=>{return item.value==this.select});
      this.title=selectData.label
    },

    /**
     * 查询信息
    */
    searchInfo(){

    }
  }
}
</script>
<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  .searchTool{
  height: 40px;
  position: relative;
  float: left;
  width: 318px;
  /deep/ .selectInput{
    width: 90px;
  }
  /deep/ .el-input-group__prepend{
    background:white !important; 
  }
  /deep/ .el-input-group__append{
    background: rgba(64, 158, 255, 1) !important;
  }
  /deep/ .el-icon-search{
    color: white !important;
  }
  .res-box {
    width: 100%;
    max-height: 300px;
    background-color: #fff;
    padding: 10px 15px;
    display: flex;
    flex-direction: column;
    align-content: center;
    .i-scrollbar {
      overflow: auto;
      @include scrollBar;
    }
  }
  .res-box-item {
    font-size: 15px;
    height: 20px;
    line-height: 20px;
  }
}
</style>