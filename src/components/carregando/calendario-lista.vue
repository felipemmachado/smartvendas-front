<template>
  <div>
    <q-card>
      <div class="row">
        <div class="col-md-5 col-xs-12 q-pa-md">
          <q-skeleton width="100%" height="220px" />
          <q-skeleton width="60%" class="q-mt-sm" height="20px" />
          <q-skeleton width="60%" class="q-mt-sm" height="20px" />
        </div>

        <div class="col-md-1"></div>

        <div class="col-md-6 col-xs-12 q-pa-md">
          <div v-if="exibirValor" class="row q-mb-md">
            <div class="col-xs-6">
              <q-skeleton width="60%" height="20px" />
              <q-skeleton width="55%" class="q-mt-sm" height="20px" />
            </div>
            <div class="col-xs-6">
              <q-skeleton width="40%" class="q-mt-sm float-right" height="20px" />
            </div>
          </div>

          <q-skeleton type="QInput" />
          <q-skeleton class="q-mt-md" type="QInput" />
          <q-skeleton class="q-mt-xs" type="QInput" />
          <q-skeleton class="q-mt-xs" type="QInput" />
          <q-skeleton class="q-mt-xs" type="QInput" />

          <div v-if="!exibirValor">
            <q-skeleton class="q-mt-xs" type="QInput" />
            <q-skeleton class="q-mt-xs" type="QInput" />
          </div>

        </div>
      </div>

    </q-card>
  </div>
</template>

<script>

import { QSkeleton, QCard } from 'quasar'

export default {

  components: {
    QSkeleton, QCard,
  },

  props: {
    exibirValor: Boolean,
  },
}

</script>
