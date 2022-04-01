const iServerBaseUrl = "http://117.174.10.73:8090/"
export const mapConfig = {
    // 国家发布地图
    layers: [{
        name: '电子地图',
        url: 'http://t1.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=567b65214b47c6cd6a731e3bd8cd03da',
        type: '0',
        isGroup: true,
        visible: true // 是否显示
    }, {
        name: '卫星影像',
        url: 'http://t3.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=d23f3b9d7d2e305366291bbafe5582e6',
        type: '0',
        isGroup: true,
        visible: false // 是否显示
    },
    {
        name: '地形地图',
        url: 'http://t4.tianditu.com/DataServer?T=ter_w&tk=d23f3b9d7d2e305366291bbafe5582e6&x={x}&y={y}&l={z}',
        type: '0',
        isGroup: true,
        visible: false // 是否显示
    },
    {
        name: '地名标注',
        url: 'http://t6.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=567b65214b47c6cd6a731e3bd8cd03da',
        type: '0',
        isGroup: true,
        visible: false // 是否显示
    }
    ],
    // iSever发布的服务地址
    iServerUrl: {
        baseMapLayers: [{
            name: '电子地图',
            url: 'http://117.174.10.73:8090/iserver/services/map-base/rest/maps/kxc_vec',
            type: '0',
            visible: true // 是否显示 
        },
        {
            name: '卫星影像',
            url: 'http://117.174.10.73:8090/iserver/services/map-base/rest/maps/kxc_img',
            type: '0',
            visible: false // 是否显示
        }
        ],
        // 基础地理信息子系统图层
        basicGISLayers: [{
            name: '省道',
            url: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/shengdao',
            legendUrl: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/shengdao/layers/shengdao@kxcgw@@shengdao/legend',
            isGroup: true,
            visible: true // 是否显示
        },
        {
            name: '乡道',
            url: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/xiandao',
            legendUrl: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/xiandao/layers/xiandao@kxcgw@@xiandao/legend',
            isGroup: true,
            visible: true // 是否显示
        }
        ],
        // 综合管线子系统图层
        pipelineLayers: [{
            name: '广电线缆',
            url: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/%E5%B9%BF%E7%94%B5%E7%BA%BF%E7%BC%86',
            legendUrl: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/%E5%B9%BF%E7%94%B5%E7%BA%BF%E7%BC%86/layers/%E5%B9%BF%E7%94%B5%E7%BA%BF%E7%BC%86@kxcgw.1@@%E5%B9%BF%E7%94%B5%E7%BA%BF%E7%BC%86/legend',
            isGroup: true,
            visible: true // 是否显示
        },
        {
            name: '广电线缆节点',
            url: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/%E5%B9%BF%E7%94%B5%E7%BA%BF%E7%BC%86%E8%8A%82%E7%82%B9',
            legendUrl: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/%E5%B9%BF%E7%94%B5%E7%BA%BF%E7%BC%86%E8%8A%82%E7%82%B9/layers/%E5%B9%BF%E7%94%B5%E7%BA%BF%E7%BC%86%E8%8A%82%E7%82%B9@kxcgw@@%E5%B9%BF%E7%94%B5%E7%BA%BF%E7%BC%86%E8%8A%82%E7%82%B9/legend',
            isGroup: true,
            visible: true // 是否显示
        },
        {
            name: '移动线缆',
            url: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/%E7%A7%BB%E5%8A%A8%E7%BA%BF%E7%BC%86',
            legendUrl: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/%E7%A7%BB%E5%8A%A8%E7%BA%BF%E7%BC%86/layers/%E7%A7%BB%E5%8A%A8%E7%BA%BF%E7%BC%86@kxcgw.1@@%E7%A7%BB%E5%8A%A8%E7%BA%BF%E7%BC%86/legend',
            isGroup: true,
            visible: true
        },
        {
            name: '移动线缆节点',
            url: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/%E7%A7%BB%E5%8A%A8%E7%BA%BF%E7%BC%86%E8%8A%82%E7%82%B9',
            legendUrl: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/%E7%A7%BB%E5%8A%A8%E7%BA%BF%E7%BC%86%E8%8A%82%E7%82%B9/layers/%E7%A7%BB%E5%8A%A8%E7%BA%BF%E7%BC%86%E8%8A%82%E7%82%B9@kxcgw@@%E7%A7%BB%E5%8A%A8%E7%BA%BF%E7%BC%86%E8%8A%82%E7%82%B9/legend',
            isGroup: true,
            visible: true
        },
        {
            name: '给水管线',
            url: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/%E7%BB%99%E6%B0%B4%E7%AE%A1%E7%BA%BF',
            legendUrl: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/%E7%BB%99%E6%B0%B4%E7%AE%A1%E7%BA%BF/layers/%E7%BB%99%E6%B0%B4%E7%AE%A1%E7%BA%BF@kxcgw.1@@%E7%BB%99%E6%B0%B4%E7%AE%A1%E7%BA%BF/legend',
            isGroup: true,
            visible: true
        },
        {
            name: '给水管道节点',
            url: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/%E7%BB%99%E6%B0%B4%E7%AE%A1%E7%BA%BF%E8%8A%82%E7%82%B9',
            legendUrl: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/%E7%BB%99%E6%B0%B4%E7%AE%A1%E7%BA%BF%E8%8A%82%E7%82%B9/layers/%E7%BB%99%E6%B0%B4%E7%AE%A1%E7%BA%BF%E8%8A%82%E7%82%B9@kxcgw@@%E7%BB%99%E6%B0%B4%E7%AE%A1%E7%BA%BF%E8%8A%82%E7%82%B9/legend',
            isGroup: true,
            visible: true
        },
        {
            name: '排水污水管线',
            url: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/%E6%8E%92%E6%B0%B4%E6%B1%A1%E6%B0%B4%E7%AE%A1%E7%BA%BF',
            legendUrl: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/%E6%8E%92%E6%B0%B4%E6%B1%A1%E6%B0%B4%E7%AE%A1%E7%BA%BF/layers/%E6%8E%92%E6%B0%B4%E6%B1%A1%E6%B0%B4%E7%AE%A1%E7%BA%BF@kxcgw.1@@%E6%8E%92%E6%B0%B4%E6%B1%A1%E6%B0%B4%E7%AE%A1%E7%BA%BF/legend',
            isGroup: true,
            visible: true
        },
        ],
        // 公房管理字系统图层
        publicHouseLayers: [{
            name: '宗地',
            url: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/%E5%AE%97%E5%9C%B0',
            legendUrl: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/%E5%AE%97%E5%9C%B0/layers/%E5%AE%97%E5%9C%B0@kxcgw@@%E5%AE%97%E5%9C%B0/legend',
            isGroup: true,
            visible: true
        },
        {
            name: '公房',
            url: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/%E5%85%AC%E6%88%BF',
            legendUrl: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/%E5%85%AC%E6%88%BF/layers/%E5%85%AC%E6%88%BF@kxcgw@@%E5%85%AC%E6%88%BF/legend',
            isGroup: true,
            visible: true
        }
        ],
        // 三维场景
        sceneService: [{
            url: 'http://117.174.10.73:8090/iserver/services/3D-ResultNetWork-pipe3D/rest/realspace/datas/ResultNetWork_Node@pipe3D/config',
            name: 'ResultNetWork_Node@pipe3D',
            label: '给水设施'
        },
        {
            url: 'http://117.174.10.73:8090/iserver/services/3D-ResultNetWork-pipe3D/rest/realspace/datas/ResultNetWork@pipe3D/config',
            name: 'ResultNetWork@pipe3D',
            label: '给水管道'
        }
        ],
        // 倾斜摄影影像地址
        tiles3D: [
            'http://117.174.10.73:8090/iserver/services/3D-Config-osgb/rest/realspace',
        ],

        // 路径分析服务
        netWorkUrl: "http://117.174.10.73:8090/iserver/services/transportationAnalyst-kxcNet/rest/networkanalyst/kxcNet_Network@kxcNet",
        // 网络分析的配置
        netWorkConfig: [{
            name: "给水管线",
            pointName: "给水管线节点", // 对应的节点名称
            pipeDatasetName: "kxcgw:给水管线", // 管道数据集名称
            facilitiesDatasetName: "kxcgw:给水管线节点", // 设施数据集名称
            pipe3DLayerName: 'ResultNetWork@pipe3D', // 管线3维图层
            Point3DLayerName: 'ResultNetWork_Node@pipe3D', // 管点3维图层
            netWorkLayerName: "jsgw_Network@jsgw", // 网络图层
            netWorkNodeLayer: "jsgw_Network_Node@jsgw", // 网络数据集结点图层
            mapUrl: "http://117.174.10.73:8090/iserver/services/map-jsgw/rest/maps/%E7%BB%99%E6%B0%B4%E7%BD%91%E7%BB%9C", // 网络分析地图服务
            netWorkServiceurl: "http://117.174.10.73:8090/iserver/services/transportationAnalyst-jsgw/rest/networkanalyst/jsgw_Network@jsgw", // 网络分析服务
            connectedEdgesUrl: "http://117.174.10.73:8090/iserver/services/transportationAnalyst-jsgw/rest/networkanalyst/jsgw_Network@jsgw/connectededges.json", //连通性分析地址
            burstAnalysis: true, // 是否有爆管分析
        },
        {
            name: "排水污水管线",
            pointName: "", // 对应的节点名称
            pipeDatasetName: "kxcgw:排水污水管线", // 管道数据集名称
            facilitiesDatasetName: null, // 设施数据集名称
            pipe3DLayerName: '', // 管线3维图层
            Point3DLayerName: '', // 管点3维图层
            netWorkLayerName: "psgw_Network@psgw", // 网络图层
            netWorkNodeLayer: "psgw_Network_Node@psgw", // 网络数据集结点图层
            mapUrl: "http://117.174.10.73:8090/iserver/services/map-psgw/rest/maps/%E6%8E%92%E6%B0%B4%E7%BD%91%E7%BB%9C", // 网络分析地图服务
            netWorkServiceurl: "http://117.174.10.73:8090/iserver/services/transportationAnalyst-psgw/rest/networkanalyst/psgw_Network@psgw", // 网络分析服务
            connectedEdgesUrl: "http://117.174.10.73:8090/iserver/services/transportationAnalyst-psgw/rest/networkanalyst/psgw_Network@psgw/connectededges.json", //连通性分析地址
            burstAnalysis: true, // 是否有爆管分析
        },
        {
            name: "移动线缆",
            pointName: "移动线缆节点", // 对应的节点名称
            pipeDatasetName: "kxcgw:移动线缆", // 管道数据集名称
            facilitiesDatasetName: "kxcgw:移动线缆节点", // 设施数据集名称
            pipe3DLayerName: '', // 管线3维图层
            Point3DLayerName: '', // 管点3维图层
            netWorkLayerName: "ydxw_Network@ydxw", // 网络图层
            netWorkNodeLayer: "ydxw_Network_Node@ydxw", // 网络数据集结点图层
            mapUrl: "http://117.174.10.73:8090/iserver/services/map-ydxw/rest/maps/%E7%A7%BB%E5%8A%A8%E7%BD%91%E7%BB%9C", // 网络分析地图服务
            netWorkServiceurl: "http://117.174.10.73:8090/iserver/services/transportationAnalyst-ydxw/rest/networkanalyst/ydxw_Network@ydxw", // 网络分析服务
            connectedEdgesUrl: "http://117.174.10.73:8090/iserver/services/transportationAnalyst-ydxw/rest/networkanalyst/ydxw_Network@ydxw/connectededges.json", //连通性分析地址
            burstAnalysis: false, // 是否有爆管分析
        },
        {
            name: "广电线缆",
            pointName: "广电线缆节点", // 对应的节点名称
            pipeDatasetName: "kxcgw:广电线缆", // 管道数据集名称
            facilitiesDatasetName: "kxcgw:广电线缆节点", // 设施数据集名称
            pipe3DLayerName: '', // 管线3维图层
            Point3DLayerName: '', // 管点3维图层
            netWorkLayerName: "gdxw_Network@gdxw", // 网络图层
            netWorkNodeLayer: "gdxw_Network_Node@gdxw", // 网络数据集结点图层
            mapUrl: "http://117.174.10.73:8090/iserver/services/map-gdxw/rest/maps/%E5%B9%BF%E7%94%B5%E7%BA%BF%E7%BD%91", // 网络分析地图服务
            netWorkServiceurl: "http://117.174.10.73:8090/iserver/services/transportationAnalyst-gdxw/rest/networkanalyst/gdxw_Network@gdxw", // 网络分析服务
            connectedEdgesUrl: "http://117.174.10.73:8090/iserver/services/transportationAnalyst-gdxw/rest/networkanalyst/gdxw_Network@gdxw/connectededges.json", //连通性分析地址
            burstAnalysis: false, // 是否有爆管分析
        }
        ],
        // 基础GIS数据服务地址
        basicGISDataServer: {
            url: "http://117.174.10.73:8090/iserver/services/data-kxcgw/rest/data",
            dataSource: "kxcgw",
            dataSet: ["yinhang", "yiliao", "shijie", "canyin"],
            dataSetInfo: [
                { name: 'yinhang', type: 'point', label: '银行', s3mName: '' },
                { name: 'yiliao', type: 'point', label: '医疗', s3mName: '' },
                { name: 'shijie', type: 'polygon', label: '市界', s3mName: '' },
                { name: 'canyin', type: 'point', label: '餐饮', s3mName: '' }
            ]
        },
        // 行政区划服务
        regionServer: {
            dataUrl: "http://117.174.10.73:8090/iserver/services/data-kxcgw/rest/data",
            dataSource: "kxcgw",
            dataSet: ["country"],
            dataSetInfo: [
                { name: 'country', type: 'polygon', label: '区域', s3mName: '' },
            ]
        },
        // 管线数据服务
        pipelineDataServer: {
            url: "http://117.174.10.73:8090/iserver/services/data-kxcgw/rest/data",
            dataSource: "kxcgw",
            dataSet: ["给水管线", "给水管线节点", "移动线缆", "移动线缆节点", "广电线缆", "广电线缆节点", "排水污水管线"],
            dataSetInfo: [
                { name: '给水管线', type: 'line', label: '给水管线', s3mName: 'ResultNetWork@pipe3D', attachName: "给水管线节点" },
                { name: '给水管线节点', type: 'point', label: '给水管线节点', s3mName: 'ResultNetWork_Node@pipe3D', attachName: "给水管线" },
                { name: '移动线缆', type: 'line', label: '移动线缆', s3mName: '', attachName: "移动线缆节点" },
                { name: '移动线缆节点', type: 'point', label: '移动线缆节点', s3mName: '', attachName: "移动线缆" },
                { name: '广电线缆', type: 'line', label: '广电线缆', s3mName: '', attachName: "广电线缆节点" },
                { name: '广电线缆节点', type: 'point', label: '广电线缆节点', s3mName: '', attachName: "广电线缆" },
                { name: '排水污水管线', type: 'line', label: '排水污水管线', s3mName: '', attachName: "" }
            ]
        },
        // 公房数据服务
        publicHouseDataServer: {
            url: "http://117.174.10.73:8090/iserver/services/data-kxcgw/rest/data",
            dataSource: "kxcgw",
            dataSet: ["公房", "宗地"],
            dataSetBataSet: "公房",
            dataSetInfo: [
                { name: '公房', type: 'polygon', label: '公房', s3mName: '' },
                { name: '宗地', type: 'polygon', label: '宗地', s3mName: '' }
            ],
            houseDataSets: [
                { name: '公房', type: 'polygon', label: '公房', s3mName: '' }
            ],
            groundDataSets: [
                { name: '宗地', type: 'polygon', label: '宗地', s3mName: '' }
            ]
        },
        webEditServer: [{
            value: '广电线缆',
            label: '广电线缆',
            mapUrl: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/%E5%B9%BF%E7%94%B5%E7%BA%BF%E7%BC%86',
            layerName: '广电线缆@kxcgw',
            dataUrl: 'http://117.174.10.73:8090/iserver/services/data-kxcgw/rest/data',
            datasetName: "kxcgw:广电线缆",
            type: "LineString",
            dataSourceName: "kxcgw",
            dataSetName: "广电线缆",
            mapUrl_his: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/广电线缆_HIS',
            layerName_his: '广电线缆_HIS@kxcgw',
            datasetName_his: "kxcgw:广电线缆_HIS",
            dataSetName_his: "广电线缆_HIS",
        }, {
            value: '广电线缆节点',
            label: '广电线缆节点',
            mapUrl: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/广电线缆节点',
            layerName: '广电线缆节点@kxcgw',
            dataUrl: 'http://117.174.10.73:8090/iserver/services/data-kxcgw/rest/data',
            datasetName: "kxcgw:广电线缆节点",
            type: "Point",
            dataSourceName: "kxcgw",
            dataSetName: "广电线缆节点",
            mapUrl_his: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/广电线缆节点_HIS',
            layerName_his: '广电线缆节点_HIS@kxcgw',
            datasetName_his: "kxcgw:广电线缆节点_HIS",
            dataSetName_his: "广电线缆节点_HIS",
        }, {
            value: '公房',
            label: '公房',
            mapUrl: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/公房',
            layerName: 'building@kxcgw',
            dataUrl: 'http://117.174.10.73:8090/iserver/services/data-kxcgw/rest/data',
            datasetName: "kxcgw:公房",
            type: "Polygon",
            dataSourceName: "kxcgw",
            dataSetName: "公房",
            mapUrl_his: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/公房_HIS',
            layerName_his: '公房_HIS@kxcgw',
            datasetName_his: "kxcgw:公房_HIS",
            dataSetName_his: "公房_HIS",
        }, {
            value: '宗地',
            label: '宗地',
            mapUrl: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/ground',
            layerName: 'ground@kxcgw',
            dataUrl: 'http://117.174.10.73:8090/iserver/services/data-kxcgw/rest/data',
            datasetName: "kxcgw:宗地",
            type: "Polygon",
            dataSourceName: "kxcgw",
            dataSetName: "宗地",
            mapUrl_his: 'http://117.174.10.73:8090/iserver/services/map-kxcgw/rest/maps/宗地_HIS',
            layerName_his: '宗地_HIS@kxcgw',
            datasetName_his: "kxcgw:宗地_HIS",
            dataSetName_his: "宗地_HIS",
        }]
    },

    // 最小覆土深度标准
    coverSoilStandard: [{
        subtype: '电力线缆',
        direct: 0.6, // 直埋
        ditch: 0.45 // 管沟
    },
    {
        subtype: '电信线缆',
        direct: 0.75,
        ditch: 0.55
    },
    {
        subtype: '热力管道',
        direct: 0.6,
        ditch: 0.2
    },
    {
        subtype: '燃气管道',
        direct: 0.7,
        ditch: 0.7
    },
    {
        subtype: '给水管道',
        direct: 0.65,
        ditch: 0.65
    },
    {
        subtype: '雨水排水管道',
        direct: 0.6,
        ditch: 0.6
    },
    {
        subtype: '污水排水管道',
        direct: 0.65,
        ditch: 0.65
    },
    {
        subtype: '雨污合排管道',
        direct: 0.65,
        ditch: 0.65
    }
    ],

    maptools: {
        ScaleLine: {
            isExistence: true
        },
        OverviewMap: {
            isExistence: true,
            url: 'http://t1.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=700ea8c1e2dd873c349dc880169fd96d',
            collapsed: true // 初始为展开方式
        },
        MousePosition: {
            isExistence: true,
            coordinateFormat: 6
        }
    },
    // 视图
    view: {
        center: [104.753586, 31.521350],
        projection: 'EPSG:4490',
        zoom: 15
    },
}

// 天地图web服务
export const tiandituWebSevice = {
    // 天地图逆地理编码服务
    inverseGeocoding: "http://api.tianditu.gov.cn/geocoder?type=geocode&tk=d23f3b9d7d2e305366291bbafe5582e6"
}

export function buildMapConfig(sourcList) {
    // console.log('服务服务了', sourcList)
    let iServerUrl = {
        // 底图
        baseMapLayers: [],
        // 基础地理信息子系统图层
        basicGISLayers: [],
        // 综合管线子系统图层
        pipelineLayers: [],
        // 公房管理字系统图层
        publicHouseLayers: [],
        // 三维场景
        sceneService: [],
        // 三维倾斜摄影
        tiles3D: [],
        // 路径分析服务
        netWorkUrl: "",
        // 网络分析的配置
        netWorkConfig: [],
        // 基础GIS数据服务地址
        basicGISDataServer: { dataSet: [], dataSetInfo: [] },
        // 管线数据服务
        pipelineDataServer: { dataSet: [], dataSetInfo: [] },
        // 公房数据服务
        publicHouseDataServer: { dataSet: [], dataSetInfo: [], houseDataSets: [], groundDataSets: [] },
        // 数据编辑
        webEditServer: []
    }
    for (let i = 0; i < sourcList.length; i++) {
        const item = sourcList[i]
        // 显示图层的配置
        if (item.cval) {
            let layer = {
                name: item.name,
                url: iServerBaseUrl + item.cval,
                legendUrl: item.legendVal ? iServerBaseUrl + item.legendVal : '',
                type: item.systemName,
                isGroup: true,
                visible: item.name == '卫星影像' ? false : true // 默认关闭卫星影像图层
            }
            switch (item.systemName) {
                case '0': // 底图图层
                    iServerUrl['baseMapLayers'].push(layer)
                    break;
                case '1': // 基础GIS的显示图层
                    iServerUrl['basicGISLayers'].push(layer)
                    break;
                case '2':
                case '4': // 管线的显示图层
                    iServerUrl['pipelineLayers'].push(layer)
                    break;
                case '3':
                case '6': // 公房的显示图层
                    iServerUrl['publicHouseLayers'].push(layer)
                    break
            }
        }
        // 数据服务的配置
        if (item.dataUrl) {
            switch (item.systemName) {
                case '1': // 基础gis
                    iServerUrl.basicGISDataServer['url'] = iServerBaseUrl + item.dataUrl
                    iServerUrl.basicGISDataServer['dataSource'] = item.dataSource
                    iServerUrl.basicGISDataServer.dataSet.push(item.dataSets)
                    iServerUrl.basicGISDataServer.dataSetInfo.push({
                        name: item.dataSets,
                        type: item.dataType,
                        label: item.name,
                        s3mName: item.dname
                    })
                    break;
                case '2':
                case '4': // 管线，管点
                    iServerUrl.pipelineDataServer['url'] = iServerBaseUrl + item.dataUrl
                    iServerUrl.pipelineDataServer['dataSource'] = item.dataSource
                    iServerUrl.pipelineDataServer.dataSet.push(item.dataSets)
                    iServerUrl.pipelineDataServer.dataSetInfo.push({
                        name: item.dataSets,
                        type: item.dataType,
                        label: item.name,
                        s3mName: item.dname,
                        attachName: item.pipeNodeDatasetsName
                    })
                    break;
                case '3':
                case '6': // 公房
                    iServerUrl.publicHouseDataServer['url'] = iServerBaseUrl + item.dataUrl
                    iServerUrl.publicHouseDataServer['dataSource'] = item.dataSource
                    iServerUrl.publicHouseDataServer.dataSet.push(item.dataSets)
                    iServerUrl.publicHouseDataServer.dataSetInfo.push({
                        name: item.dataSets,
                        type: item.dataType,
                        label: item.name,
                        s3mName: item.dname
                    })
                    if (item.systemName == '3')
                        iServerUrl.publicHouseDataServer.houseDataSets.push({
                            name: item.dataSets,
                            type: item.dataType,
                            label: item.name,
                            s3mName: item.dname
                        })
                    else if (item.systemName == '6')
                        iServerUrl.publicHouseDataServer.groundDataSets.push({
                            name: item.dataSets,
                            type: item.dataType,
                            label: item.name,
                            s3mName: item.dname
                        })
                    break
            }
        }
        // 三维场景配置
        if (item.dcval && item.systemName != '7') {
            let dLayer = { url: iServerBaseUrl + item.dcval, name: item.dname, label: item.name }
            iServerUrl['sceneService'].push(dLayer)
        }
        // 三维倾斜影像
        if (item.dcval && item.systemName == '7') {
            iServerUrl.tiles3D.push(iServerBaseUrl + item.dcval)
        }

        // 路径分析服务配置
        if (item.systemName == '5' && item.netService) {
            iServerUrl.netWorkUrl = iServerBaseUrl + item.netService
        }

        // 网络分析的配置 
        if (item.cval && item.systemName == '2' && item.netService && item.dataType == 'line') {
            // console.log(item.netService)
            let netConfig = {
                name: item.name,
                pointName: item.pipeNodeDatasetsName, // 对应的节点名称
                pipeDatasetName: item.dataSource + ':' + item.dataSets, // 管道数据集名称
                facilitiesDatasetName: item.dataSource + ':' + item.pipeNodeDatasetsName, // 设施数据集名称
                pipe3DLayerName: item.dname, // 管线3维图层
                Point3DLayerName: 'ResultNetWork_Node@pipe3D', // 管点3维图层
                netWorkLayerName: item.datasetsNetLayer, // 网络图层
                netWorkNodeLayer: item.datasetsNodeLayer, // 网络数据集结点图层
                mapUrl: iServerBaseUrl + item.datasetsMapLayer, // 网络分析地图服务
                netWorkServiceurl: iServerBaseUrl + item.netService, // 网络分析服务
                connectedEdgesUrl: iServerBaseUrl + item.connectService, //连通性分析地址
                burstAnalysis: parseInt(item.isAnalysis) == 1 ? true : false, // 是否有爆管分析
            }
            iServerUrl.netWorkConfig.push(netConfig)
        }

        // 数据编辑配置
        if (item.cval && item.historyDatasetsName) {
            let dataType = 'LineString'
            if (item.dataType == 'line') dataType = 'LineString'
            else if (item.dataType == 'point') dataType = 'Point'
            else dataType = 'Polygon'
            let editConfig = {
                value: item.dataSets,
                label: item.name,
                mapUrl: iServerBaseUrl + item.cval,
                layerName: item.dataSets + '@' + item.dataSource,
                dataUrl: iServerBaseUrl + item.dataUrl,
                datasetName: item.dataSource + ':' + item.dataSets,
                type: dataType,
                dataSourceName: item.dataSource,
                dataSetName: item.dataSets,
                mapUrl_his: iServerBaseUrl + item.historyMapService,
                layerName_his: item.historyDatasetsName + '@' + item.dataSource,
                datasetName_his: item.dataSource + ':' + item.historyDatasetsName,
                dataSetName_his: item.historyDatasetsName,
                systemName: item.systemName
            }
            iServerUrl.webEditServer.push(editConfig)
        }
    }
    // console.log('服务1111', mapConfig.iServerUrl)
    // console.log('服务2222', iServerUrl)
    mapConfig['iServerUrl'] = iServerUrl
    return iServerUrl
}