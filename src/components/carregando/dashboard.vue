<template>
  <div>
    <div class="row q-col-gutter-md" style="padding-left: .8em; padding-right: .8em">
      <div  v-for="(i) in 5" :key="i" class="col-md-6 col-sm-6 col-lg-6 col-xs-12">
        <div class="row q-col-gutter-md">
          <div class="col-xs-12 col-md-6">
            <q-skeleton width="100%" height="75px" class="q-mb-sm" />
            <q-skeleton width="100%" height="75px" class="q-mb-sm" />
            <q-skeleton width="100%" height="75px" class="q-mb-sm" />
          </div>
          <div class="col-xs-12 col-md-6">
            <q-skeleton width="100%" height="241px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { QSkeleton } from 'quasar'

export default {

  components: { QSkeleton },

}
</script>
