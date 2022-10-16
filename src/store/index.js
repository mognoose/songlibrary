import { createStore } from 'vuex'

export default createStore({
  state: {
    user: {},
    loading: false,
    notification: ''
  },
  getters: {
    user: state => state.user,
    loading: state => state.loading,
    notification: state => state.notification,
  },
  mutations: {
    setUser (state, user){
      state.user = user
    },
    setLoading (state, loading){
      state.loading = loading
    },
    setNotification (state, notification){
      state.notification = notification
    }
  },
  actions: {
    setUser (ctx, user){
      ctx.commit('setUser', user)
    },
    setLoading (ctx, loading){
      ctx.commit('setLoading', loading)
    },
    setNotification (ctx, notification){
      ctx.commit('setNotification', notification)
    }
  },
  modules: {
  }
})
