<template>
<div class="q-mt-md">
  <div style="width: 60%; float:left">
    <q-input dense input-class="text-center" readonly :value="nomeMes">
      <template v-slot:prepend>
        <q-btn rounded dense flat icon="keyboard_arrow_left" @click="mesAcao('-')" />
      </template>
      <template v-slot:append>
        <q-btn rounded dense flat icon="keyboard_arrow_right" @click="mesAcao('+')" />
      </template>
    </q-input>
  </div>
  <div style="width: 40%; float:left">
    <q-input dense input-class="text-center" readonly :value="ano">
      <template v-slot:prepend>
        <q-btn rounded dense flat icon="keyboard_arrow_left" @click="anoAcao('-')" />
      </template>
      <template v-slot:append>
        <q-btn rounded dense flat icon="keyboard_arrow_right" @click="anoAcao('+')" />
      </template>
    </q-input>
  </div>
</div>
</template>

<script>

import { QInput, QBtn } from 'quasar'

import { mesNome } from '../../util/util'

export default {

  components: {
    QInput, QBtn,
  },

  data() {
    return {
      mes: 0,
      ano: 0,
    }
  },

  computed: {
    nomeMes() {
      if (this.mes === 0) return ''
      return mesNome(this.mes)
    },
  },

  mounted() {
    const dNow = new Date()
    this.mes = dNow.getMonth() + 1
    this.ano = dNow.getFullYear()
    this.$emit('mudou', { mes: this.mes, ano: this.ano })
  },

  methods: {
    mesAcao(acao) {
      if (acao === '+') {
        const proximoMes = this.mes + 1
        if (proximoMes === 13) {
          this.mes = 1
          this.ano += 1
        } else {
          this.mes = proximoMes
        }
      }

      if (acao === '-') {
        const mesAnterior = this.mes - 1
        if (mesAnterior === 0) {
          this.mes = 12
          this.ano -= 1
        } else {
          this.mes = mesAnterior
        }
      }

      this.$emit('mudou', { mes: this.mes, ano: this.ano })
    },

    anoAcao(acao) {
      if (acao === '+') {
        this.ano += 1
      }

      if (acao === '-') {
        this.ano -= 1
      }

      this.$emit('mudou', { mes: this.mes, ano: this.ano })
    },
  },
}
</script>

<style lang="scss">
.mes-ano-nome {
  width: 4.6em;
  margin-left: 0.5em;
  margin-right:0.5em;
}
</style>
