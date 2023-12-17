export default {
  setUsuarios(context, payload) {
    context.commit('SET_USUARIOS', payload)
  },
  deleteUsuario(context, payload) {
    context.commit('DELETE_USUARIO', payload)
  },
  updateUsuario(context, payload) {
    context.commit('UPDATE_USUARIO', payload)
  },
  setUnidades(context, payload) {
    context.commit('SET_UNIDADES', payload)
  },
  setAjustes(context, payload) {
    context.commit('SET_AJUSTES', payload)
  },
}
