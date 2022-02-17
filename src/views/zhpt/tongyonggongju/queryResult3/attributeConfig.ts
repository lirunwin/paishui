var formatDate = (key, att) => {
    if(!att || att == ' ') return '-'
    var date = new Date(att)
    var year = date.getFullYear().toString()
    var month = (date.getMonth() + 1).toString()
    if(parseInt(month) < 10) month = '0' + month
    var day = date.getDate().toString()
    if(parseInt(day) < 10) day = '0' + day
    var hour = date.getHours().toString()
    if(parseInt(hour) < 10) hour = '0' + hour
    var mins = date.getMinutes().toString()
    if(parseInt(mins) < 10) mins = '0' + mins
    var sen = date.getSeconds().toString()
    if(parseInt(sen) < 10) sen = '0' + sen
    
    return [year, month, day].join('-') + ' ' + [hour, mins, sen].join(':')
}

var formatFloat = (key, att) => {
    return att.toFixed(2)
}

export var attConfig = {
    hide: ['OBJECTID', 'SHAPE', 'GLOBALID', 'GROUNDZ', 'SHAPE.LEN', 'SHAPE.AREA', 'ENABLED', 'OWNERUNIT'],
    change: {
        'SURVEYDATE': formatDate,
        'CREATEDDATE': formatDate,
        'STARTDEPTH': formatFloat,
        'STARTZ': formatFloat,
        'ENDDEPTH': formatFloat,
        'ENDZ': formatFloat,
        'PIPELENGTH': formatFloat,
        'DEPTH': formatFloat,
        'TOPZ': formatFloat,
    }
}