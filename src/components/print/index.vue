<template>
  <div>
    <div id="print" ref="print">
      <div class="title">
        <div class="printTitle">成都兴蓉沱源自来水有限责任公司质量监督检验(整改)业务单</div>
      </div>
      <div class="printMain">
        <div class="itemFirst">
          <div class="itemTitle">检验记录</div>

          <div class="itemMain">
            <div class="itemMain-item">
              <div class="width160">派工职员</div>
              <div class="width1">{{ data.certificationPerson }}</div>
              <div class="width1">整改派工日期</div>
              <div class="width1">{{ data.certificationTime }}</div>
            </div>
            <div class="itemMain-item">
              <div class="width160">协同职员</div>
              <div class="width1 width2">{{ data.collaborativePerson }}</div>
            </div>
            <div class="itemMain-item ">
              <div class="width160">检查内容</div>
              <div class="width1 textarea">{{ data.rectifyDesc }}</div>
            </div>
            <div class="itemMain-item">
              <div class="width160">执行部门</div>
              <div class="width1">{{ data.rectifyDept }}</div>
              <div class="width1">是否需要整改</div>
              <div class="width1">{{ data.rectifyNumber!==null ?'是':'否' }}</div>
            </div>
            <div class="itemMain-item">
              <div class="width160">检查日期</div>
              <div class="width1">{{ data.rectifyTime }}</div>
              <div class="width1">检查职员</div>
              <div class="width1">{{ data.rectifyPerson }}</div>
            </div>
            <div class="itemMain-item ">
              <div class="width160">整改记录</div>
              <div class="width1 textarea">{{ data.rectifyIssueDesc }}</div>
            </div>
            <div class="itemMain-item ">
              <div class="width160">检验记录</div>
              <div class="width1 textarea">{{ data.conclusion }}</div>
            </div>
          </div>
        </div>

        <div class="itemtwo">
          <div class="itemTitle">认证内容</div>
          <div class="itemMain">
            <div class="itemMain-item ">
              <div class="width160">整改时限</div>
              <div class="width1 textarea">{{ data.resultTimeLimit }}</div>
            </div>
            <div class="itemMain-item ">
              <div class="width160">整改内容及要求</div>
              <div class="width1 textarea">{{ data.rectifyDesc }}</div>
            </div>
            <div class="itemMain-item ">
              <div class="width160">审核意见</div>
              <div class="width1 textarea">{{ data.rectifyAuditDesc }}</div>
            </div>
            <div class="itemMain-item">
              <div class="width160">责任人</div>
              <div class="width1">{{ data.auditPerson }}</div>
              <div class="width1">审批时间</div>
              <div class="width1">{{ data.auditTime }}</div>
            </div>
          </div>
        </div>

        <div class="itemthree">
          <div class="itemTitle">认证结果</div>
          <div class="itemMain">
            <div class="itemMain-item ">
              <div class="width160">整改记录</div>
              <div class="width1 textarea">{{ data.rectifyResultDesc }}</div>
            </div>
            <div class="itemMain-item">
              <div class="width160">处置职员</div>
              <div class="width1">{{ data.rectifyPerson }}</div>
              <div class="width1">整改时间</div>
              <div class="width1">{{ data.rectifyTime }}</div>
            </div>
            <div class="itemMain-item ">
              <div class="width160">审批意见</div>
              <div class="width1 textarea">{{ data.rectifyVerifyDesc }}</div>
            </div>
            <div class="itemMain-item">
              <div class="width160">责任人</div>
              <div class="width1">{{ data.validatePerson }}</div>
              <div class="width1">审批时间</div>
              <div class="width1">{{ data.auditTime }}</div>
            </div>
          </div>
        </div>

        <div class="itemfour">
          <div class="itemTitle">整改建议</div>
          <div class="itemMain">
            <div />
            <div class="itemMain-item">
              <div class="width160">质检员</div>
              <div class="width1">{{ data.certificationPerson }}</div>
              <div class="width1">验证时间</div>
              <div class="width1">{{ data.verifyTime }}</div>
            </div>
            <div class="itemMain-item">
              <div class="width160">主管人员</div>
              <div class="width1">{{ data.issuePerson }}</div>
            </div>
          </div>
        </div>

      </div>

      <div class="fotter">
        <div>录入职员：{{ lrzy }}</div>
        <div>录入时间：{{ getDayTimer(new Date()) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAll } from '@/api/qualityTesting/authentication'
export default {
  props: {
    flag: {
      type: String,
      default: ''
    },

    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      arr: [
        {
          dah: '档案号',
          dahNum: 123,
          qdh: '区段号',
          qdhNum: 321,
          kj: '口径',
          kjNum: 321312
        },
        {
          dah: '用水类别',
          dahNum: '生活',
          qdh: '联系人',
          qdhNum: 321,
          kj: '联系电话',
          kjNum: 321312
        },
        { dah: '户名', dahNum: 123 },
        { dah: '地址', dahNum: 123 }
      ],
      bumen: []
    }
  },
  computed: {
    lrzy() {
      return sessionStorage.getItem('username')
    },
    bm() {
      return sessionStorage.getItem('departmentId')
    }
  },
  created() {
    this.data.collaborativePerson = this.data.synergists.map(v => { return v.synergistName }).toString()
    console.log('this.data', this.data)
    this.getall()
  },
  methods: {
    getall() {
      getAll().then(res => {
        this.bumen = res.result
      })
    },
    liucheng(data) {
      let val = ''
      switch (data) {
        case '0':
          val = '本环节'
          break
        case '1':
          val = '转部门整改'
          break
        case '2':
          val = '流程中止'
          break
      }
      return val
    },
    getliucheng(data) {
      let a = ''
      switch (data) {
        case '0':
          a = '本环节'
          break
        case '1':
          a = '转部门'
          break
        case '2':
          a = '驳回'
          break
        case '3':
          a = '终止'
          break
        case '4':
          break
      }
      return a
    },
    getbumen(data) {
      console.log('data', data)
      let a = ''
      this.bumen.map(v => {
        if (v.id == data) {
          a = v.name
        }
      })
      return a
    },
    getDayTimer(data) {
      var date = new Date(data)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? '0' + d : d
      var currentdate = y + '-' + m + '-' + d
      var hh = date.getHours()
      hh = hh < 10 ? '0' + hh : hh
      var mm = date.getMinutes()
      mm = mm < 10 ? '0' + mm : mm
      var ss = date.getSeconds()
      ss = ss < 10 ? '0' + ss : ss
      var time = hh + ':' + mm + ':' + ss
      return currentdate + ' ' + time
    }
  }
}
</script>

<style lang="scss" scoped>
$fontColor: #333;
.backgroundColor {
  background: #339966;
  font-size: 16px;
  -webkit-print-color-adjust: exact;
  -moz-print-color-adjust: exact;
  -ms-print-color-adjust: exact;
  color: #000;
}
#print {
  max-width: 794px;
  height: auto;
  padding: 0 50px;
  .fotter {
    width: 100%;
    margin-top: 5px;
    display: flex;
    justify-content: flex-end;
    font-size: 16px;
    color: $fontColor;
    div {
      margin-right: 50px;
    }
  }
}
#print2 {
  max-width: 794px;
  height: 1123px;
  padding: 0 50px;
}
.printTitle {
  font-size: 24px;
  text-align: center;
  font-weight: 400;
  color: #000;
}
#print{
  .textarea{
    text-align:left !important;
  }
}
.infoMain {
  width: 100%;
  height: auto;
  display: flex;
  .main-right {
    flex: 1;
    .right-item {
      display: flex;
      justify-content: space-around;
      div {
        border: 1px solid #000;
        text-align: center;
        padding: 5px;
        flex: 1;
      }
    }
  }
}

.printMain {
  width: 100%;
  height: auto;
  border: 1px solid #000;
  margin-top: 20px;
}

.itemTitle {
  background: #339966;
  font-size: 20px;
  font-weight: bold;
  padding: 0px 20px;
  border: 1px solid #000;
  -webkit-print-color-adjust: exact;
  -moz-print-color-adjust: exact;
  -ms-print-color-adjust: exact;
}
.itemMain {
  width: 100%;
  height: auto;
  font-size: 18px;
  color: $fontColor;
  .itemMain-item {
    display: flex;
    justify-content: space-around;
    width: 100%;
    div {
      border: 1px solid #000;
      text-align: center;
      padding: 10px 0;
      font-size: 16px;
    }
      .width160 {
        width: 160px;
      }
      .width1 {
        flex: 1;
      }
  }
}
</style>
