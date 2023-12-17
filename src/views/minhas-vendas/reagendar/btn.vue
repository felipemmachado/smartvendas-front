<template>
<div>

  <div v-if="data != null" class="row">
    <div class="col-xs-12 text-primary q-mb-md">
      <q-icon name="info"/> Venda reagendada para {{data}} às {{hora}}.
    </div>
  </div>

  <app-modal-reagendar :venda="venda"
    :exibir="exibeModalReagendar"
    @fechou="exibeModalReagendar = false"
    @reagendado="(item) => $emit('reagendado', item)" />

  <q-btn v-if="data == null ? exibir : false"
    label="Reagendar"
    icon="o_calendar_month"
    class="q-mb-md"
    color="primary"
    @click="exibeModalReagendar = true"></q-btn>
</div>
</template>

<script>
import { QBtn, QIcon } from 'quasar'
import AppModalReagendar from './modal.vue'
import { formatDateSql } from '../../../util/util'

export default {
  components: {
    AppModalReagendar,
    QBtn,
    QIcon,
  },
  props: {
    exibir: {
      type: Boolean,
      require: true,
      default: false,
    },
    venda: {
      type: Object,
      require: true,
      default: () => {},
    },
  },

  data() {
    return {
      exibeModalReagendar: false,
    }
  },

  computed: {
    data() {
      if (this.venda != null) if (this.venda.dataReagendamento != null) return formatDateSql(this.venda.dataReagendamento.split('T')[0])

      return null
    },
    hora() {
      if (this.venda != null) if (this.venda.dataReagendamento != null) return this.venda.dataReagendamento.split('T')[1]

      return null
    },
  },
}
</script>
