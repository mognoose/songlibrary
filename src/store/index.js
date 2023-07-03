import { createStore } from 'vuex'

export default createStore({
  state: {
    user: {},
    loading: false,
    notification: '',
    player: {},
    activeTuning: process.env.VUE_APP_DEFAULT_TUNE || 0,
  },
  getters: {
    user: state => state.user,
    loading: state => state.loading,
    notification: state => state.notification,
    playerSource: state => state.player,
    activeTuning: state => state.activeTuning,
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
    },
    setActiveTuning (state, activeTuning){
      state.activeTuning = activeTuning
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
    },
    setActiveTuning (ctx, activeTuning){
      ctx.commit('setActiveTuning', activeTuning)
    }
  },
  modules: {
  }
})
