import { Projection, addProjection, get as getProjection, transform } from 'ol/proj';
import proj4 from 'proj4'
import { register as olRegisterProj } from 'ol/proj/proj4';

export class projUtil {
    // 坐标系定义
    // TODO 自定义坐标系
    defs = {
        'EPSG:4544': 'PROJCS["CGCS2000_3_Degree_GK_CM_105E",GEOGCS["GCS_China_Geodetic_Coordinate_System_2000",DATUM["D_China_2000",SPHEROID["CGCS2000",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",105.0],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0],AUTHORITY["EPSG",4544]]',
        'EPSG:4543': 'PROJCS["CGCS2000_3_Degree_GK_CM_102E",GEOGCS["GCS_China_Geodetic_Coordinate_System_2000",DATUM["D_China_2000",SPHEROID["CGCS2000",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",102.0],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0],AUTHORITY["EPSG",4543]]',
        'EPSG:4495': 'PROJCS["CGCS2000_3_Degree_GK_CM_102E",GEOGCS["GCS_China_Geodetic_Coordinate_System_2000",DATUM["D_China_2000",SPHEROID["CGCS2000",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",99.0],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0],AUTHORITY["EPSG",4495]]'
    }

    // 坐标系 doc
    projName = {
        proj84: "EPSG:4326", // ol
        proj57: "EPSG:3857", // ol
        proj43: "EPSG:4543", // pzh
        proj95: "EPSG:4495",
        proj44: "EPSG:4544" // rs
    }

    constructor () {
        this.init()
    }

    // 初始化
    init () {
    }

    // 判断 ol 是否有该坐标
    hasProj (projName) {
        return !!this.projName[projName]
    }

    // 坐标系注册
    resgis (projNames) {
        if (!Array.isArray(projNames)) {
            projNames = [projNames]
        }
        projNames.forEach(projname => {
            let projLike = this.projName[projname]
            proj4.defs(projLike, this.defs[projLike])
            olRegisterProj(proj4);
        })
    }

    // 获取 projectionLike
    get (projName) {
        if (this.hasProj(projName)) {
            return this.projName[projName]
        }
        return ''
    }

    getAllProj () {
        return Object.keys(this.projName).map(name => this.projName[name])
    }

    // 添加坐标系
    add ({ projectName, projectLIke, def }) {
        // TODO 验证 projectLIke ，def
        this.projName[projectName] = projectLIke
        this.defs[projectLIke] = def
    }

    // 坐标转换
    transform (point, formProjName, toProjName) {
        let formProjLike = this.projName[formProjName]
        let toProjLike = this.projName[toProjName]
        // let point2 = proj4(formProjLike, toProjLike, point) // 转换结果一致
        return transform(point, formProjLike, toProjLike)
    }
}