<template>
  <div class="pipe-material-container">
    <span style="font-weight: bold">{{name}}</span>
    <div ref="pipeMaterial" class="chart-container"></div>
  </div>
</template>

<script>
import Echarts from 'echarts'
export default {
  props: {
    name:{
       type: String,
       default: ''
    },
    materialClassfication:{
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      Echarts
    }
  },
  watch:{
    materialClassfication(newV,oldV){
      console.log("materialClassfication："+JSON.stringify(newV))
      this.materialClassfication = newV

      this.drawChart()
    }
  },
  methods: {
    drawChart() {
      const options = {
        tooltip: {
          trigger: 'item',
          formatter: '{a0}<br />{b0}: {c0} m<br />占比: {d0}%'
        },
        // legend: {
        //   left: 'center',
        //   top: 15,
        //   icon: "rect"
        // },
        series: [
          {
            name: '管线材质',
            type: 'pie',
            radius: '65%',
            top: 20,
            color: ['#FFB6C1', '#4169E1', '#7FFFAA', '#F0E68C', '#FF6347', '#D2691E', '#3CB371','#f6da22','#bbe2e8','#6cacde'],
            data: this.materialClassfication,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              show: true,
              formatter: '{name|{b}}\n{time|{c} m}',
              padding: [0, -20],
              rich: {
                time: {
                  fontSize: 10
                }
              }
            },
            labelLine: {
              length: 15,
              length2: 40,
              maxSurfaceAngle: 80
            },
            labelLayout: function (params) {
                var isLeft = params.labelRect.x < myChart.getWidth() / 2;
                var points = params.labelLinePoints;
                // Update the end point.
                points[2][0] = isLeft
                    ? params.labelRect.x
                    : params.labelRect.x + params.labelRect.width;

                return {
                    labelLinePoints: points
                };
            },
          }
        ]
      }
      const chartReady = this.Echarts.init(this.$refs.pipeMaterial)
      chartReady.setOption(options)
      //自定义缩放
      window.addEventListener("resize", () => {
        if(chartReady){
          chartReady.resize()
        }
      })
    }
  },
  mounted() {
    this.drawChart()
  }
}
</script>

<style lang="scss" scoped>
.pipe-material-container {
  padding: 10px;
  width: 100%;
  height: 100%;
  .chart-container {
    width: 100%;
    height: 100%;
  }
}
</style>
