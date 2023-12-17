<template>
  <div>
    <div v-if="sessao">
      <div v-if="sessao.unidades.length == 1" class="select-unidade text-center">
        <h6 class="q-mt-xs q-mb-xs">{{ sessao.unidadeAtual.nome.toUpperCase() }}</h6>
      </div>
      <q-btn-dropdown v-if="sessao.unidadeAtual && sessao.unidades.length > 1" style="width:100%" outline
        color="primary" :label="`${sessao.unidadeAtual.nome}`">
        <q-tooltip>
          ALTERE A UNIDADE ATUAL
        </q-tooltip>
        <q-list>
          <q-item v-for="(unidade, index) in sessao.unidades" :key="index" v-close-popup clickable
            @click.prevent="setaUnidade(unidade)">
            <q-item-section>
              <q-item-label>{{ unidade.nome }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
  </div>
</template>

<script>

import {
  QBtnDropdown, QList, QItem, QItemSection, QItemLabel, QTooltip,
} from 'quasar'

import { mapActions, mapState } from 'vuex'

export default {

  components: {
    QBtnDropdown, QList, QItem, QItemSection, QItemLabel, QTooltip,
  },

  computed: {
    ...mapState({
      sessao: (state) => state.sessao.user,
    }),
  },

  mounted() {
    this.$emit('unidade-atual', this.sessao.unidadeAtual)
  },

  methods: {
    ...mapActions(['setSession', 'setUnidade']),

    setaUnidade(unidade) {
      this.setUnidade(unidade)
      document.location.reload()
    },
  },
}
</script>

<style lang="scss" scoped>
.select-unidade {
  font-size: 14px;
  margin-left: 1em;
  padding-top: 0.5em;
  padding-bottom: 0.5em
}
</style>
