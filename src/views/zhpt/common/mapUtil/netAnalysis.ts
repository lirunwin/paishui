import { SuperMap, NetworkAnalystService } from '@supermap/iclient-ol';
import $ from 'jquery'

// 网络分析
export default class iNetAnalysis {
    analysisUrl = null

    analysisService = null

    weightField = ""

    analysisParams = null

    // weightField: 权重字段
    constructor ({ url = "", weightField = "SmLength" }) {
        this.analysisUrl = url
        this.weightField = weightField
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