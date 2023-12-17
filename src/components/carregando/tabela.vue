<template>
  <div class="q-pa-md">
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th class="text-left td-relatorio">
              <q-skeleton height="60px" width="250px" type="text" />
            </th>
            <th class="text-right td-relatorio">
              <q-skeleton height="60px" width="150px" type="text" />
            </th>
            <th class="text-right td-relatorio">
              <q-skeleton height="60px" width="150px" type="text" />
            </th>
            <th class="text-right td-relatorio">
              <q-skeleton height="60px" width="150px" type="text" />
            </th>
            <th class="text-right td-relatorio">
              <q-skeleton height="60px" width="150px" type="text" />
            </th>
            <th class="text-right td-relatorio">
              <q-skeleton height="60px" width="150px" type="text" />
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="n in 10" :key="n" class="text-left">
            <td>
              <q-skeleton type="text" height="30px" width="250px" />
            </td>
            <td>
              <q-skeleton type="text" height="30px" width="150px" />
            </td>
            <td>
              <q-skeleton type="text" height="30px" width="150px" />
            </td>
            <td>
              <q-skeleton type="text" height="30px" width="150px" />
            </td>
            <td>
              <q-skeleton type="text" height="30px" width="150px" />
            </td>
            <td>
              <q-skeleton type="text" height="30px" width="150px" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

import { QSkeleton } from 'quasar'

export default {

  components: {
    QSkeleton,
  },

}

</script>
