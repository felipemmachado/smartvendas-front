<template>
  <div class="header-container q-mt-sm q-mb-sm">

    <img
      v-if="!$q.dark.isActive"
      :class="{'logo-header': !$q.platform.is.mobile, 'logo-mobile-header': $q.platform.is.mobile}"
      src="../../../assets/imagens/logo_sistema.png" />
    <img
      v-else
      :class="{'logo-header': !$q.platform.is.mobile, 'logo-mobile-header': $q.platform.is.mobile}"
      src="../../../assets/imagens/logo_negativa.png" />

    <q-tabs
            v-if="!$q.platform.is.mobile"
            v-model="menuAtual"
            content-class="tab"
            align="center"
            inline-label
            dense>
      <q-tab v-for="(item, index) in menusAceitos" :key="index"
              :ripple="false"
              no-caps
              :name="item.rota"
              :icon="item.icone"
              :label="item.titulo"
              :class="{'text-white': $q.dark.isActive, 'text-black': !$q.dark.isActive }"
              @click="$emit('click-menu', item.rota)" />
    </q-tabs>

    <app-usuario :nome="nome" :inicias="inicias" :login="login" @sair="$emit('sair')" />
  </div>
</template>

<script>

import {
  QTabs,
  QTab,
} from 'quasar'
import { temPermissao } from '../../../util/util'
import appUsuario from './usuario.vue'

export default {

  components: {
    appUsuario,
    QTabs,
    QTab,
  },

  props: {
    menus: Array,
    nome: String,
    inicias: String,
    login: String,
    rota: String,
  },

  data() {
    return {
      menuAtual: this.rota,
      menusAceitos: [],
    }
  },

  watch: {
    rota: {
      handler(val) {
        this.menuAtual = val
      },
    },
  },

  beforeMount() {
    this.menusAceitos = this.menus.filter((p) => temPermissao(p.regra))
  },

}
</script>

<style lang="scss">

.q-header .q-tab__content, .q-header .q-tab__content {
  min-width: 64px !important;
  display: flex;
  flex-direction: row !important;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  & > .logo-header {
    width: 150px;
  }

  & > .logo-mobile-header {
    width: 120px;
    margin-left: 10px;
  }

  & > .q-tabs {
    height: 54px;

    & > .q-tab {
      padding: 0;
    }
  }

  & > .q-tabs > .q-tabs__content > .q-tab {
    .q-tab__indicator {
      height: 4px !important;
      border-radius: 2px !important;
      margin-bottom: 6px !important;
      margin-right: 11% !important;
      margin-left: 15% !important;
      color: var(--q-color-primary) !important;
    }
  }

  & > .q-tabs > .q-tabs__content > .q-tab > .q-tab__content > {
    .q-tab__icon {
      color: var(--q-color-primary);
      width: 20px;
    }
  }
}

</style>
