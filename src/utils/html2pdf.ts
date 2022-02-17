// 导出页面为PDF格式
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
export default {
  install(Vue, options) {
    Vue.prototype.getPdf = function(pdfName, exportDom) {
      let domId = 'pdfDom'
      if (exportDom) {
        domId = exportDom
      }
      // let shareContent = document.body,//需要截图的包裹的（原生的）DOM 对象
      const shareContent = document.getElementById(domId) // 需要截图的包裹的（原生的）DOM 对象
      const width = shareContent.clientWidth // 获取dom 宽度
      const height = shareContent.clientHeight // 获取dom 高度
      const canvas = document.createElement('canvas') // 创建一个canvas节点
      const scale = 1 // 定义任意放大倍数 支持小数
      canvas.width = width * scale // 定义canvas 宽度 * 缩放
      canvas.height = height * scale // 定义canvas高度 *缩放
      canvas.style.width = shareContent.clientWidth * scale + 'px'
      canvas.style.height = shareContent.clientHeight * scale + 'px'
      canvas.getContext('2d').scale(scale, scale) // 获取context,设置scale
      const opts = {
        scale: scale, // 添加的scale 参数
        canvas: canvas, // 自定义 canvas
        logging: false, // 日志开关，便于查看html2canvas的内部执行流程
        width: width, // dom 原始宽度
        height: height,
        useCORS: true // 【重要】开启跨域配置
      }
      html2Canvas(shareContent, opts)
        .then(() => {
          function js_getDPI() {
            var arrDPI = new Array()
            //@ts-ignore
            if (window.screen.deviceXDPI != undefined) {
              //@ts-ignore
              arrDPI[0] = window.screen.deviceXDPI
              //@ts-ignore
              arrDPI[1] = window.screen.deviceYDPI
            } else {
              var tmpNode = document.createElement('DIV')
              tmpNode.style.cssText = 'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden'
              document.body.appendChild(tmpNode)
              // arrDPI[0] = parseInt(tmpNode.offsetWidth)
              // arrDPI[1] = parseInt(tmpNode.offsetHeight)
              arrDPI[0] = tmpNode.offsetWidth
              arrDPI[1] = tmpNode.offsetHeight
              tmpNode.parentNode.removeChild(tmpNode)
            }
            return arrDPI
          }
          const contentWidth = canvas.width
          const contentHeight = canvas.height
          // 一页pdf显示html页面生成的canvas高度;
          const pageHeight = (contentWidth / 592.28) * 841.89
          // 未生成pdf的html页面高度
          let leftHeight = contentHeight
          // 页面偏移
          let position = 0
          // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
          const imgWidth = 595.28
          const imgHeight = (592.28 / contentWidth) * contentHeight
          const pageData = canvas.toDataURL('image/jpeg', 1.0)
          // let PDF = new JsPDF("", "pt", "a4");  // a4纸纵向
          // let PDF = new JsPDF('landscape');  // 横向页面
          const arrDPI = js_getDPI() // 获取显示器DPI
          // let dpiX = 96  //2022-1-11
          // let dpiY = 96//2022-1-11
          // if (arrDPI.length > 0) { //2022-1-11
          //   dpiX = arrDPI[0] //2022-1-11
          //   dpiY = arrDPI[1] //2022-1-11
          // } //2022-1-11
          // l:横向， p：纵向；单位： in:英寸，mm毫米；画布大小：a3,a4,leter,[]（当内容为数组时，为自定义大小）
          // const PDF = new JsPDF('l', 'in', [ //2022-1-11
          //   (contentWidth + 10) / dpiX, //2022-1-11
          //   (contentHeight + 10) / dpiY //2022-1-11
          // ]) // 自定义页面大小 //2022-1-11
          var PDF = new JsPDF(null, 'pt', 'a4') // 2022-1-11
          if (leftHeight <= pageHeight) {
            // PDF.addImage(pageData, 'JPEG', 5 / dpiX, 5 / dpiY) //2022-1-11
            PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
          } else {
            while (leftHeight > 0) {
              // PDF.addImage(pageData, 'JPEG', 0, position) //2022-1-11
              PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
              leftHeight -= pageHeight
              position -= 841.89
              if (leftHeight > 0) {
                PDF.addPage()
              }
            }
          }
          PDF.save(pdfName + '.pdf') // 这里是导出的文件名
        })
        .catch(() => {})
    }
  }
}
