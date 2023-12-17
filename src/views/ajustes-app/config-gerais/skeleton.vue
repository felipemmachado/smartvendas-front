<template>
  <div>
    <q-card>
      <q-card-section>
        <div class="row">
          <div class="col-md-4 col-xs-2"></div>
          <div class="col-md-4 col-xs-8">
            <q-skeleton class="q-mt-lg" type="QInput" />
          </div>
        </div>

        <q-skeleton class="q-mt-lg" type="QInput" />
        <q-skeleton class="q-mt-lg" type="QInput" />
        <q-skeleton class="q-mt-lg" height="200px" />
        <q-skeleton class="q-mt-lg" height="200px" />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>

import { QSkeleton, QCard, QCardSection } from 'quasar'

export default {
  components: {
    QSkeleton,
    QCard,
    QCardSection,
  },
}

</script>
