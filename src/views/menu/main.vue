<template>
  <q-layout class="layout-container" view="lHh lpR fFf">
    <q-header
      :class="{'bg-grey-10': $q.dark.isActive, 'bg-white': !$q.dark.isActive }"
      class="header animated fadeInDown no-print">
      <div v-if="sessao" class="toolbar">
        <app-header :menus="menus"
                    :inicias="iniciasNome(sessao.nome)"
                    :nome="nomeSobrenome(sessao.nome)"
                    :login="sessao.login"
                    :rota="`${this.$route.path.split('/')[1]}`"
                    @click-menu="vaiPara"
                    @sair="sair" />
      </div>
    </q-header>

    <q-page-container class="page-container">
      <div class="page">
        <div style="width: 100%">
          <router-view />
        </div>

      </div>
    </q-page-container>

    <q-footer
      v-if="$q.platform.is.mobile"
      class="footer animated fadeInUp no-print"
      style="padding: 0"
      :class="{'bg-grey-10': $q.dark.isActive, 'bg-white': !$q.dark.isActive }">
      <app-footer
        :menus="menus"
        :rota="rotaAtual"
        @click-menu="vaiPara" />
    </q-footer>
  </q-layout>

</template>

<script>
import { mapActions, mapState } from 'vuex'
import {
  QLayout,
  QHeader,
  QPageContainer,
  QFooter,
} from 'quasar'
import { retornaTodasUnidades } from '../../services/unidade'
import { retornaAjustes } from '../../services/cliente-aplicacao'
import { nomeSobrenome, iniciasNome } from '../../util/util'
import AppHeader from './components/header.vue'
import AppFooter from './components/footer.vue'

export default {

  components: {
    AppHeader,
    AppFooter,
    QLayout,
    QHeader,
    QPageContainer,
    QFooter,
  },

  data() {
    return {
      leftDrawerOpen: false,
      rotaAtual: '',
      menus: [
        {
          icone: 'o_dashboard',
          rota: 'dashboard',
          titulo: 'Início',
          regra: '',
        },
        {
          icone: 'o_calendar_month',
          rota: 'minhas-vendas',
          titulo: 'Vendas',
          regra: 'AcessarMinhasVendas',
        },
        {
          icone: 'o_group_work',
          rota: 'meu-time-vendas',
          titulo: 'Time',
          regra: 'AcessarMeuTimeDeVendas',
        },
        {
          icone: 'o_corporate_fare',
          rota: 'unidade-vendas',
          titulo: 'Unidade',
          regra: 'AcessarVendasUnidade',
        },
        {
          icone: 'o_assessment',
          rota: 'relatorios',
          titulo: 'Relatórios',
          regra: 'AcessarRelatorios',
        },
        {
          icone: 'o_tune',
          rota: 'ajustes',
          titulo: 'Ajustes',
          regra: 'AcessarAjustesAplicacao',
        },
      ],
    }
  },

  computed: {
    ...mapState({
      sessao: (state) => state.sessao.user,
      config: (state) => state.sessao.config,
      usuarios: (state) => state.aplicacao.usuarios,
      unidades: (state) => state.aplicacao.unidades,
      ajustes: (state) => state.aplicacao.ajustes,
    }),
  },

  watch: {
    '$route.path': {
      handler(val) {
        const atualRota = `${val.split('/')[1]}`
        const index = this.menus.findIndex((p) => p.rota === atualRota)
        if (index === -1) this.rotaAtual = ''
      },
    },
  },

  async mounted() {
    // importe para carregar as logos do relatorio e msg do whasApp
    if (this.ajustes == null) {
      const ajustes = await retornaAjustes()
      this.setAjustes(ajustes)
    }

    // para popular o component de selectde unidade
    const lista = await retornaTodasUnidades()
    this.setUnidades(lista)

    this.rotaAtual = `${this.$route.path.split('/')[1]}`
  },

  methods: {
    iniciasNome(nome) { return iniciasNome(nome) },
    nomeSobrenome(nome) { return nomeSobrenome(nome) },
    ...mapActions(['setSession', 'setAjustes', 'setUsuarios', 'setUnidade', 'setUnidades']),

    vaiPara(rota) {
      this.$router.push({ name: rota }).catch(() => {})
    },

    sair() {
      this.setSession(null)
      this.setUsuarios(null)
      this.setUnidades(null)
      this.setAjustes(null)
      this.$router.push({ name: 'login' }).catch(() => {})
    },

  },
}
</script>

<style lang="scss">
@import "../../styles/quasar.variables.scss";

.toolbar-dark {
  background: #000;
}

.body-menu {
  width: 0px i !important;
}

.q-item__section--avatar {
  min-width: 40px !important;
}

@media print {
  .page-container {
    padding-left: 0px !important;
  }
}

.layout-container {
  & > .footer {
    border-top: 1px solid #DDD;
  }
  & > .header {
    display: flex;
    justify-content: center;
    border-bottom: 1px solid #DDD;

    & > .toolbar {
      height: 65px;
      display: flex;
      width: 100%;
      max-width: 1200px;
      justify-content: center;
    }
  }

  & > .page-container {
    display: flex;
    justify-content: center;
    width: 100%;

    & > .page {
      display: flex;
      width: 100%;
      max-width: 1200px;
      justify-content: flex-start;
    }
  }
}
</style>
