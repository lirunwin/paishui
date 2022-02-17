<template>
  <blocks title="营销" menus-on :menus="marketingMenu" :currMenu="currMenu" @menu-change="getCuurrMenu" line>
    <meter-reading-manage v-if="validateAuth('meterReadingManage') && currMenu === 'meterReadingManage'"></meter-reading-manage>
    <business-manage v-if="validateAuth('businessManage') && currMenu === 'businessManage'"></business-manage>
    <meter-service-manage v-if="validateAuth('meterServiceManage') && currMenu === 'meterServiceManage'"></meter-service-manage>
    <quality-manage v-if="validateAuth('qualityManage') && currMenu === 'qualityManage'"></quality-manage>
  </blocks>
</template>

<script>
import Blocks from '../Layout/Blocks'
import MeterReadingManage from '../MeterReadingManage'
import BusinessManage from '../BusinessManage'
import MeterServiceManage from '../MeterServiceManage'
import QualityManage from '../QualityManage'
import auth from '../../mixins/DashboardAuth'
export default {
  components: {Blocks, MeterReadingManage, BusinessManage, MeterServiceManage, QualityManage},
  mixins: [auth],
  data() {
    return {
      marketingMenu: [
        {
          name: '抄表管理系统',
          key: 'meterReadingManage'
        },
        {
          name: '业务管理系统',
          key: 'businessManage'
        },
        {
          name: '表务管理系统',
          key: 'meterServiceManage'
        },
        {
          name: '质量管理系统',
          key: 'qualityManage'
        },
      ],
      currMenu: 'meterReadingManage'
    }
  },
  created() {
    this.setMarketingMenu()
  },
  // computed:{
  //   marketingMenu:function () {
  //     return this.marketingMenu.filter(function (menu) {
  //       return menu.isActive
  //     })
  //   }
  // },
  methods: {
    getCuurrMenu(menu) {
      this.currMenu = menu;
    },

    /**
     * @description 设置显示
     */
    setMarketingMenu(){
      var that = this
      // that.marketingMenu.map(element =>{
      //   let isExist = that.validateAuth(element.key)
      //   element.isexist = isExist
      //   console.log(element.name+"是否存在："+isExist)
      // })
      var _currMenu = ""
      that.marketingMenu = that.marketingMenu.filter((element) => {
        let isExist = that.validateAuth(element.key)
        if(isExist){
          if(_currMenu=="")
            _currMenu = element.key
        }
        return isExist
      })
      that.currMenu = _currMenu

      // that.marketingMenu.forEach(element =>{
      //   let isExist = that.validateAuth(element.key)
      //   element.isexist = isExist
      //   console.log(element.name+"是否存在："+isExist)
      // })
    }
  }
}
</script>