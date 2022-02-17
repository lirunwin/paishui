const state = {
  formModel: {}
}
const mutations = {
  SET_FORM: (state, payload) => {
    state.formModel = payload
  }
}
export default {
  namespaced: true,
  state,
  mutations
}