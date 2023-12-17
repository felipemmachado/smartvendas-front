<template>
  <div>
    <q-form @submit="submitSalvar">
      <app-cabecalho-form
        textoEditar="Editar Comissão"
        textoNovo="Nova Comissão"
        :editar="editar"
        :exibeFechar="true"
        @fechar="$emit('fechar')"
      />

    <q-input ref="nome"
            v-model="usuario.nome"
            label="Nome"
            readonly
            class="q-pb-md"
            outlined
            type="text" />

    <q-select ref="unidade"
              v-model="form.unidade"
              class="q-pb-md"
              :options="sessao.unidades"
              option-label="nome"
              outlined
              :rules="[val => !!val || 'A unidade é obrigatória']"
              label="Unidade"
              @blur="carregaComissoes(null)" />

      <q-select v-if="form.unidade"
                ref="comissao"
                v-model="form.UnidadeVendaComissao"
                class="q-pb-md"
                :options="comissoes"
                outlined
                option-label="descricao"
                :rules="[val => !!val || 'A comissão é obrigatória']"
                label="Comissão" />

      <q-field v-if="form.UnidadeVendaComissao"
              ref="valor"
              v-model="form.valor"
              label="Valor"
              outlined
              class="q-pb-md"
              :rules="[val => val !== 'R$ 0,00' || 'O valor é obrigatório']"
              type="text">

        <template v-slot:control="{ id, floatingLabel, value, emitValue }">
          <input v-show="floatingLabel"
                  :id="id"
                  v-money="vMoney"
                  class="q-field__input"
                  :value="value"
                  outlined
                  @change="e => emitValue(e.target.value)">
        </template>
      </q-field>

  <q-separator class="q-mt-md"></q-separator>

  <div class="row q-mt-md">

    <div class="col-xs-12">
      <q-btn
        v-if="form.id"
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

import { mapState } from 'vuex'

import {
  QBtn, QInput, QSeparator, QForm, QField, QSelect,
} from 'quasar'
import { retornaTodasComissoesDeVendaAtivas } from '../../../../services/unidade'
import { postVendaComissao, putVendaComissao, excluirComissao } from '../../../../services/usuario'
import { toNumber, vMoneyConfig } from '../../../../util/util'
import AppCabecalhoForm from '../../../../components/cabecalho-form/main.vue'

export default {

  components: {
    AppCabecalhoForm,
    QField,
    QBtn,
    QInput,
    QSeparator,
    QForm,
    QSelect,
  },

  props: {
    usuario: {
      type: Object,
      require: true,
      default: () => {},
    },
    cadastro: {
      type: Object,
      require: false,
      default: null,
    },
  },

  data() {
    return {
      editar: false,
      excluindo: false,
      salvando: false,
      vMoney: vMoneyConfig,
      form: {
        id: null,
        idUsuario: null,
        unidade: null,
        UnidadeVendaComissao: null,
        valor: 0,
      },
      comissoes: [],
    }
  },

  computed: {
    ...mapState({
      sessao: (state) => state.sessao.user,
    }),
  },

  mounted() {
    if (this.cadastro) {
      this.carregaForm(this.cadastro)
    }
  },

  methods: {

    carregaForm(form) {
      this.editar = true
      this.form.id = form.id
      const unidade = this.sessao.unidades.find((p) => form.idUnidade === p.id)
      this.form.unidade = unidade
      this.carregaComissoes(form.idUnidadeVendaComissao)
      this.form.valor = Number(form.valor).toFixed(2)
    },

    async submitSalvar() {
      const post = {
        id: this.form.id,
        idUsuario: this.usuario.id,
        idUnidade: this.form.unidade.id,
        idUnidadeVendaComissao: this.form.UnidadeVendaComissao.id,
        valor: toNumber(this.form.valor),
      }

      this.salvando = true

      if (post.id == null) {
        const result = await postVendaComissao(post)
        this.salvando = false
        if (result.success) {
          post.id = result.data.id
          post.nomeUnidade = this.form.unidade.nome
          post.nomeComissao = this.form.UnidadeVendaComissao.descricao
          post.valorComissaoUnidade = this.form.UnidadeVendaComissao.valor
          this.$emit('atualizar', post)
          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Comissão salva com sucesso.',
          })
        }
      } else {
        // editar
        const result = await putVendaComissao(this.usuario.id, post)
        this.salvando = false
        if (result.success) {
          post.nomeUnidade = this.form.unidade.nome
          post.nomeComissao = this.form.UnidadeVendaComissao.descricao
          post.valorComissaoUnidade = this.form.UnidadeVendaComissao.valor
          this.$emit('atualizar', post)
          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Comissão atualizada com sucesso.',
          })
        }
      }
    },

    excluir() {
      this.$q.dialog({
        title: 'Excluir',
        message: 'Deseja excluir essa comissão?',
        cancel: true,
        persistent: true,
        ok: {
          label: 'Excluir',
          color: 'negative',
        },
      }).onOk(async () => {
        this.excluindo = true
        const resposta = await excluirComissao(this.usuario.id, this.form.id)
        this.excluindo = false
        if (resposta.success) {
          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Comissão Excluída.',
          })
          this.$emit('excluiu', this.form.id)
        } else {
          this.$q.notify({
            type: 'negative',
            position: 'top',
            message: resposta.message,
          })
        }
      })
    },

    validaValor(val) {
      if (val === 'R$ 0,00') return false
      return false
    },

    async carregaComissoes(id) {
      if (this.form.unidade) {
        this.carregando = true
        const lista = await retornaTodasComissoesDeVendaAtivas(this.form.unidade.id)

        this.carregando = false
        this.comissoes = lista

        if (id) {
          this.form.UnidadeVendaComissao = lista.find((p) => p.id === id)
        }
      }
    },
  },
}
</script>
