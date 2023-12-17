<template>
<div>
  <q-form @submit="submitSalvar">
  <div class="row">
    <div class="col-xs-12">
        <q-input ref="nome"
                v-model="form.nome"
                label="Nome"
                :rules="[val => !!val || 'O nome é obrigatório']"
                class="q-mb-sm"
                outlined
                type="text" />
    </div>

  </div>
  <div class="row">
    <div class="col-xs-12">
        <q-input ref="razaoSocial"
                v-model="form.razaoSocial"
                label="Razão Social"
                class="q-mb-lg"
                outlined
                type="text" />
    </div>

  </div>

  <div class="row">
    <div class="col-xs-12">
        <q-input ref="nomeFantasia"
                v-model="form.nomeFantasia"
                label="Nome Fantasia"
                outlined
                class="q-mb-lg"
                type="text" />
    </div>

  </div>
  <div class="row">

    <div class="col-xs-12">
        <q-input ref="cnpj"
                v-model="form.cnpj"
                label="CNPJ"
                outlined
                class="q-mb-sm"
                mask="##.###.###/####-##"
                type="text" />
    </div>
  </div>

  <q-separator class="q-mt-md"></q-separator>

  <div class="row q-mt-md">

    <div class="col-xs-12">

      <q-btn
        v-if="form.id !== guidEmpty && temPermissao('ExcluirUnidade')"
        type="button"
        label="Excluir"
        flat
        :loading="excluindo"
        color="negative"
        icon="delete"
        @click="excluir" />

      <q-btn
        type="submit"
        :disable="salvando"
        :loading="salvando"
        label="salvar"
        class="float-right"
        color="primary"
        icon="check" />
    </div>
  </div>

  </q-form>
</div>
</template>

<script>
import {
  QBtn, QInput, QSeparator, QForm,
} from 'quasar'
import { excluir, put, post } from '../../../../services/unidade'
import { temPermissao, guidEmpty } from '../../../../util/util'

export default {

  components: {
    QBtn, QInput, QSeparator, QForm,
  },

  props: {
    unidade: {
      type: Object,
      required: false,
      default: () => {},
    },
  },

  data() {
    return {
      editar: false,
      salvando: false,
      excluindo: false,
      vendas: null,
      representante: null,
      guidEmpty,
      form: {
        id: '00000000-0000-0000-0000-000000000000',
        nome: '',
        razaoSocial: '',
        nomeFantasia: '',
        cnpj: '',
      },
    }
  },

  mounted() {
    if (this.unidade) {
      this.editar = true
      this.form.id = this.unidade.id
      this.form.nome = this.unidade.nome
      this.form.razaoSocial = this.unidade.razaoSocial
      this.form.nomeFantasia = this.unidade.nomeFantasia
      this.form.cnpj = this.unidade.cnpj
    }
  },

  methods: {
    temPermissao(permissao) { return temPermissao(permissao) },

    excluir() {
      this.$q.dialog({
        title: 'Excluir',
        message: 'Deseja excluir essa unidade?',
        cancel: true,
        persistent: true,
        ok: {
          label: 'Excluir',
          color: 'negative',
        },
      }).onOk(async () => {
        this.excluindo = true

        const resposta = await excluir(this.form.id)
        if (resposta.success) {
          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Unidade Excluída.',
          })
          this.$emit('excluiu', this.form)
        } else {
          this.$q.notify({
            type: 'negative',
            position: 'top',
            message: resposta.message,
          })
        }
        this.excluindo = false
      })
    },

    async submitSalvar() {
      const unidade = {
        id: this.form.id,
        nome: this.form.nome,
        razaoSocial: this.form.razaoSocial,
        nomeFantasia: this.form.nomeFantasia,
        cnpj: this.form.cnpj.replace(/\D/g, ''),
      }

      this.salvando = true

      if (this.editar) {
        const response = await put(unidade)
        this.salvando = false
        if (response.success) {
          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Unidade salva com sucesso.',
          })
          this.$emit('unidade', unidade)
        }
      } else {
        const response = await post(unidade)
        this.salvando = false
        if (response.success) {
          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Unidade salva com sucesso! Saia e entre novamente para essa unidade aparecer na lista.',
          })
          this.form.id = response.data.id
          unidade.id = response.data.id
          this.editar = true
          this.$emit('unidade', unidade)
        }
      }
    },
  },
}
</script>
