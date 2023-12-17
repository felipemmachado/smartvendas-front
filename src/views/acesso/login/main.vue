<template>
  <div style="width:100%; padding: 0em 2em">

    <div v-if="!resetarSenha">
      <p class="animated text-center text-h5">
        Bem-vindo
      </p>

      <p class="animated text-center text-h7 q-mb-lg">
        Digite seu login e senha para acessar o smart vendas.
      </p>

      <app-form :entrando="entrando" @login="efatuarLogin" />
    </div>

    <div v-if="resetarSenha">
      <p class="animated text-center text-h5 q-mb-lg">
        {{sessao.nome.split(' ')[0]}},
      </p>

      <p class="animated text-center text-h7 q-mb-lg">
        é necessário alterar a sua senha atual.
      </p>

      <app-resetar-senha
        :exibeSenhaAtual="false"
        :senhaAtual="senha"
        @alterou-senha="reLogin" />
    </div>
    <div class="q-mt-lg">
      <div><small>Version: {{versao}}</small></div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { retornaPorLoginSenha } from '../../../services/usuario'
import appForm from './form.vue'
import local from '../../../configs/local-storage'
import AppResetarSenha from '../../../components/resetar-senha/main.vue'

export default {

  components: {
    appForm,
    AppResetarSenha,
  },

  props: {
    urlCliente: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      login: '',
      senha: '',
      entrando: false,
      url: '',
      versao: '',
      error: false,
      resetarSenha: false,
      validando: false,
      rota: undefined,
    }
  },

  computed: {
    ...mapState({
      sessao: (state) => state.sessao.user,
      config: (state) => state.sessao.config,
    }),
  },

  mounted() {
    this.versao = process.env.VUE_APP_VERSION
    this.rota = this.$route.query.url

    const data = JSON.parse(sessionStorage.getItem(local.localSessaoExpriada))
    if (data) {
      this.rota = data.url
      this.$q.notify({
        type: 'negative',
        position: 'top',
        multiLine: true,
        message: 'Sessão Expirada.',
      })

      sessionStorage.removeItem(local.localSessaoExpriada)
    }
  },
  methods: {
    ...mapActions(['setSession', 'setConfig']),

    reLogin(novaSenha) {
      this.entrando = true
      this.resetarSenha = false

      setTimeout(() => {
        this.efatuarLogin(this.login, novaSenha)
      }, 3000)
    },

    async efatuarLogin(login, senha) {
      this.login = login
      this.senha = senha
      this.entrando = true

      const retorno = await retornaPorLoginSenha(login, senha)
      this.entrando = false
      if (retorno.success) {
        this.setConfig(retorno.data.clienteAplicacao)
        this.setSession(retorno.data)

        // tem q alterar a senha
        if (this.sessao.alterar_senha === 'True') {
          this.resetarSenha = true
        } else if (typeof this.rota !== 'undefined') {
          window.location.replace(this.rota)
        } else if (retorno.data.homePage === '') {
          this.$router.push({ name: 'menu' }).catch(() => {})
        } else {
          this.$router.push({ name: retorno.data.homePage }).catch(() => {})
        }
      } else {
        this.$q.notify({
          type: 'negative',
          position: 'top',
          multiLine: true,
          message: 'Usuário ou senha inválido.',
        })
      }
    },
  },
}
</script>

<style lang="scss">
.btn-entrar {
  padding: .1em 5em;
  margin-bottom: 3em;
}

.nao-conta {
  margin-bottom: .4em;
  font-weight: 500;
}

h6 {
  padding:0;
  margin:0;
  margin-bottom: 1em;
  font-weight: 700;
  font-weight: 600;
  margin-bottom: .9em;
  line-height: 1.3em;
  font-size: 1.6em;
}

.link {
  color: #15BC7C;
  font-weight: 500;
}

@media only screen and (max-width: 1023px) {

  .logo-mobile {
    text-align: center;
    padding-bottom: 4em;
    padding-top: 4em;

    img {
      width: 200px;
    }
  }

  .logo-desktop {
    display: none;
  }
  .logo-pc {
    display: none;
  }
}

@media only screen and (min-width: 1024px) {

  .logo-mobile {
    display: none;
  }

  .logo-desktop {
    width: 70%;
    text-align: center;
    img {
      width: 300px;
    }
  }

  .logo-pc {
    width: 30px;
    margin-bottom: .3em;
  }
}
</style>
