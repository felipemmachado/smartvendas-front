<template>
<div>
  <q-form @submit="validaForm">
    <app-cabecalho-form
      textoEditar="Editar Comissão"
      textoNovo="Nova Comissão"
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
                class="q-mb-sm"
                type="text" />
    </div>

  </div>
  <div class="row">
    <div class="col-xs-12">
      <q-toggle
        v-model="form.habilitado"
        label="Habilitado"
        class="q-pb-md"
      />
    </div>
  </div>

  <div class="row">
    <div class="col-xs-12">
      <q-field ref="valorComissao"
              v-model="form.valor"
              label="Valor da comissão"
              outlined
              class="q-pb-md"
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
    </div>
  </div>

  <div class="row">
    <div class="col-xs-12">
      <q-field ref="valorComissaoCoordenador"
              v-model="form.valorCoordenador"
              label="Valor da comissão do coordenador"
              outlined
              class="q-pb-md"
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
    </div>
  </div>

  <div class="row">
    <div class="col-xs-12">
      <q-field ref="valorComissaoCoordenadorDividida"
              v-model="form.valorCoordenadorDividido"
              label="Valor da comissão do coordenador caso divida"
              outlined
              class="q-pb-md"
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
    </div>
  </div>

  <div class="row">
    <div class="col-xs-12">
      <q-field ref="balorPagamentoUnidade"
              v-model="form.valorPagamentoUnidade"
              label="Valor pago pela unidade"
              outlined
              class="q-pb-md"
              type="text">
        <template v-slot:control="{ id, floatingLabel, value, emitValue }">
          <input v-show="floatingLabel"
                  :id="id"
                  v-money="vMoney"
                  class="q-field__input"
                  :value="value"
                  @change="e => emitValue(e.target.value)">
        </template>
      </q-field>
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
  QField, QToggle, QBtn, QInput, QSeparator, QForm,
} from 'quasar'
import { excluirVendaComissao, putVendaComissao, postVendaComissao } from '../../../services/unidade'
import {
  toNumber, temPermissao, vMoneyConfig, guidEmpty,
} from '../../../util/util'

import AppCabecalhoForm from '../../../components/cabecalho-form/main.vue'

export default {

  components: {
    AppCabecalhoForm,
    QField,
    QToggle,
    QBtn,
    QInput,
    QSeparator,
    QForm,
  },

  props: {
    comissao: {
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
      vMoney: vMoneyConfig,
      form: {
        id: '',
        habilitado: false,
        descricao: '',
        valor: '',
        valorCoordenador: '',
        valorCoordenadorDividido: '',
        valorPagamentoUnidade: '',
      },
    }
  },

  mounted() {
    this.form.id = this.guidEmpty
    if (this.comissao) {
      this.editar = true
      this.form.id = this.comissao.id
      this.form.descricao = this.comissao.descricao
      this.form.habilitado = this.comissao.habilitado
      this.form.valor = Number(this.comissao.valor).toFixed(2)
      this.form.valorCoordenador = Number(this.comissao.valorCoordenador).toFixed(2)
      const valor = Number(this.comissao.valorCoordenadorDividido).toFixed(2)
      this.form.valorCoordenadorDividido = valor
      this.form.valorPagamentoUnidade = Number(this.comissao.valorPagamentoUnidade).toFixed(2)
    }
  },

  methods: {
    temPermissao(permissao) { return temPermissao(permissao) },

    validaForm() {
      const descricao = this.$refs.descricao.validate()
      if (!descricao) {
        this.$q.notify({
          type: 'negative',
          position: 'top-right',
          message: 'Corrija os campos em vermelho.',
        })
      } else {
        this.submitSalvar()
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
        const reposta = await excluirVendaComissao(this.unidade.id, this.form.id)
        this.excluindo = false
        if (reposta.success) {
          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Comissão Excluída.',
          })
          this.$emit('excluiu', this.form)
        } else {
          this.$q.notify({
            type: 'negative',
            position: 'top',
            message: reposta.message,
          })
        }
      })
    },

    async submitSalvar() {
      const comissao = {
        id: this.form.id,
        idUnidade: this.unidade.id,
        descricao: this.form.descricao,
        habilitado: this.form.habilitado,
        valor: toNumber(this.form.valor),
        valorCoordenador: toNumber(this.form.valorCoordenador),
        valorCoordenadorDividido: toNumber(this.form.valorCoordenadorDividido),
        valorPagamentoUnidade: toNumber(this.form.valorPagamentoUnidade),
      }

      this.salvando = true
      if (this.editar) {
        const response = await putVendaComissao(this.unidade.id, comissao)
        this.salvando = false
        if (response.success) {
          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Comissão salva com sucesso.',
          })
          this.$emit('comissao', comissao)
        }
      } else {
        const response = await postVendaComissao(this.unidade.id, comissao)
        this.salvando = false
        if (response.success) {
          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Comissaão salva com sucesso.',
          })
          this.form.id = response.data.id
          comissao.id = response.data.id
          this.editar = true
          this.$emit('comissao', comissao)
        }
      }
    },
  },
}
</script>
