<template>
  <blocks title="生产运营">
    <el-row >
      <template v-for="item in controls.line1">
        <el-col :key="item.key" :span="controls.colSpan" style="height: 320px" class="show-divider">
          <difference v-if="validateAuth('difference') && item.key === 'difference'" :name="item.name"></difference>
          <leak-rate v-if="validateAuth('leakRate') && item.key === 'leakRate'" :name="item.name"></leak-rate>
        </el-col>
      </template>
 
      <template v-for="item in controls.line2">
        <el-col :key="item.key" :span="controls.colSpan" style="height: 320px" class="show-divider top-divider">
          <sup-and-sell-amount v-if="validateAuth('supAndSellAmount') && item.key === 'supAndSellAmount'" :name="item.name"></sup-and-sell-amount>
          <unitchange-cost v-if="validateAuth('unitchangeCost') && item.key === 'unitchangeCost'" :name="item.name"></unitchange-cost>
        </el-col>
      </template>

      <template v-for="item in controls.line3">
        <el-col :key="item.key" :span="controls.colSpan" style="height: 320px" class="show-divider top-divider">
          <company-sup-use-water-first v-if="validateAuth('companySupUseWaterFirst') && item.key === 'companySupUseWaterFirst'" :name="item.name"></company-sup-use-water-first>
          <company-sup-use-water-second v-if="validateAuth('companySupUseWaterSecond') && item.key === 'companySupUseWaterSecond'" :name="item.name"></company-sup-use-water-second>
        </el-col>
      </template>
  
      <template v-for="item in controls.line4">
        <el-col :key="item.key" :span="controls.colSpan" style="height: 320px" class="show-divider top-divider">
          <water-quality-first v-if="validateAuth('waterQualityFirst') && item.key === 'waterQualityFirst'" :name="item.name"></water-quality-first>
          <water-quality-second v-if="validateAuth('waterQualitySecond') && item.key === 'waterQualitySecond'" :name="item.name"></water-quality-second>
        </el-col>
      </template>
    
      <template v-for="item in controls.line5">
        <el-col :key="item.key" :span="controls.colSpan" style="height: 320px" class="show-divider top-divider">
          <water-pressure-first v-if="validateAuth('waterPressureFirst') && item.key === 'waterPressureFirst'" :name="item.name"></water-pressure-first>
          <water-pressuer-second v-if="validateAuth('waterPressureSecond') && item.key === 'waterPressureSecond'" :name="item.name"></water-pressuer-second>
        </el-col>
      </template>
  
      <template v-for="item in controls.line6">
        <el-col :key="item.key" :span="controls.colSpan" style="height: 320px" class="show-divider top-divider">
          <indicators-for-first v-if="validateAuth('indicatorsForFirst') && item.key === 'indicatorsForFirst'" :name="item.name"></indicators-for-first>
          <indicators-for-second v-if="validateAuth('indicatorsForSecond') && item.key === 'indicatorsForSecond'" :name="item.name"></indicators-for-second>
        </el-col>
      </template>
    </el-row>
  </blocks>
</template>

<script>
import Blocks from '../Layout/Blocks.vue'
import Difference from './components/Difference'
import LeakRate from './components/LeakRate'
import SupAndSellAmount from './components/SupAndSellAmount'
import UnitchangeCost from './components/UnitchangeCost'
import CompanySupUseWaterFirst from './components/CompanySupUseWaterFirst'
import CompanySupUseWaterSecond from './components/CompanySupUseWaterSecond'
import WaterQualityFirst from './components/WaterQualityFirst'
import WaterQualitySecond from './components/WaterQualitySecond'
import WaterPressureFirst from './components/WaterPressureFirst'
import WaterPressuerSecond from './components/WaterPressuerSecond'
import IndicatorsForFirst from './components/IndicatorsForFirst'
import IndicatorsForSecond from './components/IndicatorsForSecond'
import auth from '../../mixins/DashboardAuth'
export default {
  components: { Blocks, Difference, LeakRate, SupAndSellAmount, UnitchangeCost, CompanySupUseWaterFirst, CompanySupUseWaterSecond, WaterQualityFirst, WaterQualitySecond, WaterPressureFirst, WaterPressuerSecond, IndicatorsForFirst, IndicatorsForSecond },
  mixins: [auth],
  data() {
    return {
      controls: {
        line1: [
          {
            key: 'difference',
            name: '年产销差'
          },
          {
            key: 'leakRate',
            name: '年漏损率'
          },
          
        ],
        line2: [
          {
            key: 'supAndSellAmount',
            name: '年供水量、售水量'
          },
          {
            key: 'unitchangeCost',
            name: '年单位变动成本'
          },
        ],
        line3: [
          {
            key: 'companySupUseWaterFirst',
            name: '一厂（取供水曲线图）'
          },
          {
            key: 'companySupUseWaterSecond',
            name: '二厂（取供水曲线图）'
          },
        ],
        line4: [
          {
            key: 'waterQualityFirst',
            name: '一厂（水质曲线图）'
          },
          {
            key: 'waterQualitySecond',
            name: '二厂（水质曲线图）'
          },
        ],
        line5: [
          {
            key: 'waterPressureFirst',
            name: '一厂（水压曲线图）'
          },
          {
            key: 'waterPressureSecond',
            name: '二厂（水压曲线图）'
          },
        ],
        line6: [
          {
            key: 'indicatorsForFirst',
            name: '一厂'
          },
          {
            key: 'indicatorsForSecond',
            name: '二厂'
          },
        ],
        colSpan:12,   //数量
      }
    }
  },
  created(){
    this.controls.line1 = this.setControls(this.controls.line1) 
    this.controls.line2 = this.setControls(this.controls.line2) 
    this.controls.line3 = this.setControls(this.controls.line3) 
    this.controls.line4 = this.setControls(this.controls.line4) 
    this.controls.line5 = this.setControls(this.controls.line5) 
    this.controls.line6 = this.setControls(this.controls.line6) 
  },
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