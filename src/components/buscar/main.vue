<template>
  <div class="row">
    <div class="col-xs-12 col-md-4 q-mt-md">
      <q-input v-model="termo"
              :loading="buscando"
              label="Buscar"
              :hint="hint"
              @keyup="fazBusca">
        <template v-slot:append>
          <q-icon v-if="termo !== ''"
                  name="close"
                  class="cursor-pointer"
                  @click="limpar()" />
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <div
      class="col-xs-12 col-md-6"
      :class="{'q-pr-md': !$q.platform.is.mobile}">
      <q-btn v-if="temPermissao(permissao)"
            :label="btnLabel"
            color="primary"
            :class="{'q-ml-md' : !$q.platform.is.mobile }"
            :style="{'margin-top' : $q.platform.is.mobile ? '0' : '2.6em' }"
            outline
            @click="novo()" />
    </div>

  </div>
</template>

<script>

import { QIcon, QBtn, QInput } from 'quasar'
import { temPermissao } from '../../util/util'

export default {

  components: {
    QIcon,
    QBtn,
    QInput,
  },

  props: {
    buscando: {
      type: Boolean,
      required: true,
      default: false,
    },

    hint: {
      type: String,
      default: '',
      required: false,
    },

    delay: {
      type: Number,
      required: false,
      default: 600,
    },

    permissao: {
      type: String,
      default: '',
      required: false,
    },

    btnLabel: {
      type: String,
      default: 'Novo',
      required: false,
    },
  },

  data() {
    return {
      termo: '',
      debouce: null,
    }
  },

  methods: {
    temPermissao(permissao) { return temPermissao(permissao) },

    novo() {
      this.$emit('novo')
    },
    limpar() {
      this.termo = ''
      this.$emit('buscar', '')
    },
    fazBusca() {
      if (this.debouce) clearTimeout(this.debouce)

      this.debouce = setTimeout(() => {
        this.$emit('buscar', this.termo)
      }, this.delay)
    },
  },
}
</script>
