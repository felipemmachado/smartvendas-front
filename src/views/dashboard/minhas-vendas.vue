<template>
  <div>

    <app-cabecalho-dashboard @carrega-dashboard="carregaDashboard" />

    <app-carregando v-if="carregando" tipo="dashboard" class="q-mt-md" cls="text-center" />

    <app-contador v-if="!carregando && item != ''"
                  :borderColor="$q.dark.isActive ? '#333' : '#BBB'"
                  class="q-mt-md"
                  :item="item" />
  </div>
</template>

<script>
import { dashboardUsuario } from '../../services/venda-agenda'
import AppContador from './contador/main.vue'
import AppCarregando from '../../components/carregando/main.vue'
import AppCabecalhoDashboard from '../../components/cabecalho-dashboard/main.vue'
import { dashboardPadrao } from '../../util/util'

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

  methods: {
    async carregaDashboard(inicio, fim) {
      this.carregando = true
      const dash = await dashboardUsuario(inicio, fim)
      if (dash === '') this.item = dashboardPadrao
      else this.item = dash
      this.carregando = false
    },
  },
}
</script>
