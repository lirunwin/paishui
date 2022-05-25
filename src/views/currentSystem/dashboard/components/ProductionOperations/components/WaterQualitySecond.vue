<template>
  <div class="sup-use-container">
    <span style="font-weight: bold">{{ name }}</span>
    <div style="display:flex; width: 100%; height: 100%">
      <div class="chart-container" ref="clChart"></div>
      <div class="chart-container" ref="ntuChart"></div>
    </div>
  </div>
</template>

<script>
import Echarts from 'echarts'
import { getTwoFactoryWaterQualityYL, getTwoFactoryWaterQualityZD } from '@/api/dashboard'

export default {
  props: ['name'],
  data() {
    return {
      Echarts,
      clData: [],
      ntuData: []
    }
  },
  created() {
    this.getTwoFactoryWaterQualityYLList()
    this.getTwoFactoryWaterQualityZDList()
  },
  methods: {
    drwaChart() {
      const options = [
        {
          ref: 'clChart',
          tooltip: {
            trigger: 'axis'
          },
          label: {
            show: true,
            color: '#333'
          },
          grid: {
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['13:05:00', '13:10:00', '13:15:00', '13:20:00', '13:25:00', '13:30:00', '13:35:00', '13:40:00'],
              axisLine: {
                lineStyle: {
                  color: '#eaeaea'
                }
              },
              axisLabel: {
                color: '#333',
                rotate: '-25'
              }
            }
          ],
          yAxis: [
            {
              name: '出厂余氯（mg/L）',
              nameTextStyle: {
                color: '#333'
              },
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: '#eaeaea'
                }
              },
              axisLabel: {
                color: '#333'
              },
              min: 'dataMin',
              max: 'dataMax'
            }
          ],
          color: ['#51cdf0'],
          legend: {
            data: ['余氯']
          },
          series: [
            {
              name: '余氯',
              type: 'line',
              data: [0.55, 0.56, 0.55, 0.58, 0.6, 0.57, 0.58, 0.6],
              smooth: true
            }
          ]
        },
        {
          ref: 'ntuChart',
          tooltip: {
            trigger: 'axis'
          },
          label: {
            show: true,
            color: '#333'
          },
          grid: {
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['13:05:00', '13:10:00', '13:15:00', '13:20:00', '13:25:00', '13:30:00', '13:35:00', '13:40:00'],
              axisLine: {
                lineStyle: {
                  color: '#eaeaea'
                }
              },
              axisLabel: {
                color: '#333',
                rotate: '-25'
              }
            }
          ],
          yAxis: [
            {
              name: ' 浊度（NTU）',
              nameTextStyle: {
                color: '#333'
              },
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: '#eaeaea'
                }
              },
              axisLabel: {
                color: '#333'
              },
              min: 'dataMin',
              max: 'dataMax'
            }
          ],
          color: ['#ee9b50'],
          legend: {
            data: ['浊度（NTU）']
          },
          series: [
            {
              name: '浊度（NTU）',
              type: 'line',
              data: [0.35, 0.36, 0.36, 0.35, 0.36, 0.35, 0.36, 0.38],
              smooth: true
            }
          ]
        }
      ]
      options.forEach((item) => {
        const chartReady = this.Echarts.init(this.$refs[item.ref])
        chartReady.setOption(item)
      })
    },

    /**
     * @description 余氯
     */
    drwaChartCl() {
      if (this.arrayIsNull(this.clData)) {
        var html =
          '<div style=" display: flex;display: -webkit-flex;align-items:center;justify-content:center; width:100;height:100%;"><span  style="color:#868686;font-size:14px;"><img src="data:image/png;base64,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" alt=""><p class="empty-p">暂无数据</p></span></div>'
        var chartDom = this.$refs.clChart
        chartDom.innerHTML = html
        chartDom.removeAttribute('_echarts_instance_')
      } else {
        const options = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: '{b0}<br />{a0}: {c0} mg/L'
          },
          label: {
            show: true,
            color: '#333'
          },
          grid: {
            left: '3%',
            right: '3%',
            bottom: '5%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: this.clData.map(function(item) {
                return item.xAxisData
              }),
              axisLine: {
                lineStyle: {
                  color: '#eaeaea'
                }
              },
              axisLabel: {
                color: '#333',
                rotate: '-25'
              }
            }
          ],
          yAxis: [
            {
              name: '出厂余氯(mg/L)',
              nameTextStyle: {
                color: '#333',
                padding: [0, 0, 0, 80]
              },
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: '#eaeaea'
                }
              },
              axisLabel: {
                color: '#333'
              },
              min: 'dataMin',
              max: 'dataMax'
            }
          ],
          color: ['#51cdf0'],
          legend: {
            data: ['余氯']
          },
          series: [
            {
              name: '余氯',
              type: 'line',
              data: this.clData.map(function(item) {
                return item.yAxisData
              }),
              smooth: true
            }
          ]
        }
        const chartReadyCl = this.Echarts.init(this.$refs.clChart)
        chartReadyCl.setOption(options)

        //自定义缩放
        window.addEventListener('resize', () => {
          if (chartReadyCl) {
            chartReadyCl.resize()
          }
        })
      }
    },

    /**
     * @description 浊度
     */
    drwaChartNtu() {
      if (this.arrayIsNull(this.ntuData)) {
        var html =
          '<div style=" display: flex;display: -webkit-flex;align-items:center;justify-content:center; width:100;height:100%;"><span  style="color:#868686;font-size:14px;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJoAAACJCAMAAADjY9EQAAADAFBMVEX////n8P3k7v3p8f7m7/3h7Pzr8/6s0v/O5P/v9f/R5v/i7fzI4P/t9P7a6v/T5v/N4v/u9f642P/V6P/w9//K4v/8/f++2//Y6f+01v/B3f/A3P/x9//H3v/D3f+82f/b6//X6f+31//d7P+x1P+62P+q0P/5/P/f7f/I4f+v0f/n8v/h7v/1+f/j7//Q5P+z1P/y+P+t0v9csvyhy//F3//P5v/G4P+v0/+21v9eu/+nzv+62v/i7v+kzP+dyf/3+/+82v+Zx//l8f/K4P9gvv9btv/B1/Bcpf9do+bz9/9ervTz+f+x0/9dt/9cs/5covupz/9cuP9emOrr9f/D3/+lzf8MheNpodvF3f9lrf9doPV1tOhip+IJd92VxP9gqP9brPtfr+hurOVduf9dnfIRofCDqugNjueey/9rv/9+t/91s/+92/9Ysfzp8v+/3P9ur/5cqPiT0f+Fu/9cnvddtuwKb9rR7f+Bwf1jtPxVrft+tfiLt/cUqfN0x/Jfv/Bdmu5ek+Rbo+IKfuBZqv9VoP9zvf1Up/pToffI3/adx+6Rwu6Hu+qAtedeqeXp9P9evf9qqv/h8/6/5f6Iv/5rvvARmu1ntur1+//e7v/T6P+z1v+Ayv+Pwf9kwf8wof8rl//a8v7K7P6i0/6Ow/tmq/d0pvV0wO58v+4PlOtln9vm9v+97v+Fyf93xv9Bs/96u/2TyPzP5/vb6vrW6PqNyfp3rvnQ4vh/zPZkpva11fVcnt5Nzv8bd/8Wbf+c1/7H5v223P1nuv2y0vtZnvuJ0fi43fctuPe/2vah1PWAx/M3rvFTkvB4uexEwf9Knf86mv9wwf1ht/xvuPqV0vUnpe9cr+2Bre1fqewblelMn+hp0P9kuf83q/8vif+m4f5tuf6k2vu04vqkzflYwvgZr/Wlxe+s3P+Esv6r1vxQrfyaxvp5t/as0/NLr/BjuO8eetwdbdaUuv9Fjv8ig/+Yv/y02PtpyfkRieQWX9B+3f9fr/aDv/VIkuJvmOBtYeEpAAAP+UlEQVR42uzYS4gScRzA8R9ENVqp+fjrOjrqWowyzmx7sAcVKSNBYYdAWOpQQTBJBRZGaxdPdYkO0UZL71331JJlbS8ItQ49KMn2kNHu1kbR69Q7ekD1H7XoRae1fgc/sOzBg19+/9/8B4QxlIkCVqmngNblo4DU7sNJPw8YZcu5hVuWAkJHR8q5uyc2AkJ9+XLu6c31gFA2X04eGzwECGXzI8l7yyVAKJMfyd0NAEahT+XDXYBTNp8CNLIjuwl8R+4jeoeSzMGDXWSfVO9D9iZI5iauf7tpMeBDjvcMGtcXdiEbmCqV6+nd1jpajAA6D+719A4uuVR8DehcqKc9A3Tu07Sbc98U3wE61V1bMFpkAZ+1Pb2rVhaK8wGfi3Rq6wpvHIBQsnfwZuEswnsNgJwcfVtAeHeoyIHRAsK7o0bYuEsDWPkmQNMYiF57cfv2nR0ioHOl1B/v6Ni6YhG6k37Q3R+Pfxg+P2m8eeqpc+dOj58SAhz6KjRt6BoZ2DH8srPz1atXHz9+wXEp84+U7v6hK+TG1hUrOjtXbz996tyTNeMAg0yapp2BIx3VtCeAyAVF6a7EBj4gTHtE067D845q2svzgIf5MU27OBCvp50CPB6mFeV5dHM97TMg8p6mXRsYqqdhOs/o1bRS6noRr6WtBkTuP04rtx4O1dKG2wEP8iidLj2o9FfTFk0BROjQ0pVKdzXtBqJftWBv9ipNUxT1HTp8BRCJZvNXqVKp9HwPqjCA0NGuTKqvL5WJQVNTU1NTEyJEbNfIkkUfkBOaEAECCBDCmxNyQKdva9PrjLNnz55mtFtMbp9s5mnhf0okhIixfV6b1uCPGBitVk/Tps1oUc040GLcEGT0Hq/g4Mk/DSR8qF3ar2UsQY5zTo4YDExb2/e01laj0Tid/tH/LpbzM1q9NxHl+YYX8qIYcxuWcRxrtVrtnNM5+Vua9qe06fPmucLWGtY+a7KFYUz7YlG+YX0aUaPnrGHjHON0l5VluWXVNHqetO3PaSxrt3N2KuiPmIRoSBShIUJenVdKxCSPxRlkwzSOq6cZ/pLG0ulaGG3AIYrmqbEpUwg0gmTTUTY1T/DSXXPa6eBqy0bb/pQWdrm4mR66a6IjlkjsVDmgAaIm7X6TR42z2XTzBUEOeN02ZvIyZ61N+0safRTCEbdP0ojtU4UfNGJsPhpAt93koWVqH/1aWZYkyWdiIupHvzyhdo8k7DQ7NIIsy8IPNDDmHBZ/7Wn8MU/n9QUCMp2g26SmTTvQ0tqi3hoGKaYSpN/JPIw1nZ0LzqKbVTs+mkf7dFVut9dH9y/xlVV7i0kqjuMATmslkoIIyEXkJhxApQJBT0EcpWKNEUxXbDUYBb1AapiOVbbpxpLKW1k5um/dZlvLZZfl6qHLVqu21rqspx66ba1a660e+51zwKNHOG7N74Ozk8rH3+/8/ud/DvIqYTXTOWwqfvGmWijomvxZ8LLJK9th1nBeo1GE8xpW5KpHBqa3dtdyVa25uHZNHVMWvGwCDSxmMHWwUik2wxoqEuWaK5BwSR80uFrNNVQb5skCl80shXN8lQbOcODBiraZqJ4IetvA4ZHNVUFrTwdkddXzZfnClo1dZLHUaIGnwXkOnCcDn9EIPpzHOa2G5tZpwi52tWq+LGjZ5NoiIhY0y3M42pXkuWczQndz60oYa5OquPOlbiHXNlFRLlA9FHywRACvuT2RqMRHg+TxEp3ozjaeRD1fhAsn24QiRTND6M5IpaDDeTLoLb6usLENynP9qySC+WKgle0k/79pEimKIKCbzbOgwMtNBhSvcXPnaCLW3ynhMQRvezXtanXtSe/FeXp8DH8CdYQ1NyZzLUcmLZrLs9RsxAdXQ0yGDHnVlkA39KNqTsHw1Kpdwiba1vRTX9+Tk0ywi10T8fPnX5/tOl6R987EW6doB94cHYpm15XKnf07HYltr9okK/KFDVty3nIvuGg5OdXXN2Vm2L8+OL+ezNH1Z/cUWEFQjVjmQItoya0r0v4NJzTsrf0b7Go2PcT614gg8nxbmrHe3ikvw5teOdhqyPlveVtf5XTaWzYqZWIpilrm+Bzd/dvCKw2dGzZ0c9hls4Lv5xotGOay56MJ+3p7GRp6/DzhAhiZS/lsJUX2gBOCaBIJ2Gags7urGe0fxbR13dtGRy08UTawJEPFRI1azOXCnKgxX98uAO2FsGA7J0jY+VYCtmPHjnw2kVgpRVvsAavV6tQq28s10jPU5GpcW7e1xbSGcGfnaLhsXQmksapKtIJdItNgYXDViDl1dZ5872oBLflcX4C2J36UqNjExPpWgLW2+nzH89HEymblKm1Ri90JPERaju8btYQOUXaPdnZj2uqWNoiuzGazKUrYnJJmqTUMBUN0Iu4auPLPrtqxz9fg41Tf+PhY5lehfq4n+7h+4mzcjcNaW+PXWPSUVYJNqdOVS7U1SAtevEARqpU6mjUWZCWys63tnEurKt8Jca1TKEQckQ61AysW0Nh4hjpDNWQ2revrA3jtvuT4u6uZjJCRBvWKXwcb4Nzurjy0SpKm0aySalELQhQvYLdbyh0KDBe5UImxu/vEiRMyTpkOCWAuzGq1VK6QGAzZi/5s2pO/U159L9BeJJOZZflpF+I4DOJz7wCbD2Run3oOTUbaystXweODlRthTBEYDGsMi2FYGEAxFyy35yBhqx2OYlanXVOm5qqoKz6NNtV7rWm8b2x8PBnJFJrR6yQMOun2XX8MML/fP0n/Io5CVimmbNqNNTWAa4GptWKucPhcGHOhAm44HMa7GAOXVsEjRflpJ6dejN1mvUuOvbsaiQywCuRUnDzD4IP7w1mfH89j+jWrGm7EE3Bz6YCWErYa0mYnSwcgoEkC0EVIwKIsg40vLTNp+ndjL94/ZR0ZS44DrfA74Q1xHOaGTsbjr9Md/vr6ev8j+u2eAmxicTtRN8rW0kLirDGrSyuQnLHCp4jGJlBJ5sbEovLw94s776/yWU+TmauZyGGGvxZ93erG44unJ7re1HeA7Q7tqVX1li3Q0mxPoXBkT2ugbmBz4iPh0knUOqtzpYzN5aoFebJpxjMj2fuxwcjIYdaxZORqcCTKYDt2Hc4wSL3/8d6uHx/31de/9eYeWpm8Zgi3qipn0+E9zdqgp9DUAG5zNXMFtnYRT1Jgz8ZbapabzV6vqQkeGm3KRAZfhu6ynkciL4MjoejdwjbTpTcgg2p17JvcmwbavlOsJhOQhGTMkpKqKgVpo8qGojgNsRM2rB3frAGhQDi7zMJszN7SqyNDocGKY8lMEKeFBlkMeZgGGG5Lxx531Hds/6MXzohcUlICZSNsMArUmFI2rFnNYwqnVi6ctt2OhoZDh1n3oGgDwdRwaIh5p32nowO37buc7tm+/aC9gk4z2jbDKFSKm2k26CjYgCbgMGUFRTPdjqai0dC9CujnSDAYHLo/wGJOQ7oHaD0n9h4EGkanZcsGtva8SwgmZqY1ULSKgVBoKBgaXnQvMjISHBoK3T88D01/ei/Uq+fGje1AmzQJi6kADbcRuDljakFwnFV8uoEp7NrpH1gxEB0GWvT2zchIKjiUuh9d0tRUUUBV0WSWFwv1tZe3Q27s27774GU4QKeRtuwSArScDR9ToPHYTCmjaE3PQsGBVCp4SxgEWvT+/YGT8BJefT6YJ/td5tq9ULAbnbt3H7pcDMeg+MVkgJa10ce0hhzTFquYw0gTraV+0UXDqaFQanCx51kKpw0vE5LH6Ti9eUZ1DG8Pdk4SNA/8a63o9CaKRtmA5iBt1Jg6xZwypgBtOqZnURiDZ6Zi/q/Q8PDAItP061fMqhh/ZoSbdx/cewJokya+ueGs23eplDieoxkbbcQoiOeMqVO8gpFmXMunYj48OPhLiH9y+8v3R5tVfJOcT8ZE3cfxaVk6eWj35Su7D/3Uex7GfR/2+UXEYXXJdNmyY0rZtIQtkGgQMcW4nE+lFL+HkZfy9Uu7Onp6etKXHq315NRk4fTCUipyj4dfWuphXzm0H2hfWIK0/2PafyC2FP4PaNOZHtNm4pIFuzdiTO1iNqOscTm/NBvPP2LtJySKKI4D+Dzf9pi1fetO/kGaGVkT2gzHSFm2DgvJLrRtRBMi2G7QQkiEGSXOQZ05KCj+KU+dpG7qHoRAFFe2DqXrwcNe1EPSSRAi02tdCnpvptndmdYExfpcFnbe7u/Le/zezM6sFHV2Te1OVsHlxSf6Pv+1f3GyQvqdgyGucTiHwx+WX4ai5HWPRJuJZy6/uX17u3doqAfSo+ViPpqezdamTU13nnpcB/PXl8Fcpbap5d0+kmaqt3nkpmn/53cB68iaSjiPm3+9srGy/n6Sk/jufS2dFl8NDcXmEpHIY4iJYFnYRdm3kHybnuc99QcqrQPIrAQf9TX39RlnxeYfW1tbNwyf7jk4YwTjwyiH864/2aCXQ5tdTqCmtXjqzByJ1inLqylojIMNtWyYxBJpK7Tp09bSUtCmd3iP+Ce/X3SxXoiQWcyJ529abbW3z+oenHIiHSOgPCe73b/Zu9k7M9K949uJq3H10bAs98iKomgQ5YS8ZZ6wKAb8uTbNZzvPVwZs/G2BStYdQgW4sfEXN2wmxq/rxsxBDEYFcNf0s9GZaTU9Gs94ZtR4qnN1NZVUOjqyGcswDBvIc1AX7VJ93vRs+hbSxFf682j4mvpL7kZsLYMm3s2228y2LwhOKhcNWkQ5tklT1G9qNi6q++mUIic6ZWUgmzyFYSH69Y66WtbFU8YPwKt0D7nI17flkOQBtrqBLqP102DsehELllEcA62QIJWIe0lNy2qamk5FYpSSXOKgHV1hEPSWhXlyy55mI21KowXOmvga1h2ERi57lcuCDXnHOk5iELTDgkPUkkk5FkskYrpERkKwKFI2FHR7eJLNuEK6ko/mcQcBOX5EAsMIxQoK3i8RXUIX6WmpBgcWIQdAXalI+pQ8dr9Fo5F7p5XVjfTIkVXQk1SR6cYl51ZlXcSUuO8+pFBjLVnaqxf5u2f94fISeDwCQ/kQsMKnM1qyI04pimwa7gEQ/BVEZPLusqXlFyAEx4IkxuDD1gqh59nsANFhMEOmazhwGIgwROiYwWDBNVGVAApwa62DraYBnZEww4F/gfMxJvvEVbwdzGktkFxC4ORV+Bi7a/lwpz8/tPpIaWsQnDhzKW18TugwAEcxwHGyIJaYA1VFMXT8HxBHqw79sxf3q7g6xmEghIEoajChQRQ0U7l3RZEbuOb+B0qULkWU3XVM3gm+BiTvr+MxQUfA7j3lXVK/G+gE6Bqco/FYCroAsNffywFKqmIA+eiUzimVn1XxeHtCN9iSUZn9iYuCwDi7MCiMluZQlAJZcZQZhdJ0uygpBUNvV8JaB8UzbqfD2GiPWfOZsFwn7aPC7ehgorQXdH3frlVRkIMrr3zKKlUM9E+ATumVS87PEV93snaZCl/WA7uljiKZXk0RAAAAAElFTkSuQmCC" alt=""><p class="empty-p">暂无数据</p></span></div>'
        var chartDom = this.$refs.ntuChart
        chartDom.innerHTML = html
        chartDom.removeAttribute('_echarts_instance_')
      } else {
        const options = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: '{b0}<br />{a0}: {c0} mg/L<br />{a1}: {c1}mg/L<br />{a2}: {c12} mg/L'
          },
          label: {
            show: true,
            color: '#333'
          },
          grid: {
            left: '3%',
            right: '3%',
            bottom: '5%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: this.ntuData.map(function(item) {
                return item.xAxisData
              }),
              axisLine: {
                lineStyle: {
                  color: '#eaeaea'
                }
              },
              axisLabel: {
                color: '#333',
                rotate: '-25'
              }
            }
          ],
          yAxis: [
            {
              name: '浊度(NTU)',
              nameTextStyle: {
                color: '#333',
                padding: [0, 0, 0, 50]
              },
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: '#eaeaea'
                }
              },
              axisLabel: {
                color: '#333'
              },
              min: 'dataMin',
              max: 'dataMax'
            }
          ],
          color: ['#5470c6', '#91cc75', '#fac858'],
          legend: {
            data: ['浊度']
          },
          series: [
            {
              name: '浊度',
              type: 'line',
              data: this.ntuData.map(function(item) {
                return item.yAxisData1
              }),
              smooth: true
            }
          ]
        }
        const chartReadyNtu = this.Echarts.init(this.$refs.ntuChart)
        chartReadyNtu.setOption(options)

        //自定义缩放
        window.addEventListener('resize', () => {
          if (chartReadyNtu) {
            chartReadyNtu.resize()
          }
        })
      }
    },

    /**
     * @description 一厂（水质曲线图） 余氯
     */
    getTwoFactoryWaterQualityYLList() {
      var that = this
      getTwoFactoryWaterQualityYL({}).then((res) => {
        if (res.code !== -1) {
          let _resultList = res.result
          _resultList.forEach(function(item, index) {
            that.clData.push({
              xAxisData: that.formatTime(item.dateTime),
              yAxisData: item.waterSupplyValue
            })
          })

          that.drwaChartCl()
        } else {
          that.$message.error(res.message)
        }
      })
    },

    /**
     * @description 一厂（水质曲线图） 浊度
     */
    getTwoFactoryWaterQualityZDList() {
      var that = this
      getTwoFactoryWaterQualityZD({}).then((res) => {
        if (res.code !== -1) {
          let _resultList = res.result
          _resultList.forEach(function(item, index) {
            that.ntuData.push({
              xAxisData: that.formatTime(item.dateTime),
              yAxisData1: item.zd
            })
          })

          that.drwaChartNtu()
        } else {
          that.$message.error(res.message)
        }
      })
    },

    /**
     * @description 格式化时间字符串(时分)
     */
    formatTime(times) {
      var timearr = times
        .replace(' ', ':')
        .replace(/\:/g, '-')
        .split('-')
      // var timestr = ""+timearr[0]+"/" + timearr[1] + "/" + timearr[2]
      //var timestr = "" + timearr[1].split("")[1] + "月" + timearr[2] + "日\t" + timearr[3] + ":" + timearr[4] + ""
      var timestr = timearr[3] + ':' + timearr[4] + ''
      return timestr
    },

    /**
     * @description 判断数组是否为空
     */
    arrayIsNull(aryList) {
      return typeof aryList == 'undefined' || aryList == null || aryList.length == 0
    }
  },
  mounted() {
    // this.drwaChart()
  }
}
</script>

<style lang="scss" scoped>
.sup-use-container {
  width: 100%;
  height: 100%;
  padding: 10px;
  .chart-container {
    width: 50%;
    height: 100%;
    padding: 20px;
  }
}
</style>
