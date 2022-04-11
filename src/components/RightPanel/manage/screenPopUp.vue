<template>
  <div class="screen">
    <el-form
      ref="orderForm"
      :model="orderForm"
      label-position="right"
      label-width="104px"
      :disabled="disabled"
      size="small"
    >
      <div class="header_text">工单信息</div>
      <el-row type="flex" justify="space-between">
        <el-col :span="12">
          <el-form-item label="工单编号">
            <el-row type="flex" justify="space-between">
              <el-col :span="16">
                <el-input v-model="orderForm.lxdh" size="small" :disabled="true" />
              </el-col>
              <el-col :span="8" style="color: red"> *自动生成 </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="工单类型">
            <el-select v-model="orderForm.gdlx" multiple size="small" placeholder="请选择工单类型">
              <el-option v-for="item in workOrderTypeT" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="计划开始时间">
            <el-date-picker
              v-model="orderForm.kssj"
              size="small"
              type="datetime"
              placeholder="选择日期"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工单来源">
            <el-select v-model="orderForm.jjly" size="small" placeholder="请选择工单来源">
              <el-option v-for="item in workOrderSource" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="工单详细类型">
            <el-select v-model="orderForm.gzlx" size="small" placeholder="请选择工单详细类型">
              <el-option v-for="item in workOrderType" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="计划结束时间">
            <el-date-picker
              v-model="orderForm.kssj"
              size="small"
              type="datetime"
              placeholder="选择日期"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="header_text">客户信息</div>
      <el-row>
        <el-col :span="8">
          <el-form-item label="来电电话">
            <el-input v-model="orderForm.khdh" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户编号">
            <el-input v-model="orderForm.yhbh" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户姓名">
            <el-input v-model="orderForm.yhxm" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="用水地址">
            <el-input v-model="orderForm.yhdz" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同编号">
            <el-input v-model="orderForm.htbh" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同签订日期">
            <el-input v-model="orderForm.qdrq" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="档案号">
            <el-input v-model="orderForm.dah" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="区段号">
            <el-input v-model="orderForm.qdh" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用水性质">
            <el-input v-model="orderForm.ysxz" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="水表口径">
            <el-input v-model="orderForm.sbkj" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="水表表型">
            <el-input v-model="orderForm.sbbx" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="表前阀类型">
            <el-input v-model="orderForm.bqf" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="最近查表日">
            <el-input v-model="orderForm.cbr" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="最近差别止度">
            <el-input v-model="orderForm.cbzd" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="欠费金额">
            <el-input v-model="orderForm.qfje" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="前1月水量">
            <el-input v-model="orderForm.yysl" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="前2月水量">
            <el-input v-model="orderForm.eysl" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="前3月水量">
            <el-input v-model="orderForm.sysl" size="small" />
          </el-form-item>
        </el-col>
      </el-row>

      <div class="header_text">上报信息</div>
      <el-row type="flex" justify="space-between">
        <el-col :span="24">
          <el-form-item label="问题描述">
            <el-input v-model="orderForm.wtms" size="small" type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-col :span="8">
          <el-form-item label="上报内容">
            <el-input v-model="orderForm.yhbh" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="上报职员">
            <el-input v-model="orderForm.yhbh" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="上报日期">
            <el-date-picker
              v-model="orderForm.kssj"
              size="small"
              type="datetime"
              placeholder="选择日期"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import // addRegister,
// editRegister,
// getWorkOrderList,
// getWorkOrderSourceList,
// getFaultList,
'@/api/work'
import { parseTime } from '@/utils/index'
// import { getSectionList } from '@/api/base'

export default {
  components: {},
  props: {
    data: {
      // 编辑的数据
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean
    },
    title: {
      type: String,
      default: '工单基本信息'
    }
  },
  data() {
    return {
      orderForm: {
        khdh: '13567655678',
        yhbh: '100010',
        yhxm: '张三',
        yhdz: '成都市金堂县赵镇',
        htbh: '100010',
        qdrq: '2020-10-10',
        dah: '100010',
        qdh: '100010',
        ysxz: '生活用水',
        sbkj: '20',
        sbbx: 'IC卡表',
        bqf: '阀一',
        cbr: '2020-12-22',
        cbzd: '12',
        qfje: '0',
        yysl: '37',
        eysl: '71',
        sysl: '103'
      },
      workOrderTypeT: [
        {
          id: '1',
          name: '咨询'
        },
        {
          id: '2',
          name: '投诉'
        },
        {
          id: '3',
          name: '报修'
        }
      ],
      workOrderSource: [
        {
          id: 1,
          name: '热线'
        }
      ]
    }
  },
  created() {
    this.getData()
    this.difference = JSON.stringify(this.data) !== '{}'
    if (this.difference) {
      this.handleEdit()
    }
  },
  mounted() {},
  methods: {
    // 工单类型
    // getData() {
    //   Promise.all([
    //     getWorkOrderList(),
    //     getWorkOrderSourceList(),
    //     getFaultList(),
    //     getSectionList()
    //   ]).then((data) => {
    //     // console.log('2222', data)
    //     this.workOrderType = data[0].result.records
    //     this.workOrderSource = data[1].result.records
    //     this.faultList = data[2].result.records
    //     this.sectionList = data[3].result.records
    //   })
    // },
    //  页码
    handleCurrentChange(currentPage) {
      this.pagination.current = currentPage
      this.fetchData(this.pagination)
    },

    // 条数
    handleSizeChange(size = 1) {
      this.pagination = {
        ...this.pagination,
        size,
        current: 1
      }
      this.fetchData(this.pagination)
    },

    // 选择
    handleSelectionChange(value) {
      this.multipleSelection = value
      // console.log('1111', value)
    },
    handleEdit() {
      for (const key in this.orderForm) {
        this.orderForm[key] = this.data[key]
      }
    },

    resetFields() {
      this.$refs.orderForm.resetFields()
    },

    // 提交
    submitForm() {
      const _this = this
      this.$refs.orderForm.validate((valid) => {
        if (valid) {
          const data = _this.orderForm
          data.kssj = parseTime(data.kssj, '{y}-{m}-{d} {h}:{i}:{s}')
          data.jzsj = parseTime(data.jzsj, '{y}-{m}-{d} {h}:{i}:{s}')
          // console.log('file', data, _this.file)
          if (!this.difference) {
            _this.newAddUser(data)
          } else {
            data.id = this.data.id
            _this.editSubmit(data)
          }
          return true
        } else {
          return false
        }
      })
    }
    // 新增提交
    // newAddUser(data) {
    //   const _this = this
    //   addRegister(data).then((res) => {
    //     _this.$message.success('成功')
    //     _this.$emit('remind', '成功')
    //     _this.resetFields()
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
.btnpos {
  position: relative;
  top: 4px;
  left: 12px;
}
.text_pos {
  position: relative;
  top: 8px;
}
.header_text {
  font-size: 18px;
  font-weight: 400;
  height: 30px;
  line-height: 30px;
  background: rgba(57, 153, 243, 0.15);
  padding-left: 10px;
  margin-bottom: 5px;
}
.el-form-item {
  margin-bottom: 5px;
}
</style>
