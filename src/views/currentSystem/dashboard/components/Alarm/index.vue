<template>
  <blocks ref="blockMsg" title="报警信息" more @open-more="handleDialogShow">
    <!-- <table-item class="userTable"
      :table-data="tableData"
      :column="tableColumns"
      border
      stripe
      hightlight
      :pagination="false"
      :multiple="false"
      :fixed="false"
      :isdelete="false"
      :tableheight="tableheight"
      :header-style="headerStyle"
      @look="handleClick"
      @confirm="handleClick"
    /> -->
    <!-- @look="handleClick" -->
    <more-infos
      class="userTable"
      :columns="tableColumns"
      :table-data="tableData"
      :ispagination="false"
      :tableheight="tableheight"
      :pagination="pagination"
      @curr-change="handleCurrentChange"
      @confirm="handleClick"
    />

    <el-dialog :visible.sync="alarmDialog" title="报警信息" append-to-body>
      <!-- @look="handleClick" -->
      <more-infos :columns="tableColumns" :table-data="alarmData" :pagination="pagination" :total="alarmTotal" @size-change="handleSizeChange" @curr-change="handleCurrentChange" @confirm="handleClick">
        <template slot="filters">
          <el-row type="flex" align="middle" :gutter="10">
            <el-col :span="5" style="display: flex; justify-content:flex-start; align-items:center;">
              <span style="width: 45px">类型</span>
              <el-select v-model="filter.warnType" style="width: 120px" size="small" clearable>
                <el-option v-for="type in types" :key="type.ccode" :value="type.ccode" :label="type.cname" />
              </el-select>
            </el-col>
            <el-col :span="5" style="display: flex; justify-content:flex-start; align-items:center;">
              <span style="width: 45px">状态：</span>
              <el-select v-model="filter.isconfirm" style="width: 120px" size="small">
                <el-option v-for="option in options" :key="option.value" :value="option.value" :label="option.label" />
              </el-select>
            </el-col>
            <el-col :span="12" style="display: flex; justify-content:flex-start; align-items:center;">
              <span style="width: 45px">时间：</span>
              <el-date-picker v-model="filter.timeRange" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small" />
            </el-col>
            <el-col :span="2">
              <el-button size="small" type="primary" @click="clickAlarmData">查询</el-button>
            </el-col>
          </el-row>
        </template>
      </more-infos>
    </el-dialog>
  </blocks>
</template>

<script>
import Blocks from '../Layout/Blocks'
import TableItem from '@/components/Table'
import { homeInterval } from 'staticPub/config'
import MoreInfos from '../Layout/MoreInfos'
import { getCodeParent, alarmList, handleWarn } from '@/api/dashboard'
const tableColumns = [
  {
    prop: 'order',
    label: '序号',
    align: 'center',
    width: 60
  },
  {
    prop: 'warnType',
    align: 'center',
    label: '类型'
  },
  {
    prop: 'address',
    align: 'left',
    label: '地址'
  },
  {
    prop: 'stationName',
    align: 'left',
    label: '站点名称'
  },
  {
    prop: 'scadaTime',
    align: 'center',
    label: '时间'
  },
  {
    prop: 'num',
    label: '次数',
    align: 'center',
    width: 80
  },
  // {
  //   prop: 'isclear',
  //   label: '状态'
  // },
  {
    label: '操作',
    prop: 'action',
    slotScoped: 'action',
    align: 'center',
    width: 80,
    acts: [
      // { emitWay: 'look', operation: '查看', color: '##538bea' },
      { emitWay: 'confirm', operation: '确认', color: '#39ac72' }
    ],
    actions: [
      // {
      //   key: 'look',
      //   label: '查看',
      //   color: '#538bea'
      // },

      {
        key: 'confirm',
        label: '确认',
        color: '#39ac72',
        flag: '0'
      },
      {
        key: 'look',
        label: '已确认',
        color: '#d0d0d0',
        flag: '1'
      }
    ]
  }
]
export default {
  components: { Blocks, TableItem, MoreInfos },
  data() {
    return {
      tableData: [],
      tableColumns,
      tableheight: 380, // 默认380
      alarmDialog: false,
      alarmData: [],
      pagination: { current: 1, size: 10 },
      alarmTotal: 0,
      filter: {
        warnType: '',
        isconfirm: '0',
        timeRange: undefined
      },
      postProblems: {
        warnType: '',
        isconfirm: '',
        startTime: undefined,
        endTime: undefined
      },
      options: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '0',
          label: '未确认'
        },
        {
          value: '1',
          label: '已确认'
        }
      ],
      types: [
        // {
        //   value: '',
        //   label: '全部'
        // },
        // {
        //   value: '1',
        //   label: '压力报警'
        // },
        // {
        //   value: '2',
        //   label: '水质报警'
        // },
        // {
        //   value: '3',
        //   label: '河道报警'
        // }
      ],
      headerStyle: {
        background: 'rgba(223, 234, 251)',
        color: 'rgb(73, 74, 76)',
        height: '38px',
        textAlign: 'center'
      },

      intervalId: null // 定时器
    }
  },
  destroyed() {
    // 在页面销毁后，清除计时器
    this.clear()
  },
  created() {
    this.dataRefreh()
    this.getWarnType()
  },
  mounted() {
    this.getTableData()
    // this.getAlarmData()
    window.onresize = () => {
      return (() => {
        this.getTableHeight()
      })()
    }
    this.getTableHeight()
  },
  methods: {
    /**
     * @description 获取报警码表类型
     */
    getWarnType() {
      // 转入外部流程
      getCodeParent({ pCid: '845' }).then(res => {
        const data = res.result
        this.types = this.getCodeOf(data, 845)
      })
    },

    /**
     * @description 筛选码表数据
     */
    getCodeOf(data, id) {
      const code = data.filter(val => {
        return val.id === id
      })
      return code[0].codeList
    },

    // 获取首页最新的10条数据
    getTableData() {
      var that = this
      // const formdata = new FormData()
      // const params = Object.assign({}, that.pagination, that.filter)
      // Object.keys(params).forEach((key) => {
      //   formdata.append(key, params[key])
      // })

      // const query = that.pagination
      // Object.assign(query, that.filter)
      const query = { current: 1, size: 10, isconfirm: '0' }
      console.log('首页报警10调：' + JSON.stringify(query))
      alarmList(query).then(res => {
        console.log(res)
        if (res.code !== -1) {
          res.result.records.forEach((item, index) => item.order = index + 1)
          that.tableData = res.result.records
        }
      })
    },

    // 获取列表
    clickAlarmData() {
      var that = this
      that.pagination.current = 1
      that.getAlarmData()
    },

    getAlarmData() {
      var that = this

      // 追加分页参数
      const query = {
        current: this.pagination.current, size: that.pagination.size
      }
      that.postProblems.warnType = that.filter.warnType
      that.postProblems.isconfirm = that.filter.isconfirm
      that.getDateDiff()

      Object.assign(query, that.postProblems)
      console.log('page参数：' + JSON.stringify(query))

      alarmList(query).then(res => {
        console.log(res)
        if (res.code !== -1) {
          res.result.records.forEach((item, index) => item.order = ((that.pagination.current - 1) * that.pagination.size) + index + 1)
          that.alarmData = res.result.records
          that.alarmTotal = res.result.total
        }
      })
    },

    // 点击更多打开弹窗
    handleDialogShow() {
      this.alarmDialog = true
      this.pagination.current = 1
      this.getAlarmData()
    },
    handleClick(data) {
      console.log(data)

      const _id = data.data.row.id // 主键编号
      const _code = '0' // 0:确认 1：消除
      const _loginId = this.$store.state.user.userId // 登录账号编号

      const query = { id: _loginId, wanrIds: _id }
      handleWarn(query).then(res => {
        console.log(res)
        if (res.code !== -1) {
          console.log('确认成功')
          if (this.alarmDialog) {
            this.getAlarmData()
            this.getTableData()
          } else {
            this.getTableData()
          }
        }
      })
    },
    // 条数变化
    handleSizeChange(size) {
      this.pagination.size = size
      this.getAlarmData()
    },
    // 页码变化
    handleCurrentChange(page) {
      this.pagination.current = page
      this.getAlarmData()
    },
    // 获取宽度，定义折叠个数
    getTableHeight() {
      var that = this
      that.$nextTick(() => {
        var tagsWidth = that.$refs.blockMsg.$el.clientHeight
        that.tableheight = tagsWidth - 90
        console.log('高度：' + tagsWidth)
      })
    },

    /**
		 * @description 计算开始、结束时间
		 */
    getDateDiff() {
      if (this.arrayIsNull(this.filter.timeRange)) {
        this.postProblems.startTime = ''
        this.postProblems.endTime = ''
        return
      }
      if (this.filter.timeRange[0]) {
        if (Array.isArray(this.filter.timeRange)) {
          var bintime = this.filter.timeRange[0]
          var bindate = bintime.getFullYear() + '-' + (bintime.getMonth() + 1) + '-' + bintime.getDate()
          this.postProblems.startTime = bindate + ' 00:00:00'
          // 处理时间
          var endtime = this.filter.timeRange[1]
          var enddate = endtime.getFullYear() + '-' + (endtime.getMonth() + 1) + '-' + endtime.getDate()
          this.postProblems.endTime = enddate + ' 23:59:59'
        }
      }
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
        this.getTableData()
        //  this.getAlarmData()
      }, homeInterval)
    },

    /**
     * @description 停止定时器
     */
    clear() {
      clearInterval(this.intervalId) // 清除计时器
      this.intervalId = null // 设置为null
    },

    /**
     * @description 判断数组是否为空
     */
    arrayIsNull(aryList) {
      return (typeof (aryList) === 'undefined' || aryList == null || aryList.length == 0)
    }

  }
}
</script>

<style lang="scss" scoped>
  // 去除自定义表格header和body不对其方式
  .userTable{
    width: 100%;
    position:absolute;
  }
</style>
