<template>
  <div>
  <el-row :gutter="40"  v-if="controls.top.length > 0 " type="flex" style="height: 320px">
      <template v-for="item in controls.top">
        <el-col :key="item.key" :span="span(controls.top.length)" class="show-divider">
          <month-certification-type v-if="validateAuth('monthCertificationType') && item.key ==='monthCertificationType'" :name="item.name" :monthCertificationType = monthCertificationTypeList ></month-certification-type>
        </el-col>
      </template>
    </el-row>
    <el-row :gutter="40" v-if="controls.bottom.length > 0 " type="flex" style="height: 320px">
      <template v-for="item in controls.bottom">
        <el-col :key="item.key" :span="span(controls.bottom.length)" class="show-divider top-divider">
          <year-economic-social v-if="validateAuth('yearEconomicSocial') && item.key ==='yearEconomicSocial'" :name="item.name" :yearEconomicSocial = yearEconomicSocialList ></year-economic-social>
          <year-qualified-timeout v-if="validateAuth('yearQualifiedTimeout') && item.key ==='yearQualifiedTimeout'" :name="item.name" :yearQualifiedTimeout = yearQualifiedTimeoutList ></year-qualified-timeout>
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script>
import MonthCertificationType from './components/MonthCertificationType'
import YearEconomicSocial from './components/YearEconomicSocial'
import YearQualifiedTimeout from './components/YearQualifiedTimeout'
import auth from '../../mixins/DashboardAuth'

import { getQualityCertification,getQualityBenefit,getQualityQualifiedTimeout } from '@/api/dashboard'

export default {
  components: {MonthCertificationType, YearEconomicSocial, YearQualifiedTimeout},
  mixins: [auth],
  data() {
    return {
      controls: {
        top: [
          {
            key: 'monthCertificationType',
            name: '当月认证类型'
          },
        ],
        bottom : [
          {
            key: 'yearEconomicSocial',
            name: '当月整改成效'
          },
          {
            key: 'yearQualifiedTimeout',
            name: '当月合格率/超时率'
          },
        ]
      },

      monthCertificationTypeList:[],
      yearEconomicSocialList:[],
      yearQualifiedTimeoutList:[],
    }
  },
  created(){
    this.controls.top = this.setControls(this.controls.top) 
    this.controls.bottom = this.setControls(this.controls.bottom) 


     this.getMonthCertificationTypeList()
     this.getYearEconomicSocialList()
     this.getYearQualifiedTimeoutList()
  },
  computed: {
    span() {
      return function(length) {
        return 24 / length
      }
    }
  },
  methods: {
    /**
     * @description 认证类型
     */
    getMonthCertificationTypeList(){
      var that = this
      getQualityCertification({}).then(res => {
         if(res.code !== -1) {
            let _resultList = res.result
            _resultList.forEach(function(item, index) {
               that.monthCertificationTypeList.push({
                 name:item.cname,
                 month:item.dateTime,
                 value:item.num,
               })
            })
         }else{
           that.$message.error(res.message)
         }
      })
    },

    /**
     * @description 整改成效
     */
    getYearEconomicSocialList(){
      var that = this
      getQualityBenefit({}).then(res => {
         if(res.code !== -1) {
            let _resultList = res.result
            _resultList.forEach(function(item, index) {
               that.yearEconomicSocialList.push({
                 typeName:item.typeName,
                 socialBenefitNum:item.socialBenefitNum,
                 economicBenefitsSum:item.economicBenefitsSum,
               })
            })
         }else{
           that.$message.error(res.message)
         }
      })
    },

    /**
     * @description 合格率/超时率
     */
    getYearQualifiedTimeoutList(){
      var that = this
      getQualityQualifiedTimeout({}).then(res => {
         if(res.code !== -1) {
            let _resultList = res.result
            that.yearQualifiedTimeoutList.push(_resultList.qualifiedNum)    //合格数
            that.yearQualifiedTimeoutList.push(_resultList.qualifiedRate)    //合格率
            that.yearQualifiedTimeoutList.push(_resultList.timeoutNum)    //超时数
            that.yearQualifiedTimeoutList.push(_resultList.timeoutRate)    //超时
         }else{
           that.$message.error(res.message)
         }
      })
    },

  },
  mounted() {
    // this.drawChart()
  }
}
</script>
<style lang="scss" scoped>
.show-divider {
  position: relative;
  &::after {
    content: "";
    position: absolute;
    top: 10px;
    right: 0;
    width: 1px;
    height: 95%;
    background: #eff0f5;
  }
}
.top-divider {
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 20px;
    width: 95%;
    height: 1px;
    background: #eff0f5;
  }
}
</style>