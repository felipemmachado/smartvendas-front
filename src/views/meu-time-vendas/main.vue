<template>
  <div>
    <div class="row">
      <div class="col-xs-12 q-pt-md q-pl-md">
        <div class="text-h5">
          <q-icon class="text-primary icone-correcao" name="o_group_work" />
          Time de Vendas
        </div>
      </div>
    </div>
    <div class="row">
      <div
        v-for="(item, index) in lista"
        v-show="temPermissao(item.permissao)"
        :key="index"
        class="col-lg-4 col-xs-12 animated fadeInUp fast q-pa-md"
      >
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
          icone: 'o_perm_contact_calendar',
          rota: 'meu-time-vendas-cadastro',
          titulo: 'Usuários',
          permissao: '',
        },
        {
          icone: 'o_calendar_month',
          rota: 'meu-time-vendas-agenda',
          titulo: 'Vendas',
          permissao: '',
        },
      ],
    }
  },

  methods: {
    temPermissao(permissao) { return temPermissao(permissao) },
  },
}
</script>
