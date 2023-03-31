import { createStore } from 'vuex'

export default createStore({
  state: {
    user: {},
    loading: false,
    notification: '',
    player: {},
  },
  getters: {
    user: state => state.user,
    loading: state => state.loading,
    notification: state => state.notification,
    playerSource: state => state.player,
  },
  mutations: {
    setUser (state, user){
      state.user = user
    },
    setLoading (state, loading){
      state.loading = loading
    },
    setPlayerSource (state, player){
      state.player = player
    },
    togglePlayback (state){
      const newStatus = state.player.status === 'play' ? 'paused' : 'play';
      state.player.status = newStatus;
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
