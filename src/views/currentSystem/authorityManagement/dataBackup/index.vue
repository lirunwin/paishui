<template>
  <div class="main-page" @keyup.enter='updateTable'>
    <el-form class="form" label-width="80px" ref="form" label-position="left" inline>
      <el-form-item label="关键字:" style="margin-right:25px;">
        <el-input
          v-model="params.backDataName"
          placeholder="支持搜索备份文件名称"
          size="small"
          :minlength="450"
          clearable
        />
      </el-form-item>
      <el-form-item label="备份类型:" style="margin-right:25px;">
        <el-checkbox-group v-model="params.backType">
          <el-checkbox label="全面备份" value='1'></el-checkbox>
          <el-checkbox label="增量备份" value='2'></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="操作方式:" style="margin-right:25px;">
        <el-checkbox-group v-model="params.operateType">
          <el-checkbox label="自动备份" value='1'></el-checkbox>
          <el-checkbox label="人工备份" value='2'></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="时间:" style="margin-right:25px;">
        <el-date-picker
          size="small"
          v-model="startDate"
          type="date"
          :picker-options="sOpition"
          @change="sDateChange"
          placeholder="开始日期"
        ></el-date-picker>
        至
        <el-date-picker
          size="small"
          v-model="endDate"
          type="date"
          :picker-options="eOpition"
          @change="eDateChange"
          placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item style="margin-right:15px;">
        <el-button size="small" type="primary" @click="updateTable">查询</el-button>
      </el-form-item>
      <el-form-item style="margin-right:15px;">
        <el-button size="small" type="primary" @click="backup(0)">备份</el-button>
        <el-button size="small" type="primary" @click="backup(1)">策略</el-button>
      </el-form-item>
    </el-form>

    <div class="table-box">
      <el-table
        :data="tableData"
        height="500"
        stripe
        v-bind="defaultStyle"
        :show-overflow-tooltip="true"
      >
        <template slot="empty">
          <img src="@/assets/icon/null.png" alt />
          <p style="margin-top: -7px">暂无数据</p>
        </template>
        <el-table-column width="60" align="center" type="index" label="序号"></el-table-column>
        <el-table-column
          v-for="item of columns"
          :key="item.value"
          :width="item.width"
          :prop="item.prop"
          :label="item.label"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="110">
          <template slot-scope="scope">
            <el-button @click="download(scope.row.backDataPath)" type="text" size="small">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top: 20px">
      <el-pagination
        ref="pagination"
        small
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="params.current"
        :page-size.sync="params.size"
        :page-sizes="[10, 20, 30, 50, 100, 1000]"
        :total="total"
        @current-change="currentChange"
        @size-change="sizeChange"
      />
    </div>
    <el-dialog :visible.sync="showBackConfig" append-to-body width="40%" :title="backConfig ? '备份策略' : '备份'">
      <div class="common-title">{{ backConfig ? '备份策略' : '备份' }}</div>
      <div style="margin: 20px; font-size: 14px; color: #333333;">对业务数据库进行备份</div>
      <div class="backup-content">
        <div class="backup-content-main">
          <div class="backup-content-img">
            <img :src="overBackup.img" alt />
          </div>
          <div class="backup-content-title">全面备份</div>
          <div class="backup-content-tips">{{ overBackup.time }}</div>
          <div v-show="!backConfig">
            <el-button
              @click="backupOption(0)"
              :type="!overBackup.status ? 'primary' : 'danger'"
            >{{ overBackup.text }}</el-button>
          </div>
        </div>
        <div style="flex:0.02"></div>
        <div class="backup-content-main">
          <div class="backup-content-img">
            <img :src="incBackup.img" />
          </div>
          <div class="backup-content-title">增量备份</div>
          <div class="backup-content-tips">{{ incBackup.time }}</div>
          <div v-show="!backConfig">
            <el-button
              @click="backupOption(2)"
              :type="!incBackup.status ? 'primary' : 'danger'"
            >{{ incBackup.text }}</el-button>
          </div>
        </div>
      </div>
      <div style="display:flex;margin-top:10px">
        <div class="backup-config">
          备份周期
          <el-input :disabled="!backConfig" size="small" value="7" style="width:40px" />天一次，保存
          <el-input size="small" value="28" :disabled="!backConfig" style="width: 50px" />天
        </div>
        <div style="flex:0.02"></div>
        <div class="backup-config">
          备份周期
          <el-input
            :disabled="!backConfig"
            size="small"
            value="7"
            style="width: 40px;color:#2d74e7;"
          />天一次，保存
          <el-input size="small" value="28" :disabled="!backConfig" style="width: 50px" />天
        </div>
      </div>
      <div v-show="backConfig" slot="footer" style="text-align:right;margin:15px 10px 0 0;">
        <el-button size="small" @click="saveBackup" type="primary">保存</el-button>
        <el-button size="small" @click="showBackConfig=false" type="primary">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import backupImg from '@/assets/images/backup.png'
import backupingImg from '@/assets/images/backuping.png'
import { baseAddress } from '@/utils/request.ts'
import { getbackUpData, doBackup, downloadFile } from '@/api/backup'

export default {
  data() {
    return {
      sOpition: {
        disabledDate: (time) => {
          time = time.getTime()
          if (this.endDate) {
            return time > new Date(this.endDate).getTime()
          }
          return time > new Date().getTime()
        }
      },
      eOpition: {
        disabledDate: (time) => {
          time = time.getTime()
          if (this.startDate) {
            return time < new Date(this.startDate).getTime() - 8.64e7 || time > new Date().getTime()
          }
          return time > new Date().getTime()
        }
      },
      tableData: [],
      columns: [
        { label: '备份类型', prop: 'backType', width: 130 },
        { label: '操作方式', prop: 'operateType', width: 130 },
        { label: '备份文件名称', prop: 'backDataName', width: '' },
        { label: '备份文件大小', prop: 'backDataLength', width: 130 },
        { label: '备份数据时间范围', prop: 'createTime', width: '' },
        { label: '操作时间', prop: 'createTime', width: 180 },
        { label: '操作人', prop: 'createUser', width: 110 }
      ],
      params: {
        backDataName: '',
        backType: [],
        operateType: [],
        createTime: '',
        current: 1,
        size: 30
      },
      total: 0,
      startDate: '',
      endDate: '',
      defaultStyle: {
        'tool-tip-effect': 'light',
        'show-overflow-tooltip': true,
        'size': 'medium',
        'stripe': true,
        'border': true,
        'header-cell-style': {
          background: '#Eaf1Fd',
          color: 'rgb(50,59,65)',
          height: '46px'
        },
        'cell-style': {
          height: '40px'
        }
      },
      showBackConfig: false,
      // 全面备份
      overBackup: {
        img: backupImg,
        status: 0,
        time: '最后一次备份时间：2022.06.03 12:24:06',
        text: '开始备份'
      },
      // 增量备份
      incBackup: {
        img: backupImg,
        status: 0,
        time: '最后一次备份时间：2022.06.03 12:24:06',
        text: '开始备份'
      },
      backConfig: true
    }
  },
  watch: {
  },
  methods: {
    sDateChange(t) {
      if (!this.endDate) {
        this.$nextTick(() => {
          this.endDate = this.startDate
        })
      }
    },
    eDateChange(t) {
      if (!this.startDate) {
        this.$nextTick(() => {
          this.startDate = this.endDate
        })
      }
    },
    sizeChange(val) {
      this.params.size = val
      this.updateTable()
      console.log('页数变化', val)
    },
    currentChange(val) {
      this.params.current = val
      this.updateTable()
      console.log('当前页变化', val)
    },
    // 更新表格
    updateTable() {
      let params = format(this.params)
      console.log('查询参数', params)
      getbackUpData(params).then((res) => {
        if (res.code === 1 && res.result) {
          let resData = res.result
          this.tableData = resData.records
          this.total = resData.total
        }
      })
      function format(obj) {
        let resObj = {}
        for (let key in obj) {
          if (key === 'backType' || key === 'operateType') { 
            if (obj[key].length === 1) { resObj[key] = obj[key][0] }
            else { resObj[key] = '' }
          } else { resObj[key] = obj[key] }
        }
        return resObj
      }
    },
    // 下载
    download(path) {
      path && window.open(`${baseAddress + path}`)
    },
    // 备份
    backup(type) {
      this.showBackConfig = true
      this.backConfig = !!type
    },
    // 备份操作
    backupOption(type) {
      let backType = type ? this.incBackup : this.overBackup
      this.changeStatus(backType)
      if (backType.status) {
        let timer = this.setTimer(backType, true)
        doBackup().then(res => {
          clearInterval(timer)
          this.changeStatus(backType)
          if (res.code === 1) {
            this.$message.success(res.result) 
            this.updateTable()
          } else { 
            this.$message.error('备份失败！') 
          }
        })
      } else {

      }
    },
    changeStatus (backType) {
      if (backType.status) {
        backType.time = '最后一次备份时间：2022.06.03 12:24:06'
        backType.status = 0
        backType.img = backupImg
        backType.text = '开始备份'
      } else {
        backType.time = '备份中'
        backType.status = 1
        backType.img = backupingImg
        backType.text = '停止备份'
      }
    },
    setTimer (type, open) {
      let index = 0, text = '备份中', eplice = '....', length = eplice.length
      return setInterval(() => {
        type.time = text + eplice.substr(0, index % length)
        index++
      }, 500)
    },
    saveBackup() {
      this.showBackConfig = false
    }
  },
  computed: {},
  mounted() {
    this.updateTable()
  }
}
</script>

<style lang="scss" scoped>
.main-page {
  margin: 20px;
}
/deep/ .el-checkbox {
  margin-right: 5px !important;
}
/deep/ .common-title {
  background: rgb(242, 246, 252);
  position: relative;
  font-weight: bold;
  margin-left: 20px;
  font-size: 15px;
  margin-bottom: 0px;
  height: 30px;
  line-height: 30px;
  color: rgb(46, 116, 231);
  &::after {
    position: absolute;
    top: 5px;
    left: -10px;
    content: '';
    width: 4px;
    height: 65%;
    background-color: #2d74e7;
  }
}

/deep/ .backup-content {
  display: flex;
  .backup-content-main {
    height: 300px;
    flex: 0.49;
    display: flex;
    flex-direction: column;
    text-align: center;
    background: rgb(242, 246, 252);
    justify-content: space-around;
    .backup-content-title {
      font-weight: bold;
      font-size: 16px;
      color: rgb(46, 116, 231);
    }
    .backup-content-tips {
      font-size: 12px;
    }
  }
}
/deep/.el-dialog .el-dialog__header {
  background-color: rgb(45, 116, 231);
  font-size: 16px;
  .el-dialog__title {
    color: white;
  }
  .el-dialog__headerbtn {
    > i {
      color: white !important;
    }
  }
}
/deep/.backup-config {
  flex: 0.49;
  letter-spacing: 2px;
  .el-input {
    color: #2d74e7;
    margin: 0 5px;
    > input {
      color: #2d74e7;
    }
  }
}
</style>