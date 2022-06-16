import { appconfig } from 'staticPub/config'
import { getTreeSourceList } from '@/api/base'
const state = {
  view: null,
  evts: [],
  mapExtent: [],
  map: null,
  activeSideItem: '', // 侧边栏当前项
  activeHeaderItem: '', // 导航栏当前项
  appconfig: null,//地图服务配置
  // 保存一些业务数据,方便与其他组件交互
  pipeId: null,
}

const mutations = {
  pushEvts(state, evt) {
    //    state.evts.push(evt);
    alert('push')
  },
  destroyEvts(state) {
    //  state.evts.forEach(obj => {
    //         obj();
    //    });
    //    state.evts=[];
    alert('destory')
  },
  updateMapSize (state) {
    setTimeout(() => {
      state.map.updateSize()
    }, 500)
  },
  SET_GISSOURCE(state, payload) {
    state.appconfig = payload
  }
}

const actions = {
  updateSize ({ commit }) {
    commit('updateMapSize')
  },
  registerEvents({ commit, state, dispatch }, evt) {
    commit('pushEvts', evt)
  },
  destroyEvents({ commit, state, dispatch }) {
    commit('destroyEvts')
  },
  initGISResource({ commit }) {
    return new Promise((resolve, reject) => {
      let resource = appconfig.gisResource['iserver_resource'];
      if (appconfig.isloadServer) {
        this.loadText = '服务加载中'
        getTreeSourceList().then((res1) => {
          if (res1.code == 1) {
            const res = res1.result;
            //通过访问天地图地址判断是否可以连接外网,先获取编码isOnlineAddress下的外网地址
            let onlineIndex = res.findIndex((item) => item.code == 'isOnlineAddress')
            let isOnline = true
            // 服务配置名称
            const MAP_CONFIG = { 
              mapService: '地图配置服务', 
              layerService: '图层服务', 
              dataService: '数据服务',
              analysisService: '分析服务'
            }
            // 替换服务
            const repItems = [MAP_CONFIG.mapService, MAP_CONFIG.layerService, MAP_CONFIG.dataService]
            res.forEach((service) => {
              let resData = service.child,
                source = null
              if (repItems.includes(service.name) && resData && resData.length !== 0) {
                if (service.name === MAP_CONFIG.layerService) {
                  source = resource.layerService.layers
                  console.log('图层服务配置')
                  resData.forEach((data) => {
                    let findItem = source.find(sourceItem => {
                      if (sourceItem.name.includes('底图')) {
                        return data.name === (isOnline ? sourceItem.name : '离线' + sourceItem.name)
                      } else {
                        return data.name === sourceItem.name
                      }
                    })
                    if (findItem) {
                      findItem.url = data.cval
                    }
                  })
                } else if (service.name === MAP_CONFIG.mapService) {
                  source = appconfig
                  resData.forEach((item) => {
                    if (item.ckey === 'center') {
                      source.initCenter = item.cval.split(',')
                    } else if (item.ckey === 'zoom') {
                      source.initZoom = item.cval
                    }
                  })
                } else if (service.name === '网络分析服务') {
                  source = resource.netAnalysisService
                  source.url = resData[0].cval
                } else if (service.name === MAP_CONFIG.dataService) {
                  source = resource.dataService
                  source.url = resData[0].cval
                }
              }
            })
            var onlineAppconfig = JSON.parse(JSON.stringify(appconfig));
            commit('SET_GISSOURCE', onlineAppconfig);
            resolve(onlineAppconfig)
          } else {
            console.log('服务加载失败 启用默认服务配置')
            reject(res1)
          }
        })
      } else {
        commit('SET_GISSOURCE', appconfig);
        resolve(appconfig)
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
