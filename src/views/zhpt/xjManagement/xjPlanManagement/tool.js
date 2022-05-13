class Tool {
    /**
     * 将一个对象里面的所有值都默认为一个值
    */
    setVaule(items, value) {
        for (let item in items) {
            if(value&&value instanceof Object ){
                items[item] = this.copyValue(value);
            }else{
                items[item] = value;
            }
        }
    }

    /**
     * 获取下拉框里面的值
    */
    getSelectValue(item){
        let value="";
        if(Array.isArray(item)){
            value=item.join(',')
        }else{
            value=item;
        }
        return value
    }

    /**
     * 设置下拉框里面的值
    */    
    setSelectValue(item){
        let value=null;
        if(item){
            let tempValue=item.split(",");
            if(tempValue.length>1){
                value=tempValue
            }else{
                value=item
            }
        }else{
            value=item;
        }
        return value
    }

    /**
     * 浅拷贝
    */    
    copyValue(value){
        let newValue=JSON.parse(JSON.stringify(value));
        return newValue;
    }

    /**
     * 
     * 获取本周的周一和周末
    */
    getTime() {
        var now = new Date();
        var nowTime = now.getTime();
        var day = now.getDay();
        var oneDayTime = 24 * 60 * 60 * 1000;
        if (day == 1) {
            nowTime = nowTime - oneDayTime;
            day = 7;
        }
        var MondayTime = nowTime - (day - 1) * oneDayTime;//显示周一
        var SundayTime = nowTime + (7 - day) * oneDayTime;//显示周日
        return {
            mondayTime: MondayTime,
            sundayTime: SundayTime
        }
    }

    /**
     * 获取点类型的结构
    */
    getPointTempPointItem(typeId,layerName,lat,lng,spatialReference) {
        return {
            // "typeId":typeId,
            "inspectTypeId":typeId,
            "layerName":layerName,
            "lat": lat,
            "lng":lng,
            "geometry":JSON.stringify({
                    type: "point",
                    latitude: lat,
                    longitude: lng,
                    spatialReference: spatialReference
            }),
            "length":0,
        }
    }   

    /**
     * 计算间隔天数,设置计划开始时间和计划结束时间
    */
    DateDiff(dayPlanTime,periodId,periodDay){
        let planBegindate=null;
        let planEnddate=null;
        let intervalDay=0;
        if(periodId != 3){
            planBegindate=dayPlanTime[0]+" 00:00:00";
            planEnddate=dayPlanTime[1].split(' ')[0]+" 23:59:59";
        }else{
            planBegindate=dayPlanTime[0]+"-01 00:00:00";
            planEnddate=this.getNextTime(dayPlanTime[1])
            // let currentDate=new Date(planBegindate);
            // let currentMonth=currentDate.getMonth()+1;
            // let year=currentDate.getFullYear();
            // let isS=false;//是否跨年
            // if(currentMonth+1>12){
            //     year=year+1;
            //     currentMonth=0;
            //     isS=true
            // }
            // var lastDay = new Date(year+"-" +(currentMonth+1)+"-"+1); 
            // lastDay=new Date(lastDay.getTime() - 24*60*60*1000*1);
            // if(isS){
            //     planEnddate=(year-1)+"-"+12+"-"+lastDay.getDate()+" 23:59:59"; 
            // }else{
            //     planEnddate=year+"-"+currentMonth+"-"+lastDay.getDate()+" 23:59:59"; 
            // }
        }
        if(periodId == 1) { //一天一巡
            intervalDay=1;
        } else if(periodId == 2) { //一周一巡
            intervalDay=7;
        } else if(periodId == 3) { //一月一巡
            intervalDay=0;
        } else if(periodId == 4) { //自定义
            intervalDay=periodDay
        }
        return{
            planBegindate:planBegindate,
            planEnddate:planEnddate,
            intervalDay:intervalDay
        }
    }

    /**
     * 数组去重，并去掉空值
    */    
    arrayToHeavy(arrayList){
        let list=[];
        list= Array.from(new Set(arrayList));//涉及的片区ID
        list=list.filter(item=>{return item||item==0||item==""});
        return list
    }
    // 获取下个月的全日期
    getNextTime(time) {
        const nextMonthString = time.split('-')[0] + '-' + (parseInt(time.split('-')[1]) + 1) + '-01'
        const date = new Date(new Date(nextMonthString) - 8.64e7)
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        return year + '-' + month + '-' + day + ' 23:59:59'
        }
}
let tool = new Tool();
export default tool