<template>
<div>
  <q-form @submit="submitSalvar">
    <app-cabecalho-form
      textoEditar="Editar Tipo de Venda"
      textoNovo="Novo Tipo de Venda"
      :editar="editar"
      :exibeFechar="true"
      @fechar="$emit('fechar')"
    />
  <div class="row">
    <div class="col-xs-12">
        <q-input ref="descricao"
                v-model="form.descricao"
                label="Descrição"
                outlined
                :rules="[val => !!val || 'A descrição é obrigatório']"
                class="q-pb-md"
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
import { excluir, put, post } from '../../../services/venda-agenda-tipo'
import { temPermissao, guidEmpty } from '../../../util/util'
import AppCabecalhoForm from '../../../components/cabecalho-form/main.vue'

export default {

  components: {
    AppCabecalhoForm,
    QBtn,
    QInput,
    QSeparator,
    QForm,
  },

  props: {
    cadastro: {
      type: Object,
      required: false,
      default: () => {},
    },
    unidade: {
      type: Object,
      required: false,
      default: () => {},
    },
  },

  data() {
    return {
      guidEmpty,
      editar: false,
      salvando: false,
      excluindo: false,
      vendas: null,
      representante: null,
      form: {
        id: '',
        descricao: '',
      },
    }
  },

  mounted() {
    this.form.id = this.guidEmpty
    if (this.cadastro) {
      this.editar = true
      this.form.id = this.cadastro.id
      this.form.descricao = this.cadastro.descricao
    }
  },

  methods: {
    temPermissao(permissao) { return temPermissao(permissao) },

    excluir() {
      this.$q.dialog({
        title: 'Excluir',
        message: 'Deseja excluir esse tipo de venda?',
        cancel: true,
        persistent: true,
        ok: {
          label: 'Excluir',
          color: 'negative',
        },
      }).onOk(async () => {
        this.excluindo = true
        const resposta = await excluir(this.form.id)
        this.excluindo = false
        if (resposta.success) {
          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Tipo de Venda Excluído.',
          })
          this.$emit('excluiu', this.form)
        } else {
          this.$q.notify({
            type: 'negative',
            position: 'top',
            message: resposta.message,
          })
        }
      })
    },

    async submitSalvar() {
      const cadastro = {
        id: this.form.id,
        descricao: this.form.descricao,
      }

      this.salvando = true
      if (this.editar) {
        const response = await put(cadastro)
        this.salvando = false
        if (response.success) {
          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Tipo de venda salva com sucesso.',
          })
          this.$emit('cadastro', cadastro)
        }
      } else {
        const response = await post(cadastro)
        this.salvando = false
        if (response.success) {
          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Tipo de venda salva com sucesso.',
          })
          this.form.id = response.data.id
          cadastro.id = response.data.id
          this.editar = true
          this.$emit('cadastro', cadastro)
        }
      }
    },
  },
}
</script>
