<template>
  <div>
    <app-carregando v-if="carregando" tipo="calendario-lista-valor" />
    <q-card v-else>
      <div class="row">
        <div class="col-md-5 col-xs-12 q-pa-md">
          <app-calendario ref="calendario" :btnUpdate="true" :loading="carregando" :disabled="verificaBloqueio"
            :color="verificaFor" @input="evento" @current-date=carregaLista @update-press=carregaLista>
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

        <div class="col-md-1"></div>

        <div class="col-md-6 col-xs-12 q-pa-md">
          <div>
            <div class="float-left">
              <div>Vendas esse mês:</div>
              <div style="margin-top: -.3em;"><small>(Todas unidades)</small></div>
            </div>
            <span class="float-right" style="margin-top: 0.5em">
              <div class="block-saldo" :style="styleSaldo">
                <span class="float-left saldo-valor">
                  <q-icon color="primary" :name="!verSaldo ? 'visibility' : 'visibility_off'"
                    @click="verSaldo = !verSaldo">
                    <q-tooltip v-if="!verSaldo">
                      Ver saldo
                    </q-tooltip>
                    <q-tooltip v-if="verSaldo">
                      Ocultar saldo
                    </q-tooltip>
                  </q-icon>
                </span>
              </div>
              <a href="#" :style="{ 'z-index': verSaldo ? 2 : 1 }" class="click-extrato text-primary"
                @click.prevent.stop="$emit('exibe-extrato', mes, ano)">
                <q-tooltip>
                  Clique para ver o extrato
                </q-tooltip>
                <strong>{{ comissaoMes | formatMoney }} </strong>
                <q-icon name="more_vert" class="icone-correcao"></q-icon>
              </a>
            </span>
          </div>
          <q-input v-model="termo" placeholder="Buscar" class="q-mb-md q-mt-xl">
            <template v-slot:append>
              <q-icon v-if="termo !== ''" name="close" class="cursor-pointer"
                @click="termo = ''; $refs.calendario.limpaCheck()" />
              <q-select v-model="filtro" :options="filtros">
                <template v-slot:selected>
                  {{ filtro ? filtro : '' }}
                  <q-badge color="primary" class="q-ml-sm" style="margin-right: -1em">
                    {{ listaFiltrada.length }}
                  </q-badge>
                </template>
              </q-select>
            </template>
          </q-input>

          <app-lista-agenda v-if="vendas.length > 0" :height="height" :lista="listaFiltrada"
            @click="(item) => $emit('editar', item)">
          </app-lista-agenda>

        </div>
      </div>
    </q-card>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import dayjs from 'dayjs'
import {
  QCard, QIcon, QTooltip, QBadge, QInput, QSelect,
} from 'quasar'
import { obterFaturamento } from '../../services/usuario'
import { retornaPorUsuarioMesAno } from '../../services/venda-agenda'
import { retornaDatasBloqueadasUnidade } from '../../services/unidade'
import { formatDateSql, orderBy } from '../../util/util'
import formatMoney from '../../filters/format-money'
import AppCalendario from '../../components/calendario/main.vue'
import AppListaAgenda from '../../components/lista-agenda/main.vue'
import AppCarregando from '../../components/carregando/main.vue'

export default {

  components: {
    AppCalendario,
    AppCarregando,
    AppListaAgenda,
    QCard,
    QIcon,
    QTooltip,
    QBadge,
    QInput,
    QSelect,
  },

  filters: { formatMoney },

  data() {
    return {
      filtro: 'Todos',
      filtros: ['Todos', 'Contrato Fechado', 'Não Compareceu', 'Não Fechou', 'Confirmado', 'Agendado'],
      height: 0,
      mesAtual: 0,
      anoAtual: 0,
      mes: 0,
      ano: 0,
      carregando: false,
      verSaldo: false,
      comissaoMes: 0,
      termo: '',
      vendas: [],
      datasBloqueadas: [],
    }
  },

  computed: {
    ...mapState({
      sessao: (state) => state.sessao.user,
    }),

    styleSaldo() {
      return {
        background: this.verSaldo ? 'transparent' : this.getColor(),
        'z-index': this.verSaldo ? 1 : 2,
      }
    },

    listaFiltrada() {
      let list = this.vendas

      if (this.filtro !== 'Todos') {
        list = list.filter((p) => p.status === this.filtro)
      }

      if (this.termo !== '') {
        list = list.filter((i) => {
          const termo = this.termo.toLowerCase()
          return i.nome.toLowerCase().indexOf(termo) > -1
            || i.telefone.toLowerCase().indexOf(termo) > -1
            || i.dataFormatada.toLowerCase().indexOf(termo) > -1
        })
      }
      return orderBy(list, 'dataId')
    },

  },

  mounted() {
    this.height = window.innerHeight - 370
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

    getColor() {
      return this.$q.dark.isActive ? '#444' : '#F0F0F0'
    },

    verificaBloqueio(data) {
      const feriado = this.datasBloqueadas.find((x) => formatDateSql(x.data) === data)
      if (feriado) return true
      return false
    },

    verificaFor(data) {
      let cor = ''
      const list = this.vendas.filter((i) => i.dataFormatada.toLowerCase().indexOf(data) > -1)
      if (list.length > 0) cor = 'positive'
      list.map((item) => {
        if (item.confirmado !== false) if (item.idUsuarioEncerramento === null) cor = 'warning'
        return item
      })
      return cor
    },

    carregaMesAtual() {
      this.mes = this.mesAtual
      this.ano = this.anoAtual
      this.$refs.data.setToday()
      this.$nextTick(() => {
        this.date = ''
        this.$emit('day', '')
      })
      this.carregaLista(this.mes, this.ano)
    },

    evento(date, reason, details) {
      if (reason === 'month' || reason === 'year') {
        this.mes = details.month
        this.ano = details.year
        this.carregaLista(details.month, details.year)
        // esta exibindo o extrato do mes
        if (this.exibeForm === 'E') {
          this.$refs.extrato.carregaExtrato(this.sessao.unidadeAtual.id, this.mes, this.ano)
        }
        this.termo = ''
        this.date = ''
        this.$emit('day', '')
      }

      if (reason === 'day') {
        this.termo = date
        this.date = date
        this.$emit('day', date)
      }
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
      this.events = []
      const idUnidade = this.sessao.unidadeAtual.id
      const comissao = await obterFaturamento(idUnidade, mes, ano)
      this.comissaoMes = comissao
      this.$emit('alterou-mes-ano', mes, ano)

      const lista = await retornaPorUsuarioMesAno(idUnidade, mes, ano)
      this.vendas = lista.map((item) => {
        const itemEditado = item
        const data = dayjs(String(item.data))
        itemEditado.dataId = data.valueOf()
        itemEditado.dataFormatada = data.format('DD/MM/YYYY HH:mm')
        itemEditado.status = this.geraNomeStatus(itemEditado)
        this.events.push(dayjs(String(item.data)).format('YYYY/MM/DD'))
        return itemEditado
      })

      const listaBloqueios = await retornaDatasBloqueadasUnidade(idUnidade, mes, ano)
      this.datasBloqueadas = listaBloqueios
      this.carregando = false

      this.$nextTick(() => {
        this.$refs.calendario.criaMes(mes, ano)
      })
    },
  },
}
</script>

<style lang="scss">
.block-saldo {
  border-radius: 0.5em;
  width: 9em;
  height: 1.5em;
  right: 1em;
  z-index: 3;
  position: absolute
}

.click-extrato {
  text-decoration: none;
  z-index: 10;
  position: relative;
}

.saldo-valor {
  margin-left: 0.5em;
  cursor: pointer
}
</style>
