<template>
<div>
  <app-carregando v-if="carregando" tipo="calendario-lista" />
  <q-card v-else>
    <div class="row">
      <div class="col-md-5 col-xs-12 ">
        <div class="text-center">
          <div class="q-ma-md">
            <app-calendario ref="calendario"
              :btnUpdate="true"
              :loading="carregando"
              :disabled="verificaBloqueio"
              :color="verificaData"
              @input="evento"
              @current-date=carregaLista
              @update-press=carregaLista>
              <div class="q-ml-sm">
                <q-icon color="positive" size="md" name="remove"></q-icon>
                Todos agendamentos com ação
              </div>
              <div class="q-ml-sm">
                <q-icon color="warning" size="md" name="remove"></q-icon>
                Existe agendamentos sem ação
              </div>
            </app-calendario>
          </div>
        </div>
      </div>
      <div class="col-md-1"></div>
      <div class="col-md-6 col-xs-12 q-pa-md">
        <q-input v-if="!$q.platform.is.mobile" v-model="termo" placeholder="Buscar">
          <template v-slot:prepend>
            <q-select v-model="tipoBusca"
            :options="['Todos', 'Consultor', 'Paciente', 'Data']">
            </q-select>
          </template>
          <template v-slot:append>
            <q-icon v-if="termo !== ''"
                    name="close"
                    class="cursor-pointer"
                    @click="termo = ''; $refs.calendario.limpaCheck()" />
            <q-select v-model="filtro" :options="filtros">
              <template v-slot:selected>
                {{filtro ? filtro : ''}}
                <q-badge color="primary" class="q-ml-sm" style="margin-right: -1em">
                  {{listaFiltrada.length}}
                </q-badge>
              </template>
            </q-select>

          </template>
        </q-input>

        <div v-if="$q.platform.is.mobile">
          <q-select
            v-model="tipoBusca"
            label="Tipo da busca"
            :options="['Todos', 'Consultor', 'Paciente', 'Data']">
          </q-select>
          <q-select v-model="filtro"
            label="Filtro"
            :options="filtros">
              <template v-slot:selected>
                {{filtro ? filtro : ''}}
                <q-badge color="primary" class="q-ml-sm" style="margin-right: -1em">
                  {{listaFiltrada.length}}
                </q-badge>
              </template>
          </q-select>
          <q-input v-model="termo" label="Buscar" />
        </div>

        <div class="row">
          <div class="col-xs-12 q-mt-md">
            <app-lista-agenda
              v-if="vendas.length > 0"
              :height="height"
              :lista="listaFiltrada"
              @click="(val) => $emit('agendamento', val)" >
            </app-lista-agenda>
          </div>
        </div>
      </div>
    </div>
  </q-card>
</div>
</template>

<script>

import { mapState } from 'vuex'
import dayjs from 'dayjs'
import {
  QCard, QIcon, QInput, QSelect, QBadge,
} from 'quasar'
import { retornaPorUnidadeMesAno } from '../../services/venda-agenda'
import { retornaDatasBloqueadasUnidade } from '../../services/unidade'
import { formatDateSql, orderBy } from '../../util/util'
import AppCalendario from '../../components/calendario/main.vue'
import AppListaAgenda from '../../components/lista-agenda/main.vue'
import AppCarregando from '../../components/carregando/main.vue'

export default {

  components: {
    AppCalendario,
    AppListaAgenda,
    AppCarregando,
    QCard,
    QIcon,
    QInput,
    QSelect,
    QBadge,
  },

  data() {
    return {
      tipoBusca: 'Todos',
      filtro: 'Todos',
      filtros: ['Todos', 'Contrato Fechado', 'Não Compareceu', 'Não Fechou', 'Confirmado', 'Agendado'],
      date: null,
      termo: '',
      carregando: false,
      vendas: [],
      datasBloqueadas: [],
      mesAtual: 0,
      anoAtual: 0,
      height: 0,
      mes: 0,
      ano: 0,
    }
  },

  computed: {
    ...mapState({
      idUnidadeAtual: (state) => state.sessao.user.unidadeAtual.id,
    }),

    listaFiltrada() {
      let list = this.vendas

      if (this.filtro !== 'Todos') {
        list = list.filter((p) => p.status === this.filtro)
      }

      if (this.termo !== '') {
        list = list.filter((i) => {
          const termo = this.termo.toLowerCase()
          if (this.tipoBusca === 'Paciente') {
            return i.nome.toLowerCase().indexOf(termo) > -1
          } if (this.tipoBusca === 'Data') {
            return i.dataFormatada.toLowerCase().indexOf(termo) > -1
          } if (this.tipoBusca === 'Consultor') {
            return i.nomeUsuario.toLowerCase().indexOf(termo) > -1
          }
          return i.nome.toLowerCase().indexOf(termo) > -1
          || i.telefone.toLowerCase().indexOf(termo) > -1
          || i.nomeUsuario.toLowerCase().indexOf(termo) > -1
          || i.dataFormatada.toLowerCase().indexOf(termo) > -1
        })
      }
      return orderBy(list, 'dataId')
    },
  },

  mounted() {
    this.height = window.innerHeight - 340
    const dNow = new Date()
    this.mes = dNow.getMonth() + 1
    this.ano = dNow.getFullYear()
    this.mesAtual = dNow.getMonth() + 1
    this.anoAtual = dNow.getFullYear()

    this.carregaLista(this.mes, this.ano)
  },

  methods: {
    recarregaLista() {
      this.carregaLista(this.mes, this.ano)
    },

    evento(data, reason, details) {
      if (reason === 'month' || reason === 'year') {
        this.mes = details.month
        this.ano = details.year
        this.carregaLista(details.month, details.year)
        this.termo = ''
        this.date = ''
        this.$emit('day', '')
      }

      if (reason === 'day') {
        this.termo = `${data}`
        this.tipoBusca = 'Todos'
        // this.filtro = 'Todos';
        this.$emit('day', data)
      }
    },

    verificaBloqueio(data) {
      const feriado = this.datasBloqueadas.find((x) => formatDateSql(x.data) === data)
      if (feriado) return true
      return false
    },

    verificaData(data) {
      let cor = ''
      const list = this.vendas.filter((i) => i.dataFormatada.toLowerCase().indexOf(data) > -1)
      if (list.length > 0) cor = 'positive'
      list.map((item) => {
        if (item.idUsuarioEncerramento === null) cor = 'warning'
        return item
      })
      return cor
    },

    carregaMesAtual() {
      this.termo = ''
      this.mes = this.mesAtual
      this.ano = this.anoAtual
      this.$nextTick(() => {
        this.date = ''
      })
      this.carregaLista(this.mes, this.ano)
    },

    geraNomeStatus(item) {
      if (item.idUsuarioEncerramento === null) {
        if (item.confirmado === null) {
          return 'Agendado'
        }
        if (item.confirmado === false) {
          return 'Não Confirmado'
        }
        if (item.confirmado === true) {
          return 'Confirmado'
        }
      } else {
        if (!item.compareceu) {
          return 'Não Compareceu'
        }
        if (item.contratoFechado) {
          return 'Contrato Fechado'
        }

        if (item.compareceu && !item.contratoFechado) {
          return 'Não Fechou'
        }
      }
      return ''
    },

    async carregaLista(mes, ano) {
      this.carregando = true

      const lista = await retornaPorUnidadeMesAno(this.idUnidadeAtual, mes, ano)
      this.vendas = lista.map((item) => {
        const itemEditado = item
        const data = dayjs(String(item.data))
        itemEditado.dataId = data.valueOf()
        itemEditado.status = this.geraNomeStatus(itemEditado)
        itemEditado.dataFormatada = data.format('DD/MM/YYYY HH:mm')
        return itemEditado
      })
      this.carregando = true

      const listaBloqueios = await retornaDatasBloqueadasUnidade(this.idUnidadeAtual, mes, ano)
      this.datasBloqueadas = listaBloqueios
      this.carregando = false

      this.$nextTick(() => {
        this.$refs.calendario.criaMes(mes, ano)
      })
    },
  },
}
</script>
