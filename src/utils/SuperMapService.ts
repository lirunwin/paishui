import { SuperMap } from '@supermap/iclient-common'
/**
 * @description 该公共类包含针对超图iserver的数据查询以及地图服务查询等功能
 * @author 李顺<876330731@qq.com>
 */
class SuperMapService {
    /**
     * 生成超图iserver点
     * @param point [经度，纬度]
     * @returns 
     */
    static convertPoint(point):SuperMap.Geometry.Point {
        if (!point) {
            return undefined;
        }
        var lng = point[0];
        var lat = point[1]
        if (lng && lng) {
            return new SuperMap.Geometry.Point(lng, lat);
        }
        return undefined;
    }
    /**
     * 生成超图iserver线
     */
    static convertPolyline(polyline:number[][]):SuperMap.Geometry.LineString {
        if (!polyline) {
            throw undefined;
        }
        var points = polyline;
        if (points && points instanceof Array && points.length >= 2) {
            var arr = [];
            for (var i = 0, j = points.length; i < j; i++) {
                var point = this.convertPoint(points[i]);
                if (point) {
                    arr.push(point);
                }
            }
            return new SuperMap.Geometry.LineString(arr);
        }
        return undefined;
    }
    /**
     * 生成超图iserver面
     * @param polygon 
     * @returns 
     */
    static convertPolygon(polygon:number[][][]):SuperMap.Geometry.Polygon {
        if (!polygon) {
            throw undefined;
        }
        var points = polygon[0];
        if (points && points instanceof Array && points.length >= 3) {
            var arr = [];
            for (var i = 0, j = points.length; i < j; i++) {
                var point = this.convertPoint(points[i]);
                if (point) {
                    arr.push(point);
                }
            }
            var linearRing = new SuperMap.Geometry.LinearRing(arr);
            return new SuperMap.Geometry.Polygon(linearRing);
        }
        return undefined;
    }
    /**
     * 该方法用于使用地图服务获取图层字段集
     * @param options 
     * @param options.url 服务地址
     * @param options.layer 图层名字，"数据集名称@数据源名称"
     */
    static getLayerFields(options: {
        url: string,
        layer: string,
    }): Promise<any> {
        return new Promise((resolve, reject) => {
            const filter = new SuperMap.FilterParameter({
                name: options.layer,
                attributeFilter: "1=2"
            })
            const parames = new SuperMap.QueryBySQLParameters({
                queryParams: [filter]
            })
            const sqlService = new SuperMap.QueryBySQLService(options.url, {
                eventListeners: {
                    processCompleted: (result) => {
                        resolve(result)
                    },
                    processFailed: (err) => {
                        reject(err);
                    }
                }
            });
            sqlService.processAsync(parames);
        })
    }
    /**
     * 该方法用于获取图层字段唯一值（地图服务）
     * @param options 
     * @param options.url 服务地址
     * @param options.layer 图层名，"数据集名称@数据源名称"
     * @param options.uniqueField 唯一值字段
     */
    static getFieldUniqueValue(options: {
        url: string,
        layer: string,
        uniqueField: string
    }): Promise<any> {
        return new Promise((resolve, reject) => {
            const filterParams = new SuperMap.FilterParameter({
                name: options.layer,
                attributeFilter: "1=1",
                fields: [options.uniqueField],
                groupBy: options.uniqueField
            });
            const sqlParams = new SuperMap.QueryBySQLParameters({
                queryParams: [filterParams],
                queryOption: SuperMap.QueryOption.ATTRIBUTE,
                returnContent: true
            });
            const sqlService = new SuperMap.QueryBySQLService(options.url, {
                eventListeners: {
                    processCompleted: (result) => {
                        resolve(result);
                    },
                    processFailed: (err) => {
                        reject(err);
                    }
                }
            });
            sqlService.processAsync(sqlParams);
        })
    }
    /**
     * 空间查询、属性查询（地图服务）
     * @param options 
     * @param options.url 服务地址
     * @param options.datasetNames 图层名称
     * @param options.geometry 查询范围
     * @param options.whereclause 查询条件
     * @param options.groupBy 分组
     * @param options.orderBy 排序
     * @param options.queryOption 空间结果，包含图形或者不包含
     * @param options.spatialMode 空间查询算法
     * @param options.fields 字段
     */
    static queryByMapService(options: {
        url: string,
        datasetNames: string[],
        geometry?: SuperMap.Geometry.Polygon,
        whereclause?: string,
        groupBy?: string,
        orderBy?: string,
        queryOption?: SuperMap.QueryOption,
        spatialMode?: SuperMap.SpatialQueryMode
        fields?: string[]
    }) {
        return new Promise((resolve, reject) => {
            let filterParams = [];
            filterParams = options.datasetNames.map(item => {
                return new SuperMap.FilterParameter({
                    name: item,
                    attributeFilter: options.whereclause,
                    groupBy: options.groupBy,
                    orderBy: options.orderBy,
                    fields: options.fields
                });
            });
            let geoParams = null;
            let queryService = null;
            if (options.geometry) {
                geoParams = new SuperMap.QueryByGeometryParameters({
                    geometry: options.geometry,
                    queryParams: filterParams,
                    returnContent: true,
                    spatialQueryMode: !options.spatialMode ? SuperMap.SpatialQueryMode.INTERSECT : options.spatialMode,
                    queryOption: !options.queryOption ? SuperMap.QueryOption.ATTRIBUTEANDGEOMETRY : options.queryOption
                });
                queryService = new SuperMap.QueryByGeometryService(options.url, {
                    eventListeners: {
                        processCompleted: (result) => {
                            resolve(result);
                        },
                        processFailed: (err) => {
                            reject(err);
                        }
                    }
                });
            } else {
                geoParams = new SuperMap.QueryBySQLParameters({
                    queryParams: filterParams,
                    queryOption: !options.queryOption ? SuperMap.QueryOption.ATTRIBUTEANDGEOMETRY : options.queryOption
                });
                queryService = new SuperMap.QueryBySQLService(options.url, {
                    eventListeners: {
                        processCompleted: (result) => {
                            resolve(result);
                        },
                        processFailed: (err) => {
                            reject(err);
                        }
                    }
                });
            }
            queryService.processAsync(geoParams);
        })
    }
}
export default SuperMapService;