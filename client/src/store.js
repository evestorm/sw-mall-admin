import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const types = {
  SET_IS_AUTHENTICATED: 'SET_IS_AUTHENTICATED', // 是否认证通过
  SET_USER: 'SET_USER' // 用户信息
}

// 定义状态
const state = {
  isAuthenticated: false, // 是否认证
  user: {} // 用户信息
}

// 获取状态
const getters = {
  isAuthenticated: state => state.isAuthenticated,
  user: state => state.user
}

// 设置状态
const mutations = {
  [types.SET_IS_AUTHENTICATED](state, isAuthenticated) {
    // 如果调用该方法传递的认证结果为真，则设置 isAuthenticated 为true，否则为false
    state.isAuthenticated = isAuthenticated
  },

  [types.SET_USER](state, user) {
    state.user = user || {}
  }
}

// 异步调用更改状态的 mutations
const actions = {
  setAuthenticated({ commit }, isAuthenticated) {
    commit(types.SET_IS_AUTHENTICATED, isAuthenticated)
  },

  setUser({ commit }, user) {
    commit(types.SET_USER, user)
  },

  clearCurrentState: ({ commit }) => {
    commit(types.SET_IS_AUTHENTICATED, false)
    commit(types.SET_USER, null)
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
