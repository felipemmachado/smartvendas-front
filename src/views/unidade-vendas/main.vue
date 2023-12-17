<template>
  <div>
    <div class="row q-pt-md q-pl-md">
      <div class="col-xs-6 col-md-7">
        <div class="text-h5">
          <q-icon class="text-primary icone-correcao" name="o_corporate_fare" />
          Unidade
        </div>
      </div>
    </div>
    <div v-if="!imprimir && !exibeBuscaNome" class="row">
      <div class="col-xs-12">
        <div class="row no-print">
          <div class="col-xs-12 col-md-4 col-lg-4 q-pt-md q-pl-md q-pr-md">
            <app-select-unidade />
          </div>
          <div v-if="temPermissao('BuscarPorNome')" class="col-xs-12 col-md-4 col-lg-4 q-pt-md q-pl-md q-pr-md">
            <q-btn outline color="primary" label="Buscar por nome" style="width: 100%" icon="search" @click="exibeBuscaNome = true" />
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-md-12 col-lg-12 q-pa-md animated fadeIn fast">
            <app-calendario-lista ref="lista" @agendamento="agendamento" @day="(val) => date = val"
              @imprimir="(val, data) => { imprimir = true; lista = val }" />
          </div>
        </div>
      </div>
    </div>
    <app-busca-nome v-if="exibeBuscaNome" @voltar="exibeBuscaNome = false" />
    <app-venda-imprimir v-if="imprimir" :titulo="`Agendamentos ${date}`" :agendas="lista"
      @voltar="imprimir = false; date = ''" />

    <q-dialog v-model="exibeForm" persistent :maximized="$q.platform.is.mobile">
      <q-card :style="{ 'min-width': $q.platform.is.mobile ? 'auto' : '800px' }">
        <q-card-section>
          <app-vendas-cadastro v-if="!editarVenda" :comissoes="comissoes" :venda="venda"
            @excluiu="exibeForm = false; $refs.lista.recarregaLista()" @salvou="salvou" @editar="editarVenda = true"
            @fechar="exibeForm = false" @reagendado=reagendado />

          <app-venda-cadastro v-if="editarVenda" :venda="venda" :tiposVendas="tiposVendas" :comissoes="comissoes"
            @fechar="exibeForm = false; editarVenda = false" @salvou="salvou" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  QIcon, QBtn, QDialog, QCard, QCardSection,
} from 'quasar'
import appVendasCadastro from './cadastro.vue'
import { retornaTodasComissoesDeVendaAtivas } from '../../services/unidade'
import { retornaTodos } from '../../services/venda-agenda-tipo'
import AppVendaImprimir from './imprimir.vue'
import AppCalendarioLista from './calendario-lista.vue'
import AppVendaCadastro from '../minhas-vendas/cadastro.vue'
import AppBuscaNome from './buscar-nome.vue'
import { retornaPorId } from '../../services/venda-agenda'
import { temPermissao } from '../../util/util'
import AppSelectUnidade from '../../components/select-unidade/main.vue'

export default {

  components: {
    AppSelectUnidade,
    appVendasCadastro,
    AppVendaImprimir,
    AppCalendarioLista,
    AppVendaCadastro,
    AppBuscaNome,
    QIcon,
    QBtn,
    QDialog,
    QCard,
    QCardSection,
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
    temPermissao(permissao) { return temPermissao(permissao) },

    async carregaListas() {
      const tiposVendas = await retornaTodos()
      this.tiposVendas = tiposVendas

      const lista = await retornaTodasComissoesDeVendaAtivas(this.idUnidadeAtual)
      this.comissoes = lista
    },

    reagendado(_idVendaPai, idVenda) {
      this.salvou(idVenda)
    },

    async salvou(idVenda) {
      this.$refs.lista.recarregaLista()
      const venda = await retornaPorId(idVenda)
      this.agendamento(venda)
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
