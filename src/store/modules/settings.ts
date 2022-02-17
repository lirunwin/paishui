import defaultSettings from '@/settings'

const {
  showSettings,
  fixedHeader,
  sidebarLogo,
  tagsView,
  navBar,
  showHeader,
  systemSettingsBtn,
  systemSwitchingBtn,
  settings,
  sysTitle
} = defaultSettings

const state = {
  showSettings: showSettings,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  tagsView: tagsView,
  navBar: navBar,
  showHeader: showHeader,
  systemSettingsBtn: systemSettingsBtn,
  systemSwitchingBtn: systemSwitchingBtn,
  settings: settings,
  sysTitle: sysTitle,
  theme: '#2D74E7'
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // console.log(key, value)
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

