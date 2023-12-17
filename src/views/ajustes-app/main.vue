<template>
<div>
  <div class="row">
    <div class="col-xs-12 q-pt-md q-pl-md">
    <div class="text-h5">
        <q-icon class="text-primary icone-correcao" name="o_tune" />
        Ajustes
    </div>
    </div>
  </div>
  <div class="row">
    <div v-for="(item, index) in lista"
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

import { QIcon, QCard } from 'quasar'
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
      lista: [
        {
          icone: 'o_tune',
          rota: 'configuracoes-gerais',
          titulo: 'Configurações Gerais',
          permissao: '',
        },
        {
          icone: 'o_all_inbox',
          rota: 'venda-agenda-tipo',
          titulo: 'Tipos de Venda',
          permissao: '',
        },
        {
          icone: 'o_perm_contact_calendar',
          rota: 'usuario',
          titulo: 'Usuários',
          regra: 'AcessarCadastroUsuario',
        },
        {
          icone: 'o_place',
          rota: 'unidade',
          titulo: 'Unidades',
          regra: 'AcessarCadastroUndiade',
        },
        {
          icone: 'o_attach_money',
          rota: 'venda-comissao',
          titulo: 'Comissões',
          regra: 'AcessarCadastroComissao',
        },
        {
          icone: 'o_get_app',
          rota: 'exportar-agendamentos',
          titulo: 'Exportar',
          regra: 'AcessarCadastroUndiade',
        },
      ],
    }
  },

  methods: {
    temPermissao(permissao) { return temPermissao(permissao) },
  },
}
</script>
