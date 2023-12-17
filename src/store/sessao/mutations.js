import jwt from 'jwt-decode'
import storage from '../../configs/local-storage'

export default {
  SET_SESSION(state, data) {
    if (data == null) {
      sessionStorage.removeItem(storage.localSessao)
      state.user = null
    } else {
      const dados = jwt(data.token)
      const user = {
        token: data.token,
        alterar_senha: dados.alterar_senha,
        id: dados.id,
        nome: dados.nome,
        login: dados.login,
        id_aplicacao: dados.id_aplicacao,
        unidade: dados.unidade,
        perfil: dados.role,
        aplicacao: dados.aplicacao,
        unidades: data.unidades,
        unidadeAtual: data.unidades[0],
      }

      // se existir a unidade atual, sobre escreve a atual
      if (typeof data.unidadeAtual !== 'undefined') {
        if (data.unidadeAtual !== null) {
          user.unidadeAtual = data.unidadeAtual
        }
      }

      state.user = user

      const string = JSON.stringify(user)
      sessionStorage.setItem(storage.localSessao, string)
    }
  },

  SET_UNIDADE(state, config) {
    state.user.unidadeAtual = config
    const string = JSON.stringify(state.user)
    sessionStorage.setItem(storage.localSessao, string)
  },

  SET_CONFIG(state, config) {
    const string = JSON.stringify(config)
    localStorage.setItem(storage.localConfig, string)
    state.config = config
  },

  SET_THEME(state, theme) {
    const string = JSON.stringify(theme)
    localStorage.setItem(storage.localTheme, string)
    state.theme = theme
  },
}
