import XLSX2 from 'xlsx'
import XLSX from 'xlsx-style'

class ToXlsx {
  id;
  title;
  beginColumn;
  endLine;
  // id指的是绑定数据的table的id，
  // title指的是导出表格的名称，记得带后缀xlsx，例如：title='重复导.xlsx';
  constructor(id, title, beginColumn, endLine) {
    this.id = id
    this.title = title
    this.beginColumn = beginColumn
    this.endLine = endLine
  }

  /**
   * 自定义表格
   * @returns {Promise<void>}
   */
  async createCustomizeTable() {
    const sheet = XLSX2.utils.table_to_sheet(document.querySelector(this.id), { raw: true })
    // 设置单个单元格样式 ，A2对应的是excel表格的A2
    // sheet["A2"].s = {
    //   alignment: {
    //     horizontal: "center",
    //     vertical: "center",
    //     wrap_text: true
    //   }
    // };

    // sheet居然是个对象，所以遍历就用for in
    // 偷个懒，因为要所有的表格都居中，所以这里就用for in 遍历设置了，如果只是单个设置，那就用上面的单独设置就行
    for (const key in sheet) {
      if (new RegExp('^[A-Za-z0-9]+$').exec(key)) {
        const cell = key.toString()
        sheet[cell].s = {
          alignment: {
            horizontal: 'center', // 水平对齐-居中
            vertical: 'center', // 垂直对齐-居中
            wrap_text: true
          },
          font: {
            sz: 13,
            bold: true
            // color: {
            //   rgb: 'FFFFAA00'
            // }
          }
        }
      }
    }

    // wpx 字段表示以像素为单位，wch 字段表示以字符为单位
    // 注意，必须从第一个开始设置，不能只设置单独一个
    // !cols是列宽
    sheet['!cols'] = [
      { wpx: 160 }, // A列
      { wpx: 160 }, // B列
      { wpx: 160 }, // C列
      { wpx: 160 }, // D列
      { wpx: 160 },
      { wpx: 160 },
      { wpx: 160 },
      { wpx: 160 },
      { wpx: 160 },
      { wpx: 160 },
      { wpx: 160 },
      { wpx: 160 },
      { wpx: 160 },
      { wpx: 160 },
      { wpx: 160 },
      { wpx: 160 }
    ]

    // ！rows设置的行高
    // sheet['!rows'] = [
    //   { wpx: 400 }, // 1行
    //   { wpx: 400 }, // 2行
    //   { wpx: 400 }, // 3行
    //   { wpx: 400 }, // 4行
    //   { wpx: 400 },
    //   { wpx: 400 },
    //   { wpx: 400 },
    //   { wpx: 400 },
    //   { wpx: 400 },
    //   { wpx: 400 },
    //   { wpx: 400 }
    // ]
    // ["!merges"]这个属性是专门用来进行单元格合并的
    // 合并单元格 index都从0开始e
    sheet['!merges'] = [
      {
        s: { c: 1, r: this.beginColumn }, // s开始 c 开始列 r 开始行  beginColumn
        e: { c: 0, r: this.endLine } // e结束 c 结束列 r 结束行  endLine
      }
    ]
    try {
      this.openDownloadDialog(this.sheet2blob(sheet,null), this.title)
    } catch (e) {
      console.log('自定义表格报错', e)
    }
  }

  /**
   * 将表转换为最终excel文件的blob对象，并使用URL.createObjectUR下载它
   * @param sheet 表格配置项
   * @param sheetName 表格名称
   * @returns {Blob}
   */
  sheet2blob(sheet, sheetName) {
    sheetName = sheetName || 'sheet1'
    const workbook = {
      SheetNames: [sheetName],
      Sheets: {}
    }
    workbook.Sheets[sheetName] = sheet // 生成excel的配置项

    const wopts = {
      bookType: 'xlsx', // 要生成的文件类型
      bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
      type: 'binary'
    }
    const wbout = XLSX.write(workbook, wopts)
    const blob = new Blob([s2ab(wbout)], {
      type: 'application/octet-stream'
    }) // 字符串转ArrayBuffer

    function s2ab(s) {
      const buf = new ArrayBuffer(s.length)
      const view = new Uint8Array(buf)
      for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
      return buf
    }
    return blob
  }

  /**
   *
   * @param url 生成的文件
   * @param saveName 保存文件名称
   */
  openDownloadDialog(url, saveName) {
    if (typeof url === 'object' && url instanceof Blob) {
      url = URL.createObjectURL(url) // 创建blob地址
    }
    const aLink = document.createElement('a')
    aLink.href = url
    aLink.download = saveName || '' // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    let event
    if (window.MouseEvent) event = new MouseEvent('click')
    else {
      event = document.createEvent('MouseEvents')
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    }
    aLink.dispatchEvent(event)
  }
}

export default ToXlsx
