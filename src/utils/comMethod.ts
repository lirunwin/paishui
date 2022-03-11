/**
 *一些通用的方法
*/
class ComMethod {
  /**
   * 判断数据是否为空(空返回false,不为空返回true)
   * @param value 输入检测的参数
   * */
  valueIsNotEmpty(value){
    let typeValue=typeof value;
    if(typeValue=="undefined"){//是否是undefined
      return false;
    }else if(typeValue=="object"){
      if(!value){//是否是null
        return false;
      }
    }else if(typeValue=="string"){//是否是空，或者undefined、null字符串
      if(value==""||value=="undefined"||value=="null"){
        return false;
      }
    };
    return true
  }

  /**
   * 将空数据重置为-
   * @param value 输入检测的参数
   * */
  emptyValue(value){
    if(this.valueIsNotEmpty(value)){
      return value
    }else{
      return '-'
    }
  }

  /**
   * 使用简单的Json方法复制对象
    * @param value 需要被复制的参数
    * */ 
    jsonCopy(value){
      return JSON.parse(JSON.stringify(value));
    }

    // /**
    //  * 非json的深度复制，本方法是目前想到的，如果有更好的方法可以随时进行替换
    //  * */ 
    // notJsonCopy(copyValue){
    //   let saveValue=null;
    //   let typeValue=typeof copyValue;
    //   if(typeValue=="string" ||typeValue=="number"||typeValue=="undefined"||typeValue=="boolean"){//基本数据类型的复制
    //     saveValue=copyValue;
    //     // return saveValue
    //   }else if(typeValue=="function"){//引用数据类型-函数复制
    //     saveValue=eval(copyValue.toString());
    //     // return saveValue;
    //   }else if(typeValue=="object"||typeValue=="string"){
    //     if(Array.is(copyValue)){//引用数据类型-数组遍历复制
    //       copyValue.forEach(item=>{
    //         saveValue.push(this.notJsonCopy(item));
    //       });
    //       // return saveValue;
    //     }else{
    //       for(let item in copyValue){//引用数据类型-对象遍历复制
    //         saveValue[item]=this.notJsonCopy(copyValue[item])
    //       }
    //       // return saveValue;
    //     }
    //   }
    //   return saveValue;//返回完成的复制
    // }

  /**
   * 日期处理时涉及的时间类型
   * */
  timeType={
    day: 'day',
    month: 'month',
    year: 'year',
  };

  /**
   * 日期处理时，月及日小于10的情况下补0
   * @param value 输入的月或者田
   * */
  dateAddZero(value) {
    if (value < 10) {
      value = '0' + value
    }
    return value
  }

  /**
   * 获取当前时间
   * @param timeType里面的值
   * */
  getCurrentDate(type) {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    let resultDate = ''
    if (type == this.timeType.day) {
      resultDate = year + '-' + this.dateAddZero(month) + '-' + this.dateAddZero(day)
    } else if (type == this.timeType.month) {
      resultDate = year + '-' + this.dateAddZero(month) 
    } else if (type == this.timeType.year) {
      resultDate = year + ''
    }
    return resultDate
  }
  /**
   * 返回的验证
   */
  verificationResult(result){
    if(result&&result.code==1){
      return true
    }else{
      console.log(result);
      return false
    }
  }
}
export const comMethod:dStore.utils.comMethod=new ComMethod();
