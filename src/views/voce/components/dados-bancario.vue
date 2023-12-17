<template>
  <div>
    <div class="row q-mt-md animated fadeIn fast">
      <div class="col-md-3 col-xs-12"></div>
      <div class="col-md-6 col-xs-12">

        <app-btn-voltar cls="q-ml-md" rota="voce" />

        <div class="text-h5 q-ml-md q-mt-md">
          <q-icon class="text-primary icone-correcao" name="o_payment" />
          Conta Bancária
        </div>

        <app-skeleton v-if="carregando" />

        <q-form v-if="!carregando" class="q-pa-md" @submit="submitSalvar">
          <q-card>
            <q-card-section>
              <q-select v-model="form.banco" use-input :rules="[val => !!val || 'O banco é obrigatório']" label="Banco"
                outlined hint="Digite para buscar" class="q-mb-lg" :options="bancos" @filter="filterFn">
                <template v-slot:append>
                  <q-icon v-if="form.banco !== null" class="cursor-pointer" name="clear"
                    @click.stop="form.banco = null" />
                </template>
              </q-select>

              <q-input ref="agencia" v-model="form.agencia" label="Agência"
                :rules="[val => !!val || 'A agência é obrigatório']" class="q-mb-md" mask="####" outlined type="text" />

              <q-input ref="conta" v-model="form.conta" label="Número da Conta com Dígito"
                :rules="[val => !!val || 'A Conta é obrigatório']" class="q-mb-md text-right" mask="#########-#"
                reverse-fill-mask outlined type="text" />

              <q-select v-model="form.tipoConta" label="Tipo da Conta" outlined
                :rules="[val => !!val || 'O tipo da conta é obrigatório']" :options="['Corrente', 'Poupança']" />

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
import accents from 'accents'
import { mapState } from 'vuex'
import {
  QIcon, QForm, QCard, QCardSection, QSeparator, QInput, QBtn, QSelect,
} from 'quasar'
import { retornaDadosBancario, postContaBancaria, putContaBancaria } from '../../../services/usuario'
import bancos from '../../../util/bancos'
import { guidEmpty } from '../../../util/util'
import AppBtnVoltar from '../../../components/btn-voltar/main.vue'
import AppSkeleton from './skeleton.vue'

export default {

  components: {
    AppBtnVoltar,
    AppSkeleton,
    QIcon,
    QForm,
    QCard,
    QCardSection,
    QSeparator,
    QInput,
    QBtn,
    QSelect,
  },

  data() {
    return {
      salvando: false,
      bancos: [],
      guidEmpty,
      carregando: false,
      form: {
        id: null,
        banco: null,
        agencia: '',
        conta: '',
        tipoConta: '',
      },
    }
  },

  computed: {
    ...mapState({
      sessao: (state) => state.sessao.user,
    }),
  },

  beforeMount() {
    this.bancos = []
    this.form.id = this.guidEmpty
  },

  mounted() {
    this.carregaDados()
  },

  methods: {

    filterFn(val, update) {
      update(() => {
        const needle = val.toLowerCase()
        if (needle.length === 0) {
          this.bancos = []
        } else {
          this.bancos = bancos.filter(
            (v) => accents(v).toLowerCase().indexOf(accents(needle)) > -1,
          )
        }
      })
    },

    async carregaDados() {
      this.carregando = true
      const dados = await retornaDadosBancario()
      this.carregando = false
      if (dados !== '') {
        this.form.id = dados.id
        this.form.banco = dados.banco
        this.form.conta = dados.conta
        this.form.agencia = dados.agencia
        this.form.tipoConta = dados.tipoConta === 1 ? 'Corrente' : 'Poupança'
      }
    },

    async submitSalvar() {
      const data = {
        id: this.form.id,
        banco: this.form.banco,
        agencia: this.form.agencia,
        conta: this.form.conta,
        tipoConta: this.form.tipoConta === 'Corrente' ? 1 : 2,
      }
      this.salvando = true
      if (this.form.id === this.guidEmpty) {
        const response = await postContaBancaria(data)
        this.salvando = false
        if (response.success) {
          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Conta bancária salva.',
          })
        }
      } else {
        const response = await putContaBancaria(data)
        this.salvando = false
        if (response.success) {
          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Conta bancária atualizada.',
          })
        }
      }
    },
  },
}
</script>
