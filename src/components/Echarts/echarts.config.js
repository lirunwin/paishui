// 图表通用颜色
const blueColors = [
  '#5b95e8',
  '#33b6ac',
  '#55627f',
  '#fd8d88',
  '#ffec4e',

  '#b8d56b',
  '#649356',
  '#538b5e',
  '#529478',
  '#4f877e',

  '#4e6471',
  '#4c446b',
  '#5b4b65',
  '#5a3f5e',
  '#5f3e4f',

  '#753d4a',
  '#7f3846',
  '#8a4b42',
  '#a24445',
  '#be6381',

  '#be6cae',
  '#8b8ae7',
  '#7877eb',
  '#6599e5'

]
const grayBlueColors = [
  '#646c9e',
  '#4facef',
  '#49d2a6',
  '#fee939',
  '#fdb748',

  '#d09435',
  '#d06f35',
  '#d05d35',
  '#d04b35',
  '#d03535',

  '#bf2525',
  '#c13175',
  '#a74298',
  '#9542a7',
  '#8042a7',

  '#6342a7',
  '#48438d',
  '#43518d',
  '#43668d',
  '#3385a3',

  '#339fa3',
  '#3bb67a',
  '#3ea651',
  '#429446'
]
const greenColors = [
  '#77cda3',
  '#f1c888',
  '#b7a4f7',
  '#72beff',
  '#64e3d9',

  '#6cdcab',
  '#77d28f',
  '#7bc875',
  '#a6d772',
  '#d8e470',

  '#e2b978',
  '#f1a673',
  '#f2927f',
  '#e67070',
  '#ee6fab',

  '#e17fe2',
  '#bd80d9',
  '#9a86e4',
  '#8699dd',
  '#7dc7e9',

  '#7de9d1',
  '#7edfa2',
  '#8cd977',
  '#cde076'
]
// 折线柱状图
const linebar = {
  animation: false,
  textStyle: {
    fontFamily: 'sans-serif'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      animation: false,
      label: {
        backgroundColor: '#505765'
      }
    }
  },
  legend: {
    top: 0,
    data: [],
    selected: {},
    type: 'scroll'
  },
  grid: {
    left: 10,
    right: 15,
    bottom: 10,
    top: 30,
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: [],
      axisPointer: {
        type: 'shadow'
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'solid',
          color: '#ececec'
        }
      },
      axisLabel: {
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: '水量/万m³',
      scale: true,
      splitNumber: 5,
      splitLine: {
        show: true,
        lineStyle: {
          type: 'solid',
          color: '#ececec'
        }
      },
      axisLabel: {
        inside: false
      },
      axisLine: {}
    }
  ],
  series: []
}
export const EchartsOption = {
  blue: blueColors,
  green: greenColors,
  grayBlue: grayBlueColors,
  getEchartsConfigOption(type) {
    let option = {}
    switch (type) {
      case 'linebar':
        option = linebar
        break
    }
    return option
  }
}
