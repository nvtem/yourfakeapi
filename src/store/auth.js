export default {
  namespaced: true,

  state: () => ({
    username: ''
  }),

  getters: {
    isLogged(state) {
      return !!state.username
    }
  },

  mutations: {
    setUsername(state, username) {
      state.username = username
    },

    setToken(state, token) {
      this._vm.$api.setToken(localStorage.token = token)
    }
  },

  actions: {
    clear({ commit }) {
      commit('setToken', '')
      commit('setUsername', '')
      this._vm.$api.setToken('')
    },

    loadData({ commit, dispatch }) {
      const token = localStorage.token

      if (token) {
        this._vm.$api.setToken(token)

        this._vm.$api.request('GET_USER_DATA')
          .then(r => {
            commit('setToken', token)
            commit('setUsername', r.data.username)
          })
          .catch(() => {
            dispatch('clear')
          })
      } else {
        dispatch('clear')
      }
    },

    async register({ commit, dispatch }, data) {
      return this._vm.$api.request('REGISTER', {}, data)
        .then(r => {
          commit('setToken', r.data.token)
          dispatch('loadData')
        })
        .catch(e => {
          throw e
        })
    },

    async login({ commit, dispatch }, data) {
      return this._vm.$api.request('LOGIN', {}, data)
        .then(r => {
          commit('setToken', r.data.token)
          dispatch('loadData')
        })
        .catch(e => {
          throw e
        })
    },

    async logout({ commit, dispatch }) {
      dispatch('clear')
    }
  }
}