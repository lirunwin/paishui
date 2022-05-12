<template>
  <el-button size="small" type="primary" @click="setExport2Excel">
    导出
  </el-button>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX2 from 'xlsx'
import XLSX from 'xlsx-style'
export default {
  props: ['tableId', 'file'],
  data() {
    return {
      todayTimeString: new Date().getTime()
    }
  },
  methods: {
    // 导出表格成excel
    setExport2Excel() {
      /* generate workbook object from table */
      var wb = XLSX2.utils.table_to_sheet(document.querySelector(`#${this.tableId}`)) // mytable为表格的id名
      // if (!wb['!merges']) {
      //   this.$message.warning('无法导出：报表无数据')
      //   return
      // }
      for (var i = 0; i < 50; i++) {
        wb['!cols'][i] = { wpx: 220 }
      }
      // 样式的文档地址
      // https://www.npmjs.com/package/xlsx-style
      for (const key in wb) {
        if(key.indexOf('!') > -1 ) continue
        if(['操作', '详情'].indexOf(wb[key].v) > -1) {
          delete wb[key]
          continue
        } else {
          wb[key].s = {
            font: {
              // 字体设置
              sz: 13,
              bold: false,
              color: {
                rgb: '000000' // 十六进制，不带#
              }
            },
            alignment: {
              // 文字居中
              horizontal: 'center',
              vertical: 'center',
              wrap_text: true
            },
            border: {
              // 设置边框
              top: { style: 'thin' },
              bottom: { style: 'thin' },
              left: { style: 'thin' },
              right: { style: 'thin' }
            }
          }
        }
      }
      
      var data = wb['!merges'] ? this.addRangeBorder(wb['!merges'], wb) : wb // 合并项添加边框
      var filedata = this.sheet2blob(data)
      this.openDownloadDialog(filedata, this.todayTimeString + '-' + (this.file || '') + '报表.xlsx')
    },
    // 为合并项添加边框
    addRangeBorder(range, ws) {
      const arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      range.forEach(item => {
        const startColNumber = Number(item.s.r)
        const endColNumber = Number(item.e.r)
        const startRowNumber = Number(item.s.c)
        const endRowNumber = Number(item.e.c)
        const test = ws[arr[startRowNumber] + (startColNumber + 1)]
        for (let col = startColNumber; col <= endColNumber; col++) {
          for (let row = startRowNumber; row <= endRowNumber; row++) {
            ws[arr[row] + (col + 1)] = test
          }
        }
      })
      return ws
    },
    // 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
    sheet2blob(sheet, sheetName) {
      sheetName = sheetName || 'sheet1'
      var workbook = {
        SheetNames: [sheetName],
        Sheets: {}
      }
      workbook.Sheets[sheetName] = sheet // 生成excel的配置项

      var wopts = {
        bookType: 'xlsx', // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary'
      }
      var wbout = XLSX.write(workbook, wopts)
      var blob = new Blob([s2ab(wbout)], {
        type: 'application/octet-stream'
      }) // 字符串转ArrayBuffer
      function s2ab(s) {
        var buf = new ArrayBuffer(s.length)
        var view = new Uint8Array(buf)
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
        return buf
      }
      return blob
    },
    openDownloadDialog(url, saveName) {
      if (typeof url === 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url) // 创建blob地址
      }
      var aLink = document.createElement('a')
      aLink.href = url
      aLink.download = saveName || '' // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
      var event
      if (window.MouseEvent) event = new MouseEvent('click')
      else {
        event = document.createEvent('MouseEvents')
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      }
      aLink.dispatchEvent(event)
    }
  }
}
</script>

<style>
</style>
