<template>
  <blocks title="待办事项" more @open-more="handleDialogShow">
    <div class="todo-container">
      <div class="left">
        <div class="top">
          <div class="square line">
            <span class="wait-finnish" @click="handleNumClick(0)">{{ waitNum }}</span>
            <span>待完成</span>
          </div>
          <div class="square line">
            <span class="over-time" @click="handleNumClick(4)">{{ overNum }}</span>
            <span>超时</span>
          </div>
          <div class="square">
            <span class="unstart" @click="handleNumClick(2)">{{ undoNum }}</span>
            <span>未开始</span>
          </div>
        </div>
      </div>
      <div class="right">
        <div ref="chartContainer" class="chart-container" />
      </div>
    </div>
    <el-dialog :visible.sync="todoDialog" title="待办" append-to-body>
      <el-row type="flex" justify="start" align="middle" :gutter="20">
        <el-col :span="6" style="display: flex; align-items:center">
          <span style="width: 45px">状态：</span>
          <el-select v-model="filter.isHandle" style="width: 140px" size="small">
            <el-option v-for="option in options" :key="option.value" :value="option.value" :label="option.label" />
          </el-select>
        </el-col>
        <el-col style="display: flex">
          <el-button size="small" type="primary" @click="handleFiltersClick">查询</el-button>
        </el-col>
      </el-row>
      <div style="min-height:400px; margin-top: 10px;">
        <el-tabs v-if="todoData.length > 0" v-model="activeName" tab-position="top" @tab-click="handleClick">
          <el-tab-pane
            v-for="item in todoData"
            :key="item.typeCode"
            :label="item.typeName + '[' + item.num + ']'"
            :name="item.typeCode"
          >
            <more-infos
              :columns="columns"
              :table-data="todoDataList"
              :pagination="pagination"
              :total="todoTotal"
              @size-change="handleSizeChange"
              @curr-change="handleCurrentChange"
              @deal="finishTodo"
            />
          </el-tab-pane>
        </el-tabs>
        <div
          v-if="todoData.length <= 0"
          style=" display: flex;display: -webkit-flex;align-items:center;justify-content:center; width:100;height:100%;"
        >
          <span style="color:#868686;font-size:14px;"
            ><img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAsCAYAAAA5KtvpAAAExUlEQVRoQ+2aX2xTVRzHf+fP7b+tZa0yCcuCAolBIy9jwGIW+4LQMhKiYEgMCRFuBlk0Jj6YKJkF4gMPJpi46Fbnn4TEKMqLtQV9GfFhg4EPPLCYqAQXFFmyjq1b/91zjrmbZO3W7t5zy+3qsr7ch/v9/fnc37nf3tNbBBV+1kT3HiUgPq0wjalwBujYA/WHflPiMiJUSbCvN7yDIIixPGub7Lr8WyW5jGJ9Pbs3E4UMMgEdk53xq0b6cuctA9f1hNc5FDHMOFcnj1++ZLUBmTjfJ7v3EIyjuTxqne6K35OJfai1BhwJUn+T+2cAiCXVxPtWCluN8UdD7wJAR/Juuh0iA5psHkvADdFwFEA0TKiJg7IFH4W+IRq6AIAmJtS4KptPGlg3KQzizWRupg26BlKyBR+JvidY73d4Bjmgc7ImJgVcTZMyujBWTcw08HKYlCG0BRMzB7yMJmUELWtipoCX26SMoGVMzBC4JkzKiFjCxJYEriWTMmI2a2JlgWvRpAyhTZhYaeAaNikjaCMTKwlc6yZlBL2UiZUEDkTDwihp4XnGoPXB8fh1mRhZrS8a2kkBDcrEjavxRXxlgWMdZ03lvvj7FegfiZ9PqvHDpgIsivx9oa/UZ/cd2r+x3VSGjtjbYAtwKp+Gwz+dyaQy7CmrWzYjAt1AfS7H6Je73qH1ittIPnveNmA9+Uc3L0Liz6GTdm0VA33hM3ufbDt54rn9pmBtBx5N3YcTAx/cG78702xlj7okRSToCjR5bn8cfGtdc31jbQDrXXRf7Ydfxn49NK4mvjbdlQmhvy/0akvj0+dP7zhqQj0vsXVJ62Wu/TMCp4Y/H0qqiTapzgzEgWh4uLv1yLbtT2yRSms7sN7N61fOwe2pv6UaMxJvWtMEH7a/YSRbdL4qwNJd2RiwCvzfxa34wcPGIVWUenXCqxMuWED65sHss3RF687G4NUlXXZJRwAHmsJsRUz4WBwDgqKtbrFL9wTrPdTpdWHy10oAznC2fkbLThW+IZkD7m1R6nBDwAkOZW7yaHQlAAOIZp0mC7n8NJ8Yh84beQSRIPU0K40uTvG8h6wsYJ0rgzU+M5q/j7y9wccV7HYVGqYQ6M63odPYTZ02+qh9qdNaFg4kujlCYkNhlTxPZ5Cnf9f64ukCgBDfvfZMx/aXNr1gX1c2ZtZ/dvrsVuwaIPRyYRl9yqUnzMRWQuj3R7bswaENO+H/Mml9sok7Q/DFyCXOmLYPEXRz0YR1w/LQwNqFUxZMbEUY3hOAtyEEBfe3jaOpMLUQwBHw64LDqYWws/ewNj4279Ka9zGnw00rrFmT4cUuXdji2ee9Ho/H63IVOnZNMphqKsM5K/09XByOoCdYV8+YmymKw02dhm8YTVWvkiitZQVx5nOpNElD18C0bsGFpZeGiQCGuhfdPj9yagycLoxJlfqWKqNPkhLITiZFFqZ/TEMEeLkEctP75iCB5B9OAL/iBU3hGlCOManWKtCnhzlnmII2BTQPkMyDf2MWXrnAzF4hOeDSWRH0tlDwOyiMOYmfUsJZBnNCieAOLHgOi4e3BeWz9USOzR6Rg8wtNw3PHpGWFQg7OMI5jpnGMHHxpKYxWJtlkMxp0HlD/1+W1HuvhS3/C8qWcdpag8XbAAAAAElFTkSuQmCC"
              alt=""
            />
            <p class="empty-p">暂无数据</p></span
          >
        </div>
      </div>

      <!-- <more-infos :columns="columns" :tableData="todoData" :ispagination="false" :pagination="pagination" :total="todoTotal" @size-change="handleSizeChange" @curr-change="handleCurrentChange" @deal="finishTodo">
        <template slot="filters">
          <el-row type="flex" justify="start" align="middle" :gutter="20">
            <el-col :span="6" style="display: flex; align-items:center">
              <span style="width: 45px">状态：</span>
              <el-select v-model="filter.isHandle" style="width: 140px" size="small">
                <el-option v-for="option in options" :key="option.value" :value="option.value" :label="option.label"></el-option>
              </el-select>
            </el-col>
            <el-col style="display: flex">
              <el-button size="small" type="primary" @click="handleFiltersClick">查询</el-button>
            </el-col>
          </el-row>
        </template>
      </more-infos> -->
    </el-dialog>
  </blocks>
</template>

<script>
import Blocks from '../Layout/Blocks'
import Echarts from 'echarts'
import { taskPie, taskList, taskListPage } from '@/api/dashboard'
import { homeInterval } from 'staticPub/config'
import MoreInfos from '../Layout/MoreInfos'
import gisNames from '@/utils/gisNames'
import gis from '@/store/modules/gis'

const columns = [
  {
    prop: 'order',
    label: '序号',
    align: 'center',
    width: 60
  },
  {
    prop: 'tknm',
    align: 'center',
    label: '待办事项'
  },
  {
    prop: 'createTime',
    align: 'center',
    label: '创建时间'
  },
  {
    prop: 'createUserName',
    align: 'center',
    label: '创建人员'
  },
  // {
  //   prop: 'createTime',
  //   label: '创建时间',
  //   width: 180
  // },
  // {
  //   prop: 'isHandle',
  //   label: '状态',
  //   width: 100,
  //   formatter: (row, col, cellVal, index) => {
  //     if(cellVal === "0") return "待完成"
  //     if(cellVal === "1") return "已完成"
  //     if(cellVal === "2") return "未开始"
  //   }
  // },
  {
    prop: 'action',
    label: '操作',
    width: 140,
    actions: [
      {
        key: 'deal',
        label: '处理',
        color: '#409EFF'
      }
    ]
  }
]
export default {
  components: { Blocks, MoreInfos },
  data() {
    return {
      Echarts,
      columns,
      todoDialog: false,
      todoPie: [], // 饼图
      todoData: [], // 待办分类数量
      todoDataList: [], // 待办列表
      pagination: { current: 1, size: 10 },
      todoTotal: 0,
      filter: {
        isHandle: 0
        // startTime: '',
        // endTime: ''
      },
      timeRange: null,
      options: [
        {
          value: 0,
          label: '待完成'
        },
        {
          value: 1,
          label: '已完成'
        },
        {
          value: 2,
          label: '未开始'
        },
        {
          value: 4,
          label: '超时'
        }
      ],
      waitNum: 0,
      undoNum: 0,
      overNum: 0,

      intervalId: null, // 定时器

      activeName: '', // 选项卡
      activeType: '' // 选择项 = 编号
    }
  },
  watch: {
    todoDialog(val) {
      if (!val) {
        this.filter.isHandle = 0
        // this.filter.timeRange = undefined
      }
    }
  },
  destroyed() {
    // 在页面销毁后，清除计时器
    this.clear()
  },
  created() {
    this.dataRefreh()
  },
  async mounted() {
    // //待办列表
    await this.getTodoData()

    // //饼图
    const chartPie = await this.getTodoPie()
    this.drawPie(chartPie)

    this.getTodoPie()
    // this.getTodoData()
  },
  destroyed() {
    var that = this
    console.log('实例销毁完成')
    that.clear()
    // this.$store.state.jumpText = ''
  },
  methods: {
    // 点击查询按钮
    handleFiltersClick() {
      this.getTodoData()
    },

    // 获取首页饼图
    getTodoPie() {
      // var that = this
      // taskPie().then((res) => {
      //   if (res.code !== -1) {
      //     that.todoPie = res.result
      //     that.drawPie(that.todoPie)
      //   } else {
      //     that.$message.error(res.message)
      //   }
      // })
    },

    // 获取待办数据
    getTodoData() {
      // var that = this
      // taskList(that.filter).then((res) => {
      //   if (res.code !== -1) {
      //     that.todoData = []
      //     console.log('测试：' + JSON.stringify(res.result))
      //     if (!that.arrayIsNull(res.result)) {
      //       res.result.forEach((item, index) => (item.order = index + 1))
      //       that.todoData = res.result
      //       if (that.todoData.length > 0) {
      //         that.activeName = that.todoData[0].typeCode
      //         that.activeType = that.todoData[0].typeCode
      //         that.getTodoDataPage()
      //       }
      //     }
      //   } else {
      //     that.$message.error('错误：' + res.message)
      //   }
      // })
    },

    /**
     * @description 分类获取相应的待办列表数据
     */
    getTodoDataPage() {
      var that = this
      const userId = this.$store.state.user.userId
      const query = {
        ishandle: that.filter.isHandle,
        tkty: that.activeType,
        handleUser: userId,
        current: that.pagination.current,
        size: that.pagination.size
      }

      // Object.assign(query, {current: 1,size:that.pagination.size})

      taskListPage(query).then((res) => {
        if (res.code !== -1) {
          that.todoDataList = []
          console.log('测试：' + JSON.stringify(res.result))
          if (!that.arrayIsNull(res.result.records)) {
            res.result.records.forEach(
              (item, index) => (item.order = (that.pagination.current - 1) * that.pagination.size + index + 1)
            )
            that.todoDataList = res.result.records
            that.todoTotal = res.result.total
          }
        }
      })
    },

    // echarts绘制
    drawPie(data) {
      const that = this
      let _notStartedNum = 0
      let _overTimeNum = 0
      let _pendingNum = 0
      if (!that.arrayIsNull(data)) {
        _notStartedNum = data.notStartedNum
        _overTimeNum = data.overTimeNum
        _pendingNum = data.pendingNum
      }

      that.waitNum = _pendingNum
      that.undoNum = _notStartedNum
      that.overNum = _overTimeNum

      const chartReady = that.Echarts.init(that.$refs.chartContainer)
      const option = {
        series: [
          {
            color: ['#12C47B', '#FF4F6C', '#2D74E7', '#ee6666'],
            name: '待办事项',
            type: 'pie',
            // silent: true,
            hoverAnimation: false,
            tooltip: {
              show: true,
              trigger: 'item',
              transitionDuration: 0
            },
            radius: ['48%', '60%'],
            avoidLabelOverlap: true,
            label: {
              normal: {
                show: false,
                position: 'center',
                formatter: function(data) {
                  // 设置圆饼图中间文字排版
                  return data.name + '\n\n' + data.value + ' 个'
                }
              },
              emphasis: {
                show: true, // 文字至于中间时，这里需为true
                textStyle: {
                  // 设置文字样式
                  fontSize: '20'
                  //   color:"#333"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: _pendingNum, name: '待完成' },
              { value: _overTimeNum, name: '超时' },
              { value: _notStartedNum, name: '未开始' }
            ]
          }
        ]
      }

      // 计算得到的值占比
      // const wait = data.filter(item => item.isHandle === "0")
      // const undo = data.filter(item => item.isHandle === "1")
      // this.waitNum = 20;//wait.length
      // this.undoNum = 12;//undo.length
      // if(wait.length !== 0 || undo.length !== 0) {
      //   delete option.series[0].data[2]
      //   option.series[0].color.splice(2,1)
      //   option.series[0].data[0].value = wait.length
      //   option.series[0].data[1].value = undo.length
      //   option.series[0].silent = false
      //   option.tooltip = {
      //     trigger: 'item'
      //   }
      // }
      // option.series[0].data[0].value = this.waitNum
      // option.series[0].data[1].value = this.undoNum
      // option.series[0].silent = false
      //   option.tooltip = {
      //     trigger: 'item'
      //   }

      chartReady.setOption(option)
      // 设置默认选中高亮部分
      chartReady.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: 0 })
      // 当鼠标移入时，如果不是第一项，则把当前项置为选中，如果是第一项，则设置第一项为当前项
      chartReady.on('mouseover', function(e) {
        chartReady.dispatchAction({ type: 'downplay', seriesIndex: 0, dataIndex: 0 })
        if (e.dataIndex != index) {
          chartReady.dispatchAction({ type: 'downplay', seriesIndex: 0, dataIndex: index })
        }
        if (e.dataIndex == 0) {
          chartReady.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: e.dataIndex })
        }
      })
      let index = 0
      // 当鼠标离开时，把当前项置为选中
      chartReady.on('mouseout', function(e) {
        index = e.dataIndex
        chartReady.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: 0 })
      })
      // 鼠标点击事件

      chartReady.on('click', function(e) {
        console.log(e)
        const pieName = e.name
        let typeVal = 0
        if (pieName == '超时') {
          typeVal = 4
        } else if (pieName == '未开始') {
          typeVal = 2
        }
        that.handleNumClick(typeVal)
      })

      // 自定义缩放
      window.addEventListener('resize', () => {
        if (chartReady) {
          chartReady.resize()
        }
      })
    },
    // 页码变化
    handleCurrentChange(page) {
      this.pagination.current = page
      this.getTodoDataPage()
    },
    // 条数变化
    handleSizeChange(size) {
      this.pagination.size = size
      this.getTodoDataPage()
    },
    // 打开表格弹窗
    handleDialogShow(data) {
      this.todoDialog = data
      this.getTodoData()
    },
    // 点击数字打开弹窗
    handleNumClick(data) {
      this.todoDialog = true
      this.filter.isHandle = data
      this.getTodoData()
    },
    // 点击前去处理待办
    finishTodo({ type, data }) {
      const setRoute = (row) => {
        row.routeIp && this.$router.push({ path: row.routeIp })
        const splitRoute = row.routeIp.split('/')
        const target = splitRoute[splitRoute.length - 1]
        // const target = splitRoute[1]
        const origin = JSON.parse(JSON.stringify(this.$store.state.routeSetting.dynamicRoutes))
        delete origin.dashboard
        for (const key in origin) {
          // console.log("Key:"+key)
          for (const item of origin[key]) {
            // console.log("item:"+JSON.stringify(item))
            if (!this.arrayIsNull(item.children)) {
              let result = item.children.find((route) => {
                if (route.name === target || route.path === target) {
                  return route
                }
              })
              if (!this.arrayIsNull(result)) {
                result = key
                return result
              }
            }
          }
        }
        return result
      }

      const setMapParent = (target) => {
        const origin = JSON.parse(JSON.stringify(this.$store.state.routeSetting.dynamicRoutes))
        for (const key in origin) {
          for (const item of origin[key]) {
            if (!this.arrayIsNull(item.children)) {
              let result = item.children.find((route) => {
                if (route.name === target || route.path === target) {
                  return route
                }
              })
              if (!this.arrayIsNull(result)) {
                result = key
                return result
              }
            }
          }
        }
        return result
      }

      // const { row } = data
      const row = data
      if (type === 'deal') {
        const routeStr = row.routeIp
        // routeStr = "Map,xjMissionQuery,FullPanel,任务查询"
        // routeStr = "Map,xjMissionLineManagement,HalfPanel,巡检线"
        //  routeStr = "Map,missionSend,FullPanel,工单派工"
        // routeStr= "/sys/widgets/UserManagement"
        // routeStr= "/work/order/register"
        //  routeStr = "Map,wxCheck,FullPanel,计划审核"
        // console.log("返回值："+routeStr)
        if (this.strIsNull(routeStr)) {
          this.$message.error('路由不存在,无法跳转')
          return
        } else {
          if (routeStr.indexOf(',') != -1) {
            const routeFirst = routeStr.split(',')[0].toLowerCase()
            if (['map', ...gisNames].indexOf(routeFirst) > -1) {
              const _index = routeStr.indexOf(',')
              const _params = routeStr.substring(_index + 1)
              console.log('参数：' + _params)
              var str = _params.split(',')
              var _target = str[0]
              var result = setMapParent(_target)
              console.log('返回值：' + result)
              this.$store.state.jumpText = _params
              // // this.$router.push({path:'/map',meta: { activeMenu: 'xjMissionQuery' }})
              this.$router.push({ name: 'Map', params: { activeMenu: _target } })
              this.$store.dispatch('routeSetting/changeSys', result)

              // this.$store.dispatch('map/changeMethod', { pathId: str[0], widgetid: str[1], label: str[2] })

              // this.$router.push({ path: '/map' , query:{ userId:"10011" } })
              // this.$router.push({ name: 'Map' , params: { params: _params }});
              // const sideBarShow = this.$store.state.app.sidebar.show
              // if (!sideBarShow) this.$store.dispatch('app/toggleSideBarShow', true)
              // this.$store.dispatch('routeSetting/changeSys', routeFirst)
              // this.$store.commit("map/RESET_ALL")
            }
          } else {
            // row.routeIp = "/sys/builder"
            //  row.routeIp = "/meter/circulation/Warehousing"

            //  this.$router.push({path: row.routeIp});

            const result = setRoute(row)
            // const sideBarShow = this.$store.state.app.sidebar.show
            // if (!sideBarShow) this.$store.dispatch('app/toggleSideBarShow', true)

            this.$store.dispatch('routeSetting/changeSys', result)
            // this.$store.commit("map/RESET_ALL")
            // this.$emit("close-notification")
          }
        }
      }
    },
    /**
     * @description 判断数组是否为空
     */
    arrayIsNull(aryList) {
      return typeof aryList === 'undefined' || aryList == null || aryList.length == 0
    },

    /**
     * @description 判断字符串是否为空
     */
    strIsNull(strVal) {
      strVal = strVal || ''
      return typeof strVal === 'undefined' || strVal == null || strVal == ''
    },

    /**
     * @description 待办列表 Tab选项卡
     */
    handleClick(tab, event) {
      this.activeType = tab.name
      this.pagination.current = 1
      this.getTodoDataPage()
    },

    /**
     * @description 定时刷新数据函数
     */
    dataRefreh() {
      // 计时器正在进行中，退出函数
      if (this.intervalId != null) {
        return
      }
      // 计时器为空，操作
      this.intervalId = setInterval(() => {
        console.log('刷新' + new Date())
        //  //待办列表
        // this.getTodoData()

        // 饼图
        this.getTodoPie()
      }, homeInterval)
    },
    /**
     * @description 停止定时器
     */
    clear() {
      clearInterval(this.intervalId) // 清除计时器
      this.intervalId = null // 设置为null
    }
  }
}
</script>

<style lang="scss" scoped>
.todo-container {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  height: 100%;
  .left {
    width: 80%;
    height: 30%;
    // border:1px red solid;
    .top {
      margin-top: 10%;
      // border:1px red solid;
      display: flex;
      justify-content: space-around;
      align-items: center;
      &.square {
        &:nth-of-type(2) {
          &::before {
            content: none;
          }
        }
      }
    }
    .square {
      width: 33%;
      // height: 70px;border:1px red solid;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      position: relative;
      cursor: pointer;
      span {
        font-size: 40px;
        &:nth-of-type(2) {
          font-size: 14px;
          color: #555555;
        }
        &.wait-finnish {
          color: #12c47b;
        }
        &.over-time {
          color: #ff4f6c;
        }
        &.unstart {
          color: #2d74e7;
        }
      }
      &.line {
        &::before {
          position: absolute;
          content: '';
          width: 1px;
          height: 40px;
          background: #eaeaea;
          right: 0;
        }
      }
    }
  }
  .right {
    flex: 1;
    width: 100%;
    height: 70%;
    .chart-container {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
