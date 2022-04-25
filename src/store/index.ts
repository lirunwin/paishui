import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

const modulesFiles = require.context('./modules', true, /\.ts$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})
// console.log(modules)

const state = {
  topNavState: 'home',
  leftNavState: 'home',
  jumpText: '',
  specialWidth: "480px"
}
const mutations = {
  setSpecialWidth(state, value) {
    state.specialWidth += value;
  }
}
// store.commit('increment', { amount: 10 });

const store = new Vuex.Store({
  modules,
  getters,
  mutations,
  state
})

export default store
