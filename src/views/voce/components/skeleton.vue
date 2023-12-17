<template>
  <div>
    <q-card>
      <q-card-section>
        <q-skeleton type="QInput" class="q-mb-lg" />
        <q-skeleton type="QInput" class="q-mb-lg" />
        <q-skeleton type="QInput" class="q-mb-lg" />
        <q-skeleton type="QInput" class="q-mb-lg" />
        <q-skeleton type="QInput" class="q-mb-lg" />

        <q-separator class="q-mt-md"></q-separator>

        <div style="height: 50px;">
          <q-skeleton type="QBtn" class="q-mb-lg q-mt-md float-right" />
        </div>

      </q-card-section>

    </q-card>
  </div>
</template>

<script>

import {
  QCard, QCardSection, QSkeleton, QSeparator,
} from 'quasar'

export default {
  components: {
    QCard, QCardSection, QSkeleton, QSeparator,
  },

}
</script>
