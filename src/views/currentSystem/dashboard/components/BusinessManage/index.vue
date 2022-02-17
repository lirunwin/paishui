<template>
  <el-row :gutter="40" type="flex" style="height: 320px">
    <template v-for="item in controls" :span="span">
      <el-col :key="item.key" class="show-divider">
        <business-data v-if="validateAuth('businessData') && item.key === 'businessData'" :title="item.name" :business = businessList ></business-data>
        <finish-percentage v-if="validateAuth('finishPercentage') && item.key === 'finishPercentage'" :title="item.name" :business = businessList ></finish-percentage>
        <reject-percentage v-if="validateAuth('rejectPercentage') && item.key === 'rejectPercentage'" :title="item.name" :business = businessList ></reject-percentage>
      </el-col>
    </template>
  </el-row>
</template>

<script>
import BusinessData from './components/BusinessData'
import FinishPercentage from './components/FinishPercentage'
import RejectPercentage from './components/RejectPercentage'
import auth from '../../mixins/DashboardAuth'
import { businessManageList } from '@/api/dashboard'

export default {
  components: {BusinessData, FinishPercentage, RejectPercentage},
  mixins: [auth],
  data() {
    return {
      controls: [
        {
          name: '当月业务数据',
          key: 'businessData'
        },
        {
          name: '当月完成率',
          key: 'finishPercentage'
        },
        {
          name: '当月驳回率',
          key: 'rejectPercentage'
        }
      ],

      businessList:[],
    }
  },
  created(){
    this.controls = this.setControls(this.controls) 

    this.getBusinessManageList();
  },
  computed: {
    span() {
      return 24 / this.controls.length
    }
  },

  methods: {
    /**
     * @description 获取工单数据
     */
    getBusinessManageList(){
      var that = this
      businessManageList({}).then(res => {
        // console.log(res)
         if(res.code !== -1) {
            let _resultList = res.result
            //工单数据
            that.businessList.push(_resultList.planRepairOrderNumber);
            that.businessList.push(_resultList.repairOrderNumber);
            that.businessList.push(_resultList.notRepairOrderNumber);
            
         }else{
           that.$message.error(res.message)
         }
      })

      
    }
  }
}
</script>
<style lang="scss" scoped>
.show-divider {
  position: relative;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    background: #eff0f5;
  }
}
</style>