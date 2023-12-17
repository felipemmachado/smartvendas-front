<template>
  <div class="row">
    <div class="col-xs-12">
      <div class="row q-pt-md q-pl-md">
        <div class="col-xs-6 col-md-7">
          <div class="text-h5">
            <q-icon class="text-primary icone-correcao" name="o_calendar_month" />
            Vendas
          </div>
        </div>
      </div>
      <div class="row no-print">
        <div class="col-xs-12 col-md-4 q-pt-md q-pl-md q-pr-md">
          <app-select-unidade />
        </div>
        <div class="col-xs-12 col-md-5"></div>

        <div class="col-xs-12 col-md-3 q-pt-md q-pl-md q-pr-md">
          <q-btn label="Novo agendamento" outline color="primary" style="width: 100%" class="float-right"
            @click="editar(null)" />
        </div>

      </div>

      <div class="row">
        <div class="col-xs-12 q-pa-md animated fadeIn fast">
          <appCalendarioLista ref="lista" @editar=editar
            @exibe-extrato="(m, a) => { exibeExtrato = true; mes = m; ano = a }"
            @alterou-mes-ano="(m, a) => { mes = m; ano = a }" @day="(val) => date = val" />
        </div>
      </div>
    </div>

    <q-dialog v-model="exibeCadastro" persistent :maximized="$q.platform.is.mobile">
      <q-card :style="{ 'min-width': $q.platform.is.mobile ? 'auto' : '950px' }">
        <q-card-section>
          <app-vendas-cadastro :data="date" :comissoes="comissoes" :tiposVendas="tiposVendas" :venda="venda"
            @excluiu="excluiu" @salvou="salvouAgendamento" @fechar="exibeCadastro = false"
            @reagendado="(item) => $refs.lista.recarregaLista()">
          </app-vendas-cadastro>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="exibeExtrato" full-width full-height :maximized="$q.platform.is.mobile">
      <q-card>
        <q-card-section>
          <app-extrato ref="extrato" :mes="mes" :ano="ano" :nomeMes="nomeMes" :idUsuario="sessao.id"
            :idUnidade="sessao.unidadeAtual.id" @fechar="exibeExtrato = false">
          </app-extrato>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  QIcon,
  QBtn,
  QDialog,
  QCard,
  QCardSection,
} from 'quasar'
import { mesNome } from '../../util/util'
import AppVendasCadastro from './cadastro.vue'
import AppExtrato from './extrato.vue'
import { retornaTodasComissoesDeVendaAtivas } from '../../services/unidade'
import { retornaTodos } from '../../services/venda-agenda-tipo'
import AppCalendarioLista from './calendario-lista.vue'
import AppSelectUnidade from '../../components/select-unidade/main.vue'

export default {

  components: {
    AppVendasCadastro,
    AppExtrato,
    AppCalendarioLista,
    AppSelectUnidade,
    QIcon,
    QBtn,
    QDialog,
    QCard,
    QCardSection,
  },

  data() {
    return {
      comissoes: [],
      date: null,
      exibeCadastro: false,
      exibeExtrato: false,
      venda: null,
      mes: 0,
      ano: 0,
      tiposVendas: [],
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

  mounted() {
    this.carregaComissoes()
  },

  methods: {
    salvouAgendamento() {
      this.exibeCadastro = false
      this.$refs.lista.recarregaLista()
    },

    excluiu() {
      this.exibeCadastro = false
      this.$refs.lista.recarregaLista()
    },

    async carregaComissoes() {
      const tiposVendas = await retornaTodos()
      this.tiposVendas = tiposVendas

      const lista = await retornaTodasComissoesDeVendaAtivas(this.sessao.unidadeAtual.id)
      this.comissoes = lista
    },

    editar(venda) {
      this.venda = venda
      this.exibeCadastro = true
    },
  },
}
</script>
