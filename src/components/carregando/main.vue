<template>
  <div class="no-print">
    <div :class="cls">
      <div v-if="!tipo">
        <q-spinner /> {{texto}}
      </div>
      <div v-else>
        <app-dashboard v-if="tipo === 'dashboard'" />
        <app-calendario-lista v-if="tipo === 'calendario-lista-valor'" :exibirValor="true" />
        <app-calendario-lista v-if="tipo === 'calendario-lista'" :exibirValor="false" />
        <app-lista v-if="tipo === 'lista'" :height="height" />
        <app-tabela v-if="tipo === 'tabela'" />
      </div>

    </div>
  </div>
</template>

<script>
import {
  QSpinner,
} from 'quasar'
import AppDashboard from './dashboard.vue'
import AppCalendarioLista from './calendario-lista.vue'
import AppLista from './lista.vue'
import AppTabela from './tabela.vue'

export default {

  components: {
    AppLista,
    AppDashboard,
    AppCalendarioLista,
    AppTabela,
    QSpinner,
  },

  props: {
    cls: {
      required: false,
      type: String,
      default: '',
    },

    tipo: {
      type: String,
      required: false,
    },

    height: String,

    texto: {
      required: false,
      type: String,
      default: 'Carregando...',
    },
  },
}
</script>
