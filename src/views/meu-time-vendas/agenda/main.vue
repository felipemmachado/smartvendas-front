<template>
  <div class="row">
    <div class="col-xs-12 col-md-4 q-pt-md q-pl-md q-pr-md">
      <app-btn-voltar label="Meu Time de Vendas" cls="q-mb-md" rota="meu-time-vendas" />
      <div class="text-h5">
        <q-icon class="text-primary icone-correcao" name="o_calendar_month" />
        Vendas
      </div>
    </div>
    <div class="col-xs-12">
      <div class="row no-print">
        <div class="col-xs-12 col-md-4 q-pt-md q-pl-md q-pr-md">
          <app-select-unidade />
        </div>
      </div>
      <div class="row">
        <div v-show="exibeDiv" class="col-xs-12 q-pa-md animated fadeIn fast">
          <app-calendario-lista ref="lista" @agendamento="agendamento" @day="(val) => date = val"
            @imprimir="(val, data) => { imprimir = true; lista = val }" />
        </div>
      </div>
    </div>
    <q-dialog v-model="exibeForm" persistent :maximized="$q.platform.is.mobile">
      <q-card :style="{ 'min-width': $q.platform.is.mobile ? 'auto' : '800px' }">
        <q-card-section>
          <app-vendas-cadastro v-if="!editarVenda" :comissoes="comissoes" :venda="venda"
            @excluiu="exibeForm = false; $refs.lista.recarregaLista()" @salvou="$refs.lista.recarregaLista()"
            @editar="editarVenda = true" @fechar="exibeForm = false" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  QDialog, QCard, QCardSection, QIcon,
} from 'quasar'
import appVendasCadastro from './cadastro.vue'
import { retornaTodasComissoesDeVendaAtivas } from '../../../services/unidade'
import appCalendarioLista from './calendario-lista.vue'
import AppSelectUnidade from '../../../components/select-unidade/main.vue'
import AppBtnVoltar from '../../../components/btn-voltar/main.vue'

export default {

  components: {
    appVendasCadastro,
    appCalendarioLista,
    AppSelectUnidade,
    AppBtnVoltar,
    QDialog,
    QCard,
    QCardSection,
    QIcon,
  },

  data() {
    return {
      comissoes: [],
      exibeBuscaNome: false,
      imprimir: false,
      date: '',
      exibeForm: false,
      venda: null,
      editarVenda: false,
      lista: [],
      tiposVendas: [],
    }
  },

  computed: {
    ...mapState({
      idUnidadeAtual: (state) => state.sessao.user.unidadeAtual.id,
    }),

    exibeDiv() {
      if (!this.$q.platform.is.mobile) {
        return true
      } if (this.exibeForm) {
        return false
      }
      return true
    },
  },

  mounted() {
    this.carregaListas()
  },

  methods: {
    async carregaListas() {
      const lista = await retornaTodasComissoesDeVendaAtivas(this.idUnidadeAtual)
      this.comissoes = lista
    },

    agendamento(venda) {
      this.venda = venda
      this.exibeForm = false
      this.$nextTick(() => {
        this.exibeForm = true
      })
    },
  },
}
</script>
