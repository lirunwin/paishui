/*
 *公司初始化配置
*/
export const esriConfig = {
  'baseUrl': 'http://192.168.2.238:8080/arcgis_js_api/v416/arcgis_js_api/library/4.16/dojo/dojo.js',
  'baseCssUrl': 'http://192.168.2.238:8080/arcgis_js_api/v416/arcgis_js_api/library/4.16/esri/css/main.css',
  'font_url': 'http://192.168.2.238:8080/arcgis_js_api/v416/arcgis_js_api/library/fonts/',
}

export const iserverConfig = {
  // 'baseUrl': 'http://117.174.10.73:8090/iserver/'
  'baseUrl': 'http://192.168.2.238:8090/iserver/'
}

export const appconfig = {
  // 底图是否采用在线地图，true在线，false离线
  'isonline': true,
  // 是否根据后台配置服务
  'isloadServer': true,
  // 天地图秘钥
  'tianMapKey': '700ea8c1e2dd873c349dc880169fd96d',
  // 打印模板
  'templateFolder': 'D:/xrty/template',
  // 地图初始视角中心
  // 'initCenter': { 'x': 104.44483, 'y': 30.85523 },
  // 临时使用
  'initCenter': [113.15 , 29.37], 
  // 地图初始视角级别
  'initZoom': 15,
  // token
  'usertoken': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJVc2VySUQiOiIiLCJVU0VSTkFNRSI6IiIsIlJFQUxOQU1FIjoiIiwiV0tJRCI6NDU0NCwiUkFOR0UiOiJYUlRZIiwiUkFOR0VGSUVMRCI6bnVsbCwiQ09ERSI6IlhSVFkiLCJDT05ORUNUU1RSIjoiREFUQUJBU0U9b3JjbDtORVROQU1FPTE5Mi4xNjguMi4yNDIvb3JjbDtTRVJWRVI9MTkyLjE2OC4yLjI0MjtVU0VSSUQ9dGZfeHJ0eV9nZW87UEFTU1dPUkQ9dGZfeHJ0eV9nZW87UE9SVD0xNTIxQDUxNTEvdGNwO1ZFUlNJT049c2RlLkRFRkFVTFQiLCJCb3JuVGltZSI6MCwiQXBwSUQiOm51bGx9.bMNoX6nsvNYukk47_UnT9IHGlNIWclbmiXTj3ak1i5KuF5LGexfwV7TwF80nP08GEPaNwScgk7lbJkRHcqtT8w',
  // 地图资源服务
  'gisResource': {
    'printer': {
      'name': '打印地址',
      'url': 'http://117.174.10.73:8090/iserver/services/webprinting/rest/webprinting/v1'
    },
    'legend': [
      {
        'name': '图例',
        'url': 'http://192.168.2.245:6080/arcgis/rest/services/xrty/pipe_tysw/MapServer'
      }
    ],
    // add iserverResource
    "iserver_resource": {
      'dataServer': {
        'dataService': {
          name: "数据服务",
          url: iserverConfig.baseUrl + "services/data-tf_rsps/rest/data"
        }, // 数据服务
        'netWorkAnalysisUrl': iserverConfig.baseUrl + 'services/transportationAnalyst-tf_rsps/rest/networkanalyst/NETWORK_PSPS@tofly',
        'dataSource': "tofly",
        'dataSet': ["psmap"],
        'dataSetInfo': [
            { name: 'TF_PSPS_PIPE_B', type: 'line', label: '排水管线' },
            { name: 'TF_PSPS_POINT_B', type: 'point', label: '排水管点' },
        ]
      },
      'layers': [
        {
          'parentname': "底图", 
          'name': '矢量底图',
          'type': 'tdtlayer',
          'url': 'http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=',
          'visible': true,
          "id": 2
        },
        {
          'parentname': "底图", 
          'name': '影像底图',
          'type': 'tdtlayer',
          'url': 'http://t3.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=',
          'visible': false,
          "id": 3
        },
        // {
        //   'parentname': "底图", 
        //   'name': '标注底图',
        //   'type': 'tdtlayer',
        //   'url': 'http://t4.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=',
        //   'visible': true,
        //   "id": 4
        // },
        // {
        //   'parentname': '底图',
        //   'name': '矢量底图',
        //   'type': 'smlayer',
        //   'url': iserverConfig.baseUrl + 'services/map-base/rest/maps/kxc_vec',
        //   'visible': true,
        //   'id': 2
        // },
        // {
        //   'parentname': '底图',
        //   'name': '影像底图', 
        //   'url': iserverConfig.baseUrl + 'services/map-base/rest/maps/kxc_img',
        //   'type': 'smlayer',
        //   'visible': false,
        //   'id': 3
        // },
        { 
          'parentname': '管线',
          'name': '排水管线',
          'type': 'smlayer',
          // 'url': iserverConfig.baseUrl + 'services/map-kxcgw/rest/maps/给水管线',
          'url': iserverConfig.baseUrl + 'services/map-tf_rsps/rest/maps/psmap',
          'visible': true,
          'legendUrl': 'http://192.168.2.238:8090/iserver/services/map-tf_rsps/rest/maps/psmap/layers/TF_PSPS_RIVER_B@tofly@@psmap/legend',
          // 'legendUrl': 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/%E7%BB%99%E6%B0%B4%E7%AE%A1%E7%BA%BF/layers/TF_PSPS_RIVER_B@tofly@@psmap/legend',
          'id': 6
        }
      ]
    },

    'tian_online_vector': {
      'groupname': '天地图在线矢量服务',
      'type': 'webTiled',
      'config': [
        // { 'name': '矢量地图', 'url': 'https://iserver.supermap.io/iserver/services/map-world/rest/maps/World' }
        // { 'name': '矢量地图', 'url': 'http://{subDomain}.tianditu.com/DataServer?T=vec_c&x={col}&y={row}&l={level}&tk=' }
      ]
    },
    'tian_online_raster': {
      'groupname': '天地图在线影像服务',
      'type': 'webTiled',
      'config': [
        { 'name': '影像地图', 'url': 'http://{subDomain}.tianditu.com/DataServer?T=img_c&x={col}&y={row}&l={level}&tk=' }
      ]
    },
    'tian_online_vector_label': {
      'groupname': '天地图在线矢量标注服务',
      'type': 'webTiled',
      'config': [
        { 'name': '矢量标注图', 'url': 'http://{subDomain}.tianditu.com/DataServer?T=cva_c&x={col}&y={row}&l={level}&tk=' }
      ]
    },
    'tian_online_raster_label': {
      'groupname': '天地图在线影像标注服务',
      'type': 'webTiled',
      'config': [
        { 'name': '影像标注图', 'url': 'http://{subDomain}.tianditu.com/DataServer?T=cia_c&x={col}&y={row}&l={level}&tk=' }
      ]
    },
    'tian_offline_raster_label': {
      'groupname': '天地图离线标注图服务',
      'type': 'tiled',
      'config': [
        { 'name': '标注地图', 'url': 'http://192.168.100.202:6080/arcgis/rest/services/xrty/tysw_imgano/MapServer' }
      ]
    },
    'tian_offline_vector_label': {
      'groupname': '天地图离线标注图服务',
      'type': 'tiled',
      'config': [
        { 'name': '标注地图', 'url': 'http://192.168.100.202:6080/arcgis/rest/services/xrty/tysw_vecano/MapServer' }
      ]
    },
    'tian_offline_raster': {
      'groupname': '天地图离线影像图服务',
      'type': 'tiled',
      'config': [
        { 'name': '影像地图', 'url': 'http://192.168.100.202:6080/arcgis/rest/services/xrty/tysw_img/MapServer' }
      ]
    },
    'tian_offline_vector': {
      'groupname': '天地图离线矢量服务',
      'type': 'tiled',
      'config': [
        { 'name': '矢量地图', 'url': 'http://192.168.100.202:6080/arcgis/rest/services/xrty/tysw_vec/MapServer' }
      ]
    },
    'river_thema': {
      'groupname': '水系专题图服务',
      'type': 'dynamic',
      'config': [
        { 'name': '水系专题图', 'url': 'http://192.168.2.245:6080/arcgis/rest/services/xrty/pipe_river/MapServer' }
      ]
    },
    'business_map': {
      'groupname': '离线业务地图服务',
      'type': 'dynamic',
      'config': [
        { 'name': '业务地图', 'url': 'http://192.168.2.245:6080/arcgis/rest/services/xrty/pipe_tysw/MapServer' }
      ]
    },
    'print': {
      'groupname': '打印服务',
      'config': [
        { 'name': '打印地图', 'url': 'http://192.168.2.245:6080/arcgis/rest/services/xrty/TyswPrint/GPServer/TFPrint/execute' }
      ]
    },
    'layer_name': {
      'groupname': '获取图层名称服务',
      'config': [
        { 'name': '图层名称', 'url': 'http://192.168.2.245:6080/arcgis/rest/services/xrty/pipe_tysw/MapServer/exts/TFGeoAPISOE/getLayerInfor' }
      ]
    },
    'field_intersect': {
      'groupname': '获取重复字段',
      'config': [
        { 'name': '字段名称', 'url': 'http://192.168.2.245:6080/arcgis/rest/services/xrty/pipe_tysw/MapServer/exts/TFGeoAPISOE/fieldIntersect' }
      ]
    },
    'fieldUniqueValue': {
      'groupname': '获取字段唯一值',
      'config': [
        { 'name': '字段唯一', 'url': 'http://192.168.2.245:6080/arcgis/rest/services/xrty/pipe_tysw/MapServer/exts/TFGeoAPISOE/getFieldUniqueValue' }
      ]
    },
    'statistic': {
      'groupname': '属性统计', 
      'config': [
        { 'name': '属性统计', 'url': 'http://192.168.2.245:6080/arcgis/rest/services/xrty/pipe_tysw/MapServer/exts/TFGeoAPISOE/statistic' }
      ]
    },
    'horizental_section_analysis': {
      'groupname': '横剖面分析',
      'config': [
        { 'name': '横剖面分析', 'url': 'http://192.168.2.245:6080/arcgis/rest/services/xrty/pipe_tysw/MapServer/exts/TFGeoAPISOE/HorizentalSectionAnalysis' }
      ]
    },
    'vertical_section_analysis': {
      'groupname': '纵剖面分析',
      'config': [
        { 'name': '纵剖面分析', 'url': 'http://192.168.2.245:6080/arcgis/rest/services/xrty/pipe_tysw/MapServer/exts/TFGeoAPISOE/VerticalSectionAnalysis' }
      ]
    },
    'shutOff_valve_extend_analysis': {
      'groupname': '关阀扩展分析',
      'config': [
        { 'name': '关阀扩展分析', 'url': 'http://192.168.2.245:6080/arcgis/rest/services/xrty/tyswgp/GPServer/ShutOffValveExtendTysw' }
      ]
    },
    'shutOff_valve_analysis': {
      'groupname': '关阀分析',
      'config': [
        { 'name': '关阀分析', 'url': 'http://192.168.2.245:6080/arcgis/rest/services/xrty/tyswgp/GPServer/ShutOffValveAnalyzeTysw' }
      ]
    },
    'burst_pipe_analyze_analysis': {
      'groupname': '爆管分析',
      'config': [
        { 'name': '爆管分析', 'url': 'http://192.168.2.245:6080/arcgis/rest/services/xrty/tyswgp/GPServer/BurstPipeAnalyzeTysw' }
      ]
    },
    'connected_analysis': {
      'groupname': '连通性分析',
      'config': [
        { 'name': '连通性分析', 'url': 'http://192.168.2.245:6080/arcgis/rest/services/xrty/tyswgp/GPServer/ConnectedAnalyzeTysw' }
      ]
    },
    'geometry': {
      'groupname': '图形服务',
      'type': 'geometry',
      'config': [
        { 'name': '图形服务', 'url': 'http://192.168.2.245:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer' }
      ]
    }
  }
}

/*
 * 云服务器上arcgis初始化配置
 */
// export const esriConfig = {
//   'baseUrl': 'http://118.24.21.156:8099/arcgis_js_api/library/4.16/dojo/dojo.js',
//   'baseCssUrl': 'http://118.24.21.156:8099/arcgis_js_api/library/4.16/esri/css/main.css',
//   'font_url': 'http://118.24.21.156:8099/arcgis_js_api/library/fonts/'
// }

// export const appconfig = {
//   // 底图是否采用在线地图，true在线，false离线
//   'isonline': true,
//   // 是否根据后台配置服务
//   'isloadServer': false,
//   // 天地图秘钥
//   'tianMapKey': '700ea8c1e2dd873c349dc880169fd96d',
//   // 地图初始视角中心
//   'initCenter': { 'x': 104.44483, 'y': 30.85523 },
//   // 打印模板
//   'templateFolder': 'E:/template',
//   // 地图初始视角级别
//   'initZoom': 3,
//   // token
//   'usertoken': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJVc2VySUQiOiIiLCJVU0VSTkFNRSI6IiIsIlJFQUxOQU1FIjoiIiwiV0tJRCI6NDU0NCwiUkFOR0UiOiJYUlRZIiwiUkFOR0VGSUVMRCI6bnVsbCwiQ09ERSI6IlhSVFkiLCJDT05ORUNUU1RSIjoiREFUQUJBU0U9b3JjbDtORVROQU1FPTEyNy4wLjAuMS9vcmNsO1NFUlZFUj1sb2NhbGhvc3Q7VVNFUklEPXRmX3hydHlfZ2VvO1BBU1NXT1JEPXRmX3hydHlfZ2VvO1BPUlQ9MTUyMUA1MTUxL3RjcDtWRVJTSU9OPXNkZS5ERUZBVUxUIiwiQm9yblRpbWUiOjAsIkFwcElEIjpudWxsfQ.0S_D8PDHR3Q9BJj3Nj1S4sWdkeaW7dvipAtsppBAFuAkAr3NRGF7l6BqLVxUWMhg6QOWZATHTDLjgPUhZyNobQ',
//   // 地图资源服务
//   'gisResource': {
//     'tian_online_vector': {
//       'groupname': '天地图在线矢量服务',
//       'type': 'webTiled',
//       'config': [
//         { 'name': '矢量地图', 'url': 'http://{subDomain}.tianditu.com/DataServer?T=vec_c&x={col}&y={row}&l={level}&tk=' }
//       ]
//     },
//     'tian_online_raster': {
//       'groupname': '天地图在线影像服务',
//       'type': 'webTiled',
//       'config': [
//         { 'name': '影像地图', 'url': 'http://{subDomain}.tianditu.com/DataServer?T=img_c&x={col}&y={row}&l={level}&tk=' }
//       ]
//     },
//     'tian_online_vector_label': {
//       'groupname': '天地图在线矢量标注服务',
//       'type': 'webTiled',
//       'config': [
//         { 'name': '矢量标注图', 'url': 'http://{subDomain}.tianditu.com/DataServer?T=cva_c&x={col}&y={row}&l={level}&tk=' }
//       ]
//     },
//     'tian_online_raster_label': {
//       'groupname': '天地图在线影像标注服务',
//       'type': 'webTiled',
//       'config': [
//         { 'name': '影像标注图', 'url': 'http://{subDomain}.tianditu.com/DataServer?T=cia_c&x={col}&y={row}&l={level}&tk=' }
//       ]
//     },
//     'tian_offline_raster_label': {
//       'groupname': '天地图离线标注图服务',
//       'type': 'tiled',
//       'config': [
//         { 'name': '标注地图', 'url': 'http://192.168.2.61:6080/arcgis/rest/services/xrty/tysw_imgano/MapServer' }
//       ]
//     },
//     'tian_offline_vector_label': {
//       'groupname': '天地图离线标注图服务',
//       'type': 'tiled',
//       'config': [
//         { 'name': '标注地图', 'url': 'http://192.168.2.61:6080/arcgis/rest/services/xrty/tysw_vecano/MapServer' }
//       ]
//     },
//     'tian_offline_raster': {
//       'groupname': '天地图离线影像图服务',
//       'type': 'tiled',
//       'config': [
//         { 'name': '影像地图', 'url': 'http://192.168.2.61:6080/arcgis/rest/services/xrty/tysw_img/MapServer' }
//       ]
//     },
//     'tian_offline_vector': {
//       'groupname': '天地图离线矢量服务',
//       'type': 'tiled',
//       'config': [
//         { 'name': '矢量地图', 'url': 'http://192.168.2.61:6080/arcgis/rest/services/xrty/tysw_vec/MapServer' }
//       ]
//     },
//     'river_thema': {
//       'groupname': '水系专题图服务',
//       'type': 'dynamic',
//       'config': [
//         { 'name': '水系专题图', 'url': 'http://118.24.21.156:6080/arcgis/rest/services/xrty/pipe_river/MapServer' }
//       ]
//     },
//     'business_map': {
//       'groupname': '离线业务地图服务',
//       'type': 'dynamic',
//       'config': [
//         { 'name': '业务地图', 'url': 'http://118.24.21.156:6080/arcgis/rest/services/xrty/pipe_tysw/MapServer' }
//       ]
//     },
//     'print': {
//       'groupname': '打印服务',
//       'config': [
//         { 'name': '打印地图', 'url': 'http://118.24.21.156:6080/arcgis/rest/services/xrty/TyswPrint/GPServer/TFPrint/execute' }
//       ]
//     },
//     'geometry': {
//       'groupname': '地图图形操作工具',
//       'type': 'tiled',
//       'config': [
//         { 'name': '地图工具', 'url': 'http://118.24.21.156:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer' }
//       ]
//     },
//     'layer_name': {
//       'groupname': '获取图层名称服务',
//       'config': [
//         { 'name': '图层名称', 'url': 'http://118.24.21.156:6080/arcgis/rest/services/xrty/pipe_tysw/MapServer/exts/TFGeoAPISOE/getLayerInfor' }
//       ]
//     },
//     'field_intersect': {
//       'groupname': '获取重复字段',
//       'config': [
//         { 'name': '字段名称', 'url': 'http://118.24.21.156:6080/arcgis/rest/services/xrty/pipe_tysw/MapServer/exts/TFGeoAPISOE/fieldIntersect' }
//       ]
//     },
//     'fieldUniqueValue': {
//       'groupname': '获取字段唯一值',
//       'config': [
//         { 'name': '字段唯一', 'url': 'http://118.24.21.156:6080/arcgis/rest/services/xrty/pipe_tysw/MapServer/exts/TFGeoAPISOE/getFieldUniqueValue' }
//       ]
//     },
//     'statistic': {
//       'groupname': '属性统计',
//       'config': [
//         { 'name': '属性统计', 'url': 'http://118.24.21.156:6080/arcgis/rest/services/xrty/pipe_tysw/MapServer/exts/TFGeoAPISOE/statistic' }
//       ]
//     },
//     'horizental_section_analysis': {
//       'groupname': '横剖面分析',
//       'config': [
//         { 'name': '横剖面分析', 'url': 'http://118.24.21.156:6080/arcgis/rest/services/xrty/pipe_tysw/MapServer/exts/TFGeoAPISOE/HorizentalSectionAnalysis' }
//       ]
//     },
//     'vertical_section_analysis': {
//       'groupname': '纵剖面分析',
//       'config': [
//         { 'name': '纵剖面分析', 'url': 'http://118.24.21.156:6080/arcgis/rest/services/xrty/pipe_tysw/MapServer/exts/TFGeoAPISOE/VerticalSectionAnalysis' }
//       ]
//     },
//     'shutOff_valve_extend_analysis': {
//       'groupname': '关阀扩展分析',
//       'config': [
//         { 'name': '关阀扩展分析', 'url': 'http://118.24.21.156:6080/arcgis/rest/services/xrty/tyswgp/GPServer/ShutOffValveExtendTysw' }
//       ]
//     },
//     'shutOff_valve_analysis': {
//       'groupname': '关阀分析',
//       'config': [
//         { 'name': '关阀分析', 'url': 'http://118.24.21.156:6080/arcgis/rest/services/xrty/tyswgp/GPServer/ShutOffValveAnalyzeTysw' }
//       ]
//     },
//     'burst_pipe_analyze_analysis': {
//       'groupname': '爆管分析',
//       'config': [
//         { 'name': '爆管分析', 'url': 'http://118.24.21.156:6080/arcgis/rest/services/xrty/tyswgp/GPServer/BurstPipeAnalyzeTysw' }
//       ]
//     },
//     'connected_analysis': {
//       'groupname': '连通性分析',
//       'config': [
//         { 'name': '连通性分析', 'url': 'http://118.24.21.156:6080/arcgis/rest/services/xrty/tyswgp/GPServer/ConnectedAnalyzeTysw' }
//       ]
//     },
//     'geometry': {
//       'groupname': '图形服务',
//       'type': 'geometry',
//       'config': [
//         { 'name': '图形服务', 'url': 'http://118.24.21.156:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer' }
//       ]
//     }
//   }
// }

/*
 * 客户服务器上arcgis初始化配置
 */
// export const esriConfig = {
//   'baseUrl': 'http://192.168.100.204:8099/arcgis_js_api/library/4.16/dojo/dojo.js',
//   'baseCssUrl': 'http://192.168.100.204:8099/arcgis_js_api/library/4.16/esri/css/main.css',
//   'font_url': 'http://192.168.100.204:8099/arcgis_js_api/library/fonts/'
// }

// export const appconfig = {
//   // 底图是否采用在线地图，true在线，false离线
//   'isonline': true,
//   // 是否根据后台配置服务
//   'isloadServer': true,
//   // 天地图秘钥
//   'tianMapKey': '700ea8c1e2dd873c349dc880169fd96d',
//   // 地图初始视角中心
//   'initCenter': { 'x': 104.44483, 'y': 30.85523 },
//   // 打印模板
//   'templateFolder': 'c:/arcgis/template',
//   // 地图初始视角级别
//   'initZoom': 3,
//   // token
//   'usertoken': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJVc2VySUQiOiIiLCJVU0VSTkFNRSI6IiIsIlJFQUxOQU1FIjoiIiwiV0tJRCI6NDU0NCwiUkFOR0UiOiJYUlRZIiwiUkFOR0VGSUVMRCI6bnVsbCwiQ09ERSI6IlhSVFkiLCJDT05ORUNUU1RSIjoiREFUQUJBU0U9b3JjbDtORVROQU1FPTEyNy4wLjAuMS9vcmNsO1NFUlZFUj1sb2NhbGhvc3Q7VVNFUklEPXRmX3hydHlfZ2VvO1BBU1NXT1JEPXRmX3hydHlfZ2VvO1BPUlQ9MTUyMUA1MTUxL3RjcDtWRVJTSU9OPXNkZS5ERUZBVUxUIiwiQm9yblRpbWUiOjAsIkFwcElEIjpudWxsfQ.0S_D8PDHR3Q9BJj3Nj1S4sWdkeaW7dvipAtsppBAFuAkAr3NRGF7l6BqLVxUWMhg6QOWZATHTDLjgPUhZyNobQ',
//   // 地图资源服务
//   'gisResource': {
//     'tian_online_vector': {
//       'groupname': '天地图在线矢量服务',
//       'type': 'webTiled',
//       'config': [
//         { 'name': '矢量地图', 'url': 'http://{subDomain}.tianditu.com/DataServer?T=vec_c&x={col}&y={row}&l={level}&tk=' }
//       ]
//     },
//     'tian_online_raster': {
//       'groupname': '天地图在线影像服务',
//       'type': 'webTiled',
//       'config': [
//         { 'name': '影像地图', 'url': 'http://{subDomain}.tianditu.com/DataServer?T=img_c&x={col}&y={row}&l={level}&tk=' }
//       ]
//     },
//     'tian_online_vector_label': {
//       'groupname': '天地图在线矢量标注服务',
//       'type': 'webTiled',
//       'config': [
//         { 'name': '矢量标注图', 'url': 'http://{subDomain}.tianditu.com/DataServer?T=cva_c&x={col}&y={row}&l={level}&tk=' }
//       ]
//     },
//     'tian_online_raster_label': {
//       'groupname': '天地图在线影像标注服务',
//       'type': 'webTiled',
//       'config': [
//         { 'name': '影像标注图', 'url': 'http://{subDomain}.tianditu.com/DataServer?T=cia_c&x={col}&y={row}&l={level}&tk=' }
//       ]
//     },
//     'tian_offline_raster_label': {
//       'groupname': '天地图离线标注图服务',
//       'type': 'tiled',
//       'config': [
//         { 'name': '标注地图', 'url': 'http://192.168.100.202:6080/arcgis/rest/services/xrty/tysw_imgano/MapServer' }
//       ]
//     },
//     'tian_offline_vector_label': {
//       'groupname': '天地图离线标注图服务',
//       'type': 'tiled',
//       'config': [
//         { 'name': '标注地图', 'url': 'http://192.168.100.202:6080/arcgis/rest/services/xrty/tysw_vecano/MapServer' }
//       ]
//     },
//     'tian_offline_raster': {
//       'groupname': '天地图离线影像图服务',
//       'type': 'tiled',
//       'config': [
//         { 'name': '影像地图', 'url': 'http://192.168.100.202:6080/arcgis/rest/services/xrty/tysw_img/MapServer' }
//       ]
//     },
//     'tian_offline_vector': {
//       'groupname': '天地图离线矢量服务',
//       'type': 'tiled',
//       'config': [
//         { 'name': '矢量地图', 'url': 'http://192.168.100.202:6080/arcgis/rest/services/xrty/tysw_vec/MapServer' }
//       ]
//     },
//     'river_thema': {
//       'groupname': '水系专题图服务',
//       'type': 'dynamic',
//       'config': [
//         { 'name': '水系专题图', 'url': 'http://192.168.100.202:6080/arcgis/rest/services/xrty/pipe_river/MapServer' }
//       ]
//     },
//     'business_map': {
//       'groupname': '离线业务地图服务',
//       'type': 'dynamic',
//       'config': [
//         { 'name': '业务地图', 'url': 'http://192.168.100.202:6080/arcgis/rest/services/xrty/pipe_tysw/MapServer' }
//       ]
//     },
//     'print': {
//       'groupname': '打印服务',
//       'config': [
//         { 'name': '打印地图', 'url': 'http://192.168.100.202:6080/arcgis/rest/services/xrty/TyswPrint/GPServer/TFPrint/execute' }
//       ]
//     },
//     'geometry': {
//       'groupname': '地图图形操作工具',
//       'type': 'tiled',
//       'config': [
//         { 'name': '地图工具', 'url': 'http://192.168.100.202:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer' }
//       ]
//     },
//     'layer_name': {
//       'groupname': '获取图层名称服务',
//       'config': [
//         { 'name': '图层名称', 'url': 'http://192.168.100.202:6080/arcgis/rest/services/xrty/pipe_tysw/MapServer/exts/TFGeoAPISOE/getLayerInfor' }
//       ]
//     },
//     'field_intersect': {
//       'groupname': '获取重复字段',
//       'config': [
//         { 'name': '字段名称', 'url': 'http://192.168.100.202:6080/arcgis/rest/services/xrty/pipe_tysw/MapServer/exts/TFGeoAPISOE/fieldIntersect' }
//       ]
//     },
//     'fieldUniqueValue': {
//       'groupname': '获取字段唯一值',
//       'config': [
//         { 'name': '字段唯一', 'url': 'http://192.168.100.202:6080/arcgis/rest/services/xrty/pipe_tysw/MapServer/exts/TFGeoAPISOE/getFieldUniqueValue' }
//       ]
//     },
//     'statistic': {
//       'groupname': '属性统计',
//       'config': [
//         { 'name': '属性统计', 'url': 'http://192.168.100.202:6080/arcgis/rest/services/xrty/pipe_tysw/MapServer/exts/TFGeoAPISOE/statistic' }
//       ]
//     },
//     'horizental_section_analysis': {
//       'groupname': '横剖面分析',
//       'config': [
//         { 'name': '横剖面分析', 'url': 'http://192.168.100.202:6080/arcgis/rest/services/xrty/pipe_tysw/MapServer/exts/TFGeoAPISOE/HorizentalSectionAnalysis' }
//       ]
//     },
//     'vertical_section_analysis': {
//       'groupname': '纵剖面分析',
//       'config': [
//         { 'name': '纵剖面分析', 'url': 'http://192.168.100.202:6080/arcgis/rest/services/xrty/pipe_tysw/MapServer/exts/TFGeoAPISOE/VerticalSectionAnalysis' }
//       ]
//     },
//     'shutOff_valve_extend_analysis': {
//       'groupname': '关阀扩展分析',
//       'config': [
//         { 'name': '关阀扩展分析', 'url': 'http://192.168.100.202:6080/arcgis/rest/services/xrty/tyswgp/GPServer/ShutOffValveExtendTysw' }
//       ]
//     },
//     'shutOff_valve_analysis': {
//       'groupname': '关阀分析',
//       'config': [
//         { 'name': '关阀分析', 'url': 'http://192.168.100.202:6080/arcgis/rest/services/xrty/tyswgp/GPServer/ShutOffValveAnalyzeTysw' }
//       ]
//     },
//     'burst_pipe_analyze_analysis': {
//       'groupname': '爆管分析',
//       'config': [
//         { 'name': '爆管分析', 'url': 'http://192.168.100.202:6080/arcgis/rest/services/xrty/tyswgp/GPServer/BurstPipeAnalyzeTysw' }
//       ]
//     },

//     'connected_analysis': {
//       'groupname': '连通性分析',
//       'config': [
//         { 'name': '连通性分析', 'url': 'http://192.168.100.202:6080/arcgis/rest/services/xrty/tyswgp/GPServer/ConnectedAnalyzeTysw' }
//       ]
//     },
//     'geometry': {
//       'groupname': '图形服务',
//       'type': 'geometry',
//       'config': [
//         { 'name': '图形服务', 'url': 'http://192.168.100.202:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer' }
//       ]
//     }
//   }
// }

/**
 * 水力模型对接
 */
//export const waterModelUrl = 'http://47.116.133.57:3000/JTWDWebServer'
export const waterModelUrl = 'http://192.168.100.201/JTWDWebServer'

/**
 * 轮询时机设置
 */
export const notificationInterval = 30000
export const homeInterval = 60000

/**
 * 水力模型配置
 */
// export const hyduralicsMenus = [
//   {
//     name: 'onlineForecast',
//     title: '在线预测',
//     url: 'http://47.116.133.57:3000/JinTangWDWebApp/#/single/monitoring'
//   },
//   {
//     name: 'smartScheduling',
//     title: '智能调度',
//     url: 'http://47.116.133.57:3000/JinTangWDWebApp/#/single/smart'
//   },
//   {
//     name: 'schedulingPlan',
//     title: '调度预案',
//     url: 'http://47.116.133.57:3000/JinTangWDWebApp/#/single/scheduling'
//   },
//   {
//     name: 'planEvaluation',
//     title: '规划评估',
//     url: 'http://47.116.133.57:3000/JinTangWDWebApp/#/single/plan'
//   },
//   {
//     name: 'pipeFushing',
//     title: '管道冲洗',
//     url: 'http://47.116.133.57:3000/JinTangWDWebApp/#/single/wash'
//   },
//   {
//     name: 'riskAssessment',
//     title: '风险评估',
//     url: 'http://47.116.133.57:3000/JinTangWDWebApp/#/single/risk'
//   },
//   {
//     name: 'hydrualicsSysSetting',
//     title: '系统设置',
//     url: 'http://47.116.133.57:3000/JinTangWDWebApp/#/single/system'
//   }
// ]

/**
 * 客户环境水力模型配置
 */
export const hyduralicsMenus = [
  {
    name: 'onlineForecast',
    title: '在线预测',
    url: 'http://192.168.100.201/JinTangWDWebApp/#/single/monitoring'
  },
  {
    name: 'smartScheduling',
    title: '智能调度',
    url: 'http://192.168.100.201/JinTangWDWebApp/#/single/smart'
  },
  {
    name: 'schedulingPlan',
    title: '调度预案',
    url: 'http://192.168.100.201/JinTangWDWebApp/#/single/scheduling'
  },
  {
    name: 'planEvaluation',
    title: '规划评估',
    url: 'http://192.168.100.201/JinTangWDWebApp/#/single/plan'
  },
  {
    name: 'pipeFushing',
    title: '管道冲洗',
    url: 'http://192.168.100.201/JinTangWDWebApp/#/single/wash'
  },
  {
    name: 'riskAssessment',
    title: '风险评估',
    url: 'http://192.168.100.201/JinTangWDWebApp/#/single/risk'
  },
  {
    name: 'hydrualicsSysSetting',
    title: '系统设置',
    url: 'http://192.168.100.201/JinTangWDWebApp/#/single/system'
  }
]