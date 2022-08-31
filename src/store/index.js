import { createStore } from 'vuex'

export default createStore({
  state: {
    user: {}
  },
  getters: {
    user: state => state.user,
  },
  mutations: {
    setUser (state, user){
      console.log('mutateuser', user);
      state.user = user
    }
  },
  actions: {
    setUser (context, user){
      console.log('setuser', user);
      context.commit('setUser', user)
    }
  },
  modules: {
  }
})
