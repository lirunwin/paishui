<template>
  <form style="height:100%;width:100%;overflow: auto;" novalidate>
    <table class="tablePlan" v-if="header && header.length > 0" cellspacing="0">
      <thead v-if="header && header.length > 0">
        <tr>
          <th colspan="2" :rowspan="hasRowHeadr ? '2' : '1'">{{ tableTitle }}</th>
          <template v-for="(item, index) in header">
            <template>
              <th
                :key="'td_' + index"
                :colspan="item.childList.length > 1 ? item.childList.length : '1'"
                :rowspan="hasRowHeadr && item.childList && item.childList.length > 1 ? 1 : 2"
              >
                {{ item.name }}
              </th>
            </template>
          </template>
        </tr>
        <tr v-if="headerTwo.length > 0">
          <template v-for="(item, index) in headerTwo">
            <template>
              <th :key="'td2_' + index">{{ item.name }}</th>
            </template>
          </template>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, index) in body">
          <template v-for="(item2, index2) in item.childList">
            <template>
              <tr :key="'bodytr_' + index + '_' + index2">
                <td v-if="index2 == 0" :rowspan="item.childList.length">{{ item.name }}</td>
                <td>{{ item2.roadName }}</td>
                <template v-for="(item3, index3) in rowCood">
                  <template>
                    <td
                      :class="'editTd_' + index + '_' + index2 + '_' + index3"
                      @dblclick="startEdit(coodData[item3.type + item2.roadType], $event)"
                      :key="'editTd_' + index + '_' + index2 + '_' + index3"
                    >
                      <template v-if="editOption && coodData[item3.type + item2.roadType].editAction">
                        <el-input
                          style="width:100px;text-align:center"
                          @blur="getSaveInfo(coodData[item3.type + item2.roadType], `${item3.type + item2.roadType}`)"
                          v-model="coodData[item3.type + item2.roadType]['vol']"
                          @input="onChange($event, `${item3.type + item2.roadType}`)"
                        />
                      </template>
                      <template v-else>
                        {{ coodData[item3.type + item2.roadType]['vol'] }}
                      </template>
                    </td>
                  </template>
                </template>
              </tr>
            </template>
          </template>
        </template>
      </tbody>
    </table>
    <div v-else style="width:100%;height:100%">
      <div style="position: relative;float: left;left: calc((100% - 50px)/2);top: calc((100% - 50px)/2);">
        <img src="@/assets/icon/null.png" alt="" />
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'deepSpecification',
  props: {
    map: null,
    getList: null,
    updataList: null,
    tableTitle: null
  },
  data() {
    return {
      datalist: [],
      header: [],
      headerTwo: [],
      hasRowHeadr: false,
      editOption: false,
      body: [],
      rowCood: [],
      coodData: null
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    /**
     * 开始测量
     */
    getData() {
      if (this.getList) {
        this.getList().then((res) => {
          if (this.$comMethod.verificationResult(res)) {
            //明确表头内容
            //明确列内容
            //使用坐标方式进行
            let rowCood = [] //行坐标
            let colCood = [] //列坐标
            this.rowCood = []
            this.hasRowHeadr = false //表头是否跨列
            this.headerTwo = []
            this.body = []
            this.coodData = null
            let header = []
            let headerFiled = []
            let body = []
            let bodyFiled = []
            let coodData = {}
            res.result.forEach((item, index) => {
              item.vol = this.$comMethod.emptyValue(item.vol)
              item.editAction = false
              coodData[item.pipeType + item.roadType] = item
              if (!rowCood[item.pipeType]) {
                rowCood[item.pipeType] = true //用于判断是否已重复添加
                rowCood.push({
                  type: item.pipeType,
                  name: item.pipeName
                })
              }
              if (!colCood[item.roadType]) {
                colCood[item.roadType] = true //用于判断是否已重复添加
                colCood.push(item.roadType)
              }
              /**处理表头*/
              let headerItem = {
                name: item.pipeName, //显示
                pipeName: item.pipeName,
                pipeType: item.pipeType, //类型
                rowSpan: 1,
                childList: []
              }
              if (!header[headerItem.pipeType + headerItem.name]) {
                header[headerItem.pipeType + headerItem.name] = true //去除重复
                headerFiled.push(headerItem.pipeType + headerItem.name)
                if (item.isgrouph == 2) {
                  this.hasRowHeadr = true
                  if (header[item.pipeGrouph]) {
                    header[item.pipeGrouph].childList.push(headerItem)
                  } else {
                    headerItem.name = item.pipeGrouph
                    headerItem.childList.push(item)
                    header[item.pipeGrouph] = headerItem
                    headerFiled.push(item.pipeGrouph)
                    header.push(headerItem)
                  }
                } else {
                  header.push(headerItem)
                }
              }
              /**处理表内容*/
              let bodyItem = {
                name: item.pipeGroupv,
                childList: [item]
              }
              if (!body[item.pipeGroupv]) {
                body.push(bodyItem)
                body[item.pipeGroupv] = bodyItem
                body[item.pipeGroupv][item.roadName] = true
              } else {
                if (!body[item.pipeGroupv][item.roadName]) {
                  body[item.pipeGroupv].childList.push(item)
                  body[item.pipeGroupv][item.roadName] = true
                }
              }
            })
            //多余数据清理
            for (let item of headerFiled) {
              delete header[item]
            }
            this.header = header
            header.forEach((item) => {
              this.getHeaderTwo(item)
            })
            this.body = body
            this.rowCood = rowCood
            //根据横纵填补缺失的数据
            for (let item of rowCood) {
              for (let item2 of colCood) {
                if (!coodData[item.type + item2]) {
                  coodData[item.type + item2] = { editAction: false, vol: '-' }
                }
              }
            }
            this.coodData = coodData
          }
        })
      }
    },

    /**
     * 处理二级表头
     */
    getHeaderTwo(data) {
      if (data.childList && data.childList.length > 0) {
        data.childList.forEach((item) => {
          this.headerTwo.push({
            name: item.pipeName,
            pipeType: item.pipeType //类型
          })
        })
      }
      return data.name
    },

    /**
     * 开始编辑
     */
    startEdit(data, dom) {
      if (!this.editOption) {
        if (!data.id) {
          this.$message.info('未设置该指标，请联系管理人员进行设置')
          return
        }
        this.editOption = true
        data.editAction = true
        this.$nextTick((e) => {
          this.$nextTick((e) => {
            if (dom && dom.target.getElementsByTagName('input')[0]) {
              dom.target.getElementsByTagName('input')[0].focus()
            }
          })
        })
      }
    },

    /**
     * 保存数据
     */
    getSaveInfo(data, key) {
      this.onChange(data.vol, key)
      setTimeout(() => {
        let vol = String(data.vol || '')
        const endsWithStar = vol.endsWith('*')
        vol = vol.replace(/\*$/, '')
        vol = String(Math.round(Number(vol) * 1000) / 1000)

        if (vol <= 0) {
          this.$message({
            showClose: true,
            message: '配置值不能小于等于0',
            type: 'warning'
          })
          // this.$message.warning('配置值不能小于等于0');
          this.getData()
          this.$nextTick((e) => {
            this.editOption = false
          })
          return
        }
        if (this.editOption) {
          if (endsWithStar) vol += '*'
          data.vol = vol
          this.updataList({
            id: data.id,
            vol: data.vol
          }).then((res) => {
            if (this.$comMethod.verificationResult(res)) {
              this.$message.success('更新成功')
              this.getData()
            } else {
              this.$message.warning(res.message || '更新失败')
            }
            this.$nextTick((e) => {
              this.editOption = false
            })
          })
        }
      }, 0)
    },
    onChange(val, key) {
      let vol = val || ''
      const endsWithStar = String(vol).endsWith('*') //123*
      const endsWithDot = String(vol).endsWith('.') // 123.
      const endsWithZero = /\.\d*0$/.test(String(vol)) //123.10
      const endsWithDotZero = /\.0$/.test(String(vol)) //123.0
      vol = String(val || '').replace(/[^0-9\.]/g, '')
      let count = 0
      vol = vol.replace(/\./g, (match) => (++count === 1 ? match : ''))
      count = 0

      vol = String(Number(vol.replace(/\*$|\.$/, '')))

      if (vol) {
        if (endsWithDot) vol += '.'
        if (endsWithZero) vol += endsWithDotZero ? '.0' : '0'
        if (endsWithStar) vol += '*'
      }
      console.log(vol)

      this.coodData = {
        ...this.coodData,
        [key]: { ...this.coodData[key], vol }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tablePlan {
  width: 100%;
  border: 1px solid #ebeef5;
}
.tablePlan td,
.tablePlan th {
  padding: 10px 5px;
  height: 65px;
  min-width: 150px;
  border-right: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
  text-align: center;
}
/deep/ .el-input {
  .el-input__inner {
    padding-left: 0;
    padding-right: 0;
    text-align: center;
    font-weight: 300;
    font-size: 16px;
    margin: -1px;
    padding-left: 10px;
  }
}
</style>
