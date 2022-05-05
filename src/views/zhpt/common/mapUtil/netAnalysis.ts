import { SuperMap, NetworkAnalystService } from '@supermap/iclient-ol';
import { appconfig } from 'staticPub/config'

// 网络分析
export default class iNetAnalysis {
    analysisUrl = null

    analysisService = null

    weightField = "SmLength" // 管网权重字段

    analysisParams = null

    // weightField: 权重字段
    constructor (weightField) {
        this.analysisUrl = appconfig.gisResource['iserver_resource'].netAnalysisService.url
        this.weightField = weightField || this.weightField
        this.init()
    }

    private init () {
        let resSetting = new SuperMap.TransportationAnalystResultSetting({
            returnEdgeFeatures: true,
            returnEdgeGeometry: true,
            returnEdgeIDs: true,
            returnNodeFeatures: true,
            returnNodeGeometry: true,
            returnNodeIDs: true,
            returnPathGuides: true,
            returnRoutes: true
        });
        this.analysisParams = new SuperMap.TransportationAnalystParameter({
            resultSetting: resSetting,
            weightFieldName: this.weightField
        });
        this.analysisService = new NetworkAnalystService(this.analysisUrl)
    }
    
    // 最佳路径 纵剖面分析
    findPath (firstPoint, endPoint) {
        let params = new SuperMap.FindPathParameters({
            isAnalyzeById: false,
            nodes: [firstPoint, endPoint], // 加入起点和终点坐标或者 [ids]
            hasLeastEdgeCount: false,
            parameter: this.analysisParams
        });
        return new Promise(resolve => {
            this.analysisService.findPath(params, res => {
                if (res.type === "processFailed") resolve(null)
                else resolve(res)
            })
        })
    }
}