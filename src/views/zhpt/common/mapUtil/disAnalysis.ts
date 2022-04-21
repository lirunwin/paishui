import * as turf from '@turf/turf'
import * as olSphere from 'ol/sphere';
import { LineString } from 'ol/geom';

export default class DisAnalysisTool {
    constructor () {

    }
    // 是否相交
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
     * @param firstGeometry 管段 linegeometry
     * @param secendGeometry 管段 linegeometry
     * @param sdiameter 管径
     * @param cdiameter 管径
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
    
    // 垂直净距
    closetVcDis (firstGeometry, secendGeometry, sdiameter, cdiameter) {
        let dis = 0
        let sumDiameter = (this.formatSize(sdiameter, 0) + this.formatSize(cdiameter, 0)) / 2000
        let instersectPoint = this.isIntersect(firstGeometry, secendGeometry).features

        let fStartDeep = [],
            fEndDeep = [],
            sStartDeep = [],
            sEndDeep = []
        
        if (instersectPoint.length !== 0) {
            let crossPointOnFirDeep = this.getCrossPointDepth(firstGeometry, instersectPoint, fStartDeep, fEndDeep)
            let crossPointOnSecDeep = this.getCrossPointDepth(secendGeometry, instersectPoint, sStartDeep, sEndDeep)
            
            let clearDis = Math.abs(crossPointOnFirDeep - crossPointOnSecDeep) - sumDiameter
        } else {
            dis = 0
        }
        return dis
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

    // 最短距离 点到线段
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