import Vue from 'vue'
import Vuex from 'vuex'
import sessao from './sessao/main'
import aplicacao from './aplicacao/main'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    sessao,
    aplicacao,
  },
})
