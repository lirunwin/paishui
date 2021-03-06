import { SuperMap, FeatureService, FieldService } from '@supermap/iclient-ol';
import GeoJSON from 'ol/format/GeoJSON';
import Feature from 'ol/Feature';
import { Circle, LineString } from 'ol/geom';
import * as olSphere from 'ol/sphere';
import * as turf from '@turf/turf'
import { appconfig } from 'staticPub/config'

export default class iQuery {

    dataServiceUrl = '' // 服务地址
    dataSource = null // 数据源
    dataSetInfo = null // 数据集
    featureService = null // 查询服务
    maxFeatures = 1e5 // 最大返回要素数量

    projection = "EPSG:4326"

    // 空间查询模式
    spatialQueryMode = {
        CROSS: "CROSS",
        INTERSECT: "INTERSECT",
        NONE: "NONE",
        CONTAIN: "CONTAIN"
    }

    constructor(obj = { dataSetInfo: null }) {
        this.init(obj.dataSetInfo)
    }

    private init(info) {
        let { url, dataSource, dataSetInfo } = appconfig.gisResource['iserver_resource'].dataService
        this.dataServiceUrl = url
        this.dataSource = dataSource
        this.dataSetInfo = info || dataSetInfo // 默认加载全部
        this.featureService = new FeatureService(this.dataServiceUrl)
    }

    // 空间查询
    spaceQuery(queryFeature) {
        if (!(queryFeature instanceof Feature)) {
            queryFeature = new GeoJSON().readFeature(queryFeature)
        } else if (queryFeature.getGeometry() instanceof Circle) {
            // 空间查询 不支持圆, 把圆转换为 buffer / polygon
            let center = queryFeature.getGeometry().getCenter()
            let radius = queryFeature.getGeometry().getRadius()
            let dis = olSphere.getLength(new LineString([center, [center[0] + radius, center[1]]]), { projection: this.projection })
            queryFeature = new GeoJSON().readFeature(turf.buffer(turf.point(center), dis / 1000, { units: 'kilometers' }))
        }
        let queryPromises = this.dataSetInfo.map(info => {
            let layerName = info.label
            let attachName = info.attachName
            let tableName = info.name
            return new Promise(resolve => {
                let params = new SuperMap.GetFeaturesByGeometryParameters({
                    toIndex: -1,
                    maxFeatures: this.maxFeatures,
                    datasetNames: [this.dataSource + ':' + info.name],
                    geometry: queryFeature.getGeometry(),
                    spatialQueryMode: this.spatialQueryMode["INTERSECT"] // 相交空间查询模式
                })
                this.featureService.getFeaturesByGeometry(params, result => {
                    if (result.type == "processFailed") resolve(null);
                    else {
                        result.layerName = layerName
                        result.attachName = attachName
                        result.tableName = tableName
                        resolve(result)
                    };
                })
            })
        })
        return Promise.all(queryPromises)
    }

    // 属性查询
    sqlQuery(sqlStr, maxFeatures?) {
        maxFeatures = maxFeatures || this.maxFeatures
        // console.log("sql过滤条件", sqlStr)
        let queryPromises = this.dataSetInfo.map(info => {
            let layerName = info.label
            let tableName = info.name
            return new Promise(resolve => {
                let params = new SuperMap.GetFeaturesBySQLParameters({
                    maxFeatures: this.maxFeatures,
                    toIndex: -1,
                    datasetNames: [this.dataSource + ':' + info.name],
                    queryParameter: { attributeFilter: sqlStr }
                })
                this.featureService.getFeaturesBySQL(params, result => {
                    if (result.type == "processFailed") resolve(null);
                    else {
                        result.layerName = layerName
                        result.tableName = tableName
                        resolve(result)
                    };
                })
            })
        })
        return Promise.all(queryPromises)
    }

    boundsQuery(bounds) {

    }

    // 缓冲区查询
    bufferQuery(bufferFeature, bufferDis) {
        if (!(bufferFeature instanceof Feature)) {
            bufferFeature = new GeoJSON().readFeature(bufferFeature)
        } else if (bufferFeature.getGeometry() instanceof Circle) {
            // 超图查询 不支持圆, 把圆转换为点 buffer
            let center = bufferFeature.getGeometry().getCenter()
            let radius = bufferFeature.getGeometry().getRadius()
            let dis = olSphere.getLength(new LineString([center, [center[0] + radius, center[1]]]), { projection: this.projection })
            bufferFeature = new GeoJSON().readFeature(turf.buffer(turf.point(center), dis / 1000, { units: 'kilometers' }))
        }
        let queryPromises = this.dataSetInfo.map(info => {
            let layerName = info.name
            return new Promise(resolve => {
                let params = new SuperMap.GetFeaturesByBufferParameters({
                    bufferDistance: bufferDis,
                    geometry: bufferFeature.getGeometry(),
                    datasetNames: [this.dataSource + ':' + info.name],
                    maxFeatures: 1e3
                })
                this.featureService.getFeaturesByBuffer(params, result => {
                    if (result.type == "processFailed") resolve(null);
                    else {
                        result.layerName = layerName
                        resolve(result)
                    };
                })
            })
        })
        return Promise.all(queryPromises)
    }

    // 字段查询
    getServerFields(dataSet) {
        return new Promise(resolve => {
            // 设置数据集，数据源
            var param = new SuperMap.FieldParameters({
                datasource: this.dataSource,
                dataset: dataSet
            });
            // 创建字段查询实例
            new FieldService(this.dataServiceUrl).getFields(param, serviceResult => {
                if (serviceResult.type === "processFailed") resolve(null)
                else resolve(serviceResult.result.fieldNames)
            });
        })
    }
}