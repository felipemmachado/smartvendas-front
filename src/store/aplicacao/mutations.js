export default {
  SET_USUARIOS(state, list) {
    state.usuarios = list
  },
  DELETE_USUARIO(state, id) {
    const indexUser = state.usuarios.findIndex((x) => x.id === id)
    if (indexUser > -1) {
      state.usuarios.splice(indexUser, 1)
    }
  },
  UPDATE_USUARIO(state, user) {
    const indexUser = state.usuarios.findIndex((x) => x.id === user.id)
    if (indexUser > -1) {
      state.usuarios[indexUser] = user
    } else {
      state.usuarios.push(user)
    }
  },
  SET_UNIDADES(state, list) {
    state.unidades = list
  },

  SET_AJUSTES(state, ajustes) {
    state.ajustes = ajustes
  },
}
