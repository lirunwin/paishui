
class tool{
  /**获取当前时间*/
  getCurrentTime(){
    let date = new Date();
    return (date.getFullYear() + '-' + this.timeAddZero(date.getMonth() + 1) + '-' + this.timeAddZero(date.getDate()));
  }

  /**处理时间整数中小于10的日期*/
  timeAddZero(value) {
    if (value < 10) {
      value = '0' + value
    }
    return value
  }

  
  /**给时间字符串添加00:00:00*/
  getDayStartTime(value) {
    return value+" 00:00:00"
  }
  /**给时间字符串添加23:59:59*/
  getDayEndTime(value) {
    return value+" 23:59:59"
  }
  /**关闭播放窗口*/
  closePlay(data){
    for (let i = 0, il = data.state.map.floatPanels, ii = il.length; i < ii; i++) {
      if (il[i].com == 'roadPlayer') {
        il.splice(i, 1)
        return
      }
    }
  }
}
const commTool=new tool();
export default commTool;