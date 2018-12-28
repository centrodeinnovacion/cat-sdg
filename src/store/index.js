import Vue from 'vue'
import Vuex from 'vuex'

import user from '@/store/user'
import colombia from '@/store/colombia/colombia.json'
import participante from '@/store/participante'
import app from '@/store/app'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    awesome: true,
    colombia: colombia
  },
  modules: {
    user,
    participante,
    app
  }
})

export default store
