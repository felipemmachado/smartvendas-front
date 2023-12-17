<template>
  <div>
    <div class="row no-print">
      <div class="col-xs-12 col-md-4 q-pt-md q-pl-md q-pr-md">
        <app-select-dashboard></app-select-dashboard>
      </div>
      <div class="col-md-4">
        <div v-if="exibirUnidades" class="col-md-4 q-pt-md q-pl-md q-pr-md">
          <app-select-unidade @unidade-atual="(un) => unidade = un" />
        </div>

        <div v-if="exibirUsuario" class="col-md-4 q-pt-md q-pl-md q-pr-md">
          <q-btn outline color="primary" :icon="usuario ? 'refresh' : ''" style="width: 100%" @click="modalUsuario = true">
            &nbsp;<span>{{ usuario ? usuario.nome : 'Selecione um consultor' }}</span>
          </q-btn>
        </div>
      </div>
      <div class="col-xs-12 col-md-4 q-pt-md q-pl-md q-pr-md">
        <q-btn outline no-caps color="primary" style="width: 100%" @click="filtrar = true">
          <span style="font-size: 16px;">{{ formatDateSql(inicio) }} - {{ formatDateSql(fim) }}</span>
        </q-btn>
      </div>
    </div>

    <q-dialog v-model="filtrar">
      <q-card :style="{ 'min-width': $q.platform.is.mobile ? 'auto' : '550px' }">
        <q-card-section>
          <app-cabecalho-form textoNovo="Selecione as datas" @fechar="filtrar = false" />

          <app-select-datas
            @selecionou="({ inicio, fim }) => carregaDashboard(formatSqlDate(inicio), formatSqlDate(fim))" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalUsuario">
      <q-card :style="{ 'min-width': $q.platform.is.mobile ? 'auto' : '550px' }">
        <q-card-section class="q-mb-lg">
          <app-cabecalho-form textoNovo="Selecione" @fechar="modalUsuario = false" />

          <app-select-usuario :outlined="false" label="Consultor" @usuario="setaUsuario" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>

import {
  QBtn,
  QDialog,
  QCard,
  QCardSection,
} from 'quasar'
import AppSelectDashboard from './select.vue'
import AppSelectDatas from '../select-datas/main.vue'
import { mesNome, formatDateSql, formatSqlDate } from '../../util/util'
import AppCabecalhoForm from '../cabecalho-form/main.vue'
import AppSelectUnidade from '../select-unidade/main.vue'
import AppSelectUsuario from '../select-usuario/main.vue'

export default {

  components: {
    AppSelectUsuario,
    AppSelectUnidade,
    AppSelectDashboard,
    AppSelectDatas,
    AppCabecalhoForm,
    QBtn,
    QDialog,
    QCard,
    QCardSection,
  },

  props: {
    exibirUnidades: {
      type: Boolean,
      default: false,
    },
    exibirUsuario: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      inicio: null,
      fim: null,
      unidadeAtual: null,
      filtrar: false,
      usuario: null,
      modalUsuario: false,
    }
  },

  computed: {
    nomeMes() {
      if (this.mes === 0) return ''
      return mesNome(this.mes)
    },
  },

  mounted() {
    const dNow = new Date()
    const daysInMonth = 32 - new Date(dNow.getFullYear(), dNow.getMonth(), 32).getDate()
    const mes = dNow.getMonth() + 1 < 10 ? `0${dNow.getMonth() + 1}` : dNow.getMonth() + 1

    this.carregaDashboard(`${dNow.getFullYear()}-${mes}-01`, `${dNow.getFullYear()}-${mes}-${daysInMonth}`)
  },

  methods: {
    formatDateSql(data) { return formatDateSql(data, 'DD, MMM [de] YYYY') },

    formatSqlDate(data) { return formatSqlDate(data) },

    setaUsuario(usuario) {
      this.usuario = usuario
      this.modalUsuario = false
      if (this.usuario !== null) this.carregaDashboard(this.inicio, this.fim)
    },

    carregaDashboard(inicio, fim) {
      this.filtrar = false
      this.inicio = inicio
      this.fim = fim
      this.$emit('carrega-dashboard', inicio, fim, this.unidade?.id, this.usuario?.id)
    },
  },
}

</script>
