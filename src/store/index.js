import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import getters from './getters'
import errorLog from './modules/errorLog'
import user from './modules/user'


Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    errorLog
  },
  getters
})

export default store
