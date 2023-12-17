<template>
  <div>
    <div class="no-print">
      <app-btn-voltar label="Relatórios" cls="q-ml-md q-mt-md" rota="relatorios" />

      <div class="row no-print">
        <div class="col-xs-12 col-md-4 q-pt-md q-pl-md q-pr-md">
          <app-select-unidade @unidade-atual="(unidade) => unidadeAtual = unidade" />
        </div>
      </div>

      <div class="q-ml-md q-mt-md">
        <div class="text-h5">
          <q-icon class="text-primary icone-correcao" name="attach_money" />
          Vendas por Unidade
        </div>
      </div>

      <div class="row q-ma-md">
        <div class="col-xs-12 col-md-6">
          <app-select-datas @selecionou="carregarRelatorio"></app-select-datas>
        </div>
        <div class="col-md-4"></div>
        <div class="col-md-2 col-xs-12">
          <q-btn v-if="relatorio.length > 0" label="imprimir" color="primary" outline
            class="full-width q-mb-md q-mt-lg no-print float-right" icon="print" @click="print()" />
        </div>
      </div>
    </div>

    <q-card class="q-ma-md animated fadeIn fast">
      <app-carregando v-if="carregando" tipo="tabela" />
      <q-card-actions v-else-if="relatorio.length == 0 && buscou">
        Nenhum resultado encontrado.
      </q-card-actions>
      <q-card-section v-else-if="relatorio.length > 0">
        <app-cabecalho-print :titulo="`<span class='text-h6'>
        Vendas por Unidade - ${inicio} até ${fim}
        </span>`" />

        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th class="text-center td-relatorio" colspan="6">
                  {{ nomeUnidade }}
                </th>
              </tr>
              <tr>
                <th style="width: 40%" class="td-relatorio text-left">Nome</th>
                <th class="td-relatorio text-center">Vendas</th>
                <th class="td-relatorio text-center">Valor</th>
                <th class="td-relatorio text-center">Representates</th>
                <th class="td-relatorio text-center">Valor</th>
                <th style="width: 20%" class="td-relatorio text-center">Valor a Pagar</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in relatorio" :key="index">
                <td class="td-relatorio">
                  {{ item.nome }} <br />
                </td>
                <td class="text-center td-relatorio">
                  {{ item.qtdVenda }}
                </td>
                <td class="text-center td-relatorio">{{ item.totalVenda | formatMoney }}</td>
                <td class="text-center td-relatorio">{{ item.qtdVendaRepresentante }}</td>
                <td class="text-center td-relatorio">
                  {{ item.totalVendaRepresentante | formatMoney }}
                </td>
                <td class="text-center td-relatorio">
                  {{ item.totalVendaGeral | formatMoney }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th class="text-left td-relatorio">TOTAL</th>
                <th class="text-center td-relatorio">{{ qtdVendaTotal }}</th>
                <th class="text-center td-relatorio">{{ valorVendaTotal | formatMoney }}</th>
                <th class="text-center td-relatorio">{{ qtdVendaRepresentanteTotal }}</th>
                <th class="text-center td-relatorio">
                  {{ valorVendaRepresentateTotal | formatMoney }}
                </th>
                <th class="td-relatorio">{{ total | formatMoney }}</th>
              </tr>
            </tfoot>
          </table>
        </div>

      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  QIcon, QBtn, QCard, QCardSection, QCardActions,
} from 'quasar'
import { formatSqlDate, mesNome, orderBy } from '../../../util/util'
import { vendasPorDatas } from '../../../services/relatorios'
import formatMoney from '../../../filters/format-money'
import AppCabecalhoPrint from '../../../components/cabecalho-print/main.vue'
import AppSelectUnidade from '../../../components/select-unidade/main.vue'
import AppSelectDatas from '../../../components/select-datas/main.vue'
import AppBtnVoltar from '../../../components/btn-voltar/main.vue'
import AppCarregando from '../../../components/carregando/main.vue'

export default {

  components: {
    AppCabecalhoPrint,
    AppSelectUnidade,
    AppSelectDatas,
    AppBtnVoltar,
    AppCarregando,
    QIcon,
    QBtn,
    QCard,
    QCardSection,
    QCardActions,
  },

  filters: { formatMoney },

  data() {
    return {
      relatorio: [],
      carregando: false,
      buscou: false,
      inicio: '',
      fim: '',
      unidadeAtual: null,
      qtdVendaTotal: 0,
      valorVendaTotal: 0,
      qtdVendaRepresentanteTotal: 0,
      valorVendaRepresentateTotal: 0,
      total: 0,
    }
  },

  computed: {
    ...mapState({
      sessao: (state) => state.sessao.user,
    }),

    nomeMes() {
      if (this.mes === 0) return ''
      return mesNome(this.mes)
    },

    nomeUnidade() {
      return this.unidadeAtual ? this.unidadeAtual.nome : ''
    },
  },

  methods: {
    print() {
      window.print()
    },
    async carregarRelatorio(datas) {
      if (this.carregando) return

      this.inicio = datas.inicio
      this.fim = datas.fim
      const inicio = formatSqlDate(datas.inicio)
      const fim = formatSqlDate(datas.fim)
      this.carregando = true
      this.relatorio = []
      this.buscou = false
      this.qtdVendaTotal = 0
      this.valorVendaTotal = 0
      this.qtdVendaRepresentanteTotal = 0
      this.valorVendaRepresentateTotal = 0
      this.total = 0

      const lista = await vendasPorDatas(this.unidadeAtual.id, `${inicio}T00:00:00`, `${fim}T23:59:59`)
      this.carregando = false
      this.buscou = true
      this.relatorio = lista.map((item) => {
        const it = item
        this.qtdVendaTotal += Number(item.qtdVenda)
        this.valorVendaTotal += Number(item.totalVenda)
        this.qtdVendaRepresentanteTotal += Number(item.qtdVendaRepresentante)
        this.valorVendaRepresentateTotal += Number(item.totalVendaRepresentante)
        this.total += Number(item.totalVendaGeral)
        return it
      })

      this.relatorio = orderBy(this.relatorio, 'nome')
    },
  },
}
</script>
