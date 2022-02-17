<template>
  <el-row :gutter="40" type="flex" style="height: 320px">
    <template v-for="item in controls" :span="span">
      <el-col :key="item.key" class="show-divider">
        <number-of-water-meter v-if="validateAuth('numberOfWaterMeter') && item.key ==='numberOfWaterMeter'" :name="item.name" :numberOfWaterMeter = numberOfWaterMeterList ></number-of-water-meter>
        <number-of-company v-if="validateAuth('numberOfCompany') && item.key ==='numberOfCompany'" :name="item.name" :numberOfCompany = numberOfCompanyList ></number-of-company>
        <number-of-caliber v-if="validateAuth('numberOfCaliber') && item.key ==='numberOfCaliber'" :name="item.name" :numberOfCaliber = numberOfCaliberList ></number-of-caliber>
        <number-of-installing v-if="validateAuth('numberOfInstalling') && item.key ==='numberOfInstalling'" :name="item.name" :numberOfInstalling = numberOfInstallingList ></number-of-installing>
        <number-of-transfer v-if="validateAuth('numberOfTransfer') && item.key ==='numberOfTransfer'" :name="item.name" :numberOfTransfer = numberOfTransferList ></number-of-transfer>
        <!-- <number-of-sampling v-if="validateAuth('numberOfSampling') && item.key ==='numberOfSampling'" :name="item.name"></number-of-sampling> -->
      </el-col>
    </template>
  </el-row>
</template>

<script>
import NumberOfWaterMeter from './components/NumberOfWaterMeter'
import NumberOfCompany from './components/NumberOfCompany'
import NumberOfCaliber from './components/NumberOfCaliber'
import NumberOfInstalling from './components/NumberOfInstalling'
import NumberOfTransfer from './components/NumberOfTransfer'
import NumberOfSampling from './components/NumberOfSampling'
import auth from '../../mixins/DashboardAuth'

import { getWaterMeterNumberNum,getWaterMeterEnterprise,getWaterMeterInstall,getWaterMeterOld,getWaterMeterOutbound } from '@/api/dashboard'

export default {
  components: { NumberOfWaterMeter, NumberOfInstalling, NumberOfTransfer, NumberOfSampling, NumberOfCompany, NumberOfCaliber},
  mixins: [auth],
  data() {
    return {
      controls: [
        {
          name: '累计库存统计',
          key: 'numberOfWaterMeter'
        },
        {
          name: '累计厂家水表只数',
          key: 'numberOfCompany'
        },
        {
          name: '当月出库数',
          key: 'numberOfCaliber'
        },
        {
          name: '当月新装数',
          key: 'numberOfInstalling'
        },
        {
          name: '当月报废数',   //报废数
          key: 'numberOfTransfer'
        },
        // {
        //   name: '水表抽检数',
        //   key: 'numberOfSampling'
        // },
      ],

      numberOfWaterMeterList:[],
      numberOfCompanyList:[],
      numberOfCaliberList:[],
      numberOfInstallingList:[],
      numberOfTransferList:[],

    }
  },
  created(){
    this.controls = this.setControls(this.controls) 

     this.getWaterMeterList()
     this.getCompanyList()
     this.getCaliberList()
     this.getInstallingList()
     this.getTransferList()
  },
  computed: {
    span() {
      return 24 / this.controls.length
    }
  },

   methods: {
    /**
     * @description 入库数
     */
    getWaterMeterList(){
      var that = this
      getWaterMeterNumberNum({}).then(res => {
        // console.log(res)
         if(res.code !== -1) {
            let _resultList = res.result

            that.numberOfWaterMeterList.push(_resultList.totalWaterMeterNumber)   //入库总数
            that.numberOfWaterMeterList.push(_resultList.waterMeterOutboundNumber)   //已出库
            that.numberOfWaterMeterList.push(_resultList.notWaterMeterOutboundNumber)   //未出库
            that.numberOfWaterMeterList.push(_resultList.installationNumber)   //新装数
            that.numberOfWaterMeterList.push(_resultList.oldTransferNumber)   //移交旧表(报废)
            
            

            // that.controls.forEach(item => {
            //   //入库数
            //   if(item.key=='numberOfWaterMeter'){
            //    that.numberOfWaterMeterList.push(_resultList.totalWaterMeterNumber)
            //    that.numberOfWaterMeterList.push(_resultList.waterMeterOutboundNumber)
            //    that.numberOfWaterMeterList.push(_resultList.notWaterMeterOutboundNumber)
            //   }
            // });
         }else{
           that.$message.error(res.message)
         }
      })

      
    },

    /**
     * @description 厂家水表只数
     */
    getCompanyList(){
      var that = this
      getWaterMeterEnterprise({}).then(res => {
         if(res.code !== -1) {
            let _resultList = res.result
            _resultList.forEach(function(item, index) {
               that.numberOfCompanyList.push({
                 name:item.cname,
                 value:item.waterMeterNumber,
               })
            })
         }else{
           that.$message.error(res.message)
         }
      })

      
    },

    /**
     * @description 出库数
     */
    getCaliberList(){
      var that = this
      getWaterMeterOutbound({}).then(res => {
         if(res.code !== -1) {
            let _resultList = res.result
            _resultList.forEach(function(item, index) {
               that.numberOfCaliberList.push({
                 name:item.cname,
                 value:item.totalNumber,
               })
            })
         }else{
           that.$message.error(res.message)
         }
      })
    },

    /**
     * @description 新装数
     */
    getInstallingList(){
      var that = this
      getWaterMeterInstall({}).then(res => {
         if(res.code !== -1) {
            let _resultList = res.result
            _resultList.forEach(function(item, index) {
               that.numberOfInstallingList.push({
                 name:item.cname,
                 value:item.totalNumber,
               })
            })
         }else{
           that.$message.error(res.message)
         }
      })
    },

    /**
     * @description 移交表数/报废数
     */
    getTransferList(){
      var that = this
      getWaterMeterOld({}).then(res => {
         if(res.code !== -1) {
            let _resultList = res.result
            _resultList.forEach(function(item, index) {
               that.numberOfTransferList.push({
                 name:item.cname,
                 value:item.totalNumber,
               })
            })
         }else{
           that.$message.error(res.message)
         }
      })
    },
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