<template>
<div>
  <q-form>
    <app-cabecalho-form
      textoEditar="Editar Agendamento"
      textoNovo="Agendamento"
      :editar="false"
      :exibeFechar="true"
      iconeNovo="o_calendar_month"
      @fechar="$emit('fechar')"
    />

    <div class="row q-col-gutter-md">
      <div class="col-xs-12 col-md-6">

        <div class="row">
          <div class="col-xs-12">
            <q-input v-model="form.nomeUsuario"
                    label="Agendado por"
                    readonly
                    outlined
                    class="q-pb-md"
                    type="text" />
          </div>
        </div>

        <div class="row">
          <div class="col-xs-12">
            <q-input ref="nome"
                    v-model="form.nome"
                    label="Nome do Cliente"
                    readonly
                    outlined
                    class="q-pb-md"
                    type="text" />
          </div>
        </div>

        <div class="row">
          <div class="col-xs-12">
            <q-input ref="telefone"
                    v-model="form.telefone"
                    label="Telefone"
                    mask="(##) #########"
                    readonly
                    outlined
                    class="q-pb-md"
                    :unmasked-value="true"
                    type="text" />
          </div>
        </div>

        <div class="row">
          <div class="col-xs-8 q-pr-md">
            <q-input ref="data"
                    v-model="form.data"
                    class="q-pb-md"
                    readonly
                    outlined
                    label="Data"
                    type="text" />
          </div>
          <div class="col-xs-4">
            <q-input ref="hora"
                    v-model="form.hora"
                    readonly
                    outlined
                    label="Hora"
                    class="q-pb-md"
                    type="text" />
          </div>
        </div>

      </div>
      <div class="col-xs-12 col-md-6">

        <app-cadastro-observacao
          ref="appCadastroObservacao"
          :exibirBotaoNovo="false"
          :editar="true"
          :fechado="fechado"
          :idVenda="form.id" />

        <div class="row">
          <div class="col-xs-12">
            <q-select ref="compareceu"
                      v-model="form.compareceu"
                      :rules="[val => !!val || 'Esse campo é obrigatório']"
                      :readonly="true"
                      class="q-pb-md"
                      outlined
                      :options="[{ label: 'Sim', value: true }, { label: 'Não', value: false }]"
                      label="O Cliente compareceu?" />
          </div>
        </div>

        <div v-if="form.compareceu ? form.compareceu.value == true : false">
          <div class="row" >
            <div class="col-xs-12">
              <q-select ref="contratoFechado"
                        v-model="form.contratoFechado"
                        :rules="[val => !!val || 'Esse campo é obrigatório']"
                        :readonly="true"
                        class="q-pb-md"
                        outlined
                        :options="[{ label: 'Sim', value: true }, { label: 'Não', value: false }]"
                        label="O Cliente fechou o contrato?" />
            </div>
          </div>

          <div v-if="form.contratoFechado ? form.contratoFechado.value == true : false" class="row">
            <div class="col-xs-12">
              <q-select ref="vendaComissao"
                        v-model="form.vendaComissao"
                        :rules="[val => !!val || 'Esse campo é obrigatório']"
                        :readonly="true"
                        class="q-pb-md"
                        outlined
                        :options="comissoes"
                        option-label="descricao"
                        label="O que o cliente fechou?" />
            </div>

            <div class="col-xs-12">
              <q-select ref="gerarFatura"
                        v-model="form.gerarFatura"
                        :rules="[val => !!val || 'Esse campo é obrigatório']"
                        :readonly="true"
                        outlined
                        class="q-pb-md"
                        :options="[{ label: 'Sim', value: true }, { label: 'Não', value: false }]"
                        label="Gerar comissão para o consultor?" />
            </div>
          </div>

          <div v-if="form.contratoFechado ? form.contratoFechado.value == false : false"
                class="row">
            <div class="col-xs-12">
              <q-input ref="motivoDesistencia"
                      v-model="form.motivoDesistencia"
                      label="Motivo da desistência"
                      :readonly="true"
                      outlined
                      rows="5"
                      type="textarea"
                      :rules="[val => !!val || 'Esse campo é obrigatório']"
                      class="q-pb-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="fechado">
      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-md-6">
          <q-input v-model="form.nomeUsuarioEncerramento"
                  label="Encerrado por"
                  readonly
                  outlined
                  class="q-pb-md"
                  type="text" />
        </div>
        <div class="col-xs-12 col-md-6">
          <q-input v-model="form.dataEncerramento"
                  label="Encerrado em"
                  readonly
                  outlined
                  class="q-pb-md"/>
        </div>
      </div>
    </div>
  </q-form>
</div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import {
  QSelect, QInput, QForm,
} from 'quasar'
import { formatDateSql, formatDateTimeSql } from '../../../util/util'
import appCadastroObservacao from '../../minhas-vendas/cadastro/observacao.vue'
import AppCabecalhoForm from '../../../components/cabecalho-form/main.vue'

export default {
  components: {
    appCadastroObservacao,
    AppCabecalhoForm,
    QSelect,
    QInput,
    QForm,
  },
  props: {
    venda: {
      type: Object,
      required: false,
      default: () => {},
    },
    comissoes: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      editar: false,
      unidades: [],
      salvando: false,
      fechado: false,
      cancelando: false,
      unidade: '',
      form: {
        id: '00000000-0000-0000-0000-000000000000',
        nome: '',
        nomeUsuario: '',
        nomeUsuarioEncerramento: '',
        dataEncerramento: null,
        telefone: '',
        compareceu: null,
        vendaComissao: null,
        contratoFechado: null,
        gerarFatura: null,
        motivoDesistencia: '',
        tipo: '',
        data: '',
        hora: '',
        idUnidade: '',
      },
    }
  },

  computed: {
    ...mapState({
      sessao: (state) => state.sessao.user,
    }),
  },

  mounted() {
    if (this.venda) {
      this.carregaForm(this.venda)
    }
  },

  methods: {
    ...mapActions(['setSession', 'setUnidade']),

    carregaForm(venda) {
      this.editar = true
      this.form.id = venda.id
      this.form.nomeUsuario = venda.nomeUsuario
      this.form.nome = venda.nome
      this.form.telefone = venda.telefone
      const data = formatDateSql(venda.data.split('T')[0])
      const hora = venda.data.split('T')[1]
      this.form.data = data
      this.form.hora = hora

      if (venda.idUsuarioEncerramento !== null) {
        this.fechado = true
        this.form.contratoFechado = { label: venda.contratoFechado ? 'Sim' : 'Não', value: venda.contratoFechado }
        this.form.compareceu = { label: venda.compareceu ? 'Sim' : 'Não', value: venda.compareceu }
        const vdOpt = { label: venda.faturado ? 'Sim' : 'Não', value: venda.faturado }
        this.form.gerarFatura = vdOpt
        this.form.motivoDesistencia = venda.motivoDesistencia
        this.form.nomeUsuarioEncerramento = venda.nomeUsuarioEncerramento
        const vendaComissao = venda.idUnidadeVendaComissao != null
          ? this.comissoes.find((x) => x.id === venda.idUnidadeVendaComissao)
          : null
        this.form.vendaComissao = vendaComissao
        this.form.dataEncerramento = formatDateTimeSql(venda.dataEncerramento)
      }
    },
  },
}
</script>
