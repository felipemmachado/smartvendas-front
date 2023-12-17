<template>
  <div>
    <div class="row q-mt-md animated fadeIn fast">
      <div class="col-md-3 col-lg-3 col-xs-12"></div>
      <div class="col-md-6 col-lg-6 col-xs-12">

        <app-btn-voltar cls="q-ml-md" rota="voce" />

        <div class="text-h5 q-ml-md q-mt-md">
          <q-icon class="text-primary icone-correcao" name="o_vpn_key" />
          Alterar Senha
        </div>

        <q-card class="q-pa-md q-ma-md">
          <div class="q-pb-md">
              Ao atualizar a senha, você terá que entrar novamente no app.
          </div>

          <app-resetar-senha redireciona="menu" @alterou-senha="sair" />
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { QIcon, QCard } from 'quasar'
import AppResetarSenha from '../../../components/resetar-senha/main.vue'
import AppBtnVoltar from '../../../components/btn-voltar/main.vue'

export default {

  components: {
    AppResetarSenha,
    AppBtnVoltar,
    QIcon,
    QCard,
  },

  computed: {
    ...mapState({
      sessao: (state) => state.sessao.user,
      config: (state) => state.sessao.config,
    }),
  },

  methods: {
    ...mapActions(['setSession']),

    sair() {
      setTimeout(() => {
        this.setSession(null)
        this.$router.push({ name: 'login' }).catch(() => { })
      }, 2000)
    },
  },
}
</script>
