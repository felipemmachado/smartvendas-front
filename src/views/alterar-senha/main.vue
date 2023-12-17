<template>
  <div :class="{ 'bg-white': !$q.dark.isActive }">
    <q-layout>
      <q-page-container>
        <q-page class="window-height window-width row justify-center items-center">
          <div class="column">
            <div class="row">
              <div class="q-gutter-m d" style="min-width: 300px;">
                <div class="text-center animated fadeIn">
                  <img v-if="!$q.dark.isActive" class="animated q-mb-xl fadeIn" style="width: 18em"
                    src="../../assets/imagens/logo_sistema.png" />
                  <img v-if="$q.dark.isActive" class="animated q-mb-xl fadeIn" style="width: 18em"
                    src="../../assets/imagens/logo_negativa.png" />
                  <p class="animated text-center text-h5 q-mb-lg">
                    {{ sessao.nome.split(' ')[0] }},
                  </p>

                  <p class="animated text-center text-h7 q-mb-lg">
                    é necessário alterar a sua senha atual.
                  </p>
                  <app-resetar-senha redireciona="menu" @alterou-senha="sair" />
                </div>
              </div>
            </div>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import {
  QLayout,
  QPageContainer,
  QPage,
} from 'quasar'
import AppResetarSenha from '../../components/resetar-senha/main.vue'

export default {

  components: {
    AppResetarSenha,
    QLayout,
    QPageContainer,
    QPage,
  },

  computed: {
    ...mapState({
      sessao: (state) => state.sessao.user,
      config: (state) => state.sessao.config,
    }),
  },

  mounted() {
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
