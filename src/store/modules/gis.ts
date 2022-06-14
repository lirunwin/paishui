const state = {
  view: null,
  evts: [],
  mapExtent: [],
  map: null,
  activeSideItem: '', // 侧边栏当前项
  activeHeaderItem: '', // 导航栏当前项

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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
