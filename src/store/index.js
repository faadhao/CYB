import Vue from 'vue'
import Vuex from 'vuex'
import Persistedstate from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      name: '',
      gender: '',
      id: ''
    },
    concertId: ''
  },
  mutations: {
    logout(state) {
      state.user.name = ''
      state.user.gender = ''
      state.user.id = ''
    },
    login(state, data) {
      state.user.name = data.userName
      state.user.gender = data.gender
      state.user.id = data._id
    },
    bookTicket(state, data) {
      state.concertId = data
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [Persistedstate()]
})
