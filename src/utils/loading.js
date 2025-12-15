// 載入狀態管理模組
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const loadingStore = new Vuex.Store({
  state: {
    loading: false,
    loadingText: '載入中...'
  },
  mutations: {
    setLoading(state, { loading, text = '載入中...' }) {
      state.loading = loading
      state.loadingText = text
    }
  },
  actions: {
    startLoading({ commit }, text) {
      commit('setLoading', { loading: true, text })
    },
    stopLoading({ commit }) {
      commit('setLoading', { loading: false })
    }
  }
})

// 載入狀態 Mixin，可在組件中快速使用
export const loadingMixin = {
  computed: {
    isLoading() {
      return this.$store.state.loading
    },
    loadingText() {
      return this.$store.state.loadingText
    }
  },
  methods: {
    startLoading(text = '載入中...') {
      this.$store.commit('setLoading', { loading: true, text })
    },
    stopLoading() {
      this.$store.commit('setLoading', { loading: false })
    },
    async withLoading(asyncFn, loadingText = '載入中...') {
      this.startLoading(loadingText)
      try {
        return await asyncFn()
      } finally {
        this.stopLoading()
      }
    }
  }
}

export default {
  loadingStore,
  loadingMixin
}
