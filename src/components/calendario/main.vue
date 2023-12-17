<template>
<div style="widht:100%">
  <div class="text-center">
    <q-btn class="float-left"
    rounded dense flat icon="keyboard_arrow_left" @click="mesAcao('-')" />
    <span v-if="!loading" style="line-height: 2.4em">
      {{nomeMes}} {{ano}}
      <q-btn v-if="btnUpdate"
              rounded
              flat
              dense
              icon="refresh"
              @click="$emit('update-press', mes, ano)">
        <q-tooltip>
          Atualizar Lista
        </q-tooltip>
      </q-btn>
    </span>

    <span v-if="loading" style="line-height: 2.4em">
      <q-spinner /> Carregando...
    </span>

    <q-btn class="float-right"
    rounded dense flat icon="keyboard_arrow_right" @click="mesAcao('+')" />
  </div>

  <table class="table-agenda" style="width: 100%">
    <thead>
      <tr>
        <td v-for="i in 7"
            :key="i" style="width: 14.2857%"
            class="text-grey text-center">
            <small>{{diasSemana[i - 1]}}</small>
        </td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(s, idxS) in matrixMes" :key="idxS">
        <td v-for="(d, idxD) in s"
            :key="idxD" @click="!d.disable ? markDate(idxS, idxD): ''">
          <q-btn
            v-if="d.show"
            rounded
            :color=" d.check ? 'primary' : ''"
            style="width: 100%"
            dense
            :disable="d.disable"
            :class="{
              'hoje' : d.hoje && !$q.dark.isActive,
              'hoje-dark' : d.hoje && $q.dark.isActive
            }"
            :flat="!d.check" @click="markDate(idxS, idxD)">
            <div>{{d.dia}}</div>
            <div class="data-evento" :class="'bg-' + d.color"></div>
          </q-btn>
        </td>
      </tr>
    </tbody>
  </table>

  <div class="text-left q-mb-md">
    <slot></slot>
  </div>

  <q-btn v-if="mes != mesAtual || ano != anoAtual"
        label="Mes Atual"
        color="primary"
        outline
        style="width: 100%"
        icon="today"
        @click="clickMesAtual()" />
</div>
</template>

<script>
import {
  QBtn,
  QTooltip,
  QSpinner,
} from 'quasar'
import { mesNome } from '../../util/util'

export default {

  components: {
    QBtn,
    QTooltip,
    QSpinner,
  },

  props: {
    color: {
      type: Function,
    },
    disabled: {
      type: Function,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    btnUpdate: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      mes: 0,
      ano: 0,
      diasSemana: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      matrixMes: [],
      mesAtual: 0,
      anoAtual: 0,
      diaAtual: 0,
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
    this.mesAtual = dNow.getMonth() + 1
    this.anoAtual = dNow.getFullYear()
    this.diaAtual = dNow.getDate()
    this.criaMes(this.mesAtual, this.anoAtual)
  },
  methods: {
    clickMesAtual() {
      this.$emit('current-date', this.mesAtual, this.anoAtual)
      this.criaMes(this.mesAtual, this.anoAtual)
    },
    markDate(i, j) {
      this.limpaCheck()
      this.matrixMes[i][j].check = true
      this.$emit('input', this.geraData(this.matrixMes[i][j].dia, this.mes, this.ano), 'day', this.geraDetalhe())
      this.$forceUpdate()
    },
    limpaCheck() {
      this.matrixMes.forEach((semana, i) => {
        semana.forEach((dia, j) => {
          this.matrixMes[i][j].check = false
        })
      })
      this.$forceUpdate()
    },
    mesAcao(valor) {
      if (valor === '+') {
        if (this.mes + 1 === 13) {
          this.mes = 1
          this.ano += 1
        } else {
          this.mes += 1
        }
      }

      if (valor === '-') {
        if (this.mes - 1 === 0) {
          this.mes = 12
          this.ano -= 1
        } else {
          this.mes -= 1
        }
      }

      this.$emit('input', this.mes, 'month', this.geraDetalhe())

      this.criaMes(this.mes, this.ano)
    },
    geraDetalhe() {
      return {
        month: this.mes,
        year: this.ano,
      }
    },

    geraData(dia, mes, ano) {
      return `${dia < 10 ? '0' : ''}${dia}/${mes < 10 ? '0' : ''}${mes}/${ano}`
    },

    hoje(dia, mes, ano) {
      return dia === this.diaAtual && mes === this.mesAtual && ano === this.anoAtual
    },

    criaMes(mes, ano) {
      this.mes = mes
      this.ano = ano
      const firstDay = (new Date(ano, mes - 1)).getDay()
      const daysInMonth = 32 - new Date(ano, mes - 1, 32).getDate()

      let dia = 1
      for (let i = 0; i < 6; i += 1) {
        for (let j = 0; j < 7; j += 1) {
          if (j === 0) this.matrixMes[i] = []
          if (i === 0 && j < firstDay) {
            const obj = {
              dia: '',
              check: false,
              show: false,
              hoje: false,
              disable: false,
            }
            this.matrixMes[i][j] = obj
          } else if (dia > daysInMonth) {
            break
          } else {
            const obj = {
              dia,
              check: false,
              show: true,
              hoje: this.hoje(dia, mes, ano),
              color: this.color(this.geraData(dia, mes, ano)),
              disable: this.disabled(this.geraData(dia, mes, ano)),
            }
            this.matrixMes[i][j] = obj
            dia += 1
          }
        }
      }
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../styles/quasar.variables.scss';

.table-agenda {
  .data-evento {
    position: absolute;
    bottom: 2px;
    height: 5px;
    width: 8px;
    border-radius: 5px;
  }
  tbody  tr  td {
    margin-top: 0.5em;
    margin-bottom: 0.5em;

    .hoje {
      border: 1px solid #CCC;
    }

    .hoje-dark {
      border: 1px solid #333;
    }
  }
}
</style>
