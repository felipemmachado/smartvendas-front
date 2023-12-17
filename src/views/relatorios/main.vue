<template>
  <div>
    <div class="row">
      <div class="col-xs-12 q-pt-md q-pl-md">
        <div class="text-h5">
          <q-icon class="text-primary icone-correcao" name="o_assessment" />
          Relatórios
        </div>
      </div>
    </div>
    <div class="row">
      <div v-for="(item, index) in relatorios"
          v-show="temPermissao(item.permissao)"
          :key="index"
          class="col-lg-4 col-xs-12 animated fadeInUp fast q-pa-md">
        <q-card>
          <app-item-lista-submenu :item="item"></app-item-lista-submenu>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>

import {
  QIcon, QCard,
} from 'quasar'
import { temPermissao } from '../../util/util'
import AppItemListaSubmenu from '../../components/item-lista-submenu/main.vue'

export default {

  components: {
    AppItemListaSubmenu,
    QIcon,
    QCard,
  },

  data() {
    return {
      relatorios: [
        {
          icone: 'attach_money',
          rota: 'venda-mes',
          titulo: 'Vendas',
          permissao: 'AcessarRelatorioVendasPorMes',
        },
        {
          icone: 'attach_money',
          rota: 'venda-mes-tipo',
          titulo: 'Vendas por Tipos',
          permissao: 'AcessarRelatorioVendasPorTipo',
        },
        {
          icone: 'attach_money',
          rota: 'venda-mes-unidade',
          titulo: 'Vendas por Unidade',
          permissao: 'AcessarRelatorioVendasPorMesUnidade',
        },
        {
          icone: 'attach_money',
          rota: 'venda-consultor',
          titulo: 'Vendas por Consultor',
          permissao: 'AcessarRelatorioVendasPorConsultor',
        },
        {
          icone: 'attach_money',
          rota: 'pagamento-mes',
          titulo: 'Pagamentos por Mês',
          permissao: 'AcessarRelatorioPagamentoPorMes',
        },
        {
          icone: 'attach_money',
          rota: 'clientes-fechados',
          titulo: 'Clientes Fechados',
          permissao: 'AcessarRelatorioClientesFechados',
        },
        {
          icone: 'attach_money',
          rota: 'pagameto-comissao-unidade-mes',
          titulo: 'Pagamentos Comissão Unidade',
          permissao: 'AcessarRelatorioComissaoUnidade',
        },
      ],
    }
  },

  methods: {
    temPermissao(permissao) { return temPermissao(permissao) },
  },
}
</script>
