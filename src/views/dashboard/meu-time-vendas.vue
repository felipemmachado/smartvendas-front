<template>
  <div>

    <app-cabecalho-dashboard @carrega-dashboard="carregaDashboard" />

    <app-carregando v-if="carregando" tipo="dashboard" class="q-mt-md" cls="text-center" />

    <app-contador v-if="!carregando"
                  :borderColor="$q.dark.isActive ? '#333' : '#BBB'"
                  class="q-mt-md"
                  :item="item" />

  </div>
</template>

<script>
import { dashboardCoordenador } from '../../services/venda-agenda'
import AppContador from './contador/main.vue'
import { temPermissao } from '../../util/util'
import AppCarregando from '../../components/carregando/main.vue'
import appCabecalhoDashboard from '../../components/cabecalho-dashboard/main.vue'

export default {
  components: {
    AppContador,
    AppCarregando,
    appCabecalhoDashboard,
  },
  data() {
    return {
      carregando: true,
      item: {
        agendados: 0,
        compareceram: 0,
        confirmados: 0,
        contratosFechados: 0,
        contratosNaoFechados: 0,
        faturados: 0,
        idUnidade: null,
        idUsuario: null,
        naoCompareceram: 0,
        naoConfirmados: 0,
      },
    }
  },

  mounted() {
    if (!temPermissao('AcessarMeuTimeDeVendas')) {
      this.$router.push({ name: 'login' }).catch(() => {})
    }
  },

  methods: {
    limpa() {
      this.item.agendados = 0
      this.item.compareceram = 0
      this.item.confirmados = 0
      this.item.contratosFechados = 0
      this.item.contratosNaoFechados = 0
      this.item.faturados = 0
      this.item.naoCompareceram = 0
      this.item.naoConfirmados = 0
    },
    async carregaDashboard(inicio, fim) {
      this.carregando = true
      this.limpa()
      const dash = await dashboardCoordenador(inicio, fim)

      dash.map((d) => {
        this.item.agendados += d.agendados
        this.item.compareceram += d.compareceram
        this.item.confirmados += d.confirmados
        this.item.contratosFechados += d.contratosFechados
        this.item.contratosNaoFechados += d.contratosNaoFechados
        this.item.faturados += d.faturados
        this.item.naoCompareceram += d.naoCompareceram
        this.item.naoConfirmados += d.naoConfirmados
        return d
      })

      this.carregando = false
    },
  },
}
</script>
