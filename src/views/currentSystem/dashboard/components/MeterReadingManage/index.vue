<template>
  <el-row :gutter="40" type="flex" style="height: 320px">
    <template v-for="item in controls" :span="span">
      <el-col :key="item.key" class="show-divider">
        <meter-reading v-if="validateAuth('meterReading') && item.key === 'meterReading'" :meterReading = meterReadingList ></meter-reading>
        <missions v-if="validateAuth('missions') && item.key === 'missions'" :missions = missionsList ></missions>
        <download-amount  v-if="validateAuth('downloadAmount') && item.key === 'downloadAmount'" :downloadAmount = downloadAmountList ></download-amount>
        <reading-percentage v-if="validateAuth('readingPercentage') && item.key === 'readingPercentage'" :readingPercentage = readingPercentageList></reading-percentage>
      </el-col>
    </template>
  </el-row>
</template>

<script>
import MeterReading from './components/MeterReading'
import Missions from './components/Missions'
import ReadingPercentage from './components/ReadingPercentage'
import auth from '../../mixins/DashboardAuth'
import DownloadAmount from './components/DownloadAmount'
import { meterReadingList } from '@/api/dashboard'

export default {
  components: { MeterReading, Missions, ReadingPercentage, DownloadAmount },
  mixins: [auth],
  data() {
    return {
      controls: [
        {
          name: '当月抄表数',
          key: 'meterReading',
          list:[]
        },
        {
          name: '当月任务数',
          key: 'missions',
          list:[]
        },
        {
          name: '当月下载数',
          key: 'downloadAmount',
          list:[]
        },
        {
          name: '当月抄表率',
          key: 'readingPercentage',
          list:[]
        }
      ],

      meterReadingList:[],
      missionsList:[],
      downloadAmountList:[],
      readingPercentageList:[],

    }
  },
  created(){
    this.controls = this.setControls(this.controls)

    this.getMeterReadingList();
  },
  computed: {
    span() {
      return 24 / this.controls.length
    }
  },

  methods: {
    /**
     * @description 获取抄表数据
     */
    getMeterReadingList(){
      var that = this
      // const formdata = new FormData()
      // const params = Object.assign({}, that.pagination, that.filter)
      // Object.keys(params).forEach((key) => {
      //   formdata.append(key, params[key])
      // })

      meterReadingList({}).then(res => {
        // console.log(res)
         if(res.code !== -1) {
            let _resultList = res.result

            that.controls.forEach(item => {
              //抄表数
              if(item.key=='meterReading'){
                that.meterReadingList.push({
                  plan: true,
                  name: '计划抄表数',
                  total: _resultList.planMeterReadingNumber,
                  planNum: _resultList.planMeterReadingNumber
                });
                that.meterReadingList.push({
                  name: '已抄表数',
                  total: _resultList.meterReadingNumber,
                  planNum: _resultList.planMeterReadingNumber
                });
                that.meterReadingList.push({
                  name: '未抄表数',
                  total: _resultList.notMeterReadingNumber,
                  planNum: _resultList.planMeterReadingNumber
                });
              }

              //任务数
              if(item.key=='missions'){
                that.missionsList.push(_resultList.planAllotment)
                that.missionsList.push(_resultList.allotment)
                that.missionsList.push(_resultList.notAllotment)
              }

              //下载数
              if(item.key=='downloadAmount'){
                that.downloadAmountList.push(_resultList.planDownloadNumber)
                that.downloadAmountList.push(_resultList.downloadNumber)
                that.downloadAmountList.push(_resultList.notDownloadNumber)
              }

              //抄表率
              if(item.key=='readingPercentage'){
                that.readingPercentageList.push(_resultList.planMeterReadingNumber)
                that.readingPercentageList.push(_resultList.meterReadingNumber)
                that.readingPercentageList.push(_resultList.notMeterReadingNumber)
              }
              
            });
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