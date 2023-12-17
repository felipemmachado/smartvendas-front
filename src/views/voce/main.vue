<template>
<div class="row q-mt-md animated fadeIn fast">
  <div class="col-md-4 col-xs-12"></div>
  <div class="col-md-4 col-xs-12 q-pa-md">
    <q-card class="q-mb-md">
      <q-list bordered class="rounded-borders">
        <q-item v-ripple clickable
          tag="a"
          href="#"
          @click.prevent="$router.push({ name: 'meus-dados' })">
          <q-item-section avatar top>
            <q-avatar class="text-white" color="primary">
              {{iniciasNome(sessao.nome)}}
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{sessao.nome}}</q-item-label>
            <q-item-label caption>Altere Seus dados</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="keyboard_arrow_right" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <q-card>
      <q-list bordered class="rounded-borders">
        <q-item v-ripple clickable
          tag="a"
          href="#"
          @click.prevent="$router.push({ name: 'mudar-senha' })">
          <q-item-section avatar>
            <q-icon name="o_vpn_key" color="primary" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Alterar Senha</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="keyboard_arrow_right" />
          </q-item-section>
        </q-item>
        <q-separator ></q-separator>
        <q-item v-ripple clickable
          tag="a"
          href="#"
          @click.prevent="$router.push({ name: 'dados-bancario' })">
          <q-item-section avatar>
            <q-icon color="primary" name="o_payment" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Conta Bancária</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="keyboard_arrow_right" />
          </q-item-section>
        </q-item>
        <q-separator ></q-separator>
        <q-item v-ripple clickable
          tag="a"
          href="#"
          @click.prevent="$router.push({ name: 'tema' })">
          <q-item-section avatar>
            <q-icon color="primary" name="o_palette" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Tema</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="keyboard_arrow_right" />
          </q-item-section>
        </q-item>

      </q-list>
    </q-card>
  </div>
</div>

</template>

<script>

import { mapState } from 'vuex'
import {
  QCard, QList, QItem, QItemSection, QItemLabel, QIcon, QSeparator, QAvatar,
} from 'quasar'
import { iniciasNome } from '../../util/util'

export default {

  components: {
    QCard, QList, QItem, QItemSection, QItemLabel, QIcon, QSeparator, QAvatar,
  },

  computed: {
    ...mapState({
      sessao: (state) => state.sessao.user,
    }),
  },

  methods: {
    iniciasNome(nome) { return iniciasNome(nome) },
  },
}
</script>
