<template>
  <div class="footer-container q-mt-sm q-mb-sm">
    <q-tabs
            v-model="menuAtual"
            content-class="tab"
            class="tab"
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
  </div>
</template>

<script>

import {
  QTabs,
  QTab,
} from 'quasar'
import { temPermissao } from '../../../util/util'

export default {

  components: {
    QTabs,
    QTab,
  },

  props: {
    menus: Array,
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

.q-header .q-tab__content, .q-footer .q-tab__content {
  display: flex;
  flex-direction: column;
}

.footer-container {

  & > .tab {
    padding-bottom: calc(1.6rem + env(safe-area-inset-bottom));
  }

  & > .q-tabs > .q-tabs__content > .q-tab {
    padding: 2px 0px 10px 0px;
    width: 100%;

    .q-tab__indicator {
      height: 4px !important;
      border-radius: 2px !important;
      margin-bottom: 6px !important;
      margin-right: 10% !important;
      margin-left: 10% !important;
      color: var(--q-color-primary);
    }
  }

  & > .q-tabs > .q-tabs__content > .q-tab > .q-tab__content > {

    .q-tab__label {
      padding-left: 0px !important;
      font-size: 12px !important;
      margin-top: 8px;
    }

    .q-tab__icon {
      font-size: 28px;
      width: 100% !important;
      color: var(--q-color-primary);
    }
  }
}

</style>
