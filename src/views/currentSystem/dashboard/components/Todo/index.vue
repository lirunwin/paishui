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
              src="data:image/png;base64,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"
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
