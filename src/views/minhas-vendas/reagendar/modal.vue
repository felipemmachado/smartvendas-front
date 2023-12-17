<template>
<div>
  <q-dialog v-model="exibirModal" :maximized="$q.platform.is.mobile">
    <q-card :style="{'min-width' : $q.platform.is.mobile ? 'auto' : '500px'}">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Reagendar</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="$emit('fechou')" />
      </q-card-section>
      <q-card-section>
        <app-reagendar :venda="venda" @reagendado="(item) => {
          $emit('reagendado', item);
          exibirModal = false;
        }" />
      </q-card-section>
    </q-card>
  </q-dialog>
</div>
</template>

<script>
import {
  QDialog, QCard, QCardSection, QSpace, QBtn,
} from 'quasar'
import AppReagendar from './main.vue'

export default {
  components: {
    AppReagendar,
    QDialog,
    QCard,
    QCardSection,
    QSpace,
    QBtn,
  },
  props: {
    venda: {
      type: Object,
      required: false,
      default: () => {},
    },
    exibir: {
      type: Boolean,
      require: false,
      default: false,
    },
  },

  data() {
    return {
      exibirModal: false,
    }
  },

  watch: {
    exibir: {
      handler(val, odlVal) {
        if (val !== odlVal) {
          this.exibirModal = val
        }
      },
    },
  },
}
</script>
