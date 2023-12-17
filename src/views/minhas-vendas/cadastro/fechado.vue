<template>
<div>
  <div class="row">
    <div class="col-xs-12">
      <q-input
                readonly
                :value="form.compareceu ? 'Sim' : 'Não'"
                class="q-pb-md"
                outlined
                label="O Cliente compareceu?" />
    </div>
    <div v-if="ajustes.whatsAppMensagemNaoCompareceu && !form.compareceu"
          class="col-xs-12">
      <q-btn color="positive" @click="enviarWhatsApp">
        <img style="width:1.8em;margin-right:0.4em"
        src="../../../assets/imagens/whatsapp.svg"> Verificar pelo WhatsApp
      </q-btn>
    </div>
  </div>

  <div v-if="form.compareceu">
    <div class="row" >
      <div class="col-xs-12">
        <q-input :value="form.contratoFechado ? 'Sim' : 'Não'"
                  readonly
                  outlined
                  class="q-pb-md"
                  label="O Cliente fechou o contrato?" />
      </div>
    </div>

    <div v-if="!form.contratoFechado" class="row">
      <div class="col-xs-12">
        <q-input :value="form.motivoDesistencia"
                readonly
                outlined
                label="Motivo da Desistência"
                type="textarea"
                class="q-pb-md" />
      </div>
    </div>

    <div v-if="form.contratoFechado">
      <div class="row" >
        <div class="col-xs-12">
          <q-input v-model="form.nomeVendaComissao"
                    readonly
                    outlined
                    class="q-pb-md"
                  label="O que o cliente fechou?" />
        </div>
      </div>

    <div class="row" >
      <div class="col-xs-12">
        <q-input :value="form.gerarFatura ? 'Sim' : 'Não'"
                  readonly
                  outlined
                  class="q-pb-md"
                  label="Gerar comissão para o consultor?" />
      </div>
    </div>
    </div>
  </div>

  <div class="row">
    <div class="col-xs-12 col-md-8">
      <q-input :value="form.nomeUsuarioEncerramento"
              label="Encerrado por"
              readonly
              outlined
              :class="{'q-mr-md': !$q.platform.is.mobile}"
              class="q-pb-lg "
              type="text" />
    </div>
    <div class="col-xs-12 col-md-4">
      <q-input :value="form.dataEncerramento"
              label="Encerrado em"
              readonly
              outlined
              class="q-pb-md" />
    </div>
  </div>

  <div class="row">
    <div class="col-xs-12 text-primary">
      <q-icon name="info"/> Essa venda já foi encerrada, você não pode alterar mais nenhum dado.
    </div>
  </div>
</div>
</template>

<script>

import { QIcon, QBtn, QInput } from 'quasar'
import { mapState } from 'vuex'

export default {

  components: {
    QIcon,
    QBtn,
    QInput,
  },
  props: {
    form: {
      type: Object,
      required: true,
      default: () => {},
    },
    comissoes: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  computed: {
    ...mapState({
      ajustes: (state) => state.aplicacao.ajustes,
    }),
  },

  methods: {
    mensagem() {
      return this.ajustes.whatsAppMensagemNaoCompareceu
        .replace('{nome}', this.form.nome)
        .replace('{data}', this.form.data)
        .replace('{hora}', this.form.hora)
    },

    enviarWhatsApp() {
      const numero = `55${this.form.telefone.replace(/\D/g, '')}`
      const a = document.createElement('a')
      const messangem = this.mensagem().replace(/\t/g, '')
      a.href = `https://api.whatsapp.com/send?phone=${numero}&text=${messangem}`
      a.target = '_blank'
      a.click()
    },
  },
}
</script>
