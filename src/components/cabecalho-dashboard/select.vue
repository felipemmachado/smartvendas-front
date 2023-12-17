<template>
<div>
  <q-btn-dropdown
    style="width:100%"
    outline
    color="primary"
    :label="`${rota.nome}`">
    <q-list>
      <q-item
        v-for="item in dashbords"
        :key="item.rota"
        v-close-popup
        clickable
        @click.prevent="vaiPara(item)">
        <q-item-section>
          <q-item-label>{{item.nome}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</div>
</template>

<script>

import {
  QBtnDropdown, QList, QItem, QItemSection, QItemLabel,
} from 'quasar'
import { temPermissao } from '../../util/util'

export default {

  components: {
    QBtnDropdown,
    QList,
    QItem,
    QItemSection,
    QItemLabel,
  },

  data() {
    return {
      rota: null,
      dashbords: [],
    }
  },

  beforeMount() {
    const todasVendas = { nome: 'Todas as vendas'.toUpperCase(), rota: 'dashboard-diretor' }
    const vendarPorConsultor = { nome: 'Vendas por consultor'.toUpperCase(), rota: 'dashboard-usuario' }
    const unidades = { nome: 'Vendas da unidade'.toUpperCase(), rota: 'dashboard-unidade' }
    const timeDeVendas = { nome: 'Vendas do meu time'.toUpperCase(), rota: 'dashboard-meu-time-vendas' }
    const minhasVendas = { nome: 'Minhas vendas'.toUpperCase(), rota: 'dashboard-minhas-vendas' }

    if (temPermissao('AcessarDashboardDiretoria')) {
      this.dashbords.push(todasVendas)
      this.dashbords.push(vendarPorConsultor)
    }

    if (temPermissao('AcessarDashboardUnidade')) {
      this.dashbords.push(unidades)
    }

    if (temPermissao('AcessarMinhasVendas')) {
      this.dashbords.push(minhasVendas)
    }

    if (temPermissao('AcessarMeuTimeDeVendas')) {
      this.dashbords.push(timeDeVendas)
    }

    if (this.$route.name === 'dashboard-unidade') {
      this.rota = unidades
    }

    if (this.$route.name === 'dashboard-usuario') {
      this.rota = vendarPorConsultor
    }

    if (this.$route.name === 'dashboard-diretor') {
      this.rota = todasVendas
    }

    if (this.$route.name === 'dashboard-meu-time-vendas') {
      this.rota = timeDeVendas
    }

    if (this.$route.name === 'dashboard-minhas-vendas') {
      this.rota = minhasVendas
    }
  },

  mounted() {

  },

  methods: {
    vaiPara(rota) {
      this.$router.push({ name: rota.rota }).catch(() => {})
    },
  },
}
</script>

<style lang="scss" scoped>
.select-unidade {
  font-size:14px;
  margin-left: 1em;
  padding-top: 0.5em;
  padding-bottom: 0.5em
}
</style>
