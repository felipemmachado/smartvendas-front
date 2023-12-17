<template>
  <div>

    <app-cabecalho-dashboard :exibirUsuario="true" @carrega-dashboard="carregaDashboard" />

    <app-carregando v-if="carregando" tipo="dashboard" class="q-mt-md" cls="text-center" />

    <app-contador v-if="item !==  null"
                  :borderColor="$q.dark.isActive ? '#333' : '#BBB'"
                  class="q-mt-md"
                  :item="item" />
  </div>
</template>

<script>
import { dashboardUsuarioDiretoria } from '../../services/venda-agenda'
import AppContador from './contador/main.vue'
import { temPermissao, dashboardPadrao } from '../../util/util'
import AppCarregando from '../../components/carregando/main.vue'
import AppCabecalhoDashboard from '../../components/cabecalho-dashboard/main.vue'

export default {
  components: {
    AppContador,
    AppCabecalhoDashboard,
    AppCarregando,
  },
  data() {
    return {
      item: null,
      carregando: false,
    }
  },

  mounted() {
    if (!temPermissao('AcessarDashboardDiretoria')) {
      this.$router.push({ name: 'login' }).catch(() => {})
    }
  },

  methods: {

    async carregaDashboard(inicio, fim, _idUnidade, idUsuario) {
      if (idUsuario) {
        this.carregando = true
        this.item = null
        const dash = await dashboardUsuarioDiretoria(idUsuario, inicio, fim)
        if (dash === '') this.item = dashboardPadrao
        else this.item = dash
        this.carregando = false
      }
    },
  },
}
</script>
