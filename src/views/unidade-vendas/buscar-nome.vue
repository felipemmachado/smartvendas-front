<template>
  <div>
    <app-btn-voltar cls="q-mt-md q-ml-md" @voltar="$emit('voltar')" />

    <div class="row">
      <div class="col-xs-12 col-md-5 q-pt-md q-pl-md q-pr-md">
        <q-input v-model="nome" :error="error" error-message="Você tem que digitar um nome" label="Buscar por nome" />
      </div>

      <div class="col-xs-12 col-md-3 q-pt-md q-pl-md q-pr-md">
        <q-btn label="buscar" :loading="carregando" :disabled="carregando" :class="{ 'q-mt-lg': !$q.platform.is.mobile }"
          class="q-ml-md full-width" color="primary" @click="buscar()" />
      </div>
    </div>

    <div class="q-pt-md q-pl-md q-pr-md">
      <q-card>
        <app-carregando v-if="carregando" tipo="tabela" />
        <q-card-section v-if="lista.length > 0">
          <q-table :data="lista" :columns="columns" flat :pagination.sync="pagination" hide-bottom />

          <div class="row justify-center q-mt-md">
            <q-pagination v-model="pagination.page" direction-links color="primary" :max="pagesNumber" max-pages="7" />
          </div>
        </q-card-section>
      </q-card>
    </div>

  </div>
</template>

<script>

import dayjs from 'dayjs'
import {
  QInput, QBtn, QCard, QTable, QPagination, QCardSection,
} from 'quasar'
import { formatDateTimeSql } from '../../util/util'
import { exportar } from '../../services/venda-agenda'
import AppBtnVoltar from '../../components/btn-voltar/main.vue'
import AppCarregando from '../../components/carregando/main.vue'

export default {

  components: {
    AppBtnVoltar,
    AppCarregando,
    QInput,
    QCardSection,
    QBtn,
    QCard,
    QTable,
    QPagination,
  },

  data() {
    return {
      nome: '',
      error: false,
      carregando: false,
      lista: [],

      columns: [
        {
          name: 'nomeCliente', label: 'Paciente', align: 'left', field: (row) => row.nomeCliente, sortable: true,
        },
        {
          name: 'data',
          label: 'Agendamento',
          align: 'left',
          field: (row) => dayjs(row.dataAgendamento).format('DD/MM/YYYY HH:mm'),
          sortable: false,
        },
        {
          name: 'dataCadstro',
          label: 'Criado Em',
          align: 'left',
          field: (row) => dayjs(row.criadoEm).format('DD/MM/YYYY HH:mm'),
          sortable: false,
        },
        {
          name: 'consultor', label: 'Consultor', align: 'left', field: (row) => row.consultor, sortable: false,
        },
        {
          name: 'unidade', label: 'Unidade', align: 'left', field: (row) => row.unidade, sortable: false,
        },
        {
          name: 'enceerrado', label: 'Encerrado Por', align: 'left', field: (row) => row.encerradoPor, sortable: false,
        },
        {
          name: 'encerradoEm',
          label: 'Encerrado Em',
          align: 'left',
          field: (row) => (row.dataEncerramento != null ?? formatDateTimeSql(row.dataEncerramento)),
          sortable: false,
        },
        {
          name: 'compareceu', label: 'Compareceu', align: 'left', field: (row) => (row.compareceu ? 'Sim' : 'Não'), sortable: false,
        },
        {
          name: 'fechou', label: 'Fechou', align: 'left', field: (row) => (row.contratoFechado ? 'Sim' : 'Não'), sortable: false,
        },
        {
          name: 'faturado', label: 'Faturado', align: 'left', field: (row) => (row.faturado ? 'Sim' : 'Não'), sortable: false,
        },
      ],

      pagination: {
        sortBy: 'nomeCliente',
        descending: false,
        page: 1,
        rowsPerPage: 20,
      },
    }
  },

  computed: {
    pagesNumber() {
      return Math.ceil(this.lista.length / this.pagination.rowsPerPage)
    },
  },

  methods: {
    async buscar() {
      this.lista = []
      this.error = false
      if (this.nome.trim() === '') {
        this.error = true
      } else {
        this.carregando = true
        const lista = await exportar(this.nome, null, null, null, null)
        this.carregando = false
        this.lista = lista
      }
    },
  },
}
</script>
