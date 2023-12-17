<template>
  <div>
    <div class="no-print">
      <app-btn-voltar label="Relatórios" cls="q-ml-md q-mt-md" rota="relatorios" />

      <div class="q-ml-md q-mt-md">
        <div class="text-h5">
          <q-icon class="text-primary icone-correcao" name="attach_money" />
          Vendas por Tipos
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
        Vendas por Tipo - ${inicio} até ${fim}
        </span>`" />

        <div class="table-responsive">
          <table class="table" style="min-width: 1024px;" border="0">
            <thead>
              <tr>
                <th style="width: 20%" class="td-relatorio text-left">Consultor</th>
                <th style="width: 20%" class="td-relatorio text-left">Tipo da Venda</th>
                <th style="width: 5%" class="td-relatorio">Qtd de Vendas</th>
                <th style="width: 5%" class="td-relatorio">Total de Vendas</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in relatorio" :key="index">
                <td class="td-relatorio">{{ item.nome }}</td>

                <td class="td-relatorio">
                  <div v-for="(tipo, idx) in item.tipo" :key="idx">
                    {{ tipo.tipo }}
                  </div>
                </td>
                <td class="td-relatorio text-center">
                  <div v-for="(tipo, idx) in item.tipo" :key="idx">
                    {{ tipo.qtdVendas }}
                  </div>
                </td>
                <td class="td-relatorio text-center"> <strong>{{ item.total }}</strong></td>
              </tr>
            </tbody>
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
import {
  mesNome, formatSqlDate, orderBy, groupBy,
} from '../../../util/util'
import { vendasPorTipo } from '../../../services/relatorios'
import AppCabecalhoPrint from '../../../components/cabecalho-print/main.vue'
import AppSelectDatas from '../../../components/select-datas/main.vue'
import AppBtnVoltar from '../../../components/btn-voltar/main.vue'
import AppCarregando from '../../../components/carregando/main.vue'

export default {

  components: {
    AppCabecalhoPrint,
    AppSelectDatas,
    AppBtnVoltar,
    AppCarregando,
    QIcon,
    QBtn,
    QCard,
    QCardSection,
    QCardActions,
  },

  data() {
    return {
      relatorio: [],
      carregando: false,
      buscou: false,
      inicio: 0,
      fiim: 0,
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
      if (this.carregando) return

      this.inicio = datas.inicio
      this.fim = datas.fim
      const inicio = formatSqlDate(datas.inicio)
      const fim = formatSqlDate(datas.fim)
      this.carregando = true
      this.relatorio = []
      this.buscou = false

      const lista = await vendasPorTipo(`${inicio}T00:00:00`, `${fim}T23:59:59`)
      this.carregando = false
      this.relatorio = lista.map((item) => {
        const it = item
        return it
      })
      const rel = groupBy(orderBy(this.relatorio, 'nome'), 'nome')
      const list = []
      Object.keys(rel).forEach((key) => {
        let total = 0
        rel[key].forEach((item) => {
          total += Number(item.qtdVendas)
        })
        const obj = { nome: key, tipo: rel[key], total }
        list.push(obj)
      })
      this.relatorio = list
    },
  },
}
</script>
