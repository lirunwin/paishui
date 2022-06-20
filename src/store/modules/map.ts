function delOne(arr, str) {
  let index = 0
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].com === str) {
      index = i
    }
  }
  arr.splice(index, 1)
  return arr
}

function some(arr, str) {
  const result = arr.some((item) => {
    if (item.com === str) {
      return true
    }
  })
  return result
}

const getDefaultState = (): dStore.map.state => {
  return {
    panels: [],
    fullPanels: [],
    halfPanels: [],
    floatPanels: [],
    fullP_editableTabsValue: '',
    halfP_editableTabsValue: '',
    floatP_editableTabsValue: '',
    P_editableTabsValue: '',
    isMapLoading: true
  }
}

const state = getDefaultState()

const mutations = {
  SET_FUN: (state: dStore.map.state, data) => {
    state.P_editableTabsValue = data.com
    // if (!some(state.panels, data.com)) {
    //   state.panels.unshift(data)
    // }
    let panel = state.panels.findIndex((item) => item.com === data.com)
    let changePanel = null
    if (panel !== -1) {
      // 有这个元素 调整位置到第一个
      changePanel = state.panels[panel]
      state.panels.splice(panel, 1)
      state.panels.unshift(changePanel)
      panel = null
      changePanel = null
    } else {
      //没有这个元素 直接放到第一个
      state.panels.unshift(data)
    }
  },
  SET_FULLPALL: (state: dStore.map.state, data) => {
    // console.log('22322', some(state.fullPanels, data.com), data)
    state.fullP_editableTabsValue = data.com
    state.fullPanels = [...state.fullPanels.filter((item) => item.com !== data.com), data]
    // if (!some(state.fullPanels, data.com)) {
    //   state.fullPanels.push(data)

    // }
  },
  SET_BOX: (state: dStore.map.state, data) => {
    state.halfP_editableTabsValue = data.com
    if (!some(state.halfPanels, data.com)) {
      state.halfPanels.push(data)
    } else {
      state.halfPanels = state.halfPanels.slice()
    }
  },
  SET_FLOAT: (state: dStore.map.state, data) => {
    state.floatP_editableTabsValue = data.com
    if (!some(state.floatPanels, data.com)) {
      state.floatPanels.push(data)
    }
  },
  // SET_NO_BOX: (state:dStore.map.state, data) => {
  //   state.floatP_editableTabsValue = data.com
  //   if (!some(state.floatPanels, data.com)) {
  //     state.floatPanels.push(data)
  //   }
  // },
  DEL_FUN: (state: dStore.map.state, data) => {
    state.panels = delOne(state.panels, data)
    if (state.panels.length > 0) {
      state.P_editableTabsValue = state.panels[0].com
    }
  },
  DEL_FULLPALL: (state: dStore.map.state, data) => {
    // state.fullPanels.splice(data, 1)
    // console.log('333', delOne(state.fullPanels, data))
    state.fullPanels = delOne(state.fullPanels, data)
    if (state.fullPanels.length > 0) {
      state.fullP_editableTabsValue = state.fullPanels[state.fullPanels.length - 1].com
    }
  },
  DEL_BOX: (state: dStore.map.state, data) => {
    state.halfPanels = delOne(state.halfPanels, data.pathId)
    if (state.halfPanels.length > 0) {
      state.halfP_editableTabsValue = state.halfPanels[state.halfPanels.length - 1].com
    }
  },
  DEL_FLOAT: (state: dStore.map.state, data) => {
    state.floatPanels = delOne(state.floatPanels, data)
    if (state.floatPanels.length > 0) {
      state.floatP_editableTabsValue = state.floatPanels[state.floatPanels.length - 1].com
    }
  },
  DEL_ALLFULLPALL: (state: dStore.map.state) => {
    state.fullPanels = []
  },
  DEL_ALLFUN: (state: dStore.map.state) => {
    state.panels = []
  },
  DEL_ALLBOX: (state: dStore.map.state) => {
    state.halfPanels = []
  },
  DEL_ALLFLOAT: (state: dStore.map.state) => {
    state.floatPanels = []
  },
  CHANGE_TAB: (state: dStore.map.state, payload) => {
    let delIndex = state.panels.findIndex((index) => index.com === payload)
    let changePos = state.panels[delIndex]
    if (delIndex >= 2) {
      state.panels.splice(delIndex, 1)
      state.panels.unshift(changePos)
      delIndex = null
      changePos = null
    }
    state.P_editableTabsValue = payload
  },
  RESET_ALL: (state: dStore.map.state, payload) => {
    const newState = getDefaultState()
    Object.keys(state).forEach((key) => {
      state[key] = newState[key]
    })
  },
  LOADING: (state: dStore.map.state, payload) => {
    state.isMapLoading = payload
  }
}

const actions = {
  // 切换tab
  changeTab({ commit }, val) {
    commit('CHANGE_TAB', val)
    console.log('被切换的tab', val)
  },
  // 添加
  changeMethod({ commit, state }, value) {
    const data = {
      com: value.id || value.pathId,
      box: value.widgetid,
      title: value.label,
      param: value.param || {}
    }
    if (value.widgetid === 'Panel') {
      commit('SET_FUN', data)
    }
    if (value.widgetid === 'FullPanel') {
      commit('SET_FULLPALL', data)
    }
    if (value.widgetid === 'HalfPanel') {
      commit('SET_BOX', data)
    }
    if (value.widgetid === 'FloatPanel') {
      commit('SET_FLOAT', data)
    }
    // if (!value.widgetid) {
    //   commit('SET_NO_BOX', data)
    // }
  },
  // 删除单个
  handelClose({ commit, state }, data) {
    // commit('DEL_FUN', data)
    // console.log('32222', data)

    if (data.box === 'Panel') {
      // getIndex(state.panels, data.title)
      commit('DEL_FUN', data)
    }
    if (data.box === 'FullPanel') {
      commit('DEL_FULLPALL', data)
    }
    if (data.box === 'HalfPanel') {
      commit('DEL_BOX', data)
    }
    if (data.box === 'FloatPanel') {
      commit('DEL_FLOAT', data)
    }
  },
  // 删除单个fullpanel
  delFullPanels({ commit }, data) {
    commit('DEL_FULLPALL', data)
  },
  // 删除单个halfpanel
  delHalfPanels({ commit }, data) {
    commit('DEL_BOX', data)
  },
  // 删除单个panel
  delPanels({ commit }, data) {
    commit('DEL_FUN', data)
  },
  // 删除单个floatpanel
  delFloatPanels({ commit }, data) {
    commit('DEL_FLOAT', data)
  },
  // 删除全部fullpanel
  delAllFull({ commit }) {
    commit('DEL_ALLFULLPALL')
  },
  // 删除全部halfpanel
  delAllHalf({ commit }) {
    commit('DEL_ALLBOX')
  },
  // 删除全部panel
  delAllPanel({ commit }) {
    commit('DEL_ALLFUN')
  },
  // 删除全部panel
  delAllFloat({ commit }) {
    commit('DEL_ALLFLOAT')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
