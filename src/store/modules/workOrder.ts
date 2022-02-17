const state = {
  orderObj: {}
}

const mutations = {
  SETSUBMIT: (state, value) => {
    state.orderObj = value
    //？？？ ls-2022/2/16
    //@ts-ignore
    this.$route.push({ path: '' })
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
