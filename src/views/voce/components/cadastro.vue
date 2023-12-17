<template>
  <div>
    <div class="row q-mt-md animated fadeIn fast">
      <div class="col-md-3 col-xs-12"></div>
      <div class="col-md-6 col-xs-12">

        <app-btn-voltar cls="q-ml-md" rota="voce" />

        <div class="text-h5 q-ml-md q-mt-md">
          <q-icon class="text-primary icone-correcao" name="o_account_circle" />
          Meus Dados
        </div>

        <app-skeleton v-if="carregando" />

        <q-form v-if="!carregando" class="q-pa-md" @submit="submitSalvar">
          <q-card>
            <q-card-section>
              <q-input ref="nome" v-model="form.nome" label="Nome" outlined
                :rules="[val => !!val || 'O nome é obrigatório']" class="q-pb-lg" type="text" />

              <q-input ref="login" v-model="form.login" label="Login" readonly="" class="q-pb-lg" outlined
                type="text" />

              <q-input v-model="form.cpf" label="CPF" mask="###.###.###-##"
                :rules="[val => !!val ? val.length == 11 : true]" class="q-pb-lg" error-message="CPF inválido" outlined
                :unmasked-value="true" type="text" />

              <q-input ref="telefone" v-model="form.telefone" label="Celular" mask="(##) #########"
                :rules="[val => !!val ? val.length == 11 : true]" class="q-pb-lg" error-message="Telefone inválido"
                outlined :unmasked-value="true" type="text" />

              <q-input v-model="form.email" label="E-mail" :error="!validaEmail(form.email)" class="q-pb-lg"
                error-message="E-mail inválido" outlined :unmasked-value="true" type="text" />

              <q-separator class="q-mt-md"></q-separator>

              <div class="row q-mt-md">
                <div class="col-xs-12">
                  <q-btn type="submit" :disable="salvando" :loading="salvando" label="salvar" color="primary"
                    class="float-right" icon="check" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  QIcon, QForm, QCard, QCardSection, QSeparator, QInput, QBtn,
} from 'quasar'
import { capitalizeTitle } from '../../../util/util'
import { retornaMeusDados, atualizaMeusDados } from '../../../services/usuario'
import AppBtnVoltar from '../../../components/btn-voltar/main.vue'
import AppSkeleton from './skeleton.vue'

export default {

  components: {
    AppSkeleton,
    AppBtnVoltar,
    QIcon,
    QForm,
    QCard,
    QCardSection,
    QSeparator,
    QInput,
    QBtn,
  },

  data() {
    return {
      salvando: false,
      carregando: false,
      form: {
        nome: '',
        telefone: '',
        email: '',
        cpf: '',
        login: '',
        senha: '',
      },
    }
  },

  computed: {
    ...mapState({
      sessao: (state) => state.sessao.user,
    }),
  },

  mounted() {
    this.carregaDados()
    this.form.nome = this.sessao.nome
    this.form.login = this.sessao.login
  },

  methods: {

    async carregaDados() {
      this.carregando = true
      const dados = await retornaMeusDados()
      this.carregando = false
      this.form.nome = dados.nome
      this.form.login = dados.login
      this.form.telefone = dados.telefone
      this.form.cpf = dados.cpf
      this.form.email = dados.email
    },

    validaEmail(email) {
      if (email === null) return true
      if (email === '') return true
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    },

    async submitSalvar() {
      const meusDados = {
        nome: capitalizeTitle(this.form.nome),
        senha: this.form.senha,
        email: this.form.email,
        cpf: this.form.cpf,
        telefone: this.form.telefone,
      }
      this.salvando = true

      const response = await atualizaMeusDados(meusDados)
      this.salvando = false
      if (response.success) {
        this.$q.notify({
          type: 'positive',
          position: 'top',
          message: 'Seus dados foram atualizado.',
        })
      }
    },
  },
}
</script>
