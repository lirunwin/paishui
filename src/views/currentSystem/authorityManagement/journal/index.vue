<template>
  <div
    class="app-container"
    style="
      height: calc(100% - 40px);
      width: 100%;
      position: absolute;
      overflow-y: auto;
      overflow-x: hidden;
    "
  >
    <!-- <Page /> -->
    <div class="hander_journal">
      <!-- 操作日志管理 -->
      <select-item
        v-if="!btnFlag"
        placeholder="请选择"
        title="类型："
        size="small"
        nominate="journal"
        custom-style="display: inline-block; width: 200px;"
        :value="journal"
        :disabled="false"
        :required="false"
        :filterable="true"
        :options="options"
        @changeSelectValue="changeSelectValue"
      />
      时间：
      <el-date-picker
        v-model="problems.startTime"
        style="width: 140px"
        size="small"
        type="date"
        placeholder="请选择开始时间"
        :picker-options="startOptions"
        value-format="yyyy-MM-dd"
      />
      ~
      <el-date-picker
        v-model="problems.endTime"
        style="width: 140px"
        size="small"
        type="date"
        placeholder="请选择结束时间"
        :picker-options="endOptions"
        value-format="yyyy-MM-dd"
      />
      <span v-if="!btnFlag">人员：</span>
      <el-select
        v-if="!btnFlag"
        v-model="userids"
        multiple
        size="small"
        style="display: inline-block; width: 200px; margin-right: 10px"
        placeholder="请选择需要查询的人员"
        filterable
        clearable
        collapse-tags
      >
        <el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.id" />
      </el-select>
      <div class="btn_box">
        <el-button type="primary" size="small" @click="query">查询</el-button>
        <el-button v-if="!btnFlag" type="primary" size="small" @click="retreat">返回</el-button>
      </div>
    </div>
    <div class="journalTable" style="height: calc(100% - 57px); width: 100%">
      <div v-if="btnFlag" style="width: 100%; height: 100%">
        <table-item
          :key="new Date().getTime()"
          :table-data="deptList"
          :for-id="true"
          :column="deptColumn"
          :pagination="false"
          :tableheight="deptList && deptList.length > 0 ? 'auto' : '100%'"
          :border="true"
          :multiple="false"
          :fixed="false"
          :isdelete="false"
          :summary="true"
          :get-summaries="getSummaries"
          @cellDblclick="cellDblclick"
        />
      </div>
      <div v-if="!btnFlag" style="height: 100%; width: 100%">
        <table-item
          :table-data="list"
          :column="column"
          :for-id="true"
          :pagination="true"
          :pagesize="pagination.size"
          :currentpage="pagination.current"
          tableheight="100%"
          :border="true"
          :multiple="false"
          :total="total"
          :fixed="false"
          :isdelete="true"
          :stripe="true"
          @handleCurrentChange="handleCurrentChange"
          @handleSizeChange="handleSizeChange"
          @detail="detailsLook"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import SelectItem from '@/components/FormItem/Select/index.vue'
import TableItem from '@/components/Table/index.vue'
// import Page from './components/page.vue'

import { getJournalList, getFiles, getCountLogType, getUserList } from '@/api/base'

@Component({
  name: 'Journal',
  components: { SelectItem, TableItem }
})
export default class Journal extends Vue {
  options = [
    {
      id: '',
      name: '全部'
    },
    {
      id: '0',
      name: '错误日志'
    },
    {
      id: '1',
      name: '数据操作日志'
    },
    {
      id: '2',
      name: '登录日志'
    }
  ]
  journal = ''
  // 筛选条件
  problems = {
    startTime: null,
    endTime: null
  }
  startOptions = {
    //开始时间控制
    disabledDate: (time) => {
      if (this.problems.endTime) {
        return time.getTime() > new Date(this.problems.endTime)
      }
    }
  }
  endOptions = {
    //结束时间控制
    disabledDate: (time) => {
      if (this.problems.startTime) {
        return new Date(this.problems.startTime).getTime() - 1000 * 60 * 60 * 24 > time.getTime()
      }
    }
  }

  userids = '' //用户编码
  postSearch = {
    startDate: '', //开始时间
    endDate: '', //结束时间
    columnLabel: '', //选中的类型
    deptId: '' //选中的部门
  }
  pagination = { current: 1, size: 30 } // 分页参数信息
  total = 0
  list = [{}]
  column = [
    {
      label: '日志类型',
      prop: 'type',
      formatter: (row, col, cellVal, index) => {
        if (cellVal === '1') return '数据操作日志'
        if (cellVal === '2') return '登录日志'
        if (cellVal === '0') return '错误日志'
        else return ''
      }
    },
    {
      label: '详细信息',
      prop: 'title',
      formatter: (row, col, cellVal, index) => {
        if (row.type === '0') {
          return cellVal + ' ' + (row.exception || '')
        } else return cellVal
      }
    },
    {
      label: '访问IP地址',
      prop: 'remoteAddr'
    },
    {
      label: '操作人',
      prop: 'createBy'
    },
    {
      label: '附件',
      slotScoped: 'dwonfile',
      acts: [{ emitWay: 'detail', operation: '下载', color: 'blue' }]
    },
    {
      label: '时间',
      prop: 'time'
    }
  ]

  //增加日志统计界面
  btnFlag = true
  tableheight = 'true'
  deptList = []
  deptColumn = [
    {
      label: '部门名称',
      prop: 'deptname'
    },
    {
      label: '错误日志',
      prop: 'errornum'
    },
    {
      label: '数据操作日志',
      prop: 'datanum'
    },
    {
      label: '登录日志',
      prop: 'lognum'
    }
  ]
  userList: [] //用户列表

  created() {
    this.btnFlag = true
  }
  mounted() {
    this.getInitData()
    this.getDeptLogType()
  }
  /**
   * @description 获取/设置初始时间
   */
  getInitData() {
    var that = this
    var date = new Date()
    // //开始时间
    //结束时间
    var currentYear = date.getFullYear()
    var currentMonth = date.getMonth()
    var nextMonth = currentMonth
    var nextDay = date.getDate()
    var nextMonthFirstDay = new Date(currentYear, nextMonth, nextDay)
    //获取最近1月的数据
    if (currentMonth == 0) {
      currentYear = currentYear - 1
      currentMonth = 11
    } else {
      currentMonth = currentMonth - 1
    }
    //开始时间
    var binDate = new Date(currentYear, currentMonth, nextDay)
    var endDate = new Date(nextMonthFirstDay)

    //赋值
    that.problems.startTime = this.$moment(binDate).format('YYYY-MM-DD')
    that.problems.endTime = this.$moment(endDate).format('YYYY-MM-DD')
  }

  /**
   * @description 计算开始、结束时间
   */
  dateDiff() {}

  /**
   * 获取部门统计报表
   */
  getDeptLogType() {
    const that = this
    that.dateDiff()
    let data = {
      startDate: this.problems.startTime,
      endDate: this.problems.endTime
    }
    getCountLogType(data).then((res) => {
      if (res && res.result) {
        let resultData = res.result
        that.deptList = that.arrayGroupDept(resultData)
      }
    })
  }

  /**
   * @description 组合当前分组用户信息
   */
  arrayGroupDept(aryList) {
    let map = {}

    for (let i = 0; i < aryList.length; i++) {
      let ai = aryList[i]
      if (!map[ai.deptId]) {
        map[ai.deptId] = [{ type: ai.type, typeName: ai.typeName, num: ai.num }]
        map[ai.deptId].deptName = ai.deptName
      } else {
        map[ai.deptId].push({
          type: ai.type,
          typeName: ai.typeName,
          num: ai.num
        })
        map[ai.deptId].deptName = ai.deptName
      }
    }
    let res = []
    Object.keys(map).forEach((key) => {
      res.push({
        deptId: key,
        deptName: map[key].deptName,
        data: map[key]
      })
    })

    //分组后重组数据
    let resNew = []
    res.forEach((item, index) => {
      //错误日志,数据操作日志,登录日志
      let errornumAry = item.data.filter((item) => item.type == 0)
      let datanumAry = item.data.filter((item) => item.type == 1)
      let lognumAry = item.data.filter((item) => item.type == 2)

      resNew.push({
        order: index + 1,
        deptid: item.deptId,
        deptname: item.deptName,
        errornum: errornumAry.length > 0 ? errornumAry[0].num : '',
        datanum: datanumAry.length > 0 ? datanumAry[0].num : '',
        lognum: lognumAry.length > 0 ? lognumAry[0].num : ''
      })
    })
    return resNew
  }

  // 获取列表数据
  fetchData(data) {
    let that = this
    getJournalList(data).then((res) => {
      res.result.records.forEach((item, index) => {
        item.order = (that.pagination.current - 1) * that.pagination.size + index + 1
        item.isdownfile = false
        if (!this.strIsNull(item.routeIp)) {
          item.isdownfile = true
        }
      })
      this.list = res.result.records
      this.total = res.result.total
    })
  }

  /**
   * 下拉选择组件数据绑定方法事件
   */
  changeSelectValue(key, event) {
    this[key] = event
  }

  // 查询
  query() {
    if (this.btnFlag) {
      this.getDeptLogType()
    } else {
      this.dateDiff()
      const data = {
        type: this.journal,
        startDate: this.problems.startTime,
        endDate: this.problems.endTime,
        deptId: this.postSearch.deptId,
        userIds: this.userids.toString()
      }
      const params = Object.assign({}, data, this.pagination)
      this.fetchData(params)
    }
  }

  // 查询全部
  queryAll() {
    this.fetchData(this.pagination)
  }
  //  页码
  handleCurrentChange(currentPage) {
    this.pagination.current = currentPage
    this.query()
  }

  // 条数
  handleSizeChange(pagesize) {
    this.pagination.size = pagesize
    this.query()
  }

  downLoadFile(filepath) {
    var token = this.$store.state.user.token
    var fileExtension = filepath.substring(filepath.lastIndexOf('.'))
    var timestamp = new Date().getTime()
    var fileName = '日志附件_' + timestamp + '' + fileExtension
    getFiles({
      access_token: token,
      fileName: fileName,
      remotePath: filepath
    }).then((src) => {
      console.log('路径：' + src)
      var reader = new FileReader()
      //@ts-ignore
      reader.readAsDataURL(src)
      reader.onload = (e) => {
        const a = document.createElement('a')
        a.download = fileName
        // 后端设置的文件名称在res.headers的 "content-disposition": "form-data; name=\"attachment\"; filename=\"20181211191944.zip\"",
        //@ts-ignore
        a.href = e.target.result
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    })
  }

  // 详情查看
  detailsLook(data) {
    var that = this
    // 测试地址
    if (that.strIsNull(data.routeIp)) {
      that.$message.error('附件路径为空,无法下载')
    } else {
      that.downLoadFile(data.routeIp)
    }
  }

  /**
   * @description 点击查看日志列表
   */
  cellDblclick(row, column) {
    console.log(row, column)
    if (this.btnFlag) {
      this.postSearch.columnLabel = column.property
      if (this.postSearch.columnLabel === 'order' || this.postSearch.columnLabel === 'deptname') {
        this.$message.warning('请选择统计数字')
        return
      }

      this.btnFlag = false
      if (this.postSearch.columnLabel == 'errornum') {
        this.journal = '0'
      } else if (this.postSearch.columnLabel == 'datanum') {
        this.journal = '1'
      } else if (this.postSearch.columnLabel == 'lognum') {
        this.journal = '2'
      }
      this.pagination.current = 1
      this.postSearch.deptId = row.deptid
      this.getDeptUserList()
      this.query()
    }
  }

  /**
   * @description 获取用户信息
   */
  getDeptUserList() {
    if (!this.btnFlag) {
      let deptId = this.postSearch.deptId
      console.log('部门编码：' + deptId)

      let data = {
        userLevel: 1,
        departmentId: deptId,
        current: 1,
        size: 10000000
      }
      getUserList(data).then((res) => {
        this.userList = res.result.records
      })
    }
  }

  /**
   * @description 返回
   */
  retreat() {
    this.btnFlag = true
    this.query()
  }

  /**
   * @description 合计
   */
  getSummaries(param) {
    const { columns, data } = param
    const sums = []
    columns.forEach((column, index) => {
      const values = data.map((item) => item[column.property])
      let sum = 0
      values.forEach(function(item, index) {
        if (item == null) {
          item = 0
        }
        if (typeof item === 'string' && item.indexOf('%') > 0) {
          item = Number(item.split('%')[0])
        }
        var aaa = Number(item)
        if (!isNaN(aaa)) {
          sum = sum + Number(item)
        } else {
          sum = null
        }
      })
      if (index === 0) {
        sums[index] = '合计'
        return
      } else if (index >= 2) {
        sums[index] = sum
        return
      }
    })
    return sums
  }

  /**
   * @description 判断字符串是否为空
   */
  strIsNull(strVal) {
    strVal = strVal || ''
    return typeof strVal === 'undefined' || strVal == null || strVal == ''
  }

  /**
   * @description 判断数组是否为空
   */
  arrayIsNull(aryList) {
    return typeof aryList == 'undefined' || aryList == null || aryList.length == 0
  }
}
</script>

<style lang="scss" scoped>
#app-container {
  padding: 20px 30px;
}

.hander_journal {
  display: inline-block;
  line-height: 54px;
}
/deep/.journalTable td,
.journalTable th {
  text-align: center;
}
.btn_box {
  display: inline-block;
  margin-left: 20px;
}

.el-table {
  overflow: visible !important;
}

.el-card__body {
  padding: 20px 20px 50px 20px;
}
</style>
