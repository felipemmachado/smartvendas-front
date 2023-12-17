<template>
  <div>
    <q-form @submit="efatuaLogin">

      <q-input
        ref="login"
        v-model="login"
        :disable="entrando"
        class="q-pb-lg q-mb-sm"
        type="text"
        outlined
        :rules="[val => !!val || 'O login é obrigatório']"
        label="login" />
      <q-input
        ref="senha"
        v-model="senha"
        outlined
        :disable="entrando"
        :rules="[val => !!val || 'A senha é obrigatório']"
        class="q-pb-xl"
        :type="exibirSenha ? 'text' : 'password'"
        label="senha">
          <template v-slot:append>
            <q-icon v-if="exibirSenha"
              round
              flat
              name="visibility_off"
              style="cursor: pointer"
              @click="exibirSenha = !exibirSenha" />
            <q-icon v-else
              flat
              round
              name="visibility"
              style="cursor: pointer"
              @click="exibirSenha = !exibirSenha" />
          </template>
      </q-input>

      <q-btn color="primary"
              size="lg"
              type="submit"
              :disable="entrando"
              :loading="entrando"
              class="full-width"
              label="Entrar">
      </q-btn>
    </q-form>
  </div>
</template>

<script>

import {
  QBtn,
  QInput,
  QForm,
  QIcon,
} from 'quasar'

export default {

  components: {
    QBtn,
    QInput,
    QForm,
    QIcon,
  },

  props: {
    entrando: {
      type: Boolean,
      required: true,
      default: false,
    },
  },

  data() {
    return {
      exibirSenha: false,
      login: null,
      senha: null,
    }
  },

  methods: {
    efatuaLogin() {
      this.$emit('login', this.login, this.senha)
    },
  },
}
</script>
