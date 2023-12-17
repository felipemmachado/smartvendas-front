<template>
<div>
  <q-btn :label="label"
        :class="cls"
        outline
        color="primary"
        icon="keyboard_backspace"
        @click="rota ? $router.push({ name: rota }) : $emit('voltar')"></q-btn>
</div>
</template>

<script>

import { QBtn } from 'quasar'

export default {

  components: {
    QBtn,
  },

  props: {
    cls: {
      type: String,
      required: false,
      default: null,
    },
    label: {
      type: String,
      required: false,
      default: 'voltar',
    },
    rota: {
      type: String,
      required: false,
      default: null,
    },
  },
}
</script>
