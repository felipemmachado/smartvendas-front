<template>
  <div class="row">
    <div class="col-xs-12">
      <div class="text-h6 q-mb-md">

        <span v-if="editar" v-html="textoEditar"></span>

        <span v-else v-html="textoNovo"></span>

        <q-btn v-if="exibeFechar" rounded dense class="float-right" flat icon="close" @click="$emit('fechar')" />

        &nbsp;<q-badge v-if="badge" color="orange" align="middle">{{ badge }}</q-badge>
      </div>
    </div>
  </div>
</template>

<script>

import {
  QBtn,
  QBadge,
} from 'quasar'

export default {

  components: {
    QBtn,
    QBadge,
  },

  props: {
    textoEditar: {
      type: String,
      required: false,
      default: '',
    },
    textoNovo: {
      type: String,
      required: true,
      default: '',
    },
    editar: {
      type: Boolean,
      required: false,
      default: false,
    },
    badge: {
      type: String,
      required: false,
      default: null,
    },
    iconeNovo: {
      type: String,
      required: false,
      default: 'add',
    },
    exibeFechar: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
}
</script>
