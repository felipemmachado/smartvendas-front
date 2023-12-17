<template>
  <div>
    <div class="row q-mt-md animated fadeIn fast">
      <div class="col-md-3 col-xs-12"></div>
      <div class="col-md-6 col-xs-12">

        <app-btn-voltar cls="q-ml-md" rota="voce" />

        <div class="text-h5 q-ml-md q-mt-md">
          <q-icon class="text-primary icone-correcao" name="o_palette" />
          Tema
        </div>

        <q-card class="q-pa-md q-ma-md">

          <div class="q-pb-md">
            <p>
              A configuração do Tema escuro será aplicada somente a este dispositivo.
            </p>
            <p>
              O Tema escuro escurece as partes claras da página para
              otimizar a experiência noturna. Confira!
            </p>
          </div>
          <q-select v-model="tema" class="q-pb-md" outlined label="Escolha o seu tema" :options="temaOptios" />
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { QIcon, QCard, QSelect } from 'quasar'
import AppBtnVoltar from '../../../components/btn-voltar/main.vue'

export default {

  components: {
    AppBtnVoltar,
    QIcon,
    QCard,
    QSelect,
  },

  data() {
    return {
      tema: false,
      temaOptios: [{ label: 'Claro', value: false },
        { label: 'Escuro', value: true }],
    }
  },

  watch: {
    tema: {
      handler(val, odlVal) {
        if (val !== odlVal) {
          this.setaTema(val)
        }
      },
    },
  },

  mounted() {
    this.tema = this.$q.dark.isActive ? this.temaOptios[1] : this.temaOptios[0]
  },

  methods: {
    ...mapActions(['setTheme']),

    setaTema(tema) {
      this.setTheme(tema)
    },
  },
}
</script>
