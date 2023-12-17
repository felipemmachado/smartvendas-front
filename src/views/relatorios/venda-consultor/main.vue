<template>
  <div>

    <div class="no-print">
      <app-btn-voltar label="Relatórios" cls="q-ml-md q-mt-md" rota="relatorios" />

      <div class="q-ml-md q-mt-md">
        <div class="text-h5">
          <q-icon class="text-primary icone-correcao" name="attach_money" />
          Vendas por Consultor
        </div>
      </div>

      <div class="row q-ma-md">
        <div class="col-xs-12 col-md-4" :class="{'q-pr-md q-mt-md' : !$q.platform.is.mobile}">
          <app-select-usuario dense label="Consultor" @usuario="setaUsuario" />
        </div>
        <div class="col-md-5 col-xs-12">
          <app-select-datas v-if="usuario" @selecionou="carregarRelatorio" />
        </div>
        <div class="col-md-1"></div>
        <div class="col-md-2 col-xs-12" :class="{'q-pl-md' : !$q.platform.is.mobile}">
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
        <app-cabecalho-print
          :titulo="`<span class='text-h6'>Pagamento de Consultor por Unidade</span>`" />

        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th class="td-relatorio text-center" colspan="5">
                  Consultor {{usuario.nome}} - {{inicio}} de {{fim}}
                </th>
              </tr>
              <tr>
                <th class="td-relatorio text-left">Nome</th>
                <th class="td-relatorio text-center">Descrição</th>
                <th class="td-relatorio text-center">Data</th>
                <th class="td-relatorio text-center">Unidade</th>
                <th class="td-relatorio text-center">Valor a Pagar</th>
              </tr>
            </thead>
            <tbody>
              <tr
              v-for="(item, index) in relatorio" :key="index">
                <td class="td-relatorio" >
                  {{
                    item.idUsuarioRepresentante == null ?
                    item.nomeUsuario :
                    item.nomeUsuarioRepresentante
                  }}
                </td>
                <td  class="text-center td-relatorio">
                  {{item.descricao}}
                </td>
                <td  class="text-center td-relatorio">{{item.criadoEm }}</td>
                <td  class="text-center td-relatorio">{{item.nomeUnidade }}</td>
                <td  class="text-center td-relatorio">{{item.valor | formatMoney}}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th class="text-right td-relatorio" colspan="4">Total a Pagar:</th>
                <th class="td-relatorio">{{total | formatMoney}}</th>
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
import { formatSqlDate, mesNome } from '../../../util/util'
import { faturas } from '../../../services/relatorios'
import formatMoney from '../../../filters/format-money'
import AppSelectUsuario from '../../../components/select-usuario/main.vue'
import AppCabecalhoPrint from '../../../components/cabecalho-print/main.vue'
import AppSelectDatas from '../../../components/select-datas/main.vue'
import AppBtnVoltar from '../../../components/btn-voltar/main.vue'
import AppCarregando from '../../../components/carregando/main.vue'

export default {

  components: {
    AppSelectUsuario,
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

  filters: { formatMoney },

  data() {
    return {
      relatorio: [],
      carregando: false,
      buscou: false,
      usuario: null,
      inicio: '',
      fim: '',
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
  },

  methods: {
    print() {
      window.print()
    },
    setaUsuario(usuario) {
      if (usuario == null) {
        this.relatorio = []
        this.usuario = null
        this.buscou = false
      } else {
        this.usuario = usuario
      }
    },
    async carregarRelatorio(datas) {
      if (!this.carregando) {
        this.inicio = datas.inicio
        this.fim = datas.fim
        const inicio = formatSqlDate(datas.inicio)
        const fim = formatSqlDate(datas.fim)
        this.relatorio = []
        this.carregando = true
        this.buscou = false
        const idUsuario = this.usuario.id
        this.total = 0

        const lista = await faturas(null, idUsuario, `${inicio}T00:00:00`, `${fim}T23:59:59`)
        this.carregando = false
        this.buscou = true
        this.relatorio = lista.map((item) => {
          const it = item
          this.total += Number(item.valor)
          const dt = new Date(item.criadoEm)
          it.criadoEm = `${dt.toLocaleDateString('pt-br')} ${dt.toLocaleTimeString('pt-br')}`
          return it
        })
      }
    },
  },
}
</script>
