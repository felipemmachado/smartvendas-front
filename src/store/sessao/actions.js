import { Dark } from 'quasar'
import theme from '../../configs/theme'

export default {
  setSession(context, payload) {
    context.commit('SET_SESSION', payload)
  },

  setConfig(context, payload) {
    context.commit('SET_CONFIG', payload)
  },

  setTheme(context, payload) {
    context.commit('SET_THEME', payload)
    Dark.set(payload.value)
    if (payload.value === true) {
      theme.dark()
    } else {
      theme.light()
    }
  },

  setUnidade(context, payload) {
    context.commit('SET_UNIDADE', payload)
  },
}
