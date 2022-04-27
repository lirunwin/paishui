const state = {
  view: null,
  evts: [],
  mapExtent: []
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
  }
}

const actions = {
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
