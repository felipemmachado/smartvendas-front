<template>
<div class="row">
  <div class="col-xs-12 animated fadeIn fast q-pa-md">
    <app-btn-voltar label="Ajustes" cls="q-mb-md q-mt-md" rota="ajustes" />
    <div class="text-h5 q-mb-md" >
      <q-icon class="text-primary icone-correcao" name="tune" />
      Configurações Gerais
    </div>

    <app-skeleton v-if="carregando" />
    <q-card v-if="!carregando">
      <q-card-section>
        <q-form @submit="atualizaAjustes">
          <div class="logo-box q-mt-md">
            <img v-if="urlLogo" class="img" :src="urlLogo" />
            <div v-if="!urlLogo" class="no-foto">
              <q-icon name="image" class="icon" />
            </div>
          </div>

          <q-input v-model="form.nome"
                  outlined
                  label="Nome da Empresa"
                  :rules="[val => !!val || 'O nome da empresa é obrigatório']"
                  class="q-pb-md q-mt-md"
                  type="text" />

          <q-input v-model="form.vendaMinimaCoordenador"
                  outlined
                  label="Venda mínima para gerar comissão para o coordenador"
                  :rules="[val => !!val || 'A venda mínima é obrigatório']"
                  class="q-pb-md q-mt-lg"
                  type="number" />

          <app-whats-app-editor
            class="q-mt-lg"
            label="Mensagem de confirmação (WhatsApp)"
            :value="form.whatsAppMensagemConfirmacao"
            @input="(val) => form.whatsAppMensagemConfirmacao = val" />

          <app-whats-app-editor
            class="q-mt-xl"
            label="Mensagem quando cliente não comparece (WhatsApp)"
            :value="form.whatsAppMensagemNaoCompareceu"
            @input="(val) => form.whatsAppMensagemNaoCompareceu = val" />

          <div class="row q-mt-md">
            <div class="col-xs-12">
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
      </q-card-section>
    </q-card>
  </div>
  <app-modal-crop :exibe="exibeCroop"
    @fechar="exibeCroop = false"
    @base64="(logo) => { urlLogo = logo; form.logoBase64 = logo }" />
</div>
</template>

<script>
import { mapActions } from 'vuex'
import {
  QIcon, QCard, QCardSection, QBtn, QForm, QInput,
} from 'quasar'
import { retornaAjustes, atualizaAjustes } from '../../../services/cliente-aplicacao'
import AppModalCrop from './modal-crop.vue'
import AppWhatsAppEditor from '../../../components/whats-app-editor/main.vue'
import AppBtnVoltar from '../../../components/btn-voltar/main.vue'
import AppSkeleton from './skeleton.vue'

export default {

  components: {
    AppModalCrop,
    AppSkeleton,
    AppWhatsAppEditor,
    AppBtnVoltar,
    QIcon,
    QCard,
    QCardSection,
    QBtn,
    QForm,
    QInput,
  },

  data() {
    return {
      salvando: false,
      carregando: true,
      urlLogo: null,
      exibeCroop: false,
      form: {
        id: null,
        whatsAppMensagemConfirmacao: null,
        whatsAppMensagemNaoCompareceu: null,
        vendaMinimaCoordenador: 0,
        nome: null,
        logoBase64: null,
      },
    }
  },

  async mounted() {
    const clienteAplcacao = await retornaAjustes()
    this.carregando = false
    this.$nextTick(() => {
      this.form.whatsAppMensagemConfirmacao = clienteAplcacao.whatsAppMensagemConfirmacao
      this.form.whatsAppMensagemNaoCompareceu = clienteAplcacao.whatsAppMensagemNaoCompareceu
      this.form.nome = clienteAplcacao.nome
      this.urlLogo = clienteAplcacao.logo
      this.form.id = clienteAplcacao.id
      this.form.vendaMinimaCoordenador = clienteAplcacao.vendaMinimaCoordenador
    })
  },

  methods: {
    ...mapActions(['setAjustes']),

    clickAddImagem() {
      this.exibeCroop = true
    },

    async atualizaAjustes() {
      this.salvando = true
      await atualizaAjustes(this.form)
      this.salvando = false
      this.$q.notify({
        type: 'positive',
        position: 'top',
        message: 'Ajustes atualizado.',
      })

      const clienteAplicacao = await retornaAjustes()
      this.setAjustes(clienteAplicacao)
    },
  },
}
</script>

<style lang="scss">

.logo-box {

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  .img {
    width: 220px;
    margin: .2em;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid #DDD;
  }

  .no-foto {
    width: 220px;
    height: 80px;
    background:#777;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    cursor: pointer;

    .icon {
      flex: 1;
      color: #FFF;
      font-size: 2.3em;
    }
  }
}

</style>
