<template>
  <div>
    <div class="row q-mt-md">
      <div v-for="index in 12" :key="index"
          class="col-xs-12 col-md-3 q-mb-md" :class="{'q-pr-md': !$q.platform.is.mobile}">
          <q-skeleton width="100%" :height="height" class="q-mb-sm" />
      </div>
    </div>
  </div>
</template>

<script>

import { QSkeleton } from 'quasar'

export default {

  components: {
    QSkeleton,
  },

  props: {
    height: {
      type: String,
      default: '140px',
    },
  },
}

</script>
