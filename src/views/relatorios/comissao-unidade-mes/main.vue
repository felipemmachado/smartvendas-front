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
          Pagamento Comissão Unidade
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
        Pagamento Comissão - ${inicio} até ${fim}
        </span>`" />

        <div class="table-responsive">
          <table class="table" style="min-width: 1024px;" border="0">
            <thead>
              <tr>
                <th class="td-relatorio" colspan="4">{{ unidadeAtual.nome }}</th>
              </tr>
            </thead>
            <thead>
              <tr>
                <th style="width: 10%" class="td-relatorio text-left">Descrição da Comissão</th>
                <th style="width: 5%" class="td-relatorio">Valor da Comissão</th>
                <th style="width: 5%" class="td-relatorio">Quantidade de Vendas</th>
                <th style="width: 5%" class="td-relatorio">Valor Total Comissão</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in relatorio" :key="index">
                <td class="td-relatorio">
                  {{ item.descricao }}
                </td>
                <td class="td-relatorio text-center">
                  {{ item.valorPagamentoUnidade | formatMoney }}
                </td>
                <td class="td-relatorio text-center">
                  {{ item.qtdVendas }}
                </td>
                <td class="td-relatorio text-center">
                  {{ item.qtdPagamento | formatMoney }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th colspan="2" class="td-relatorio text-left">TOTAL</th>
                <th class="td-relatorio text-center">{{ totalVendas }}</th>
                <th class="td-relatorio text-center">{{ total | formatMoney }}</th>
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
import { mesNome, formatSqlDate } from '../../../util/util'
import { comissoesUnidade } from '../../../services/relatorios'
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
      inicio: 0,
      fim: 0,
      unidadeAtual: null,
      total: 0,
      totalVendas: 0,
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
  },

  methods: {
    print() {
      window.print()
    },

    async carregarRelatorio(datas) {
      if (!this.carregando) {
        this.inicio = datas.inicio
        this.fim = datas.fim
        const inicio = formatSqlDate(datas.inicio)
        const fim = formatSqlDate(datas.fim)
        this.carregando = true
        this.relatorio = []
        this.buscou = false
        this.total = 0
        this.totalVendas = 0

        const lista = await comissoesUnidade(this.unidadeAtual.id, `${inicio}T00:00:00`, `${fim}T23:59:59`)
        this.carregando = false
        this.relatorio = lista.map((item) => {
          const it = item
          this.total += item.qtdPagamento
          this.totalVendas += item.qtdVendas
          return it
        })
      }
    },
  },
}
</script>
