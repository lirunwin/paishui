<template>
  <div class="main-page">
    <el-form
      class="form"
      label-width="80px"
      ref="form"
      label-position="left"
      inline
    >
      <el-form-item label="关键字:" style="margin-right:25px;">
        <el-input
          v-model="searchText"
          placeholder="支持搜索备份文件名称"
          size="small"
          :minlength="450"
          clearable
        />
      </el-form-item>
      <el-form-item label="备份类型:" style="margin-right:25px;">
        <el-checkbox-group v-model="backupType">
          <el-checkbox label="完全备份"></el-checkbox>
          <el-checkbox label="增量备份"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="操作方式:" style="margin-right:25px;">
        <el-checkbox-group v-model="backupMethod">
          <el-checkbox label="自动备份"></el-checkbox>
          <el-checkbox label="人工备份"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="时间:" style="margin-right:25px;">
        <el-date-picker size="small" v-model="startDate" type="date" placeholder="开始日期"></el-date-picker>至
        <el-date-picker size="small" v-model="endDate" type="date" placeholder="结束日期"></el-date-picker>
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
      <el-table :data="tableData" height="500" stripe v-bind="defaultStyle" :show-overflow-tooltip="true">
        <template slot="empty">
          <img src="@/assets/icon/null.png" alt />
          <p style="margin-top: -7px">暂无数据</p>
        </template>
        <el-table-column width="60" align="center" type="index" label="序号"></el-table-column>
        <el-table-column
          v-for="item of columns"
          :key="item.value"
          :prop="item.prop"
          :label="item.label"
          align="center"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="download(scope.row)" type="text" size="small">下载</el-button>
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
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :page-sizes="[10, 20, 30, 50, 100, 1000]"
        :total="total"
        @current-change="updateTable"
        @size-change="updateTable"
      />
    </div>
    <el-dialog :visible.sync="showBackConfig" append-to-body width="40%" title="备份">
        <div class="common-title">备份策略</div>
        <div style="margin: 20px; font-size: 14px; color: #333333;">对业务数据库进行备份</div>
        <div class="backup-content">
            <div class="backup-content-main">
                <div class="backup-content-img"><img :src="overBackup.img" alt=""></div>
                <div class="backup-content-title">全面备份</div>
                <div class="backup-content-tips">{{ overBackup.time }}</div>
                <div v-show="!backConfig"><el-button @click="backupOption(0)" :type="!overBackup.status ? 'primary' : 'danger'">{{ overBackup.text }}</el-button></div>
            </div>
            <div style="flex:0.02"></div>
            <div class="backup-content-main">
                <div class="backup-content-img"><img :src="incBackup.img"></div>
                <div class="backup-content-title">增量备份</div>
                <div class="backup-content-tips">{{ incBackup.time }}</div>
                <div v-show="!backConfig"><el-button @click="backupOption(2)" :type="!incBackup.status ? 'primary' : 'danger'">{{ incBackup.text }}</el-button></div>
            </div>
        </div>
        <div style="display:flex;margin-top:10px">
            <div class="backup-config">
                备份周期<el-input :disabled="!backConfig" size="small" value="7" style="width:40px"/>天一次，保存<el-input size="small" value="28" :disabled="!backConfig" style="width: 50px"/>天
            </div>
            <div style="flex:0.02"></div>
            <div class="backup-config">
                备份周期<el-input :disabled="!backConfig"  size="small" value="7" style="width: 40px;color:#2d74e7;"/>天一次，保存<el-input size="small"  value="28" :disabled="!backConfig" style="width: 50px"/>天
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
export default {
  data() {
    return {
      tableData: [
        { type: '完全备份', method: '自动备份', name: '1', size: '365M', dataRnage: '2022-06-05 06:03:05 到 2022-06-05 06:04:05', date: '2022-06-05 06:03:05', person: '管理员' },
        { type: '1', method: '1', name: '1', size: '1', dataRnage: '1', date: '1', person: '1' },
        { type: '1', method: '1', name: '1', size: '1', dataRnage: '1', date: '1', person: '1' },
        { type: '1', method: '1', name: '1', size: '1', dataRnage: '1', date: '1', person: '1' }
      ],
      columns: [
        { label: '备份类型', prop: 'type' },
        { label: '操作方式', prop: 'method' },
        { label: '备份文件名称', prop: 'name' },
        { label: '文件大小', prop: 'size' },
        { label: '备份数据时间范围', prop: 'dataRnage' },
        { label: '操作时间', prop: 'date' },
        { label: '操作人', prop: 'person' }
      ],
      currentPage: 1,
      pageSize: 30,
      total: 0,
      searchText: '',
      startDate: '',
      endDate: '',
      backupType: [],
      backupMethod: [],
      defaultStyle: {
        'tool-tip-effect': 'light',
        'show-overflow-tooltip': true,
        size: 'medium',
        stripe: true,
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
      //
      overBackup: {
          img: backupImg,
          status: 0,
          time: '最后一次备份时间：2022.06.03 12:24:06',
          text: '开始备份'
      },
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
      backupType (nv, ov) {
          console.log(nv, ov)
      }
  },
  methods: {
    // 更新表格  
    updateTable() {},
    // 下载
    download() {},
    // 备份
    backup(type) {
        this.showBackConfig = true
        this.backConfig = !!type
    },
    // 备份操作
    backupOption (type) {
        let backType = type ? this.incBackup : this.overBackup
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
    saveBackup () {
        this.showBackConfig = false
    }
  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>
.main-page {
  margin: 20px;
}
/deep/ .el-checkbox {
    margin-right: 5px!important;
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
            font-size: 12px;;
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
        color: white!important;
    }
  }
}
/deep/.backup-config {
    flex:0.49;
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