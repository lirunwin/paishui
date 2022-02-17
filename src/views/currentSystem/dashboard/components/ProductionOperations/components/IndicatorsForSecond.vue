<template>
  <div class="company-indicators-container">
    <span style="font-weight: bold">{{name}}</span>
    <template v-for="(item, index) in indicators">
      <indicator-component :key="index" :info="item.info" style="width: 20%; margin: 1%"></indicator-component>
    </template>
  </div>
</template>

<script>
import IndicatorComponent from './IndicatorComponent.vue'
import { getTwoFactoryKeyIndex } from '@/api/dashboard'

export default {
  components: { IndicatorComponent },
  props: ['name'],
  data() {
    return {
      indicators: [
        {
          info: {
            title: '关键指标',
            color: '#3178e8',
            indicate: [
              {
                name: '取水量',
                number: '0',
                unit: 'm³'
              },
              {
                name: '供水量',
                number: '0',
                unit: 'm³'
              },
              {
                name: '1#出厂水压',
                number: '0',
                unit: 'Mpa'
              },
              {
                name: '2#出厂水压',
                number: '0',
                unit: 'Mpa'
              },
            ]
          }
        },
        {
          info: {
            title: '水质指标',
            color: '#36cf8d',
            indicate: [
              {
                name: '余氯',
                number: '0',
                unit: 'mg/l'
              },
              {
                name: '浊度',
                number: '0',
                unit: 'NTU'
              }
            ]
          }
        },
        {
          info: {
            title: '加药耗量',
            color: '#4dcbed',
            indicate: [
              {
                name: 'PAC',
                number: '0',
                unit: 'kg'
              },
              {
                name: '液氯',
                number: '0',
                unit: 'kg'
              }
            ]
          }
        },
        {
          info: {
            title: '制水电耗',
            color: '#f7ce6b',
            indicate: [
              {
                name: '二厂',
                number: '0',
                unit: 'kwh'
              },
              // {
              //   name: '二厂',
              //   number: '234',
              //   unit: '㎡'
              // },
              // {
              //   name: '加压站总',
              //   number: '234',
              //   unit: 'Mpa'
              // },
            ]
          }
        },
      ]
    }
  },
  created(){
    this.getTwoFactoryKeyIndexList()
  },
  methods: {
    /**
     * @description 二厂关键指标
     */
    getTwoFactoryKeyIndexList(){
      var that = this
      getTwoFactoryKeyIndex({}).then(res => {
         if(res.code !== -1) {
            let _resultObject = res.result
            //关键指标
            that.indicators[0].info.indicate[0].number = _resultObject.waterSupplyValue.toFixed(1)
            that.indicators[0].info.indicate[1].number = _resultObject.waterIntakingValue.toFixed(1)
            that.indicators[0].info.indicate[2].number = _resultObject.sy1.toFixed(1)
            that.indicators[0].info.indicate[3].number = _resultObject.sy2.toFixed(1)

            //水质指标
            that.indicators[1].info.indicate[0].number = _resultObject.yl.toFixed(2)
            that.indicators[1].info.indicate[1].number = _resultObject.zd.toFixed(2)
    
            //加药耗量
            that.indicators[2].info.indicate[0].number = _resultObject.pac.toFixed(2)
            that.indicators[2].info.indicate[1].number = _resultObject.yldh.toFixed(2)

            //制水电耗
            that.indicators[3].info.indicate[0].number = _resultObject.dh.toFixed(2)

         }else{
           that.$message.error(res.message)
         }
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.company-indicators-container {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 10px;
}
</style>