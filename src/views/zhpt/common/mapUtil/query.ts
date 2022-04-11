import { SuperMap, FeatureService } from '@supermap/iclient-ol';
import GeoJSON from 'ol/format/GeoJSON';

export default class iQuery {

    dataServiceUrl = null
    dataSource = null
    dataSetInfo = null
    featureService = null

    constructor ({ dataServiceUrl, dataSource, dataSetInfo }) {
        this.dataServiceUrl = dataServiceUrl
        this.dataSetInfo = dataSetInfo
        this.dataSource = dataSource
        this.init()
    }

    private init () {
        this.featureService = new FeatureService(this.dataServiceUrl)
    }

    // 空间查询模式
    spatialQueryMode: {
        CROSS : "CROSS",
        INTERSECT: "INTERSECT",
        NONE: "NONE"
    }
    
    // 空间查询
    spaceQuery (queryFeature) {
        let queryPromises = this.dataSetInfo.map(info => {
            return new Promise(resolve => {
                let params = new SuperMap.GetFeaturesByGeometryParameters({
                    toIndex: -1,
                    maxFeatures: 1e3,
                    datasetNames: [this.dataSource + ':' + info.name],
                    geometry: new GeoJSON().readFeature(queryFeature).getGeometry(),
                    spatialQueryMode: "INTERSECT" // 相交空间查询模式
                })
                this.featureService.getFeaturesByGeometry(params, result => {
                    if (result.type == "processFailed") resolve(null);
                    else resolve(result);
                })
            })
        })
        return Promise.all(queryPromises)
    }

    // 属性查询
    sqlQuery (sqlStr) {
        console.log("sql过滤条件", sqlStr)
        let queryPromises = this.dataSetInfo.map(info => {
            return new Promise(resolve => {
                let params = new SuperMap.GetFeaturesBySQLParameters({
                    maxFeatures: 1e4,
                    toIndex: -1,
                    datasetNames: [this.dataSource + ':' + info.name],
                    queryParameter: { attributeFilter: sqlStr }
                })
                this.featureService.getFeaturesBySQL(params, result => {
                    if (result.type == "processFailed") resolve(null);
                    else resolve(result);
                })
            })
        })
        return Promise.all(queryPromises)
    }

    boundsQuery (bounds) {

    }
    
    bufferQuery (buffer) {

    }


}