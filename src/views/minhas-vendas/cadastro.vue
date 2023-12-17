<template>
  <div>
    <q-form @submit="submitSalvar">
      <app-cabecalho-form textoEditar="Editar Agendamento" textoNovo="Novo Agendamento" :editar="editar"
        :exibeFechar="true" @fechar="$emit('fechar')" />

      <div class="row q-col-gutter-lg">
        <div class="col-xs-12 col-md-6">

          <div class="row">
            <div class="col-xs-12">
              <q-input ref="nome" v-model="form.nome" outlined label="Nome Completo" :readonly="fechado"
                :loading="verificandoAgenda" :rules="[val => !!val || 'O nome é obrigatório',
                val => nomeValido || 'Esse usuário já está agendando']" class="q-mb-sm" type="text"
                @blur="capitalizeTitle" />
            </div>
          </div>

          <div class="row">
            <div class="col-xs-12">
              <q-input ref="telefone" v-model="form.telefone" outlined label="Celular" :readonly="fechado"
                mask="(##) #########" :rules="[val => val.length == 11 || 'O telefone é obrigatório']" class="q-mb-sm"
                :unmasked-value="true" type="text" @blur="validaAgenda">
                <template v-slot:append>
                  <q-btn v-if="editar" color="positive" @click="vaiParaWhatsApp">
                    <img style="width:1.8em" src="../../assets/imagens/whatsapp.svg">
                  </q-btn>
                </template>
              </q-input>
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-xs-12 col-sm-7">
              <q-input ref="data" v-model="form.data" outlined :readonly="fechado" label="Data" class="q-mb-sm"
                placeholder="DD/MM/AAAA" mask="##/##/####" :loading="verificandoDataUnidade" :rules="[val => !!val || 'A data é obrigatório',
                val => validaData(val) || 'Data inválida',
                val => dataUnidadeValida || 'Data fora do horário de funcionamento']"
                @blur="podeAgendarUnidade('DATA')">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="form.data" mask="DD/MM/YYYY" @input="() => $refs.qDateProxy.hide()" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-xs-12 col-sm-5">
              <q-input ref="hora" v-model="form.hora" outlined :readonly="fechado" label="Hora" class="q-mb-sm"
                placeholder="HH:MM" mask="##:##" :rules="[val => !!val || 'A data é obrigatório',
                val => validaHora(val) || 'Hora inválida',
                val => dataUnidadeValida || 'Hora fora do horário de funcionamento']"
                @blur="podeAgendarUnidade('DATA')">
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-time v-model="form.hora" mask="HH:mm" format24h />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>

          <app-btn-reagendar :venda="venda" :exibir="!form.contratoFechado && fechado"
            @reagendado="(item) => $emit('reagendado', item)" />

          <div v-if="!exibeSelectTipo" class="row">
            <div class="col-xs-12">
              <q-input v-model="form.nomeTipo" outlined label="Tipo do Agendamento" readonly class="q-mb-lg">
                <template v-slot:append>
                  <q-btn v-if="!fechado" size="sm" color="accent" @click="exibeSelectTipo = true">
                    Alterar
                  </q-btn>
                </template>
              </q-input>

            </div>
          </div>

          <div v-if="exibeSelectTipo" class="row">
            <div class="col-xs-12">
              <q-select ref="tipo" v-model="form.tipo" :readonly="fechado"
                :rules="[val => !!val || 'O tipo do agendamento é obrigatório']" outlined class="q-mb-sm"
                :options="tiposVendas" option-label="descricao" label="Tipo do Agendamento" />
            </div>
          </div>

          <div class="row">
            <div class="col-xs-12">
              <q-input v-model="sessao.unidadeAtual.nome" outlined label="Unidade de Atendimento" readonly
                class="q-mb-sm" type="text" />
            </div>
          </div>

        </div>
        <div class="col-xs-12 col-md-6">

          <app-cadastro-observacao ref="appCadastroObservacao" :editar="editar" :fechado="fechado"
            :exibirBotaoNovo="!fechado" :idVenda="form.id" @observacao="(val) => this.form.observacao = val" />

          <div v-if="editar && !podeConfirmar && !fechado" class="row">
            <div class="col-xs-12 text-primary">
              <q-icon name="info" /> A Confirmação ficará disponível 1 dia antes do agendamento.
            </div>
          </div>

          <div v-if="editar && podeConfirmar">
            <div class="col-xs-12">
              <div class="row">
                <div class="col-xs-12">
                  <q-select ref="confirmado" v-model="form.confirmado" :readonly="fechado" class="q-mb-md" outlined
                    :options="[{ label: 'Sim', value: true }, { label: 'Não', value: false }]"
                    label="O Cliente confirmou a presença?" />
                </div>
              </div>
            </div>
            <div v-if="!fechado && !form.confirmado" class="row">
              <div v-if="ajustes.whatsAppMensagemConfirmacao" class="col-xs-12">
                <q-btn color="positive" @click="confirmarWhatsApp">
                  <img style="width:1.8em;margin-right:0.4em" src="../../assets/imagens/whatsapp.svg"> Confirmar pelo
                  WhatsApp
                </q-btn>
              </div>
            </div>
            <div v-if="form.confirmado ? form.confirmado.value == false : false">
              <div class="row">
                <div class="col-xs-12">
                  <q-input ref="motivoNaoConfirmado" v-model="form.motivoNaoConfirmado" outlined label="Motivo"
                    :readonly="fechado" type="textarea" counter rows="2" maxlength="1000"
                    :rules="[val => !!val || 'Esse campo é obrigatório']" class="q-pb-md q-mb-md" />
                </div>
              </div>

              <div class="row">
                <div class="col-xs-12">
                  <q-select ref="reagendar" v-model="form.reagendar" :readonly="fechado" outlined
                    :rules="[val => !!val || 'Esse campo é obrigatório']"
                    :options="[{ label: 'Sim', value: true }, { label: 'Não', value: false }]"
                    label="Deseja Reagendar?" />
                </div>
              </div>

              <div v-if="form.reagendar ? form.reagendar.value == true : false">
                <div class="row q-col-gutter-md">
                  <div class="col-xs-12 col-sm-7">
                    <q-input ref="dataReagendamento" v-model="form.dataReagendamento" outlined :readonly="fechado"
                      label="Data" placeholder="DD/MM/AAAA" class="q-mb-sm" :loading="verificandoDataUnidade"
                      mask="##/##/####" :rules="[val => !!val || 'A data é obrigatório',
                      val => validaData(val) || 'Data inválida',
                      val => dataValidaReagendamento || 'Data fora do horário de funcionamento']"
                      @blur="podeAgendarUnidade('REAGENDAMENTO')">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date v-model="form.dataReagendamento" mask="DD/MM/YYYY"
                              @input="() => $refs.qDateProxy.hide()" />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-xs-12 col-sm-5">
                    <q-input ref="horaReagendamento" v-model="form.horaReagendamento" outlined :readonly="fechado"
                      class="q-mb-sm" label="Hora" placeholder="HH:MM" mask="##:##" :rules="[val => !!val || 'A data é obrigatório',
                      val => validaHora(val) || 'Hora inválida',
                      val => dataValidaReagendamento || 'Hora fora do horário de funcionamento']"
                      @blur="podeAgendarUnidade('REAGENDAMENTO')">
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy transition-show="scale" transition-hide="scale">
                            <q-time v-model="form.horaReagendamento" mask="HH:mm" format24h />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <app-cadastro-fechado v-if="fechado" :form="form" :comissoes="comissoes" />

        </div>
      </div>

      <q-separator class="q-mt-md"></q-separator>

      <div v-if="!fechado" class="row q-mt-md">

        <div class="col-xs-12">
          <q-btn v-if="editar" type="button" label="Excluir" flat :loading="excluindo" color="negative" icon="delete"
            @click="excluir" />

          <q-btn type="submit" :disable="salvando ||
          verificandoAgenda ||
          verificandoDataUnidade ||
          verificandoDataReagendamento" :loading="salvando" label="salvar" color="primary" class="float-right"
            icon="check" />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import {
  QForm, QInput, QIcon, QBtn, QSeparator, QSelect, QDate, QPopupProxy, QTime,
} from 'quasar'
import {
  formatDateSql, capitalizeTitle, formatSqlDate, validaHora, validaData, formatDateTimeSql,
} from '../../util/util'
import { retornaTodasUnidades, podeAgendar } from '../../services/unidade'
import {
  put, post, excluir, existeAgenda, podeConfirmar,
} from '../../services/venda-agenda'
import AppCadastroFechado from './cadastro/fechado.vue'
import AppCadastroObservacao from './cadastro/observacao.vue'
import AppBtnReagendar from './reagendar/btn.vue'
import AppCabecalhoForm from '../../components/cabecalho-form/main.vue'

export default {

  components: {
    AppCadastroFechado,
    AppCadastroObservacao,
    AppBtnReagendar,
    AppCabecalhoForm,
    QForm,
    QInput,
    QIcon,
    QBtn,
    QSeparator,
    QSelect,
    QDate,
    QPopupProxy,
    QTime,
  },

  props: {
    venda: {
      type: Object,
      required: false,
      default: () => { },
    },
    comissoes: {
      type: Array,
      required: false,
      default: () => [],
    },
    tiposVendas: {
      type: Array,
      required: false,
      default: () => [],
    },
    data: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      editar: false,
      unidades: [],
      salvando: false,
      excluindo: false,
      fechado: false,
      unidade: '',
      verificandoAgenda: false,
      nomeValido: true,
      podeConfirmar: false,
      nomeInicial: '',
      dataInicial: '',
      telefoneInicial: '',
      verificandoDataUnidade: false,
      dataUnidadeValida: true,
      verificandoDataReagendamento: false,
      dataValidaReagendamento: true,
      exibeSelectTipo: true,
      observacoes: [],
      form: {
        id: '00000000-0000-0000-0000-000000000000',
        nome: '',
        telefone: '',
        tipo: '',
        data: '',
        hora: '',
        idUnidade: '',
        observacao: '',

        nomeTipo: '',
        nomeVendaComissao: '',

        confirmado: null,
        motivoNaoConfirmado: '',
        reagendar: null,
        dataReagendamento: '',
        horaReagendamento: '',

        contratoFechado: false,
        compareceu: false,
        gerarFatura: null,
        motivoDesistencia: '',
        nomeUsuarioEncerramento: '',
        dataEncerramento: '',
        vendaComissao: null,
      },
    }
  },

  computed: {
    ...mapState({
      sessao: (state) => state.sessao.user,
      ajustes: (state) => state.aplicacao.ajustes,
    }),
  },

  async mounted() {
    if (this.data !== '' && this.data !== null && !this.venda) {
      this.form.data = this.data
    }

    if (this.venda) {
      this.exibeSelectTipo = false
      this.editar = true
      this.nomeInicial = this.venda.nome
      this.form.id = this.venda.id
      this.form.nome = this.venda.nome
      this.form.telefone = this.venda.telefone
      this.telefoneInicial = this.venda.telefone
      const data = formatDateSql(this.venda.data.split('T')[0])
      const hora = this.venda.data.split('T')[1]
      this.dataInicial = data
      this.form.data = data
      this.form.hora = hora
      const tipoVenda = this.tiposVendas.find((x) => x.id === this.venda.idVendaAgendaTipo)
      this.form.tipo = tipoVenda
      this.form.nomeTipo = this.venda.vendaAgendaTipo
      this.form.nomeVendaComissao = this.venda.nomeVendaComissao

      if (this.venda.confirmado === null) {
        this.verificaSePodeConfirmar(this.venda.id)
      }

      if (this.venda.idUsuarioEncerramento !== null) {
        this.fechado = true
        this.form.contratoFechado = this.venda.contratoFechado
        this.form.compareceu = this.venda.compareceu
        this.form.motivoDesistencia = this.venda.motivoDesistencia
        this.form.nomeUsuarioEncerramento = this.venda.nomeUsuarioEncerramento
        this.form.gerarFatura = this.venda.faturado
        this.form.dataEncerramento = formatDateTimeSql(this.venda.dataEncerramento)

        const vendaComissao = this.venda.idUnidadeVendaComissao != null
          ? this.comissoes.find((x) => x.id === this.venda.idUnidadeVendaComissao)
          : null

        this.form.vendaComissao = vendaComissao
      }

      if (this.venda.confirmado != null) {
        this.podeConfirmar = true
        this.form.confirmado = { label: this.venda.confirmado ? 'Sim' : 'Não', value: this.venda.confirmado }
        this.form.motivoNaoConfirmado = this.venda.motivoNaoConfirmado
        this.form.reagendar = { label: this.venda.dataReagendamento != null ? 'Sim' : 'Não', value: this.venda.dataReagendamento != null }
        if (this.venda.dataReagendamento != null) {
          const dataR = formatDateSql(this.venda.dataReagendamento.split('T')[0])
          const horaR = this.venda.dataReagendamento.split('T')[1]
          this.form.dataReagendamento = dataR
          this.form.horaReagendamento = horaR
        }
      }
    }

    const lista = await retornaTodasUnidades()
    this.unidades = lista
  },

  methods: {
    ...mapActions(['setSession', 'setUnidade']),

    validaData(data) { return validaData(data) },

    validaHora(hora) { return validaHora(hora) },

    mensagem() {
      return this.ajustes.whatsAppMensagemConfirmacao
        .replace('{nome}', this.form.nome)
        .replace('{data}', this.form.data)
        .replace('{hora}', this.form.hora)
    },

    vaiParaWhatsApp() {
      const numero = `55${this.form.telefone.replace(/\D/g, '')}`
      const a = document.createElement('a')
      a.href = `https://api.whatsapp.com/send?phone=${numero}`
      a.target = '_blank'
      a.click()
    },

    confirmarWhatsApp() {
      const numero = `55${this.form.telefone.replace(/\D/g, '')}`
      const a = document.createElement('a')
      const messangem = this.mensagem().replace(/\t/g, '')
      a.href = `https://api.whatsapp.com/send?phone=${numero}&text=${messangem}`
      a.target = '_blank'
      a.click()
    },

    async podeAgendarUnidade(tipo) {
      if (tipo === 'DATA') {
        if ((this.form.data !== '' && this.form.data.length === 10) && (this.form.hora !== '' && this.form.hora.length === 5)) {
          const data = `${formatSqlDate(this.form.data)}T${this.form.hora}`
          this.verificandoDataUnidade = true
          this.dataUnidadeValida = true
          const pode = await podeAgendar(this.sessao.unidadeAtual.id, data)

          this.verificandoDataUnidade = false
          this.dataUnidadeValida = pode
          this.$refs.data.validate()
          this.$refs.hora.validate()
        }
      }

      if (tipo === 'REAGENDAMENTO') {
        if ((this.form.dataReagendamento !== '' && this.form.dataReagendamento.length === 10)
        && (this.form.horaReagendamento !== '' && this.form.horaReagendamento.length === 5)) {
          const data = `${formatSqlDate(this.form.dataReagendamento)}T${this.form.horaReagendamento}`
          this.verificandoDataReagendamento = true
          this.dataValidaReagendamento = true
          const pode = await podeAgendar(this.sessao.unidadeAtual.id, data)

          this.verificandoDataReagendamento = false
          this.dataValidaReagendamento = pode
          this.$refs.dataReagendamento.validate()
          this.$refs.horaReagendamento.validate()
        }
      }
    },

    async validaAgenda() {
      if (this.form.nome !== '' && this.form.telefone !== '') {
        if (this.form.nome !== this.nomeInicial || this.form.telefone !== this.telefoneInicial) {
          this.verificandoAgenda = true
          this.nomeValido = true

          const existe = await existeAgenda(this.form.nome, this.form.telefone)
          this.verificandoAgenda = false
          this.nomeValido = !existe
          this.$refs.nome.validate()
        }
      }
    },

    async verificaSePodeConfirmar(id) {
      const pode = await podeConfirmar(id)
      this.podeConfirmar = pode
    },

    excluir() {
      this.$q.dialog({
        title: 'Excluir',
        message: 'Deseja excluir esse agendamento?',
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
            message: 'Agendando Excluído.',
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

    capitalizeTitle() {
      this.form.nome = capitalizeTitle(this.form.nome)
      this.validaAgenda()
    },

    async submitSalvar() {
      let dataReagendamento = null
      if (this.form.reagendar) {
        if (this.form.reagendar.value === true) {
          dataReagendamento = `${formatSqlDate(this.form.dataReagendamento)} ${this.form.horaReagendamento}`
        }
      }

      const venda = {
        id: this.form.id,
        idUsuario: this.sessao.id,
        idUnidade: this.sessao.unidadeAtual.id,
        telefone: this.form.telefone,
        nome: capitalizeTitle(this.form.nome),
        data: `${formatSqlDate(this.form.data)} ${this.form.hora}`,
        idVendaAgendaTipo: this.form.tipo.id,
        confirmado: this.form.confirmado != null ? this.form.confirmado.value : null,
        motivoNaoConfirmado: this.form.motivoNaoConfirmado,
        dataReagendamento,
        observacao: this.form.observacao,
      }

      this.salvando = true

      if (this.form.id === '00000000-0000-0000-0000-000000000000') {
        const response = await post(venda)
        this.salvando = false
        if (response.success) {
          this.$emit('salvou', response.data.id)
          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Agendamento salvo com sucesso.',
          })
        }
      } else {
        const response = await put(venda)
        this.salvando = false
        if (response.success) {
          this.$emit('salvou', venda.id)
          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Agendamento salvo com sucesso.',
          })
        }
      }
    },
  },
}
</script>
