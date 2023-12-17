<template>
  <q-card :flat="!$q.dark.isActive" :bordered="!$q.dark.isActive" class="animated fadeIn">
    <q-card-section>
      <div class="row">
        <div class="col-xs-8 text-left" >
          <div class="text-h4 title" :class="textColor()">{{inicio}}</div>
          <small :class="textColor()" v-html="texto"></small>
        </div>
        <div class="col-xs-4 text-right">
          <q-avatar size="3.4em"
                    :text-color="color()"
                    :style="{ 'background-color' : $q.dark.isActive ? '#222': '#EEE' }"
                    :icon="icone" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>

import { QCard, QCardSection, QAvatar } from 'quasar'

export default {

  components: {
    QCard, QCardSection, QAvatar,
  },

  props: {
    valor: {
      type: Number,
      default: 0,
    },
    texto: {
      type: String,
      default: '',
    },
    icone: {
      type: String,
      default: '',
    },
    cor: {
      type: String,
      default: '',
    },
    exibeSeta: {
      type: Boolean,
      default: false,
      require: false,
    },
  },

  data() {
    return {
      inicio: 0,
    }
  },

  watch: {
    valor: {
      handler(val, odlVal) {
        if (val !== odlVal) {
          if (val !== 0) {
            this.inicio = 0
            this.exibeValor(this.inicio, val, this.retornaIncremento(val))
          }
        }
      },
    },
  },

  mounted() {
    this.inicio = 0
    this.exibeValor(this.inicio, this.valor, this.retornaIncremento(this.valor))
  },

  methods: {
    classes() {
      const t = []
      if (this.exibeSeta) {
        t.push('q-px-md')
        t.push('q-pt-md')
        t.push('q-pt-lg')
      } else {
        t.push('q-px-md')
        t.push('q-pb-lg')
        t.push('q-pt-lg')
      }

      return t
    },

    color() {
      return this.$q.dark.isActive ? `${this.cor}-4` : this.cor
    },

    exibeValor(incio, valor, incremento) {
      if (incio < valor) {
        this.inicio += incremento

        setTimeout(() => {
          this.exibeValor(this.inicio, valor, incremento)
        }, 1)
      } else {
        this.inicio = valor
      }
    },

    textColor() {
      return this.$q.dark.isActive ? `text-${this.cor}-4` : `text-${this.cor}`
    },

    retornaIncremento(val) {
      if (val > 10000) return 100
      if (val > 1000) return 10
      if (val > 500) return 5
      if (val > 100) return 2
      return 1
    },
  },
}
</script>

<style lang="scss">
.title {
  line-height: 2rem;
  // margin-top: -.1em;
  margin-bottom: -.2em;
}
</style>
