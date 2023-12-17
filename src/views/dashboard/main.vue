<template>
  <div>
    <div class="row q-pt-md q-pl-md">
        <div class="col-xs-6 col-md-7">
          <div class="text-h5">
            <q-icon class="text-primary icone-correcao" name="o_dashboard" />
            Início
          </div>
        </div>
      </div>
    <router-view></router-view>
  </div>
</template>

<script>

import { QIcon } from 'quasar'
import { temPermissao } from '../../util/util'

export default {

  components: {
    QIcon,
  },

  created() {
    if (this.$route.name === 'dashboard') {
      if (temPermissao('AcessarDashboardDiretoria')) {
        this.$router.push({ name: 'dashboard-diretor' }).catch(() => {})
      } else

      if (temPermissao('AcessarDashboardUnidade')) {
        this.$router.push({ name: 'dashboard-unidade' }).catch(() => {})
      } else

      if (temPermissao('AcessarMeuTimeDeVendas')) {
        this.$router.push({ name: 'dashboard-meu-time-vendas' }).catch(() => {})
      } else

      if (temPermissao('AcessarMinhasVendas')) {
        this.$router.push({ name: 'dashboard-minhas-vendas' }).catch(() => {})
      } else {
        this.$router.push({ name: 'inicio' }).catch(() => {})
      }
    }
  },
}
</script>
