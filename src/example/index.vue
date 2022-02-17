<template></template>
<script lang="ts">
//vue-property-decorator的使用可以让开发人员以类的形式声明API
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import UserDoc from "@/views/currentSystem/components/UserDoc/index.vue";
import Todos from "@/views/currentSystem/components/Todo/index.vue";
import Alarm from "@/views/currentSystem/components/Alarm/index.vue";
import UserTop from "@/views/currentSystem/components/UserTop/index.vue";
import mixin from "./mixins/mixin";
@Component({
  /**
   * 指定 name 选项的另一个好处是便于调试
   */
  name: "EXAMPLE",
  /**
   * Vue实例的可用组件
   */
  components: { UserDoc, Todos, Alarm, UserTop },
  /**
   * Vue实例的可用过滤器
   */
  filters: {
    formatteAuditStatus(val) {
      switch (val) {
        case "0":
          return "不同意";

        case "1":
          return "未审核";

        case "2":
          return "同意";
      }
    },
  },
  /**
   * Vue实例混入对象的数组
   */
  mixins: [mixin],
})
export default class Example extends Vue {
    /**
     * Vue实例的数据对象data中的属性
     */
    id:number=1
    code:string='示例文件'
    list:number[]=[1,2,3,4]
    /**
     * propA number类型, !表示一定有值
     */
    @Prop(Number) propA!:number
    /**
     * propB number类型，默认值为1
     */
    @Prop({default:1}) propB:number
    /**
     * propC类型为string或者number
     */
    @Prop([String,Boolean]) propC:string|boolean
    /**
     * 监听对象 括号中的$route等于this.$route
     */
    @Watch('$route')
    routeChange(newValue,oldValue){
        // 代码
    }
    /**
     * 监听对象 括号中的code等于this.code
     */
    @Watch('code',{immediate:true,deep:true})
    codeChange(newValue:string,oldValue:string){
        // 代码
    }
    /**
     * compute计算属性使用get，set标签
     */
    get computeA(){
        return this.code
    }
    set computed(code:string){
        this.code=code
    }
    /**
     * Vue生命周期函数
     */
    mounted() {
        // 代码
    }
    /**
     * 实例方法，无返回值
     */
    menthodA():void{

    }
    /**
     * 实例方法，返回值为字符串
     */
    menthodB(name:string):string{
        //代码
        return name
    }
}
</script>
<style lang="scss" scoped>

</style>