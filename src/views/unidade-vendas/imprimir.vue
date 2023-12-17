<template>
  <div>
    <app-btn-voltar cls="q-mt-md q-ml-md" @voltar="$emit('voltar')" />

    <q-card class="q-ma-md animated fadeIn fast">
      <q-card-section>
        <app-cabecalho-print
          :exibir="true"
          :titulo="`<div class='text-h6'>${titulo}</div>`" />
        <div class="table-responsive">
          <table class="table table-print-16px">
            <thead>
              <tr>
                <th class="td-relatorio text-left" style="width:25%">
                  Data
                </th>
                <th class="td-relatorio text-left">
                  Nome
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in agendas" :key="index">
                <td class="td-relatorio">{{item.dataFormatada}}</td>
                <td class="td-relatorio">{{item.nome}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>

import { QCard, QCardSection } from 'quasar'
import AppCabecalhoPrint from '../../components/cabecalho-print/main.vue'
import AppBtnVoltar from '../../components/btn-voltar/main.vue'

export default {

  components: {
    AppCabecalhoPrint,
    AppBtnVoltar,
    QCard,
    QCardSection,
  },

  props: {
    titulo: {
      type: String,
      required: false,
      default: 'Agendamentos',
    },
    agendas: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

  mounted() {
    setTimeout(() => {
      window.print()
    }, 1000)
  },
}
</script>
