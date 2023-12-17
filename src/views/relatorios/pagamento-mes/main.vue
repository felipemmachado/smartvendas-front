<template>
  <div>

    <div class="no-print">
      <app-btn-voltar label="Relatórios" cls="q-ml-md q-mt-md" rota="relatorios" />

      <div class="q-ml-md q-mt-md">
        <div class="text-h5">
          <q-icon class="text-primary icone-correcao" name="attach_money" />
          Pagamento por Mês
        </div>
      </div>

      <div class="row q-ma-md">
        <div class="col-xs-12 col-md-4" :class="{'q-pr-md': !$q.platform.is.mobile}">
          <app-mes-ano @mudou="(val) => {
            this.mes = val.mes;
            this.ano = val.ano;
            this.buscou = false;
            this.relatorio = [];
          }" />
        </div>
        <div class="col-xs-12 col-md-2 q-mb-md">
          <q-btn color="primary" class="full-width" label="Carregar" style="margin-top:1.4em" :disable="carregando"
            icon="refresh" @click="carregarRelatorio()" />
        </div>
        <div class="col-md-4 col-xs-12"></div>
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
        Pagamento - ${nomeMes} de ${ano}
        </span>`" />
        <div class="table-responsive">
          <table class="table" style="min-width: 1024px;" border="0">
            <thead>
              <tr>
                <th style="width: 25%" class="td-relatorio text-left">Nome</th>
                <th class="td-relatorio text-center">CPF</th>
                <th class="td-relatorio text-center">Banco</th>
                <th class="td-relatorio text-center">Agência</th>
                <th class="td-relatorio text-center">Conta</th>
                <th style="width: 10%" class="td-relatorio text-center">Valor a Pagar</th>
                <th style="width: 10%" class="td-relatorio text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in relatorio" :key="index">
                <td class="td-relatorio">{{ item.nome }}</td>
                <td class="td-relatorio text-center">{{ item.cpf }}</td>
                <td class="td-relatorio text-center">{{ item.banco }}</td>
                <td class="td-relatorio text-center">{{ item.agencia }}</td>
                <td class="td-relatorio text-center" style="width: 10%">{{ item.conta }}
                  <span v-if="item.tipoConta">
                    ({{ item.tipoConta == 1 ? 'Corrente' : 'Poupança' }})
                  </span>
                </td>
                <td class="td-relatorio text-center">
                  {{ item.totalVendaGeral | formatMoney }}
                </td>
                <td class="td-relatorio text-center">
                  <q-btn class="no-print" style="min-width: 110px" :color="item.pagamento == null ?
                  'primary' :
                  item.pagamento.status === 1 ? 'blue' : 'green'" size="sm" @click="exibeModal(item)">
                    <span v-if="item.pagamento == null">Em aberto</span>
                    <span v-else>
                      <span v-if="item.pagamento.status === 1">Enviado</span>
                      <span v-if="item.pagamento.status === 2">Pago</span>
                    </span>
                    <q-icon name="refresh"></q-icon>
                  </q-btn>

                  <span class="print">
                    <span v-if="item.pagamento == null">Em aberto</span>
                    <span v-else>
                      <span v-if="item.pagamento.status === 1">Enviado</span>
                      <span v-if="item.pagamento.status === 2">Pago</span>
                    </span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </q-card-section>
    </q-card>

    <q-dialog v-model="exibeAlterarStatus" persistent :maximized="$q.platform.is.mobile">
      <q-card :style="{ 'min-width': $q.platform.is.mobile ? 'auto' : '350px' }">
        <q-card-section>
          <div class="text-h6">Status do Pagamento</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-select v-model="statusPagamento" label="Selecione" :options="['Enviado', 'Pago']" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn v-close-popup flat label="Cancelar" @click="statusPagamento = ''" />
          <q-btn label="Salvar" icon="check" color="primary" :disable="statusPagamento === ''"
            :loading="atualizandoStatus" @click="atualizarPagameto" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  QIcon, QBtn, QCard, QCardSection, QCardActions, QDialog, QSelect,
} from 'quasar'
import { mesNome, orderBy } from '../../../util/util'
import { postPagamento, putPagamento, obterPagamentos } from '../../../services/usuario'
import { vendas } from '../../../services/relatorios'
import formatMoney from '../../../filters/format-money'
import AppCabecalhoPrint from '../../../components/cabecalho-print/main.vue'
import AppMesAno from '../../../components/mes-ano/main.vue'
import AppBtnVoltar from '../../../components/btn-voltar/main.vue'
import AppCarregando from '../../../components/carregando/main.vue'

export default {

  components: {
    AppCabecalhoPrint,
    AppMesAno,
    AppBtnVoltar,
    AppCarregando,
    QIcon,
    QBtn,
    QCard,
    QCardSection,
    QDialog,
    QCardActions,
    QSelect,
  },

  filters: { formatMoney },

  data() {
    return {
      exibeAlterarStatus: false,
      relatorio: [],
      carregando: false,
      buscou: false,
      mes: 0,
      ano: 0,
      qtdVendaTotal: 0,
      valorVendaTotal: 0,
      qtdVendaRepresentanteTotal: 0,
      valorVendaRepresentateTotal: 0,
      total: 0,
      itemAlterarStatus: null,
      statusPagamento: '',
      atualizandoStatus: false,
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

    exibeModal(item) {
      if (item.pagamento == null) {
        // this.statusPagamento = 'Aberto';
      } else if (item.pagamento.status === 1) {
        this.statusPagamento = 'Enviado'
      } else {
        this.statusPagamento = 'Pago'
      }
      this.itemAlterarStatus = item
      this.exibeAlterarStatus = true
    },

    async atualizarPagameto() {
      this.atualizandoStatus = true

      // post
      if (this.itemAlterarStatus.pagamento == null) {
        const data = {
          idUsuario: this.itemAlterarStatus.idUsuario,
          status: this.retornaIdStatus(this.statusPagamento),
          mes: this.mes,
          ano: this.ano,
        }

        const response = await postPagamento(data)
        if (response.success) {
          this.statusAtualizado()
        }
      } else { // put
        this.itemAlterarStatus.pagamento.status = this.retornaIdStatus(this.statusPagamento)
        const response = await putPagamento(this.itemAlterarStatus.pagamento)
        if (response.success) {
          this.statusAtualizado()
        }
      }
    },

    async statusAtualizado() {
      const pagamentos = await obterPagamentos(this.mes, this.ano)
      this.atualizaPagamentos(pagamentos)
      this.atualizandoStatus = false
      this.exibeAlterarStatus = false
      this.$q.notify({
        type: 'positive',
        position: 'top',
        message: 'Status atualizado.',
      })
    },

    retornaIdStatus(status) {
      if (status === 'Pago') return 2
      if (status === 'Enviado') return 1
      return ''
    },

    async carregarRelatorio() {
      if (this.carregando) return

      this.carregando = true
      this.relatorio = []
      this.buscou = false
      this.qtdVendaTotal = 0
      this.valorVendaTotal = 0
      this.qtdVendaRepresentanteTotal = 0
      this.valorVendaRepresentateTotal = 0
      this.total = 0

      const lista = await vendas(null, this.mes, this.ano)
      this.relatorio = lista.map((item) => {
        const it = item
        this.qtdVendaTotal += Number(item.qtdVenda)
        this.valorVendaTotal += Number(item.totalVenda)
        this.qtdVendaRepresentanteTotal += Number(item.qtdVendaRepresentante)
        this.valorVendaRepresentateTotal += Number(item.totalVendaRepresentante)
        this.total += Number(item.totalVendaGeral)
        it.pagamento = null
        return it
      })

      const pagamentos = await obterPagamentos(this.mes, this.ano)
      this.atualizaPagamentos(pagamentos)

      this.relatorio = orderBy(this.relatorio, 'nome')

      this.carregando = false
      this.buscou = true
    },

    atualizaPagamentos(pagamentos) {
      this.relatorio.map((item) => {
        const it = item
        const pagamento = pagamentos.find((x) => x.idUsuario === item.idUsuario)
        if (pagamento) {
          it.pagamento = pagamento
        }
        return it
      })
    },
  },
}
</script>
