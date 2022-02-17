import { login, logout } from '@/api/user'
import { getToken, setToken, removeToken, setSessionStorage, removeSessionStorage } from '@/utils/auth'
import { imageByName } from '@/api/ftp'
import { resetRouter } from '@/router'
const sha1Hex = require('sha1-hex')

const getDefaultState = () => {
  return {
    token: sessionStorage.getItem('token') || '',
    name: '',
    avatar: '',
    username: '',
    realName: '',
    userId: '',
    departmentId: '',
    applied: false
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_REALNAME: (state, realName) => {
    state.realName = realName
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_DEPTS: (state, departmentId) => {
    state.departmentId = departmentId
  },
  COMPLETE_APPLY: (state, payload) => {
    state.applied = payload
  }
}

const actions = {
  // user login
  login({ commit, dispatch }, userInfo) {
    const { username, password } = userInfo
    // setSessionStorage('username', username)
    return new Promise((resolve, reject) => {
      login({ 'username': username, 'password': sha1Hex(password) }).then(response => {
      // console.log('2222', response)
      // const data = {
      //   accessToken: 1111111,
      //   username: 'admin',
      //   realName: '超级管理员'
      // }
        const { accessToken, username, avatar, realName, id, departmentId } = response.result
        // const { accessToken, username, avatar, realName } = data
        // setToken(accessToken)
        commit('SET_TOKEN', accessToken)
        commit('SET_USERNAME', username)
        commit('SET_REALNAME', realName)
        commit('SET_USERID', id)
        commit('SET_DEPTS', departmentId)
        setSessionStorage('token', accessToken)
        setSessionStorage('username', username)
        setSessionStorage('realName', realName)
        setSessionStorage('userId', id)
        setSessionStorage('departmentId', departmentId)
        if (avatar) {
          imageByName(avatar).then(res => {
            if (res.status === 200) {
              commit('SET_AVATAR', res.config.url)
              setSessionStorage('avatar', res.config.url)
            }
          })
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // set name
  // setName({ commit }, userInfo) {
  //   commit('SET_NAME', userInfo)
  // },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      const data = {
        token: state.token
      }
      logout(data).then(() => {
        // removeToken() // must remove  token  first
        removeSessionStorage('token')
        removeSessionStorage('username')
        removeSessionStorage('avatar')
        removeSessionStorage('realName')
        removeSessionStorage('userId')
        removeSessionStorage('departmentId')
        removeSessionStorage('last-route')
        resetRouter()
        commit('RESET_STATE')
        dispatch('tagsView/loginOutdel', {}, { root: true }) // 调用tagsView中的清空
        dispatch('routeSetting/loginOutdel', {}, { root: true }) // 调用tagsView中的清空
        resolve({})
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      // removeToken() // must remove  token  first
      removeSessionStorage('token')
      removeSessionStorage('avatar')
      removeSessionStorage('username')
      removeSessionStorage('realName')
      removeSessionStorage('userId')
      removeSessionStorage('departmentId')
      removeSessionStorage('last-route')
      commit('RESET_STATE')
      resolve({})
    })
  },

  // 账号申请
  finnishApply({ commit }, status) {
    commit('COMPLETE_APPLY', status)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

