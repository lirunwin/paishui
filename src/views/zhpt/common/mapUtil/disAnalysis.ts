import * as turf from '@turf/turf'
import * as olSphere from 'ol/sphere';
import { LineString } from 'ol/geom';
import GeoJSON from 'ol/format/GeoJSON'

export default class DisAnalysisTool {
    private Field = {
        diaMeterField: "DIAMETER", // 管径
        edeepField: "END_DEPTH", // 终点埋深
        sdeppField: "START_DEPTH" // 起点埋深
    }
    /**
     * 是否相交
     * @param firstGeometry 要素1 linegeometry
     * @param secendGeometry 要素2 linegeometry
     */
    isIntersect (firstGeometry, secendGeometry) {
        let firstLine = turf.lineString(firstGeometry.getCoordinates())
        let secondtLine = turf.lineString(secendGeometry.getCoordinates())
        let obj = turf.lineIntersect(firstLine, secondtLine)
        return {
            isIntersect: obj.features.length !== 0,
            features: obj.features
        }
    }

    /**
     * 水平净距
     * @param firstGeometry 管段要素1 linegeometry
     * @param secendGeometry 管段要素2 linegeometry
     * @param sdiameter 管径
     * @param cdiameter 比较管径
     */
    closetHzDis (firstGeometry, secendGeometry, sdiameter, cdiameter) {
        let res = {
            dis: '',
            hasDis: false
        }
        let sumDiameter = (this.formatSize(sdiameter, 0) + this.formatSize(cdiameter, 0)) / 2000
        if (!this.isIntersect(firstGeometry, secendGeometry).isIntersect) {
            let firstCoors = firstGeometry.getCoordinates()
            let secendCoors = secendGeometry.getCoordinates()
            
            let lengths = []
            // 管段1 距离 管段2 的最短距离
            firstCoors.forEach(point => {
                let length = this.minDisWithPointOnLine(point, secendCoors)
                lengths.push(length)
            })
            // 管段2 距离 管段1 的最短距离
            secendCoors.forEach(point => {
                let length = this.minDisWithPointOnLine(point, firstCoors)
                lengths.push(length)
            })
            res.dis = (Math.min.apply(null, lengths) - sumDiameter).toFixed(4)
            res.hasDis = true
        }
        return res
    }
    
    /**
     * 垂直净距
     * @param firstFeature 管段 linefeature
     * @param secendFeature 比较管段 linefeature
     */
    closetVcDis (firstFeature, secendFeature) {
        let res = { dis: "", hasDis: false }
        let firstGeometry = firstFeature.getGeometry(), 
            secendGeometry = secendFeature.getGeometry()
        let sdiameter = firstFeature.get(this.Field["diaMeterField"]),
            cdiameter = secendFeature.get(this.Field["diaMeterField"])

        let sumDiameter = (this.formatSize(sdiameter, 0) + this.formatSize(cdiameter, 0)) / 2000
        let instersectPoints = this.isIntersect(firstGeometry, secendGeometry).features

        let fStartDeep = firstFeature.get(this.Field["sdeppField"]),
            fEndDeep = firstFeature.get(this.Field["edeepField"]),
            sStartDeep = secendFeature.get(this.Field["sdeppField"]),
            sEndDeep = secendFeature.get(this.Field["edeepField"])

        if (!(sdiameter && cdiameter && fStartDeep && fEndDeep && sStartDeep && sEndDeep)) return { errorText: '数据不完整' }
        
        if (instersectPoints.length !== 0) {
            let instersectPoint = new GeoJSON().readFeature(instersectPoints[0]).getGeometry()
            let crossPointOnFirDeep = this.getCrossPointDepth(firstGeometry, instersectPoint, fStartDeep, fEndDeep)
            let crossPointOnSecDeep = this.getCrossPointDepth(secendGeometry, instersectPoint, sStartDeep, sEndDeep)
            
            res.dis = (Math.abs(crossPointOnFirDeep - crossPointOnSecDeep) - sumDiameter).toFixed(3)
            res.hasDis = true
        }
        return res
    }
    /**
     * 标准化管径
     * @param diaMeterStr 
     * @param type { 1: 垂直, 0: 水平 }
     */
    formatSize (diaMeterStr, type) {
        let diaMeter = diaMeterStr.split(/X|\*/)[type]
        return Number(diaMeter)
    }

    /**
     * 点到直线最短距离
     * @param pointCoors 点坐标
     * @param lineCoors 先做表
     */
    minDisWithPointOnLine (pointCoors, lineCoors) {
        let closestPoint = turf.nearestPointOnLine(turf.lineString(lineCoors), turf.point(pointCoors), { units: 'kilometers' });
        return olSphere.getLength(new LineString([pointCoors, closestPoint.geometry.coordinates]), { projection: "EPSG:4326" })
    }
    /**
     * 获交点深
     * @param lineWithPoint 管段
     * @param point 交点
     * @param startDeep 起点埋深
     * @param endDeep 终点埋深
     */
    getCrossPointDepth (lineWithPoint, point, startDeep, endDeep) {
        let LineCoordinates = lineWithPoint.getCoordinates(), 
            pointCoordinates = point.getCoordinates()
        let lineLength = olSphere.getLength(lineWithPoint, { projection: "EPSG:4326" })
        // 起点比终点低 使用管段起点否则用终点
        let pointLength = olSphere.getLength(new LineString([LineCoordinates[startDeep > endDeep ? 0 : 1], pointCoordinates]), { projection: "EPSG:4326" })
        
        let crossPointEva = 0
        if (lineLength) {
            crossPointEva = (pointLength / lineLength) * Math.abs((startDeep - endDeep));
        }
        return Math.max.apply(null, [startDeep, endDeep]) - crossPointEva
    }
}