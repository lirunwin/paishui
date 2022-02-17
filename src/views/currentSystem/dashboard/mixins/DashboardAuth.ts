import { Vue, Component } from 'vue-property-decorator'
declare module 'vue/types/vue'{
  interface Vue{
    value:string;
    /**
     * dashboard混入函数
     * @param voucher 
     */
    validateAuth(voucher:string):any;
  }
}
@Component
export default class dashboardMixins extends Vue {
  value:string='11'
  get dashboardAuth() {
    // console.log("参数："+JSON.stringify(this.$store.getters.dashboard))
    return this.$store.getters.dashboard
  }
  validateAuth(voucher) {
    return this.dashboardAuth.some(item => item.name === voucher);
  }
  setControls(controls) {
    var that = this
    let newControls = controls.filter((element) => {
      let isExist = that.validateAuth(element.key)
      return isExist
    })
    return newControls
  }
}