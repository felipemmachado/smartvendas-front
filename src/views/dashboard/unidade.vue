<template>
  <div>

    <app-cabecalho-dashboard :exibirUnidades="true" @carrega-dashboard="carregaDashboard" />

    <app-carregando v-if="carregando" tipo="dashboard" class="q-mt-md" cls="text-center" />

    <app-contador v-if="!carregando"
                  :borderColor="$q.dark.isActive ? '#333' : '#BBB'"
                  class="q-mt-md"
                  :item="item" />
  </div>
</template>

<script>
import { dashboardUnidade } from '../../services/venda-agenda'
import AppContador from './contador/main.vue'
import { temPermissao, dashboardPadrao } from '../../util/util'
import AppCabecalhoDashboard from '../../components/cabecalho-dashboard/main.vue'
import AppCarregando from '../../components/carregando/main.vue'

export default {
  components: {
    AppContador,
    AppCarregando,
    AppCabecalhoDashboard,
  },
  data() {
    return {
      item: null,
      carregando: true,
    }
  },

  mounted() {
    if (!temPermissao('AcessarDashboardUnidade')) {
      this.$router.push({ name: 'login' }).catch(() => {})
    }
  },

  methods: {
    async carregaDashboard(inicio, fim, idUnidade) {
      this.carregando = true
      const dash = await dashboardUnidade(idUnidade, inicio, fim)
      if (dash === '') this.item = dashboardPadrao
      else this.item = dash
      this.carregando = false
      this.filtrar = false
    },
  },
}
</script>
