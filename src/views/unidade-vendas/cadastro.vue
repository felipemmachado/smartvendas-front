<template>
  <div>
    <q-form @submit="validaForm">
      <app-cabecalho-form
        textoEditar="Editar Agendamento"
        textoNovo="Agendamento"
        :editar="false"
        :exibeFechar="true"
        iconeNovo="o_calendar_month"
        :badge="form.vendaAgendaTipo"
        @fechar="$emit('fechar')"
      />

      <div class="row q-col-gutter-lg">
        <div class="col-xs-12 col-md-6">
          <div class="row">
            <div class="col-xs-12">
              <q-input
                v-model="form.nomeUsuario"
                outlined
                label="Agendado por"
                readonly
                style="margin-bottom: 2em;"
                type="text"
              />
            </div>
          </div>

          <div class="row">
            <div class="col-xs-12">
              <q-input
                ref="nome"
                v-model="form.nome"
                outlined
                label="Nome do Cliente"
                readonly
                style="margin-bottom: 2em;"
                type="text"
              />
            </div>
          </div>

          <div class="row">
            <div class="col-xs-12">
              <q-input
                ref="telefone"
                v-model="form.telefone"
                outlined
                label="Telefone"
                mask="(##) #########"
                readonly
                style="margin-bottom: 2em;"
                :unmasked-value="true"
                type="text"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-xs-8 q-pr-md">
              <q-input
                ref="data"
                v-model="form.data"
                outlined
                style="margin-bottom: 2em;"
                readonly
                label="Data"
                type="text"
              />
            </div>
            <div class="col-xs-4">
              <q-input
                ref="hora"
                v-model="form.hora"
                outlined
                readonly
                label="Hora"
                style="margin-bottom: 2em;"
                type="text"
              />
            </div>
          </div>

          <app-btn-reagendar :venda="venda"
            style="margin-top: -1em"
            :exibir="temPermissao('ReagendarVendaUnidade') && fechado &&
            form.contratoFechado ? form.contratoFechado.value == false : false"
            @reagendado="(item) => $emit('reagendado', item, form.id)" />

          <app-cadastro-observacao
            ref="appCadastroObservacao"
            :exibirBotaoNovo="!fechado"
            :editar="editar"
            :fechado="fechado"
            :idVenda="form.id"
            @observacao="(val) => (this.form.observacao = val)"
          />
        </div>
        <div class="col-xs-12 col-md-6">
          <div class="row">
            <div class="col-xs-12">
              <q-select
                ref="compareceu"
                v-model="form.compareceu"
                :rules="[(val) => !!val || 'Esse campo é obrigatório']"
                :readonly="fechado"
                outlined
                class="q-mb-sm"
                :options="[
                  { label: 'Sim', value: true },
                  { label: 'Não', value: false },
                ]"
                label="O Cliente compareceu?"
              />
            </div>
          </div>

          <div v-if="form.compareceu ? form.compareceu.value == true : false">
            <div class="row">
              <div class="col-xs-12">
                <q-select
                  ref="contratoFechado"
                  v-model="form.contratoFechado"
                  :rules="[(val) => !!val || 'Esse campo é obrigatório']"
                  :readonly="fechado"
                  class="q-mb-sm"
                  outlined
                  :options="[
                    { label: 'Sim', value: true },
                    { label: 'Não', value: false },
                  ]"
                  label="O Cliente fechou o contrato?"
                />
              </div>
            </div>

            <div
              v-if="
                form.contratoFechado
                  ? form.contratoFechado.value == true
                  : false
              "
              class="row"
            >
              <div class="col-xs-12">
                <q-select
                  ref="vendaComissao"
                  v-model="form.vendaComissao"
                  :rules="[(val) => !!val || 'Esse campo é obrigatório']"
                  :readonly="fechado"
                  class="q-mb-sm"
                  outlined
                  :options="comissoes"
                  option-label="descricao"
                  label="O que o cliente fechou?"
                />
              </div>

              <div class="col-xs-12">
                <q-select
                  ref="gerarFatura"
                  v-model="form.gerarFatura"
                  :rules="[(val) => !!val || 'Esse campo é obrigatório']"
                  :readonly="fechado"
                  outlined
                  class="q-mb-sm"
                  :options="[
                    { label: 'Sim', value: true },
                    { label: 'Não', value: false },
                  ]"
                  label="Gerar comissão para o consultor?"
                />
              </div>
            </div>

            <div
              v-if="
                form.contratoFechado
                  ? form.contratoFechado.value == false
                  : false
              "
              class="row"
            >
              <div class="col-xs-12">
                <q-input
                  ref="motivoDesistencia"
                  v-model="form.motivoDesistencia"
                  outlined
                  label="Motivo da desistência"
                  :readonly="fechado"
                  counter
                  maxlength="1000"
                  type="textarea"
                  :rules="[(val) => !!val || 'Esse campo é obrigatório']"
                  class="q-mb-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="fechado">
        <div class="row q-col-gutter-lg">
          <div class="col-xs-12 col-md-6">
            <q-input
              v-model="form.nomeUsuarioEncerramento"
              outlined
              label="Encerrado por"
              readonly
              class="q-mb-sm"
              type="text"
            />
          </div>
          <div class="col-xs-12 col-md-6">
            <q-input
              v-model="form.dataEncerramento"
              outlined
              label="Encerrado em"
              readonly
              class="q-mb-sm"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-xs-12">
            <q-btn
              v-if="temPermissao('ExcluirLancamentoVendaUnidade')"
              type="button"
              label="Cancelar Lançamento"
              outline
              :loading="cancelando"
              color="negative"
              class="q-mt-md q-mb-sm"
              icon="close"
              @click="cancelar"
            />
          </div>
        </div>
      </div>

      <q-separator v-if="!fechado" class="q-mt-md"></q-separator>

      <div v-if="!fechado" class="row q-mt-md">
        <div class="col-xs-12">
          <q-btn
            v-if="temPermissao('EditarVendasUnidade')"
            type="button"
            icon="edit"
            color="primary"
            flat
            label="Editar"
            @click="$emit('editar')"
          />

          <q-btn
            v-if="temPermissao('AtualizarVendasUnidade')"
            type="submit"
            :disable="salvando"
            :loading="salvando"
            label="salvar"
            color="primary"
            class="float-right"
            icon="check"
          />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import {
  QForm, QInput, QBtn, QSelect, QSeparator,
} from 'quasar'
import { cancelar, retornaPorId, concluir } from '../../services/venda-agenda'
import AppCadastroObservacao from '../minhas-vendas/cadastro/observacao.vue'
import AppBtnReagendar from '../minhas-vendas/reagendar/btn.vue'
import { formatDateSql, temPermissao, formatDateTimeSql } from '../../util/util'
import AppCabecalhoForm from '../../components/cabecalho-form/main.vue'

export default {
  components: {
    AppCadastroObservacao,
    AppBtnReagendar,
    AppCabecalhoForm,
    QForm,
    QInput,
    QBtn,
    QSelect,
    QSeparator,
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
        observacao: '',
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
        vendaAgendaTipo: '',
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

    temPermissao(permissao) { return temPermissao(permissao) },

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
      this.form.vendaAgendaTipo = venda.vendaAgendaTipo

      if (venda.idUsuarioEncerramento !== null) {
        this.fechado = true
        this.form.contratoFechado = {
          label: venda.contratoFechado ? 'Sim' : 'Não',
          value: venda.contratoFechado,
        }
        this.form.compareceu = {
          label: venda.compareceu ? 'Sim' : 'Não',
          value: venda.compareceu,
        }
        const vdOpt = {
          label: venda.faturado ? 'Sim' : 'Não',
          value: venda.faturado,
        }
        this.form.gerarFatura = venda.faturado != null ? vdOpt : null
        this.form.motivoDesistencia = venda.motivoDesistencia
        this.form.nomeUsuarioEncerramento = venda.nomeUsuarioEncerramento
        const vendaComissao = venda.idUnidadeVendaComissao != null
          ? this.comissoes.find((x) => x.id === venda.idUnidadeVendaComissao)
          : null
        this.form.vendaComissao = vendaComissao
        this.form.dataEncerramento = formatDateTimeSql(venda.dataEncerramento)
      }
    },

    cancelar() {
      this.$q
        .dialog({
          title: 'Cancelar',
          message:
            'Deseja cancelar esse lançamento? (voltara para o estado de agendando)',
          cancel: true,
          persistent: true,
          ok: {
            label: 'cancelar',
            color: 'negative',
          },
        })
        .onOk(async () => {
          this.cancelando = true
          const reposta = await cancelar(this.form.id)
          if (reposta.success) {
            const venda = await retornaPorId(this.form.id)
            this.cancelando = false
            this.$q.notify({
              type: 'positive',
              position: 'top',
              message: 'Agendamento Cancelado.',
            })
            this.fechado = false
            this.form.compareceu = null
            this.form.contratoFechado = null
            this.form.motivoDesistencia = ''
            this.form.gerarFatura = null
            this.carregaForm(venda)
            this.$forceUpdate()
            this.$emit('salvou', this.form.id)
          } else {
            this.cancelando = false
            this.$q.notify({
              type: 'negative',
              position: 'top',
              message: reposta.message,
            })
          }
        })
    },
    validaForm() {
      const compareceu = this.$refs.compareceu.validate()

      if (compareceu) {
        if (this.form.compareceu.value === true) {
          const fechouContrato = this.$refs.contratoFechado.validate()
          if (fechouContrato) {
            if (fechouContrato.value === false) {
              const motivoDesistencia = this.$refs.motivoDesistencia.validate()
              if (motivoDesistencia) {
                this.submitSalvar()
              }
            } else {
              this.submitSalvar()
            }
          }
        } else {
          this.submitSalvar()
        }
      }
    },
    async submitSalvar() {
      const id = this.form.vendaComissao == null ? null : this.form.vendaComissao.id
      const vendaConcluida = {
        id: this.form.id,
        compareceu: this.form.compareceu.value,
        contratoFechado: this.form.contratoFechado
          ? this.form.contratoFechado.value
          : false,
        motivoDesistencia: this.form.motivoDesistencia,
        idUnidadeVendaComissao: id,
        gerarFatura: this.form.gerarFatura ? this.form.gerarFatura.value : null,
        observacao: this.form.observacao,
      }

      this.salvando = true
      const retorno = await concluir(vendaConcluida)
      if (retorno.success) {
        this.salvando = false
        const venda = await retornaPorId(vendaConcluida.id)
        this.$emit('salvou', vendaConcluida.id)
        this.fechado = true
        this.carregaForm(venda)
        this.$q.notify({
          type: 'positive',
          position: 'top',
          message: 'Agendamento salvo com sucesso.',
        })
        this.$refs.appCadastroObservacao.carregaObservacao()
      }
    },
  },
}
</script>
