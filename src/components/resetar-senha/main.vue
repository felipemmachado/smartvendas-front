<template>
  <div>
    <q-form @submit="clickAlterarSenha">
      <q-input v-if="exibeSenhaAtual" ref="senhaAtual" v-model="atual"
        :rules="[val => !!val || 'A senha atual é obrigatório']" class="q-pb-lg q-mb-sm" outlined  :type="exibirAntiga ? 'text' : 'password'"
        label="Senha atual">
        <template v-slot:append>
          <q-icon v-if="exibirAntiga" round flat name="visibility_off" style="cursor: pointer"
            @click="exibirAntiga = !exibirAntiga" />
          <q-icon v-else flat round name="visibility" style="cursor: pointer" @click="exibirAntiga = !exibirAntiga" />
        </template>
      </q-input>
      <q-input ref="senha" v-model="senha" :rules="[
      val => !!val || 'A nova senha é obrigatório',
      val => val != senhaAtual || 'A senha precisa ser diferente da atual']" class="q-pb-lg q-mb-sm"
        :type="exibirSenha ? 'text' : 'password'" outlined label="Nova senha">
        <template v-slot:append>
          <q-icon v-if="exibirSenha" round flat name="visibility_off" style="cursor: pointer"
            @click="exibirSenha = !exibirSenha" />
          <q-icon v-else flat round name="visibility" style="cursor: pointer" @click="exibirSenha = !exibirSenha" />
        </template>
      </q-input>
      <q-input ref="reSenha" v-model="reSenha" :rules="[
      val => !!val || 'A confirmação da senha é obrigatório',
      val => val == senha || 'As senhas não são iguais']" class="q-pb-lg" outlined
        :type="exibirReSenha ? 'text' : 'password'" label="Confirme a senha">
        <template v-slot:append>
          <q-icon v-if="exibirReSenha" round flat name="visibility_off" style="cursor: pointer"
            @click="exibirReSenha = !exibirReSenha" />
          <q-icon v-else flat round name="visibility" style="cursor: pointer" @click="exibirReSenha = !exibirReSenha" />
        </template>
      </q-input>
      <q-separator class="q-mt-md"></q-separator>
      <div class="row">
        <div class="col-xs-12">
          <q-btn color="primary" icon="check" type="submit" :disable="alterando" :loading="alterando"
            class="q-mt-lg float-right" label="Alterar Senha" />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script>
import {
  QForm,
  QInput,
  QIcon,
  QBtn,
  QSeparator,
} from 'quasar'
import { alterarSenha } from '../../services/usuario'

export default {

  components: {
    QForm,
    QInput,
    QIcon,
    QBtn,
    QSeparator,
  },

  props: {
    senhaAtual: {
      type: String,
      required: false,
      default: '',
    },
    exibeSenhaAtual: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      exibirAntiga: false,
      exibirReSenha: false,
      exibirSenha: false,
      senha: '',
      reSenha: '',
      atual: this.senhaAtual,
      alterando: false,
    }
  },

  methods: {
    async clickAlterarSenha() {
      const senhaAtual = this.exibeSenhaAtual ? this.$refs.senhaAtual.validate() : true
      const senha = this.$refs.senha.validate()
      const reSenha = this.$refs.reSenha.validate()
      if (!senhaAtual || !senha || !reSenha) {
        this.$q.notify({
          type: 'negative',
          position: 'top-right',
          message: 'Corrija os campos em vermelho.',
        })
      } else {
        this.alterando = true
        const response = await alterarSenha(this.atual, this.senha, this.reSenha)
        this.alterando = false
        if (response.success) {
          this.$emit('alterou-senha', this.senha)

          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Senha alterada com sucesso.',
          })
        }
      }
    },
  },
}
</script>
