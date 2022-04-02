<template>
  <div class='rightTopTool' v-if='groupList&&groupList.length>0' @mouseleave="hideList">
    <template v-for='(item,index) in groupList'>
      <div class='groupDiv' :key="'rightTopTool_'+index">
        <div class='grouptitle' @mouseover="showList(item)">
          <div class='imgDiv'>
            <!-- 目前没有图片后续，可以读取图片地址，通过地址进行动态加载，地址写入下面的src中 -->
            <i class="el-icon-notebook-1"></i>
            <!-- <img style='width:100%;width:100%' src=''> -->
          </div>
          <span  class='spanDiv'>{{item.label}}</span>
          <i v-if="item.childList.length" class="el-icon-arrow-down"></i>
        </div>
        <div @mouseleave="hideList" v-show='item.showList' class='groupList'>
          <div class='splitDiv'></div>
          <ul class='groupListUl'>
          <template v-for="(item2,index2) in item.childList">
            <li class='groupListLi' @click="openFunction(item2)" :key="'rightTopTool_'+index+'groupItem_'+index2">{{item2.label}}</li>
          </template>
          </ul>
        </div>
      </div>
    </template>
    <!-- 管理没有框的组件（距离测量、长度测量等） -->
    <component
    v-for="item in componentList"
    :key="item.name"
    :is="item.component"
    :map="map"
  />
  </div>
</template>

<script>
// 本模块用于管理右上角的工具栏,所有的右上角工具都是从这里进行加载
export default {
  name: 'rightTopTool',
  components: {  },
  props: { 
    toolList:null,
    map:null
  },
  data() {
    return {
      /**工具栏的功能组*/
      groupList:[],
      /**当前展示的功能组*/
      currentList:null,
      /**没有在浮动框、全框、半框里面的组件*/
      componentList:[],
    }
  },
  mounted() {
    this.getGroupList();
  },
  methods: {
    getGroupList(){
      
      console.log("1111",this.toolList)
      let temp=[];
      //确定父子关系
      this.toolList.forEach(item=>{
        if(item.parentPathid){
          if(temp[item.parentPathid]){
            temp[item.parentPathid].push(item)
          }else{
            temp[item.parentPathid]=[item];
          }
        }else{
          if(temp[item.name]){
            item.childList=temp[item.name];
          }else{
            temp[item.name]=[];
            item.childList=temp[item.name]
          }
          item.showList=false;
          this.groupList.push(item);
        }
      });
    },

    /**
     * 获取指定层级下面的组件
     * @param typeString 指定层级的名称
     * */ 
    getComponents(typeString){
        let temp=this.$store.state.routeSetting.addRoutes.find(val=>{ return val.name&&val.name==typeString});
        return temp.children||[]
    },

    /**
     * 展示功能列表
     * @param list 当前展示的功能列表
     * */
    showList(list){
      if(this.currentList){
        this.currentList.showList=false;
      };
      this.currentList=list;
      this.currentList.showList=true;
      let temp=this.currentList.label;
      this.currentList.label='123123';
      this.currentList.label=temp;
    },

    /**
     * 隐藏功能组
     * @param list 当前展示的功能列表
     * */
    hideList(){
      if(this.currentList){
        this.currentList.showList=false;
        let temp=this.currentList.label;
        this.currentList.label='123123';
        this.currentList.label=temp;
      }
    },

    /**
     * 打开对应的功能
     * @param val 对应功能的信息
     * */
    openFunction(val){
      console.log("点击工具")
      if(!val.widgetid){
        let componentList=this.getComponents("rightTopTool");
        let tempComponent=componentList.find(e=>{return e.name==val.name});
        let index =this.componentList.findIndex(e=>{return e.name==val.name});
        if(index!=-1){
          this.componentList.splice(index,1);
        }
        this.$nextTick(e=>{
          this.componentList.push(tempComponent);
        })
      }else{
        this.$store.dispatch("map/changeMethod",{
          com: val.id || val.pathId,
          box: val.widgetid,
          title: val.label,
          param: val.param || {}
        });
      }
    }
  }

    //  let temp=[];
    //   this.toolList.forEach(item=>{
    //     if(item.childList&&item.childList.length>0){
    //       temp.push(item);
    //     }
    //   });
    //   const allModel=this.$store.state.routeSetting.routes;//获取所有功能
    //   temp.forEach(item=>{
    //     let parent=allModel.find(e=>{return e.name=item.name});
    //     item.childList.forEach(val=>{
    //       let tempComponent=allModel.find(e=>{return e.name=val.name});
    //       if(!parent.components){
    //         parent.components=null;
    //       }
    //       parent.components[val.name]=tempComponent;
    //     });
    //     console.log(parent);
    //   })
    //   temp=temp  
}
</script>
<style lang="scss" scoped>
.rightTopTool{
  position: absolute;
  right: 10px;
  top: 10px;
  background: rgba(255, 254, 254, 1);
  z-index: 2;
  box-shadow: 0px 0px 5px rgba(0,0,0,0.1);
  border-radius: 2px;
  height: 40px;
  padding:2px;
  .groupDiv{
    position: relative;
    float: right;
    font-size: 14px;
    height: 100%;
  }
  .grouptitle{
    height: 100%;
    width: 100%;
    position: relative;
    float: left;
    .imgDiv{
      position: relative;
      float: left;
      width: 16px;
      height: 16px;
      top: 10px;
    }
    .spanDiv{
      position: relative;
      float: left;
      top:10px;
      padding-left: 2px;
    }
    .spanDiv:hover{
      color: rgb(102, 177, 255);
    }
    .el-icon-arrow-down{
      position: relative;
      float: left;
      top:10px;
      padding-left: 7px;
      padding-right: 3px;
    }
  }
  .hideList{
    position: relative;
    float: left;
    width: 100%;
  }
  .splitDiv{
    position: relative;
    float: left;
    width: 100%;
    height: 10px;
    background: rgba(0,0,0,0);
  }
  .groupListUl{
    position: relative;
    float: left;
    width: 100%;
    padding: 0px;
    list-style: none;
    margin: 0px !important;
    background: rgba(255, 254, 254, 1);
    border-radius: 2px;
    li.groupListLi{
      padding: 5px;
      background: rgba(236, 245, 255, 0);
      width: 100%;
      text-align: center;
    }
    li.groupListLi:hover{
      background-color: rgba(236, 245, 255, 1);
      color: rgb(102, 177, 255);
    }
  }
}
</style>
