export const fieldsConfig = {
    '排水管网': {
        'Point': {
            key: 'EXP_NO',
            fields: [
                { label: '类型', name: 'TYPE' },
                { label: '使用状态', name: 'STATUS' },
                { label: '地面高程', name: 'HIGH' },
                { label: '位置', name: 'POINTPOSITION' },
                { label: '井深', name: 'WELLDEEP' },
                { label: '符号角度', name: 'ROTATION' },
                { label: '地址', name: 'ADDRESS' },
                { label: '更新日期', name: 'UPDATE_TIME' },
                { label: '权属单位', name: 'BELONG' }
            ]
        },
        'LineString': {
            key: 'LNO',
            fields: [
                { label: '类型', name: 'TYPE'},
                { label: '材质', name: 'MATERIAL' },
                { label: '管径', name: 'PSIZE'},
                { label: '位置', name: 'POINTPOSITION'},
                { label: '起止埋深', name: ['S_DEEP', 'E_DEEP']},
                { label: '起止高程', name: ['IN_ELEV', 'OUT_ELEV']},
                { label: '埋设方式', name: 'EMBED'},
                { label: '更新日期', name: 'UPDATETIME'},
                { label: '权属单位', name: 'BELONG'},
                { label: '详情', type: 'button' }
            ]
        }
    },
    '综合管网': {
        'Point': {
            key: 'SID',
            fields: [
                { label: '附属物', name: 'ADJUNCT' },
                { label: '管点点号', name: 'FEATURECODE' },
                { label: '高程', name: 'HEIGHT' },
                { label: '井室材质', name: 'WELLMATERIAL' },
                { label: '井盖材质', name: 'WELLLIDMATERIAL' },
                { label: '井盖直径', name: 'WELLLIDSIZE' },
                { label: '深度', name: 'DEPTH' },
                { label: '井室类型', name: 'WELLTYPE' },
                { label: '井深', name: 'WELLDEPTH' }
            ]
        },
        'LineString': {
            key: 'SID',
            fields: [
                { label: '管径', name: 'DIAMETER' },
                { label: '起止高程', name: ['START_HEIGHT', 'END_HEIGHT'] },
                { label: '套管材质', name: 'TGMATERIAL' },
                { label: '管线材质', name: 'MATERIAL' },
                { label: '所在道路', name: 'LANE_WAY' },
                { label: '敷设方式', name: 'BURYTYPE' },
                { label: '起止深度', name: ['START_DEPTH', 'END_DEPTH'] },
                { label: '起点编号', name: 'START_SID' },
                { label: '终点编号', name: 'END_SID' },
                { label: '详情', type: 'buttton' },
            ]
        },
            
        
    }
} 