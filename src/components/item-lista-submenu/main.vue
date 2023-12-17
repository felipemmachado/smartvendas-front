<template>
<div>
  <q-item v-ripple
      clickable
      tag="a"
      href="#"
      class="q-pa-md"
      @click.prevent.stop="vaiPara(item.rota)">

    <div class="text-center" style="width: 100%">
      <q-avatar :color=" dark ? 'deep-purple-2' : 'indigo-2'"
        :text-color=" dark ? 'deep-purple-9' : 'indigo-9'"
        size="3em"
        :icon="item.icone" />
      <q-item-label style="margin-top: 0.6em; font-size: 1.2em" class="text-h6">
        {{item.titulo}}
      </q-item-label>
    </div>
  </q-item>
</div>
</template>

<script>

import {
  Dark, QItem, QAvatar, QItemLabel,
} from 'quasar'

export default {

  components: {
    QItem, QAvatar, QItemLabel,
  },

  props: {
    item: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      dark: Dark.isActive,
    }
  },
  methods: {
    vaiPara(rota) {
      this.$router.push({ name: rota }).catch(() => {})
    },
  },
}
</script>
